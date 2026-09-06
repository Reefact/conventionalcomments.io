// Les invariants du site, vérifiés sur le HTML RÉELLEMENT PRODUIT.
//
//   npm run build && node scripts/check-site.mjs
//
// Sur dist/, pas sur les sources : c'est ce qui est servi qui compte, et un gabarit
// qui compile ne dit rien d'un lien qui ne mène nulle part.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// `new URL(...).pathname` reste une URL : il garde les %20 et ne rend pas un chemin
// natif sous Windows. fileURLToPath fait la conversion, dans les deux cas.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
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

// ————— 9. Aucune ressource tierce n'est chargée par le navigateur —————
// La page confidentialité écrit « aucune dépendance n'est chargée depuis un CDN ». C'était
// faux du site lui-même, qui prenait ses polices chez Google : chaque visite envoyait à un
// tiers l'IP du lecteur et l'URL qu'il lisait. Le contrôle porte sur les SOUS-RESSOURCES —
// ce que le navigateur va chercher tout seul — et pas sur les liens `<a>`, qui ont le droit
// de mener chez GitHub ou sur la spécification.
const FETCHING_REL = /^(stylesheet|preload|preconnect|dns-prefetch|prefetch|modulepreload|icon|apple-touch-icon|manifest)$/i;
const thirdParty = [];
for (const file of walkAll(DIST)) {
  const rel = relative(DIST, file);
  if (/\.(html|css)$/.test(rel) === false) continue;
  const text = readFileSync(file, 'utf8');

  if (rel.endsWith('.html')) {
    for (const tag of text.matchAll(/<link\b[^>]*>/g)) {
      const r = tag[0].match(/\brel="([^"]*)"/)?.[1] ?? '';
      const h = tag[0].match(/\bhref="(https?:\/\/[^"]*)"/)?.[1];
      if (h && r.split(/\s+/).some((x) => FETCHING_REL.test(x))) thirdParty.push(`${rel} — <link rel="${r}"> ${h}`);
    }
    for (const m of text.matchAll(/\b(?:src|srcset|data)="(https?:\/\/[^"]*)"/g))
      thirdParty.push(`${rel} — ${m[1]}`);
  }
  for (const m of text.matchAll(/url\(\s*['"]?(https?:\/\/[^)'"]+)/g)) thirdParty.push(`${rel} — url(${m[1]})`);
  for (const m of text.matchAll(/@import\s+(?:url\()?['"](https?:\/\/[^'"]+)/g)) thirdParty.push(`${rel} — @import ${m[1]}`);
}
if (thirdParty.length) for (const t of new Set(thirdParty)) fail(`ressource tierce : ${t}`);
else ok('aucune sous-ressource tierce — le navigateur ne parle qu’à ce site');

// ————— 10. Toute classe employée a une règle —————
// Ce contrôle vient d'en trouver cinq, muettes depuis les maquettes : `.why` n'ayant
// aucune règle, la pastille et son explication se collaient — « nonNi écrits, ni
// envoyés » — et personne ne l'avait vu parce que rien ne casse : le HTML est valide, le
// CSS compile, la page s'affiche. On lit le CSS DE dist/, qui contient aussi les styles
// scopés des composants Astro.
const allCss = walkAll(DIST).filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n');
const usedClasses = new Set();
for (const file of pages)
  for (const m of readFileSync(file, 'utf8').matchAll(/class="([^"]+)"/g))
    for (const c of m[1].split(/\s+/)) if (c) usedClasses.add(c);
const orphans = [...usedClasses]
  .filter((c) => !new RegExp(`\\.${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`).test(allCss))
  .sort();
if (orphans.length) fail(`classe(s) sans règle : ${orphans.join(', ')}`);
else ok(`${usedClasses.size} classes employées, toutes stylées`);

// ————— 11. Chaque page se présente correctement quand on la partage —————
// Un lien collé dans Slack, Teams ou LinkedIn est souvent le premier contact avec le site.
// Sans ces balises il s'affiche en URL nue ; avec une image absente, en cadre vide — ce qui
// est pire, parce que le client social met l'échec en cache.
const SOCIAL = ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt', 'twitter:card'];
const seenImages = new Set();
for (const file of pages) {
  const rel = relative(DIST, file);
  const html = readFileSync(file, 'utf8');
  for (const tag of SOCIAL) {
    const attr = tag.startsWith('og:') ? 'property' : 'name';
    const m = html.match(new RegExp(`<meta ${attr}="${tag}" content="([^"]*)"`));
    if (!m || !m[1].trim()) fail(`${rel} : ${tag} absent ou vide`);
    else if (tag === 'og:image') seenImages.add(m[1]);
  }
}
for (const img of seenImages) {
  const path = img.replace(/^https?:\/\/[^/]+/, '');
  if (!served(path)) fail(`og:image ${img} n'est pas servi`);
}
if (seenImages.size) ok(`cartes sociales complètes, ${seenImages.size} image(s) servie(s)`);

// L'icône, aux trois formes que les navigateurs vont chercher.
for (const icon of ['/favicon.svg', '/favicon.ico', '/apple-touch-icon.png'])
  if (!served(icon)) fail(`${icon} non servi`);
ok('icône servie en svg, ico et apple-touch');

// ————— 12. Toute variable CSS lue sans repli est définie quelque part —————
// C'est ce contrôle qui manquait quand `--on-accent` a été perdu en recopiant les jetons
// des maquettes : le bouton principal héritait alors de --fg, soit 2,37:1 sur le bleu là
// où la maquette donnait 7,73:1. Rien ne cassait — la déclaration devient simplement
// invalide et la couleur est héritée — et le bouton restait beau, juste illisible.
//
// PORTÉE. On demande qu'une variable soit définie quelque part : dans le CSS, ou en ligne
// dans le HTML. Vérifier page par page serait plus strict mais faux — la règle
// `.step { border-top: 3px solid var(--st) }` voyage dans le bundle commun, donc sur toute
// page, alors que `--st` n'est posé que sur les pages qui ont des `.step`. Ce contrôle
// attrape ce qu'il doit attraper : une variable définie NULLE PART.
const cssText = walkAll(DIST).filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(f, 'utf8')).join('\n');
const inlineText = pages.map((f) => readFileSync(f, 'utf8')).join('\n');
const readNoFallback = new Set([...cssText.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)].map((m) => m[1]));
const declared = new Set([...(cssText + inlineText).matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
const undefinedVars = [...readNoFallback].filter((v) => !declared.has(v)).sort();
if (undefinedVars.length) fail(`variable(s) CSS lue(s) sans repli ni définition : ${undefinedVars.join(', ')}`);
else ok(`${readNoFallback.size} variables lues sans repli, toutes définies`);

// ————— 13. Aucun contrôle de navigation sans destination —————
// La revue en a trouvé deux que rien n'attrapait : un pager anglais resté <button> quand
// son jumeau français était un lien, et un href="#" laissé en place de l'adresse réelle.
// Le contrôle des liens morts ne les voyait pas — un bouton n'a pas de href, et "#" est
// une adresse valide. Ce sont pourtant les deux formes que prend un lien qui ne mène nulle
// part une fois la maquette portée : la maquette naviguait en JS, le site navigue en HTML.
const noWhere = [];
for (const file of pages) {
  const rel = relative(DIST, file);
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<a\b[^>]*\bhref="(#|)"/g))
    noWhere.push(`${rel} — <a href="${m[1]}"> sans destination`);
  // Un <button> OU un <span> qui porte une classe de navigation est un lien qui n'a pas
  // été converti. Le second cas a été manqué au premier tour : neuf « tag ↗ » sur les
  // notes de version étaient devenus des ancres, trois autres sur /version étaient restés
  // des <span>. Un chevron sortant sur un élément non cliquable promet une navigation qui
  // n'existe pas — et rien dans le HTML produit ne le signale.
  for (const m of html.matchAll(/<(button|span)\b[^>]*class="([^"]*)"/g))
    if (/\b(pgl|side|rn-side|path|navlink|brand|rel-tag)\b/.test(m[2]))
      noWhere.push(`${rel} — <${m[1]} class="${m[2]}"> là où un lien est attendu`);
}
if (noWhere.length) for (const n of new Set(noWhere)) fail(n);
else ok('aucun lien vide, ni élément de navigation sans destination');

if (failures.length) {
  console.error('\n' + failures.map((f) => `  ✗ ${f}`).join('\n'));
  console.error(`\n${failures.length} problème(s).`);
  process.exit(1);
}
console.log('\nTout est en ordre.');
