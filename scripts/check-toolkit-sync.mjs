// Les notes de version du site disent-elles encore ce que le toolkit publie ?
//
//   TOOLKIT_PATH=../conventional-comments-toolkit node scripts/check-toolkit-sync.mjs
//
// La page /release-notes/v1/ recopie docs/release-notes-1.x-{en,fr}.md du toolkit. Une
// recopie ne se périme pas bruyamment : elle reste juste, en retard. La page a été publiée
// à jour et l'était déjà moins le lendemain — d'où ce contrôle, qui compare la liste des
// versions plutôt que leur contenu. Le texte de chaque version peut différer (le site le
// met en page), la LISTE ne peut pas.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const toolkit = process.argv[2] || process.env.TOOLKIT_PATH || '';
if (!toolkit) {
  console.log('  · comparaison des notes de version ignorée (passer le chemin du toolkit)');
  process.exit(0);
}

const failures = [];
const ok = (m) => console.log(`  ✓ ${m}`);

/** Les versions publiées par le toolkit, dans l'ordre du fichier. */
function published(lang) {
  const f = join(toolkit, `docs/release-notes-1.x-${lang}.md`);
  if (!existsSync(f)) { failures.push(`${f} introuvable`); return null; }
  return [...readFileSync(f, 'utf8').matchAll(/^## (\S+) —/gm)].map((m) => m[1]);
}

/** Les versions que la page du site affiche. */
function onSite(file) {
  const f = join(ROOT, file);
  if (!existsSync(f)) { failures.push(`${file} introuvable`); return null; }
  return [...readFileSync(f, 'utf8').matchAll(/<span class="rel-v">([^<]+)<\/span>/g)].map((m) => m[1]);
}

for (const [lang, page] of [['en', 'src/pages/release-notes/v1.astro'],
                            ['fr', 'src/pages/fr/notes-de-version/v1.astro']]) {
  const want = published(lang);
  const got = onSite(page);
  if (!want || !got) continue;
  const missing = want.filter((v) => !got.includes(v));
  const extra = got.filter((v) => !want.includes(v));
  if (missing.length) failures.push(`${page} : ${missing.join(', ')} publiée(s) par le toolkit, absente(s) de la page`);
  if (extra.length) failures.push(`${page} : ${extra.join(', ')} sur la page, absente(s) du toolkit`);
  if (want[0] !== got[0]) failures.push(`${page} : la plus récente est ${got[0]} ici, ${want[0]} chez le toolkit`);
  if (!missing.length && !extra.length && want[0] === got[0])
    ok(`${lang} — ${got.length} versions, à jour jusqu'à ${got[0]}`);
}

// Le compte annoncé en toutes lettres sur la page vieillit avec la liste.
for (const page of ['src/pages/release-notes/v1.astro', 'src/pages/fr/notes-de-version/v1.astro']) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  const n = [...html.matchAll(/<span class="rel-v">/g)].length;
  const claimed = html.match(/(\d+)\s+(?:releases|versions)\b/);
  if (claimed && Number(claimed[1]) !== n)
    failures.push(`${page} : la page annonce ${claimed[1]} versions et en affiche ${n}`);
}
if (!failures.length) ok('les comptes annoncés correspondent aux entrées');

if (failures.length) {
  console.error('\n' + failures.map((f) => `  ✗ ${f}`).join('\n'));
  console.error(`\n${failures.length} écart(s). Le toolkit fait foi.`);
  process.exit(1);
}
console.log('\nNotes de version à jour.');
