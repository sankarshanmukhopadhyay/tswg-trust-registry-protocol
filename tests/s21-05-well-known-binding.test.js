const assert = require('node:assert/strict');
const test = require('node:test');
const { CAPABILITY_DOCUMENT_TYPE } = require('../development/verification-material/discovery');
const { capabilityUrl, resolveWellKnownResponse } = require('../development/verification-material/discovery-well-known');

const options = { now: '2026-09-14T00:00:00Z', authorized_publishers: ['did:example:operator'] };
const body = {
  type: CAPABILITY_DOCUMENT_TYPE,
  service_id: 'urn:trqp:registry:alpha',
  publisher_id: 'did:example:operator',
  trqp_versions: ['3.0-candidate'],
  processing_profiles: ['candidate-material-binding'],
  issued_at: '2026-09-13T00:00:00Z',
  expires_at: '2026-09-15T00:00:00Z',
  endpoints: [{ uri: 'https://api.example/trqp' }]
};

test('well-known binding deterministically maps an origin to capability retrieval', () => {
  assert.equal(capabilityUrl('https://registry.example/base?x=1'), 'https://registry.example/.well-known/trqp-capabilities');
});

test('well-known transport returns the same transport-independent capability semantics', () => {
  const result = resolveWellKnownResponse({ origin: 'https://registry.example', status: 200, content_type: 'application/json', body }, options);
  assert.equal(result.resolved, true);
  assert.equal(result.binding, 'https-well-known-experiment');
  assert.equal(result.capability.service_id, 'urn:trqp:registry:alpha');
  assert.equal(result.capability.endpoints[0].uri, 'https://api.example/trqp');
});

test('successful HTTP retrieval cannot rescue stale capability metadata', () => {
  const result = resolveWellKnownResponse({
    origin: 'https://registry.example', status: 200, content_type: 'application/json',
    body: { ...body, issued_at: '2026-09-12T00:00:00Z', expires_at: '2026-09-13T00:00:00Z' }
  }, options);
  assert.deepEqual(result, { resolved: false, reason: 'stale-capability-metadata' });
});

test('successful HTTP retrieval cannot authorize an untrusted publisher', () => {
  const result = resolveWellKnownResponse({
    origin: 'https://registry.example', status: 200, content_type: 'application/json',
    body: { ...body, publisher_id: 'did:example:attacker' }
  }, options);
  assert.deepEqual(result, { resolved: false, reason: 'unauthorized-capability-publisher' });
});

test('binding failure remains discovery failure rather than authorization denial', () => {
  const result = resolveWellKnownResponse({ origin: 'https://registry.example', status: 404, content_type: 'text/html', body: '' }, options);
  assert.deepEqual(result, { resolved: false, reason: 'capability-metadata-unavailable' });
});
