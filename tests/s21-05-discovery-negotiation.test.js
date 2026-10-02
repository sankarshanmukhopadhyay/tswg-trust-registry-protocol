const assert = require('node:assert/strict');
const test = require('node:test');
const { REQUIRED_SEMANTICS } = require('../development/verification-material/negotiation');
const { validateCapabilityDocument, reconcileCapabilityDocuments } = require('../development/verification-material/discovery');
const {
  normalizeDiscoveredCapability,
  negotiateDiscoveredCapability,
  validateAndNegotiateCapability
} = require('../development/verification-material/discovery-negotiation');
const independent = require('../development/verification-material/discovery-independent');

const NOW = '2026-09-14T00:00:00Z';
const policy = { now: NOW, authorized_publishers: ['did:example:operator'] };

function document(overrides = {}) {
  return {
    type: 'trqp-capability-v1',
    service_id: 'urn:trqp:registry:alpha',
    publisher_id: 'did:example:operator',
    trqp_versions: ['2.0', '3.0-candidate'],
    processing_profiles: ['candidate-material-binding'],
    processing_semantics: [...REQUIRED_SEMANTICS],
    supported_context: ['verification_material', 'time'],
    issued_at: '2026-09-13T00:00:00Z',
    expires_at: '2026-09-15T00:00:00Z',
    endpoints: [{ uri: 'https://one.example/trqp' }],
    ...overrides
  };
}

function request(overrides = {}) {
  return {
    trqp_version: '3.0-candidate',
    required_profiles: ['candidate-material-binding'],
    critical_context: ['verification_material', 'time'],
    ...overrides
  };
}

test('validated discovery normalizes directly into the negotiation contract', () => {
  const validated = validateCapabilityDocument(document(), policy);
  const normalized = normalizeDiscoveredCapability(validated);
  assert.equal(normalized.valid, true);
  assert.deepEqual(normalized.peer.candidate_profiles, ['candidate-material-binding']);
  assert.deepEqual(normalized.peer.processing_semantics, REQUIRED_SEMANTICS);
  assert.deepEqual(normalized.peer.supported_context, ['verification_material', 'time']);
});

test('fresh authorized complete discovery admits candidate negotiation', () => {
  const result = validateAndNegotiateCapability(document(), request(), policy);
  assert.equal(result.admitted, true);
  assert.equal(result.route, 'candidate');
  assert.equal(result.service_id, 'urn:trqp:registry:alpha');
  assert.equal(result.endpoints[0].uri, 'https://one.example/trqp');
  assert.match(result.note, /does not establish authorization/);
});

test('candidate advertisement without mandatory processing semantics fails before negotiation', () => {
  const result = validateAndNegotiateCapability(document({ processing_semantics: undefined }), request(), policy);
  assert.deepEqual(result, {
    admitted: false,
    route: 'reject',
    decision: 'indeterminate',
    reason: 'incomplete-candidate-capability'
  });
});

test('candidate advertisement without supported-context declaration fails before negotiation', () => {
  const result = validateAndNegotiateCapability(document({ supported_context: undefined }), request(), policy);
  assert.equal(result.admitted, false);
  assert.equal(result.reason, 'incomplete-candidate-capability');
});

test('complete capability with insufficient mandatory semantics fails closed in negotiation', () => {
  const result = validateAndNegotiateCapability(
    document({ processing_semantics: ['critical-context-fail-closed'] }),
    request(),
    policy
  );
  assert.equal(result.admitted, false);
  assert.equal(result.reason, 'profile-contract-unsatisfied');
  assert.ok(result.missing_semantics.includes('material-bound-evaluation'));
});

test('complete capability lacking required critical-context support fails closed', () => {
  const result = validateAndNegotiateCapability(document({ supported_context: ['time'] }), request(), policy);
  assert.equal(result.admitted, false);
  assert.equal(result.reason, 'unsupported-critical-context');
  assert.deepEqual(result.unsupported_context, ['verification_material']);
});

test('stale and unauthorized discovery cannot enter candidate negotiation', () => {
  for (const doc of [
    document({ expires_at: '2026-09-13T23:59:59Z' }),
    document({ publisher_id: 'did:example:attacker' })
  ]) {
    const result = validateAndNegotiateCapability(doc, request(), policy);
    assert.equal(result.admitted, false);
    assert.equal(result.route, 'reject');
    assert.equal(result.decision, 'indeterminate');
  }
});

test('v2-only discovery cannot trigger fallback for a candidate request', () => {
  const result = validateAndNegotiateCapability(
    document({
      trqp_versions: ['2.0'],
      processing_semantics: undefined,
      supported_context: undefined
    }),
    request(),
    policy
  );
  assert.equal(result.admitted, false);
  assert.equal(result.route, 'reject');
  assert.equal(result.reason, 'required-profile-unsupported');
});

test('capability conflicts include semantics and supported critical context', () => {
  const semanticConflict = reconcileCapabilityDocuments([
    document(),
    document({ processing_semantics: [...REQUIRED_SEMANTICS, 'extra-semantic'] })
  ], policy);
  assert.deepEqual(semanticConflict, { resolved: false, reason: 'conflicting-capability-metadata' });

  const contextConflict = reconcileCapabilityDocuments([
    document(),
    document({ supported_context: ['verification_material', 'time', 'jurisdiction'] })
  ], policy);
  assert.deepEqual(contextConflict, { resolved: false, reason: 'conflicting-capability-metadata' });
});

test('endpoint movement preserves semantic identity through negotiation', () => {
  const first = validateAndNegotiateCapability(document(), request(), policy);
  const moved = validateAndNegotiateCapability(
    document({ issued_at: '2026-09-13T12:00:00Z', endpoints: [{ uri: 'https://moved.example/trqp' }] }),
    request(),
    policy
  );
  assert.equal(first.service_id, moved.service_id);
  assert.notEqual(first.endpoints[0].uri, moved.endpoints[0].uri);
});

test('independently structured implementation converges on end-to-end negotiation outcomes', () => {
  const vectors = [
    document(),
    document({ processing_semantics: ['critical-context-fail-closed'] }),
    document({ supported_context: ['time'] }),
    document({ expires_at: '2026-09-13T23:59:59Z' }),
    document({ publisher_id: 'did:example:attacker' })
  ];

  for (const doc of vectors) {
    const primary = validateAndNegotiateCapability(doc, request(), policy);
    const inspected = independent.inspectCapability(doc, policy);
    const other = independent.negotiateCandidate(request(), inspected);

    const project = result => ({
      admitted: result.admitted,
      route: result.route,
      decision: result.decision,
      reason: result.reason,
      missing_semantics: result.missing_semantics,
      unsupported_context: result.unsupported_context,
      service_id: result.service_id
    });
    assert.deepEqual(project(other), project(primary));
  }
});

test('prevalidated capability can be negotiated without reinterpreting discovery as authority', () => {
  const validated = validateCapabilityDocument(document(), policy);
  const result = negotiateDiscoveredCapability(request(), validated);
  assert.equal(result.admitted, true);
  assert.match(result.note, /processing contract only/);
});
