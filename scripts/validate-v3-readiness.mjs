import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const fail = msg => { console.error(`RC readiness failure: ${msg}`); process.exitCode = 1; };

const req = read('development/next-draft/NORMATIVE-REQUIREMENTS.md');
const trace = read('development/next-draft/REQUIREMENT-TEST-TRACEABILITY.md');
const examples = read('development/next-draft/examples/README.md');
const schemaRec = read('development/next-draft/SCHEMA-RECONCILIATION.md');
const op = read('development/next-draft/OPERATIONAL-GUIDANCE.md');
const requestSchema = JSON.parse(read('development/verification-material/schemas/wp7-request.schema.json'));
const responseSchema = JSON.parse(read('development/verification-material/schemas/wp7-response.schema.json'));

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

const controlled = [
  'development/next-draft/CANDIDATE-TRQP-V3.md',
  'development/next-draft/NORMATIVE-REQUIREMENTS.md',
  'development/next-draft/REQUIREMENT-TEST-TRACEABILITY.md',
  'development/next-draft/SCHEMA-RECONCILIATION.md',
  'development/next-draft/OPERATIONAL-GUIDANCE.md'
];
const unresolved = /\b(TODO|TBD|FIXME|XXX)\b/;
for (const p of controlled) {
  const text = read(p);
  if (unresolved.test(text)) fail(`unresolved editorial marker in ${p}`);
}

if (!process.exitCode) console.log(`RC readiness controls passed: ${ids.length} stable requirement IDs; schema/prose/traceability controls coherent.`);
