# WP6 — Historical evaluation and effective-dated evidence

Status: **downstream experimental / implementation evidence in progress**

Parent work: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1
WP5 evidence semantics: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/2
Upstream lifecycle proposal: https://github.com/trustoverip/tswg-trust-registry-protocol/issues/176
External motivating reference: https://github.com/ayraforum/ayra-trust-registry-resources/issues/43

## Safety problem

A present-day record is not evidence of what the authoritative state was at an earlier time. In particular, later revocation, expiry, or supersession MUST NOT be projected backwards over a period for which authoritative historical evidence establishes validity.

Likewise, current validity MUST NOT be projected backwards into a historical interval for which no authoritative evidence exists.

## Reference model

WP6 introduces effective-dated historical assertions with:

- verification-material identifier;
- state;
- `effective_from`;
- optional exclusive `effective_until`;
- source identifier;
- authoritative declaration;
- complete-for-scope declaration;
- optional evidence digest.

The evaluator selects only assertions covering the requested evaluation time.

## Historical decision classes

- `positive`: authoritative, complete, non-conflicting covering evidence establishes historical validity;
- `authoritative-negative`: authoritative, complete, non-conflicting covering evidence establishes a negative state such as revoked, expired, superseded, or not-applicable;
- `indeterminate`: no covering evidence exists, evidence is non-authoritative/incomplete, or covering assertions conflict.

These are downstream reference values and are not proposed TRQP wire vocabulary.

## Core invariants

> Current state MUST NOT be treated as sufficient evidence of historical state at time T unless the evidence itself establishes applicability to T.

> When no authoritative and sufficiently complete historical evidence covers time T, historical evaluation MUST remain indeterminate rather than reconstructing a state from the current record.

> A later lifecycle event MUST NOT retroactively invalidate an earlier interval unless the lifecycle semantics explicitly establish retroactive effect and evidence supports that proposition.

## Rotation

Rotation is modeled as effective-dated state transition rather than mutation of history. C1 may be valid before T2 and superseded after T2 while the semantic principal remains stable. C2 may become valid from T2 onward.

## Conflict handling

If multiple authoritative, complete assertions cover the same material and time but establish different states, the evaluator returns `indeterminate`. It does not choose the newest record or otherwise hide the contradiction.

This is intentional: conflicting authoritative history is an assurance problem requiring resolution/evidence, not a deterministic tie-breaker invented by the client.

## Relationship to WP4 and WP5

WP4 established material lifecycle separation from principal identity. WP5 established authority/completeness/freshness as prerequisites for definitive evidence interpretation. WP6 adds a second temporal axis: evidence must establish applicability to the historical evaluation time, not merely be fresh when retrieved.

## Falsification branch

Negative tests are developed separately at:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/tree/test/wp6-negative-cases

They cover backward projection, missing historical evidence, conflicting assertions, non-authoritative history, incomplete history, rotation, and accidental principal-level inference.

## Upstream boundary

Relevant upstream TRQP issues will be added using full URLs when they become available. The existing lifecycle issue at https://github.com/trustoverip/tswg-trust-registry-protocol/issues/176 is relevant but does not by itself settle the historical evidence model.

## WP6 gate

- [x] effective-dated historical assertion model implemented;
- [x] explicit evaluation time implemented;
- [x] no-covering-evidence maps to indeterminate;
- [x] conflicting historical evidence maps to indeterminate;
- [x] later lifecycle state cannot automatically overwrite an earlier covered interval;
- [x] historical material result remains separate from principal authorization/recognition;
- [ ] negative-test branch reconciled into implementation branch;
- [ ] CI GREEN after reconciliation;
- [ ] TSPP independent evidence;
- [ ] Interop Lab independent evidence;
- [ ] candidate-next-TRQP traceability advanced after CI evidence.

Next after WP6 evidence is green: WP7 wire representation and compatibility, including the minimum representation required for decision-critical qualifiers, evidence state, historical evaluation time, and profile/version negotiation.
