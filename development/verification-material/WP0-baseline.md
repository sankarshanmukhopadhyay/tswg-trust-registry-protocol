# WP0 — Baseline and compatibility characterization

Status: **complete for repository/specification baseline**  
Branch: `feat/verification-material-reference`  
Canonical tracker: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1  
External motivating evidence: https://github.com/ayraforum/ayra-trust-registry-resources/issues/43  
TSPP impact tracker: https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/79  
Interop evidence tracker: https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/205

## Purpose

WP0 establishes what the upstream-synchronised TRQP v2 baseline actually says and exposes before this fork changes behaviour. It is deliberately descriptive: findings in this document are baseline evidence, not proposed normative semantics.

## Repository shape

The repository is primarily a specification source tree rendered with Spec-Up. `package.json` exposes editing/rendering commands but no unit, schema-validation, integration, or conformance test command. The repository contains JSON schemas for authorization and recognition requests/responses, including duplicated schema locations used by the specification/rendering structure.

Relevant baseline surfaces are:

- `specification/v2-approved/core/api.md` — normative query/response definition and examples;
- `specification/v2-approved/conformance.md` — endpoint/consumer conformance requirements;
- `specification/v2-approved/versioning.md` — normative extensibility and compatibility rules;
- `specification/v2-approved/core/identifiers.md` — identifier requirements;
- `schema/*.schema.json` and corresponding specification schema copies — machine-readable request/response shapes;
- `.github/workflows/render-specs.yml` — specification rendering workflow.

## Current authorization model

The normative API defines authorization as the question:

> Does `authority_id` authorize `entity_id` to take `action` on `resource`, optionally subject to context such as time?

The request requires:

- `entity_id`;
- `authority_id`;
- `action`;
- `resource`.

`context` is optional. The schema explicitly defines `time` and `locator`, and permits additional context properties whose values are strings.

There is no first-class verification-material member in the authorization request or response.

The authorization response requires a boolean `authorized` value. The current schema therefore has no first-class result state for unknown, stale, incomplete, unsupported-critical-condition, revoked-material, or other forms of indeterminacy. A free-text `message` is optional but is not a machine-verifiable result taxonomy.

## Current recognition model

The normative API defines recognition as the question:

> Does `authority_id` recognize `entity_id` (another authority) to be authoritative for `action` on `resource`?

Recognition uses the same core four request dimensions: `entity_id`, `authority_id`, `action`, and `resource`, plus optional context.

There is no first-class verification-material member in the recognition request baseline.

## Existing extensibility semantics

TRQP v2 identifies `context` as the primary query extensibility mechanism. Profiles and bindings may add domain-specific context members.

The critical baseline rule is:

> An endpoint receiving a context member it does not recognize MUST ignore that member and process the query using only supported members.

The versioning section separately says implementations within a major version must accept queries from minor versions and ignore unrecognized optional fields.

This is the central compatibility pressure for https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1: a decision-critical verification-material condition cannot safely be introduced as an ordinary ignorable optional/context member if ignoring it can broaden a query into a positive principal-only result.

This observation does **not** decide the remedy. It establishes the baseline contradiction that WP3 must resolve.

## Unknown-member behaviour at schema level

The top-level authorization and recognition request schemas do not declare `additionalProperties: false`. Under JSON Schema semantics, additional top-level members are therefore not rejected by these schemas.

Within `context`, additional members are explicitly permitted as strings.

Consequently, the current machine-readable schemas do not themselves provide a `must-understand` boundary for a new decision-critical qualifier.

## Time / historical baseline

Both authorization and recognition requests already support `context.time`. The API frames authorization as optionally conditioned by time, and response schemas contain `time_requested` and `time_evaluated`.

This gives the reference implementation an existing temporal hook, but the baseline does not by itself define verification-material association history, material validity/revocation history, source completeness, or evidence freshness. WP6 must therefore build on the existing time dimension rather than inventing an unrelated temporal mechanism unless implementation evidence proves that necessary.

## Identifier baseline

The conformance requirements state that identifiers are represented as single strings conforming to RFC 3986 and that `authority_id` is globally unique. `action` and `resource` are non-empty strings.

WP1 must preserve the semantic role of `entity_id` as the principal under evaluation rather than silently repurposing it as a certificate/key identifier. Any verification-material identifier introduced by the reference implementation should be independently representable.

## Conformance and testing baseline

The normative conformance section defines TRQP Endpoint and TRQP Consumer targets, but explicitly states that a formal TRQP v2.0 conformance test suite does not currently exist.

The repository's `package.json` contains Spec-Up editing/rendering commands only and no test script. Therefore this development tranche cannot rely on an inherited executable conformance harness. Tests introduced by this fork will constitute new downstream evidence and must be clearly identified as such.

## Compatibility constraints

The following constraints are now treated as WP0 evidence:

| ID | Baseline constraint | Consequence for later work |
| --- | --- | --- |
| B0-01 | `entity_id`, `authority_id`, `action`, `resource` are the required query dimensions | Do not redefine existing field semantics casually |
| B0-02 | `context` is the primary extension surface | Reuse is attractive but unsafe for critical conditions under current ignore rule |
| B0-03 | Unknown `context` members MUST be ignored | A critical material qualifier cannot simply behave like an ordinary context extension |
| B0-04 | Unknown optional fields are intended to be ignored within a major version | Safe critical-extension behaviour may require explicit negotiation/query semantics or a major-version consequence |
| B0-05 | Authorization/recognition results are boolean at the schema level | Indeterminate/unsupported evidence semantics need an explicit machine-readable design if required |
| B0-06 | `context.time` already exists | Historical material evaluation should compose with the existing temporal dimension where possible |
| B0-07 | No formal conformance suite exists | This fork must create its own executable baseline/regression evidence |
| B0-08 | No first-class verification-material member exists | WP1/WP2 must add an independent abstraction without overloading principal identity |
| B0-09 | Top-level schemas do not close unknown properties | Schema acceptance alone cannot establish that a critical extension was understood |

## Baseline falsification questions carried forward

WP1–WP7 must answer, with executable evidence:

1. Can verification material be represented independently without changing the meaning of `entity_id` or `authority_id`?
2. Can a material-bound request be distinguished from a principal-only request?
3. Can an endpoint prove that it understood a decision-critical material condition?
4. Can unsupported critical conditions fail safely without violating compatibility more broadly than necessary?
5. Can material rotation/revocation invalidate a material-bound decision without automatically invalidating principal recognition?
6. Can absence in a complete authoritative source be distinguished from absence in an incomplete/unknown source?
7. Can historical evaluation use the existing `context.time` dimension while remaining evidence-bounded?
8. What change, if any, crosses the TRQP v2 major-version compatibility boundary?

## WP0 conclusion

The baseline supports the architectural concern in https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1.

The most important finding is not merely that TRQP lacks a certificate field. It is that **TRQP v2's existing extensibility contract explicitly requires unknown context/optional conditions to be ignored, while the proposed verification-material condition can be decision-critical.** A naïve additive extension can therefore create a false-positive downgrade path.

The reference implementation should proceed by first creating executable baseline tests for these existing behaviours, then introduce the smallest internal principal/material separation in WP1. Wire-format selection remains deferred until the behavioural semantics have been falsified.

## WP0 completion gate

- [x] Current query/response models inventoried.
- [x] Identifier roles identified.
- [x] Extension mechanism identified.
- [x] Unknown-extension compatibility rule identified.
- [x] Current boolean response limitation identified.
- [x] Existing temporal hook identified.
- [x] Existing conformance-test gap identified.
- [x] Compatibility constraints recorded.
- [x] Full URLs used for all issue/external references.
- [ ] Executable baseline regression harness added — intentionally carried into the first engineering commit before WP1 behaviour changes.

The final unchecked item is an implementation prerequisite rather than an unresolved baseline-analysis question. No WP1 semantic change should be committed before that harness captures the relevant current behaviour.
