// Les notes de version du site disent-elles encore ce que le toolkit publie ?
//
//   TOOLKIT_PATH=../conventional-comments-toolkit node scripts/check-toolkit-sync.mjs
//
// La page /release-notes/v1/ recopie docs/release-notes-1.x-{en,fr}.md du toolkit. Une
// recopie ne se périme pas bruyamment : elle reste juste, en retard. La page a été publiée
// à jour et l'était déjà moins le lendemain — d'où ce contrôle, qui compare la liste des
// versions plutôt que leur contenu. Le texte de chaque version peut différer (le site le
// met en page), la LISTE ne peut pas.
//
// Le toolkit rédige ses notes avant de taguer : une version peut figurer dans ses notes sans
// être téléchargeable. La page la montre alors marquée « à venir » (`rel-m up`), hors du
// compte des versions publiées. Ce qui fait foi pour « publiée », c'est le tag `v<version>`
// du dépôt du toolkit : une version sans tag ne peut pas être annoncée publiée, une version
// taguée ne peut pas rester « à venir ».

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// `new URL(...).pathname` reste une URL : il garde les %20 et ne rend pas un chemin
// natif sous Windows. fileURLToPath fait la conversion, dans les deux cas.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
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

/** Les versions que la page marque « à venir ». */
function upcomingOnSite(file) {
  return [...readFileSync(join(ROOT, file), 'utf8')
    .matchAll(/<span class="rel-v">([^<]+)<\/span><span class="rel-m up">/g)].map((m) => m[1]);
}

/** Les tags du toolkit, lus sur son dépôt distant : un checkout superficiel n'en a aucun. */
function toolkitTags() {
  try {
    const out = execFileSync('git', ['-C', toolkit, 'ls-remote', '--tags', 'origin'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return new Set([...out.matchAll(/refs\/tags\/(\S+?)(?:\^\{\})?$/gm)].map((m) => m[1]));
  } catch {
    return null;
  }
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

// « Publiée » se vérifie au tag, pas aux notes.
const tags = toolkitTags();
if (!tags) {
  console.log('  · vérification des tags ignorée (dépôt du toolkit injoignable)');
} else {
  let tagFailures = 0;
  for (const page of ['src/pages/release-notes/v1.astro', 'src/pages/fr/notes-de-version/v1.astro']) {
    const up = upcomingOnSite(page);
    for (const v of onSite(page) ?? []) {
      const tagged = tags.has(`v${v}`);
      if (up.includes(v) && tagged) { tagFailures++; failures.push(`${page} : ${v} est taguée, mais encore marquée à venir`); }
      if (!up.includes(v) && !tagged) { tagFailures++; failures.push(`${page} : ${v} annoncée publiée, aucun tag v${v} chez le toolkit`); }
    }
  }
  if (!tagFailures) ok('versions publiées et à venir conformes aux tags du toolkit');
}

// Le compte annoncé en toutes lettres sur la page vieillit avec la liste. Il ne compte que
// les versions publiées.
for (const page of ['src/pages/release-notes/v1.astro', 'src/pages/fr/notes-de-version/v1.astro']) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  const n = [...html.matchAll(/<span class="rel-v">/g)].length - upcomingOnSite(page).length;
  const claimed = html.match(/(\d+)\s+(?:releases|versions)\b/);
  if (claimed && Number(claimed[1]) !== n)
    failures.push(`${page} : la page annonce ${claimed[1]} versions et en affiche ${n} publiées`);
}
if (!failures.length) ok('les comptes annoncés correspondent aux entrées');

if (failures.length) {
  console.error('\n' + failures.map((f) => `  ✗ ${f}`).join('\n'));
  console.error(`\n${failures.length} écart(s). Le toolkit fait foi.`);
  process.exit(1);
}
console.log('\nNotes de version à jour.');
