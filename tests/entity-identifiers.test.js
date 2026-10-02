const assert = require('node:assert/strict');
const test = require('node:test');
const ids = require('../development/verification-material/entity-identifiers');
const independent = require('../development/verification-material/entity-identifiers-independent');

const NOW = '2026-10-02T00:00:00Z';

const publicProfile = {
  profile_id: 'public-uri-exact-v1',
  identifier_class: ids.IDENTIFIER_CLASSES.PUBLIC_URI,
  scope_kind: ids.SCOPE_KINDS.GLOBAL,
  comparison_mode: ids.COMPARISON_MODES.EXACT,
  resolution_mode: ids.RESOLUTION_MODES.OPTIONAL,
  binding_method: ids.BINDING_METHODS.REGISTRY,
  public_correlation: true
};

const localProfile = {
  profile_id: 'authority-local-explicit-v1',
  identifier_class: ids.IDENTIFIER_CLASSES.AUTHORITY_LOCAL,
  scope_kind: ids.SCOPE_KINDS.AUTHORITY,
  comparison_mode: ids.COMPARISON_MODES.EXPLICIT_EQUIVALENCE,
  resolution_mode: ids.RESOLUTION_MODES.NOT_USED,
  binding_method: ids.BINDING_METHODS.EXPLICIT_MAPPING,
  public_correlation: false
};

function ref(value, profile, scope) {
  return { value, profile_id: profile.profile_id, scope };
}

function binding(overrides = {}) {
  const profile = overrides.profile || publicProfile;
  const scope = overrides.scope || { kind: 'global' };
  return ids.createBinding({
    subject_id: overrides.subject || 'subject:A',
    identifier: ref(overrides.value || 'did:example:alice', profile, scope),
    status: overrides.status || 'active',
    aliases: overrides.aliases || [],
    valid_from: overrides.from || '2026-01-01T00:00:00Z',
    valid_until: overrides.until || null,
    authoritative: overrides.authoritative !== false,
    complete_for_scope: overrides.complete !== false,
    credential_verified: overrides.credential_verified === true
  });
}

function run(profile, identifier, records, extra = {}) {
  return ids.evaluateEntityIdentifier(
    { identifier, evaluation_time: extra.evaluation_time || NOW },
    records,
    profile,
    extra.options || {}
  );
}

test('public URI and authority-local opaque profiles share one evaluator without sharing scope semantics', () => {
  const a = run(publicProfile, ref('did:example:alice', publicProfile, { kind: 'global' }), [binding()]);
  const localRecord = binding({ value: 'A-1842', profile: localProfile, scope: { kind: 'authority', id: 'did:example:authority-r' } });
  const b = run(localProfile, ref('A-1842', localProfile, { kind: 'authority', id: 'did:example:authority-r' }), [localRecord]);
  assert.equal(a.decision, 'positive');
  assert.equal(b.decision, 'positive');
});

test('unsupported identifier class cannot produce positive', () => {
  const result = ids.evaluateEntityIdentifier(
    { identifier: ref('x', publicProfile, { kind: 'global' }), evaluation_time: NOW },
    [],
    { ...publicProfile, identifier_class: 'invented-class' }
  );
  assert.equal(result.decision, 'indeterminate');
  assert.equal(result.reason, 'unsupported-identifier-profile');
});

test('unresolvable required identifier is indeterminate rather than authoritative negative', () => {
  const profile = { ...publicProfile, resolution_mode: ids.RESOLUTION_MODES.REQUIRED };
  const result = run(profile, ref('did:example:alice', profile, { kind: 'global' }), [binding({ profile })], { options: { resolution_state: 'unavailable' } });
  assert.deepEqual(result, { decision: 'indeterminate', reason: 'identifier-resolution-unavailable' });
});

test('lexically different identifiers are not equivalent without explicit equivalence evidence', () => {
  const result = run(publicProfile, ref('did:example:ALICE', publicProfile, { kind: 'global' }), [binding()]);
  assert.equal(result.decision, 'negative');
  assert.equal(result.reason, 'identifier-not-bound');
});

test('explicit-equivalence permits only authoritative recorded aliases', () => {
  const record = binding({ value: 'A-1842', profile: localProfile, scope: { kind: 'authority', id: 'did:example:authority-r' }, aliases: ['legacy-99'] });
  const ok = run(localProfile, ref('legacy-99', localProfile, { kind: 'authority', id: 'did:example:authority-r' }), [record]);
  const no = run(localProfile, ref('LEGACY-99', localProfile, { kind: 'authority', id: 'did:example:authority-r' }), [record]);
  assert.equal(ok.decision, 'positive');
  assert.notEqual(no.decision, 'positive');
});

test('superseded identifier mapping cannot authorize current use', () => {
  const record = binding({ status: 'superseded' });
  const result = run(publicProfile, ref('did:example:alice', publicProfile, { kind: 'global' }), [record]);
  assert.equal(result.decision, 'negative');
  assert.equal(result.reason, 'identifier-binding-not-current');
});

test('current state does not rewrite historical identity', () => {
  const historicalRecord = binding({ until: '2026-08-01T00:00:00Z' });
  const past = run(publicProfile, ref('did:example:alice', publicProfile, { kind: 'global' }), [historicalRecord], { evaluation_time: '2026-06-01T00:00:00Z' });
  const current = run(publicProfile, ref('did:example:alice', publicProfile, { kind: 'global' }), [historicalRecord]);
  assert.equal(past.decision, 'positive');
  assert.notEqual(current.decision, 'positive');
});

test('authority-local opaque identifier is not assumed globally unique', () => {
  const record = binding({ value: 'A-1842', profile: localProfile, scope: { kind: 'authority', id: 'did:example:authority-r' } });
  const result = run(localProfile, ref('A-1842', localProfile, { kind: 'authority', id: 'did:example:authority-other' }), [record]);
  assert.notEqual(result.decision, 'positive');
});

test('publishing a scoped identifier as a reusable public correlator is classified high risk', () => {
  const result = ids.correlationAssessment({ ...localProfile, public_correlation: true });
  assert.deepEqual(result, { risk: 'high', reason: 'scoped-identifier-publication-widens-correlation' });
});

test('resolvability does not imply recognition or authorization', () => {
  const profile = { ...publicProfile, resolution_mode: ids.RESOLUTION_MODES.REQUIRED };
  const result = run(profile, ref('did:example:alice', profile, { kind: 'global' }), [], { options: { resolution_state: 'resolved' } });
  assert.equal(result.decision, 'indeterminate');
  assert.equal(result.reason, 'identifier-binding-insufficient');
  assert.equal(Object.hasOwn(result, 'recognized'), false);
  assert.equal(Object.hasOwn(result, 'authorized'), false);
});

test('credential possession is insufficient without verified profile-defined binding evidence', () => {
  const profile = { ...publicProfile, binding_method: ids.BINDING_METHODS.CREDENTIAL_EVIDENCE };
  const result = run(profile, ref('did:example:alice', profile, { kind: 'global' }), [binding({ profile, credential_verified: false })]);
  assert.deepEqual(result, { decision: 'indeterminate', reason: 'identifier-binding-evidence-insufficient' });
});

test('conflicting authoritative bindings yield indeterminate conflict', () => {
  const result = run(publicProfile, ref('did:example:alice', publicProfile, { kind: 'global' }), [
    binding({ subject: 'subject:A' }),
    binding({ subject: 'subject:B' })
  ]);
  assert.equal(result.decision, 'indeterminate');
  assert.equal(result.reason, 'identifier-binding-conflict');
});

test('missing normalization rules do not permit implementation-specific equivalence', () => {
  const request = { identifier: ref('did:example:ALICE', publicProfile, { kind: 'global' }), evaluation_time: NOW };
  const records = [binding()];
  const a = ids.evaluateEntityIdentifier(request, records, publicProfile, {});
  const b = independent.evaluate({ request, records, profile: publicProfile, options: {} });
  assert.equal(a.decision, b.decision);
  assert.equal(a.reason, b.reason);
});

test('registry lookup failure is indeterminate, not negative', () => {
  const result = run(publicProfile, ref('did:example:alice', publicProfile, { kind: 'global' }), [binding()], { options: { lookup_state: 'unavailable' } });
  assert.deepEqual(result, { decision: 'indeterminate', reason: 'identifier-lookup-unavailable' });
});

test('rotation preserves valid historical evidence without making old identifier current', () => {
  const old = binding({ value: 'did:example:alice-old', until: '2026-08-01T00:00:00Z' });
  const current = binding({ value: 'did:example:alice-new', from: '2026-08-01T00:00:01Z' });
  const historical = run(publicProfile, ref('did:example:alice-old', publicProfile, { kind: 'global' }), [old, current], { evaluation_time: '2026-06-01T00:00:00Z' });
  const currentOld = run(publicProfile, ref('did:example:alice-old', publicProfile, { kind: 'global' }), [old, current]);
  assert.equal(historical.decision, 'positive');
  assert.notEqual(currentOld.decision, 'positive');
});

test('identifier-scheme migration cannot silently change the subject proposition', () => {
  const local = binding({ value: 'A-1842', profile: localProfile, scope: { kind: 'authority', id: 'did:example:authority-r' } });
  const result = run(publicProfile, ref('did:example:alice', publicProfile, { kind: 'global' }), [local]);
  assert.notEqual(result.decision, 'positive');
});

test('local differential evaluator converges across positive, scope, lexical and conflict vectors', () => {
  const vectors = [
    { profile: publicProfile, id: ref('did:example:alice', publicProfile, { kind: 'global' }), records: [binding()] },
    { profile: publicProfile, id: ref('did:example:ALICE', publicProfile, { kind: 'global' }), records: [binding()] },
    { profile: localProfile, id: ref('A-1842', localProfile, { kind: 'authority', id: 'did:example:authority-r' }), records: [binding({ value: 'A-1842', profile: localProfile, scope: { kind: 'authority', id: 'did:example:authority-r' } })] },
    { profile: publicProfile, id: ref('did:example:alice', publicProfile, { kind: 'global' }), records: [binding({ subject: 'subject:A' }), binding({ subject: 'subject:B' })] }
  ];
  for (const v of vectors) {
    const request = { identifier: v.id, evaluation_time: NOW };
    const a = ids.evaluateEntityIdentifier(request, v.records, v.profile, {});
    const b = independent.evaluate({ request, records: v.records, profile: v.profile, options: {} });
    assert.equal(a.decision, b.decision);
    assert.equal(a.reason, b.reason);
  }
});
