# Trust Registry Query Protocol — proposed v3

> **Branch status:** `draft/next-trqp` is the dedicated downstream TRQP v3 candidate. It is intended for review, implementation and interoperability work without changing the repository's stable `main` branch. This is not an adopted Trust Over IP specification.

## Read the proposed v3

**Start with the public specification entry point:** [`specification/v3/README.md`](specification/v3/README.md)

The complete normative specification text is linked there, together with the schemas, examples, implementation guidance and conformance evidence needed to understand how the proposed protocol is intended to behave.

If you want to answer **“what would a fully fledged TRQP v3 look, read and behave like?”**, this branch is the reviewable artifact.

## Branch model

```text
main
└── stable downstream TRQP v2

draft/next-trqp
└── complete downstream proposed TRQP v3
```

Completion of the v3 candidate **does not imply promotion to `main`**. Any future adoption, upstream contribution or replacement of the stable downstream line is a separate governance decision.

## Candidate package

| Need | Artifact |
|---|---|
| Read the proposed specification | [`specification/v3/README.md`](specification/v3/README.md) |
| Full normative candidate text | [`development/next-draft/CANDIDATE-TRQP-V3.md`](development/next-draft/CANDIDATE-TRQP-V3.md) |
| Stable normative requirement IDs | [`development/next-draft/NORMATIVE-REQUIREMENTS.md`](development/next-draft/NORMATIVE-REQUIREMENTS.md) |
| Request/response schemas | [`development/verification-material/schemas/`](development/verification-material/schemas/) |
| Candidate examples | [`development/next-draft/examples/`](development/next-draft/examples/) |
| Implementation guidance | [`development/next-draft/IMPLEMENTERS-GUIDE.md`](development/next-draft/IMPLEMENTERS-GUIDE.md) |
| Migrate from v2 | [`development/next-draft/V2-TO-V3-MIGRATION-GUIDE.md`](development/next-draft/V2-TO-V3-MIGRATION-GUIDE.md) |
| Conformance/interoperability | [`development/next-draft/CONFORMANCE-AND-INTEROP-GUIDE.md`](development/next-draft/CONFORMANCE-AND-INTEROP-GUIDE.md) |
| Agentic-system use | [`development/next-draft/AGENTIC-USAGE-GUIDE.md`](development/next-draft/AGENTIC-USAGE-GUIDE.md) |
| Operational guidance | [`development/next-draft/OPERATIONAL-GUIDANCE.md`](development/next-draft/OPERATIONAL-GUIDANCE.md) |
| Requirement → test evidence | [`development/next-draft/REQUIREMENT-TEST-TRACEABILITY.md`](development/next-draft/REQUIREMENT-TEST-TRACEABILITY.md) |

## What the candidate changes

The candidate keeps TRQP a read-only trust-registry query/evaluation protocol while making its decision boundary explicit. Evaluation is bounded by the exact proposition, including decision-relevant principal, authority, action, resource, verification material, evaluation time and declared critical context where applicable.

It separates semantic decision state from transport state; preserves uncertainty when evidence is insufficient; treats principal, relationship and verification-material lifecycle independently unless governance explicitly couples them; prohibits silent downgrade to generic v2 processing; and defines direct recognition without inferred transitivity.

Agentic use is a mandatory stress lens, not an expansion of TRQP into an agent protocol. Agent identity, capability, delegation evidence and transaction authority remain distinct. Delegation instruments, workflow authorization, payments, messaging and agent lifecycle remain outside TRQP's protocol scope.

## Validation and assurance

This branch carries executable downstream evidence under `tests/` and `development/verification-material/`. CI runs the downstream reference-model suite and RC-readiness controls covering requirement-family traceability, candidate schema surfaces, SHOULD disposition, unresolved editorial markers and semantic-field-loss protections.

Local differential tests demonstrate repository-local consistency. They **do not** constitute independent organizational interoperability, and this branch does not claim otherwise.

## Authority boundary

The branch is a downstream proposal. Final upstream adoption, major-version/profile naming, final schema identifiers/member spelling, production binding selection and independent external interoperability remain outside downstream authority.

Approved v2 material remains under [`specification/v2-approved/`](specification/v2-approved/) as the stable baseline, migration reference and provenance record. Its presence on this branch does not make v2 the implementation target for the proposed v3.

## Development evidence

`development/` retains engineering evidence, dispositions, traceability and supporting material used to derive and test the candidate. Those files are auditable provenance, not hidden normative extensions. A reviewer should not need issue or pull-request history to determine candidate protocol behavior.

Changes to the candidate should use short-lived branches targeting `draft/next-trqp`, with modular commits and executable tests wherever behavior can be tested. `main` remains stable unless a separate explicit governance decision changes that policy.