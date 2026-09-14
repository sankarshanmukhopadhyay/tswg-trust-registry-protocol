# S21-04 — Machine-actionable decision and reason vocabulary

Status: **downstream proposal ready; upstream normative adoption required**

Parent: #30  
Work item: #34

## Decision

TRQP v3 candidate responses SHOULD carry a machine-actionable `decision` independently from transport success and SHOULD carry a stable `reason` when the decision is not self-explanatory.

The minimum decision vocabulary is:

- `positive` — authoritative evidence establishes the requested proposition;
- `authoritative-negative` — authoritative, applicable evidence establishes that the requested proposition does not hold;
- `indeterminate` — available evidence or processing capability is insufficient to establish either a positive or an authoritative negative;
- `not-applicable` — the proposition falls outside the applicable purpose/resource/scope and is therefore distinct from both absence and denial.

Transport success MUST NOT imply `positive`. A successfully processed HTTP request may return any semantic decision class.

## Compatibility field

If an `authorized` boolean is retained for compatibility/readability, it MUST NOT be the sole semantic result. `authorized: false` MUST NOT collapse authoritative negative, indeterminate, and not-applicable into one machine meaning.

## Minimum reason categories

| Decision | Reason | Meaning |
| --- | --- | --- |
| `positive` | `established` | authoritative applicable evidence establishes the proposition |
| `authoritative-negative` | `not-listed` | absence is meaningful because the source is authoritative, complete for scope, and temporally applicable |
| `authoritative-negative` | `revoked` | exact relevant material/authorization is authoritatively revoked |
| `authoritative-negative` | `expired` | exact relevant material/authorization is authoritatively expired |
| `indeterminate` | `source-unavailable` | required evidence source cannot be evaluated |
| `indeterminate` | `source-non-authoritative` | available source cannot authoritatively establish the proposition |
| `indeterminate` | `evidence-incomplete` | source is not complete for the required scope |
| `indeterminate` | `evidence-stale` | evidence is not temporally adequate for the evaluation |
| `indeterminate` | `historical-evidence-incomplete` | requested historical state cannot be established |
| `indeterminate` | `unsupported-critical-context` | processor cannot evaluate a declared decision-critical condition |
| `indeterminate` | `required-profile-unsupported` | required processing profile is not supported |
| `indeterminate` | `profile-contract-unsatisfied` | named profile exists but its mandatory processing contract cannot be satisfied |
| `not-applicable` | `outside-scope` | evidence/source semantics establish that the proposition is outside applicable scope |

This list is deliberately minimal. Implementations MAY expose additional diagnostic detail in separately defined extension fields, but clients MUST NOT need to parse human-readable prose to recover the decision class or rely on undeclared reason strings as interoperable semantics.

## Deterministic mapping rules

1. A listed record yields `positive` only when evidence is authoritative and temporally applicable for the proposition.
2. Absence yields `authoritative-negative` only when the source is authoritative, complete for the declared scope, and temporally applicable.
3. Stale, unavailable, incomplete, or non-authoritative evidence yields `indeterminate` where those properties are material.
4. Revoked or expired exact material may yield `authoritative-negative` for the material-dependent proposition; it does not imply revocation of the semantic principal.
5. `not-applicable` MUST remain distinguishable from `not-listed`.
6. Unsupported decision-critical processing MUST yield `indeterminate`, never an authoritative denial and never a broadened positive.
7. Historical uncertainty MUST remain `indeterminate`; lack of historical proof MUST NOT be reinterpreted as current or historical denial.

## Candidate response examples

```json
{ "decision": "positive", "reason": "established", "authorized": true }
```

```json
{ "decision": "authoritative-negative", "reason": "revoked", "authorized": false }
```

```json
{ "decision": "indeterminate", "reason": "historical-evidence-incomplete", "authorized": false }
```

```json
{ "decision": "not-applicable", "reason": "outside-scope", "authorized": false }
```

## Executable evidence

The candidate response schema now constrains both dimensions:

- `decision` is one of the four candidate classes;
- `reason` is a closed candidate interoperability vocabulary;
- reason values are constrained to the applicable decision class;
- `positive` requires `established` and a positive authorization/recognition compatibility boolean;
- non-positive classes cannot masquerade as positive through those compatibility booleans;
- `not-applicable` is independently encoded as `not-applicable` / `outside-scope`;
- unknown implementation-specific reason strings are non-conformant as core vocabulary.

Artifacts:

- `development/verification-material/schemas/wp7-response.schema.json`
- `tests/wp7-conformance-vectors.test.js`
- `development/verification-material/WP5-evidence-semantics.md`
- `development/verification-material/WP6-historical-evaluation.md`
- `development/verification-material/WP7-wire-candidate.md`

The reference-test workflow is PR-triggered. These candidate-branch changes therefore require the next PR/reconciliation pass to produce CI evidence before promotion.

## Falsification boundary

This proposal fails if a conforming client must:

- infer semantic success from HTTP/transport success;
- parse prose to distinguish negative from uncertainty;
- interpret insufficient evidence as authoritative denial;
- treat `not-applicable` as ordinary absence;
- treat revoked material as revocation of the semantic principal;
- collapse unsupported critical processing into `authorized: false` without an indeterminate decision class.

## Authority boundary

The downstream evidence establishes the need for distinct semantic decision classes and stable machine-readable reasons. The exact vocabulary remains a downstream candidate until upstream adoption. Reason strings are proposed interoperability identifiers, not current upstream TRQP normative values.

## Disposition

```yaml
section21: S21-04
issue: 34
class: normative-proposal
state: downstream_proposal_ready
evidence: executable-awaiting-pr-ci
authority:
  semantic-distinction: downstream-evidenced
  vocabulary: downstream-candidate
  normative-adoption: upstream-required
decisions:
  - positive
  - authoritative-negative
  - indeterminate
  - not-applicable
```
