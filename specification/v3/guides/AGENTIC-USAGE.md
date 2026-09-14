# Using candidate TRQP v3 in agentic systems

**Status:** informative downstream guide; not an agent protocol and not upstream normative text. Normative TRQP behavior remains in [`../TRQP-V3.md`](../TRQP-V3.md).

## 1. Why agentic use needs explicit guidance

Autonomous agents increase the speed and frequency with which identity, capability, delegation, registry status, and transaction context are composed. That does not change TRQP's core semantics, but it makes semantic mistakes more consequential: individually valid facts can be combined into an authority claim that no authoritative source actually made.

The core rule is therefore simple: **evaluate the exact proposition that the relying workflow needs, and keep agent identity, represented principal, delegation evidence, capability, recognition, action, resource, authority, and time distinct whenever they can change the answer.**

## 2. Boundary

TRQP evaluates bounded registry propositions. It does not define:

- agent identity;
- delegation credentials;
- A2A transport;
- workflow authorization;
- payment authorization;
- contract formation;
- agent lifecycle; or
- delegation issuance/revocation protocols.

Those systems may supply identifiers and evidence that become decision-critical inputs to a TRQP proposition.

## 3. Identity and authority model

For an agent acting on behalf of another party, distinguish at least:

| Concept | Example | What it does not prove |
|---|---|---|
| runtime agent | `did:example:agent-a` | principal identity or transaction authority |
| represented principal | `did:example:consumer` | that this agent may act for the principal |
| verification material | `urn:key:agent-a:1` | that the represented principal authorized the action |
| capability advertisement | `can-purchase` | current authorization for this transaction |
| delegation evidence | `urn:evidence:delegation:1` | authority beyond its exact scope/action/resource/time |
| registry authority | `did:example:registry` | endpoint identity or routing location |
| action | `purchase` | permission for every resource |
| resource | `urn:merchant:item:123` | permission for every action |

A profile may choose different field names, but these distinctions must survive whenever they are decision-critical.

## 4. B2C

A merchant agent and a consumer purchasing agent may each need registry propositions about the other side.

For example, the consumer side may need to know whether the merchant/provider is recognized for a regulated service. The merchant side may need to know whether the purchasing agent is authorized by its represented consumer for a particular transaction.

These are separate propositions. Provider recognition does not establish the consumer agent's spending mandate; consumer delegation does not establish provider recognition. A relying workflow may compose both results under an explicit policy, but TRQP does not collapse them into one implied authority claim.

## 5. C2B

A consumer agent acting for principal `P` may query whether provider `M` is recognized for the required service while separately presenting external evidence that `P` delegated `purchase(item-X)` to the agent.

The delegated-authority proposition must remain bounded by at least:

```text
agent
principal
action
resource
time
delegation evidence
authority/profile context
```

Wrong action, wrong resource, expired delegation, revoked delegation, prohibited onward delegation, unsupported critical context, or an agent/principal mismatch prevents a positive delegated-authority proposition.

## 6. C2C

Two personal agents acting while their principals are offline cannot infer reciprocal authority from:

- valid identity;
- shared profile membership;
- capability advertisements;
- ecosystem membership;
- graph reachability; or
- prior successful interactions.

Each side evaluates the exact authority and recognition propositions its relying policy requires. Recognition is non-transitive by default.

## 7. Composition rule

The following is unsafe:

```text
valid identity
+ valid capability
+ valid delegation artifact
+ recognized ecosystem
= authorized transaction
```

Each component may be authentic but scoped differently. The components must jointly bind the same semantic principal/agent, action, resource, evaluation time, authority scope, and relevant counterparty proposition before a relying workflow can treat them as supporting transaction authority.

A useful implementation principle is: **component validity is necessary evidence; proposition-level authority is the decision.**

## 8. Delegation-chain handling

If delegation is multi-hop, the relying profile must make onward delegation and chain scope explicit. A chain is not valid merely because every individual credential verifies cryptographically.

The processor or relying workflow must be able to establish, where required:

- the original principal/delegator;
- each delegate;
- whether onward delegation was permitted;
- action/resource constraints at each hop;
- effective-time intervals;
- revocation/supersession state; and
- whether the final proposition is contained within every applicable delegation boundary.

A revoked intermediate delegation breaks the chain for current evaluation even if later credentials remain cryptographically valid.

## 9. Machine-speed rule

A positive result at `T1` is not perpetual authority at `T2`.

Agentic systems often reuse cached decisions aggressively. Relying systems must apply evidence freshness, lifecycle, and invalidation rules appropriate to the transaction. TRQP must not manufacture current authority from stale pre-revocation evidence.

A cache key that omits agent/principal binding, action, resource, material, required profile, or other decision-critical context can create a machine-speed authorization vulnerability.

## 10. Capability is not authorization

Agent protocols frequently advertise capabilities to support discovery or task routing. Treat those advertisements as statements about what software claims it can do, not proof that it is authorized to do that thing for a particular principal, counterparty, resource, or time.

A capability can participate in negotiation or discovery. It cannot, by itself, satisfy a transaction-authorization proposition.

## 11. Agent replacement and continuity

Replacing runtime agent `A1` with `A2` does not rewrite the historical proposition evaluated for `A1`.

New transactions may use A2 and fresh delegation evidence. Historical audit evidence for A1 should preserve:

- A1's identity;
- represented principal/controller;
- exact delegation evidence;
- action/resource scope;
- evaluation time;
- processing contract/profile;
- evidence judgment; and
- semantic result.

This permits operational replacement without destroying accountability.

## 12. Redress

An agentic relying system should be able to answer a challenge such as:

> Why did agent A have authority to perform action X on resource Y for principal P at time T?

The evidence chain should identify the exact proposition, delegation evidence, registry evidence, evaluation time, and decision reason without requiring disclosure of unrelated relationships or registry data.

Where a decision is corrected, the correction should not silently mutate historical logs. Preserve the original decision and the later correction/re-evaluation as distinct evidence events.

## 13. Recognition and transitivity

Recognition remains direct-only in the candidate core.

```text
A recognizes B
B recognizes C
```

does not establish:

```text
A recognizes C
```

This is especially important in agent ecosystems where shared registries or capability directories can make graph traversal technically easy. Technical reachability is not delegated recognition authority.

## 14. Privacy

Agentic workflows can create unusually rich correlation surfaces because agent identifiers, principal identifiers, delegation evidence, task/resource identifiers, and registry queries may all be machine-linked.

Minimize disclosure by:

- sending only context required for the proposition;
- avoiding unnecessary stable correlation identifiers;
- using bounded/opaque evidence references where appropriate;
- avoiding full delegation-chain disclosure when a narrower proof is sufficient; and
- retaining audit evidence only to the degree required for verification and redress.

Do not achieve privacy minimization by removing a decision-critical condition before evaluation.

## 15. Worked failure cases

A conforming agentic implementation should test at least:

1. correct agent + wrong principal;
2. correct principal + wrong action;
3. correct action + wrong resource;
4. expired delegation;
5. revoked delegation;
6. revoked intermediate delegation;
7. prohibited onward delegation;
8. unsupported decision-critical delegation context;
9. capability advertisement without transaction authority;
10. recognized delegator without recognition of delegate;
11. agent replacement preserving historical attribution; and
12. valid individual components whose scopes do not compose.

These cases are represented in `tests/v3-agentic-stress.test.js` and illustrated in [`../examples/README.md`](../examples/README.md).

## 16. Integration sequence

For a new agentic application:

1. define the transaction proposition the relying workflow actually needs;
2. identify which dimensions come from the agent protocol versus TRQP evidence;
3. classify all decision-critical dimensions;
4. define or select the profile that gives those dimensions stable processing semantics;
5. negotiate candidate support before evaluation;
6. evaluate registry propositions separately from non-TRQP workflow rules;
7. compose results only under an explicit relying-party policy;
8. record bounded audit evidence; and
9. test every negative/adversarial boundary above.

## 17. Conformance evidence

The repository's `tests/v3-agentic-stress.test.js` is the executable companion to this guide. It deliberately tests failure boundaries rather than defining an agent delegation format.

The normative composition boundary is in Section 19 of [`../TRQP-V3.md`](../TRQP-V3.md). API identity/authority mapping is in [`../API.md`](../API.md).