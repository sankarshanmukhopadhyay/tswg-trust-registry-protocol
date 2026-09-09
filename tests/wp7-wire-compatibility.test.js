const assert = require('node:assert/strict');
const test = require('node:test');
const { DECISIONS, REASONS, evaluateCompatibility, simulateLegacyV2 } = require('../development/verification-material/wp7-wire');

const base = {
  entity_id: 'did:example:issuer-a',
  authority_id: 'did:example:authority',
  action: 'issue',
  resource: 'credential-type-x'
};

test('legacy v2 can produce a false positive by silently dropping verification_material', () => {
  const request = { ...base, context: { verification_material: 'urn:sha256:c2' } };
  const legacyAuthorization = (q) => ({ authorized: q.entity_id === base.entity_id });
  const result = simulateLegacyV2(request, legacyAuthorization);
  assert.equal(result.authorized, true);
  assert.equal(Object.hasOwn(result, 'verification_material'), false);
});

test('critical-members mechanism fails closed when verification_material is unsupported', () => {
  const result = evaluateCompatibility({
    ...base,
    context: { verification_material: 'urn:sha256:c2' },
    critical_context: ['verification_material']
  }, {
    supported_context: ['time']
  });
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.UNSUPPORTED_CRITICAL_CONTEXT);
  assert.deepEqual(result.unsupported_critical_context, ['verification_material']);
});

test('critical context is processed when endpoint explicitly supports it', () => {
  const result = evaluateCompatibility({
    ...base,
    context: { verification_material: 'urn:sha256:c2', time: '2026-06-01T00:00:00Z' },
    critical_context: ['verification_material']
  }, {
    supported_context: ['time', 'verification_material']
  });
  assert.equal(result.decision, DECISIONS.PROCESSED);
  assert.equal(result.context.verification_material, 'urn:sha256:c2');
});

test('required profile fails closed when endpoint does not advertise support', () => {
  const result = evaluateCompatibility({
    ...base,
    context: { verification_material: 'urn:sha256:c2' },
    required_profiles: ['verification-material-v1']
  }, {
    supported_context: ['time'],
    supported_profiles: []
  });
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.REQUIRED_PROFILE_UNSUPPORTED);
});

test('profile negotiation alone is insufficient unless the profile guarantees context processing', () => {
  const result = evaluateCompatibility({
    ...base,
    context: { verification_material: 'urn:sha256:c2' },
    required_profiles: ['verification-material-v1']
  }, {
    supported_context: ['time'],
    supported_profiles: ['verification-material-v1']
  });
  assert.equal(result.decision, DECISIONS.PROCESSED);
  assert.equal(Object.hasOwn(result.context, 'verification_material'), false);
  // This is deliberate evidence: merely naming a profile does not mechanically
  // prevent silent qualifier loss. The profile contract must bind supported context.
});

test('critical declaration must refer to an actual context member', () => {
  assert.throws(() => evaluateCompatibility({
    ...base,
    context: {},
    critical_context: ['verification_material']
  }, { supported_context: ['verification_material'] }), /absent/);
});
