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

The downstream candidate defines stable categories rather than implementation-specific diagnostics:

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

This list is deliberately minimal. Implementations MAY expose additional diagnostic detail, but clients MUST NOT need to parse human-readable prose to recover the decision class.

## Deterministic mapping rules

1. A listed record yields `positive` only when evidence is authoritative and temporally applicable for the proposition.
2. Absence yields `authoritative-negative` only when the source is authoritative, complete for the declared scope, and temporally applicable.
3. Stale, unavailable, incomplete, or non-authoritative evidence yields `indeterminate` where those properties are material.
4. Revoked or expired exact material may yield `authoritative-negative` for the material-dependent proposition; it does not imply revocation of the semantic principal.
5. `not-applicable` MUST remain distinguishable from `not-listed`.
6. Unsupported decision-critical processing MUST yield `indeterminate`, never an authoritative denial and never a broadened positive.
7. Historical uncertainty MUST remain `indeterminate`; lack of historical proof MUST NOT be reinterpreted as current or historical denial.

## Candidate response examples

Positive:

```json
{
  "decision": "positive",
  "reason": "established"
}
```

Authoritative negative:

```json
{
  "decision": "authoritative-negative",
  "reason": "revoked"
}
```

Indeterminate despite successful transport:

```json
{
  "decision": "indeterminate",
  "reason": "historical-evidence-incomplete",
  "authorized": false
}
```

Not applicable:

```json
{
  "decision": "not-applicable",
  "reason": "outside-scope"
}
```

## Evidence

WP5 establishes the core evidence semantics: missing records are not inherently negative; absence becomes authoritative only with authority, scope completeness, freshness, and applicability. It implements `positive`, `authoritative-negative`, and `indeterminate`, while explicitly distinguishing `not-listed` from `not-applicable`.

WP7 establishes that response semantics cannot safely overload `authorized: false`, and explicitly recommends preserving decision class and machine-readable reason independently from transport success.

WP6 supplies the historical-evaluation requirement that insufficient historical evidence remains indeterminate.

S21-02 and S21-03 supply protocol-processing reasons for unsupported critical semantics and unsatisfied capability/profile contracts.

## Falsification boundary

This proposal fails if a conforming client must:

- infer semantic success from HTTP/transport success;
- parse prose to distinguish negative from uncertainty;
- interpret insufficient evidence as authoritative denial;
- treat `not-applicable` as ordinary absence;
- treat revoked material as revocation of the semantic principal;
- collapse unsupported critical processing into `authorized: false` without an indeterminate decision class.

## Authority boundary

The downstream evidence establishes the need for distinct semantic decision classes and stable machine-readable reasons. The exact vocabulary remains a downstream candidate until upstream adoption. Reason strings should therefore be treated as proposed interoperability identifiers, not current upstream TRQP normative values.

## Disposition

```yaml
section21: S21-04
issue: 34
class: normative-proposal
state: downstream_proposal_ready
evidence: reference-model-backed
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
