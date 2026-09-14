# Agentic stress model for TRQP v3

Status: downstream conformance-design input; normative impacts must be promoted separately.

## Scope firewall

TRQP evaluates bounded trust-registry propositions. It does not define agent identity systems, delegation credentials, agent-to-agent messaging, workflow authorization, payments, contract formation or agent lifecycle management.

An autonomous agent may be a requester, subject or relying-system component. Externally defined delegation/relationship evidence may be decision-critical context. TRQP's obligation is to preserve the exact proposition and evidence boundary without manufacturing authority.

## Proposition frame

For stress analysis:

```text
P(S, A, Act, R, C, T, E)
```

- `S`: semantic subject
- `A`: authority / recognition scope
- `Act`: action
- `R`: resource
- `C`: decision-critical context, including references to external delegation/relationship evidence where applicable
- `T`: evaluation time
- `E`: evidence sufficient to resolve the proposition

## Mandatory separations

```text
agent identity != operator/controller identity
agent identity != principal/delegator identity
capability != authorization
recognition != authorization
discovery != authorization
delegation validity != transaction authorization by implication
valid components != valid composition by implication
```

## Worked stress scenarios

### B2C — merchant agent and consumer purchasing agent

A consumer agent seeks to purchase from a merchant agent. TRQP may be used to establish registry propositions about the merchant/provider and, where an authority registry supports it, propositions about the consumer agent's externally evidenced authority. A positive provider-recognition result MUST NOT establish the consumer agent's spending authority. A valid consumer-agent delegation MUST NOT establish merchant recognition.

### C2B — consumer agent acting under mandate

A consumer agent queries whether provider `P` is recognized by authority `A` for action/resource scope, then acts under an external mandate from consumer `C`. The provider proposition and agent-mandate proposition remain separate. Wrong action, resource, amount/scope, time or revoked mandate MUST prevent a positive result for the exact delegated proposition where those dimensions are decision-critical.

### C2C — two personal agents

Agents `A1` and `B1` act while principals are offline. Identity/capability evidence for both agents does not establish reciprocal authority. Each side must evaluate the exact authority/recognition propositions required by its governance context. Graph reachability or a shared ecosystem/profile MUST NOT manufacture recognition.

## Required negative vectors

1. valid agent identity + invalid delegation → non-positive;
2. valid delegation + wrong action → non-positive;
3. valid delegation + wrong resource → non-positive;
4. expired delegation → non-positive;
5. revoked intermediate delegate → non-positive;
6. onward delegation prohibited but chain continues → non-positive;
7. capable agent + no authority evidence → non-positive;
8. recognized delegator + unrecognized delegate → no recognition by implication;
9. unsupported critical delegation context → indeterminate;
10. stale pre-revocation evidence used after freshness boundary → non-positive/indeterminate according to evidence sufficiency, never silently positive;
11. historical query before revocation uses effective-dated evidence and is not overwritten by current revocation;
12. replacement of runtime agent does not erase audit evidence for the prior decision;
13. individually valid identity + capability + delegation + recognition artifacts that do not jointly bind the exact proposition → no positive composition.

## Machine-speed race invariant

A result is bounded to its evaluated proposition, evaluation time and evidence/freshness conditions. A positive result at `T1` MUST NOT be treated by TRQP as perpetual authorization at `T2`.

## Agent replacement invariant

Audit evidence SHOULD remain sufficient to establish the prior evaluated proposition, authority scope, time, processing contract, evidence state and semantic result after a runtime agent is replaced.

## Normative-impact rule

If an agentic vector fails because core candidate semantics are ambiguous, that ambiguity is a v3 release blocker. If the vector requires orchestration semantics outside a trust-registry query/evaluation protocol, it belongs in informative guidance or another protocol and MUST NOT expand TRQP core scope.
