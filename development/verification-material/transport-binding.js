'use strict';

const semanticDecisions = new Set(['positive', 'negative', 'indeterminate', 'not-applicable']);

function bindRequest(request, transport = {}) {
  if (!request || typeof request !== 'object') throw new TypeError('request required');
  const bound = JSON.parse(JSON.stringify(request));
  return {
    transport: {
      method: transport.method || 'POST',
      endpoint: transport.endpoint || null,
      profile: transport.profile || null
    },
    semantic: bound
  };
}

function processTransportOutcome(outcome) {
  if (!outcome || typeof outcome !== 'object') throw new TypeError('outcome required');

  if (outcome.semantic && semanticDecisions.has(outcome.semantic.decision)) {
    return { kind: 'semantic', ...outcome.semantic };
  }

  return {
    kind: 'processing-failure',
    decision: null,
    transport_status: outcome.status ?? null,
    problem: outcome.problem || null
  };
}

function composeProfiles(profiles = []) {
  const required = new Set();
  const prohibited = new Set();

  for (const profile of profiles) {
    for (const item of profile.required || []) required.add(item);
    for (const item of profile.prohibited || []) prohibited.add(item);
  }

  const conflicts = [...required].filter(item => prohibited.has(item));
  if (conflicts.length) {
    return { admissible: false, reason: 'conflicting-profile-obligations', conflicts };
  }

  return { admissible: true, required: [...required], prohibited: [...prohibited] };
}

module.exports = { bindRequest, processTransportOutcome, composeProfiles };
