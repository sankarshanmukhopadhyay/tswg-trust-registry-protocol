const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const approved = 'specification/v2-approved';
const draft = 'specification/v2';
const names = [
  'trqp_authorization_request.schema.json',
  'trqp_authorization_response.schema.json',
  'trqp_recognition_request.schema.json',
  'trqp_recognition_response.schema.json'
];
// Git blob identities from upstream main 6863733878f3657e05f70764bb474a9fb918de9a.
const pins = [
  '516d8c17043e136788967fa0aa4b0b9762e1804b',
  'ba0701d676bade714c20d214e231130b26cb6225',
  '8e9724bd84448bf98ba3c4415194dd64a553ba0f',
  '237279ce6286056eca807823ca9b025d4dfe8407'
];
const read = p => fs.readFileSync(path.join(root, p));
const json = p => JSON.parse(read(p));
const blob = bytes => crypto.createHash('sha1')
  .update(Buffer.from('blob ' + bytes.length + '\0')).update(bytes).digest('hex');

function checkInserts(text, directory) {
  const inserts = [...text.matchAll(/\[\[insert:\s*([^\]]+?)\s*\]\]/g)]
    .map(match => match[1]);
  assert.deepEqual(inserts, names.map(name => './' + directory + '/core/schema/' + name));
}

function checkCopies(baseline, copies) {
  for (const copy of copies) assert.deepEqual(JSON.parse(copy), JSON.parse(baseline));
}

test('approved renderer uses only the approved schema insert targets', () => {
  const config = json('specs.json').specs;
  assert.equal(config.length, 1);
  assert.equal(config[0].spec_directory, './' + approved);
  assert.equal(config[0].output_path, './dist/approved');
  assert.equal(config[0].markdown_paths.filter(p => p === 'core/api.md').length, 1);
  checkInserts(read(approved + '/core/api.md').toString(), approved);
});

test('working draft renderer remains independently bound to draft schemas', () => {
  const config = json('specs-draft.json').specs;
  assert.equal(config.length, 1);
  assert.equal(config[0].spec_directory, './' + draft);
  assert.equal(config[0].output_path, './dist/draft');
  assert.equal(config[0].markdown_paths.filter(p => p === 'core/api.md').length, 1);
  checkInserts(read(draft + '/core/api.md').toString(), draft);
});

for (const [index, name] of names.entries()) {
  test(name + ': approved bytes and compatibility copies', () => {
    const baseline = read(approved + '/core/schema/' + name);
    assert.equal(blob(baseline), pins[index]);
    checkCopies(baseline, [read('schema/' + name), read('schema/schema/' + name)]);
    // The draft is allowed to evolve; require valid JSON, not baseline equality.
    json(draft + '/core/schema/' + name);
  });
}

test('adversarial insert substitution is rejected even when schema bytes match', () => {
  const original = read(approved + '/core/api.md').toString();
  for (const target of [draft, 'schema', '../external']) {
    assert.throws(() => checkInserts(original.replace(approved, target), approved));
  }
  assert.throws(() => checkInserts(original.replace(/\[\[insert:[^\]]+\]\]/, ''), approved));
});

test('compatibility drift is rejected, formatting changes are not', () => {
  const baseline = read(approved + '/core/schema/' + names[0]);
  const parsed = JSON.parse(baseline);
  checkCopies(baseline, [JSON.stringify(parsed)]);
  parsed.required = parsed.required.filter(field => field !== 'authority_id');
  assert.throws(() => checkCopies(baseline, [JSON.stringify(parsed)]));
});

test('schema validation does not establish prose-level obligations', () => {
  for (const name of [names[0], names[2]]) {
    const request = json(approved + '/core/schema/' + name);
    for (const field of ['action', 'resource']) {
      assert.equal(request.properties[field].type, 'string');
      assert.equal(Object.hasOwn(request.properties[field], 'minLength'), false);
    }
    assert.equal(request.properties.context.properties.time.format, 'date-time');
  }
});
