# WP9 — negotiation and migration contract

Status: **downstream experimental evidence; non-normative**

## Question

Can candidate decision-critical semantics be introduced without allowing a generic TRQP v2 processor to silently ignore a qualifier and evaluate a broader proposition?

## Contract

Candidate processing is admitted only after capability negotiation establishes all of the following:

1. the peer explicitly supports the candidate protocol version;
2. every required profile is supported;
3. the negotiated profile binds mandatory processing semantics, including fail-closed critical context, material-bound evaluation, and decision/reason classes;
4. every declared decision-critical context member is supported by the peer.

Failure of any candidate gate produces a non-positive `indeterminate` admission result. It does not invoke the evaluator and does not fall back to generic v2 processing.

A non-candidate request is outside this admission contract and is routed as `legacy-or-unsupported`; the negotiation module does not reinterpret v2 as candidate semantics.

## Falsification vectors

`tests/wp9-negotiation-migration.test.js` tests:

- successful candidate admission only after the full processing contract is present;
- rejection of a legacy v2-only peer rather than fallback;
- rejection of a profile label without mandatory processing semantics;
- rejection when any decision-critical member is unsupported;
- rejection when a required profile is absent;
- rejection of malformed/duplicate critical-context declarations;
- prohibition on silently rewriting an ordinary v2 request into candidate semantics.

## Architectural implication

A profile can be a viable transition mechanism only when negotiation binds concrete processing obligations. A profile identifier by itself is not a compatibility mechanism.

This narrows the downstream major-version hypothesis: the semantic break can potentially be mediated by an upstream-defined mandatory negotiated contract, but generic v2 fallback remains unsafe. The upstream authority question therefore remains version-or-equivalent-mandatory-negotiation, not merely wire extensibility.

## Evidence produced

- `development/verification-material/negotiation.js`
- `tests/wp9-negotiation-migration.test.js`

## Promotion rule

WP9 is implementation/falsification evidence only. Exact capability discovery, profile names, version identifier and negotiation wire format remain experimental and require upstream reconciliation.

```yaml
change:
  type: feat
  scope: candidate-negotiation-migration
  breaking: false
  authority_impact: none
  assurance_impact: high
  normative_status: downstream-experimental
```
