# Using candidate TRQP v3 in agentic systems

Status: informative downstream guide; not an agent protocol and not upstream normative text.

## Boundary

TRQP evaluates bounded registry propositions. It does not define agent identity, delegation credentials, A2A transport, workflow authorization, payment authorization, contract formation or agent lifecycle. Those systems may supply identifiers and evidence that become decision-critical inputs to a TRQP proposition.

## B2C

A merchant agent and consumer purchasing agent may each need registry propositions about the other side. Provider recognition does not establish the consumer agent's spending mandate; a consumer delegation does not establish provider recognition. Evaluate these as separate propositions and compose them only in the relying workflow under an explicit policy.

## C2B

A consumer agent acting for principal `P` may query whether provider `M` is recognized for action/resource scope and separately present external evidence that `P` delegated `purchase(item-X)` to the agent. Wrong action, resource, time, revoked delegation, prohibited onward delegation or unsupported critical context prevents a positive delegated-authority proposition.

## C2C

Two personal agents acting while principals are offline cannot infer reciprocal authority from identity, capability, shared profile membership or graph reachability. Each side evaluates the exact authority and recognition propositions its policy requires. Recognition is non-transitive by default.

## Composition rule

The following is unsafe:

```text
valid identity + valid capability + valid delegation + recognized ecosystem = authorized transaction
```

The components must jointly bind the same semantic subject/principal, action, resource, time, authority scope and relevant counterparty proposition. Otherwise the result remains non-positive.

## Machine-speed rule

A positive result at `T1` is not perpetual authority at `T2`. Relying systems must apply evidence freshness and lifecycle rules appropriate to the transaction. TRQP must not manufacture current authority from stale pre-revocation evidence.

## Agent replacement and redress

Replacing runtime agent `A1` with `A2` does not rewrite the historical proposition evaluated for `A1`. Audit evidence should preserve the semantic agent/principal binding, scope, evaluation time, processing contract, evidence judgment and result so a later challenge can reconstruct what the relying system knew.

## Conformance evidence

The repository's `tests/v3-agentic-stress.test.js` is the executable companion to this guide. It deliberately tests failure boundaries rather than defining an agent delegation format.