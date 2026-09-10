# F5 — assurance and regression sweep

Status: **PASS with bounded residual authority/documentation work**

Scope: downstream experimental candidate line only. This report does not authorize promotion to `main`.

## Tested candidate

- F4 synthesis commit: `91382e0d33a899fb60e4e59978fd95dd96cf371d`
- F5 dependency-preservation fix: `3eda6b41dbd7a47d023138a9fcbd16f263b958dd`
- Stable TRQP fork `main`: `6863733878f3657e05f70764bb474a9fb918de9a`
- Interop Lab evidence on `main`: `30ab9d0ab8e3c2cc053d3f40cfd50809c965715d`
- TSPP evidence on `main`: `6f1772bb6d304401cfb700c480d54965b6526fdb`

## Automated regression result

GitHub Actions run 34425492445 executed `node --test tests/*.test.js` against the F4 synthesis head and completed successfully.

Result: **80 tests, 80 pass, 0 fail, 0 skipped, 0 todo**.

The suite covers the approved-v2 baseline characterization plus WP1–WP7 model, exact binding, critical qualifier, lifecycle, evidence/indeterminacy, historical evaluation, candidate conformance, reason-class and downgrade vectors.

The F5 package audit found one unrelated dependency drift introduced on the experimental lineage: `markdown-it-mark` had changed from the stable baseline `^2.0.0` to `1.0.2` while adding the test script. This was not required by the tranche and was reverted in `3eda6b4`; the only intended `package.json` behavioural addition is now the repository-local `test` script.

## Approved-v2 contamination check

The approved-v2 specification directory and core schema entries on the candidate branch have the same blob SHAs as stable `main`, including:

- `specification/v2-approved/versioning.md` — `49bb1cc7c02ee0548ce447dc3190283b1737fc36`
- `specification/v2-approved/core/api.md` — `9f681181078217a31cda2c8f09e8fad5514fb1e9`
- authorization request schema — `516d8c17043e136788967fa0aa4b0b9762e1804b`
- authorization response schema — `ba0701d676bade714c20d214e231130b26cb6225`
- recognition request schema — `8e9724bd84448bf98ba3c4415194dd64a553ba0f`
- recognition response schema — `237279ce6286056eca807823ca9b025d4dfe8407`

Therefore the experimental candidate has not rewritten approved TRQP v2 normative artifacts.

## Cross-repository boundary check

Interop Lab and TSPP `main` contain independently validated evidence artifacts, not a wholesale import of the TRQP candidate evaluator. Their current evidence commits are independently merged and their WP8 trackers are closed.

The TRQP fork `main` remains at its stable upstream-derived commit and does not contain the candidate semantics. Candidate semantics remain isolated on `feat/wp8-candidate-spec-synthesis`.

## Upstream reconciliation discovered during F5

The older `draft/next-trqp` traceability register is not current. It remains at `9b766bc0a06807348ea1e44c6035866a121d85e9`, contains `interop-pending` states that have now been satisfied for this tranche, and points to earlier experimental branch names.

It nevertheless identifies relevant upstream issues that are now available and must be treated as authority inputs rather than saying upstream references are unavailable:

- lifecycle/time semantics: https://github.com/trustoverip/tswg-trust-registry-protocol/issues/176
- endpoint discovery: https://github.com/trustoverip/tswg-trust-registry-protocol/issues/177
- transport extensibility: https://github.com/trustoverip/tswg-trust-registry-protocol/issues/178
- governance profiles: https://github.com/trustoverip/tswg-trust-registry-protocol/issues/181
- recognition modeling: https://github.com/trustoverip/tswg-trust-registry-protocol/issues/182
- security profiles: https://github.com/trustoverip/tswg-trust-registry-protocol/issues/183
- certificate/public-key identifiers and PKI registry semantics: https://github.com/trustoverip/tswg-trust-registry-protocol/issues/194

Issue #194 is especially material: it explicitly asks how certificate/public-key identity, authority identity, registry/source identity, endpoint location, rollover/revocation and requested time should compose. The downstream principal/material model is therefore evidence relevant to an active upstream normative question, but it is not a substitute for that upstream disposition.

## Residual risks / unresolved questions

1. **Normative authority:** exact wire vocabulary, major-version designation and normative processing language remain upstream decisions.
2. **Traceability split:** `draft/next-trqp` is stale relative to the completed WP6–WP8 evidence. Do not maintain two competing canonical candidate registers. F6/F7 should designate the WP8 synthesis (or a successor consolidated artifact) as the downstream evidence source and retire/reconcile the stale register deliberately.
3. **Identifier model:** upstream #194 still has an open design choice over whether certificate/key identity is the semantic `entity_id` in a PKI profile versus an independently qualified verification-material dimension. Our evidence supports preserving the distinction where the proposition is about a principal, but upstream owns the final profile/core decision.
4. **Lifecycle compatibility:** upstream #176 proposes optional/profile-based lifecycle semantics with backward compatibility. Our WP7 evidence shows that a condition is not safely optional when silently ignoring it can broaden the evaluated proposition. This tension requires explicit upstream reconciliation.
5. **Profile semantics:** upstream #181/#183 state that governance/security profiles should not alter core query semantics. Candidate critical-processing obligations must therefore not be smuggled into such a profile without an explicit processing/version contract.
6. **Discovery:** upstream #177 is relevant to capability/profile discovery but does not by itself solve negotiation or must-understand semantics.
7. **Transport and recognition:** upstream #178/#182 remain adjacent candidate-next-draft concerns but are not blockers to closing this bounded principal/material tranche.

## Documentation/link audit

The F4 synthesis uses full URLs for downstream evidence and approved-v2 provenance. The audit found no need to modify stable GitHub Pages/specification content.

The principal documentation defect is the stale `draft/next-trqp` register described above. It should be reconciled rather than copied into the current branch because parallel traceability authorities would reduce auditability.

## F5 judgment

**F5 passes.**

Machine evidence is green, the approved-v2 baseline is byte-identical in the inspected normative/schema artifacts, stable TRQP `main` remains uncontaminated, independent evidence exists in the Lab and TSPP, and remaining gaps are authority/reconciliation questions rather than unexplained implementation failures.

This permits F6 issue disposition and F7 promotion/release judgment. It does **not** authorize merging `feat/wp8-candidate-spec-synthesis` to `main`.

```yaml
assurance:
  gate: F5
  result: pass
  automated_tests:
    total: 80
    passed: 80
    failed: 0
  stable_main_contaminated: false
  approved_v2_modified: false
  independent_interop_evidence: true
  independent_tspp_evidence: true
  residual_blocker_type: upstream-authority-and-traceability-reconciliation
```
