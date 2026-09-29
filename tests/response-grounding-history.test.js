const assert = require('node:assert/strict');
const test = require('node:test');
const { validateGrounding } = require('../development/verification-material/grounding');

const base = {
  source_id: 'urn:example:authority-statement:123',
  source_authority: 'did:example:authority',
  source_version: '7',
  digest: 'sha256:abc123',
  effective_from: '2026-01-01T00:00:00Z',
  effective_until: '2026-09-01T00:00:00Z'
};

test('omitted grounding remains valid for base Candidate v3', () => {
  assert.deepEqual(validateGrounding(undefined), { valid: true, omitted: true });
});

test('historical grounding must cover time_requested', () => {
  assert.equal(validateGrounding([base], '2026-06-01T00:00:00Z').valid, true);
  assert.deepEqual(
    validateGrounding([base], '2026-09-02T00:00:00Z'),
    { valid: false, reason: 'grounding-does-not-cover-requested-time' }
  );
});

test('later source state cannot ground an earlier historical determination', () => {
  const later = { ...base, effective_from: '2026-08-01T00:00:00Z', effective_until: undefined };
  assert.equal(validateGrounding([later], '2026-06-01T00:00:00Z').valid, false);
});

test('grounding cannot carry result semantics', () => {
  assert.deepEqual(
    validateGrounding([{ ...base, decision: 'positive' }]),
    { valid: false, reason: 'grounding-disclosure-or-result-field' }
  );
});

test('grounding rejects raw/internal disclosure fields', () => {
  assert.equal(validateGrounding([{ ...base, raw_evidence: { secret: true } }]).valid, false);
  assert.equal(validateGrounding([{ ...base, database_id: 42 }]).valid, false);
});

test('grounding requires a source authority', () => {
  const { source_authority, ...withoutAuthority } = base;
  assert.deepEqual(validateGrounding([withoutAuthority]), { valid: false, reason: 'grounding-authority-missing' });
});

test('digest must identify its algorithm', () => {
  assert.equal(validateGrounding([{ ...base, digest: 'abc123' }]).valid, false);
  assert.equal(validateGrounding([{ ...base, digest: 'sha256:abc123' }]).valid, true);
});

test('effective interval must be ordered', () => {
  assert.equal(validateGrounding([{ ...base, effective_from: base.effective_until, effective_until: base.effective_from }]).valid, false);
});
