# Candidate Next TRQP — Traceability Register

Status: **downstream experimental / non-normative**  
Plan: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/draft/next-trqp/development/next-draft/NEXT-DRAFT-PLAN.md

This register prevents candidate specification language from becoming detached from authority, implementation evidence, independent falsification, and upstream disposition.

The executable WP0–WP8 work consolidated into `draft/next-trqp` by PR #5 is authoritative for downstream implementation and test status. This register records proposition-level provenance and promotion state; it does not confer upstream normative authority.

## Status vocabulary

- `identified` — requirement/question has provenance but no sufficient executable evidence yet;
- `implemented` — downstream reference behaviour exists;
- `tested` — focused repository-local executable tests exist;
- `independent-evidence` — cross-repository implementation/falsification evidence exists;
- `candidate-text` — evidence is sufficient to draft non-normative candidate specification language;
- `upstream-reconciled` — relevant upstream disposition has been explicitly evaluated;
- `blocked` — evidence or authority gap prevents advancement.

States are cumulative where appropriate. `candidate-text` does **not** imply `upstream-reconciled` or normative adoption.

## Register

| ID | Candidate proposition | Upstream / external provenance | Implementation evidence | Falsification / assurance evidence | State |
| --- | --- | --- | --- | --- | --- |
| NTRQP-001 | Principal identity and independently governed verification material must not be implicitly conflated when the trust proposition is about the principal. | https://github.com/trustoverip/tswg-trust-registry-protocol/issues/194 ; https://github.com/ayraforum/ayra-trust-registry-resources/issues/43 ; https://trustoverip.github.io/high-assurance-verifiable-identifiers/ | `development/verification-material/model.js`; `development/verification-material/WP1-model.md`; WP8 NTRQP-01 | `tests/wp1-principal-material-model.test.js`; Interop Lab #205 / PR #207; TSPP #79 / PR #81; F5 assurance sweep | tested / independent-evidence / candidate-text |
| NTRQP-002 | A material-bound authorization must evaluate the exact principal/material/authority/action/resource tuple and must not fall back to principal-only authorization on material mismatch. | https://github.com/ayraforum/ayra-trust-registry-resources/issues/43 ; https://github.com/trustoverip/tswg-trust-registry-protocol/issues/194 | `development/verification-material/evaluator.js`; `development/verification-material/WP2-evaluation.md`; WP8 NTRQP-02 | `tests/wp2-material-bound-evaluation.test.js`; Interop Lab #205 / PR #207; TSPP #79 / PR #81; F5 assurance sweep | tested / independent-evidence / candidate-text |
| NTRQP-003 | An unsupported decision-critical query condition must not be silently ignored in a way that broadens the evaluated proposition and permits a false positive. | https://github.com/ayraforum/ayra-trust-registry-resources/issues/43 ; approved TRQP v2 extension semantics characterized in `development/verification-material/WP0-baseline.md` | `development/verification-material/critical-qualifiers.js`; `development/verification-material/WP3-critical-qualifiers.md`; WP8 NTRQP-03 | `tests/wp3-critical-qualifier.test.js`; WP7 downgrade-falsification vectors; Interop Lab #205 / PR #207; TSPP PR #81; F5 assurance sweep | tested / independent-evidence / candidate-text |
| NTRQP-004 | Lifecycle state and evaluation time must deterministically distinguish current, revoked, expired, superseded and historical material-bound propositions; invalidation identifies the affected object/proposition rather than implicitly invalidating the principal. | https://github.com/trustoverip/tswg-trust-registry-protocol/issues/176 ; https://github.com/trustoverip/tswg-trust-registry-protocol/issues/194 ; https://github.com/ayraforum/ayra-trust-registry-resources/issues/43 | `development/verification-material/lifecycle.js`; `development/verification-material/history.js`; `development/verification-material/WP4-lifecycle.md`; `development/verification-material/WP6-historical-evaluation.md`; WP8 NTRQP-04/NTRQP-07 | WP4/WP6 lifecycle and historical tests; Interop Lab #205 / PR #207; TSPP #79 / PR #81; F5 assurance sweep | tested / independent-evidence / candidate-text |
| NTRQP-005 | Authoritative negative evidence must remain distinguishable from absence in incomplete/unknown sources and from stale/insufficient evidence; definitive absence requires an authoritative, complete and temporally sufficient source for the declared scope. | https://github.com/ayraforum/ayra-trust-registry-resources/issues/43 ; downstream trackers #2/#3; relevant upstream disposition still required | `development/verification-material/evidence.js`; `development/verification-material/WP5-evidence-semantics.md`; WP8 NTRQP-05/NTRQP-06/NTRQP-08 | `tests/wp5-evidence-indeterminacy.test.js`; TSPP #80 / PR #81; Interop Lab #206 / PR #207; F5 assurance sweep | tested / independent-evidence / candidate-text |
| NTRQP-006 | Core query semantics should remain transport-independent while HTTPS/REST remains a defined binding. | https://github.com/trustoverip/tswg-trust-registry-protocol/issues/178 | none sufficient yet | none sufficient yet | identified |
| NTRQP-007 | Endpoint/capability discovery should be specified separately from the meaning of authorization/recognition decisions. | https://github.com/trustoverip/tswg-trust-registry-protocol/issues/177 | none sufficient yet | none sufficient yet | identified |
| NTRQP-008 | Governance and security assurance profiles may strengthen metadata/security posture without silently redefining the core trust proposition. | https://github.com/trustoverip/tswg-trust-registry-protocol/issues/181 ; https://github.com/trustoverip/tswg-trust-registry-protocol/issues/183 | none sufficient yet | none sufficient yet | identified |
| NTRQP-009 | Recognition semantics require explicit relationship/evidence/lifecycle rules; transitivity must not be assumed merely from graph connectivity. | https://github.com/trustoverip/tswg-trust-registry-protocol/issues/182 | none sufficient yet | none sufficient yet | identified |
| NTRQP-010 | PKI profiles must distinguish authority identity, semantic principal identity, certificate/key identity, registry/source identity, and endpoint location. | https://github.com/trustoverip/tswg-trust-registry-protocol/issues/194 ; https://github.com/ayraforum/ayra-trust-registry-resources/issues/43 | WP1/WP2 model and evaluator evidence; WP8 NTRQP-01/NTRQP-02 | Interop Lab #205 / PR #207; TSPP #79 / PR #81; F5 assurance sweep | tested / independent-evidence / candidate-text |

## Candidate synthesis relationship

`development/verification-material/WP8-candidate-spec-synthesis.md` is the evidence-backed candidate semantic synthesis. It expands the register into fourteen candidate requirements/classifications, including compatibility requirements, experimental wire propositions, and unresolved upstream authority questions.

The two artifacts have different jobs:

- this register controls **provenance and promotion state**;
- WP8 controls the **coherent candidate processing model and compatibility judgment**.

Neither artifact modifies or supersedes `specification/v2-approved/`.

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

No row currently carries `upstream-reconciled`. NTRQP-006 through NTRQP-009 remain `identified` until executable evidence exists; upstream proposals alone do not advance them.

## F6 reconciliation record

F6 reconciled the register after WP0–WP8 consolidation onto `draft/next-trqp`:

- removed stale feature-branch evidence references;
- removed obsolete WP6-pending language;
- replaced obsolete `interop-pending` states where independent Lab/TSPP evidence has been completed;
- preserved the stable/candidate authority boundary;
- retained NTRQP-006 through NTRQP-009 as evidence gaps rather than inferring implementation;
- made upstream reconciliation an explicit, separately testable promotion gate.

```yaml
change:
  type: docs
  scope: candidate-next-trqp-traceability
  breaking: false
  authority_impact: none
  assurance_impact: high
  normative_status: downstream-experimental
```
