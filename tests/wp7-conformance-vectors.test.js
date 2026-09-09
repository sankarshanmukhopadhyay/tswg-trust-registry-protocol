const assert = require('node:assert/strict');
const test = require('node:test');
const { validateRequest, validateResponse } = require('../development/verification-material/wp7-conformance');

function request(overrides = {}) {
  return {
    trqp_version: '3.0-candidate',
    entity_id: 'did:example:issuer-a',
    authority_id: 'did:example:authority',
    action: 'issue',
    resource: 'credential-type-x',
    context: { verification_material: 'urn:sha256:c2', time: '2026-06-01T00:00:00Z' },
    critical_context: ['verification_material', 'time'],
    ...overrides
  };
}

test('qualified historical request conforms', () => {
  assert.deepEqual(validateRequest(request()), { valid: true, errors: [] });
});

test('critical member absent from context is non-conformant', () => {
  const result = validateRequest(request({ context: { time: '2026-06-01T00:00:00Z' } }));
  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /verification_material/);
});

test('candidate contract is version explicit', () => {
  assert.equal(validateRequest(request({ trqp_version: '2.1' })).valid, false);
});

test('indeterminate response cannot masquerade as authorized', () => {
  const result = validateResponse({
    authorized: true,
    decision: 'indeterminate',
    reason: 'historical-evidence-incomplete',
    time_evaluated: '2026-06-01T00:00:00Z',
    evidence: []
  });
  assert.equal(result.valid, false);
});

test('indeterminate response with no positive boolean conforms', () => {
  const result = validateResponse({
    authorized: false,
    decision: 'indeterminate',
    reason: 'historical-evidence-incomplete',
    time_requested: '2026-06-01T00:00:00Z',
    time_evaluated: '2026-06-01T00:00:00Z',
    evidence: []
  });
  assert.equal(result.valid, true);
});

test('positive response requires a positive authorization or recognition boolean', () => {
  assert.equal(validateResponse({
    authorized: false,
    decision: 'positive',
    reason: 'evidence-supports-proposition',
    time_evaluated: '2026-06-01T00:00:00Z',
    evidence: []
  }).valid, false);
});

test('authoritative negative retains provenance', () => {
  const result = validateResponse({
    authorized: false,
    decision: 'authoritative-negative',
    reason: 'revoked',
    time_evaluated: '2026-09-02T00:00:00Z',
    evidence: [{
      source_id: 'ni:///sha-256;history-source',
      authoritative: true,
      complete_for_scope: true,
      effective_from: '2026-09-01T00:00:00Z',
      digest: 'sha256:history-2'
    }]
  });
  assert.equal(result.valid, true);
});
