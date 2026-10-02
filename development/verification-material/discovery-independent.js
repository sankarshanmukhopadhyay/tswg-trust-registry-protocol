'use strict';

// Deliberately independent implementation of the S21-05 capability contract.
// It does not import discovery.js, discovery-well-known.js, or negotiation.js.
// The purpose is differential evidence: independently structured code consumes
// the same wire-shaped capability document and must converge on externally
// observable discovery and candidate-negotiation outcomes.

const REQUIRED = Object.freeze([
  'critical-context-fail-closed',
  'material-bound-evaluation',
  'decision-reason-classes'
]);

function strings(value, allowEmpty = false) {
  return Array.isArray(value)
    && (allowEmpty || value.length > 0)
    && value.every(x => typeof x === 'string' && x.length > 0)
    && new Set(value).size === value.length;
}

function inspectCapability(doc, policy = {}) {
  if (!doc || doc.type !== 'trqp-capability-v1' || typeof doc.service_id !== 'string' || !doc.service_id || typeof doc.publisher_id !== 'string' || !doc.publisher_id) {
    return { valid: false, reason: 'malformed-capability-document' };
  }
  if (!strings(doc.trqp_versions) || !strings(doc.processing_profiles) || !Array.isArray(doc.endpoints) || doc.endpoints.length === 0 || doc.endpoints.some(x => !x || typeof x.uri !== 'string' || !x.uri)) {
    return { valid: false, reason: 'malformed-capability-document' };
  }
  if (doc.trqp_versions.includes('3.0-candidate') && (!strings(doc.processing_semantics) || !strings(doc.supported_context, true))) {
    return { valid: false, reason: 'incomplete-candidate-capability' };
  }
  if (doc.processing_semantics !== undefined && !strings(doc.processing_semantics, true)) return { valid: false, reason: 'malformed-capability-document' };
  if (doc.supported_context !== undefined && !strings(doc.supported_context, true)) return { valid: false, reason: 'malformed-capability-document' };

  const issued = Date.parse(doc.issued_at);
  const expires = Date.parse(doc.expires_at);
  if (!Number.isFinite(issued) || !Number.isFinite(expires) || issued >= expires) return { valid: false, reason: 'malformed-capability-document' };
  const now = policy.now ? Date.parse(policy.now) : Date.now();
  if (expires <= now) return { valid: false, reason: 'stale-capability-metadata' };
  if (Array.isArray(policy.authorized_publishers) && policy.authorized_publishers.length && !policy.authorized_publishers.includes(doc.publisher_id)) {
    return { valid: false, reason: 'unauthorized-capability-publisher' };
  }

  return {
    valid: true,
    service_id: doc.service_id,
    publisher_id: doc.publisher_id,
    trqp_versions: [...doc.trqp_versions],
    processing_profiles: [...doc.processing_profiles],
    processing_semantics: [...(doc.processing_semantics || [])],
    supported_context: [...(doc.supported_context || [])],
    endpoints: doc.endpoints.map(x => ({ ...x }))
  };
}

function admit(request, capability) {
  if (!capability || !capability.valid) return { admitted: false, reason: capability?.reason || 'capability-metadata-unavailable' };
  if (!request || typeof request.trqp_version !== 'string' || !Array.isArray(request.required_profiles || []) || (request.required_profiles || []).some(x => typeof x !== 'string' || !x)) {
    return { admitted: false, reason: 'malformed-discovery-request' };
  }
  if (!capability.trqp_versions.includes(request.trqp_version)) return { admitted: false, reason: 'version-downgrade-rejected' };
  if ((request.required_profiles || []).some(x => !capability.processing_profiles.includes(x))) return { admitted: false, reason: 'profile-downgrade-rejected' };
  return { admitted: true, service_id: capability.service_id, endpoints: capability.endpoints };
}

function negotiateCandidate(request, capability) {
  if (!capability || !capability.valid) {
    return { admitted: false, route: 'reject', decision: 'indeterminate', reason: capability?.reason || 'capability-metadata-unavailable' };
  }
  if (!request || request.trqp_version !== '3.0-candidate') {
    return { admitted: false, route: 'legacy-or-unsupported', reason: 'candidate-version-not-requested' };
  }
  if (!capability.trqp_versions.includes('3.0-candidate')) {
    return { admitted: false, route: 'reject', decision: 'indeterminate', reason: 'required-profile-unsupported' };
  }

  const profiles = request.required_profiles || [];
  if (!strings(profiles, true)) return { admitted: false, route: 'reject', decision: 'indeterminate', reason: 'profile-contract-unsatisfied' };
  if (profiles.some(p => !capability.processing_profiles.includes(p))) {
    return { admitted: false, route: 'reject', decision: 'indeterminate', reason: 'required-profile-unsupported' };
  }

  const missing = REQUIRED.filter(s => !capability.processing_semantics.includes(s));
  if (missing.length) {
    return { admitted: false, route: 'reject', decision: 'indeterminate', reason: 'profile-contract-unsatisfied', missing_semantics: missing };
  }

  const critical = request.critical_context || [];
  if (!strings(critical, true)) return { admitted: false, route: 'reject', decision: 'indeterminate', reason: 'unsupported-critical-context' };
  const unsupported = critical.filter(c => !capability.supported_context.includes(c));
  if (unsupported.length) {
    return { admitted: false, route: 'reject', decision: 'indeterminate', reason: 'unsupported-critical-context', unsupported_context: unsupported };
  }

  return {
    admitted: true,
    route: 'candidate',
    negotiated_version: '3.0-candidate',
    profiles,
    processing_semantics: REQUIRED,
    service_id: capability.service_id,
    endpoints: capability.endpoints
  };
}

module.exports = { inspectCapability, admit, negotiateCandidate };
