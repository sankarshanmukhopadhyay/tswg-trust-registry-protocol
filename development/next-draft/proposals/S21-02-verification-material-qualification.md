# S21-02 — Verification-material qualification contract

Status: **downstream proposal ready; upstream normative spelling unresolved**

Parent: #30  
Work item: #32

## Decision

The downstream candidate SHOULD retain `context.verification_material` as the proposed wire member for qualification by exact verification material.

The value identifies the exact verification material whose authority and lifecycle state are decision-critical to the proposition. It is not a replacement for `entity_id`: the semantic principal and the material used by or for that principal remain distinct inputs.

## Candidate processing contract

For this candidate, presence of `context.verification_material` means that verification material is decision-critical. Therefore:

1. `context.verification_material` MUST be a non-empty string;
2. `critical_context` MUST contain `verification_material`;
3. a processor MUST evaluate the proposition against the exact referenced material and MUST NOT fall back to principal-only evaluation;
4. material mismatch, unsupported material qualification, or inability to establish material lifecycle/authority state MUST NOT produce a material-dependent positive decision;
5. a generic-v2 processor that can silently discard `verification_material` is not semantically compatible with such a request.

A future upstream profile may define an equivalent mandatory processing contract, but this downstream wire proposal deliberately requires explicit criticality in the request so that the standalone artifact cannot be interpreted as safe merely because a profile label is present.

## Proposed wire example

```json
{
  "trqp_version": "3.0-candidate",
  "entity_id": "did:example:issuer-a",
  "authority_id": "did:example:authority",
  "action": "issue",
  "resource": "credential-type-x",
  "context": {
    "verification_material": "urn:sha256:c2"
  },
  "critical_context": ["verification_material"]
}
```

The identifier scheme used as the value is intentionally not fixed by this proposal. The value MUST be stable and unambiguous within the applicable authority/evaluation contract. A later upstream disposition may constrain identifier syntax.

## Evidence

Existing executable evidence demonstrates:

- generic-v2 processing can silently drop `verification_material` and produce a principal-only false positive;
- an unsupported critical `verification_material` fails closed;
- explicit endpoint support preserves the exact material reference;
- distinct material references remain distinguishable;
- a profile identifier without a processing contract is insufficient;
- a negotiated profile is sufficient only when its mandatory contract requires `verification_material` and the endpoint supports it;
- the request schema rejects candidate requests that contain `verification_material` without declaring it critical, and rejects critical declarations where the member is absent.

Relevant artifacts:

- `development/verification-material/schemas/wp7-request.schema.json`
- `development/verification-material/wp7-wire.js`
- `tests/wp7-wire-compatibility.test.js`
- WP1/WP2 principal/material model and exact-binding evidence

## Falsification boundary

This proposal is invalid if an implementation can satisfy it while any of the following remains possible:

- material mismatch falls back to principal-only positive;
- the receiver silently ignores material qualification;
- the referenced material cannot be distinguished from the semantic principal;
- lifecycle/revocation/supersession state cannot bind to the exact referenced material;
- a profile label admits processing without mandatory material-processing semantics.

## Authority boundary

Downstream evidence supports the semantic requirement and this concrete candidate spelling. It does **not** establish that `verification_material` is the final upstream normative member name. Upstream #194 and related work remain provenance/authority inputs rather than acceptance.

## Disposition

```yaml
section21: S21-02
issue: 32
class: normative-proposal
state: downstream_proposal_ready
evidence: executable
authority:
  semantics: downstream-evidenced
  wire-spelling: upstream-required
proposed_member: context.verification_material
```
