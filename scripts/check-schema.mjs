// Garde de dérive entre public/schema/v1.json et le validateur du toolkit.
//
// Le schéma JSON est une TRANSCRIPTION de packages/core/src/config/schema.ts, qui reste
// la source de vérité : ce fichier-là est du code impératif, on ne peut pas en émettre du
// JSON Schema mécaniquement. Ce script est ce qui empêche la transcription de mentir.
//
//   node scripts/check-schema.mjs                    # schéma + fixtures
//   node scripts/check-schema.mjs <chemin-du-toolkit> # + comparaison des clés connues
//
// Sortie non nulle si un écart est trouvé. Utilisable en CI.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const schemaPath = join(root, 'public/schema/v1.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));

const failures = [];
const fail = (msg) => failures.push(msg);
const ok = (msg) => console.log(`  ✓ ${msg}`);

// ————— 1. Le schéma compile —————
const ajv = addFormats(new Ajv({ allErrors: true, strict: false }));
let validate;
try {
  validate = ajv.compile(schema);
  ok('le schéma compile');
} catch (e) {
  fail(`le schéma ne compile pas : ${e.message}`);
  console.error(failures.join('\n'));
  process.exit(1);
}

// ————— 2. Les fixtures se comportent comme annoncé —————
const fixturesDir = join(root, 'scripts/fixtures');
if (existsSync(fixturesDir)) {
  for (const name of readdirSync(fixturesDir).filter((f) => f.endsWith('.json')).sort()) {
    const shouldPass = name.startsWith('valid-');
    const doc = JSON.parse(readFileSync(join(fixturesDir, name), 'utf8'));
    const passed = validate(doc);
    if (passed === shouldPass) {
      ok(`${name} — ${shouldPass ? 'accepté' : 'rejeté'}, comme attendu`);
    } else if (shouldPass) {
      fail(`${name} devait être accepté : ${ajv.errorsText(validate.errors, { separator: ' · ' })}`);
    } else {
      fail(`${name} devait être rejeté, il passe`);
    }
  }
}

// ————— 3. Comparaison avec le validateur du toolkit —————
const toolkit = process.argv[2];
if (toolkit) {
  const src = join(toolkit, 'packages/core/src/config/schema.ts');
  if (!existsSync(src)) {
    fail(`introuvable : ${src}`);
  } else {
    const text = readFileSync(src, 'utf8');

    // KNOWN_KEYS = new Set([ '...', ... ]) — les clés que le validateur reconnaît.
    const block = /const KNOWN_KEYS = new Set\(\[([\s\S]*?)\]\)/.exec(text);
    if (!block) {
      fail("KNOWN_KEYS introuvable dans schema.ts — le script doit être mis à jour");
    } else {
      const known = new Set([...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]));
      const declared = new Set(Object.keys(schema.properties));
      const missing = [...known].filter((k) => !declared.has(k));
      const extra = [...declared].filter((k) => !known.has(k));
      if (missing.length) fail(`clés du validateur absentes du schéma : ${missing.join(', ')}`);
      if (extra.length) fail(`clés du schéma inconnues du validateur : ${extra.join(', ')}`);
      if (!missing.length && !extra.length) ok(`${known.size} clés de premier niveau, identiques des deux côtés`);
    }

    // Les trois domaines fermés que schema.ts expose en constantes.
    const enumOf = (path) => path.split('.').reduce((o, k) => o?.[k], schema);
    const checkEnum = (constName, actual, label) => {
      const m = new RegExp(`export const ${constName} = \\[([^\\]]*)\\]`).exec(text);
      if (!m) return fail(`${constName} introuvable dans schema.ts`);
      const expected = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
      const a = JSON.stringify([...actual].sort());
      const b = JSON.stringify([...expected].sort());
      if (a !== b) fail(`${label} : schéma ${a} ≠ validateur ${b}`);
      else ok(`${label} — ${expected.join(', ')}`);
    };
    checkEnum('MODES', enumOf('properties.mode.enum'), 'domaine de mode');
    checkEnum('SEVERITIES', enumOf('definitions.severity.enum'), 'domaine des sévérités');

    // Bornes statiques d'allowlistPatterns.
    for (const [constName, ptr] of [
      ['ALLOWLIST_MAX_PATTERNS', schema.properties.allowlistPatterns.maxItems],
      ['ALLOWLIST_MAX_LENGTH', schema.properties.allowlistPatterns.items.maxLength],
    ]) {
      const m = new RegExp(`export const ${constName} = (\\d+)`).exec(text);
      if (!m) fail(`${constName} introuvable dans schema.ts`);
      else if (Number(m[1]) !== ptr) fail(`${constName} : schéma ${ptr} ≠ validateur ${m[1]}`);
      else ok(`${constName} = ${ptr}`);
    }

    // Version de schéma supportée.
    const vsrc = join(toolkit, 'packages/core/src/version.ts');
    if (existsSync(vsrc)) {
      const m = /SUPPORTED_CONFIG_VERSION = (\d+)/.exec(readFileSync(vsrc, 'utf8'));
      const max = schema.properties.version.maximum;
      if (m && Number(m[1]) !== max) fail(`SUPPORTED_CONFIG_VERSION : schéma ${max} ≠ toolkit ${m[1]}`);
      else if (m) ok(`SUPPORTED_CONFIG_VERSION = ${max}`);
    }

    // Le fichier d'exemple normatif du toolkit doit passer.
    const example = join(toolkit, '.conventional-comments.example.json');
    if (existsSync(example)) {
      const doc = JSON.parse(readFileSync(example, 'utf8'));
      const { $schema, ...rest } = doc; // son $schema pointe peut-être encore ailleurs
      if (validate({ $schema: 'https://conventionalcomments.io/schema/v1.json', ...rest })) {
        ok('.conventional-comments.example.json du toolkit — accepté');
      } else {
        fail(`l'exemple du toolkit est rejeté : ${ajv.errorsText(validate.errors, { separator: ' · ' })}`);
      }
    }
  }
} else {
  console.log('  · comparaison avec le toolkit ignorée (passer son chemin en argument)');
}

if (failures.length) {
  console.error('\n' + failures.map((f) => `  ✗ ${f}`).join('\n'));
  console.error(`\n${failures.length} écart(s). Le validateur du toolkit fait foi : corriger public/schema/v1.json.`);
  process.exit(1);
}
console.log('\nAucun écart.');
