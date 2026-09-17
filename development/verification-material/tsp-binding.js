'use strict';

const MESSAGE_TYPES = new Set(['query', 'response', 'problem']);
const TSP_CRITICAL_BINDINGS = Object.freeze({
  requester_vid: 'sender_vid',
  receiver_vid: 'receiver_vid'
});

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateEnvelope(envelope) {
  const errors = [];

  if (!isObject(envelope)) {
    return { ok: false, errors: ['envelope must be an object'] };
  }

  if (envelope.protocol !== 'trqp') errors.push('protocol must be trqp');
  if (envelope.protocol_version !== '3.0-candidate') errors.push('unsupported protocol_version');
  if (envelope.binding !== 'tsp') errors.push('binding must be tsp');
  if (!MESSAGE_TYPES.has(envelope.message_type)) errors.push('unsupported message_type');
  if (typeof envelope.message_id !== 'string' || envelope.message_id.length === 0) {
    errors.push('message_id is required');
  }
  if (!isObject(envelope.body)) errors.push('body must be an object');

  if (envelope.message_type === 'query' && Object.hasOwn(envelope, 'in_reply_to')) {
    errors.push('query must not contain in_reply_to');
  }

  if ((envelope.message_type === 'response' || envelope.message_type === 'problem') &&
      (typeof envelope.in_reply_to !== 'string' || envelope.in_reply_to.length === 0)) {
    errors.push('response/problem requires in_reply_to');
  }

  if (envelope.message_type === 'problem' && isObject(envelope.body) && Object.hasOwn(envelope.body, 'decision')) {
    errors.push('binding problem must not contain semantic decision');
  }

  return { ok: errors.length === 0, errors };
}

function projectTransportFacts(transport = {}) {
  return Object.freeze({
    tsp_sender_vid: transport.sender_vid ?? null,
    tsp_receiver_vid: transport.receiver_vid ?? null,
    tsp_authenticated: transport.authenticated === true,
    tsp_relationship_verified: transport.relationship_verified === true
  });
}

function bindingProblem(code, failedRequirement, detail) {
  return Object.freeze({
    kind: 'binding-processing-failure',
    code,
    failed_requirement: failedRequirement,
    detail
  });
}

function checkCriticalTransportContext(envelope, transport = {}) {
  const validation = validateEnvelope(envelope);
  if (!validation.ok) {
    return {
      ok: false,
      problem: bindingProblem(
        'invalid-binding-envelope',
        'TRQP3-TSP-001',
        validation.errors.join('; ')
      )
    };
  }

  if (envelope.message_type !== 'query') {
    return { ok: true, transport_facts: projectTransportFacts(transport) };
  }

  const body = envelope.body;
  const critical = new Set(Array.isArray(body.critical_context) ? body.critical_context : []);
  const context = isObject(body.context) ? body.context : {};

  for (const [contextName, transportName] of Object.entries(TSP_CRITICAL_BINDINGS)) {
    if (!critical.has(contextName)) continue;

    if (typeof context[contextName] !== 'string' || context[contextName].length === 0) {
      return {
        ok: false,
        problem: bindingProblem(
          'missing-critical-tsp-context',
          'TRQP3-TSP-006',
          `${contextName} is declared critical but is missing from context`
        )
      };
    }

    if (typeof transport[transportName] !== 'string' || transport[transportName].length === 0) {
      return {
        ok: false,
        problem: bindingProblem(
          'unavailable-authenticated-tsp-context',
          'TRQP3-TSP-006',
          `authenticated TSP ${transportName} is unavailable`
        )
      };
    }

    if (context[contextName] !== transport[transportName]) {
      return {
        ok: false,
        problem: bindingProblem(
          'tsp-critical-context-mismatch',
          'TRQP3-TSP-006',
          `${contextName} does not match authenticated TSP ${transportName}`
        )
      };
    }
  }

  return { ok: true, transport_facts: projectTransportFacts(transport) };
}

function correlates(queryEnvelope, replyEnvelope) {
  const queryValidation = validateEnvelope(queryEnvelope);
  const replyValidation = validateEnvelope(replyEnvelope);
  if (!queryValidation.ok || !replyValidation.ok) return false;
  if (queryEnvelope.message_type !== 'query') return false;
  if (!['response', 'problem'].includes(replyEnvelope.message_type)) return false;
  return replyEnvelope.in_reply_to === queryEnvelope.message_id;
}

function classifyTspFailure(code, detail) {
  return bindingProblem(code, 'TRQP3-TSP-008', detail);
}

module.exports = {
  validateEnvelope,
  projectTransportFacts,
  checkCriticalTransportContext,
  correlates,
  classifyTspFailure
};
