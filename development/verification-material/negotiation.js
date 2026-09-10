'use strict';

const CANDIDATE_VERSION = '3.0-candidate';
const REQUIRED_SEMANTICS = Object.freeze([
  'critical-context-fail-closed',
  'material-bound-evaluation',
  'decision-reason-classes'
]);

function uniqueStrings(value) {
  return Array.isArray(value) && value.every(v => typeof v === 'string' && v.length > 0) && new Set(value).size === value.length;
}

function capability(overrides = {}) {
  return {
    trqp_versions: ['2.0'],
    candidate_profiles: [],
    processing_semantics: [],
    ...overrides
  };
}

function negotiate(request, peer) {
  if (!request || request.trqp_version !== CANDIDATE_VERSION) {
    return { admitted: false, route: 'legacy-or-unsupported', reason: 'candidate-version-not-requested' };
  }

  if (!peer || !uniqueStrings(peer.trqp_versions) || !peer.trqp_versions.includes(CANDIDATE_VERSION)) {
    return { admitted: false, route: 'reject', decision: 'indeterminate', reason: 'required-profile-unsupported' };
  }

  const requiredProfiles = request.required_profiles || [];
  if (!uniqueStrings(requiredProfiles)) {
    return { admitted: false, route: 'reject', decision: 'indeterminate', reason: 'profile-contract-unsatisfied' };
  }

  const peerProfiles = uniqueStrings(peer.candidate_profiles) ? peer.candidate_profiles : [];
  if (requiredProfiles.some(p => !peerProfiles.includes(p))) {
    return { admitted: false, route: 'reject', decision: 'indeterminate', reason: 'required-profile-unsupported' };
  }

  const semantics = uniqueStrings(peer.processing_semantics) ? peer.processing_semantics : [];
  const missing = REQUIRED_SEMANTICS.filter(s => !semantics.includes(s));
  if (missing.length > 0) {
    return { admitted: false, route: 'reject', decision: 'indeterminate', reason: 'profile-contract-unsatisfied', missing_semantics: missing };
  }

  const critical = request.critical_context || [];
  if (!uniqueStrings(critical)) {
    return { admitted: false, route: 'reject', decision: 'indeterminate', reason: 'unsupported-critical-context' };
  }

  const supportedContext = uniqueStrings(peer.supported_context) ? peer.supported_context : [];
  const unsupported = critical.filter(name => !supportedContext.includes(name));
  if (unsupported.length > 0) {
    return { admitted: false, route: 'reject', decision: 'indeterminate', reason: 'unsupported-critical-context', unsupported_context: unsupported };
  }

  return {
    admitted: true,
    route: 'candidate',
    negotiated_version: CANDIDATE_VERSION,
    profiles: requiredProfiles,
    processing_semantics: REQUIRED_SEMANTICS
  };
}

module.exports = { CANDIDATE_VERSION, REQUIRED_SEMANTICS, capability, negotiate };
