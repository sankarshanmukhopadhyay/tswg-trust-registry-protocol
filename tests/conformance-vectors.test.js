const assert = require('node:assert/strict');
const test = require('node:test');
const { validateRequest, validateResponse } = require('../development/verification-material/conformance');

function request(overrides = {}) {
  return { trqp_version: '3.0-candidate', entity_id: 'did:example:issuer-a', authority_id: 'did:example:authority', action: 'issue', resource: 'credential-type-x', context: { verification_material: 'urn:sha256:c2', time: '2026-06-01T00:00:00Z' }, critical_context: ['verification_material', 'time'], ...overrides };
}

function response(overrides = {}) {
  return { authorized: false, decision: 'indeterminate', reason: 'historical-evidence-incomplete', time_evaluated: '2026-06-01T00:00:00Z', evidence: [], ...overrides };
}

test('qualified historical request conforms', () => assert.deepEqual(validateRequest(request()), { valid: true, errors: [] }));
test('critical member absent from context is non-conformant', () => {
  const result = validateRequest(request({ context: { time: '2026-06-01T00:00:00Z' } }));
  assert.equal(result.valid, false); assert.match(result.errors.join(' '), /verification_material/);
});
test('candidate contract is version explicit', () => assert.equal(validateRequest(request({ trqp_version: '2.1' })).valid, false));
test('indeterminate response cannot masquerade as authorized', () => assert.equal(validateResponse(response({ authorized: true })).valid, false));
test('indeterminate response with no positive boolean conforms', () => assert.equal(validateResponse(response({ time_requested: '2026-06-01T00:00:00Z' })).valid, true));

test('positive response requires positive boolean and established reason', () => {
  assert.equal(validateResponse(response({ decision: 'positive', reason: 'established' })).valid, false);
  assert.equal(validateResponse(response({ decision: 'positive', reason: 'established', authorized: true, evidence_state: 'sufficient' })).valid, true);
  assert.equal(validateResponse(response({ decision: 'positive', reason: 'revoked', authorized: true })).valid, false);
});

test('authoritative negative may carry sufficient evidence', () => {
  const result = validateResponse(response({ decision: 'authoritative-negative', reason: 'revoked', evidence_state: 'sufficient', time_evaluated: '2026-09-02T00:00:00Z', evidence: [{ source_id: 'ni:///sha-256;history-source', authoritative: true, complete_for_scope: true, effective_from: '2026-09-01T00:00:00Z', digest: 'sha256:history-2' }] }));
  assert.equal(result.valid, true);
});

test('not-applicable is distinct from absence or denial', () => {
  assert.equal(validateResponse(response({ decision: 'not-applicable', reason: 'outside-scope', evidence_state: 'sufficient' })).valid, true);
  assert.equal(validateResponse(response({ decision: 'authoritative-negative', reason: 'not-listed', evidence_state: 'sufficient' })).valid, true);
  assert.equal(validateResponse(response({ decision: 'authoritative-negative', reason: 'outside-scope' })).valid, false);
});

test('direct evidence insufficiency reasons map to matching evidence states', () => {
  for (const [reason, state] of [['evidence-stale','stale'], ['evidence-incomplete','incomplete'], ['source-unavailable','unavailable'], ['source-non-authoritative','non-authoritative'], ['evidence-conflicting','conflicting'], ['evidence-unknown','unknown']]) {
    assert.equal(validateResponse(response({ reason, evidence_state: state })).valid, true);
  }
});

test('evidence insufficiency state/reason mismatch is non-conformant', () => {
  assert.equal(validateResponse(response({ reason: 'evidence-stale', evidence_state: 'incomplete' })).valid, false);
  assert.equal(validateResponse(response({ reason: 'evidence-conflicting', evidence_state: 'sufficient' })).valid, false);
});

test('insufficient evidence cannot become authoritative negative', () => {
  for (const reason of ['evidence-stale', 'evidence-incomplete', 'source-unavailable', 'source-non-authoritative', 'evidence-conflicting', 'evidence-unknown']) {
    assert.equal(validateResponse(response({ decision: 'authoritative-negative', reason })).valid, false);
  }
});

test('unsupported critical context and profile failures remain indeterminate without pretending to be evidence-source states', () => {
  for (const reason of ['unsupported-critical-context', 'required-profile-unsupported', 'profile-contract-unsatisfied']) assert.equal(validateResponse(response({ reason })).valid, true);
});

test('reason vocabulary cannot cross decision classes', () => {
  assert.equal(validateResponse(response({ decision: 'indeterminate', reason: 'revoked' })).valid, false);
  assert.equal(validateResponse(response({ decision: 'authoritative-negative', reason: 'historical-evidence-incomplete' })).valid, false);
  assert.equal(validateResponse(response({ decision: 'not-applicable', reason: 'not-listed' })).valid, false);
});

test('unknown implementation-specific reason is non-conformant', () => assert.equal(validateResponse(response({ reason: 'database-cache-miss-17' })).valid, false));
