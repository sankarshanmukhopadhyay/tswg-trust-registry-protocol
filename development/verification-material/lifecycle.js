'use strict';

const { MATERIAL_STATUSES, createVerificationMaterial } = require('./model');

const LIFECYCLE_OUTCOMES = Object.freeze({
  VALID: 'valid',
  NOT_YET_VALID: 'not-yet-valid',
  EXPIRED: 'expired',
  REVOKED: 'revoked',
  SUPERSEDED: 'superseded',
  UNKNOWN: 'unknown'
});

function evaluationTime(value) {
  const time = value === undefined ? new Date() : new Date(value);
  if (Number.isNaN(time.getTime())) {
    throw new TypeError('evaluation_time must be an RFC3339-compatible date-time string');
  }
  return time;
}

/**
 * Evaluate only the lifecycle of independently represented verification
 * material. This function does not alter principal recognition or authority.
 */
function evaluateMaterialLifecycle(input, at) {
  const material = createVerificationMaterial(input);
  const time = evaluationTime(at);

  if (material.valid_from && time < new Date(material.valid_from)) {
    return result(false, LIFECYCLE_OUTCOMES.NOT_YET_VALID, material, time);
  }

  if (material.valid_until && time > new Date(material.valid_until)) {
    return result(false, LIFECYCLE_OUTCOMES.EXPIRED, material, time);
  }

  switch (material.status) {
    case MATERIAL_STATUSES.VALID:
      return result(true, LIFECYCLE_OUTCOMES.VALID, material, time);
    case MATERIAL_STATUSES.REVOKED:
      return result(false, LIFECYCLE_OUTCOMES.REVOKED, material, time);
    case MATERIAL_STATUSES.EXPIRED:
      return result(false, LIFECYCLE_OUTCOMES.EXPIRED, material, time);
    case MATERIAL_STATUSES.SUPERSEDED:
      return result(false, LIFECYCLE_OUTCOMES.SUPERSEDED, material, time);
    default:
      return result(false, LIFECYCLE_OUTCOMES.UNKNOWN, material, time);
  }
}

function result(usable, outcome, material, time) {
  return Object.freeze({
    usable,
    outcome,
    verification_material_id: material.id,
    evaluation_time: time.toISOString()
  });
}

/**
 * Resolve a rotation set for a stable principal at a requested time. Material
 * lifecycle changes do not mutate the principal identifier.
 */
function evaluatePrincipalMaterials(principalId, materials, at) {
  if (typeof principalId !== 'string' || principalId.trim() === '') {
    throw new TypeError('principal_id must be a non-empty string');
  }
  if (!Array.isArray(materials)) {
    throw new TypeError('materials must be an array');
  }

  const evaluations = materials.map((material) => evaluateMaterialLifecycle(material, at));
  return Object.freeze({
    principal_id: principalId,
    evaluations: Object.freeze(evaluations),
    usable_material_ids: Object.freeze(
      evaluations.filter((entry) => entry.usable).map((entry) => entry.verification_material_id)
    )
  });
}

module.exports = {
  LIFECYCLE_OUTCOMES,
  evaluateMaterialLifecycle,
  evaluatePrincipalMaterials
};
