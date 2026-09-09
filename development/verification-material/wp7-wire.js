'use strict';

const DECISIONS = Object.freeze({
  PROCESSED: 'processed',
  INDETERMINATE: 'indeterminate'
});

const REASONS = Object.freeze({
  UNSUPPORTED_CRITICAL_CONTEXT: 'unsupported-critical-context',
  REQUIRED_PROFILE_UNSUPPORTED: 'required-profile-unsupported',
  PROFILE_NOT_NEGOTIATED: 'profile-not-negotiated',
  PROCESSED: 'processed'
});

function normalizeStrings(value, field) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((v) => typeof v !== 'string' || !v.trim())) {
    throw new TypeError(`${field} must be an array of non-empty strings`);
  }
  return [...new Set(value)];
}

function evaluateCompatibility(request, endpoint) {
  if (!request || typeof request !== 'object') throw new TypeError('request must be an object');
  if (!endpoint || typeof endpoint !== 'object') throw new TypeError('endpoint must be an object');

  const context = request.context && typeof request.context === 'object' ? request.context : {};
  const critical = normalizeStrings(request.critical_context, 'critical_context');
  const supportedContext = new Set(normalizeStrings(endpoint.supported_context, 'supported_context'));
  const requestedProfiles = normalizeStrings(request.required_profiles, 'required_profiles');
  const supportedProfiles = new Set(normalizeStrings(endpoint.supported_profiles, 'supported_profiles'));

  const absentCritical = critical.filter((name) => !Object.hasOwn(context, name));
  if (absentCritical.length) throw new TypeError(`critical context member absent from context: ${absentCritical.join(', ')}`);

  const unsupportedCritical = critical.filter((name) => !supportedContext.has(name));
  if (unsupportedCritical.length) {
    return Object.freeze({
      decision: DECISIONS.INDETERMINATE,
      reason: REASONS.UNSUPPORTED_CRITICAL_CONTEXT,
      unsupported_critical_context: Object.freeze(unsupportedCritical)
    });
  }

  const unsupportedProfiles = requestedProfiles.filter((name) => !supportedProfiles.has(name));
  if (unsupportedProfiles.length) {
    return Object.freeze({
      decision: DECISIONS.INDETERMINATE,
      reason: REASONS.REQUIRED_PROFILE_UNSUPPORTED,
      unsupported_profiles: Object.freeze(unsupportedProfiles)
    });
  }

  const understoodContext = Object.fromEntries(
    Object.entries(context).filter(([name]) => supportedContext.has(name))
  );

  return Object.freeze({
    decision: DECISIONS.PROCESSED,
    reason: REASONS.PROCESSED,
    negotiated_profiles: Object.freeze(requestedProfiles),
    context: Object.freeze(understoodContext)
  });
}

// Models approved TRQP v2 extensibility: unknown context members are ignored.
function simulateLegacyV2(request, evaluator) {
  const context = request.context && typeof request.context === 'object' ? request.context : {};
  const legacyContext = Object.fromEntries(
    Object.entries(context).filter(([name]) => name === 'time')
  );
  return evaluator({ ...request, context: legacyContext });
}

module.exports = { DECISIONS, REASONS, evaluateCompatibility, simulateLegacyV2 };
