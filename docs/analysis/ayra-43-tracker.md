# Tracker: Ayra #43 principal / verification-material separation

External input: https://github.com/ayraforum/ayra-trust-registry-resources/issues/43  
Impact analysis: [ayra-43-verification-material-impact.md](ayra-43-verification-material-impact.md)

```yaml
change:
  type: governance
  scope: trqp-verification-material
  breaking: possible
  authority_impact: material
  assurance_impact: material

candidate:
  state: needs_judgment
  impact: very_high
  dependency:
    kind: external
    authority: ayraforum/ayra-trust-registry-resources#43
  evidence:
    state: partially_verified
  residual_risk:
    - upstream TRQP normative disposition pending
    - wire representation unresolved
    - compatibility/versioning impact unresolved
```

## Propositions under test

- [ ] **P1 — Principal/material separation:** a principal and its verification material are independently identifiable resources with independent lifecycles.
- [ ] **P2 — Critical qualifier safety:** an endpoint cannot return a positive result after silently ignoring a decision-critical verification-material qualifier.
- [ ] **P3 — Explicit indeterminacy:** absence, stale evidence, unknown state, revocation, expiry, and non-applicability remain distinguishable where they affect the trust decision.
- [ ] **P4 — Historical binding:** historical evaluation binds principal, authority/authorization state, verification material, purpose/resource, evidence state, and evaluation time.

## Work decomposition

### TRQP semantics

- [ ] Preserve P1–P4 as downstream requirements pending upstream disposition.
- [ ] Evaluate compatibility consequences if existing identifier semantics change.
- [ ] Link corresponding upstream TRQP issues when available.

### TSPP

- [ ] Add material-bound invalidation model.
- [ ] Define test fixtures for rotation, revocation, expiry, stale evidence, absence/completeness, and historical time.
- [ ] Avoid defining normative result semantics that belong upstream.

### Interop Lab

- [ ] Register `IC-TRQP-PKI-001` Principal / Verification-Material Separation.
- [ ] Implement the ignored-critical-qualifier negative case.
- [ ] Produce machine-readable evidence for the lifecycle matrix.

### TSMS

- [ ] Evaluate generic `Principal -> VerificationMaterial` semantics in TSMM.
- [ ] Evaluate portable representation in TIS.
- [ ] Evaluate lifecycle/composition patterns in TGA.
- [ ] Keep X.509 vocabulary in profiles/cases rather than canonical generic semantics unless justified.

## Upstream TRQP references

Pending. **When upstream TRQP issues become available, add them here and treat those issues as authoritative for normative specification disposition.**

## Completion evidence

This tracker is complete only when the downstream work has executable evidence and all available upstream TRQP issue references have been linked. Missing upstream disposition remains explicit evidence of an unresolved dependency, not implicit acceptance.
