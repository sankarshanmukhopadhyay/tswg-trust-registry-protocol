'use strict';

const { evaluateMaterialBoundAuthorization } = require('./evaluator');

const QUALIFIER_HANDLING = Object.freeze({
  EVALUATED: 'evaluated',
  UNSUPPORTED_CRITICAL_QUALIFIER: 'unsupported-critical-qualifier',
  UNSUPPORTED_OPTIONAL_QUALIFIER_IGNORED: 'unsupported-optional-qualifier-ignored'
});

function requireObject(value, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${field} must be an object`);
  }
  return value;
}

function normalizeCapabilities(capabilities = {}) {
  requireObject(capabilities, 'capabilities');
  return Object.freeze({
    verification_material: capabilities.verification_material === true
  });
}

/**
 * Downstream experimental request processor used to falsify unsafe extension
 * downgrade. It does not alter TRQP v2 schemas and is not normative wire
 * behaviour.
 *
 * A qualifier is decision-critical when the client declares that the query
 * proposition MUST include that condition. An endpoint that cannot evaluate a
 * critical condition returns an explicit non-authorizing processing result and
 * MUST NOT evaluate the remaining broader query.
 */
function processAuthorizationRequest(input, records, capabilities = {}) {
  requireObject(input, 'authorization request');
  const supported = normalizeCapabilities(capabilities);
  const qualifier = input.verification_material;

  if (qualifier === undefined) {
    return Object.freeze({
      processed: false,
      authorized: false,
      handling: QUALIFIER_HANDLING.EVALUATED,
      reason: 'principal-only evaluation is outside the WP3 reference processor'
    });
  }

  requireObject(qualifier, 'verification_material qualifier');

  const critical = qualifier.critical === true;

  if (!supported.verification_material) {
    if (critical) {
      return Object.freeze({
        processed: false,
        authorized: false,
        handling: QUALIFIER_HANDLING.UNSUPPORTED_CRITICAL_QUALIFIER,
        qualifier: 'verification_material',
        material_bound: true
      });
    }

    return Object.freeze({
      processed: false,
      authorized: false,
      handling: QUALIFIER_HANDLING.UNSUPPORTED_OPTIONAL_QUALIFIER_IGNORED,
      qualifier: 'verification_material',
      material_bound: false
    });
  }

  if (typeof qualifier.id !== 'string' || qualifier.id.trim() === '') {
    throw new TypeError('verification_material.id must be a non-empty string');
  }

  const result = evaluateMaterialBoundAuthorization({
    authority_id: input.authority_id,
    principal_id: input.principal_id,
    action: input.action,
    resource: input.resource,
    verification_material_id: qualifier.id
  }, records);

  return Object.freeze({
    processed: true,
    handling: QUALIFIER_HANDLING.EVALUATED,
    critical,
    ...result
  });
}

module.exports = {
  QUALIFIER_HANDLING,
  processAuthorizationRequest
};
