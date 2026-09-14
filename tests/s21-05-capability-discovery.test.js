const assert = require('node:assert/strict');
const test = require('node:test');
const {
  CAPABILITY_DOCUMENT_TYPE,
  validateCapabilityDocument,
  reconcileCapabilityDocuments,
  admitDiscoveredCapability
} = require('../development/verification-material/discovery');

const NOW = '2026-09-14T00:00:00Z';

function document(overrides = {}) {
  return {
    type: CAPABILITY_DOCUMENT_TYPE,
    service_id: 'urn:trqp:registry:alpha',
    publisher_id: 'did:example:registry-alpha-operator',
    trqp_versions: ['2.0', '3.0-candidate'],
    processing_profiles: ['candidate-material-binding'],
    issued_at: '2026-09-13T00:00:00Z',
    expires_at: '2026-09-15T00:00:00Z',
    endpoints: [{ uri: 'https://registry-a.example/trqp' }],
    ...overrides
  };
}

const options = { now: NOW, authorized_publishers: ['did:example:registry-alpha-operator'] };

test('fresh authorized capability metadata is usable without conferring authorization', () => {
  const result = validateCapabilityDocument(document(), options);
  assert.equal(result.valid, true);
  const admission = admitDiscoveredCapability({ trqp_version: '3.0-candidate', required_profiles: ['candidate-material-binding'] }, result);
  assert.equal(admission.admitted, true);
  assert.equal(admission.service_id, 'urn:trqp:registry:alpha');
  assert.match(admission.note, /does not establish authorization/);
});

test('stale capability metadata fails closed', () => {
  const result = validateCapabilityDocument(document({ expires_at: '2026-09-13T23:59:59Z' }), options);
  assert.deepEqual(result, { valid: false, reason: 'stale-capability-metadata' });
});

test('unauthorized publisher cannot assert capabilities', () => {
  const result = validateCapabilityDocument(document({ publisher_id: 'did:example:attacker' }), options);
  assert.deepEqual(result, { valid: false, reason: 'unauthorized-capability-publisher' });
});

test('conflicting capability documents are not silently selected', () => {
  const result = reconcileCapabilityDocuments([
    document(),
    document({ processing_profiles: ['candidate-material-binding', 'high-assurance'] })
  ], options);
  assert.deepEqual(result, { resolved: false, reason: 'conflicting-capability-metadata' });
});

test('version downgrade is rejected rather than silently routed to v2', () => {
  const capability = validateCapabilityDocument(document({ trqp_versions: ['2.0'] }), options);
  const result = admitDiscoveredCapability({ trqp_version: '3.0-candidate', required_profiles: [] }, capability);
  assert.deepEqual(result, { admitted: false, reason: 'version-downgrade-rejected' });
});

test('profile downgrade is rejected', () => {
  const capability = validateCapabilityDocument(document({ processing_profiles: ['basic'] }), options);
  const result = admitDiscoveredCapability({ trqp_version: '3.0-candidate', required_profiles: ['candidate-material-binding'] }, capability);
  assert.deepEqual(result, { admitted: false, reason: 'profile-downgrade-rejected' });
});

test('endpoint movement does not change semantic service identity', () => {
  const first = validateCapabilityDocument(document(), options);
  const moved = validateCapabilityDocument(document({
    issued_at: '2026-09-13T12:00:00Z',
    endpoints: [{ uri: 'https://registry-b.example/trqp' }]
  }), options);
  assert.equal(first.service_id, moved.service_id);
  assert.notEqual(first.endpoints[0].uri, moved.endpoints[0].uri);
});

test('endpoint URI is never promoted to semantic service identity', () => {
  const result = validateCapabilityDocument(document(), options);
  assert.notEqual(result.service_id, result.endpoints[0].uri);
});

test('replayed superseded metadata yields the newest equivalent capability document', () => {
  const result = reconcileCapabilityDocuments([
    document({ issued_at: '2026-09-12T00:00:00Z', endpoints: [{ uri: 'https://old.example/trqp' }] }),
    document({ issued_at: '2026-09-13T12:00:00Z', endpoints: [{ uri: 'https://new.example/trqp' }] })
  ], options);
  assert.equal(result.resolved, true);
  assert.equal(result.capability.endpoints[0].uri, 'https://new.example/trqp');
});

test('capability advertisement without required implementation profile is not admitted', () => {
  const capability = validateCapabilityDocument(document({ processing_profiles: ['advertised-only'] }), options);
  const result = admitDiscoveredCapability({ trqp_version: '3.0-candidate', required_profiles: ['candidate-material-binding'] }, capability);
  assert.equal(result.admitted, false);
  assert.equal(result.reason, 'profile-downgrade-rejected');
});
