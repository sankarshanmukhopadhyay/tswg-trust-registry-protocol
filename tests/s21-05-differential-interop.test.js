const assert = require('node:assert/strict');
const test = require('node:test');
const primary = require('../development/verification-material/discovery');
const independent = require('../development/verification-material/discovery-independent');

const policy = { now: '2026-09-14T00:00:00Z', authorized_publishers: ['did:example:operator'] };
function doc(overrides = {}) {
  return {
    type: 'trqp-capability-v1', service_id: 'urn:trqp:registry:alpha', publisher_id: 'did:example:operator',
    trqp_versions: ['3.0-candidate'], processing_profiles: ['candidate-material-binding'],
    issued_at: '2026-09-13T00:00:00Z', expires_at: '2026-09-15T00:00:00Z',
    endpoints: [{ uri: 'https://one.example/trqp' }], ...overrides
  };
}

function primaryOutcome(document, request = { trqp_version: '3.0-candidate', required_profiles: ['candidate-material-binding'] }) {
  const capability = primary.validateCapabilityDocument(document, policy);
  const admission = primary.admitDiscoveredCapability(request, capability);
  return admission.admitted ? { admitted: true, service_id: admission.service_id } : { admitted: false, reason: admission.reason };
}
function independentOutcome(document, request = { trqp_version: '3.0-candidate', required_profiles: ['candidate-material-binding'] }) {
  const capability = independent.inspectCapability(document, policy);
  const admission = independent.admit(request, capability);
  return admission.admitted ? { admitted: true, service_id: admission.service_id } : { admitted: false, reason: admission.reason };
}
function converges(document, request) {
  assert.deepEqual(independentOutcome(document, request), primaryOutcome(document, request));
}

test('independent implementations converge on fresh authorized capability', () => converges(doc()));
test('independent implementations converge on stale rejection', () => converges(doc({ issued_at: '2026-09-12T00:00:00Z', expires_at: '2026-09-13T00:00:00Z' })));
test('independent implementations converge on unauthorized publisher rejection', () => converges(doc({ publisher_id: 'did:example:attacker' })));
test('independent implementations converge on version downgrade rejection', () => converges(doc({ trqp_versions: ['2.0'] })));
test('independent implementations converge on profile downgrade rejection', () => converges(doc({ processing_profiles: ['basic'] })));
test('independent implementations preserve semantic identity across endpoint movement', () => {
  converges(doc({ endpoints: [{ uri: 'https://moved.example/trqp' }] }));
  const a = primary.validateCapabilityDocument(doc(), policy);
  const b = independent.inspectCapability(doc({ endpoints: [{ uri: 'https://moved.example/trqp' }] }), policy);
  assert.equal(a.service_id, b.service_id);
  assert.notEqual(a.endpoints[0].uri, b.endpoints[0].uri);
});
