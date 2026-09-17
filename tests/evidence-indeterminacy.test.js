const assert = require('node:assert/strict');
const test = require('node:test');

const { DECISIONS, RECORD_STATES, EVIDENCE_STATES, REASONS, evaluateEvidence } = require('../development/verification-material/evidence');

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

test('fresh authoritative listed evidence is sufficient and positive', () => {
  const result = evaluate(RECORD_STATES.LISTED_APPLICABLE);
  assert.equal(result.evidence_state, EVIDENCE_STATES.SUFFICIENT);
  assert.equal(result.decision, DECISIONS.POSITIVE);
});

test('authoritative complete fresh absence is sufficient for authoritative negative', () => {
  const result = evaluate(RECORD_STATES.NOT_LISTED);
  assert.equal(result.evidence_state, EVIDENCE_STATES.SUFFICIENT);
  assert.equal(result.decision, DECISIONS.AUTHORITATIVE_NEGATIVE);
  assert.equal(result.reason, REASONS.AUTHORITATIVE_ABSENCE);
});

test('incomplete absence remains indeterminate', () => {
  const result = evaluate(RECORD_STATES.NOT_LISTED, { complete_for_scope: false });
  assert.equal(result.evidence_state, EVIDENCE_STATES.INCOMPLETE);
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.EVIDENCE_INCOMPLETE);
});

test('non-authoritative evidence remains indeterminate whether listed or absent', () => {
  for (const state of [RECORD_STATES.NOT_LISTED, RECORD_STATES.LISTED_APPLICABLE]) {
    const result = evaluate(state, { authoritative: false });
    assert.equal(result.evidence_state, EVIDENCE_STATES.NON_AUTHORITATIVE);
    assert.equal(result.decision, DECISIONS.INDETERMINATE);
    assert.equal(result.reason, REASONS.SOURCE_NON_AUTHORITATIVE);
  }
});

test('stale evidence remains indeterminate whether listed or absent', () => {
  for (const state of [RECORD_STATES.LISTED_APPLICABLE, RECORD_STATES.NOT_LISTED]) {
    const result = evaluate(state, {}, '2026-09-11T12:00:00Z');
    assert.equal(result.evidence_state, EVIDENCE_STATES.STALE);
    assert.equal(result.decision, DECISIONS.INDETERMINATE);
    assert.equal(result.reason, REASONS.EVIDENCE_STALE);
  }
});

test('unavailable evidence is not absence', () => {
  const result = evaluate(RECORD_STATES.SOURCE_UNAVAILABLE);
  assert.equal(result.evidence_state, EVIDENCE_STATES.UNAVAILABLE);
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.SOURCE_UNAVAILABLE);
  assert.notEqual(result.reason, REASONS.AUTHORITATIVE_ABSENCE);
});

test('conflicting evidence is not silently selected', () => {
  const result = evaluate(RECORD_STATES.CONFLICTING);
  assert.equal(result.evidence_state, EVIDENCE_STATES.CONFLICTING);
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.EVIDENCE_CONFLICTING);
});

test('unknown evidence remains independently indeterminate', () => {
  const result = evaluate(RECORD_STATES.UNKNOWN);
  assert.equal(result.evidence_state, EVIDENCE_STATES.UNKNOWN);
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
  assert.equal(result.reason, REASONS.EVIDENCE_UNKNOWN);
});

test('not-applicable remains distinct from not-listed at evaluator layer', () => {
  const notApplicable = evaluate(RECORD_STATES.NOT_APPLICABLE);
  const notListed = evaluate(RECORD_STATES.NOT_LISTED);
  assert.equal(notApplicable.evidence_state, EVIDENCE_STATES.SUFFICIENT);
  assert.equal(notApplicable.reason, REASONS.NOT_APPLICABLE);
  assert.equal(notListed.reason, REASONS.AUTHORITATIVE_ABSENCE);
  assert.notEqual(notApplicable.reason, notListed.reason);
});

test('revoked and expired evidence are sufficient material-dependent negatives', () => {
  for (const [state, reason] of [[RECORD_STATES.REVOKED, REASONS.REVOKED], [RECORD_STATES.EXPIRED, REASONS.EXPIRED]]) {
    const result = evaluate(state);
    assert.equal(result.evidence_state, EVIDENCE_STATES.SUFFICIENT);
    assert.equal(result.decision, DECISIONS.AUTHORITATIVE_NEGATIVE);
    assert.equal(result.reason, reason);
    assert.equal(Object.hasOwn(result, 'principal_revoked'), false);
  }
});

test('source without temporal freshness evidence is stale/indeterminate', () => {
  const result = evaluate(RECORD_STATES.LISTED_APPLICABLE, { observed_at: undefined, next_update: undefined });
  assert.equal(result.evidence_state, EVIDENCE_STATES.STALE);
  assert.equal(result.decision, DECISIONS.INDETERMINATE);
});

test('evidence state is independent from decision state', () => {
  assert.equal(evaluate(RECORD_STATES.LISTED_APPLICABLE).evidence_state, EVIDENCE_STATES.SUFFICIENT);
  assert.equal(evaluate(RECORD_STATES.NOT_LISTED).evidence_state, EVIDENCE_STATES.SUFFICIENT);
  assert.notEqual(evaluate(RECORD_STATES.LISTED_APPLICABLE).decision, evaluate(RECORD_STATES.NOT_LISTED).decision);
});

test('evidence output retains provenance needed to explain classification', () => {
  const result = evaluate(RECORD_STATES.NOT_LISTED);
  assert.equal(result.source.id, 'ni:///sha-256;example-source');
  assert.equal(result.source.scope, 'mdoc:org.iso.18013.5.1.mDL');
  assert.equal(result.source.digest, 'sha256:example');
  assert.equal(result.fresh, true);
  assert.equal(result.evaluation_time, '2026-09-09T12:00:00.000Z');
});
