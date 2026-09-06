// Les treize icônes et couleurs affichées par le site correspondent-elles encore à
// packages/core/src/config/defaults.ts ?
//
//   TOOLKIT_PATH=../conventional-comments-toolkit node scripts/audit-labels.mjs
//
// Une transcription à la main de treize emoji en a déjà eu un faux — quibble portait 🫶
// (U+1FAF6) au lieu de 🪶 (U+1FAB6) — et personne ne l'aurait vu : les deux s'affichent,
// les deux sont des emoji, seul le codet diffère. C'est l'argument pour générer la table ;
// tant qu'elle est écrite à la main, c'est ce contrôle qui la tient.
//
// Il lisait la maquette, qui n'existe plus ; il lit maintenant le HTML PRODUIT, ce qui est
// mieux : c'est ce que le visiteur reçoit. Et il lit `defaults.ts` comme du TEXTE plutôt
// que d'importer le paquet compilé, pour ne pas exiger un build du toolkit en CI.

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

// label('praise', '\u{1F389}', '#36933B', false, false)
const src = readFileSync(defaults, 'utf8');
const labels = [...src.matchAll(/label\(\s*'([a-z]+)'\s*,\s*'([^']+)'\s*,\s*'(#[0-9A-Fa-f]{6})'/g)]
  .map(([, id, icon, color]) => ({
    id,
    // les échappements \u{...} de la source deviennent le caractère qu'ils désignent
    icon: icon.replace(/\\u\{([0-9A-Fa-f]+)\}/g, (_, h) => String.fromCodePoint(parseInt(h, 16))),
    color: color.toUpperCase(),
  }));

if (labels.length !== 13) {
  console.error(`  ✗ ${labels.length} labels lus dans defaults.ts, 13 attendus — le format a changé`);
  process.exit(1);
}

const pages = ['dist/docs/labels/index.html', 'dist/fr/docs/labels/index.html']
  .map((p) => join(ROOT, p));
for (const p of pages) {
  if (!existsSync(p)) {
    console.error(`  ✗ ${p} absent — lancer \`npm run build\` d'abord`);
    process.exit(1);
  }
}

const failures = [];
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const l of labels) {
    // <span class="pill" style="--lc:var(--l-praise)">🎉 praise</span>
    const re = new RegExp(`class="pill"[^>]*>\\s*(\\S+)\\s+${l.id}<`, 'g');
    const shown = [...new Set([...html.matchAll(re)].map((m) => m[1]))];
    if (!shown.length) continue;                    // ce label n'est pas sur cette page
    const wrong = shown.filter((i) => i !== l.icon);
    for (const w of wrong) {
      const cp = (s) => `U+${s.codePointAt(0).toString(16).toUpperCase()}`;
      failures.push(`${l.id} : la page affiche ${w} (${cp(w)}), la source dit ${l.icon} (${cp(l.icon)})`);
    }
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
console.log(`  ✓ ${labels.length} labels — icônes et couleurs conformes à defaults.ts`);
