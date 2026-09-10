'use strict';

const DECISIONS = Object.freeze({
  POSITIVE: 'positive',
  AUTHORITATIVE_NEGATIVE: 'authoritative-negative',
  INDETERMINATE: 'indeterminate'
});

const RECORD_STATES = Object.freeze({
  LISTED_APPLICABLE: 'listed-applicable',
  NOT_LISTED: 'not-listed',
  NOT_APPLICABLE: 'not-applicable',
  REVOKED: 'revoked',
  EXPIRED: 'expired',
  UNKNOWN: 'unknown',
  SOURCE_UNAVAILABLE: 'source-unavailable'
});

const REASONS = Object.freeze({
  EVIDENCE_SUPPORTS_PROPOSITION: 'evidence-supports-proposition',
  AUTHORITATIVE_ABSENCE: 'authoritative-absence',
  NOT_APPLICABLE: 'not-applicable',
  REVOKED: 'revoked',
  EXPIRED: 'expired',
  STALE: 'stale',
  SOURCE_INCOMPLETE: 'source-incomplete',
  SOURCE_NON_AUTHORITATIVE: 'source-non-authoritative',
  SOURCE_UNAVAILABLE: 'source-unavailable',
  UNKNOWN: 'unknown'
});

function nonEmpty(value, field) {
  if (typeof value !== 'string' || value.trim() === '') throw new TypeError(`${field} must be a non-empty string`);
  return value;
}

function time(value, field) {
  if (value === undefined || value === null) return undefined;
  nonEmpty(value, field);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new TypeError(`${field} must be an RFC3339-compatible date-time string`);
  return parsed;
}

function createEvidenceSource(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('evidence source must be an object');
  const source = {
    id: nonEmpty(input.id, 'source id'),
    authoritative: input.authoritative === true,
    complete_for_scope: input.complete_for_scope === true,
    scope: nonEmpty(input.scope, 'scope')
  };
  const observed = time(input.observed_at, 'observed_at');
  const nextUpdate = time(input.next_update, 'next_update');
  if (observed) source.observed_at = observed.toISOString();
  if (nextUpdate) source.next_update = nextUpdate.toISOString();
  if (input.digest !== undefined) source.digest = nonEmpty(input.digest, 'digest');
  return Object.freeze(source);
}

function isFresh(source, at) {
  const evaluation = time(at, 'evaluation_time') || new Date();
  if (!source.observed_at && !source.next_update) return false;
  if (source.observed_at && evaluation < new Date(source.observed_at)) return false;
  if (source.next_update && evaluation > new Date(source.next_update)) return false;
  return true;
}

function evaluateEvidence(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('evidence evaluation must be an object');
  const source = createEvidenceSource(input.source);
  const evaluation = time(input.evaluation_time, 'evaluation_time') || new Date();
  const recordState = nonEmpty(input.record_state, 'record_state');
  if (!Object.values(RECORD_STATES).includes(recordState)) throw new TypeError(`unsupported record state: ${recordState}`);

  const base = {
    source,
    record_state: recordState,
    evaluation_time: evaluation.toISOString(),
    fresh: isFresh(source, evaluation.toISOString())
  };

  if (recordState === RECORD_STATES.SOURCE_UNAVAILABLE) return decision(base, DECISIONS.INDETERMINATE, REASONS.SOURCE_UNAVAILABLE);
  if (recordState === RECORD_STATES.UNKNOWN) return decision(base, DECISIONS.INDETERMINATE, REASONS.UNKNOWN);
  if (!source.authoritative) return decision(base, DECISIONS.INDETERMINATE, REASONS.SOURCE_NON_AUTHORITATIVE);
  if (!base.fresh) return decision(base, DECISIONS.INDETERMINATE, REASONS.STALE);

  if (recordState === RECORD_STATES.LISTED_APPLICABLE) {
    return decision(base, DECISIONS.POSITIVE, REASONS.EVIDENCE_SUPPORTS_PROPOSITION);
  }

  // A definitive negative from absence requires a completeness assertion.
  if (recordState === RECORD_STATES.NOT_LISTED && !source.complete_for_scope) {
    return decision(base, DECISIONS.INDETERMINATE, REASONS.SOURCE_INCOMPLETE);
  }

  switch (recordState) {
    case RECORD_STATES.NOT_LISTED:
      return decision(base, DECISIONS.AUTHORITATIVE_NEGATIVE, REASONS.AUTHORITATIVE_ABSENCE);
    case RECORD_STATES.NOT_APPLICABLE:
      return decision(base, DECISIONS.AUTHORITATIVE_NEGATIVE, REASONS.NOT_APPLICABLE);
    case RECORD_STATES.REVOKED:
      return decision(base, DECISIONS.AUTHORITATIVE_NEGATIVE, REASONS.REVOKED);
    case RECORD_STATES.EXPIRED:
      return decision(base, DECISIONS.AUTHORITATIVE_NEGATIVE, REASONS.EXPIRED);
    default:
      return decision(base, DECISIONS.INDETERMINATE, REASONS.UNKNOWN);
  }
}

function decision(base, classification, reason) {
  return Object.freeze({ ...base, decision: classification, reason });
}

module.exports = {
  DECISIONS,
  RECORD_STATES,
  REASONS,
  createEvidenceSource,
  isFresh,
  evaluateEvidence
};
