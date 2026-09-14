# S21-05 — Capability and profile discovery

Status: executable evidence in progress; not yet normative.

## Proposition

TRQP candidate processing needs a transport-independent capability contract that lets a relying implementation determine what a service claims to support without treating discovery as authorization, recognition, or registry authority.

## Candidate semantic boundary

A capability document identifies a semantic `service_id`, the `publisher_id` making the capability assertion, supported TRQP versions, supported processing profiles, issuance/freshness boundaries, and one or more replaceable endpoint bindings.

The following are independent propositions:

```text
endpoint discovered != service authorized
endpoint URI        != semantic service identity
publisher identity  != registry authority by implication
profile advertised  != profile processing contract satisfied
endpoint moved      != semantic principal changed
```

The discovery layer MUST therefore fail closed when capability metadata is stale, malformed, published by an unauthorized publisher under the applicable governance configuration, materially conflicting, or unable to satisfy a requested version/profile contract.

## Downgrade rule

A request for a candidate protocol version or required profile MUST NOT be silently downgraded because discovered metadata advertises only an older version or weaker/different profile. The discovery/admission result is failure; it is not an authoritative-negative answer to the underlying TRQP proposition.

## Conflict rule

When multiple currently usable capability documents for the same discovery operation make materially incompatible version/profile claims, the implementation MUST NOT silently choose one unless an applicable governance/profile rule already establishes deterministic precedence.

This proposal does not invent such precedence.

## Endpoint movement

Endpoint bindings are routing information. A newer capability document MAY replace an endpoint while retaining the same semantic `service_id`. Endpoint movement alone MUST NOT change registry/service identity.

## Experimental binding

The downstream evidence includes an HTTPS `/.well-known/trqp-capabilities` experiment. This binding is deliberately below the transport-independent capability contract and is not proposed as core TRQP semantics on the present evidence.

A successful HTTP retrieval does not establish publisher authority and cannot rescue stale or otherwise invalid capability metadata.

## Evidence

Executable artifacts:

- `development/verification-material/discovery.js`
- `tests/s21-05-capability-discovery.test.js`
- `development/verification-material/discovery-well-known.js`
- `tests/s21-05-well-known-binding.test.js`

The tests falsify stale metadata acceptance, unauthorized publication, conflicting claims, version/profile downgrade, endpoint/identity collapse, replay selection, and transport-success/authority collapse.

## Remaining promotion boundary

The executable `.well-known` binding is a local interop experiment, not yet independent cross-implementation interoperability evidence. S21-05 should therefore remain below `downstream_proposal_ready` until PR CI is green and the issue's interop-evidence requirement is satisfied or explicitly reconciled through human judgment.

```yaml
section21: S21-05
state: executable_evidence_pending_interop
authority: downstream-candidate-only
binding: experimental
ci: awaiting-pr-ci
```
