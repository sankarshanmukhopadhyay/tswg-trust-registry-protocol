'use strict';

const DECISIONS = new Set(['positive', 'authoritative-negative', 'indeterminate']);
const REASONS = Object.freeze({
  POSITIVE: new Set(['evidence-supports-proposition']),
  AUTHORITATIVE_NEGATIVE: new Set(['not-listed', 'not-applicable', 'revoked', 'expired', 'superseded', 'wrong-purpose', 'wrong-resource', 'material-mismatch']),
  INDETERMINATE: new Set(['evidence-incomplete', 'evidence-stale', 'evidence-unavailable', 'historical-evidence-incomplete', 'unsupported-critical-context', 'required-profile-unsupported', 'profile-contract-unsatisfied', 'conflicting-evidence'])
});

function nonEmpty(value) { return typeof value === 'string' && value.trim().length > 0; }
function stringArray(value) { return value === undefined || (Array.isArray(value) && value.every(nonEmpty) && new Set(value).size === value.length); }
function dateTime(value) { return nonEmpty(value) && !Number.isNaN(new Date(value).getTime()); }

function validateRequest(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { valid: false, errors: ['request must be an object'] };
  if (value.trqp_version !== '3.0-candidate') errors.push('trqp_version must be 3.0-candidate');
  for (const field of ['entity_id', 'authority_id', 'action', 'resource']) if (!nonEmpty(value[field])) errors.push(`${field} is required`);
  if (!stringArray(value.critical_context)) errors.push('critical_context must contain unique non-empty strings');
  if (!stringArray(value.required_profiles)) errors.push('required_profiles must contain unique non-empty strings');
  const context = value.context || {};
  if (value.context !== undefined && (typeof context !== 'object' || Array.isArray(context))) errors.push('context must be an object');
  if (context.time !== undefined && !dateTime(context.time)) errors.push('context.time must be a date-time');
  if (context.verification_material !== undefined && !nonEmpty(context.verification_material)) errors.push('context.verification_material must be non-empty');
  for (const name of value.critical_context || []) if (!Object.hasOwn(context, name)) errors.push(`critical context member absent: ${name}`);
  return { valid: errors.length === 0, errors };
}

function validReason(decision, reason) {
  if (decision === 'positive') return REASONS.POSITIVE.has(reason);
  if (decision === 'authoritative-negative') return REASONS.AUTHORITATIVE_NEGATIVE.has(reason);
  if (decision === 'indeterminate') return REASONS.INDETERMINATE.has(reason);
  return false;
}

function validateResponse(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { valid: false, errors: ['response must be an object'] };
  if (!DECISIONS.has(value.decision)) errors.push('decision is invalid');
  if (!nonEmpty(value.reason)) errors.push('reason is required');
  else if (DECISIONS.has(value.decision) && !validReason(value.decision, value.reason)) errors.push('reason is invalid for decision');
  if (!dateTime(value.time_evaluated)) errors.push('time_evaluated is required and must be a date-time');
  if (value.time_requested !== undefined && !dateTime(value.time_requested)) errors.push('time_requested must be a date-time');
  if (!Array.isArray(value.evidence)) errors.push('evidence must be an array');
  if (value.decision === 'positive' && value.authorized !== true && value.recognized !== true) errors.push('positive decision requires a positive core boolean');
  if (value.decision === 'authoritative-negative' && (value.authorized === true || value.recognized === true)) errors.push('authoritative-negative decision cannot carry a positive core boolean');
  if (value.decision === 'indeterminate' && (value.authorized === true || value.recognized === true)) errors.push('indeterminate decision cannot carry a positive core boolean');
  for (const evidence of Array.isArray(value.evidence) ? value.evidence : []) {
    if (!nonEmpty(evidence.source_id)) errors.push('evidence.source_id is required');
    if (typeof evidence.authoritative !== 'boolean') errors.push('evidence.authoritative is required');
    if (typeof evidence.complete_for_scope !== 'boolean') errors.push('evidence.complete_for_scope is required');
  }
  return { valid: errors.length === 0, errors };
}

module.exports = { REASONS, validateRequest, validateResponse };
