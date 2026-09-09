'use strict';

const { createPrincipalMaterialBinding, MATERIAL_STATUSES } = require('./model');

const EVALUATION_OUTCOMES = Object.freeze({
  MATCH: 'match',
  PRINCIPAL_NOT_FOUND: 'principal-not-found',
  MATERIAL_NOT_FOUND: 'material-not-found',
  MATERIAL_PRINCIPAL_MISMATCH: 'material-principal-mismatch',
  MATERIAL_NOT_VALID: 'material-not-valid',
  AUTHORITY_MISMATCH: 'authority-mismatch',
  ACTION_MISMATCH: 'action-mismatch',
  RESOURCE_MISMATCH: 'resource-mismatch'
});

function requireString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${field} must be a non-empty string`);
  }
  return value;
}

/**
 * Create a bounded authorization record for the downstream reference model.
 * This is deliberately not a TRQP v2 wire object.
 */
function createMaterialAuthorization(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('material authorization must be an object');
  }

  const binding = createPrincipalMaterialBinding({
    principal_id: input.principal_id,
    verification_material: input.verification_material
  });

  return Object.freeze({
    authority_id: requireString(input.authority_id, 'authority_id'),
    principal_id: binding.principal_id,
    action: requireString(input.action, 'action'),
    resource: requireString(input.resource, 'resource'),
    verification_material: binding.verification_material
  });
}

/**
 * Evaluate an explicitly material-bound request against known authorization
 * records. Failure to match the requested material never falls back to a
 * principal-only authorization decision.
 */
function evaluateMaterialBoundAuthorization(request, records) {
  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    throw new TypeError('material-bound request must be an object');
  }
  if (!Array.isArray(records)) {
    throw new TypeError('authorization records must be an array');
  }

  const principalId = requireString(request.principal_id, 'principal_id');
  const materialId = requireString(request.verification_material_id, 'verification_material_id');
  const authorityId = requireString(request.authority_id, 'authority_id');
  const action = requireString(request.action, 'action');
  const resource = requireString(request.resource, 'resource');

  const principalRecords = records.filter((record) => record.principal_id === principalId);
  if (principalRecords.length === 0) {
    return decision(false, EVALUATION_OUTCOMES.PRINCIPAL_NOT_FOUND, principalId, materialId);
  }

  const materialAnywhere = records.find((record) => record.verification_material.id === materialId);
  if (materialAnywhere && materialAnywhere.principal_id !== principalId) {
    return decision(false, EVALUATION_OUTCOMES.MATERIAL_PRINCIPAL_MISMATCH, principalId, materialId);
  }

  const materialRecords = principalRecords.filter(
    (record) => record.verification_material.id === materialId
  );
  if (materialRecords.length === 0) {
    return decision(false, EVALUATION_OUTCOMES.MATERIAL_NOT_FOUND, principalId, materialId);
  }

  const currentMaterialRecords = materialRecords.filter(
    (record) => record.verification_material.status === MATERIAL_STATUSES.VALID
  );
  if (currentMaterialRecords.length === 0) {
    return decision(false, EVALUATION_OUTCOMES.MATERIAL_NOT_VALID, principalId, materialId);
  }

  const authorityRecords = currentMaterialRecords.filter((record) => record.authority_id === authorityId);
  if (authorityRecords.length === 0) {
    return decision(false, EVALUATION_OUTCOMES.AUTHORITY_MISMATCH, principalId, materialId);
  }

  const actionRecords = authorityRecords.filter((record) => record.action === action);
  if (actionRecords.length === 0) {
    return decision(false, EVALUATION_OUTCOMES.ACTION_MISMATCH, principalId, materialId);
  }

  const resourceRecords = actionRecords.filter((record) => record.resource === resource);
  if (resourceRecords.length === 0) {
    return decision(false, EVALUATION_OUTCOMES.RESOURCE_MISMATCH, principalId, materialId);
  }

  return decision(true, EVALUATION_OUTCOMES.MATCH, principalId, materialId);
}

function decision(authorized, outcome, principalId, materialId) {
  return Object.freeze({
    authorized,
    outcome,
    principal_id: principalId,
    verification_material_id: materialId,
    material_bound: true
  });
}

module.exports = {
  EVALUATION_OUTCOMES,
  createMaterialAuthorization,
  evaluateMaterialBoundAuthorization
};
