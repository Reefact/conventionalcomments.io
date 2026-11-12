// Les labels que le site affiche — icône, couleur, catégorie — correspondent-ils encore à
// packages/core/src/config/defaults.ts ?
//
//   TOOLKIT_PATH=../conventional-comments-toolkit node scripts/audit-labels.mjs
//
// Une transcription à la main de treize emoji en a déjà eu un faux — quibble portait 🫶
// (U+1FAF6) au lieu de 🪶 (U+1FAB6) — et personne ne l'aurait vu : les deux s'affichent,
// les deux sont des emoji, seul le codet diffère. C'est l'argument pour générer la table ;
// tant qu'elle est écrite à la main, c'est ce contrôle qui la tient.
//
// Ce contrôle a lui-même laissé passer une dérive : il comptait treize labels, en dur, et
// passait sans rien dire sur un label absent de la page. Quand le toolkit en a livré dix-neuf,
// il s'arrêtait sur le compte — et avant cela, il aurait laissé six labels manquer au tableau.
// Il ne compte donc plus : tout label que le toolkit livre doit figurer sur la page des
// labels, dans le groupe de sa catégorie.
//
// Il lit le HTML PRODUIT : c'est ce que le visiteur reçoit. Et il lit `defaults.ts` comme du
// TEXTE plutôt que d'importer le paquet compilé, pour ne pas exiger un build du toolkit en CI.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const toolkit = process.argv[2] || process.env.TOOLKIT_PATH || '';
if (!toolkit) {
  console.log('  · audit des labels ignoré (passer le chemin du toolkit)');
  process.exit(0);
}

const defaults = join(toolkit, 'packages/core/src/config/defaults.ts');
if (!existsSync(defaults)) {
  console.error(`  ✗ ${defaults} introuvable`);
  process.exit(1);
}

// label('praise', '\u{1F44F}', '#36933B', false, false)
// label('thanks', '\u{1F91D}', '#9C8C1A', false, true, true, ['thx'], 'reply')
// Le dernier argument est la catégorie ; absent, c'est 'remark' (la valeur par défaut de
// la fonction `label`).
const src = readFileSync(defaults, 'utf8');
const labels = [...src.matchAll(/label\(\s*'([a-z]+)'\s*,\s*'([^']+)'\s*,\s*'(#[0-9A-Fa-f]{6})'([^\n]*)\)/g)]
  .map(([, id, icon, color, rest]) => ({
    id,
    // les échappements \u{...} de la source deviennent le caractère qu'ils désignent
    icon: icon.replace(/\\u\{([0-9A-Fa-f]+)\}/g, (_, h) => String.fromCodePoint(parseInt(h, 16))),
    color: color.toUpperCase(),
    kind: /'(remark|status|reply)'\s*$/.exec(rest)?.[1] ?? 'remark',
  }));

// Le compte n'est plus imposé, mais un fichier dont on ne lit plus rien n'est pas un
// fichier conforme : c'est un format qui a changé sous le script.
if (labels.length < 13 || new Set(labels.map((l) => l.id)).size !== labels.length) {
  console.error(`  ✗ ${labels.length} labels lus dans defaults.ts — le format a changé, le script est à revoir`);
  process.exit(1);
}

// Deux sortes de pages. La page des labels est la référence : tout label livré doit y
// figurer, dans son groupe. Les pages d'accueil n'en montrent que quelques-uns : ceux
// qu'elles montrent doivent porter la bonne icône.
const REFERENCE = ['dist/docs/labels/index.html', 'dist/fr/docs/labels/index.html'];
const SAMPLES = ['dist/index.html', 'dist/fr/index.html'];
for (const p of [...REFERENCE, ...SAMPLES]) {
  if (!existsSync(join(ROOT, p))) {
    console.error(`  ✗ ${p} absent — lancer \`npm run build\` d'abord`);
    process.exit(1);
  }
}

const failures = [];
const cp = (s) => [...s].map((c) => `U+${c.codePointAt(0).toString(16).toUpperCase()}`).join(' ');

/** Les icônes qu'une page affiche pour un label : <span class="pill" …>👏 praise</span>. */
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
      if (reference) failures.push(`${page} : ${l.id} est livré par le toolkit et absent de la page`);
      continue;
    }
    for (const w of shown.filter((i) => i !== l.icon))
      failures.push(`${page} : ${l.id} affiche ${w} (${cp(w)}), la source dit ${l.icon} (${cp(l.icon)})`);
  }

  if (!reference) continue;

  // Le tableau range les labels par catégorie : <tbody data-kind="status">. Un label rangé
  // dans le mauvais groupe est une affirmation fausse sur ce qu'il fait.
  const groups = [...html.matchAll(/<tbody[^>]*data-kind="(remark|status|reply)"[^>]*>([\s\S]*?)<\/tbody>/g)];
  if (!groups.length) {
    failures.push(`${page} : aucun groupe <tbody data-kind="…"> — le tableau des labels a changé de forme`);
    continue;
  }
  for (const l of labels) {
    const found = groups.filter(([, , body]) => iconsShown(body, l.id).length).map(([, kind]) => kind);
    if (!found.length) failures.push(`${page} : ${l.id} n'est rangé dans aucun groupe du tableau`);
    else if (found.some((k) => k !== l.kind))
      failures.push(`${page} : ${l.id} est rangé parmi les « ${found.join(', ')} », la source dit « ${l.kind} »`);
  }
}

// Les couleurs vivent dans les jetons, pas dans le HTML : c'est là qu'on les compare.
const tokens = readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf8');
for (const l of labels) {
  const m = tokens.match(new RegExp(`--l-${l.id}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!m) failures.push(`${l.id} : aucun jeton --l-${l.id} dans tokens.css`);
  else if (m[1].toUpperCase() !== l.color)
    failures.push(`${l.id} : le jeton vaut ${m[1]}, la source dit ${l.color}`);
}

if (failures.length) {
  console.error(failures.map((f) => `  ✗ ${f}`).join('\n'));
  console.error(`\n${failures.length} écart(s). defaults.ts fait foi.`);
  process.exit(1);
}
const count = (k) => labels.filter((l) => l.kind === k).length;
console.log(`  ✓ ${labels.length} labels (${count('remark')} remarques, ${count('status')} états, ${count('reply')} réponses) — icônes, couleurs et catégories conformes à defaults.ts`);
