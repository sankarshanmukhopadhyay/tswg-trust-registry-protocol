'use strict';
function evaluate(input) {
  const { request, records = [], profile, options = {} } = input || {};
  if (!profile || !profile.profile_id || !request?.identifier?.value) return { decision: 'indeterminate', reason: 'malformed-identifier-reference' };
  if (request.identifier.profile_id !== profile.profile_id) return { decision: 'indeterminate', reason: 'identifier-profile-mismatch' };
  if (request.identifier.scope?.kind !== profile.scope_kind) return { decision: 'indeterminate', reason: 'identifier-scope-mismatch' };
  if (options.lookup_state === 'unavailable') return { decision: 'indeterminate', reason: 'identifier-lookup-unavailable' };
  if (profile.resolution_mode === 'required' && options.resolution_state !== 'resolved') return { decision: 'indeterminate', reason: options.resolution_state === 'unsupported' ? 'identifier-resolution-unsupported' : 'identifier-resolution-unavailable' };
  const t = Date.parse(request.evaluation_time || options.now || '');
  if (!Number.isFinite(t)) return { decision: 'indeterminate', reason: 'identifier-evaluation-time-invalid' };
  const sameScope = r => request.identifier.scope.kind === profile.scope_kind && r.identifier.scope.kind === profile.scope_kind && (profile.scope_kind === 'global' || request.identifier.scope.id === r.identifier.scope.id);
  const sameValue = r => r.identifier.value === request.identifier.value || (profile.comparison_mode === 'explicit-equivalence' && Array.isArray(r.aliases) && r.aliases.includes(request.identifier.value));
  const inTime = r => t >= (r.valid_from ? Date.parse(r.valid_from) : Number.NEGATIVE_INFINITY) && t <= (r.valid_until ? Date.parse(r.valid_until) : Number.POSITIVE_INFINITY);
  const scoped = records.filter(r => r.identifier?.profile_id === profile.profile_id && sameScope(r));
  const matching = scoped.filter(sameValue);
  if (new Set(matching.map(r => r.subject_id)).size > 1) return { decision: 'indeterminate', reason: 'identifier-binding-conflict' };
  const applicable = matching.filter(inTime).filter(r => r.authoritative);
  if (new Set(applicable.map(r => r.subject_id)).size > 1) return { decision: 'indeterminate', reason: 'identifier-binding-conflict' };
  const active = applicable.find(r => r.status === 'active');
  if (active) {
    if (profile.binding_method === 'credential-evidence' && !active.credential_verified) return { decision: 'indeterminate', reason: 'identifier-binding-evidence-insufficient' };
    return { decision: 'positive', reason: 'identifier-binding-supported', subject_id: active.subject_id };
  }
  if (applicable.some(r => ['superseded','revoked','expired'].includes(r.status))) return { decision: 'negative', reason: 'identifier-binding-not-current' };
  if (scoped.some(r => r.authoritative && r.complete_for_scope)) return { decision: 'negative', reason: 'identifier-not-bound' };
  return { decision: 'indeterminate', reason: 'identifier-binding-insufficient' };
}
module.exports = { evaluate };
