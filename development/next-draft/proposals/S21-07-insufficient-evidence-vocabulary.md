# S21-07 — Insufficient-evidence state vocabulary

Status: **downstream proposal ready; upstream normative adoption required**

Parent: #30  
Work item: #37

## Decision

Evidence state and semantic decision state are separate protocol dimensions.

A TRQP implementation MUST NOT derive an authoritative negative merely because evidence is incomplete, stale, unavailable, non-authoritative, conflicting, or otherwise unknown. Where any such property is material to the proposition, the semantic decision is `indeterminate`.

## Minimum evidence-state vocabulary

| Evidence state | Meaning | Decision consequence when material |
| --- | --- | --- |
| `sufficient` | evidence satisfies the authority, scope/completeness and temporal requirements needed for the proposition | may support positive, authoritative-negative or not-applicable depending on proposition |
| `incomplete` | evidence source cannot establish complete coverage for the relevant scope | indeterminate |
| `stale` | evidence is outside the applicable temporal/freshness contract | indeterminate |
| `unavailable` | required evidence cannot currently be evaluated | indeterminate |
| `non-authoritative` | source cannot authoritatively establish the proposition | indeterminate |
| `conflicting` | material evidence cannot be reconciled under the applicable authority/precedence rules | indeterminate |
| `unknown` | evidence adequacy cannot otherwise be established | indeterminate |

## Core invariant

`evidence_state` describes the adequacy of evidence. `decision` describes the result of evaluating the proposition.

Consequently `sufficient` is not synonymous with `positive`: sufficient authoritative evidence may establish either a positive or an authoritative negative. Conversely, every insufficient evidence state maps to `indeterminate` when that insufficiency is material.

## Reason mapping

The candidate wire vocabulary maps evidence states to stable reasons:

- `incomplete` → `evidence-incomplete`;
- `stale` → `evidence-stale`;
- `unavailable` → `source-unavailable`;
- `non-authoritative` → `source-non-authoritative`;
- `conflicting` → `evidence-conflicting`;
- `unknown` → `evidence-unknown`.

Historical insufficiency remains expressible as `historical-evidence-incomplete`; protocol capability failures such as `unsupported-critical-context` remain indeterminate decision reasons but are not falsely reclassified as evidence-source states.

## Deterministic rules

1. Absence from an incomplete source MUST NOT be interpreted as `not-listed` authoritative negative.
2. Stale evidence MUST NOT establish current positive or negative state.
3. Unavailable evidence MUST NOT be interpreted as record absence.
4. Non-authoritative evidence MUST NOT establish a positive or authoritative negative merely because a record is present or absent.
5. Materially conflicting evidence MUST NOT be silently selected or collapsed according to implementation preference; absent a defined authoritative precedence rule, it remains indeterminate.
6. Unknown evidence adequacy remains indeterminate.
7. A `sufficient` evidence state does not predetermine the semantic decision.
8. Evidence provenance sufficient to explain the classification SHOULD survive into the result/evidence record.

## Executable evidence

`development/verification-material/evidence.js` now exposes `EVIDENCE_STATES` independently from `DECISIONS` and implements explicit conflicting evidence.

`tests/wp5-evidence-indeterminacy.test.js` falsifies:

- incomplete absence becoming denial;
- stale presence becoming positive;
- stale absence becoming denial;
- unavailable evidence becoming absence;
- non-authoritative presence/absence becoming authoritative decisions;
- conflicting evidence being silently selected;
- evidence state being treated as synonymous with decision state.

`development/verification-material/schemas/wp7-response.schema.json` now permits the evidence-state vocabulary and constrains the direct evidence insufficiency reasons to the corresponding state. The field remains optional in the candidate schema so this tranche does not prematurely require every response to expose a top-level evidence classification; making it mandatory is an upstream/specification design decision.

## Authority and conflict boundary

`conflicting` is the safe fallback only where materially inconsistent evidence has no already-defined authoritative precedence rule. This proposal does not define registry/source precedence, federation authority, or conflict resolution policy. Those remain governance/profile concerns unless upstream TRQP chooses to standardize them.

An implementation MUST NOT use `conflicting` to ignore a valid authority rule that deterministically identifies the applicable authoritative evidence.

## Relationship to S21-04

S21-04 defines the machine-actionable semantic result vocabulary. S21-07 defines evidence adequacy vocabulary underneath it.

The separation prevents two dangerous collapses:

```text
insufficient evidence != authoritative negative
sufficient evidence   != positive
```

This is the central assurance property of S21-07.

## Falsification boundary

The proposal fails if a conforming implementation can:

- turn incomplete absence into authoritative denial;
- treat stale evidence as current truth;
- equate source unavailability with absence;
- silently choose between materially conflicting evidence without a defined authority rule;
- establish an authoritative result from non-authoritative evidence;
- infer `positive` solely from `evidence_state: sufficient`.

## Disposition

```yaml
section21: S21-07
issue: 37
class: normative-proposal
state: downstream_proposal_ready
evidence: executable-awaiting-pr-ci
authority:
  evidence-state-separation: downstream-evidenced
  vocabulary: downstream-candidate
  conflict-precedence: governance-or-profile-dependent
  normative-adoption: upstream-required
```
