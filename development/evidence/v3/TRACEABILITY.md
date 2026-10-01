# Candidate Next TRQP — Traceability Register

Status: **downstream experimental / non-normative**

This register prevents candidate specification language from becoming detached from authority, implementation evidence, independent falsification, and upstream disposition.

Executable verification consolidated into `draft/next-trqp` is authoritative only for downstream implementation and test status. This register records proposition-level provenance and evidence state; it does not confer upstream normative authority.

## Status vocabulary

- `identified` — requirement/question has provenance but insufficient executable evidence;
- `implemented` — downstream reference behaviour exists;
- `tested` — focused repository-local executable tests exist;
- `independent-evidence` — cross-repository implementation/falsification evidence exists;
- `candidate-text` — evidence is sufficient to support non-normative candidate specification language;
- `upstream-reconciled` — relevant upstream disposition has been explicitly evaluated;
- `blocked` — evidence or authority gap prevents advancement.

States are cumulative where appropriate. `candidate-text` does **not** imply `upstream-reconciled` or normative adoption.

## Register

| ID | Candidate proposition | Upstream / external provenance | Implementation evidence | Falsification / assurance evidence | State |
| --- | --- | --- | --- | --- | --- |
| NTRQP-001 | Principal identity and independently governed verification material must not be implicitly conflated when the trust proposition is about the principal. | upstream #194; Ayra #43; HVA identifiers work | `development/verification-material/model.js` | `tests/principal-material-model.test.js`; independent Lab/TSPP evidence | tested / independent-evidence / candidate-text |
| NTRQP-002 | A material-bound authorization must evaluate the exact principal/material/authority/action/resource tuple and must not fall back to principal-only authorization on material mismatch. | Ayra #43; upstream #194 | `development/verification-material/evaluator.js` | `tests/material-bound-evaluation.test.js`; independent Lab/TSPP evidence | tested / independent-evidence / candidate-text |
| NTRQP-003 | An unsupported decision-critical query condition must not be silently ignored in a way that broadens the evaluated proposition and permits a false positive. | approved-v2 extensibility baseline; upstream result/context provenance | `development/verification-material/critical-qualifiers.js`; `development/verification-material/negotiation.js` | `tests/critical-qualifier.test.js`; `tests/wire-compatibility.test.js`; `tests/negotiation-migration.test.js` | tested / independent-evidence / candidate-text |
| NTRQP-004 | Lifecycle state and evaluation time must deterministically distinguish current, revoked, expired, superseded and historical material-bound propositions; invalidation identifies the affected object/proposition rather than implicitly invalidating the principal. | upstream #176/#194; historical #158/#10; Ayra #43 | `development/verification-material/lifecycle.js`; `development/verification-material/history.js` | `tests/material-lifecycle.test.js`; `tests/historical-evaluation.test.js`; independent Lab/TSPP evidence | tested / independent-evidence / candidate-text |
| NTRQP-005 | Authoritative negative evidence must remain distinguishable from absence in incomplete/unknown sources and from stale/insufficient evidence; definitive absence requires an authoritative, complete and temporally sufficient source for the declared scope. | Ayra #43; downstream evidence trackers; upstream treatment unresolved | `development/verification-material/evidence.js` | `tests/evidence-indeterminacy.test.js`; independent Lab/TSPP evidence | tested / independent-evidence / candidate-text |
| NTRQP-006 | Core query semantics should remain transport-independent while HTTPS/REST remains a defined binding. | upstream #178 | `development/verification-material/transport-binding.js` | `tests/s21-09-transport-profile-boundary.test.js` | tested / candidate-text / upstream-reconciled; independent external binding interop pending |
| NTRQP-007 | Endpoint/capability discovery should be specified separately from the meaning of authorization/recognition decisions. | upstream #177 | `development/verification-material/discovery.js`; `development/verification-material/discovery-independent.js`; `development/verification-material/discovery-well-known.js` | `tests/s21-05-capability-discovery.test.js`; `tests/s21-05-differential-interop.test.js`; `tests/s21-05-well-known-binding.test.js` | tested / candidate-text / upstream-reconciled; local differential only, independent external interop pending |
| NTRQP-008 | Governance and security assurance profiles may strengthen metadata/security posture without silently redefining the core trust proposition. | upstream #181/#183 | `development/verification-material/negotiation.js` | `tests/negotiation-migration.test.js` | tested (bounded compatibility property); broader profile semantics remain identified |
| NTRQP-009 | Direct recognition is explicitly scoped and remains distinct from authorization, material validity and discovery; graph connectivity alone must not create transitive recognition. Positive propagation semantics remain research. | upstream #182 | candidate direct-recognition semantics in `specification/v3/TRQP-V3.md`; conformance evaluator/vector surfaces | `TRQP3-REC-001/002`; conformance and agentic non-transitivity coverage; `specification/v3/conformance/TRACEABILITY.md` | tested / candidate-text / upstream-reconciled for direct-recognition/non-transitivity; positive propagation remains identified research; independent external interop pending |
| NTRQP-010 | Entity identifier semantics must make identifier class/scope, comparison or normalization, subject binding, lifecycle and correlation boundaries explicit enough that independent implementations evaluate the same proposition. | issue #68; CAWG #275 as external context | no dedicated entity-identifier implementation evidence yet | no dedicated entity-identifier falsification/interoperability evidence yet | identified / research |
| NTRQP-PKI-001 | PKI profiles must distinguish authority identity, semantic principal identity, certificate/key identity, registry/source identity, and endpoint location. This proposition was formerly recorded as NTRQP-010 before issue #68 assigned that identifier to entity-identifier semantics. | upstream #194; Ayra #43 | `development/verification-material/model.js`; `development/verification-material/evaluator.js` | principal/material and material-bound evaluation tests; independent Lab/TSPP evidence | tested / independent-evidence / candidate-text |
| NTRQP-011 | Candidate decision-critical semantics must be admitted only after version/profile/processing-capability negotiation establishes mandatory processing obligations; failed negotiation must not fall back to generic v2 evaluation. | upstream #181/#183; approved-v2 compatibility baseline | `development/verification-material/negotiation.js` | `tests/negotiation-migration.test.js` | tested / candidate-text; independent evidence pending |

## Reconciliation note — 2026-10-02

Issue #71 reconciled this register against the current v3 candidate, conformance register, Section 21 dispositions and executable tests. Repository-local differential evidence remains explicitly distinct from independent organizational interoperability. The historical PKI proposition formerly labeled NTRQP-010 is retained as `NTRQP-PKI-001` to resolve the collision introduced when issue #68 established NTRQP-010 for entity-identifier semantics; no historical evidence claim is discarded by that identifier repair.

## Evidence rule

A row MUST NOT advance to `candidate-text` solely because an upstream issue proposes the feature. Behavioural propositions require repository-local implementation/test evidence and, where the proposition affects interoperability or safety, independent falsification evidence.

Closure of an evidence tracker is disposition evidence, not by itself proof. Retained test vectors, fixtures, generated evidence and merged implementation artifacts remain the assurance basis.

## Promotion rule

Promotion beyond downstream candidate status requires all applicable gates:

1. repository-local regression/conformance evidence;
2. independent interoperability/falsification evidence;
3. residual-risk inventory;
4. explicit reconciliation with relevant upstream TRQP decisions;
5. artifact-level promotion judgment.

No row currently claims upstream adoption. Remaining authority gaps must stay visible until resolved.

```yaml
change:
  type: docs
  scope: candidate-next-trqp-traceability
  breaking: false
  authority_impact: none
  assurance_impact: high
  normative_status: downstream-experimental
```
