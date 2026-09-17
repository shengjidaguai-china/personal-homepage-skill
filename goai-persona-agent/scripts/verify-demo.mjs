import assert from 'node:assert/strict'
import {
  attemptSourceAccess,
  confirmDirection,
  getActiveScenario,
  grantSources,
  publicDemoWorkspace,
  publishScenario,
  revokeSourceAndRollback,
  runAgentTeam,
  validateClaim,
} from '../packages/personaproof-plugin/src/domain.js'

const workspace = publicDemoWorkspace()
let scenario = getActiveScenario(workspace)

const blocked = attemptSourceAccess(scenario, 'github')
assert.equal(blocked.allowed, false)
assert.equal(blocked.scenario.trace.at(-1).event, 'tool.denied')

scenario = confirmDirection(blocked.scenario, 'scene-translator')
assert.equal(scenario.gates.G1, 'approved')
assert.throws(() => runAgentTeam(scenario), /G2/)

scenario = grantSources(scenario, ['resume', 'github', 'public-web', 'company-official', 'homepage-demo', 'talk-materials'])
assert.equal(attemptSourceAccess(scenario, 'github').allowed, true)

scenario = runAgentTeam(scenario)
assert.equal(scenario.status, 'qa-passed')
assert.equal(scenario.agentRuns.length, 8)
assert.ok(scenario.trace.some(item => item.event === 'task.rejected'))
assert.ok(scenario.trace.some(item => item.event === 'search.completed' && item.sourceId === 'public-web'))
assert.ok(scenario.trace.some(item => item.event === 'search.completed' && item.sourceId === 'company-official'))
assert.equal(scenario.evidence.find(item => item.sourceId === 'company-official').disclosure, 'internal-only')
assert.ok(scenario.claims.every(claim => validateClaim(claim).valid || claim.status === 'rejected'))

scenario = publishScenario(scenario)
assert.equal(scenario.gates.G3, 'approved')
assert.equal(scenario.releases.at(-1).status, 'published')

scenario = revokeSourceAndRollback(scenario, 'github')
assert.equal(scenario.status, 'rolled-back')
assert.equal(scenario.releases.at(-1).status, 'rolled-back')
assert.ok(scenario.claims.some(item => item.status === 'needs-review'))

console.log(`PASS: ${scenario.trace.length} trace events, ${scenario.claims.length} governed claims, 8 agents, denial and rollback verified.`)
