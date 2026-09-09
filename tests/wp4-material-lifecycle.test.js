const assert = require('node:assert/strict');
const test = require('node:test');

const { MATERIAL_TYPES, MATERIAL_STATUSES } = require('../development/verification-material/model');
const {
  LIFECYCLE_OUTCOMES,
  evaluateMaterialLifecycle,
  evaluatePrincipalMaterials
} = require('../development/verification-material/lifecycle');

function material(overrides = {}) {
  return {
    id: 'urn:sha256:c1',
    type: MATERIAL_TYPES.X509_CERTIFICATE,
    status: MATERIAL_STATUSES.VALID,
    valid_from: '2026-01-01T00:00:00Z',
    valid_until: '2026-06-30T23:59:59Z',
    ...overrides
  };
}

test('valid material is usable inside its validity interval', () => {
  const result = evaluateMaterialLifecycle(material(), '2026-03-01T00:00:00Z');
  assert.equal(result.usable, true);
  assert.equal(result.outcome, LIFECYCLE_OUTCOMES.VALID);
});

test('material is not usable before valid_from', () => {
  const result = evaluateMaterialLifecycle(material(), '2025-12-31T23:59:59Z');
  assert.equal(result.usable, false);
  assert.equal(result.outcome, LIFECYCLE_OUTCOMES.NOT_YET_VALID);
});

test('material is expired after valid_until regardless of otherwise valid status', () => {
  const result = evaluateMaterialLifecycle(material(), '2026-07-01T00:00:00Z');
  assert.equal(result.usable, false);
  assert.equal(result.outcome, LIFECYCLE_OUTCOMES.EXPIRED);
});

test('revoked material is unusable while principal identity remains external and unchanged', () => {
  const result = evaluatePrincipalMaterials('did:example:issuer-a', [material({
    status: MATERIAL_STATUSES.REVOKED
  })], '2026-03-01T00:00:00Z');

  assert.equal(result.principal_id, 'did:example:issuer-a');
  assert.deepEqual(result.usable_material_ids, []);
  assert.equal(result.evaluations[0].outcome, LIFECYCLE_OUTCOMES.REVOKED);
});

test('superseded material is unusable for current evaluation', () => {
  const result = evaluateMaterialLifecycle(material({
    status: MATERIAL_STATUSES.SUPERSEDED
  }), '2026-03-01T00:00:00Z');
  assert.equal(result.usable, false);
  assert.equal(result.outcome, LIFECYCLE_OUTCOMES.SUPERSEDED);
});

test('unknown material state cannot become usable', () => {
  const result = evaluateMaterialLifecycle(material({
    status: MATERIAL_STATUSES.UNKNOWN
  }), '2026-03-01T00:00:00Z');
  assert.equal(result.usable, false);
  assert.equal(result.outcome, LIFECYCLE_OUTCOMES.UNKNOWN);
});

test('rotation permits new material under the same principal while old material is superseded', () => {
  const c1 = material({
    id: 'urn:sha256:c1',
    status: MATERIAL_STATUSES.SUPERSEDED,
    valid_until: '2026-03-31T23:59:59Z'
  });
  const c2 = material({
    id: 'urn:sha256:c2',
    status: MATERIAL_STATUSES.VALID,
    valid_from: '2026-04-01T00:00:00Z',
    valid_until: '2026-12-31T23:59:59Z'
  });

  const result = evaluatePrincipalMaterials(
    'did:example:issuer-a',
    [c1, c2],
    '2026-04-15T00:00:00Z'
  );

  assert.equal(result.principal_id, 'did:example:issuer-a');
  assert.deepEqual(result.usable_material_ids, ['urn:sha256:c2']);
  assert.equal(result.evaluations[0].outcome, LIFECYCLE_OUTCOMES.EXPIRED);
  assert.equal(result.evaluations[1].outcome, LIFECYCLE_OUTCOMES.VALID);
});

test('material validity does not establish authorization or principal recognition', () => {
  const result = evaluateMaterialLifecycle(material(), '2026-03-01T00:00:00Z');
  assert.equal(result.usable, true);
  assert.equal(Object.hasOwn(result, 'authorized'), false);
  assert.equal(Object.hasOwn(result, 'recognized'), false);
});
