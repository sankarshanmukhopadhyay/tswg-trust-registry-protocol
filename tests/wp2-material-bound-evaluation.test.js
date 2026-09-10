const assert = require('node:assert/strict');
const test = require('node:test');

const { MATERIAL_TYPES, MATERIAL_STATUSES } = require('../development/verification-material/model');
const {
  EVALUATION_OUTCOMES,
  createMaterialAuthorization,
  evaluateMaterialBoundAuthorization
} = require('../development/verification-material/evaluator');

function record(overrides = {}) {
  return createMaterialAuthorization({
    authority_id: 'did:example:authority-r',
    principal_id: 'did:example:issuer-a',
    action: 'issue',
    resource: 'org.example.mobile-driving-licence',
    verification_material: {
      id: 'urn:sha256:c1',
      type: MATERIAL_TYPES.X509_CERTIFICATE,
      status: MATERIAL_STATUSES.VALID
    },
    ...overrides
  });
}

function request(overrides = {}) {
  return {
    authority_id: 'did:example:authority-r',
    principal_id: 'did:example:issuer-a',
    action: 'issue',
    resource: 'org.example.mobile-driving-licence',
    verification_material_id: 'urn:sha256:c1',
    ...overrides
  };
}

test('exact principal/material/authority/action/resource match is eligible for positive authorization', () => {
  const result = evaluateMaterialBoundAuthorization(request(), [record()]);
  assert.deepEqual(result, {
    authorized: true,
    outcome: EVALUATION_OUTCOMES.MATCH,
    principal_id: 'did:example:issuer-a',
    verification_material_id: 'urn:sha256:c1',
    material_bound: true
  });
});

test('unknown material never falls back to principal-only positive authorization', () => {
  const result = evaluateMaterialBoundAuthorization(
    request({ verification_material_id: 'urn:sha256:unknown' }),
    [record()]
  );
  assert.equal(result.authorized, false);
  assert.equal(result.outcome, EVALUATION_OUTCOMES.MATERIAL_NOT_FOUND);
  assert.equal(result.material_bound, true);
});

test('material associated with another principal is rejected explicitly', () => {
  const records = [
    record(),
    record({
      principal_id: 'did:example:issuer-b',
      verification_material: {
        id: 'urn:sha256:c2',
        type: MATERIAL_TYPES.X509_CERTIFICATE,
        status: MATERIAL_STATUSES.VALID
      }
    })
  ];
  const result = evaluateMaterialBoundAuthorization(
    request({ verification_material_id: 'urn:sha256:c2' }),
    records
  );
  assert.equal(result.authorized, false);
  assert.equal(result.outcome, EVALUATION_OUTCOMES.MATERIAL_PRINCIPAL_MISMATCH);
});

test('revoked material cannot authorize even when principal and scope otherwise match', () => {
  const revoked = record({
    verification_material: {
      id: 'urn:sha256:c1',
      type: MATERIAL_TYPES.X509_CERTIFICATE,
      status: MATERIAL_STATUSES.REVOKED
    }
  });
  const result = evaluateMaterialBoundAuthorization(request(), [revoked]);
  assert.equal(result.authorized, false);
  assert.equal(result.outcome, EVALUATION_OUTCOMES.MATERIAL_NOT_VALID);
});

test('wrong authority is rejected after exact material binding', () => {
  const result = evaluateMaterialBoundAuthorization(
    request({ authority_id: 'did:example:authority-other' }),
    [record()]
  );
  assert.equal(result.authorized, false);
  assert.equal(result.outcome, EVALUATION_OUTCOMES.AUTHORITY_MISMATCH);
});

test('wrong action is rejected after exact material binding', () => {
  const result = evaluateMaterialBoundAuthorization(
    request({ action: 'verify' }),
    [record()]
  );
  assert.equal(result.authorized, false);
  assert.equal(result.outcome, EVALUATION_OUTCOMES.ACTION_MISMATCH);
});

test('wrong resource is rejected after exact material binding', () => {
  const result = evaluateMaterialBoundAuthorization(
    request({ resource: 'org.example.passport' }),
    [record()]
  );
  assert.equal(result.authorized, false);
  assert.equal(result.outcome, EVALUATION_OUTCOMES.RESOURCE_MISMATCH);
});

test('unknown principal is distinct from unknown material', () => {
  const result = evaluateMaterialBoundAuthorization(
    request({ principal_id: 'did:example:issuer-unknown' }),
    [record()]
  );
  assert.equal(result.authorized, false);
  assert.equal(result.outcome, EVALUATION_OUTCOMES.PRINCIPAL_NOT_FOUND);
});

test('material-bound request requires material identifier and cannot degrade to unqualified evaluation', () => {
  assert.throws(
    () => evaluateMaterialBoundAuthorization(
      request({ verification_material_id: undefined }),
      [record()]
    ),
    /verification_material_id must be a non-empty string/
  );
});
