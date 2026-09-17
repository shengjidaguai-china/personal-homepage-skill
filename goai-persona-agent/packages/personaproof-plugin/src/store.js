import {
  addScenario,
  attemptSourceAccess,
  confirmDirection,
  createEmptyWorkspace,
  getActiveScenario,
  grantSources,
  publicDemoWorkspace,
  publishScenario,
  replaceScenario,
  revokeSourceAndRollback,
  runAgentTeam,
} from './domain.js'

const STORAGE_KEY = 'goai:personaproof:harness:v2'

function parseStoredState() {
  if (typeof window === 'undefined') return createEmptyWorkspace()
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
    if (!saved || saved.version !== 2 || !Array.isArray(saved.scenarios)) return createEmptyWorkspace()
    return { ...createEmptyWorkspace(), ...saved, overlay: null, notice: null }
  } catch {
    return createEmptyWorkspace()
  }
}

class PersonaWorkspaceStore {
  state = parseStoredState()
  listeners = new Set()

  subscribe = listener => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getSnapshot = () => this.state

  emit(next, persist = true) {
    this.state = next
    if (persist && typeof window !== 'undefined') {
      const { overlay: _overlay, notice: _notice, ...durable } = next
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(durable))
    }
    for (const listener of this.listeners) listener()
  }

  patch(delta, persist = true) {
    this.emit({ ...this.state, ...delta }, persist)
  }

  loadDemo() {
    this.emit(publicDemoWorkspace())
  }

  reset() {
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY)
    this.emit(createEmptyWorkspace())
  }

  selectScenario(activeScenarioId) {
    this.patch({ activeScenarioId, view: 'workbench', overlay: null })
  }

  createScenario({ name, audience, goal }) {
    const id = `scenario_${Date.now()}`
    const next = addScenario(this.state, { id, name, audience, goal })
    this.emit({ ...next, overlay: null, view: 'workbench', notice: `已创建“${name}”；它与其他版本共用同一事实底座。` })
  }

  setView(view) {
    this.patch({ view })
  }

  setOverlay(overlay) {
    this.patch({ overlay }, false)
  }

  clearNotice() {
    this.patch({ notice: null }, false)
  }

  mutateScenario(mutator, extras = {}) {
    const scenario = getActiveScenario(this.state)
    if (!scenario) return
    const updated = mutator(scenario)
    this.emit({ ...replaceScenario(this.state, updated), ...extras })
  }

  confirmDirection(positioningId) {
    this.mutateScenario(scenario => confirmDirection(scenario, positioningId), {
      notice: 'G1 已通过：宣传方向已由你确认。现在才可以申请授权检索与取证。',
    })
  }

  attemptGitHub() {
    const scenario = getActiveScenario(this.state)
    if (!scenario) return
    const result = attemptSourceAccess(scenario, 'github')
    this.emit({ ...replaceScenario(this.state, result.scenario), notice: result.allowed ? 'GitHub 只读访问已放行。' : '已拒绝：GitHub 尚未获得 G2 授权。' })
  }

  grantSources(sourceIds) {
    try {
      this.mutateScenario(scenario => grantSources(scenario, sourceIds), {
        overlay: null,
        notice: 'G2 已通过：Agent 可在授权范围内主动检索公开网络与官方渠道。',
      })
    } catch (error) {
      this.patch({ notice: error.message }, false)
    }
  }

  runTeam() {
    try {
      this.mutateScenario(runAgentTeam, {
        view: 'workbench',
        notice: 'AgentTeams 闭环完成：一次无证据强断言已被 QA 退回并修正。',
      })
    } catch (error) {
      this.patch({ notice: error.message }, false)
    }
  }

  publish() {
    try {
      this.mutateScenario(publishScenario, {
        view: 'workbench',
        notice: 'G3 已通过：v1.0.0 已发布，上一安全状态可回滚。',
      })
    } catch (error) {
      this.patch({ notice: error.message }, false)
    }
  }

  revokeGithub() {
    this.mutateScenario(scenario => revokeSourceAndRollback(scenario, 'github'), {
      view: 'evidence',
      notice: 'GitHub 授权已撤回：3 条相关表达进入复核，公开版本已回滚。',
    })
  }

  toggleMemory() {
    const profile = this.state.profile
    if (!profile) return
    this.patch({
      profile: { ...profile, memory: { ...profile.memory, paused: !profile.memory.paused } },
      notice: profile.memory.paused ? '长期品牌记忆已恢复。' : '长期品牌记忆已暂停；单次服务仍可继续。',
      overlay: null,
    })
  }

  send(text) {
    const value = String(text).trim()
    if (!value) return
    this.mutateScenario(scenario => ({
      ...scenario,
      messages: [
        ...scenario.messages,
        { id: `msg_${Date.now()}_u`, role: 'user', text: value, at: new Date().toISOString() },
        {
          id: `msg_${Date.now()}_a`, role: 'assistant', at: new Date().toISOString(),
          text: scenario.gates.G1 === 'pending'
            ? '我先不急着给你贴标签。结合你的传统行业经历、开源项目和内容表达，我建议比较三条定位路径，再由你确认哪一种最像你。'
            : scenario.gates.G2 !== 'approved'
              ? '方向已经明确。下一步我会列出建议的检索范围；在你逐项授权后，我会主动查找 GitHub、公开网络和公司官方渠道。'
              : '证据已获授权。我会把这个问题交给相应 Agent，并保留事实、推断、包装和验收记录。',
        },
      ],
    }))
  }
}

export const workspaceStore = new PersonaWorkspaceStore()
