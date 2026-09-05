// Les invariants du site, vérifiés sur le HTML RÉELLEMENT PRODUIT.
//
//   npm run build && node scripts/check-site.mjs
//
// Sur dist/, pas sur les sources : c'est ce qui est servi qui compte, et un gabarit
// qui compile ne dit rien d'un lien qui ne mène nulle part.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
if (!existsSync(DIST)) {
  console.error('dist/ absent — lancer `npm run build` d’abord.');
  process.exit(1);
}

const failures = [];
const fail = (m) => failures.push(m);
const ok = (m) => console.log(`  ✓ ${m}`);

/** Tous les .html produits. */
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}
/** Tout ce qui est servi, quelle qu'en soit l'extension. */
function walkAll(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkAll(p, out);
    else out.push(p);
  }
  return out;
}

const pages = walk(DIST);
ok(`${pages.length} pages produites`);

/** Une adresse interne est servie si le fichier existe, en direct ou en index.html. */
const served = (href) => {
  const p = href.split('#')[0].split('?')[0];
  const base = join(DIST, p);
  return existsSync(base) && statSync(base).isFile()
    || existsSync(join(base, 'index.html'));
};

// ————— 1. Aucun lien interne mort —————
let checked = 0;
const dead = new Map();
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    checked++;
    if (!served(m[1])) {
      const from = relative(DIST, file);
      if (!dead.has(m[1])) dead.set(m[1], new Set());
      dead.get(m[1]).add(from);
    }
  }
}
if (dead.size === 0) ok(`${checked} liens internes, tous servis`);
else for (const [href, from] of dead) fail(`lien mort ${href} — depuis ${[...from].slice(0, 3).join(', ')}`);

// ————— 2. /version n'est atteignable par aucun lien —————
// routes.ts est du TypeScript, et ce script tourne sous node sans transpilation : on y
// lit les adresses déclarées plutôt que de compiler le module pour trois chaînes.
const routesSrc = readFileSync(join(ROOT, 'src/i18n/routes.ts'), 'utf8');
const LOCALES = [...routesSrc.match(/LOCALES = \[([^\]]*)\]/)[1].matchAll(/'([a-z]{2})'/g)].map((m) => m[1]);
const unlinkedKeys = [...routesSrc.matchAll(/UNLINKED: PageKey\[\] = \[([^\]]*)\]/g)]
  .flatMap((m) => [...m[1].matchAll(/'([a-z]+)'/g)].map((x) => x[1]));
const unlinkedPaths = unlinkedKeys.flatMap((key) => {
  const line = routesSrc.match(new RegExp(`${key}:\\s*\\{([^}]*)\\}`));
  return line ? [...line[1].matchAll(/'(\/[^']*)'/g)].map((x) => x[1]) : [];
});
if (unlinkedPaths.length === 0) fail('aucune page non liée déclarée — le contrôle ne vérifie rien');

// Les pages non liées elles-mêmes sont hors périmètre : le sélecteur de langue de
// /version pointe légitimement vers /fr/version. Ce qui est interdit, c'est qu'une page
// DU SITE y mène.
const unlinkedFiles = new Set(
  unlinkedPaths.map((p) => join(p.replace(/^\/|\/$/g, ''), 'index.html'))
);
for (const path of unlinkedPaths) {
  const linkers = pages.filter((f) => {
    const rel = relative(DIST, f);
    if (unlinkedFiles.has(rel)) return false;
    return readFileSync(f, 'utf8').includes(`href="${path}"`);
  });
  if (linkers.length) fail(`${path} est lié depuis ${linkers.map((f) => relative(DIST, f)).join(', ')}`);
  else ok(`${path} — aucun lien n'y mène`);
}

// ————— 3. …ni par le plan du site —————
const sitemap = existsSync(join(DIST, 'sitemap-0.xml'))
  ? readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8') : '';
for (const path of unlinkedPaths) {
  if (sitemap.includes(`conventionalcomments.io${path}`)) fail(`${path} figure dans le plan du site`);
}
if (sitemap) ok('plan du site sans les pages non liées');

// ————— 4. Chaque page indexable déclare ses alternats —————
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  if (html.includes('name="robots" content="noindex')) continue;
  const rel = relative(DIST, file);
  if (!html.includes('hreflang="x-default"')) fail(`${rel} : pas d'alternat x-default`);
  if (!html.includes('hreflang="fr"') || !html.includes('hreflang="en"'))
    fail(`${rel} : alternats incomplets`);
}
ok('alternats hreflang présents sur toute page indexable');

// ————— 5. La page et l'endpoint nomment le même build —————
const page = pages.find((f) => relative(DIST, f) === join('version', 'index.html'));
const endpoint = join(DIST, 'version.json');
if (!page) fail('/version/ non produite');
else if (!existsSync(endpoint)) fail('/version.json non servi');
else {
  const { commit, built } = JSON.parse(readFileSync(endpoint, 'utf8'));
  const html = readFileSync(page, 'utf8');
  const same = (commit === null || html.includes(commit)) && html.includes(built.slice(0, 10));
  if (same) ok('/version et /version.json nomment le même build');
  else fail('/version et /version.json ne nomment pas le même build');
}

// ————— 6. Le schéma est servi, et il dit où il est servi —————
// Son `$id` est la seule chaîne du dépôt qui prétend connaître sa propre URL publique.
// Un déplacement de fichier la laisserait mentir sans que rien ne compile de travers, et
// c'est un éditeur tiers qui le découvrirait — donc on la compare à l'adresse réelle.
const SCHEMA = '/schema/v1.json';
const schemaFile = join(DIST, SCHEMA.slice(1));
if (!existsSync(schemaFile)) fail(`${SCHEMA} non servi`);
else {
  let schema;
  try {
    schema = JSON.parse(readFileSync(schemaFile, 'utf8'));
  } catch (e) {
    fail(`${SCHEMA} ne parse pas : ${e.message}`);
  }
  if (schema) {
    const expected = `https://conventionalcomments.io${SCHEMA}`;
    if (schema.$id !== expected) fail(`$id vaut ${schema.$id}, l'adresse servie est ${expected}`);
    else ok(`${SCHEMA} servi, et son $id nomme son adresse`);
  }
}

// ————— 7. Rien de la cuisine interne n'est servi —————
// public/ est copié tel quel : un document de maintenance qu'on y dépose se retrouve en
// ligne sans que personne ne l'ait décidé. Ça s'est produit une fois.
for (const f of walkAll(DIST)) {
  const rel = relative(DIST, f);
  if (/\.(md|mjs|ts)$/.test(rel)) fail(`${rel} est servi — la place d'un document interne est docs/`);
}
ok('aucune source ni note de maintenance dans dist/');

// ————— 8. Une 404 par langue, et sous forme de fichier —————
// Cloudflare sert le `404.html` le plus proche en remontant l'arborescence. Un
// `fr/404/index.html` ne joue donc pas ce rôle : le visiteur francophone reçoit la 404
// anglaise, et `/fr/404/` devient une page servie en 200 — une « soft 404 ».
for (const lang of LOCALES) {
  const at = lang === 'en' ? '404.html' : join(lang, '404.html');
  if (!existsSync(join(DIST, at))) fail(`${at} absente — ${lang} n'a pas sa page d'erreur`);
  if (existsSync(join(DIST, lang, '404', 'index.html')))
    fail(`${lang}/404/index.html existe — Cloudflare ne le servira jamais comme 404`);
}
ok(`une 404 par langue (${LOCALES.join(', ')}), en fichier`);

if (failures.length) {
  console.error('\n' + failures.map((f) => `  ✗ ${f}`).join('\n'));
  console.error(`\n${failures.length} problème(s).`);
  process.exit(1);
}
console.log('\nTout est en ordre.');
