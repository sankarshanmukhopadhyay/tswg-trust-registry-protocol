# S21-09 — Transport/profile boundary RC disposition

Status: downstream executable proposal; production binding selection remains external.

## Decision

TRQP candidate core semantics are transport-neutral. A binding carries a semantic request/response or processing failure; it does not create, remove or reinterpret semantic proposition dimensions.

## Binding contract

A conforming candidate binding MUST preserve the exact semantic principal, authority, action, resource, evaluation time and decision-critical context supplied by the semantic layer. Transport success/failure is not a semantic decision.

The reference model and falsification suite are:

- `development/verification-material/transport-binding.js`
- `tests/s21-09-transport-profile-boundary.test.js`

The suite establishes that HTTP 200 without a semantic result is not positive, HTTP 404 is not authoritative negative, timeout/unavailability remains a processing failure, and an explicit semantic decision survives transport mapping.

## Profile composition

Profiles strengthen processing obligations. Compatible profile requirements compose additively. If one applicable profile requires an obligation that another prohibits, admission fails closed before evaluation. Profile composition MUST NOT remove decision-critical context, material binding, evidence requirements or semantic scope merely to make evaluation succeed.

## RFC 9457 boundary

For HTTP, processing failures MAY use RFC 9457 Problem Details as already specified by candidate Section 15. Problem Details carries processing-error information; it MUST NOT be interpreted as a semantic negative result.

## Production binding disposition

The RC does not need to select a new production binding beyond approved v2 in order to make core semantics deterministic. Selection and independent interoperability validation of a production binding are explicitly deferred. This preserves the authority boundary while eliminating the semantic ambiguity that would cause incompatible implementations.

```yaml
section21: S21-09
class: research/evidence
rc_disposition: deferred-production-binding
transport_neutral_semantic_contract: executable
profile_composition_invariants: executable
http_failure_semantics: executable
independent_production_interop: pending
release_blocking: false
research_tracks: [NTRQP-006, NTRQP-008]
upstream_authority: pending
```
