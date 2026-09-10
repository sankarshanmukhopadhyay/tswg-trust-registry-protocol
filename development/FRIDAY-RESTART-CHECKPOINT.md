# Friday restart checkpoint — downstream TRQP assurance tranche

Prepared: Wednesday, 2026-09-09  
Target: wrap the bounded downstream development tranche on Friday, 2026-09-11.  
Status: experimental work remains isolated from stable `main`.

## Objective for Friday

Complete the current downstream TRQP verification-material/evidence tranche through WP8, produce independent cross-repository evidence, synthesize the evidence-backed candidate-next-TRQP semantics, run assurance/regression checks, and reach an explicit promotion/release judgment **without automatically merging experimental semantics into `main`**.

Upstream normative work remains outside this completion boundary. Relevant upstream TRQP issues must be added using full URLs when available and reconciled before downstream candidate text is described as stable or upstream-aligned.

## Non-negotiable repository boundary

Stable `main` is not an experimentation branch.

For every repository touched on Friday:

1. fetch/check the current stable `main` before beginning;
2. keep candidate TRQP semantics on dedicated `feat/`, `test/`, or experimental branches;
3. record exact branch/commit provenance in evidence;
4. promote only reusable/stable machinery after an explicit artifact-level judgment;
5. do not wholesale-merge an experimental branch merely because CI is green;
6. compare experimental head against `main` before any promotion decision;
7. preserve upstream synchronization expectations for the TRQP fork.

## Canonical repositories and trackers

TRQP downstream fork:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol

Umbrella work:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1

Candidate evidence/indeterminacy semantics:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/3

WP7 wire/versioning:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/4

Interop Lab verification-material tracker:
https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/205

Interop Lab WP5/WP6 evidence tracker:
https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/206

TSPP lifecycle/invalidation tracker:
https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/79

TSPP evidence completeness/freshness tracker:
https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/80

External motivating reference (citable provenance, not normative text):
https://github.com/ayraforum/ayra-trust-registry-resources/issues/43

Approved upstream TRQP v2 API:
https://github.com/trustoverip/tswg-trust-registry-protocol/blob/main/specification/v2-approved/core/api.md

Approved upstream TRQP v2 versioning/extensibility:
https://github.com/trustoverip/tswg-trust-registry-protocol/blob/main/specification/v2-approved/versioning.md

## Branch state to resume from

Primary current development branch:
`feat/wp7-wire-compatibility`

It descends from the WP6 implementation branch and contains the WP1–WP7 experimental implementation/evidence accumulated for this tranche.

Other experimental branches already created for cross-repository work include:

- TRQP-TSPP: `feat/wp6-historical-evidence`
- Interop Lab: `feat/trqp-wp6-historical-evidence`

Before reusing these on Friday, compare them with each repository's current `main`. If drift is material, create a fresh WP8 branch from current `main` and port only the necessary experimental fixtures/harness changes. Do not assume a Wednesday branch is automatically the right Friday base.

## Evidence already established

### WP1 — principal/material separation

Semantic principal identity is distinct from independently governed verification material.

### WP2 — exact material-bound evaluation

A material-qualified authorization must evaluate the exact principal/material/authority/action/resource proposition. Material mismatch must not fall back to principal-only authorization.

### WP3 — decision-critical conditions

Unsupported decision-critical query conditions must not be silently ignored when doing so broadens the proposition and can create a false positive.

### WP4 — lifecycle/invalidation

Verification material can rotate, expire, be revoked or be superseded independently of the semantic principal. Material invalidation invalidates material-dependent propositions; it does not automatically revoke the principal.

### WP5 — evidence authority/completeness/freshness

Repository-local tests distinguish:

- `positive`;
- `authoritative-negative`;
- `indeterminate`.

Absence supports a definitive negative only when the source is authoritative, complete for the declared scope, and temporally sufficient. Stale/non-authoritative/incomplete evidence cannot silently become a positive or negative.

### WP6 — historical evaluation

Historical state is established from effective-dated authoritative evidence applicable to requested time T. Current state must not be projected backwards. No covering evidence, conflicting evidence, incomplete evidence, or non-authoritative evidence yields indeterminate rather than invented history.

### WP7 — compatibility and candidate wire semantics

Approved TRQP v2 already has `context.time`, so the core incompatibility is processing semantics rather than merely JSON shape.

Approved v2 permits/mandates unknown optional context to be ignored. WP3 requires unsupported decision-critical context to fail closed/indeterminate. These rules conflict.

Repository-local experiments establish:

- optional `context.verification_material` on generic v2 is unsafe;
- a profile identifier alone is insufficient;
- a critical-members mechanism works only when the mechanism itself is understood;
- introducing `critical_context` as another optional v2 field has a bootstrap/downgrade problem;
- a pre-negotiated profile can be transitional only if it excludes generic legacy peers and binds mandatory qualifier processing;
- working recommendation: candidate TRQP 3.0 processing semantics rather than transparent TRQP 2.1 extension.

Candidate schemas/conformance work is on:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/tree/feat/wp7-wire-compatibility

Key files:

- `development/verification-material/wp7-wire.js`
- `development/verification-material/WP7-v2-compatibility.md`
- `development/verification-material/WP7-wire-candidate.md`
- `development/verification-material/schemas/wp7-request.schema.json`
- `development/verification-material/schemas/wp7-response.schema.json`
- `development/verification-material/wp7-conformance.js`
- `tests/wp7-wire-compatibility.test.js`
- `tests/wp7-conformance-vectors.test.js`

Roadmap:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/feat/wp7-wire-compatibility/development/DOWNSTREAM-ROADMAP.md

## Friday execution sequence — gate driven, not time padded

### Gate F0 — re-establish truth

- inspect current open issues/PRs and branch heads in all three downstream repositories;
- inspect Actions status for the latest WP7 commits;
- compare experimental branches against current stable `main`;
- confirm no unexpected upstream sync/drift affects assumptions;
- update this checkpoint if repository state materially changed.

**Exit:** exact starting SHAs/branches and CI state are known.

### Gate F1 — close WP7 repository-local work

Complete:

- response reason vocabulary;
- explicit capability/profile contract;
- remaining downgrade/conformance vectors;
- candidate traceability update;
- final TRQP 2.x versus 3.0 versioning recommendation;
- documentation consistency check.

Run full repository-local tests.

**Exit:** WP7 CI GREEN and https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/4 can be closed with an evidence summary.

### Gate F2 — Interop Lab independent evidence

Use an experimental branch based on current Interop Lab `main`.

Implement/execute independent fixtures/adapters for at least:

1. material-qualified positive;
2. material mismatch;
3. revoked material;
4. superseded/rotated material;
5. authoritative complete absence;
6. incomplete absence -> indeterminate;
7. stale listed evidence -> indeterminate;
8. stale absence -> indeterminate;
9. historical validity followed by later revocation;
10. no historical evidence -> indeterminate;
11. unsupported critical qualifier -> fail closed;
12. legacy-v2 downgrade -> demonstrated false-positive risk;
13. not-applicable distinct from not-listed;
14. wrong purpose/resource/material binding.

Evidence must record branch, commit, protocol/candidate profile, inputs, expected outcome, observed outcome, and relevant provenance.

**Exit:** machine-verifiable independent evidence linked to https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/205 and https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/206 .

### Gate F3 — TSPP independent validation

Use an experimental branch based on current TRQP-TSPP `main`.

Validate the independent implementation implications of:

- lifecycle/invalidation;
- source completeness and freshness;
- authoritative negative vs indeterminate;
- historical/effective-dated evidence;
- cache/invalidation behavior where already within TSPP scope.

Do not import the fork's evaluator as the test oracle. TSPP should provide independent evidence rather than duplicate unit tests.

**Exit:** evidence linked to https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/79 and https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/80 .

### Gate F4 — candidate-next-TRQP synthesis

Using repository-local + Lab + TSPP evidence:

- update NTRQP traceability states;
- draft coherent downstream candidate processing requirements;
- clearly separate v2-compatible syntax from breaking processing semantics;
- retain full upstream/external provenance URLs;
- mark unresolved upstream authority explicitly;
- resolve/close https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/3 if its acceptance conditions are genuinely met.

**Exit:** every behavioural candidate requirement maps to implementation and falsification/interop evidence.

### Gate F5 — assurance/regression sweep

Run:

- complete test suite;
- schema/conformance vectors;
- v2 regression/baseline checks;
- docs and full-URL link audit;
- stale/duplicate documentation review;
- branch/main comparison;
- residual-risk and unresolved-normative-question inventory;
- check that stable `main` in each cross-repo project has not been contaminated by experimental semantics.

**Exit:** no unexplained failures, evidence gaps are explicit, stable boundaries intact.

### Gate F6 — close or retain umbrella issue

Evaluate https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1 against its actual acceptance criteria.

Close only if WP8, regression, cross-repo linkage, schemas/conformance and promotion judgment are genuinely satisfied. Otherwise leave open with the exact residual blockers.

### Gate F7 — promotion/release judgment

Do **not** automatically merge to `main`.

Classify artifacts individually:

- stable reusable harness/tooling potentially promotable;
- experimental TRQP 3.0 semantics retained on candidate branch;
- evidence artifacts retained with exact commit provenance;
- documentation that can safely describe experimental work without changing stable protocol behavior.

Decide whether to:

1. retain the candidate branch only;
2. publish a clearly downstream/experimental release/tag;
3. promote selected stable machinery to `main` via PR;
4. defer all promotion until upstream reconciliation.

## Definition of Friday “wrapped up”

The tranche is considered wrapped when:

- WP7 repository-local work is GREEN and dispositioned;
- WP8 has independent Interop Lab and TSPP evidence, or any unavailable evidence is explicitly recorded as the sole blocker;
- candidate-next-TRQP propositions are evidence-traceable;
- remaining downstream issues are closed or have precise residual blockers;
- stable `main` branches remain separate from experimental semantics;
- no experimental branch has been wholesale merged merely for convenience;
- a clear promotion/release decision is recorded;
- upstream reconciliation is explicitly left as future work where upstream issues are not yet available.

## Recommended Friday opening prompt

> Resume the downstream TRQP work from `development/FRIDAY-RESTART-CHECKPOINT.md` on `feat/wp7-wire-compatibility`. First execute Gate F0 and report current repository/CI/branch truth. Then proceed gate-by-gate toward Friday wrap-up. Keep stable `main` separate from all experimental TRQP semantics, use full URLs for GitHub references, and do not merge experimental branches to `main` without an explicit promotion judgment. Relevant upstream TRQP issues should be added when available.

## Commit metadata for this checkpoint

Commit title:
`docs(checkpoint): add Friday TRQP completion restart context`

Purpose:
Persist sufficient architecture, evidence, repository-boundary, issue, and execution context so the downstream tranche can be resumed without relying on chat history.
