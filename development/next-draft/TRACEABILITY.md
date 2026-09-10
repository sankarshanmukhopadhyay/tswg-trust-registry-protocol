# Candidate Next TRQP — Traceability Register

Status: **downstream experimental / non-normative**  
Plan: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/draft/next-trqp/development/next-draft/NEXT-DRAFT-PLAN.md

This register prevents candidate specification language from becoming detached from authority, implementation evidence, independent falsification, and upstream disposition.

The executable WP0–WP9 work consolidated into `draft/next-trqp` is authoritative for downstream implementation and test status. This register records proposition-level provenance and promotion state; it does not confer upstream normative authority.

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
| NTRQP-001 | Principal identity and independently governed verification material must not be implicitly conflated when the trust proposition is about the principal. | upstream #194; Ayra #43; HVA identifiers work | `model.js`; WP1; WP8 NTRQP-01 | WP1 tests; Interop Lab #205/PR #207; TSPP #79/PR #81; F5 | tested / independent-evidence / candidate-text |
| NTRQP-002 | A material-bound authorization must evaluate the exact principal/material/authority/action/resource tuple and must not fall back to principal-only authorization on material mismatch. | Ayra #43; upstream #194 | `evaluator.js`; WP2; WP8 NTRQP-02 | WP2 tests; Interop Lab #205/PR #207; TSPP #79/PR #81; F5 | tested / independent-evidence / candidate-text |
| NTRQP-003 | An unsupported decision-critical query condition must not be silently ignored in a way that broadens the evaluated proposition and permits a false positive. | approved-v2 extensibility baseline; upstream result/context provenance | `critical-qualifiers.js`; WP3; `negotiation.js`; WP9 | WP3/WP7/WP9 downgrade and admission tests; independent Lab/TSPP evidence; F5 | tested / independent-evidence / candidate-text |
| NTRQP-004 | Lifecycle state and evaluation time must deterministically distinguish current, revoked, expired, superseded and historical material-bound propositions; invalidation identifies the affected object/proposition rather than implicitly invalidating the principal. | upstream #176/#194; historical #158/#10; Ayra #43 | `lifecycle.js`; `history.js`; WP4/WP6; WP8 | WP4/WP6 tests; Interop Lab #205/PR #207; TSPP #79/PR #81; F5 | tested / independent-evidence / candidate-text |
| NTRQP-005 | Authoritative negative evidence must remain distinguishable from absence in incomplete/unknown sources and from stale/insufficient evidence; definitive absence requires an authoritative, complete and temporally sufficient source for the declared scope. | Ayra #43; downstream evidence trackers; upstream treatment unresolved | `evidence.js`; WP5; WP8 | WP5 tests; TSPP #80/PR #81; Interop Lab #206/PR #207; F5 | tested / independent-evidence / candidate-text |
| NTRQP-006 | Core query semantics should remain transport-independent while HTTPS/REST remains a defined binding. | upstream #178 | none sufficient yet | none sufficient yet | identified |
| NTRQP-007 | Endpoint/capability discovery should be specified separately from the meaning of authorization/recognition decisions. | upstream #177 | WP9 defines an abstract peer capability contract but deliberately does not define discovery | WP9 admission tests do not test discovery | identified |
| NTRQP-008 | Governance and security assurance profiles may strengthen metadata/security posture without silently redefining the core trust proposition. | upstream #181/#183 | WP9 proves that a profile label alone is insufficient and that processing obligations must be bound | `tests/wp9-negotiation-migration.test.js` profile-label and required-profile vectors | tested (bounded compatibility property); broader profile semantics remain identified |
| NTRQP-009 | Recognition semantics require explicit relationship/evidence/lifecycle rules; transitivity must not be assumed merely from graph connectivity. | upstream #182 | none sufficient yet | none sufficient yet | identified |
| NTRQP-010 | PKI profiles must distinguish authority identity, semantic principal identity, certificate/key identity, registry/source identity, and endpoint location. | upstream #194; Ayra #43 | WP1/WP2 model/evaluator; WP8 | Interop Lab #205/PR #207; TSPP #79/PR #81; F5 | tested / independent-evidence / candidate-text |
| NTRQP-011 | Candidate decision-critical semantics must be admitted only after version/profile/processing-capability negotiation establishes mandatory processing obligations; failed negotiation must not fall back to generic v2 evaluation. | upstream #181/#183; approved-v2 compatibility baseline; WP8 NTRQP-09/NTRQP-10/NTRQP-13 | `development/verification-material/negotiation.js`; `WP9-negotiation-migration.md` | `tests/wp9-negotiation-migration.test.js`; CI run #38 GREEN | tested / candidate-text; independent evidence pending |

## Candidate synthesis relationship

`development/verification-material/WP8-candidate-spec-synthesis.md` is the evidence-backed candidate semantic synthesis. WP9 narrows its compatibility hypothesis by demonstrating an executable mandatory-negotiation boundary. The exact upstream version/profile mechanism remains unresolved.

`development/next-draft/UPSTREAM-RECONCILIATION.md` records authority relationships. Neither artifact modifies or supersedes `specification/v2-approved/`.

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

No row currently carries `upstream-reconciled`. Transport, discovery, and recognition remain evidence gaps. NTRQP-008 advances only for the bounded proposition that a profile label cannot substitute for mandatory processing semantics.

## WP9 reconciliation record

WP9 adds executable evidence for the migration boundary:

- candidate requests require explicit candidate-version support;
- all required profiles must be supported;
- profiles must bind mandatory processing semantics;
- all decision-critical context must be understood;
- any failed gate terminates before evaluation;
- no candidate request falls back to generic v2;
- ordinary v2 requests are not silently reinterpreted as candidate requests.

CI run #38 passed after PR #23, and PR #23 was squash-merged into `draft/next-trqp` as `df5da136373ee0fe4ee9d107cb23413808dbaa2c`.

```yaml
change:
  type: docs
  scope: candidate-next-trqp-traceability
  breaking: false
  authority_impact: none
  assurance_impact: high
  normative_status: downstream-experimental
```
