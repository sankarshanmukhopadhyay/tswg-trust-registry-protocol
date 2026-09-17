const assert = require('node:assert/strict');
const test = require('node:test');

const { MATERIAL_TYPES, MATERIAL_STATUSES } = require('../development/verification-material/model');
const { createMaterialAuthorization } = require('../development/verification-material/evaluator');
const {
  QUALIFIER_HANDLING,
  processAuthorizationRequest
} = require('../development/verification-material/critical-qualifiers');

const records = [createMaterialAuthorization({
  authority_id: 'did:example:authority-r',
  principal_id: 'did:example:issuer-a',
  action: 'issue',
  resource: 'org.example.mobile-driving-licence',
  verification_material: {
    id: 'urn:sha256:c1',
    type: MATERIAL_TYPES.X509_CERTIFICATE,
    status: MATERIAL_STATUSES.VALID
  }
})];

function request(overrides = {}) {
  return {
    authority_id: 'did:example:authority-r',
    principal_id: 'did:example:issuer-a',
    action: 'issue',
    resource: 'org.example.mobile-driving-licence',
    verification_material: {
      id: 'urn:sha256:c1',
      critical: true
    },
    ...overrides
  };
}

test('unsupported critical material qualifier stops processing and cannot return positive', () => {
  const result = processAuthorizationRequest(request(), records, {
    verification_material: false
  });

  assert.equal(result.processed, false);
  assert.equal(result.authorized, false);
  assert.equal(result.handling, QUALIFIER_HANDLING.UNSUPPORTED_CRITICAL_QUALIFIER);
  assert.equal(result.qualifier, 'verification_material');
  assert.equal(result.material_bound, true);
});

test('unsupported critical qualifier cannot be stripped into a broader positive query', () => {
  const result = processAuthorizationRequest(
    request({ verification_material: { id: 'urn:sha256:unknown', critical: true } }),
    records,
    { verification_material: false }
  );

  assert.notEqual(result.authorized, true);
  assert.equal(result.processed, false);
  assert.equal(result.handling, QUALIFIER_HANDLING.UNSUPPORTED_CRITICAL_QUALIFIER);
});

test('supported critical qualifier is evaluated by the material-bound evaluator', () => {
  const result = processAuthorizationRequest(request(), records, {
    verification_material: true
  });

  assert.equal(result.processed, true);
  assert.equal(result.authorized, true);
  assert.equal(result.handling, QUALIFIER_HANDLING.EVALUATED);
  assert.equal(result.material_bound, true);
  assert.equal(result.verification_material_id, 'urn:sha256:c1');
});

test('supported critical qualifier with unknown material remains a bounded negative', () => {
  const result = processAuthorizationRequest(
    request({ verification_material: { id: 'urn:sha256:unknown', critical: true } }),
    records,
    { verification_material: true }
  );

  assert.equal(result.processed, true);
  assert.equal(result.authorized, false);
  assert.equal(result.material_bound, true);
  assert.equal(result.outcome, 'material-not-found');
});

test('unsupported non-critical qualifier is explicitly identified as ignored, not reported as a positive decision', () => {
  const result = processAuthorizationRequest(
    request({ verification_material: { id: 'urn:sha256:c1', critical: false } }),
    records,
    { verification_material: false }
  );

  assert.equal(result.processed, false);
  assert.equal(result.authorized, false);
  assert.equal(result.handling, QUALIFIER_HANDLING.UNSUPPORTED_OPTIONAL_QUALIFIER_IGNORED);
  assert.equal(result.material_bound, false);
});

test('critical material qualifier requires an identifier when capability is supported', () => {
  assert.throws(
    () => processAuthorizationRequest(
      request({ verification_material: { critical: true } }),
      records,
      { verification_material: true }
    ),
    /verification_material.id must be a non-empty string/
  );
});
