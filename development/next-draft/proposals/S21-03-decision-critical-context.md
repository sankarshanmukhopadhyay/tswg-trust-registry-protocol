# S21-03 — Decision-critical context declaration

Status: **downstream proposal ready; upstream adoption required**

Parent: #30  
Work item: #33

## Decision

The downstream candidate SHOULD use a top-level `critical_context` array to declare context members whose semantics are mandatory to the proposition.

The declaration exists to prevent an endpoint from silently broadening a request by applying legacy ignore-unknown-extension behaviour to a condition whose omission can change the decision.

## Candidate processing contract

For each name in `critical_context`:

1. the name MUST be a non-empty string and MUST occur at most once;
2. a member with that exact name MUST exist in `context`;
3. the processor MUST determine support for that member before evaluating the proposition;
4. if the member is unsupported, the result MUST be `indeterminate` with reason `unsupported-critical-context` and the broader proposition MUST NOT be evaluated;
5. malformed declarations MUST be rejected rather than repaired, inferred, or silently normalized into a different proposition;
6. a processor MUST NOT claim semantic compatibility with a request containing critical declarations unless it implements this processing rule or an upstream-defined equivalent mandatory contract.

Unknown context members that are not declared critical remain outside this proposal's safety guarantee and may retain legacy extension handling where the applicable protocol version permits it.

## Proposed wire example

```json
{
  "trqp_version": "3.0-candidate",
  "entity_id": "did:example:issuer-a",
  "authority_id": "did:example:authority",
  "action": "issue",
  "resource": "credential-type-x",
  "context": {
    "verification_material": "urn:sha256:c2",
    "policy_epoch": "2026-Q3"
  },
  "critical_context": [
    "verification_material",
    "policy_epoch"
  ]
}
```

If an endpoint supports `verification_material` but not `policy_epoch`, it MUST return an indeterminate compatibility result. It MUST NOT discard `policy_epoch` and continue with a narrower set of conditions.

## Determinism

`critical_context` is a set-like declaration represented as an array. Order carries no semantic meaning. Duplicate values are invalid at schema level. Runtime normalization may de-duplicate endpoint capability declarations, but MUST NOT use such normalization to repair a malformed request that would otherwise violate the request schema.

A critical declaration naming a missing context member is invalid. Criticality is therefore explicit and locally inspectable before proposition evaluation.

## Evidence

Existing downstream evidence establishes the safety property:

- WP3 proves that silently removing a decision-critical qualifier can broaden a proposition and create a false positive;
- WP3 proves that an unsupported critical qualifier must stop processing;
- WP7 demonstrates a wire-level `critical_context` mechanism and fail-closed compatibility result;
- WP9 supplies negotiation/migration evidence showing that critical semantics cannot safely depend on legacy ignore-unknown behaviour;
- S21-02 applies the mechanism concretely to exact verification-material qualification.

Executable implementation:

- `development/verification-material/wp7-wire.js`
- `development/verification-material/schemas/wp7-request.schema.json`
- `tests/wp7-wire-compatibility.test.js`

## Required negative vectors

The candidate conformance suite MUST cover:

1. unsupported declared-critical member -> `indeterminate`;
2. declared-critical member absent from `context` -> malformed request;
3. duplicate critical declaration -> schema-invalid request;
4. empty/non-string declaration -> malformed request;
5. mixed supported/unsupported critical members -> `indeterminate`, with no partial proposition evaluation;
6. legacy peer that ignores the declaration -> semantic incompatibility/downgrade hazard;
7. supported critical members -> processing preserves their exact values.

## Falsification boundary

This proposal fails if any conforming path can:

- ignore an unsupported critical member and still produce a positive decision;
- silently repair a malformed declaration;
- strip a critical member before proposition evaluation;
- treat partial support for a set of critical members as sufficient;
- allow a legacy processor to claim equivalent semantics without binding itself to must-understand processing.

## Authority boundary

The downstream work establishes the required safety invariant and provides a concrete candidate wire mechanism. It does not establish upstream consensus on the name `critical_context`, its final serialization, or the protocol version in which the rule belongs. Those remain upstream normative decisions.

## Disposition

```yaml
section21: S21-03
issue: 33
class: normative-proposal
state: downstream_proposal_ready
evidence: executable-awaiting-pr-ci
authority:
  safety-property: downstream-evidenced
  wire-mechanism: downstream-candidate
  normative-adoption: upstream-required
proposed_member: critical_context
processing: fail-closed-must-understand
```
