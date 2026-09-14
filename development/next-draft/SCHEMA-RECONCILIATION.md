# TRQP v3 Candidate — Schema Reconciliation

Status: downstream candidate release-control record.

## Finding

The candidate semantics intentionally extend beyond the approved v2 request/response vocabulary. The v3 candidate now treats exact action/resource/context/time, critical context, verification-material qualification, evidence state, richer decision classes, profiles and negotiation/discovery as interoperable semantic concerns.

It would be unsafe to claim that unchanged v2 schemas fully describe those semantics. Conversely, inventing final upstream v3 schema names/URIs in this downstream repository would cross the authority boundary.

## Downstream disposition

1. Preserve approved v2 schemas on stable `main`.
2. Treat `draft/next-trqp` request/response structures and executable validators as candidate schema requirements.
3. Maintain informative candidate examples containing the full semantic fields.
4. Validate executable structures locally through the conformance/reference-model suite.
5. Mark final schema identifier/URI adoption as an upstream-authority action, not a downstream release blocker for producing a complete proposal.

## Candidate schema requirements

A future adopted v3 schema set must be able to represent, without semantic loss:

- protocol/version contract;
- exact subject/entity and authority;
- action and resource/scope;
- evaluation/requested time;
- critical-context declaration and values;
- verification-material qualification;
- required processing profiles;
- semantic decision class and reason;
- authorization/recognition proposition result where applicable;
- evidence state and evidence references/provenance/authority/completeness;
- enough audit correlation to reconstruct the evaluated proposition.

## Prohibited reconciliation shortcuts

The downstream candidate must not achieve schema compatibility by dropping critical context, removing verification-material qualification, collapsing indeterminate into false, equating transport status with semantic result, or silently downgrading a candidate request to v2.

## RC interpretation

For the downstream RC proposal, `schemas_valid: true` means candidate structures and examples are mechanically validated against the candidate executable contract and all known v2→v3 schema deltas are explicit. It does not mean upstream has adopted final v3 JSON Schema identifiers.

```yaml
schema_reconciliation:
  v2_schemas_preserved: true
  candidate_semantic_delta_documented: true
  silent_field_loss_allowed: false
  final_v3_schema_identifiers: upstream-authority-pending
  downstream_rc_blocker: false
```
