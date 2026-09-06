// Les notes de version du site tiennent-elles leurs deux promesses ?
//
//   node scripts/check-release-notes.mjs
//
// 1. Les deux langues restent appariées. Elles sont écrites à la main, l'une après l'autre,
//    et l'oubli habituel est d'ajouter une puce d'un seul côté — ce qui ne casse rien et ne
//    se voit jamais, puisque personne ne lit les deux le même jour.
// 2. `## Unreleased` existe toujours. C'est là qu'on écrit au fil de l'eau ; sans cette
//    section, on découvre au moment de taguer qu'il n'y a rien d'écrit, ce que
//    `release-notes.sh` refuse à juste titre mais trop tard.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const failures = [];
const ok = (m) => console.log(`  ✓ ${m}`);

const files = { en: 'RELEASE_NOTES-en.md', fr: 'RELEASE_NOTES-fr.md' };
const read = {};
for (const [lang, name] of Object.entries(files)) {
  const p = join(ROOT, name);
  if (!existsSync(p)) { failures.push(`${name} absent`); continue; }
  read[lang] = readFileSync(p, 'utf8');
}

if (Object.keys(read).length === 2) {
  const count = (s, re) => (s.match(re) ?? []).length;
  const shape = (s) => ({
    releases: count(s, /^## release\/\S+/gm),
    rubriques: count(s, /^### /gm),
    puces: count(s, /^- /gm),
  });
  const a = shape(read.en), b = shape(read.fr);
  for (const k of Object.keys(a))
    if (a[k] !== b[k]) failures.push(`${k} : ${a[k]} côté en, ${b[k]} côté fr`);

  // Les mêmes tags, dans le même ordre : une section ajoutée d'un seul côté est
  // exactement ce qui fait échouer une release six mois plus tard.
  const tags = (s) => [...s.matchAll(/^## (release\/\S+)/gm)].map((m) => m[1]);
  const ta = tags(read.en), tb = tags(read.fr);
  if (ta.join('|') !== tb.join('|'))
    failures.push(`les tags diffèrent — en: ${ta.join(', ') || '—'} / fr: ${tb.join(', ') || '—'}`);

  for (const [lang, s] of Object.entries(read))
    if (!/^## Unreleased$/m.test(s)) failures.push(`${files[lang]} : pas de section « ## Unreleased »`);

  if (!failures.length)
    ok(`${ta.length} release(s) notée(s) dans les deux langues, structures identiques`);
}

if (failures.length) {
  console.error(failures.map((f) => `  ✗ ${f}`).join('\n'));
  console.error(`\n${failures.length} écart(s) dans les notes de version.`);
  process.exit(1);
}
