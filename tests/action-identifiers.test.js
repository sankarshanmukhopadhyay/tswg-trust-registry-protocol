const assert = require('node:assert/strict');
const test = require('node:test');

const { MATERIAL_TYPES, MATERIAL_STATUSES } = require('../development/verification-material/model');
const {
  EVALUATION_OUTCOMES,
  createMaterialAuthorization,
  evaluateMaterialBoundAuthorization
} = require('../development/verification-material/evaluator');
const {
  PKIX_EKU,
  requireActionIdentifier,
  describeActionIdentifier,
  actionIdentifiersEqual
} = require('../development/verification-material/action-identifiers');

function material() {
  return {
    id: 'urn:sha256:codesigning-cert',
    type: MATERIAL_TYPES.X509_CERTIFICATE,
    status: MATERIAL_STATUSES.VALID,
    // Deliberately not consumed by the TRQP authorization evaluator. Even when
    // external certificate processing reports this EKU, it cannot manufacture
    // a TRQP authorization record.
    extended_key_usage: [PKIX_EKU.CODE_SIGNING]
  };
}

function authorization(action = PKIX_EKU.CODE_SIGNING) {
  return createMaterialAuthorization({
    authority_id: 'did:example:software-trust-registry',
    principal_id: 'did:example:publisher',
    action,
    resource: 'urn:artifact:release:example-1',
    verification_material: material()
  });
}

function request(action = PKIX_EKU.CODE_SIGNING) {
  return {
    authority_id: 'did:example:software-trust-registry',
    principal_id: 'did:example:publisher',
    action,
    resource: 'urn:artifact:release:example-1',
    verification_material_id: 'urn:sha256:codesigning-cert'
  };
}

test('standard EKU OID can be carried as an exact TRQP action identifier', () => {
  const result = evaluateMaterialBoundAuthorization(request(), [authorization()]);
  assert.equal(result.authorized, true);
  assert.equal(result.outcome, EVALUATION_OUTCOMES.MATCH);
});

test('OID action identifiers use canonical urn:oid form', () => {
  assert.deepEqual(describeActionIdentifier(PKIX_EKU.CODE_SIGNING), {
    identifier: 'urn:oid:1.3.6.1.5.5.7.3.3',
    kind: 'oid',
    oid: '1.3.6.1.5.5.7.3.3'
  });
  assert.throws(
    () => requireActionIdentifier('urn:oid:not-an-oid'),
    /canonical urn:oid:<dotted-decimal> form/
  );
});

test('certificate EKU metadata alone does not establish TRQP authorization', () => {
  const recordWithoutCodeSigningAuthorization = authorization('publish-release');
  const result = evaluateMaterialBoundAuthorization(
    request(PKIX_EKU.CODE_SIGNING),
    [recordWithoutCodeSigningAuthorization]
  );

  assert.equal(result.authorized, false);
  assert.equal(result.outcome, EVALUATION_OUTCOMES.ACTION_MISMATCH);
});

test('valid verification material does not weaken an action mismatch', () => {
  const result = evaluateMaterialBoundAuthorization(
    request(PKIX_EKU.CLIENT_AUTH),
    [authorization(PKIX_EKU.CODE_SIGNING)]
  );

  assert.equal(result.authorized, false);
  assert.equal(result.outcome, EVALUATION_OUTCOMES.ACTION_MISMATCH);
});

test('action identifiers are not silently aliased or broadened', () => {
  assert.equal(actionIdentifiersEqual(PKIX_EKU.CODE_SIGNING, PKIX_EKU.CODE_SIGNING), true);
  assert.equal(actionIdentifiersEqual(PKIX_EKU.CODE_SIGNING, 'code-signing'), false);
  assert.equal(actionIdentifiersEqual(PKIX_EKU.CODE_SIGNING, '1.3.6.1.5.5.7.3.3'), false);
});
