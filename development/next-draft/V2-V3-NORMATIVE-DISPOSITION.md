# TRQP v2 → v3 Normative Disposition Baseline

Status: downstream release-control artifact; does not claim upstream adoption.

## Purpose

Account for every material approved-v2 behavior class before the downstream v3 candidate is considered feature complete. The release rule is preservation by explicit disposition, not accidental textual carry-over.

| v2 surface | v3 disposition | Candidate treatment | Compatibility judgment |
|---|---|---|---|
| Authorization query | changed | Retained and strengthened as exact bounded proposition over subject/authority/action/resource/context/time/evidence. | breaking semantics require negotiation |
| Recognition query | changed | Retained; direct recognition only in RC; no inferred transitivity. | deterministic strengthening |
| Delegation authority-statement type | changed | Delegation/relationship evidence is decision-critical external evidence; TRQP does not define delegation instrument. | scope clarified |
| `authority_id` | retained | Remains authority identity; never collapsed with endpoint, discovery publisher, `ni` routing authority or source-list locator. | compatible |
| `entity_id` | changed | Remains subject identity; candidate permits exact material qualification and leaves PKI-object identifier profile explicit. | profile extension |
| `action` | retained | Required proposition dimension; agentic vectors prove wrong-action failure. | compatible |
| `resource` | retained | Required scope dimension; agentic vectors prove wrong-resource failure. | compatible |
| consumer/requester scope | retained | Requester/relying-party role preserved; audit and agentic guidance strengthen interpretation. | compatible |
| read-only query protocol | retained | No registry mutation operation introduced. Lifecycle is observed/evaluated, not mutated by TRQP. | compatible |
| identifier URI requirement | changed | URI discipline retained; exact absolute-URI vs URI-reference and PKI canonicalization require explicit profile/upstream disposition. | clarification/profile |
| HTTPS binding | retained | v2 HTTPS remains stable; candidate core is transport-neutral and preserves semantic/processing separation. | compatible |
| transport status semantics | changed | HTTP success/not-found/failure cannot manufacture semantic positive/negative. RFC 9457 may represent processing errors. | semantic strengthening |
| authorization request schema | changed | Candidate adds critical context, time/material/profile semantics; final v3 schema identifier is upstream-controlled. | breaking wire extension |
| authorization response schema | changed | Candidate adds decision/reason/evidence state and audit semantics. | breaking wire extension |
| recognition request schema | changed | Candidate adds bounded context/time/profile semantics. | breaking wire extension |
| recognition response schema | changed | Candidate adds explicit decision/reason/evidence semantics and direct-recognition rule. | breaking wire extension |
| security considerations | changed | Retained and expanded with downgrade, replay, substitution, evidence injection, scope broadening and critical-context controls. | strengthening |
| privacy considerations | changed | Retained; minimization cannot remove decision-critical conditions. | strengthening |
| conformance language | changed | Stable downstream requirement IDs and executable positive/negative evidence added. | strengthening |
| versioning/extensibility | changed | Explicit pre-evaluation negotiation; silent candidate→v2 fallback prohibited. | breaking semantics |

## No-removal judgment

No approved v2 behavior class is silently removed. Where candidate behavior is stricter, the change is explicit and migration-significant. Where final wire spelling, profile identity or upstream version naming is not within downstream authority, the semantic requirement remains represented and the authority boundary is recorded.

```yaml
v2_baseline:
  normative_behavior_classes_accounted_for: true
  schemas_accounted_for: 4
  https_binding_accounted_for: true
  silent_removals: 0
  compatibility_breaks_explicit: true
  final_upstream_naming_claimed: false
```