'use strict';

const OUTCOMES = Object.freeze({ POSITIVE:'positive', NEGATIVE:'authoritative-negative', INDETERMINATE:'indeterminate' });
function evaluateDelegatedAuthority(q) {
  if (!q || !q.agent_id || !q.principal_id || !q.action || !q.resource || !q.time) return {decision:OUTCOMES.INDETERMINATE,reason:'evidence-incomplete'};
  const d=q.delegation;
  if (!d) return {decision:OUTCOMES.INDETERMINATE,reason:'evidence-incomplete'};
  if (d.agent_id!==q.agent_id || d.principal_id!==q.principal_id) return {decision:OUTCOMES.NEGATIVE,reason:'wrong-principal'};
  if (d.action!==q.action) return {decision:OUTCOMES.NEGATIVE,reason:'wrong-purpose'};
  if (d.resource!==q.resource) return {decision:OUTCOMES.NEGATIVE,reason:'wrong-resource'};
  const t=Date.parse(q.time), from=Date.parse(d.valid_from), until=Date.parse(d.valid_until);
  if (![t,from,until].every(Number.isFinite)) return {decision:OUTCOMES.INDETERMINATE,reason:'evidence-incomplete'};
  if (t<from || t>=until) return {decision:OUTCOMES.NEGATIVE,reason:'expired'};
  if (d.revoked_at && t>=Date.parse(d.revoked_at)) return {decision:OUTCOMES.NEGATIVE,reason:'revoked'};
  if (q.required_context && q.required_context.some(k=>!Object.hasOwn(q.context||{},k))) return {decision:OUTCOMES.INDETERMINATE,reason:'unsupported-critical-context'};
  if (Array.isArray(d.chain)) {
    for (const edge of d.chain) {
      if (edge.revoked_at && t>=Date.parse(edge.revoked_at)) return {decision:OUTCOMES.NEGATIVE,reason:'revoked'};
      if (edge.allow_onward===false && edge !== d.chain[d.chain.length-1]) return {decision:OUTCOMES.NEGATIVE,reason:'onward-delegation-prohibited'};
    }
  }
  if (q.capability_only===true) return {decision:OUTCOMES.INDETERMINATE,reason:'evidence-incomplete'};
  return {decision:OUTCOMES.POSITIVE,reason:'evidence-supports-proposition',binding:{agent_id:q.agent_id,principal_id:q.principal_id,action:q.action,resource:q.resource,time:q.time}};
}
function compositionAuthorizes(parts) {
  if (!parts || !parts.identity || !parts.capability || !parts.delegation || !parts.recognition) return false;
  const p=parts.proposition;
  return !!p && parts.delegation.agent_id===p.agent_id && parts.delegation.principal_id===p.principal_id && parts.delegation.action===p.action && parts.delegation.resource===p.resource && parts.recognition.subject_id===p.counterparty_id;
}
module.exports={OUTCOMES,evaluateDelegatedAuthority,compositionAuthorizes};