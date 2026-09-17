const MAX_SCENARIOS = 5

export const AGENTS = Object.freeze([
  { id: 'discovery-interview', name: '洞察与访谈', short: '洞察', skill: 'persona-interview' },
  { id: 'evidence-consent', name: '授权检索与证据', short: '证据', skill: 'consent-evidence-ledger' },
  { id: 'brand-strategist', name: '品牌策略', short: '策略', skill: 'brand-positioning', leader: true },
  { id: 'content-architect', name: '内容与信息架构', short: '内容', skill: 'content-architecture' },
  { id: 'visual-designer', name: '视觉设计', short: '视觉', skill: 'visual-direction' },
  { id: 'frontend-builder', name: '前端实现', short: '前端', skill: 'personal-homepage-skill' },
  { id: 'qa-compliance', name: 'QA / 合规审核', short: '审核', skill: 'qa-release-governance' },
  { id: 'delivery-publisher', name: '交付发布', short: '发布', skill: 'release-rollback' },
])

export const POSITIONING_OPTIONS = Object.freeze([
  {
    id: 'scene-translator',
    title: 'AI 场景翻译官 / 开源产品人',
    fit: 96,
    reason: '兼顾传统行业经历、AI 产品落地、开源作品与内容传播，是最容易形成记忆点且证据最完整的方向。',
    audience: '招聘方、AI 团队、开源协作者与内容合作方',
  },
  {
    id: 'ai-product-operator',
    title: '懂增长的 AI 产品运营',
    fit: 84,
    reason: '与当前求职目标直接，但会弱化开源作者和独立创造者的独特性。',
    audience: 'AI 产品与运营岗位招聘方',
  },
  {
    id: 'vibe-builder',
    title: '非科班 AI 应用建造者',
    fit: 78,
    reason: '故事性强，但若作为唯一定位，容易让评委误解为只会做页面或 Demo。',
    audience: 'AI 创作者社区、课程与分享活动',
  },
])

export const SOURCE_CATALOG = Object.freeze([
  { id: 'resume', name: '最新版简历', mode: '用户提供起点 · 本地解析', purpose: '建立身份锚点、洞察经历与核对时间线', required: true, discovery: false, disclosure: 'private' },
  { id: 'github', name: 'GitHub / powerycy', mode: '指定账号 · 公开只读 · 可撤回', purpose: '主动核验开源作品、提交和项目数据', discovery: true, disclosure: 'public' },
  { id: 'public-web', name: '公开网络检索', mode: '姓名 / 别名检索 · 归属待本人确认', purpose: '主动发现作品、采访、演讲、内容和第三方证明', discovery: true, disclosure: 'review-before-public' },
  { id: 'company-official', name: '公司官网与官方账号', mode: '官方渠道主动检索 · 对外脱敏', purpose: '核验履历、项目案例、活动报道和业务成果', discovery: true, disclosure: 'internal-only' },
  { id: 'homepage-demo', name: '个人主页 Demo', mode: '用户指定目录 · 只读', purpose: '复用已授权的视觉与作品效果', discovery: false, disclosure: 'public' },
  { id: 'talk-materials', name: '7.18 线下分享材料', mode: '用户授权文件 · 只读', purpose: '核验观点、内容能力与公开表达', discovery: false, disclosure: 'public' },
])

const EVIDENCE_CATALOG = Object.freeze({
  resume: { id: 'e_resume_industry', title: '行业经历与时间线', origin: '用户提供', summary: '从本地简历中提取，不公开原文。' },
  github: { id: 'e_github_projects', title: '开源项目与持续贡献', origin: 'Agent 主动核验', summary: '核验用户确认归属的 GitHub 公开账号。' },
  'public-web': { id: 'e_public_web_mentions', title: '公开作品、演讲与第三方提及', origin: 'Agent 主动发现', summary: '按姓名与别名检索；同名结果等待本人确认。' },
  'company-official': { id: 'e_company_official_case', title: '官方渠道的履历与项目佐证', origin: 'Agent 主动发现', summary: '仅用于内部事实核验；公司名称对外隐藏。' },
  'homepage-demo': { id: 'e_homepage_visual', title: '用户授权的主页视觉', origin: '用户指定', summary: '仅复用授权的作品与视觉资产。' },
  'talk-materials': { id: 'e_talk_translation', title: '线下分享与公开表达', origin: '用户提供', summary: '用于核验观点、内容能力与表达风格。' },
})

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function trace(event, agentId, message, meta = {}) {
  return {
    id: `trace_${event}_${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    event,
    agentId,
    message,
    ...meta,
  }
}

export function createScenario({ id, name, audience, goal }) {
  return {
    id,
    name,
    audience,
    goal,
    status: 'draft',
    selectedPositioningId: null,
    gates: { G1: 'pending', G2: 'locked', G3: 'locked' },
    grants: [],
    evidence: [],
    claims: [],
    releases: [],
    messages: [],
    agentRuns: AGENTS.map(agent => ({ ...agent, status: 'idle' })),
    trace: [],
  }
}

export function createEmptyWorkspace() {
  return {
    version: 2,
    profile: null,
    scenarios: [],
    activeScenarioId: null,
    view: 'workbench',
    overlay: null,
    notice: null,
  }
}

export function addScenario(workspace, input) {
  if (workspace.scenarios.length >= MAX_SCENARIOS) throw new Error('最多创建 5 个场景版本')
  if (workspace.scenarios.some(item => item.id === input.id)) throw new Error('场景 ID 已存在')
  const scenario = createScenario(input)
  return { ...workspace, scenarios: [...workspace.scenarios, scenario], activeScenarioId: scenario.id }
}

export function confirmDirection(scenario, positioningId) {
  const option = POSITIONING_OPTIONS.find(item => item.id === positioningId)
  if (!option) throw new Error('未知定位方向')
  return {
    ...scenario,
    selectedPositioningId: option.id,
    status: 'direction-confirmed',
    gates: { ...scenario.gates, G1: 'approved', G2: 'pending' },
    trace: [...scenario.trace, trace('human.approved', 'brand-strategist', `用户确认定位：${option.title}`, { gate: 'G1' })],
  }
}

export function attemptSourceAccess(scenario, sourceId) {
  const grant = scenario.grants.find(item => item.sourceId === sourceId && item.status === 'active')
  if (!grant) {
    return {
      allowed: false,
      scenario: {
        ...scenario,
        trace: [...scenario.trace, trace('tool.denied', 'evidence-consent', `${sourceId} 未授权，工具调用已拒绝`, { sourceId, gate: 'G2' })],
      },
    }
  }
  return {
    allowed: true,
    scenario: {
      ...scenario,
      trace: [...scenario.trace, trace('tool.allowed', 'evidence-consent', `${sourceId} 只读访问已放行`, { sourceId, gate: 'G2' })],
    },
  }
}

export function grantSources(scenario, sourceIds) {
  if (scenario.gates.G1 !== 'approved') throw new Error('必须先通过 G1 定位确认')
  const valid = [...new Set(sourceIds)].filter(id => SOURCE_CATALOG.some(source => source.id === id))
  if (!valid.length) throw new Error('至少授权一个数据源')
  const now = new Date().toISOString()
  const grants = valid.map(sourceId => ({
    id: `grant_${sourceId}`,
    sourceId,
    status: 'active',
    access: 'read-only',
    purpose: SOURCE_CATALOG.find(item => item.id === sourceId)?.purpose,
    disclosure: SOURCE_CATALOG.find(item => item.id === sourceId)?.disclosure,
    grantedAt: now,
    expiresAt: '2026-09-14T23:59:59+08:00',
  }))
  return {
    ...scenario,
    status: 'sources-authorized',
    grants,
    gates: { ...scenario.gates, G2: 'approved', G3: 'pending' },
    trace: [...scenario.trace, trace('human.approved', 'evidence-consent', `用户授权 ${valid.length} 个只读来源`, { gate: 'G2', sources: valid })],
  }
}

export function validateClaim(claim) {
  const allowedTypes = ['fact', 'inference', 'packaging']
  if (!allowedTypes.includes(claim.type)) return { valid: false, reason: '未知主张类型' }
  if (claim.type === 'fact' && (!claim.evidenceIds || !claim.evidenceIds.length)) return { valid: false, reason: '事实主张必须绑定证据' }
  if (claim.confidence < 0 || claim.confidence > 1) return { valid: false, reason: '置信度越界' }
  return { valid: true }
}

export function runAgentTeam(scenario) {
  if (scenario.gates.G2 !== 'approved') throw new Error('必须先通过 G2 数据源授权')
  const selected = POSITIONING_OPTIONS.find(item => item.id === scenario.selectedPositioningId)
  const activeSourceIds = scenario.grants.filter(item => item.status === 'active').map(item => item.sourceId)
  const evidence = activeSourceIds.map(sourceId => {
    const source = SOURCE_CATALOG.find(item => item.id === sourceId)
    const item = EVIDENCE_CATALOG[sourceId]
    return item ? { ...item, sourceId, disclosure: source?.disclosure || 'private', status: 'verified' } : null
  }).filter(Boolean)
  const evidenceIds = new Set(evidence.map(item => item.id))
  const hasGithubEvidence = evidenceIds.has('e_github_projects')
  const positioningEvidence = ['e_resume_industry', 'e_github_projects', 'e_public_web_mentions', 'e_company_official_case', 'e_talk_translation'].filter(id => evidenceIds.has(id))
  const bridgeEvidence = ['e_resume_industry', 'e_github_projects', 'e_company_official_case', 'e_talk_translation'].filter(id => evidenceIds.has(id))
  const claims = [
    {
      id: 'claim_scene_translator', type: 'inference', status: 'accepted',
      text: 'AI 场景翻译官 / 开源产品人', confidence: 0.92,
      evidenceIds: positioningEvidence,
      explanation: '由用户提供的起点材料、Agent 主动发现的公开证据与官方佐证交叉支持，是经用户确认的品牌定位。',
    },
    {
      id: 'claim_open_source', type: 'fact', status: hasGithubEvidence ? 'accepted' : 'rejected',
      text: '持续公开构建 AI 产品与开源项目', confidence: hasGithubEvidence ? 1 : 0,
      evidenceIds: hasGithubEvidence ? ['e_github_projects'] : [],
      explanation: hasGithubEvidence ? '来自用户授权的 GitHub 公开项目证据。' : '未授权或未核验 GitHub 证据，该事实不进入公开页面。',
    },
    {
      id: 'claim_top_expert', type: 'packaging', status: 'rejected',
      text: '顶尖 AI 产品专家', confidence: 0.28,
      evidenceIds: [],
      explanation: '缺少可验证的行业级比较证据，QA 已退回，不进入公开页面。',
    },
    {
      id: 'claim_bridge', type: 'packaging', status: 'accepted',
      text: '把真实业务问题翻译成能运行、能传播、能迭代的 AI 产品', confidence: 0.86,
      evidenceIds: bridgeEvidence,
      explanation: '是对已核验经历的表达升级；公司官方证据可内部支撑，但公司名称不进入公开文案。',
    },
  ]

  const events = [
    trace('task.accepted', 'discovery-interview', '完成简历洞察与缺口访谈', { taskId: 'T1', skill: 'persona-interview' }),
    trace('task.accepted', 'evidence-consent', '完成授权校验、主动检索与证据索引', { taskId: 'T2', skill: 'consent-evidence-ledger' }),
    ...(activeSourceIds.includes('public-web') ? [trace('search.completed', 'evidence-consent', '已检索公开网络；同名结果标记为待本人确认', { taskId: 'T2-S1', sourceId: 'public-web', mode: 'read-only' })] : []),
    ...(activeSourceIds.includes('company-official') ? [trace('search.completed', 'evidence-consent', '已检索公司官网与官方账号；证据仅内部核验，对外隐藏公司名', { taskId: 'T2-S2', sourceId: 'company-official', mode: 'read-only', disclosure: 'internal-only' })] : []),
    trace('task.accepted', 'brand-strategist', `确认品牌策略：${selected?.title}`, { taskId: 'T3', skill: 'brand-positioning' }),
    trace('task.accepted', 'content-architect', '生成主站信息架构与 Claim 映射', { taskId: 'T4', skill: 'content-architecture' }),
    trace('task.accepted', 'visual-designer', '生成个人品牌视觉方向与设计令牌', { taskId: 'T5', skill: 'visual-direction' }),
    trace('task.accepted', 'frontend-builder', '调用 personal-homepage-skill 生成可预览主站', { taskId: 'T6', skill: 'personal-homepage-skill' }),
    trace('task.rejected', 'qa-compliance', '“顶尖 AI 产品专家”缺少比较证据，已退回', { taskId: 'T7', returnedTo: 'brand-strategist' }),
    trace('task.accepted', 'brand-strategist', '删除无证据强断言，保留可验证定位', { taskId: 'T7-R1' }),
    trace('task.accepted', 'qa-compliance', '事实、授权、隐私、响应式与可访问性检查通过', { taskId: 'T8', skill: 'qa-release-governance' }),
    trace('task.waiting', 'delivery-publisher', '等待用户 G3 发布审批', { taskId: 'T9', gate: 'G3' }),
  ]

  return {
    ...scenario,
    status: 'qa-passed',
    claims,
    evidence,
    agentRuns: AGENTS.map(agent => ({ ...agent, status: agent.id === 'delivery-publisher' ? 'waiting' : 'accepted' })),
    trace: [...scenario.trace, ...events],
  }
}

export function publishScenario(scenario) {
  if (scenario.status !== 'qa-passed') throw new Error('QA 未通过，不能发布')
  const version = `v${scenario.releases.length + 1}.0.0`
  const release = {
    id: `release_${version}`,
    version,
    status: 'published',
    publishedAt: new Date().toISOString(),
    claimIds: scenario.claims.filter(item => item.status === 'accepted').map(item => item.id),
    grantIds: scenario.grants.filter(item => item.status === 'active').map(item => item.id),
    rollbackFrom: scenario.releases.at(-1)?.version || null,
  }
  return {
    ...scenario,
    status: 'published',
    gates: { ...scenario.gates, G3: 'approved' },
    releases: [...scenario.releases, release],
    agentRuns: scenario.agentRuns.map(item => item.id === 'delivery-publisher' ? { ...item, status: 'accepted' } : item),
    trace: [...scenario.trace, trace('release.published', 'delivery-publisher', `用户批准并发布 ${version}`, { gate: 'G3', releaseId: release.id })],
  }
}

export function revokeSourceAndRollback(scenario, sourceId) {
  const grants = scenario.grants.map(item => item.sourceId === sourceId ? { ...item, status: 'revoked', revokedAt: new Date().toISOString() } : item)
  const revokedEvidenceId = EVIDENCE_CATALOG[sourceId]?.id
  const affected = revokedEvidenceId
    ? scenario.claims.filter(item => item.evidenceIds?.includes(revokedEvidenceId)).map(item => item.id)
    : []
  const claims = scenario.claims.map(item => affected.includes(item.id) ? { ...item, status: 'needs-review' } : item)
  const evidence = (scenario.evidence || []).map(item => item.sourceId === sourceId ? { ...item, status: 'revoked' } : item)
  const releases = scenario.releases.map((item, index, all) => index === all.length - 1 ? { ...item, status: 'rolled-back' } : item)
  return {
    ...scenario,
    status: 'rolled-back',
    grants,
    claims,
    evidence,
    releases,
    gates: { ...scenario.gates, G2: 'partially-revoked', G3: 'revoked' },
    trace: [...scenario.trace, trace('release.rolled_back', 'delivery-publisher', `${sourceId} 授权已撤回，受影响声明进入复核，当前版本已回滚`, { sourceId, affected })],
  }
}

export function publicDemoWorkspace() {
  const workspace = createEmptyWorkspace()
  const base = addScenario(workspace, {
    id: 'job-open-source',
    name: '求职 × 开源作者版',
    audience: 'AI 团队、招聘方与开源协作者',
    goal: '被快速记住，并用真实项目证明从场景到产品的能力',
  })
  return {
    ...base,
    profile: {
      id: 'profile_paopaobengbengtiaotiao',
      displayName: '郑淑文',
      alias: '跑跑蹦蹦跳跳',
      currentPositioning: '待确认',
      companyVisibility: 'hidden',
      memory: { enabled: true, paused: false, items: 12 },
      evidenceSummary: { verified: 0, pending: 6 },
    },
    notice: '已载入用户授权的参赛演示档案；公司信息保持隐藏。',
  }
}

export function replaceScenario(workspace, updated) {
  return { ...workspace, scenarios: workspace.scenarios.map(item => item.id === updated.id ? updated : item) }
}

export function getActiveScenario(workspace) {
  return workspace.scenarios.find(item => item.id === workspace.activeScenarioId) || null
}

export function deepCloneWorkspace(workspace) {
  return clone(workspace)
}
