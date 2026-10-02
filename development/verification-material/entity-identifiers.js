'use strict';

const IDENTIFIER_CLASSES = Object.freeze({
  PUBLIC_URI: 'public-uri',
  AUTHORITY_LOCAL: 'authority-local',
  RELATIONSHIP_SCOPED: 'relationship-scoped',
  CREDENTIAL_BOUND: 'credential-bound'
});
const SCOPE_KINDS = Object.freeze({ GLOBAL: 'global', AUTHORITY: 'authority', RELATIONSHIP: 'relationship', CONTEXT: 'context' });
const COMPARISON_MODES = Object.freeze({ EXACT: 'exact', EXPLICIT_EQUIVALENCE: 'explicit-equivalence' });
const RESOLUTION_MODES = Object.freeze({ REQUIRED: 'required', OPTIONAL: 'optional', NOT_USED: 'not-used' });
const BINDING_METHODS = Object.freeze({ REGISTRY: 'registry', RESOLUTION: 'resolution', CREDENTIAL_EVIDENCE: 'credential-evidence', EXPLICIT_MAPPING: 'explicit-mapping' });
const BINDING_STATUSES = Object.freeze({ ACTIVE: 'active', SUPERSEDED: 'superseded', REVOKED: 'revoked', EXPIRED: 'expired' });
const DECISIONS = Object.freeze({ POSITIVE: 'positive', NEGATIVE: 'negative', INDETERMINATE: 'indeterminate' });

function nonEmpty(value) { return typeof value === 'string' && value.length > 0; }
function parseTime(value) { return nonEmpty(value) ? Date.parse(value) : NaN; }

function createIdentifierProfile(input) {
  if (!input || !nonEmpty(input.profile_id)) throw new Error('profile_id must be a non-empty string');
  if (!Object.values(IDENTIFIER_CLASSES).includes(input.identifier_class)) throw new Error('unsupported identifier class');
  if (!Object.values(SCOPE_KINDS).includes(input.scope_kind)) throw new Error('unsupported scope kind');
  if (!Object.values(COMPARISON_MODES).includes(input.comparison_mode)) throw new Error('unsupported comparison mode');
  if (!Object.values(RESOLUTION_MODES).includes(input.resolution_mode)) throw new Error('unsupported resolution mode');
  if (!Object.values(BINDING_METHODS).includes(input.binding_method)) throw new Error('unsupported binding method');
  if (input.identifier_class === IDENTIFIER_CLASSES.AUTHORITY_LOCAL && input.scope_kind !== SCOPE_KINDS.AUTHORITY) throw new Error('authority-local identifiers must use authority scope');
  if (input.identifier_class === IDENTIFIER_CLASSES.RELATIONSHIP_SCOPED && input.scope_kind !== SCOPE_KINDS.RELATIONSHIP) throw new Error('relationship-scoped identifiers must use relationship scope');
  return Object.freeze({
    profile_id: input.profile_id,
    identifier_class: input.identifier_class,
    scope_kind: input.scope_kind,
    comparison_mode: input.comparison_mode,
    resolution_mode: input.resolution_mode,
    binding_method: input.binding_method,
    public_correlation: input.public_correlation === true
  });
}

function createIdentifierReference(input) {
  if (!input || !nonEmpty(input.value)) throw new Error('identifier value must be a non-empty string');
  if (!nonEmpty(input.profile_id)) throw new Error('identifier profile_id must be a non-empty string');
  if (!input.scope || !Object.values(SCOPE_KINDS).includes(input.scope.kind)) throw new Error('identifier scope kind is required');
  if (input.scope.kind !== SCOPE_KINDS.GLOBAL && !nonEmpty(input.scope.id)) throw new Error('scoped identifier requires scope id');
  return Object.freeze({ value: input.value, profile_id: input.profile_id, scope: Object.freeze({ kind: input.scope.kind, id: input.scope.id || null }) });
}

function createBinding(input) {
  if (!input || !nonEmpty(input.subject_id)) throw new Error('subject_id must be a non-empty string');
  const identifier = createIdentifierReference(input.identifier);
  if (!Object.values(BINDING_STATUSES).includes(input.status)) throw new Error('unsupported binding status');
  const from = input.valid_from ? parseTime(input.valid_from) : Number.NEGATIVE_INFINITY;
  const until = input.valid_until ? parseTime(input.valid_until) : Number.POSITIVE_INFINITY;
  if (!Number.isFinite(from) && input.valid_from) throw new Error('valid_from must be an RFC3339 timestamp');
  if (!Number.isFinite(until) && input.valid_until) throw new Error('valid_until must be an RFC3339 timestamp');
  if (from > until) throw new Error('valid_from must not be later than valid_until');
  const aliases = input.aliases || [];
  if (!Array.isArray(aliases) || aliases.some(x => !nonEmpty(x)) || new Set(aliases).size !== aliases.length) throw new Error('aliases must be unique non-empty strings');
  return Object.freeze({
    subject_id: input.subject_id,
    identifier,
    status: input.status,
    authoritative: input.authoritative === true,
    complete_for_scope: input.complete_for_scope === true,
    credential_verified: input.credential_verified === true,
    valid_from: input.valid_from || null,
    valid_until: input.valid_until || null,
    aliases: Object.freeze([...aliases])
  });
}

function scopeMatches(profile, requested, recorded) {
  if (requested.kind !== profile.scope_kind || recorded.kind !== profile.scope_kind) return false;
  return profile.scope_kind === SCOPE_KINDS.GLOBAL || requested.id === recorded.id;
}

function identifierMatches(profile, requestedValue, binding) {
  if (requestedValue === binding.identifier.value) return true;
  return profile.comparison_mode === COMPARISON_MODES.EXPLICIT_EQUIVALENCE && binding.aliases.includes(requestedValue);
}

function bindingAppliesAt(binding, at) {
  const t = parseTime(at);
  if (!Number.isFinite(t)) return false;
  const from = binding.valid_from ? parseTime(binding.valid_from) : Number.NEGATIVE_INFINITY;
  const until = binding.valid_until ? parseTime(binding.valid_until) : Number.POSITIVE_INFINITY;
  return t >= from && t <= until;
}

function evaluateEntityIdentifier(request, records, profile, options = {}) {
  let p;
  try { p = createIdentifierProfile(profile); } catch (error) {
    return { decision: DECISIONS.INDETERMINATE, reason: 'unsupported-identifier-profile', detail: error.message };
  }
  let ref;
  try { ref = createIdentifierReference(request?.identifier); } catch (error) {
    return { decision: DECISIONS.INDETERMINATE, reason: 'malformed-identifier-reference', detail: error.message };
  }
  if (ref.profile_id !== p.profile_id) return { decision: DECISIONS.INDETERMINATE, reason: 'identifier-profile-mismatch' };
  if (ref.scope.kind !== p.scope_kind) return { decision: DECISIONS.INDETERMINATE, reason: 'identifier-scope-mismatch' };
  if (options.lookup_state === 'unavailable') return { decision: DECISIONS.INDETERMINATE, reason: 'identifier-lookup-unavailable' };
  if (p.resolution_mode === RESOLUTION_MODES.REQUIRED && options.resolution_state !== 'resolved') {
    return { decision: DECISIONS.INDETERMINATE, reason: options.resolution_state === 'unsupported' ? 'identifier-resolution-unsupported' : 'identifier-resolution-unavailable' };
  }
  const at = request.evaluation_time || options.now;
  if (!nonEmpty(at) || !Number.isFinite(parseTime(at))) return { decision: DECISIONS.INDETERMINATE, reason: 'identifier-evaluation-time-invalid' };

  const all = Array.isArray(records) ? records : [];
  const scoped = all.filter(r => r.identifier.profile_id === p.profile_id && scopeMatches(p, ref.scope, r.identifier.scope));
  const matching = scoped.filter(r => identifierMatches(p, ref.value, r));
  if (new Set(matching.map(r => r.subject_id)).size > 1) return { decision: DECISIONS.INDETERMINATE, reason: 'identifier-binding-conflict' };

  const applicable = matching.filter(r => bindingAppliesAt(r, at));
  const authoritativeApplicable = applicable.filter(r => r.authoritative);
  if (new Set(authoritativeApplicable.map(r => r.subject_id)).size > 1) return { decision: DECISIONS.INDETERMINATE, reason: 'identifier-binding-conflict' };

  const current = authoritativeApplicable.find(r => r.status === BINDING_STATUSES.ACTIVE);
  if (current) {
    if (p.binding_method === BINDING_METHODS.CREDENTIAL_EVIDENCE && !current.credential_verified) return { decision: DECISIONS.INDETERMINATE, reason: 'identifier-binding-evidence-insufficient' };
    return { decision: DECISIONS.POSITIVE, reason: 'identifier-binding-supported', subject_id: current.subject_id, identifier: ref.value, profile_id: p.profile_id, scope: ref.scope };
  }
  if (authoritativeApplicable.some(r => [BINDING_STATUSES.SUPERSEDED, BINDING_STATUSES.REVOKED, BINDING_STATUSES.EXPIRED].includes(r.status))) {
    return { decision: DECISIONS.NEGATIVE, reason: 'identifier-binding-not-current' };
  }
  if (scoped.some(r => r.authoritative && r.complete_for_scope)) return { decision: DECISIONS.NEGATIVE, reason: 'identifier-not-bound' };
  return { decision: DECISIONS.INDETERMINATE, reason: 'identifier-binding-insufficient' };
}

function correlationAssessment(profile) {
  const p = createIdentifierProfile(profile);
  if (p.scope_kind === SCOPE_KINDS.GLOBAL && p.public_correlation) return { risk: 'high', reason: 'globally-linkable-public-identifier' };
  if (p.scope_kind !== SCOPE_KINDS.GLOBAL && p.public_correlation) return { risk: 'high', reason: 'scoped-identifier-publication-widens-correlation' };
  if (p.scope_kind !== SCOPE_KINDS.GLOBAL) return { risk: 'bounded', reason: 'scope-limited-identifier' };
  return { risk: 'context-dependent', reason: 'global-identifier-correlation-profile-dependent' };
}

module.exports = { IDENTIFIER_CLASSES, SCOPE_KINDS, COMPARISON_MODES, RESOLUTION_MODES, BINDING_METHODS, BINDING_STATUSES, DECISIONS, createIdentifierProfile, createIdentifierReference, createBinding, evaluateEntityIdentifier, correlationAssessment };
