# Trust Registry Query Protocol — proposed v3

> **Branch status:** `draft/next-trqp` is the dedicated downstream TRQP v3 candidate. It is intended for review, implementation and interoperability work without changing the repository's stable `main` branch. This is not an adopted Trust Over IP specification.

## Proposed v3

**Start here: [`specification/v3/`](specification/v3/)**

That directory is the complete public product surface for the proposed v3. It contains the normative specification, API documentation, OpenAPI contract, implementation and migration guides, conformance material, examples and schema discovery.

If you want to answer **“what would a fully fledged TRQP v3 look, read and behave like?”**, review `specification/v3/` on this branch.

## Branch model

```text
main
└── stable downstream TRQP v2

draft/next-trqp
└── complete downstream proposed TRQP v3
```

Completion of the v3 candidate **does not imply promotion to `main`**. Any future adoption, upstream contribution or replacement of the stable downstream line is a separate governance decision.

## Reader map

| Goal | Start here |
|---|---|
| Read the protocol | [`specification/v3/TRQP-V3.md`](specification/v3/TRQP-V3.md) |
| Understand the API and parameters | [`specification/v3/API.md`](specification/v3/API.md) |
| Consume the machine-readable API | [`specification/v3/openapi.yaml`](specification/v3/openapi.yaml) |
| Implement v3 | [`specification/v3/guides/IMPLEMENTERS-GUIDE.md`](specification/v3/guides/IMPLEMENTERS-GUIDE.md) |
| Migrate from v2 | [`specification/v3/guides/MIGRATION-FROM-V2.md`](specification/v3/guides/MIGRATION-FROM-V2.md) |
| Use TRQP with agents | [`specification/v3/guides/AGENTIC-USAGE.md`](specification/v3/guides/AGENTIC-USAGE.md) |
| Understand operations | [`specification/v3/guides/OPERATIONAL-GUIDANCE.md`](specification/v3/guides/OPERATIONAL-GUIDANCE.md) |
| Evaluate conformance | [`specification/v3/conformance/`](specification/v3/conformance/) |
| Browse examples | [`specification/v3/examples/`](specification/v3/examples/) |
| Inspect engineering evidence/history | [`development/`](development/) |

## Information architecture and authority

The repository deliberately separates **the specification product** from **the evidence used to develop and assure it**.

`specification/v3/` is what a reviewer or implementer should read. `development/` contains durable research, upstream dispositions, verification material and provenance. Development artifacts do not silently extend the normative specification and do not preserve temporary sequencing or planning artifacts.

Approved v2 material remains under [`specification/v2-approved/`](specification/v2-approved/) as the stable baseline, migration reference and provenance record.

## What the candidate changes

The candidate keeps TRQP a read-only trust-registry query/evaluation protocol while making its decision boundary explicit. Evaluation is bounded by the exact proposition, including decision-relevant principal, authority, action, resource, verification material, evaluation time and declared critical context where applicable.

It separates semantic decision state from transport state; preserves uncertainty when evidence is insufficient; treats principal, relationship and verification-material lifecycle independently unless governance explicitly couples them; prohibits silent downgrade to generic v2 processing; and defines direct recognition without inferred transitivity.

Agentic use is a mandatory stress lens, not an expansion of TRQP into an agent protocol. Agent identity, capability, delegation evidence and transaction authority remain distinct. Delegation instruments, workflow authorization, payments, messaging and agent lifecycle remain outside TRQP's protocol scope.

## Validation and assurance

Executable downstream evidence remains under `tests/` and `development/verification-material/`. CI runs the downstream reference-model suite and candidate-readiness controls. Local differential tests demonstrate repository-local consistency; they **do not** constitute independent organizational interoperability.

## Authority boundary

The branch is a downstream proposal. Final upstream adoption, major-version/profile naming, final schema identifiers/member spelling, production binding selection and independent external interoperability remain outside downstream authority.

Changes to the candidate should use short-lived branches targeting `draft/next-trqp`, with modular commits and executable tests wherever behavior can be tested.
