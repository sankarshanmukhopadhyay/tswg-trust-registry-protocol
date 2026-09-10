const assert = require('node:assert/strict');
const test = require('node:test');

const { DECISIONS, RECORD_STATES, REASONS, evaluateEvidence } = require('../development/verification-material/evidence');

function source(overrides = {}) {
  return {
    id: 'ni:///sha-256;example-source',
    authoritative: true,
    complete_for_scope: true,
    scope: 'mdoc:org.iso.18013.5.1.mDL',
    observed_at: '2026-09-09T08:00:00Z',
    next_update: '2026-09-10T08:00:00Z',
    digest: 'sha256:example',
    ...overrides
  };
}

function evaluate(record_state, sourceOverrides = {}, evaluation_time = '2026-09-09T12:00:00Z') {
  return evaluateEvidence({ source: source(sourceOverrides), record_state, evaluation_time });
}

test('fresh authoritative listed evidence supports a positive proposition', () => {
  const result = evaluate(RECORD_STATES.LISTED_APPLICABLE);
  assert.equal(result.decision, DECISIONS.POSITIVE);
  assert.equal(result.reason, REASONS.EVIDENCE_SUPPORTS_PROPOSITION);
});

test('absence in a fresh authoritative complete source supports authoritative negative', () => {
  const result = evaluate(RECORD_STATES.NOT_LISTED);
  assert.equal(result.decision, DECISIONS.AUTHORITATIVE_NEGATIVE);
  assert.equal(result.reason, REASONS.AUTHORITATIVE_ABSENCE);
});

test('absence in an incomplete source MUST NOT collapse to negative', () => {
  const result = evaluate(RECORD_STATES.NOT_LISTED, { complete_for_scope: false });
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.SOURCE_INCOMPLETE);
});

test('absence in a non-authoritative source MUST NOT collapse to negative', () => {
  const result = evaluate(RECORD_STATES.NOT_LISTED, { authoritative: false });
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.SOURCE_NON_AUTHORITATIVE);
});

test('listed evidence from a non-authoritative source MUST NOT collapse to positive', () => {
  const result = evaluate(RECORD_STATES.LISTED_APPLICABLE, { authoritative: false });
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.SOURCE_NON_AUTHORITATIVE);
});

test('stale listed evidence MUST NOT collapse to a current positive', () => {
  const result = evaluate(RECORD_STATES.LISTED_APPLICABLE, {}, '2026-09-11T12:00:00Z');
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.STALE);
});

test('stale absence MUST NOT collapse to a current negative', () => {
  const result = evaluate(RECORD_STATES.NOT_LISTED, {}, '2026-09-11T12:00:00Z');
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.STALE);
});

test('source unavailable remains indeterminate', () => {
  const result = evaluate(RECORD_STATES.SOURCE_UNAVAILABLE);
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.SOURCE_UNAVAILABLE);
});

test('unknown record state remains indeterminate', () => {
  const result = evaluate(RECORD_STATES.UNKNOWN);
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.UNKNOWN);
});

test('not-applicable is a negative reason distinct from not-listed', () => {
  const notApplicable = evaluate(RECORD_STATES.NOT_APPLICABLE);
  const notListed = evaluate(RECORD_STATES.NOT_LISTED);
  assert.equal(notApplicable.decision, DECISIONS.AUTHORITATIVE_NEGATIVE);
  assert.equal(notApplicable.reason, REASONS.NOT_APPLICABLE);
  assert.equal(notListed.reason, REASONS.AUTHORITATIVE_ABSENCE);
  assert.notEqual(notApplicable.reason, notListed.reason);
});

test('revoked evidence preserves material-dependent negative reason', () => {
  const result = evaluate(RECORD_STATES.REVOKED);
  assert.equal(result.decision, DECISIONS.AUTHORITATIVE_NEGATIVE);
  assert.equal(result.reason, REASONS.REVOKED);
  assert.equal(Object.hasOwn(result, 'principal_revoked'), false);
});

test('expired evidence preserves material-dependent negative reason', () => {
  const result = evaluate(RECORD_STATES.EXPIRED);
  assert.equal(result.decision, DECISIONS.AUTHORITATIVE_NEGATIVE);
  assert.equal(result.reason, REASONS.EXPIRED);
});

test('source without temporal freshness evidence is indeterminate', () => {
  const result = evaluate(RECORD_STATES.LISTED_APPLICABLE, { observed_at: undefined, next_update: undefined });
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.STALE);
});

test('evidence output retains provenance needed to explain classification', () => {
  const result = evaluate(RECORD_STATES.NOT_LISTED);
  assert.equal(result.source.id, 'ni:///sha-256;example-source');
  assert.equal(result.source.scope, 'mdoc:org.iso.18013.5.1.mDL');
  assert.equal(result.source.digest, 'sha256:example');
  assert.equal(result.fresh, true);
  assert.equal(result.evaluation_time, '2026-09-09T12:00:00.000Z');
});
