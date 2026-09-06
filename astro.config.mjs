// @ts-check
import { existsSync, readdirSync, renameSync, rmdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { ROUTES, UNLINKED } from './src/i18n/routes.ts';

/** Les pages qu'aucun lien ne doit atteindre n'ont rien à faire dans un plan du site :
 *  l'y mettre annulerait le fait de ne pas les lier. */
const EXCLUDED = new Set(UNLINKED.flatMap((k) => Object.values(ROUTES[k])));

/**
 * Aplatit les 404 de langue : `dist/fr/404/index.html` → `dist/fr/404.html`.
 *
 * Cloudflare sert le `404.html` LE PLUS PROCHE en remontant l'arborescence — une 404 par
 * langue marche donc toute seule, à condition qu'elle soit un fichier et non un dossier.
 * Or `build.format: 'directory'` s'applique à toutes les pages, et Astro ne fait
 * l'exception que pour `src/pages/404.astro`, à la racine. Sans ça, `/fr/n-importe-quoi/`
 * répond en anglais, et `/fr/404/` devient une page comme une autre — servie en 200, ce
 * qu'un moteur de recherche appelle une « soft 404 ».
 *
 * Générique à dessein : une locale de plus n'aura rien à ajouter ici.
 */
function flattenLocalised404s() {
  return {
    name: 'flatten-localised-404s',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        for (const entry of readdirSync(root, { withFileTypes: true })) {
          if (!entry.isDirectory()) continue;
          const from = join(root, entry.name, '404', 'index.html');
          if (!existsSync(from)) continue;
          const to = join(root, entry.name, '404.html');
          renameSync(from, to);
          rmdirSync(join(root, entry.name, '404'));
          logger.info(`404 de ${entry.name} aplatie → ${entry.name}/404.html`);
        }
      },
    },
  };
}

/**
 * Le site est publié ici et nulle part ailleurs — `site` alimente le sitemap et les
 * alternats hreflang, qui doivent porter une origine absolue.
 */

export default defineConfig({
  site: 'https://conventionalcomments.io',

  // Sortie statique : le déploiement Cloudflare ne sert que des fichiers. Voir
  // wrangler.jsonc — pas de `main`, donc aucune requête n'invoque de script, donc
  // aucun quota de requêtes à épuiser.
  output: 'static',

  // `directory` : `how-it-works.astro` produit `/how-it-works/index.html`, servi à
  // `/how-it-works/`. Les routes du site portent toutes leur barre oblique finale,
  // et `src/i18n/routes.ts` en est la seule source.
  build: { format: 'directory' },
  trailingSlash: 'always',

  // L'i18n d'Astro sert ici à deux choses seulement : déclarer les locales pour que
  // `astro:i18n` puisse être utilisé, et garder l'anglais à la racine. Les SEGMENTS
  // sont traduits (/docs/configure/ ↔ /fr/docs/configuration/), ce que le routage
  // automatique ne sait pas faire : chaque page a donc son fichier dans les deux
  // arbres, et `routes.ts` les apparie.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },

  integrations: [
flattenLocalised404s(),
sitemap({
      filter: (page) => !EXCLUDED.has(new URL(page).pathname),
      i18n: { defaultLocale: 'en', locales: { en: 'en', fr: 'fr' } },
    }),
  ],

  devToolbar: { enabled: false },
});
