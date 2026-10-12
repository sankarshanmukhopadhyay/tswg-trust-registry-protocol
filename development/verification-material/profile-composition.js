'use strict';

// Experimental downstream research: profile declarations cannot confer TRQP authority.
const CORE = Object.freeze(['critical-context-fail-closed', 'material-bound-evaluation', 'decision-reason-classes']);
const valid = a => Array.isArray(a) && a.every(s => typeof s === 'string' && s.length > 0) && new Set(a).size === a.length;
const reject = (reason, detail) => ({ admissible: false, decision: 'indeterminate', reason, ...(detail ? { detail } : {}) });

function composeAssuranceProfiles(profiles, { at, trustedAuthorities = [] } = {}) {
  if (!Array.isArray(profiles) || !profiles.length || !valid(trustedAuthorities)) return reject('invalid-profile-contract');
  const time = Date.parse(at);
  if (typeof at !== 'string' || !Number.isFinite(time)) return reject('invalid-evaluation-time');
  const required = new Set(CORE);
  const prohibited = new Set();
  const identities = new Set();
  const versions = {};
  for (const p of profiles) {
    if (!p || typeof p !== 'object' || Array.isArray(p) ||
        ![p.id, p.authority, p.version, p.effective_from].every(s => typeof s === 'string' && s.length > 0) ||
        !valid(p.required) || !valid(p.prohibited) || identities.has(p.id) ||
        !trustedAuthorities.includes(p.authority)) return reject('invalid-or-untrusted-profile');
    identities.add(p.id);
    const start = Date.parse(p.effective_from);
    const end = p.expires_at === undefined ? Infinity : Date.parse(p.expires_at);
    if (!Number.isFinite(start) || Number.isNaN(end) || end <= start) return reject('invalid-profile-lifecycle');
    if (time < start || time >= end || p.status !== 'active') return reject('inactive-profile', p.id);
    for (const x of p.required) required.add(x);
    for (const x of p.prohibited) prohibited.add(x);
    versions[p.id] = p.version;
  }
  const conflicts = [...required].filter(x => prohibited.has(x)).sort();
  if (conflicts.length) return reject('conflicting-profile-obligations', conflicts.join(','));
  return { admissible: true, required: [...required].sort(), prohibited: [...prohibited].sort(), profile_versions: versions };
}
module.exports = { CORE, composeAssuranceProfiles };
