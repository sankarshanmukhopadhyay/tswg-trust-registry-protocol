'use strict';

// Deliberately independent implementation of the S21-05 capability contract.
// It does not import discovery.js or discovery-well-known.js. The purpose is
// differential evidence: two implementations consume the same wire-shaped
// capability document and must converge on the same externally observable
// admission outcomes.

function strings(value) {
  return Array.isArray(value) && value.length > 0 && value.every(x => typeof x === 'string' && x.length > 0) && new Set(value).size === value.length;
}

function inspectCapability(doc, policy = {}) {
  if (!doc || doc.type !== 'trqp-capability-v1' || typeof doc.service_id !== 'string' || !doc.service_id || typeof doc.publisher_id !== 'string' || !doc.publisher_id) {
    return { valid: false, reason: 'malformed-capability-document' };
  }
  if (!strings(doc.trqp_versions) || !strings(doc.processing_profiles) || !Array.isArray(doc.endpoints) || doc.endpoints.length === 0 || doc.endpoints.some(x => !x || typeof x.uri !== 'string' || !x.uri)) {
    return { valid: false, reason: 'malformed-capability-document' };
  }
  const issued = Date.parse(doc.issued_at);
  const expires = Date.parse(doc.expires_at);
  if (!Number.isFinite(issued) || !Number.isFinite(expires) || issued >= expires) return { valid: false, reason: 'malformed-capability-document' };
  const now = policy.now ? Date.parse(policy.now) : Date.now();
  if (expires <= now) return { valid: false, reason: 'stale-capability-metadata' };
  if (Array.isArray(policy.authorized_publishers) && policy.authorized_publishers.length && !policy.authorized_publishers.includes(doc.publisher_id)) {
    return { valid: false, reason: 'unauthorized-capability-publisher' };
  }
  return { valid: true, service_id: doc.service_id, publisher_id: doc.publisher_id, trqp_versions: [...doc.trqp_versions], processing_profiles: [...doc.processing_profiles], endpoints: doc.endpoints.map(x => ({ ...x })) };
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

module.exports = { inspectCapability, admit };
