import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import Schema from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'
import {
  AGENTS,
  attemptSourceAccess,
  confirmDirection,
  createScenario,
  grantSources,
  publishScenario,
  revokeSourceAndRollback,
  runAgentTeam,
  validateClaim,
} from './domain.js'

export const name = 'personaproof-harness-adapter'
export const inject = ['tools', 'systemPrompt']

export const Config = Schema.object({
  caseRoot: Schema.string().default('../..'),
  agentTeamsManifest: Schema.string().default('../../agentteams/persona-team.yaml'),
  maximumScenarios: Schema.number().min(1).max(5).default(5),
})

const CORE_GUIDANCE = `你是运行在 DeepSeek Harness 中的“人设有据 PersonaProof”个人品牌 Agent。你的任务不是替用户编造人设，而是以简历、访谈和身份线索为起点，在用户逐项授权后主动检索 GitHub、公开网络、作品站、媒体与公司官网/官方账号，寻找作品、经历和第三方证明，再挖掘真实优势、形成可被记住的定位，并调度 AgentTeams 完成内容、视觉、主站、审核与发布。核心事实只有一份，求职、创作、合作、社交等场景可以有不同表达版本。未通过 G1 不确定宣传方向；未通过 G2 不访问或检索任何外部个人资料；同名结果不自动归属；未通过 G3 不公开发布。所有表达必须标记为事实、推断或包装建议。用户可查看、更正、暂停、撤回授权、删除记忆和回滚发布。公司官方证据可用于内部核验，公司名称默认不对外公开。`

function output(value) {
  return [{ type: 'text', text: value }]
}

export function apply(ctx, config) {
  const caseRoot = resolve(process.cwd(), config.caseRoot)
  const manifestPath = resolve(process.cwd(), config.agentTeamsManifest)

  ctx.systemPrompt.section({ name: 'personaproof:persona', order: 40, text: CORE_GUIDANCE })

  ctx.tools.register(defineTool({
    name: 'personaproof_list_agents',
    description: '读取 PersonaProof 的 8 个 Agent Identity，并核对 AgentTeams 声明是否存在。',
    parameters: {},
    output: { schema: { type: 'string' }, render: (_args, value) => output(value) },
    async execute() {
      let manifest = ''
      try { manifest = await readFile(manifestPath, 'utf8') } catch {}
      return JSON.stringify({ agents: AGENTS, manifestPath, manifestAvailable: manifest.includes('kind: Worker') && manifest.includes('kind: Team') }, null, 2)
    },
  }))

  ctx.tools.register(defineTool({
    name: 'personaproof_check_source_access',
    description: '在访问或主动检索简历、GitHub、公开网络、公司官网/官方账号、主页、分享材料或其他个人数据前执行 G2 授权检查；未授权时必须拒绝。',
    parameters: {
      scenarioJson: { type: 'string', required: true, description: '当前场景 JSON。' },
      sourceId: { type: 'string', required: true, description: '要访问的数据源 ID。' },
    },
    output: { schema: { type: 'string' }, render: (_args, value) => output(value) },
    async execute({ scenarioJson, sourceId }) {
      return JSON.stringify(attemptSourceAccess(JSON.parse(scenarioJson), sourceId), null, 2)
    },
  }))

  ctx.tools.register(defineTool({
    name: 'personaproof_apply_gate',
    description: '应用 G1 定位确认、G2 数据源授权、G3 发布确认或授权撤回，并返回可审计的新状态。',
    parameters: {
      action: { type: 'string', required: true, description: 'confirm-direction / grant-sources / publish / revoke-source' },
      scenarioJson: { type: 'string', required: true, description: '当前场景 JSON。' },
      payloadJson: { type: 'string', required: true, description: '动作参数 JSON；无参数时传入 {}。' },
    },
    output: { schema: { type: 'string' }, render: (_args, value) => output(value) },
    async execute({ action, scenarioJson, payloadJson = '{}' }) {
      const scenario = JSON.parse(scenarioJson)
      const payload = JSON.parse(payloadJson)
      const next = action === 'confirm-direction'
        ? confirmDirection(scenario, payload.positioningId)
        : action === 'grant-sources'
          ? grantSources(scenario, payload.sourceIds || [])
          : action === 'publish'
            ? publishScenario(scenario)
            : action === 'revoke-source'
              ? revokeSourceAndRollback(scenario, payload.sourceId)
              : null
      if (!next) throw new Error(`未知 gate action: ${action}`)
      return JSON.stringify(next, null, 2)
    },
  }))

  ctx.tools.register(defineTool({
    name: 'personaproof_run_team',
    description: '按 PersonaProof 项目 DAG 运行 AgentTeams 闭环，返回 Worker 状态、Claim–Evidence 结果和 task/result/accept/reject Trace。',
    parameters: {
      scenarioJson: { type: 'string', required: true, description: '已通过 G1/G2 的场景 JSON。' },
      mode: { type: 'string', required: true, description: '当前仅接受 offline-demo；真实集群适配器未配置时必须失败关闭。' },
    },
    output: { schema: { type: 'string' }, render: (_args, value) => output(value) },
    async execute({ scenarioJson, mode = 'offline-demo' }) {
      if (mode !== 'offline-demo') {
        throw new Error('AGENTTEAMS_RUNTIME_NOT_CONFIGURED: 当前环境只启用可复现的 AgentTeams 合同重放，不能冒充真实集群调用。')
      }
      const scenario = runAgentTeam(JSON.parse(scenarioJson))
      return JSON.stringify({ mode, contract: 'AgentTeams-compatible deterministic replay', caseRoot, scenario }, null, 2)
    },
  }))

  ctx.tools.register(defineTool({
    name: 'personaproof_validate_claim',
    description: '验证公开表达是否遵守事实/推断/包装边界，事实主张必须绑定证据。',
    parameters: {
      claimJson: { type: 'string', required: true, description: 'Claim JSON。' },
    },
    output: { schema: { type: 'string' }, render: (_args, value) => output(value) },
    async execute({ claimJson }) {
      return JSON.stringify(validateClaim(JSON.parse(claimJson)), null, 2)
    },
  }))

  ctx.tools.register(defineTool({
    name: 'personaproof_create_scenario',
    description: '在同一真实主档案下创建求职、创作、合作或社交场景版本；只改变表达，不改变事实。',
    parameters: {
      id: { type: 'string', required: true },
      name: { type: 'string', required: true },
      audience: { type: 'string', required: true },
      goal: { type: 'string', required: true },
    },
    output: { schema: { type: 'string' }, render: (_args, value) => output(value) },
    async execute(args) {
      return JSON.stringify(createScenario(args), null, 2)
    },
  }))
}
