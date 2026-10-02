'use strict';

const { validateCapabilityDocument } = require('./discovery');
const { negotiate } = require('./negotiation');

function normalizeDiscoveredCapability(capabilityResult) {
  if (!capabilityResult || !capabilityResult.valid) {
    return { valid: false, reason: capabilityResult?.reason || 'capability-metadata-unavailable' };
  }

  return {
    valid: true,
    service_id: capabilityResult.service_id,
    publisher_id: capabilityResult.publisher_id,
    endpoints: capabilityResult.endpoints.map(e => ({ ...e })),
    peer: {
      trqp_versions: [...capabilityResult.trqp_versions],
      candidate_profiles: [...capabilityResult.processing_profiles],
      processing_semantics: [...capabilityResult.processing_semantics],
      supported_context: [...capabilityResult.supported_context]
    }
  };
}

function negotiateDiscoveredCapability(request, capabilityResult) {
  const normalized = normalizeDiscoveredCapability(capabilityResult);
  if (!normalized.valid) {
    return {
      admitted: false,
      route: 'reject',
      decision: 'indeterminate',
      reason: normalized.reason
    };
  }

  const result = negotiate(request, normalized.peer);
  if (!result.admitted) return result;

  return {
    ...result,
    service_id: normalized.service_id,
    publisher_id: normalized.publisher_id,
    endpoints: normalized.endpoints,
    note: 'validated discovery establishes a processing contract only; it does not establish authorization, recognition, or registry authority'
  };
}

function validateAndNegotiateCapability(document, request, options = {}) {
  return negotiateDiscoveredCapability(request, validateCapabilityDocument(document, options));
}

module.exports = {
  normalizeDiscoveredCapability,
  negotiateDiscoveredCapability,
  validateAndNegotiateCapability
};
