const FORBIDDEN_GROUNDING_KEYS = new Set([
  'decision', 'authorized', 'recognized', 'evidence_state', 'reason',
  'raw_evidence', 'database_id', 'table_name', 'private_state'
]);

function parseTime(value) {
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

function validateGrounding(entries, timeRequested) {
  if (entries === undefined) return { valid: true, omitted: true };
  if (!Array.isArray(entries) || entries.length === 0) return { valid: false, reason: 'grounding-invalid' };

  const requested = timeRequested === undefined ? null : parseTime(timeRequested);
  if (timeRequested !== undefined && requested === null) return { valid: false, reason: 'time-requested-invalid' };

  for (const entry of entries) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return { valid: false, reason: 'grounding-entry-invalid' };
    if (typeof entry.source_id !== 'string' || entry.source_id.length === 0) return { valid: false, reason: 'grounding-source-missing' };
    if (typeof entry.source_authority !== 'string' || entry.source_authority.length === 0) return { valid: false, reason: 'grounding-authority-missing' };

    for (const key of Object.keys(entry)) {
      if (FORBIDDEN_GROUNDING_KEYS.has(key)) return { valid: false, reason: 'grounding-disclosure-or-result-field' };
    }

    if (entry.digest !== undefined && (typeof entry.digest !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]*:.+$/.test(entry.digest))) {
      return { valid: false, reason: 'grounding-digest-invalid' };
    }

    const from = entry.effective_from === undefined ? null : parseTime(entry.effective_from);
    const until = entry.effective_until === undefined ? null : parseTime(entry.effective_until);
    if (entry.effective_from !== undefined && from === null) return { valid: false, reason: 'grounding-effective-from-invalid' };
    if (entry.effective_until !== undefined && until === null) return { valid: false, reason: 'grounding-effective-until-invalid' };
    if (from !== null && until !== null && from >= until) return { valid: false, reason: 'grounding-interval-invalid' };

    if (requested !== null && (from !== null || until !== null)) {
      if ((from !== null && requested < from) || (until !== null && requested >= until)) {
        return { valid: false, reason: 'grounding-does-not-cover-requested-time' };
      }
    }
  }
  return { valid: true, omitted: false };
}

module.exports = { validateGrounding };
