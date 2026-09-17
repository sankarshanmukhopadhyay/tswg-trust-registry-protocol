import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const fail = msg => { console.error(`RC readiness failure: ${msg}`); process.exitCode = 1; };

const walkFiles = dir => {
  const abs = path.join(root, dir);
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap(entry => {
    const rel = path.join(dir, entry.name);
    return entry.isDirectory() ? walkFiles(rel) : [rel];
  });
};

// Reader-facing v3 product artifacts are authoritative for candidate readiness.
const spec = read('specification/v3/TRQP-V3.md');
const req = read('specification/v3/conformance/REQUIREMENTS.md');
const trace = read('specification/v3/conformance/TRACEABILITY.md');
const coverage = read('specification/v3/conformance/COVERAGE.md');
const examples = read('specification/v3/examples/README.md');
const implementers = read('specification/v3/guides/IMPLEMENTERS-GUIDE.md');
const schemaRec = read('development/evidence/v3/SCHEMA-RECONCILIATION.md');
const op = read('specification/v3/guides/OPERATIONAL-GUIDANCE.md');
const requestSchema = JSON.parse(read('development/verification-material/schemas/request.schema.json'));
const responseSchema = JSON.parse(read('development/verification-material/schemas/response.schema.json'));

const ids = [...new Set(req.match(/TRQP3-[A-Z]+-[0-9]+/g) || [])];
if (!ids.length) fail('no stable TRQP3 requirement IDs found');
for (const id of ids) if (!trace.includes(id) && !trace.includes(id.replace(/-[0-9]+$/, '-*'))) fail(`unmapped normative requirement ${id}`);

for (const family of ['PROP','MAT','CTX','LIFE','EVID','DEC','REQ','EVAL','RESP','NEG','BIND','DISC','PROF','REC','ERR','SEC','PRIV','AUD','COMP']) {
  if (!trace.includes(`TRQP3-${family}-*`)) fail(`missing traceability family TRQP3-${family}-*`);
}

for (const token of ['critical_context','required_profiles','verification_material']) {
  if (!JSON.stringify(requestSchema).includes(token)) fail(`request schema missing ${token}`);
  if (!examples.includes(token)) fail(`examples missing ${token}`);
}
for (const token of ['decision','reason','evidence_state','time_evaluated','evidence']) {
  if (!JSON.stringify(responseSchema).includes(token)) fail(`response schema missing ${token}`);
}
for (const decision of ['positive','authoritative-negative','indeterminate','not-applicable']) {
  if (!JSON.stringify(responseSchema).includes(decision)) fail(`response schema missing decision ${decision}`);
}

if (!schemaRec.includes('semantic_field_loss_allowed: false')) fail('schema reconciliation does not prohibit semantic field loss');
if (!trace.includes('SHOULD accounting rule')) fail('SHOULD accounting rule absent');
if (!op.includes('Release-readiness checklist')) fail('operational release-readiness checklist absent');

for (const marker of [
  '## Abstract',
  '## Status of this document',
  '### 1.1 Design goals',
  '### 1.2 Non-goals',
  '### 1.4 Terminology',
  '### 1.5 Architecture and roles',
  '## 16. Security considerations',
  '## 17. Privacy considerations',
  '## 27. IANA considerations',
  '## 28. References'
]) {
  if (!spec.includes(marker)) fail(`normative specification missing editorial/standards marker: ${marker}`);
}
if (!spec.includes('BCP 14') || !spec.includes('RFC 2119') || !spec.includes('RFC 8174')) {
  fail('normative specification missing BCP 14 / RFC 2119 / RFC 8174 requirements-language convention');
}

for (const adoptionMarker of [
  'Recommended processing pipeline',
  'Evidence model',
  'Caching',
  'Audit and redress',
  'Adoption checklist'
]) {
  if (!implementers.includes(adoptionMarker)) fail(`implementer guide missing adoption section: ${adoptionMarker}`);
}

for (const exampleMarker of [
  'Ordinary positive authorization',
  'Verification-material mismatch',
  'Evidence unavailable',
  'Material-qualified historical request',
  'Agent acting for a principal',
  'Failed candidate negotiation'
]) {
  if (!examples.includes(exampleMarker)) fail(`worked example corpus missing flow: ${exampleMarker}`);
}

// Optional TSP binding readiness is scoped separately from core TRQP conformance.
const tspBinding = read('specification/v3/bindings/tsp/TRQP-TSP-BINDING.md');
const tspBindingReadme = read('specification/v3/bindings/tsp/README.md');
const tspSchema = JSON.parse(read('specification/v3/bindings/tsp/schema.json'));
const tspQuery = JSON.parse(read('specification/v3/bindings/tsp/examples/query.json'));
const tspResponse = JSON.parse(read('specification/v3/bindings/tsp/examples/response.json'));
const tspProblem = JSON.parse(read('specification/v3/bindings/tsp/examples/problem.json'));
const tspTests = read('tests/tsp-binding.test.js');
const tspReference = read('development/verification-material/tsp-binding.js');

for (let i = 1; i <= 12; i += 1) {
  const id = `TRQP3-TSP-${String(i).padStart(3, '0')}`;
  if (!tspBinding.includes(id)) fail(`TSP binding missing scoped requirement ${id}`);
}
if (!trace.includes('TRQP3-TSP-*')) fail('TSP binding family missing from traceability');
if (!coverage.includes('TRQP3-TSP-*')) fail('TSP binding family missing from coverage');
if (!req.includes('TRQP3-TSP-*')) fail('TSP binding-scoped conformance family not registered');
if (!tspBindingReadme.includes('downstream-only') || !tspBindingReadme.includes('experimental')) {
  fail('TSP binding authority/status boundary is not explicit');
}

if (tspSchema.properties?.protocol?.const !== 'trqp') fail('TSP binding schema protocol is not frozen to trqp');
if (tspSchema.properties?.protocol_version?.const !== '3.0-candidate') fail('TSP binding schema version is not frozen to candidate v3');
if (tspSchema.properties?.binding?.const !== 'tsp') fail('TSP binding schema binding value is not frozen to tsp');
if (tspSchema.additionalProperties !== false) fail('TSP binding envelope schema must be closed');

for (const envelope of [tspQuery, tspResponse, tspProblem]) {
  if (envelope.protocol !== 'trqp' || envelope.protocol_version !== '3.0-candidate' || envelope.binding !== 'tsp') {
    fail('TSP binding example does not preserve binding envelope contract');
  }
}
if (tspResponse.in_reply_to !== tspQuery.message_id) fail('TSP response example is not correlated to query');
if (tspProblem.in_reply_to !== tspQuery.message_id) fail('TSP problem example is not correlated to query');
if (Object.hasOwn(tspProblem.body || {}, 'decision')) fail('TSP problem example improperly carries semantic decision');

for (const marker of ['projectTransportFacts','checkCriticalTransportContext','correlates','classifyTspFailure']) {
  if (!tspReference.includes(marker)) fail(`TSP binding reference implementation missing ${marker}`);
}
for (const marker of [
  'do not manufacture TRQP semantic identity or decision state',
  'fails closed before semantic evaluation',
  'does not imply TRQP recognition or authorization',
  'transport failures remain processing failures rather than semantic negatives'
]) {
  if (!tspTests.includes(marker)) fail(`TSP binding executable assurance missing test: ${marker}`);
}

const controlled = [
  'specification/v3/TRQP-V3.md',
  'specification/v3/conformance/REQUIREMENTS.md',
  'specification/v3/conformance/TRACEABILITY.md',
  'development/evidence/v3/SCHEMA-RECONCILIATION.md',
  'specification/v3/guides/OPERATIONAL-GUIDANCE.md',
  'specification/v3/bindings/tsp/TRQP-TSP-BINDING.md',
  'specification/v3/bindings/tsp/README.md'
];
const unresolved = /\b(TODO|TBD|FIXME|XXX)\b/;
for (const p of controlled) {
  const text = read(p);
  if (unresolved.test(text)) fail(`unresolved editorial marker in ${p}`);
}

// Internal planning paths and execution vocabulary must not leak into the public candidate surface.
for (const p of walkFiles('specification/v3').filter(p => /\.(md|ya?ml|json)$/i.test(p))) {
  const text = read(p);
  if (text.includes('development/next-draft/')) fail(`stale development/next-draft reference in public candidate artifact: ${p}`);
  if (/\b(work[- ]packet|work[- ]tranche|restart checkpoint)\b/i.test(text)) fail(`internal execution vocabulary in public candidate artifact: ${p}`);
}

if (!process.exitCode) console.log(`RC readiness controls passed: ${ids.length} stable core requirement IDs; schema/prose/traceability/adoption controls coherent; experimental TSP binding accounted separately.`);
