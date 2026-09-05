// Preuve : ce que le site peut TIRER du dépôt du toolkit plutôt que le recopier.
//
// Prérequis — le toolkit cloné et construit à côté :
//   git clone https://github.com/Reefact/conventional-comments-toolkit
//   cd conventional-comments-toolkit && npm ci && npx tsc -b packages/core packages/extension
//
//   node scripts/poc-from-toolkit.mjs [chemin-du-toolkit]
//
// Ce script ne fait pas partie du site. Il établit ce qui est importable, et sert de point
// de départ à la couche de données quand l'implémentation Astro arrivera.

const TK = (process.argv[2] ?? '../conventional-comments-toolkit') + '/packages';

// @cct/core — aucune dépendance DOM ni plateforme, donc importable tel quel.
const { defaultConfig, analyze, t, DIAGNOSTIC_ORDER, DEFAULT_SEVERITIES, CORE_VERSION } =
  await import(`${TK}/core/dist/index.js`);
// Les descriptions et exemples de labels vivent dans le paquet extension, pas dans core.
const { ui } = await import(`${TK}/extension/dist/ui/strings.js`);

const cfg = defaultConfig();
const shortcut = (id) =>
  Object.entries(cfg.shortcuts.abbreviations).find(([, v]) => v.trim() === id + ':')?.[0] ?? '';
const bloque = (l) => (l.alwaysNonBlocking ? 'jamais' : l.blockingByDefault ? 'oui' : 'selon la précision');

console.log(`core ${CORE_VERSION} · ${cfg.labels.length} labels · ${DIAGNOSTIC_ORDER.length} diagnostics\n`);

console.log('=== /docs/labels/ — la table entière, générée, en français ===\n');
for (const l of cfg.labels) {
  const off = l.enabled ? '' : '  (éteinte)';
  console.log(`${l.icon} ${l.id.padEnd(11)} ${l.color}  ${bloque(l).padEnd(19)} ${shortcut(l.id).padEnd(5)} ${ui('fr', 'label.' + l.id)}${off}`);
  console.log(`${''.padEnd(14)}ex. ${ui('fr', 'example.' + l.id)}`);
}

console.log('\n=== Les diagnostics, avec leurs messages réels, bilingues ===\n');
for (const code of ['W-CASE', 'E-CONFLICT', 'E-DECISION-SUBJECT']) {
  const p = { min: 20, len: 7, label: 'Issue', canonical: 'issue', max: 120, elements: '(blocking)' };
  console.log(`${code.padEnd(22)} [${DEFAULT_SEVERITIES[code] ?? 'défaut'}]`);
  console.log(`  fr  ${t('fr', 'diag.' + code, p)}`);
  console.log(`  en  ${t('en', 'diag.' + code, p)}`);
}

console.log('\n=== Le validateur tourne ici — donc dans un navigateur aussi ===');
const P = { id: 'github', suggestionInfoString: 'suggestion' };
const cases = [
  'Issue: fuite',
  'nitpick (blocking): virgule finale',
  'issue (blocking): le jeton de session survit à la déconnexion\n\nIl reste en cache après expiration.',
];
for (const body of cases) {
  const a = analyze(
    { body, platform: P, isSystemGenerated: false, zone: 'inline', canCarryBlockingState: true },
    { ...cfg, language: 'fr' }
  );
  console.log(`\n« ${body.split('\n')[0]} »`);
  console.log(`   → ${a.blocking ? 'BLOQUANT' : 'non bloquant'}${a.diagnostics.length ? '' : ' · conforme'}`);
  for (const d of a.diagnostics) console.log(`     ${d.severity === 'error' ? '✗' : '!'} ${d.code} — ${d.message}`);
}
