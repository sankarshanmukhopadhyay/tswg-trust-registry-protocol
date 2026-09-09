'use strict';

const MATERIAL_TYPES = Object.freeze({
  X509_CERTIFICATE: 'x509-certificate',
  DID_VERIFICATION_METHOD: 'did-verification-method',
  PUBLIC_KEY: 'public-key',
  OTHER: 'other'
});

const MATERIAL_STATUSES = Object.freeze({
  VALID: 'valid',
  REVOKED: 'revoked',
  EXPIRED: 'expired',
  SUPERSEDED: 'superseded',
  UNKNOWN: 'unknown'
});

function requireNonEmptyString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${field} must be a non-empty string`);
  }
  return value;
}

function optionalDateTime(value, field) {
  if (value === undefined || value === null) return undefined;
  requireNonEmptyString(value, field);
  if (Number.isNaN(Date.parse(value))) {
    throw new TypeError(`${field} must be an RFC3339-compatible date-time string`);
  }
  return value;
}

/**
 * Downstream experimental representation of cryptographic material associated
 * with a TRQP principal. This object is intentionally independent of entity_id
 * and authority_id: it does not redefine either upstream field.
 */
function createVerificationMaterial(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('verification material must be an object');
  }

  const id = requireNonEmptyString(input.id, 'verification material id');
  const type = requireNonEmptyString(input.type, 'verification material type');

  if (!Object.values(MATERIAL_TYPES).includes(type)) {
    throw new TypeError(`unsupported verification material type: ${type}`);
  }

  const status = input.status === undefined ? MATERIAL_STATUSES.UNKNOWN : input.status;
  if (!Object.values(MATERIAL_STATUSES).includes(status)) {
    throw new TypeError(`unsupported verification material status: ${status}`);
  }

  const material = {
    id,
    type,
    status
  };

  if (input.role !== undefined) material.role = requireNonEmptyString(input.role, 'verification material role');

  const validFrom = optionalDateTime(input.valid_from, 'valid_from');
  const validUntil = optionalDateTime(input.valid_until, 'valid_until');
  if (validFrom !== undefined) material.valid_from = validFrom;
  if (validUntil !== undefined) material.valid_until = validUntil;

  if (validFrom && validUntil && Date.parse(validFrom) > Date.parse(validUntil)) {
    throw new TypeError('valid_from must not be later than valid_until');
  }

  return Object.freeze(material);
}

/**
 * Binds independently represented verification material to the semantic
 * principal under evaluation. This is an internal reference-model primitive,
 * not yet a TRQP v2 wire-format proposal.
 */
function createPrincipalMaterialBinding(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('principal/material binding must be an object');
  }

  const principalId = requireNonEmptyString(input.principal_id, 'principal_id');
  const material = createVerificationMaterial(input.verification_material);

  return Object.freeze({
    principal_id: principalId,
    verification_material: material
  });
}

module.exports = {
  MATERIAL_TYPES,
  MATERIAL_STATUSES,
  createVerificationMaterial,
  createPrincipalMaterialBinding
};
