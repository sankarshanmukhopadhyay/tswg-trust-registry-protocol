# TRQP v3 optional semantic profiles

This directory contains downstream candidate profiles that strengthen or specialize TRQP v3 processing semantics without weakening the core protocol or silently changing proposition identity.

Profiles are optional unless a request includes them in its negotiated processing contract. A profile-specific conformance claim is additional to core TRQP v3 conformance.

## Available profiles

- [`ACTION-IDENTIFIERS.md`](ACTION-IDENTIFIERS.md) — globally scoped action identifiers, canonical OID URNs, standards-vocabulary reuse, and the non-inference boundary between X.509 EKU purposes and TRQP authorization.

A profile MUST NOT manufacture authority, recognition, authorization, or evidence merely by naming an external vocabulary or capability.