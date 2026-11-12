// Do the labels the site shows — icon, colour, kind — still match the toolkit's
// packages/core/src/config/defaults.ts?
//
//   TOOLKIT_PATH=../conventional-comments-toolkit node scripts/audit-labels.mjs
//
// A hand transcription of thirteen emoji once had one wrong — quibble carried 🫶 (U+1FAF6)
// instead of 🪶 (U+1FAB6) — and nobody would have noticed: both render, both are emoji, only
// the code point differs. That is the argument for generating the table; while it is written
// by hand, this check is what holds it.
//
// The check itself let drift through twice. It counted thirteen labels, hard-coded, and passed
// in silence over a label missing from the page. Then a line-based regex read defaults.ts, and
// a line break inside one declaration made that label vanish from the audit. So: no count, no
// regex. Every `label(` call is read whole by scripts/lib/default-labels.mjs; a call it cannot
// read fails the check; and every label it reads must appear on the labels page, in the group
// of its kind. The parser first proves itself on a fixture that holds multiline calls.
//
// It reads the BUILT HTML: that is what a visitor receives.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDefaultLabels } from './lib/default-labels.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const failures = [];

// ————— 0. The parser reads what it must, multiline calls included —————
const fixture = parseDefaultLabels(
  readFileSync(join(ROOT, 'scripts/fixtures/labels/defaults-multiline.ts'), 'utf8'));
const expected = 'thanks:reply reviewed:status praise:remark quibble:remark decision:reply';
const got = fixture.labels.map((l) => `${l.id}:${l.kind}`).join(' ');
if (got !== expected || fixture.unreadable.length || fixture.labels.find((l) => l.id === 'quibble')?.enabled) {
  console.error(`  ✗ the label parser misreads its fixture: ${got || 'nothing'} (expected ${expected})`);
  process.exit(1);
}
console.log('  ✓ the label parser reads its fixture, multiline declarations included');

const toolkit = process.argv[2] || process.env.TOOLKIT_PATH || '';
if (!toolkit) {
  console.log('  · label audit skipped (pass the toolkit path)');
  process.exit(0);
}

const defaults = join(toolkit, 'packages/core/src/config/defaults.ts');
if (!existsSync(defaults)) {
  console.error(`  ✗ ${defaults} not found`);
  process.exit(1);
}

const { labels, unreadable } = parseDefaultLabels(readFileSync(defaults, 'utf8'));
for (const call of unreadable)
  failures.push(`defaults.ts: a label declaration could not be read — ${call}`);
if (!labels.length) failures.push('defaults.ts: no label declaration found — the file changed shape');
const ids = labels.map((l) => l.id);
for (const id of new Set(ids.filter((id, i) => ids.indexOf(id) !== i)))
  failures.push(`defaults.ts: ${id} is declared twice`);

// Two kinds of page. The labels page is the reference: every shipped label must be on it, in
// its group. The home pages show only a few labels; the ones they show must be right.
const REFERENCE = ['dist/docs/labels/index.html', 'dist/fr/docs/labels/index.html'];
const SAMPLES = ['dist/index.html', 'dist/fr/index.html'];
for (const p of [...REFERENCE, ...SAMPLES]) {
  if (!existsSync(join(ROOT, p))) {
    console.error(`  ✗ ${p} missing — run \`npm run build\` first`);
    process.exit(1);
  }
}

const cp = (s) => [...s].map((c) => `U+${c.codePointAt(0).toString(16).toUpperCase()}`).join(' ');

/** The icons a page shows for a label: <span class="pill" …>👏 praise</span>. */
function iconsShown(html, id) {
  const re = new RegExp(`class="pill"[^>]*>\\s*(\\S+)\\s+${id}<`, 'g');
  return [...new Set([...html.matchAll(re)].map((m) => m[1]))];
}

for (const page of [...REFERENCE, ...SAMPLES]) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  const reference = REFERENCE.includes(page);

  for (const l of labels) {
    const shown = iconsShown(html, l.id);
    if (!shown.length) {
      if (reference) failures.push(`${page}: ${l.id} ships with the toolkit and is missing from the page`);
      continue;
    }
    for (const w of shown.filter((i) => i !== l.icon))
      failures.push(`${page}: ${l.id} shows ${w} (${cp(w)}), the source says ${l.icon} (${cp(l.icon)})`);
  }

  if (!reference) continue;

  // The table groups labels by kind: <tbody data-kind="status">. A label in the wrong group is
  // a false statement about what it does.
  const groups = [...html.matchAll(/<tbody[^>]*data-kind="(remark|status|reply)"[^>]*>([\s\S]*?)<\/tbody>/g)];
  if (!groups.length) {
    failures.push(`${page}: no <tbody data-kind="…"> group — the labels table changed shape`);
    continue;
  }
  for (const l of labels) {
    const found = groups.filter(([, , body]) => iconsShown(body, l.id).length).map(([, kind]) => kind);
    if (!found.length) failures.push(`${page}: ${l.id} is in no group of the table`);
    else if (found.some((k) => k !== l.kind))
      failures.push(`${page}: ${l.id} is listed under "${found.join(', ')}", the source says "${l.kind}"`);
  }
}

// Colours live in the tokens, not in the HTML: that is where they are compared.
const tokens = readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf8');
for (const l of labels) {
  const m = tokens.match(new RegExp(`--l-${l.id}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!m) failures.push(`${l.id}: no --l-${l.id} token in tokens.css`);
  else if (m[1].toUpperCase() !== l.color)
    failures.push(`${l.id}: the token is ${m[1]}, the source says ${l.color}`);
}

if (failures.length) {
  console.error(failures.map((f) => `  ✗ ${f}`).join('\n'));
  console.error(`\n${failures.length} discrepancy(ies). defaults.ts is authoritative.`);
  process.exit(1);
}
const count = (k) => labels.filter((l) => l.kind === k).length;
console.log(`  ✓ ${labels.length} labels (${count('remark')} remarks, ${count('status')} status, ${count('reply')} replies) — icons, colours and kinds match defaults.ts`);
