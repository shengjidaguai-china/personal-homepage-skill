import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import {
  ArchiveRestore,
  BadgeCheck,
  BookOpenCheck,
  Bot,
  Building2,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleAlert,
  CircleUserRound,
  ClipboardCheck,
  Code2,
  Eye,
  FileCheck2,
  FileText,
  Fingerprint,
  Github,
  Globe2,
  History,
  LayoutDashboard,
  Link2,
  LockKeyhole,
  MemoryStick,
  MessageSquareText,
  MoreHorizontal,
  Network,
  Palette,
  Pause,
  Plus,
  RefreshCcw,
  Rocket,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Undo2,
  UserRoundSearch,
  X,
} from 'lucide-react'
import homepagePreview from '../assets/homepage-delivery-example.jpg'
import styles from './styles.css'
import { AGENTS, POSITIONING_OPTIONS, SOURCE_CATALOG, getActiveScenario } from './domain.js'
import { workspaceStore } from './store.js'

const PLUGIN_ID = '@powerycy/dsh-personaproof-plugin'

function useWorkspace() {
  return useSyncExternalStore(workspaceStore.subscribe, workspaceStore.getSnapshot, workspaceStore.getSnapshot)
}

function gateClass(status) {
  return status === 'approved' ? 'is-approved' : status === 'locked' ? 'is-locked' : status.includes?.('revoked') ? 'is-revoked' : 'is-pending'
}

function formatTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(date)
}

function SourceIcon({ id }) {
  if (id === 'github') return <Github />
  if (id === 'resume') return <FileText />
  if (id === 'homepage-demo') return <Globe2 />
  if (id === 'public-web') return <Search />
  if (id === 'company-official') return <Building2 />
  return <MessageSquareText />
}

function DeepSeekBrand({ compact = false }) {
  return <div className={`pp-dsh-brand ${compact ? 'is-compact' : ''}`}>
    <img src="/favicon.svg" alt="DeepSeek Harness" />
    {!compact && <div><strong>DeepSeek Harness</strong><span>official workspace</span></div>}
  </div>
}

function PersonaBrand({ compact = false }) {
  return <div className={`pp-brand ${compact ? 'is-compact' : ''}`}>
    <span className="pp-brand-mark"><Fingerprint size={21} /></span>
    {!compact && <div><strong>人设有据</strong><span>PersonaProof</span></div>}
  </div>
}

function Sidebar({ collapsed = false }) {
  return <aside className="pp-sidebar pp-sidebar-simplified" aria-hidden="true" />
}

function EmptyWorkspace() {
  return <main className="pp-empty">
    <div className="pp-empty-mark"><Fingerprint size={50} /></div>
    <div className="pp-eyebrow"><span /> DeepSeek Harness × PersonaProof</div>
    <h1>人人都应该有<br /><em>自己的人设。</em></h1>
    <p>不是替你编故事，而是从真实经历中挖出价值、找到方向、补齐证据，让你在信息爆炸里更容易被看见、被记住。</p>
    <div className="pp-hero-actions">
      <button className="pp-primary" onClick={() => workspaceStore.loadDemo()}><Sparkles size={18} />体验郑淑文授权案例</button>
      <button className="pp-secondary" onClick={() => workspaceStore.loadDemo()}><FileText size={18} />从简历开始</button>
    </div>
    <div className="pp-promise-grid">
      <div><UserRoundSearch /><strong>你给起点，Agent 去发现</strong><span>不只读简历，还会找到散落在网络中的真实价值</span></div>
      <div><Link2 /><strong>先授权，再检索取证</strong><span>没有 G2，公开网络和公司官方渠道都不访问</span></div>
      <div><Rocket /><strong>主站是交付，不是起点</strong><span>八个职能 Agent 协作、验收、发布和回滚</span></div>
    </div>
  </main>
}

const VIEW_ITEMS = [
  { id: 'workbench', label: '品牌工作台', icon: MessageSquareText },
  { id: 'evidence', label: '证据账本', icon: FileCheck2 },
  { id: 'site', label: '主站预览', icon: Globe2 },
  { id: 'trace', label: '协作审计', icon: Network },
]

function WorkspaceHeader({ state, scenario }) {
  const activeStep = scenario.gates.G1 !== 'approved' ? 2 : scenario.gates.G2 !== 'approved' ? 3 : 4
  const steps = ['资料', '定位', '授权', '主页']
  return <header className="pp-simple-header">
    <button className="pp-simple-brand" onClick={() => workspaceStore.setView('workbench')} aria-label="返回定位主页"><span><Fingerprint size={23} /></span><div><strong>人设有据</strong><small>PersonaProof</small></div></button>
    <ol className="pp-simple-progress" aria-label="个人品牌生成进度">
      {steps.map((label, index) => { const number = index + 1; const done = number < activeStep; const active = number === activeStep; return <li key={label} className={done ? 'is-done' : active ? 'is-active' : ''}><span>{done ? <Check size={13} /> : number}</span><strong>{label}</strong>{index < steps.length - 1 && <i />}</li> })}
    </ol>
    <div className="pp-simple-tools">
      {state.view !== 'workbench' && <button onClick={() => workspaceStore.setView('workbench')}>返回定位</button>}
      <button onClick={() => workspaceStore.setOverlay({ type: 'process' })}><ShieldCheck size={16} />查看过程</button>
    </div>
  </header>
}

function GateRail({ scenario }) {
  const gates = [
    { id: 'G0', label: '长期档案', status: 'approved' },
    { id: 'G1', label: '定位方向', status: scenario.gates.G1 },
    { id: 'G2', label: '数据来源', status: scenario.gates.G2 },
    { id: 'G3', label: '公开发布', status: scenario.gates.G3 },
  ]
  return <div className="pp-gate-rail">{gates.map((gate, index) => <React.Fragment key={gate.id}>
    <div className={gateClass(gate.status)}><span>{gate.status === 'approved' ? <Check size={12} /> : gate.id}</span><div><strong>{gate.label}</strong><small>{gate.status === 'approved' ? '已同意' : gate.status === 'locked' ? '未开放' : gate.status.includes?.('revoked') ? '已撤回' : '待确认'}</small></div></div>
    {index < gates.length - 1 && <i />}
  </React.Fragment>)}</div>
}

function ChatBubble({ message }) {
  return <div className={`pp-chat-bubble is-${message.role}`}><p>{message.text}</p><time>{formatTime(message.at)}</time></div>
}

function PositioningCard({ option, scenario }) {
  const selected = scenario.selectedPositioningId === option.id
  return <button className={`pp-position-card ${selected ? 'is-selected' : ''}`} onClick={() => scenario.gates.G1 === 'pending' && workspaceStore.confirmDirection(option.id)}>
    <div><span>{option.id === 'scene-translator' ? '最推荐' : '备选方向'}</span><b>{option.fit}% 匹配</b></div>
    <h3>{option.title}</h3>
    <p>{option.reason}</p>
    <small>{selected ? <><Check size={13} />已由本人确认</> : <><ChevronRight size={13} />选择这个方向</>}</small>
  </button>
}

function WorkbenchView({ state, scenario }) {
  const recommended = POSITIONING_OPTIONS[0]
  const positioning = POSITIONING_OPTIONS.find(item => item.id === scenario.selectedPositioningId) || recommended
  const stage = scenario.gates.G1 !== 'approved' ? 'direction' : scenario.gates.G2 !== 'approved' ? 'consent' : scenario.status === 'qa-passed' ? 'publish' : scenario.status === 'published' ? 'published' : 'build'
  const action = () => {
    if (stage === 'direction') workspaceStore.confirmDirection(recommended.id)
    else if (stage === 'consent') workspaceStore.setOverlay({ type: 'consent' })
    else if (stage === 'build') workspaceStore.runTeam()
    else if (stage === 'publish') workspaceStore.publish()
    else workspaceStore.setView('site')
  }
  const actionLabel = stage === 'direction' ? '就用这个方向' : stage === 'consent' ? '授权检索与取证' : stage === 'build' ? '生成我的个人主页' : stage === 'publish' ? '审阅并发布主页' : '查看已发布主页'
  const proofItems = [
    { icon: MessageSquareText, title: '长期内容一致', text: '持续输出 AI 场景解读与实践文章，表达稳定、主题聚焦。' },
    { icon: Github, title: '开源实践沉淀', text: '多个开源项目与工具沉淀，获得社区认可与持续贡献。' },
    { icon: BadgeCheck, title: '真实用户反馈', text: '用户因内容与工具获得实际帮助，并主动推荐与转发。' },
  ]
  return <main className="pp-simple-workbench">
    <section className="pp-position-summary">
      <div className="pp-simple-eyebrow"><Sparkles size={18} />这是我建议你被记住的方式</div>
      <h1>{positioning.title.replace(' / ', '\n/\n')}</h1>
      <p className="pp-position-pitch">把复杂的 AI 技术，翻译成可落地的场景方案；<br />用开源与协作，帮助更多产品更快被世界看见。</p>
      <div className="pp-proof-list"><small>关键依据（3 条）</small>{proofItems.map(item => { const Icon = item.icon; return <article key={item.title}><span><Icon size={21} /></span><div><strong>{item.title}</strong><p>{item.text}</p></div></article> })}</div>
      <div className="pp-simple-actions">
        <button className="pp-confirm-direction" onClick={action}>{actionLabel}<ChevronRight size={20} /></button>
        {scenario.gates.G1 === 'pending' && <button className="pp-change-direction" onClick={() => workspaceStore.setOverlay({ type: 'directions' })}>换个方向</button>}
      </div>
      <p className="pp-consent-note"><ShieldCheck size={16} />{stage === 'direction' ? '确认方向后，才会进入授权检索与取证。' : stage === 'consent' ? '方向已确认；你可决定 Agent 去哪些渠道主动查找。' : '公开前仍会再次请你审阅。'}</p>
    </section>

    <section className="pp-future-site" aria-label="未来个人主页实时预览">
      <header><strong>你的未来主页</strong><span>· 实时预览</span><i /><small>实时预览中</small></header>
      <div className="pp-future-hero">
        <div className="pp-future-copy"><small>AI 场景翻译官 / 开源产品人</small><h2>把 AI 变成<br />你能用的生产力</h2><p>把复杂的技术翻译成可落地的方案，<br />让更多产品更快被世界看见。</p><div><button onClick={() => workspaceStore.setView('site')}>探索我的项目 <ChevronRight size={16} /></button><button onClick={() => workspaceStore.setView('site')}>阅读我的文章 <ChevronRight size={16} /></button></div></div>
        <div className="pp-future-visual"><img src={homepagePreview} alt="用户授权的星球个人主页视觉预览" /></div>
      </div>
      <div className="pp-future-values"><div><span><Github size={18} /></span><strong>开源优先</strong><small>代码开放，协作共建</small></div><div><span><Target size={18} /></span><strong>场景落地</strong><small>从需求到方案到效果</small></div><div><span><ShieldCheck size={18} /></span><strong>长期主义</strong><small>持续迭代，持续输出</small></div></div>
      <div className="pp-future-projects"><h3>我正在做的事</h3><div><article><Code2 size={19} /><span><strong>场景翻译</strong><small>将前沿 AI 技术拆解为可落地的业务场景</small></span></article><article><Github size={19} /><span><strong>开源产品</strong><small>构建开源工具与模板，降低使用与创建门槛</small></span></article><article><MessageSquareText size={19} /><span><strong>内容分享</strong><small>图文、视频与工作坊，持续分享实践与思考</small></span></article></div></div>
    </section>

    <button className="pp-process-link" onClick={() => workspaceStore.setOverlay({ type: 'process' })}><ShieldCheck size={17} />查看依据与生成记录<ChevronRight size={17} /></button>
  </main>
}

function EvidenceView({ scenario }) {
  const typeName = { fact: '事实', inference: '推断', packaging: '包装' }
  return <div className="pp-evidence-view">
    <section className="pp-evidence-hero"><div><small>CLAIM–EVIDENCE LEDGER</small><h2>每一句公开表达，都知道凭什么。</h2><p>事实必须绑定证据；推断要展示理由和置信度；包装只能升级表达，不能创造新事实。</p></div><div className="pp-ledger-stats"><span><b>{scenario.claims.length}</b> 主张</span><span><b>{scenario.grants.filter(item => item.status === 'active').length}</b> 有效授权</span><span><b>{scenario.claims.filter(item => item.status === 'needs-review').length}</b> 待复核</span></div></section>
    {!!scenario.evidence?.length && <section className="pp-discovered-evidence"><div><small>AUTHORIZED DISCOVERY</small><h3>Agent 主动找到的证据</h3><p>用户只提供身份起点；公开网络、GitHub 和公司官方渠道由 Agent 在授权后主动检索。</p></div><div>{scenario.evidence.map(item => <article key={item.id}><span><SourceIcon id={item.sourceId} /></span><div><strong>{item.title}</strong><small>{item.origin} · {item.disclosure === 'internal-only' ? '仅内部核验' : item.disclosure === 'review-before-public' ? '归属确认后可用' : '已授权'}</small><p>{item.summary}</p></div></article>)}</div></section>}
    {!scenario.claims.length ? <div className="pp-empty-ledger"><BookOpenCheck /><h3>证据账本还没有内容</h3><p>通过 G2 并运行 AgentTeams 后，主张、证据和 QA 结果会出现在这里。</p><button className="pp-primary" onClick={() => workspaceStore.setView('workbench')}>返回品牌工作台</button></div> : <div className="pp-claim-list">{scenario.claims.map(claim => <article key={claim.id} className={`is-${claim.type} is-${claim.status}`}>
      <div><span>{typeName[claim.type]}</span><small>{Math.round(claim.confidence * 100)}% confidence</small><i>{claim.status === 'accepted' ? '可公开' : claim.status === 'rejected' ? 'QA 已退回' : '授权变化，待复核'}</i></div>
      <h3>{claim.text}</h3><p>{claim.explanation}</p>
      <footer><Link2 size={14} /><span>{claim.evidenceIds.length ? claim.evidenceIds.join(' · ') : '没有证据引用'}</span></footer>
    </article>)}</div>}
    {scenario.grants.some(item => item.status === 'active' && item.sourceId === 'github') && <section className="pp-revoke-panel"><div><Undo2 /><span><strong>撤回机制可现场验证</strong><small>撤回 GitHub 后，关联主张进入复核，公开版本自动回滚。</small></span></div><button onClick={() => workspaceStore.revokeGithub()}><RotateCcw size={15} />撤回 GitHub 并回滚</button></section>}
  </div>
}

function SiteView({ scenario }) {
  const published = scenario.status === 'published'
  const qaReady = scenario.status === 'qa-passed'
  return <div className="pp-site-view">
    <div className="pp-site-toolbar"><div><small>PERSONAL BRAND DELIVERY</small><h2>定制个人品牌主站</h2></div><div><span className={published ? 'is-live' : ''}>{published ? 'v1.0.0 已发布' : qaReady ? 'QA 已通过 · 等待 G3' : '预览模式'}</span>{qaReady && <button className="pp-primary" onClick={() => workspaceStore.publish()}><Rocket size={15} />审阅并同意发布</button>}</div></div>
    <section className="pp-site-frame">
      <div className="pp-browser-chrome"><i /><i /><i /><span>personaproof.local/paopaobengbengtiaotiao</span><BadgeCheck size={15} /></div>
      <div className="pp-site-shot"><img src={homepagePreview} alt="用户提供的星球个人主页 Demo 桌面效果" /><div className="pp-shot-label"><span>已授权视觉交付示例</span><strong>最终页面将替换为郑淑文真实内容与已验证证据</strong></div></div>
    </section>
    <div className="pp-site-meta">
      <article><Palette /><div><small>视觉方向</small><strong>每个人一套，不是通用模板</strong><p>根据定位、受众和真实内容决定视觉语言；此处展示用户提供的“星球”效果。</p></div></article>
      <article><ClipboardCheck /><div><small>公开边界</small><strong>公司隐藏 · 无证据强断言已删除</strong><p>页面只使用已通过 G1/G2/G3 的内容和来源。</p></div></article>
      <article><History /><div><small>版本治理</small><strong>发布清单、撤回和回滚</strong><p>每版保存 Claim、授权与构建映射，不只保存一份网页文件。</p></div></article>
    </div>
  </div>
}

function TraceView({ scenario }) {
  const agentMap = Object.fromEntries(AGENTS.map(agent => [agent.id, agent]))
  return <div className="pp-trace-view">
    <section className="pp-team-board"><div className="pp-section-title"><div><small>AGENTTEAMS CONTROL PLANE</small><h2>8 个职能，不是一句“多 Agent”。</h2></div><p>共享同一个 Case State，Leader 接受或退回 Worker 产物。</p></div><div className="pp-agent-grid">{scenario.agentRuns.map(agent => <article key={agent.id} className={`is-${agent.status}`}><span>{agent.leader ? <Fingerprint /> : agent.id.includes('visual') ? <Palette /> : agent.id.includes('frontend') ? <Code2 /> : agent.id.includes('qa') ? <ShieldCheck /> : agent.id.includes('publish') ? <Rocket /> : <Bot />}</span><div><small>{agent.leader ? 'TEAM LEADER' : agent.skill}</small><strong>{agent.name}</strong></div><i>{agent.status === 'accepted' ? '已验收' : agent.status === 'waiting' ? '等 G3' : '待运行'}</i></article>)}</div></section>
    <section className="pp-trace-log"><div className="pp-section-title"><div><small>TRACE / LOG</small><h2>任务、工具、闸门和退回都可回放</h2></div><span>{scenario.trace.length} events</span></div>{!scenario.trace.length ? <div className="pp-empty-trace"><Network /><p>完成定位和授权后运行 AgentTeams。</p></div> : <div className="pp-trace-list">{scenario.trace.map(item => <article key={item.id} className={item.event.includes('rejected') || item.event.includes('denied') ? 'is-alert' : ''}><span /><time>{formatTime(item.at)}</time><div><small>{item.event} · {agentMap[item.agentId]?.name || item.agentId}</small><strong>{item.message}</strong>{item.skill && <p>Skill: {item.skill}</p>}</div></article>)}</div>}</section>
  </div>
}

function ConsentDialog({ scenario }) {
  const [selected, setSelected] = useState(() => scenario.grants.filter(item => item.status === 'active').map(item => item.sourceId))
  const toggle = id => setSelected(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id])
  const locked = scenario.gates.G1 !== 'approved'
  return <div className="pp-modal pp-consent-dialog"><button className="pp-modal-close" onClick={() => workspaceStore.setOverlay(null)}><X size={18} /></button><div className="pp-modal-heading"><span><Search /></span><div><small>G2 · SEARCH & EVIDENCE CONSENT</small><h2>你定范围，Agent 主动去找</h2></div></div><p>不只处理你上传的材料。你可逐项授权 Agent 检索公开网络、GitHub 和公司官方渠道；同名结果需本人确认，公司名默认对外隐藏。</p><div className="pp-source-list">{SOURCE_CATALOG.map(source => <label key={source.id} className={selected.includes(source.id) ? 'is-selected' : ''}><input type="checkbox" checked={selected.includes(source.id)} disabled={locked} onChange={() => toggle(source.id)} /><span className="pp-source-icon"><SourceIcon id={source.id} /></span><span><strong>{source.name}</strong><small>{source.purpose}</small><em>{source.mode}</em></span></label>)}</div>{locked ? <div className="pp-locked-message"><LockKeyhole />请先完成 G1 定位确认。</div> : <button className="pp-primary pp-wide" disabled={!selected.length} onClick={() => workspaceStore.grantSources(selected)}>授权所选范围并开始检索</button>}</div>
}

function ScenarioDialog() {
  const [name, setName] = useState('创作者合作版')
  const [audience, setAudience] = useState('内容合作方、活动主办方与 AI 创作者')
  const [goal, setGoal] = useState('突出开源作品、观点和公开表达能力')
  return <div className="pp-modal"><button className="pp-modal-close" onClick={() => workspaceStore.setOverlay(null)}><X size={18} /></button><div className="pp-modal-heading"><span><Target /></span><div><small>ONE TRUTH · MANY CONTEXTS</small><h2>新建场景版本</h2></div></div><p>场景版本可以改变受众、重点、语气和视觉，但不能改变主档案里的事实。</p><label className="pp-field">版本名称<input value={name} onChange={event => setName(event.target.value)} /></label><label className="pp-field">目标受众<input value={audience} onChange={event => setAudience(event.target.value)} /></label><label className="pp-field">希望达成<input value={goal} onChange={event => setGoal(event.target.value)} /></label><button className="pp-primary pp-wide" onClick={() => workspaceStore.createScenario({ name, audience, goal })}>创建场景版本</button></div>
}

function MemoryDialog({ profile }) {
  return <div className="pp-modal"><button className="pp-modal-close" onClick={() => workspaceStore.setOverlay(null)}><X size={18} /></button><div className="pp-modal-heading"><span><MemoryStick /></span><div><small>G0 · LONG-TERM BRAND MEMORY</small><h2>你的品牌档案由你控制</h2></div></div><p>只保存确认过的核心档案、证据摘要、定位假设、阶段总结和发布记录；原始敏感材料默认留在本地证据库。</p><div className="pp-memory-status"><span className={profile.memory.paused ? 'is-paused' : ''} /><div><strong>{profile.memory.paused ? '长期记忆已暂停' : '长期记忆已启用'}</strong><small>{profile.memory.items} 条精简记忆 · 可查看、更正、撤销和硬删除</small></div></div><button className="pp-secondary pp-wide" onClick={() => workspaceStore.toggleMemory()}>{profile.memory.paused ? <><ArchiveRestore size={15} />恢复长期记忆</> : <><Pause size={15} />暂停长期记忆</>}</button></div>
}

function DirectionsDialog({ scenario }) {
  return <div className="pp-modal pp-directions-dialog"><button className="pp-modal-close" onClick={() => workspaceStore.setOverlay(null)}><X size={18} /></button><div className="pp-modal-heading"><span><Target /></span><div><small>选择你的记忆点</small><h2>哪一种更像你？</h2></div></div><p>这是建议，不是替你做决定。确认之前不会检索任何外部个人资料。</p><div className="pp-simple-direction-list">{POSITIONING_OPTIONS.map(option => <button key={option.id} onClick={() => { workspaceStore.confirmDirection(option.id); workspaceStore.setOverlay(null) }}><span>{option.id === 'scene-translator' ? '最推荐' : `${option.fit}% 匹配`}</span><strong>{option.title}</strong><small>{option.reason}</small><ChevronRight size={18} /></button>)}</div></div>
}

function ProcessDialog({ scenario }) {
  const acceptedAgents = scenario.agentRuns.filter(item => item.status === 'accepted').length
  const closeAndView = view => { workspaceStore.setOverlay(null); workspaceStore.setView(view) }
  return <div className="pp-modal pp-process-dialog"><button className="pp-modal-close" onClick={() => workspaceStore.setOverlay(null)}><X size={18} /></button><div className="pp-modal-heading"><span><ShieldCheck /></span><div><small>依据与生成记录</small><h2>复杂流程，替你藏在这里。</h2></div></div><p>普通使用只需要做三次确认；需要核验时，所有 Agent、证据、授权和回滚记录都可以查看。</p>
    <div className="pp-process-summary"><article><span><Network /></span><div><strong>8 个职能 Agent</strong><small>{acceptedAgents ? `${acceptedAgents} 个已完成并通过验收` : '等待定位与授权后开始协作'}</small></div></article><article><span><FileCheck2 /></span><div><strong>{scenario.claims.length} 条品牌表达</strong><small>事实、推断和包装分别标注</small></div></article><article><span><History /></span><div><strong>{scenario.trace.length} 条生成记录</strong><small>任务、工具、退回与回滚可追溯</small></div></article></div>
    <div className="pp-process-gates"><span className="is-done"><Check />定位由本人确认</span><span className={scenario.gates.G2 === 'approved' ? 'is-done' : ''}><ShieldCheck />数据源逐项授权</span><span className={scenario.gates.G3 === 'approved' ? 'is-done' : ''}><Rocket />发布前再次审阅</span></div>
    <div className="pp-process-actions"><button onClick={() => closeAndView('evidence')}>查看证据与授权</button><button onClick={() => closeAndView('trace')}>查看 Agent 协作记录</button><button onClick={() => { workspaceStore.loadDemo(); workspaceStore.setOverlay(null) }}>重新体验演示</button></div>
  </div>
}

function Overlay({ state, scenario }) {
  if (!state.overlay) return null
  return <div className="pp-modal-backdrop" role="dialog" aria-modal="true">
    {state.overlay.type === 'consent' && scenario && <ConsentDialog scenario={scenario} />}
    {state.overlay.type === 'scenario' && <ScenarioDialog />}
    {state.overlay.type === 'memory' && state.profile && <MemoryDialog profile={state.profile} />}
    {state.overlay.type === 'directions' && scenario && <DirectionsDialog scenario={scenario} />}
    {state.overlay.type === 'process' && scenario && <ProcessDialog scenario={scenario} />}
  </div>
}

function Notice({ text }) {
  useEffect(() => {
    if (!text) return undefined
    const timer = window.setTimeout(() => workspaceStore.clearNotice(), 2600)
    return () => window.clearTimeout(timer)
  }, [text])
  if (!text) return null
  const denied = text.includes('拒绝') || text.includes('撤回') || text.includes('必须')
  return <div className={`pp-notice ${denied ? 'is-alert' : ''}`}>{denied ? <CircleAlert size={15} /> : <Check size={15} />}{text}</div>
}

function PersonaWorkspace() {
  const state = useWorkspace()
  const scenario = getActiveScenario(state)
  return <section className="pp-workspace">
    {state.profile && scenario ? <><WorkspaceHeader state={state} scenario={scenario} />{state.view === 'evidence' ? <EvidenceView scenario={scenario} /> : state.view === 'site' ? <SiteView scenario={scenario} /> : state.view === 'trace' ? <TraceView scenario={scenario} /> : <WorkbenchView state={state} scenario={scenario} />}</> : <EmptyWorkspace />}
    <Overlay state={state} scenario={scenario} />
    <Notice text={state.notice} />
  </section>
}

export const inject = ['slots']

export function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = PLUGIN_ID
    style.textContent = styles
    document.head.appendChild(style)
    return () => style.remove()
  }, 'personaproof: visual system')
  ctx.effect(() => ctx.slots.register({ name: 'sidebar', priority: -100 }, Sidebar), 'personaproof: brand workspace sidebar')
  ctx.effect(() => ctx.slots.register({ name: 'conversation', priority: -100 }, PersonaWorkspace), 'personaproof: governed brand workspace')
}
