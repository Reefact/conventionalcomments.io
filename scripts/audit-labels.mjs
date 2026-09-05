// Vérifie que les icônes et couleurs recopiées à la main dans la maquette correspondent
// toujours à packages/core/src/config/defaults.ts. Une transcription de treize emoji en a
// déjà eu un faux : quibble était 🫶 (U+1FAF6) au lieu de 🪶 (U+1FAB6).
//
//   node scripts/audit-labels.mjs [chemin-du-toolkit]
//
// Devient inutile le jour où la table est générée. C'est bien l'argument.

import { readFileSync } from 'node:fs';
const TK = (process.argv[2] ?? '../conventional-comments-toolkit') + '/packages';
const { defaultConfig } = await import(`${TK}/core/dist/index.js`);
const cfg = defaultConfig();
const html = readFileSync(new URL('../docs/mockups/pages.html', import.meta.url), 'utf8');

let bad = 0;
for (const l of cfg.labels) {
  // toutes les pastilles écrites à la main dans la maquette : <span class="pill" ...>ICON id</span>
  const re = new RegExp(`class="pill"[^>]*>\\s*(\\S+)\\s+${l.id}<`, 'g');
  const found = [...html.matchAll(re)].map(m => m[1]);
  const uniq = [...new Set(found)];
  const wrong = uniq.filter(i => i !== l.icon);
  if (wrong.length) {
    bad++;
    console.log(`✗ ${l.id.padEnd(11)} maquette ${wrong.join(' ')} (U+${wrong[0].codePointAt(0).toString(16).toUpperCase()})  ≠  source ${l.icon} (U+${l.icon.codePointAt(0).toString(16).toUpperCase()})`);
  }
  // couleur
  if (l.color && !html.includes(l.color)) { bad++; console.log(`✗ ${l.id} : couleur ${l.color} absente de la maquette`); }
}
console.log(bad ? `\n${bad} écart(s).` : '\nIcônes et couleurs : conformes.');
