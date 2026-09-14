# TRQP v3 candidate schema reconciliation

**Status:** downstream candidate release-control record.

## Finding

The candidate semantic contract is intentionally richer than approved v2 wire vocabulary. Candidate processing includes exact proposition scope, decision-critical context, verification-material qualification, evaluation time, evidence state, richer decision classes, required profiles and explicit negotiation/downgrade behavior.

It would be unsafe to claim unchanged v2 schemas fully express these semantics. It would also exceed downstream authority to invent final upstream v3 schema identifiers and present them as adopted.

## RC disposition

For the downstream RC proposal:

1. approved v2 schemas remain stable on `main`;
2. candidate request/response schemas under `development/verification-material/schemas/` are proposal-grade executable contracts;
3. candidate prose and executable schemas must express the same decision-critical semantics;
4. examples must validate against the candidate executable contract where fields are represented;
5. final schema identifiers, publication locations and adopted member spelling remain upstream authority.

## Required candidate request surface

A proposal-grade v3 request contract must be capable of representing without semantic loss:

- candidate version/processing contract;
- exact subject/entity and authority;
- action and resource/scope;
- requested/evaluation time where applicable;
- critical-context declaration and corresponding values;
- verification-material qualification when material-specific evaluation is requested;
- required processing profiles.

## Required candidate response surface

A proposal-grade v3 response contract must be capable of representing without semantic loss:

- semantic decision class;
- machine-actionable reason;
- authorization/recognition result where applicable without collapsing decision state;
- evaluation time;
- evidence state;
- evidence references/provenance/authority/completeness sufficient for the applicable contract;
- processing failure separately from authoritative semantic negative.

## Prohibited reconciliation shortcuts

Schema compatibility MUST NOT be achieved by:

- dropping decision-critical context;
- removing verification-material qualification;
- collapsing `indeterminate` into `negative` or `false`;
- treating HTTP/transport status as semantic decision;
- omitting evaluation time when it changes the proposition;
- silently downgrading candidate processing to generic v2;
- treating capability/profile advertisement as authority.

## Authority and release boundary

`schema_reconciled: true` for this downstream candidate means that proposal-grade schemas, examples, normative prose and executable processing agree on the candidate semantic contract. It does **not** mean Trust Over IP has adopted final v3 JSON Schema identifiers or wire spelling.

```yaml
schema_reconciliation:
  v2_stable_artifacts_preserved: true
  candidate_schema_contract: proposal-grade
  semantic_field_loss_allowed: false
  prose_schema_drift_allowed: false
  final_v3_schema_identifiers: upstream-authority-pending
  upstream_adoption_claimed: false
```