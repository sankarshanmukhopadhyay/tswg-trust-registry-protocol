# Ayra #43 falsification matrix

| Case | Principal state | Material state | Source state | Purpose/time | Required downstream expectation |
| --- | --- | --- | --- | --- | --- |
| baseline | recognized | valid/current | authoritative/fresh | applicable/current | positive may be eligible |
| revoked material | recognized | revoked | authoritative/fresh | applicable/current | MUST NOT return positive material-bound result |
| rotated material | recognized | superseded | authoritative/fresh | applicable/current | evaluate against requested time/version |
| unknown material | recognized | unknown | authoritative/complete | applicable/current | not-listed/negative according to upstream semantics; never silently positive |
| incomplete source | recognized | absent | incomplete/unknown completeness | applicable/current | indeterminate/unknown; absence is not authoritative negative |
| stale source | recognized | apparently valid | stale | applicable/current | indeterminate/stale; never current positive without explicit policy |
| wrong purpose | recognized | valid/current | authoritative/fresh | not applicable | not-applicable; never unqualified positive |
| historical pre-validity | recognized | C2 not yet valid | authoritative historical evidence | time before C2 | MUST NOT return current-style positive for C2 |
| ignored qualifier | recognized | client specifies C1 | server lacks extension support | applicable/current | reject/unsupported/indeterminate; MUST NOT silently ignore C1 and return positive |

The exact response vocabulary is deliberately not fixed here. These cases express safety and evidence invariants pending upstream TRQP normative disposition.
