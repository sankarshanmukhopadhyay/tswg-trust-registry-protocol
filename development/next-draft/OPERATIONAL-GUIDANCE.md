# TRQP v3 Candidate — Operational Guidance

Status: downstream candidate implementation guidance; non-normative except where it restates identified candidate requirements.

## 1. Purpose

This guide translates the candidate protocol's semantic obligations into operational controls. Deployment success is not evidence that an answer is authoritative: operators must preserve the distinction between transport availability, discovery, evidence sufficiency, authorization, recognition and relying-party action.

## 2. Deployment controls

Operators SHOULD maintain separate observable controls for: endpoint health; capability/discovery freshness; authority-source availability; evidence freshness/completeness; material lifecycle state; processing-profile support; and semantic decision outcomes. A single green service-health signal MUST NOT be used as a proxy for semantic trust state.

## 3. Caching and freshness

Caches must retain the evaluation time and freshness boundary of cached evidence. Cache reuse must not extend an authorization, recognition, delegation-dependent proposition or verification-material state beyond the evidence interval that supported it. When current authoritative state cannot be established, implementations should return an indeterminate/non-positive semantic result rather than silently reusing stale positive evidence.

## 4. Revocation and change

Revocation, expiry and supersession are independently meaningful lifecycle events. Operational systems should record the observed event, effective time where known, source, and affected material/principal scope. Historical queries must evaluate the proposition at the requested historical time rather than projecting current state backwards.

## 5. Agentic and machine-speed operation

Autonomous execution increases the risk that valid-at-T1 evidence is reused at T2 after authority changes. Agent workflows should bind the exact principal, acting agent, action, resource, critical context, evaluation time and evidence set into the audit record. Capability or successful endpoint discovery is not transaction authority.

## 6. Failure handling

Transport and processing failures must remain distinguishable from semantic negatives. Operators should expose reason codes and evidence-state information sufficient to distinguish at least authoritative-negative, indeterminate, not-applicable and processing/transport failure conditions. Retry policy must not convert uncertainty into positive authorization.

## 7. Audit and redress

Retained evidence should permit later reconstruction of: the proposition asked; protocol/profile contract; evaluation time; evidence identifiers and authority/provenance; material lifecycle observations; semantic result/reason; and relying-party action. Audit identity should survive endpoint and runtime-agent replacement.

## 8. Security operations

Operational monitoring should detect downgrade attempts, stale replay, evidence injection, verification-material substitution, scope broadening, unsupported critical context and conflicting capability/profile metadata. Failures in these controls should fail closed at the semantic admission/evaluation boundary.

## 9. Privacy operations

Collect only evidence necessary to resolve the bounded proposition. Minimization must not remove a decision-critical condition in a way that broadens the proposition. Logs should avoid unnecessary personal or relationship data while retaining sufficient references for audit and redress.

## 10. Release/readiness evidence

A production candidate should publish or retain evidence for schema/example validation, normative requirement-to-test coverage, negative/adversarial vectors, differential interoperability, dependency/build status, and known external interoperability gaps. Green workflow execution is evidence of repository-local conformance only; it is not proof of upstream adoption or independent interoperability.
