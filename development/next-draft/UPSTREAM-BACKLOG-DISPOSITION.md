# Upstream Production-Readiness Backlog → v3 Candidate Disposition

Status: downstream assessment of upstream issues; upstream remains authoritative for its issue/adoption state.

Upstream #175 identifies eight production-readiness enhancement families. Upstream #194 adds PKI/public-key identifier interoperability. This register ensures none is lost from the v3 programme.

| Upstream topic | Disposition | Candidate evidence / action | RC status |
|---|---|---|---|
| #176 lifecycle & revocation semantics | changed | Candidate lifecycle/time/evidence model covers revocation, expiry, supersession, historical evaluation and evidence insufficiency. | accounted |
| #177 discovery mechanism | changed | S21-05 capability/discovery contract; experimental `.well-known` binding; discovery separated from authority. | accounted; external interop G4 |
| #178 transport extensibility | changed | Transport-neutral semantic core plus binding invariants and profile boundary; v2 HTTPS preserved. | accounted; production-binding interop G4 |
| #179 credential ecosystem integration | profile | Core remains credential-technology-neutral. Credential/status/ledger mappings belong in optional profiles and cannot redefine proposition/evidence semantics. | explicitly profiled/deferred |
| #180 non-functional & operational guidance | retained | `OPERATIONAL-GUIDANCE.md` covers caching/freshness, revocation/change, machine-speed operation, failure handling, audit, security/privacy and release evidence. | accounted |
| #181 governance metadata profiles | profile | Candidate profile semantics allow strengthening without weakening core. Concrete baseline/high-assurance governance metadata vocabulary remains profile work. | profile; not core blocker |
| #182 recognition semantics | changed | Direct recognition only for RC; no inferred transitivity; lifecycle/evidence/time apply; propagation research explicitly deferred. | accounted |
| #183 security profiles | profile | Core security invariants are mandatory; optional risk-tier profiles may strengthen authentication/MTLS/replay/audit controls but cannot weaken core. | profile; not core blocker |
| #194 certificate/public-key identifiers | profile | Preserve URI identifier discipline and authority/object/endpoint/source separation. Canonical certificate/key identity belongs in a PKI profile; candidate direction may use RFC 6920 `ni` with exact DER certificate or DER SPKI hash inputs, subject to upstream/profile adoption. | explicit profile work; not silently omitted |

## #194 safety constraints carried into v3

Regardless of final PKI identifier syntax:

```text
TRQP authority_id != certificate/key identity
certificate/key identity != service endpoint
certificate/key identity != source-list locator
ni routing authority != TRQP governance authority
```

A PKI profile must define canonical hash input, comparison/normalization, rollover/reissuance/revocation behavior, requested-time semantics and examples. Core v3 need not invent these PKI-specific rules to remain semantically complete, provided the extension point and identity separations are explicit.

## Disposition vocabulary

- `retained`: existing requirement remains materially intact.
- `changed`: requirement/capability remains but candidate semantics intentionally strengthen or alter it.
- `superseded`: replaced by a different candidate mechanism.
- `removed-with-rationale`: intentionally absent and justified.
- `profile`: optional/domain-specific extension constrained by core semantics.
- `deferred`: research or external work not required for deterministic RC behavior.

## G1 judgment

All production-readiness families identified by upstream #175 and the current PKI identifier issue #194 have explicit downstream dispositions. No item is treated as automatically adopted merely because it exists upstream.

```yaml
upstream_backlog:
  parent: 175
  child_topics_accounted_for: 8
  current_identifier_issue: 194
  unaccounted_items: 0
  upstream_adoption_claimed: false
```