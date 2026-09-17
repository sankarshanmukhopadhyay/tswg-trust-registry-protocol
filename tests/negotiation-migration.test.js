const assert = require('node:assert/strict');
const test = require('node:test');
const { capability, negotiate, REQUIRED_SEMANTICS } = require('../development/verification-material/negotiation');

function request(overrides = {}) {
  return {
    trqp_version: '3.0-candidate',
    entity_id: 'did:example:issuer-a',
    authority_id: 'did:example:authority',
    action: 'issue',
    resource: 'credential-type-x',
    context: { verification_material: 'urn:sha256:c2', time: '2026-06-01T00:00:00Z' },
    critical_context: ['verification_material', 'time'],
    required_profiles: ['candidate-material-binding'],
    ...overrides
  };
}

function candidatePeer(overrides = {}) {
  return capability({
    trqp_versions: ['2.0', '3.0-candidate'],
    candidate_profiles: ['candidate-material-binding'],
    processing_semantics: [...REQUIRED_SEMANTICS],
    supported_context: ['verification_material', 'time'],
    ...overrides
  });
}

test('fully negotiated candidate request is admitted only to candidate processing', () => {
  const result = negotiate(request(), candidatePeer());
  assert.equal(result.admitted, true);
  assert.equal(result.route, 'candidate');
});

test('legacy v2 peer cannot receive candidate request by fallback', () => {
  const result = negotiate(request(), capability({ trqp_versions: ['2.0'] }));
  assert.equal(result.admitted, false);
  assert.equal(result.route, 'reject');
  assert.equal(result.reason, 'required-profile-unsupported');
});

test('profile label without mandatory processing semantics is insufficient', () => {
  const result = negotiate(request(), candidatePeer({ processing_semantics: [] }));
  assert.equal(result.admitted, false);
  assert.equal(result.reason, 'profile-contract-unsatisfied');
  assert.ok(result.missing_semantics.includes('critical-context-fail-closed'));
});

test('unsupported decision-critical member fails closed', () => {
  const result = negotiate(request(), candidatePeer({ supported_context: ['time'] }));
  assert.equal(result.admitted, false);
  assert.equal(result.reason, 'unsupported-critical-context');
  assert.deepEqual(result.unsupported_context, ['verification_material']);
});

test('missing required profile fails before evaluation', () => {
  const result = negotiate(request({ required_profiles: ['candidate-material-binding', 'high-assurance'] }), candidatePeer());
  assert.equal(result.admitted, false);
  assert.equal(result.reason, 'required-profile-unsupported');
});

test('candidate-capable peer still rejects malformed critical-context contract', () => {
  const result = negotiate(request({ critical_context: ['time', 'time'] }), candidatePeer());
  assert.equal(result.admitted, false);
  assert.equal(result.reason, 'unsupported-critical-context');
});

test('ordinary non-candidate request is not rewritten into candidate semantics', () => {
  const result = negotiate(request({ trqp_version: '2.0' }), candidatePeer());
  assert.equal(result.admitted, false);
  assert.equal(result.route, 'legacy-or-unsupported');
});
