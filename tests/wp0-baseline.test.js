const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

function schema(name) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'schema', name), 'utf8'));
}

function requiredSet(document) {
  return new Set(document.required || []);
}

const authorizationRequest = schema('trqp_authorization_request.schema.json');
const authorizationResponse = schema('trqp_authorization_response.schema.json');
const recognitionRequest = schema('trqp_recognition_request.schema.json');
const recognitionResponse = schema('trqp_recognition_response.schema.json');

test('authorization request freezes the four required query dimensions', () => {
  assert.deepEqual(
    [...requiredSet(authorizationRequest)].sort(),
    ['action', 'authority_id', 'entity_id', 'resource'].sort()
  );
});

test('recognition request freezes the four required query dimensions', () => {
  assert.deepEqual(
    [...requiredSet(recognitionRequest)].sort(),
    ['action', 'authority_id', 'entity_id', 'resource'].sort()
  );
});

test('verification material is not a first-class baseline request property', () => {
  for (const request of [authorizationRequest, recognitionRequest]) {
    assert.equal(Object.hasOwn(request.properties, 'verification_material'), false);
    assert.equal(Object.hasOwn(request.properties, 'verification_material_id'), false);
  }
});

test('top-level request schemas are open to additional properties', () => {
  for (const request of [authorizationRequest, recognitionRequest]) {
    // JSON Schema defaults additionalProperties to true when the keyword is absent.
    assert.equal(Object.hasOwn(request, 'additionalProperties'), false);
  }
});

test('context is explicitly extensible', () => {
  assert.deepEqual(authorizationRequest.properties.context.additionalProperties, { type: 'string' });
  assert.deepEqual(recognitionRequest.properties.context.additionalProperties, { type: 'string' });
});

test('time is an existing RFC3339/date-time query condition', () => {
  for (const request of [authorizationRequest, recognitionRequest]) {
    const time = request.properties.context.properties.time;
    assert.equal(time.type, 'string');
    assert.equal(time.format, 'date-time');
  }
});

test('authorization response is currently boolean-valued', () => {
  assert.equal(authorizationResponse.properties.authorized.type, 'boolean');
  assert.equal(requiredSet(authorizationResponse).has('authorized'), true);
});

test('recognition response is currently boolean-valued', () => {
  assert.equal(recognitionResponse.properties.recognized.type, 'boolean');
  assert.equal(requiredSet(recognitionResponse).has('recognized'), true);
});

test('baseline responses have no machine-readable decision status taxonomy', () => {
  for (const response of [authorizationResponse, recognitionResponse]) {
    for (const candidate of ['status', 'decision', 'indeterminate', 'reason_code']) {
      assert.equal(Object.hasOwn(response.properties, candidate), false);
    }
  }
});
