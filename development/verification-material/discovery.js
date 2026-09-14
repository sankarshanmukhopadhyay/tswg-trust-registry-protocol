'use strict';

const CAPABILITY_DOCUMENT_TYPE = 'trqp-capability-v1';

function uniqueStrings(value) {
  return Array.isArray(value) && value.length > 0 && value.every(v => typeof v === 'string' && v.length > 0) && new Set(value).size === value.length;
}

function parseTime(value) {
  if (typeof value !== 'string') return NaN;
  return Date.parse(value);
}

function validateCapabilityDocument(document, options = {}) {
  const now = options.now ? new Date(options.now).getTime() : Date.now();
  const authorizedPublishers = options.authorized_publishers || [];

  if (!document || document.type !== CAPABILITY_DOCUMENT_TYPE) return { valid: false, reason: 'malformed-capability-document' };
  if (typeof document.service_id !== 'string' || !document.service_id) return { valid: false, reason: 'malformed-capability-document' };
  if (typeof document.publisher_id !== 'string' || !document.publisher_id) return { valid: false, reason: 'malformed-capability-document' };
  if (!uniqueStrings(document.trqp_versions) || !uniqueStrings(document.processing_profiles)) return { valid: false, reason: 'malformed-capability-document' };
  if (!Array.isArray(document.endpoints) || document.endpoints.length === 0 || document.endpoints.some(e => !e || typeof e.uri !== 'string' || !e.uri)) return { valid: false, reason: 'malformed-capability-document' };

  const issued = parseTime(document.issued_at);
  const expires = parseTime(document.expires_at);
  if (!Number.isFinite(issued) || !Number.isFinite(expires) || issued >= expires) return { valid: false, reason: 'malformed-capability-document' };
  if (expires <= now) return { valid: false, reason: 'stale-capability-metadata' };
  if (authorizedPublishers.length > 0 && !authorizedPublishers.includes(document.publisher_id)) return { valid: false, reason: 'unauthorized-capability-publisher' };

  return {
    valid: true,
    service_id: document.service_id,
    publisher_id: document.publisher_id,
    trqp_versions: [...document.trqp_versions],
    processing_profiles: [...document.processing_profiles],
    endpoints: document.endpoints.map(e => ({ ...e }))
  };
}

function reconcileCapabilityDocuments(documents, options = {}) {
  if (!Array.isArray(documents) || documents.length === 0) return { resolved: false, reason: 'capability-metadata-unavailable' };
  const validated = documents.map(document => ({ document, result: validateCapabilityDocument(document, options) }));
  const usable = validated.filter(item => item.result.valid);
  if (usable.length === 0) return { resolved: false, reason: validated[0].result.reason };

  const serviceIds = new Set(usable.map(item => item.result.service_id));
  if (serviceIds.size !== 1) return { resolved: false, reason: 'conflicting-capability-metadata' };

  const fingerprints = new Set(usable.map(item => JSON.stringify({
    versions: [...item.result.trqp_versions].sort(),
    profiles: [...item.result.processing_profiles].sort()
  })));
  if (fingerprints.size > 1) return { resolved: false, reason: 'conflicting-capability-metadata' };

  usable.sort((a, b) => parseTime(b.document.issued_at) - parseTime(a.document.issued_at));
  return { resolved: true, capability: usable[0].result };
}

function admitDiscoveredCapability(request, capabilityResult) {
  if (!capabilityResult || !capabilityResult.valid) return { admitted: false, reason: capabilityResult?.reason || 'capability-metadata-unavailable' };
  if (!request || typeof request.trqp_version !== 'string') return { admitted: false, reason: 'malformed-discovery-request' };

  const requiredProfiles = request.required_profiles || [];
  if (!Array.isArray(requiredProfiles) || requiredProfiles.some(p => typeof p !== 'string' || !p)) return { admitted: false, reason: 'malformed-discovery-request' };
  if (!capabilityResult.trqp_versions.includes(request.trqp_version)) return { admitted: false, reason: 'version-downgrade-rejected' };
  if (requiredProfiles.some(p => !capabilityResult.processing_profiles.includes(p))) return { admitted: false, reason: 'profile-downgrade-rejected' };

  return {
    admitted: true,
    service_id: capabilityResult.service_id,
    endpoints: capabilityResult.endpoints,
    note: 'discovery admission does not establish authorization, recognition, or registry authority'
  };
}

module.exports = { CAPABILITY_DOCUMENT_TYPE, validateCapabilityDocument, reconcileCapabilityDocuments, admitDiscoveredCapability };
