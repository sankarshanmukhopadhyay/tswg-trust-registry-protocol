# TRQP v3 candidate operational guidance

**Status:** downstream candidate implementation guidance; not an adopted Trust Over IP specification.

This guidance translates the candidate semantic invariants into deployment controls. It does not create new protocol authority or replace an applicable governance framework.

## 1. Deployment invariant

Operators MUST preserve the exact proposition evaluated across discovery, transport, evidence acquisition, evaluation, caching and audit. Operational convenience MUST NOT broaden a proposition by dropping decision-critical context, verification-material qualification, authority, action, resource or evaluation time.

## 2. Evidence acquisition and freshness

Deployments SHOULD define, per evidence source, the source authority, governed scope, completeness claim, freshness policy, temporal coverage and conflict-handling rule. A cache hit is not evidence of freshness merely because retrieval succeeded previously.

Evidence whose freshness or authority cannot be established MUST NOT be promoted to authoritative positive or authoritative negative. Unavailability MUST remain distinguishable from authoritative absence.

## 3. Cache and replay controls

Caches SHOULD retain the evidence timestamp, effective interval, provenance and applicable invalidation information needed to reproduce the original decision boundary. Implementations MUST reject stale capability or evidence material when the applicable processing contract requires fresher state.

Revocation, supersession and endpoint movement SHOULD have explicit cache invalidation paths. Endpoint movement MUST NOT change semantic service, registry, authority or principal identity by implication.

## 4. Capability and profile negotiation

Before candidate processing, an implementation MUST establish support for the requested candidate semantics, required profiles and every decision-critical member. A profile label without its mandatory processing contract is insufficient.

Stale, conflicting, unavailable or unauthorized capability metadata MUST NOT cause silent downgrade to generic v2 processing. Negotiation failure is a processing failure, not an authoritative semantic negative.

## 5. Lifecycle operations

Principal state, relationship state and verification-material state SHOULD be operated as independently observable lifecycle surfaces unless an applicable governance rule explicitly couples them. Key or certificate rotation SHOULD preserve stable principal identity while making the effective interval and supersession state of each material version auditable.

Historical queries MUST use evidence covering the requested evaluation time. Operators MUST NOT answer a historical proposition by projecting current state backwards.

## 6. Agentic and delegated-authority operation

Where autonomous agents initiate or rely on TRQP queries, operators SHOULD retain a stable binding among the agent identity, represented principal/controller where relevant, exact delegated proposition, evaluation time and evidence used. Agent replacement MUST NOT rewrite historical attribution.

TRQP capability, principal recognition, material validity or component-level evidence MUST NOT be interpreted as transaction authority by composition. Delegation instruments and workflow authorization remain external to TRQP; only the bounded registry proposition is evaluated here.

## 7. Failure handling

Operational telemetry MUST distinguish semantic positive, semantic negative, indeterminate, not-applicable, processing failure and transport failure. Alerting and retry logic SHOULD preserve these classes rather than collapsing them into success/failure booleans.

Retries MUST NOT remove qualifiers, weaken profiles or switch to legacy processing merely to obtain an answer. Repeated failure to acquire sufficient evidence remains indeterminate until sufficient authoritative evidence exists.

## 8. Audit and redress

For decision-producing deployments, audit evidence SHOULD be sufficient to reconstruct:

- the exact proposition and evaluation time;
- candidate version/profile and critical-context contract;
- evidence sources, authority/completeness/freshness judgments and effective intervals;
- material lifecycle state;
- semantic decision and reason;
- relevant revocation/supersession information.

Retention SHOULD be bounded by applicable governance, privacy and legal requirements. Redress mechanisms SHOULD support challenge, correction and re-evaluation without exposing unrelated registry data.

## 9. Privacy and observability

Logs, metrics, traces, evidence references and error responses SHOULD minimize stable correlators and unnecessary relationship, authority or resource information. Privacy minimization MUST NOT be implemented by deleting a decision-critical dimension before evaluation.

Operational dashboards SHOULD prefer aggregated health and decision-class metrics over raw proposition content unless detailed data is necessary and appropriately governed.

## 10. Release-readiness checklist

A candidate deployment is operationally ready only when it can demonstrate that:

1. downgrade and fallback paths fail closed;
2. evidence freshness and authority are explicit and testable;
3. cache invalidation covers revocation and supersession;
4. historical evaluation uses effective-dated evidence;
5. transport/discovery failures cannot manufacture semantic negatives;
6. semantic identity survives endpoint movement and agent replacement;
7. audit evidence reconstructs the evaluated proposition and decision boundary;
8. operational telemetry preserves decision-state distinctions;
9. privacy controls do not broaden propositions; and
10. runbooks identify the authority responsible for profile, evidence-source and lifecycle policy changes.

## 11. Authority boundary

Values such as freshness windows, retention periods, evidence-source authority, profile selection and operational SLOs are governance/deployment decisions unless the normative candidate explicitly constrains them. Operators MUST document those choices and MUST NOT present local policy as protocol-wide normative behaviour.