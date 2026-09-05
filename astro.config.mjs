// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { ROUTES, UNLINKED } from './src/i18n/routes.ts';

/** Les pages qu'aucun lien ne doit atteindre n'ont rien à faire dans un plan du site :
 *  l'y mettre annulerait le fait de ne pas les lier. */
const EXCLUDED = new Set(UNLINKED.flatMap((k) => Object.values(ROUTES[k])));

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
    sitemap({
      filter: (page) => !EXCLUDED.has(new URL(page).pathname),
      i18n: { defaultLocale: 'en', locales: { en: 'en', fr: 'fr' } },
    }),
  ],

  devToolbar: { enabled: false },
});
