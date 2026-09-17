# Experimental TSP binding

This directory contains the downstream experimental Trust Spanning Protocol (TSP) binding for the TRQP v3 candidate.

The binding is intentionally separate from the transport-neutral TRQP semantic core. TSP provides authenticated directional message carriage between VIDs; TRQP retains authority over bounded propositions, evidence, recognition, authorization, and semantic decisions.

## Artifacts

- [`TRQP-TSP-BINDING.md`](TRQP-TSP-BINDING.md) — binding specification and `TRQP3-TSP-*` requirements
- [`schema.json`](schema.json) — JSON Schema for the higher-layer binding envelope
- [`examples/query.json`](examples/query.json) — query envelope
- [`examples/response.json`](examples/response.json) — correlated semantic response envelope
- [`examples/problem.json`](examples/problem.json) — correlated binding-processing failure

Executable assurance evidence is in:

- `development/verification-material/tsp-binding.js`
- `tests/tsp-binding.test.js`

## Authority

This binding is downstream-only and experimental. It does not modify the upstream TSP specification, does not claim upstream TRQP adoption, and does not make TSP a mandatory TRQP transport.

The governing invariant is:

> TSP transport identity and relationship state are transport facts. They become TRQP decision inputs only when the TRQP proposition explicitly and critically binds them.
