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

test('critical context preserves the exact verification_material value', () => {
  const material = 'urn:sha256:c2';
  const result = evaluateCompatibility({
    ...base,
    context: { verification_material: material, time: '2026-06-01T00:00:00Z' },
    critical_context: ['verification_material']
  }, {
    supported_context: ['time', 'verification_material']
  });
  assert.equal(result.decision, DECISIONS.PROCESSED);
  assert.equal(result.context.verification_material, material);
});

test('different exact verification-material references remain distinguishable', () => {
  const endpoint = { supported_context: ['verification_material'] };
  const first = evaluateCompatibility({
    ...base,
    context: { verification_material: 'urn:sha256:c1' },
    critical_context: ['verification_material']
  }, endpoint);
  const second = evaluateCompatibility({
    ...base,
    context: { verification_material: 'urn:sha256:c2' },
    critical_context: ['verification_material']
  }, endpoint);
  assert.notEqual(first.context.verification_material, second.context.verification_material);
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

test('profile identifier without a processing contract fails closed', () => {
  const result = evaluateCompatibility({
    ...base,
    context: { verification_material: 'urn:sha256:c2' },
    required_profiles: ['verification-material-v1']
  }, {
    supported_context: ['time'],
    supported_profiles: ['verification-material-v1']
  });
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.PROFILE_CONTRACT_UNSATISFIED);
});

test('profile contract fails closed when mandatory qualifier processing is unavailable', () => {
  const result = evaluateCompatibility({
    ...base,
    context: { verification_material: 'urn:sha256:c2' },
    required_profiles: ['verification-material-v1']
  }, {
    supported_context: ['time'],
    supported_profiles: ['verification-material-v1'],
    profile_contracts: {
      'verification-material-v1': { required_context: ['verification_material'] }
    }
  });
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.PROFILE_CONTRACT_UNSATISFIED);
  assert.deepEqual(result.missing_required_context, ['verification_material']);
});

test('pre-negotiated profile processes all mandatory qualifiers', () => {
  const result = evaluateCompatibility({
    ...base,
    context: { verification_material: 'urn:sha256:c2' },
    critical_context: ['verification_material'],
    required_profiles: ['verification-material-v1']
  }, {
    supported_context: ['time', 'verification_material'],
    supported_profiles: ['verification-material-v1'],
    profile_contracts: {
      'verification-material-v1': { required_context: ['verification_material'] }
    }
  });
  assert.equal(result.decision, DECISIONS.PROCESSED);
  assert.equal(result.context.verification_material, 'urn:sha256:c2');
});

test('critical declaration must refer to an actual context member', () => {
  assert.throws(() => evaluateCompatibility({
    ...base,
    context: {},
    critical_context: ['verification_material']
  }, { supported_context: ['verification_material'] }), /absent/);
});
