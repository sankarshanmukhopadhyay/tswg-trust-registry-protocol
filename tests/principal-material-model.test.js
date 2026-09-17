const assert = require('node:assert/strict');
const test = require('node:test');

const {
  MATERIAL_TYPES,
  MATERIAL_STATUSES,
  createVerificationMaterial,
  createPrincipalMaterialBinding
} = require('../development/verification-material/model');

test('principal identity remains independent from verification material identity', () => {
  const binding = createPrincipalMaterialBinding({
    principal_id: 'did:example:issuer-a',
    verification_material: {
      id: 'urn:sha256:certificate-c1',
      type: MATERIAL_TYPES.X509_CERTIFICATE,
      role: 'IACA',
      status: MATERIAL_STATUSES.VALID
    }
  });

  assert.equal(binding.principal_id, 'did:example:issuer-a');
  assert.equal(binding.verification_material.id, 'urn:sha256:certificate-c1');
  assert.notEqual(binding.principal_id, binding.verification_material.id);
});

test('multiple material versions can bind to the same principal without changing principal identity', () => {
  const c1 = createPrincipalMaterialBinding({
    principal_id: 'did:example:issuer-a',
    verification_material: {
      id: 'urn:sha256:c1',
      type: MATERIAL_TYPES.X509_CERTIFICATE,
      status: MATERIAL_STATUSES.SUPERSEDED
    }
  });

  const c2 = createPrincipalMaterialBinding({
    principal_id: 'did:example:issuer-a',
    verification_material: {
      id: 'urn:sha256:c2',
      type: MATERIAL_TYPES.X509_CERTIFICATE,
      status: MATERIAL_STATUSES.VALID
    }
  });

  assert.equal(c1.principal_id, c2.principal_id);
  assert.notEqual(c1.verification_material.id, c2.verification_material.id);
  assert.notEqual(c1.verification_material.status, c2.verification_material.status);
});

test('model is not X.509-specific', () => {
  const didMethod = createVerificationMaterial({
    id: 'did:example:issuer-a#key-1',
    type: MATERIAL_TYPES.DID_VERIFICATION_METHOD,
    status: MATERIAL_STATUSES.VALID
  });

  assert.equal(didMethod.type, 'did-verification-method');
});

test('material lifecycle interval is independently representable', () => {
  const material = createVerificationMaterial({
    id: 'urn:sha256:c1',
    type: MATERIAL_TYPES.X509_CERTIFICATE,
    status: MATERIAL_STATUSES.EXPIRED,
    valid_from: '2026-01-01T00:00:00Z',
    valid_until: '2026-06-30T23:59:59Z'
  });

  assert.equal(material.valid_from, '2026-01-01T00:00:00Z');
  assert.equal(material.valid_until, '2026-06-30T23:59:59Z');
  assert.equal(material.status, MATERIAL_STATUSES.EXPIRED);
});

test('invalid lifecycle interval is rejected', () => {
  assert.throws(
    () => createVerificationMaterial({
      id: 'urn:sha256:c1',
      type: MATERIAL_TYPES.X509_CERTIFICATE,
      valid_from: '2026-07-01T00:00:00Z',
      valid_until: '2026-06-30T23:59:59Z'
    }),
    /valid_from must not be later than valid_until/
  );
});

test('empty principal and material identifiers are rejected', () => {
  assert.throws(
    () => createPrincipalMaterialBinding({
      principal_id: '',
      verification_material: {
        id: 'urn:sha256:c1',
        type: MATERIAL_TYPES.X509_CERTIFICATE
      }
    }),
    /principal_id must be a non-empty string/
  );

  assert.throws(
    () => createVerificationMaterial({
      id: '',
      type: MATERIAL_TYPES.X509_CERTIFICATE
    }),
    /verification material id must be a non-empty string/
  );
});

test('WP1 internal model does not mutate TRQP v2 request schemas', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const root = path.resolve(__dirname, '..');

  for (const name of ['trqp_authorization_request.schema.json', 'trqp_recognition_request.schema.json']) {
    const schema = JSON.parse(fs.readFileSync(path.join(root, 'schema', name), 'utf8'));
    assert.equal(Object.hasOwn(schema.properties, 'verification_material'), false);
    assert.equal(Object.hasOwn(schema.properties, 'verification_material_id'), false);
  }
});
