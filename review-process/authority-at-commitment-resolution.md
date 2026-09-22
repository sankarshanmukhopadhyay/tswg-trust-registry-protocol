# Authority-at-Commitment Resolution Assessment

**Status:** downstream informative assessment. This document does not amend the upstream TRQP specification.

## Question

Can current TRQP semantics contribute to a verifier deciding whether an agent had authority for an exact material commitment at a particular time?

## Result

TRQP can be a **resolution input** to such a decision where an authoritative registry exposes relevant authorization or recognition state, but current TRQP v2 semantics are **not sufficient to constitute an authority-at-commitment protocol**. The commitment decision additionally requires action-specific mandate semantics, constraint evaluation, exact-action approval binding, fresh lifecycle/revocation evidence and, for retrospective questions, historical/as-of semantics.

TRQP MUST NOT be interpreted as a central agent-authorization registry merely because it can query trust-registry state.

## Capability matrix

| Requirement | Current TRQP contribution | Disposition |
|---|---|---|
| Discover/query authorization state represented by a registry | Authorization Query can contribute registry-owned facts | **supported as an input** |
| Query recognition relationships | Recognition Query can contribute recognition facts | **supported, but recognition is not commitment authority** |
| Prove actor identity or message signature | Outside TRQP | **not supported / separate layer** |
| Resolve a multi-hop delegation/mandate chain | Delegation Query remains outside the current core baseline | **requires extension or external resolver** |
| Evaluate exact action against value/counterparty/field constraints | Not a TRQP core responsibility | **not supported / policy layer** |
| Bind human approval to the exact action digest | Not a TRQP core responsibility | **not supported / approval layer** |
| Establish fresh revocation/status at commitment time | Possible only to the extent the authoritative source and query response expose adequate lifecycle state/freshness | **deployment/evidence dependent** |
| Reconstruct authority as of historical time T | No general current-core as-of authorization contract is established here | **requires explicit historical capability** |
| Decide whether the commitment is legally or operationally binding | Outside TRQP | **not supported** |
| Preserve source authority/provenance | TRQP should remain a query/projection path, not replace the authoritative registry | **required boundary** |

## Architecture boundary

```text
exact action / commitment
        |
        v
mandate + policy + constraints + approval
        |
        +---- optional TRQP resolution ----> authoritative registry state
        |                                      |
        <----------- sourced evidence ---------+
        |
        v
action-specific authority decision
```

The resolver contributes evidence. It does not acquire authority to grant the action merely by returning a result.

## Current vs historical questions

Two questions must remain distinct:

1. **Current:** "Does the authoritative source represent the relevant authority as current now?"
2. **Historical:** "What authority state was applicable at time T when the commitment was made?"

A current query result cannot silently answer the historical question. A future TRQP profile that supports as-of verification would need explicit time semantics, provenance, lifecycle/withdrawal handling and evidence-retention assumptions.

## No immediate core protocol change

This tranche does **not** justify modifying the current TRQP core solely to carry commercial negotiation or agent mandate semantics. The lowest-risk path is:

- keep mandate and action-specific decision semantics in their owning layers;
- use TRQP where it already provides authoritative registry query value;
- exercise historical/delegation requirements in downstream interoperability work;
- promote a protocol extension only after a concrete interoperable need and test vectors demonstrate that the existing query model is insufficient.

## Evidence gaps / future triggers

A follow-on protocol proposition becomes justified if implementation evidence demonstrates a recurring need for one or more of:

- standardized delegation/mandate resolution through TRQP;
- explicit historical/as-of authorization queries;
- freshness/status metadata insufficient for commitment-time decisions;
- portable provenance sufficient to bind a TRQP result to an authority decision receipt.

Until then, these remain evidence gaps rather than inferred upstream requirements.
