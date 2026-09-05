/**
 * La table des routes — la seule source de vérité sur les adresses du site.
 *
 * Les segments sont TRADUITS : `/docs/configure/` répond à `/fr/docs/configuration/`.
 * Le routage automatique d'Astro ne sait pas faire ça (il préfixe, il ne traduit pas),
 * donc chaque page a son fichier dans les deux arbres et cette table les apparie. C'est
 * elle qui alimente la navigation, la barre latérale, le sélecteur de langue et les
 * alternats `hreflang` — trois endroits où une adresse recopiée à la main serait la
 * première source de liens morts.
 *
 * Une clé absente d'ici n'est pas une page du site.
 */
export const LOCALES = ['en', 'fr'] as const;
export type Locale = (typeof LOCALES)[number];

export type PageKey =
  | 'home' | 'howitworks' | 'platforms' | 'privacy'
  | 'docsindex' | 'install' | 'labels' | 'configure' | 'adoption' | 'server' | 'troubleshooting'
  | 'releasenotes' | 'version';

export const ROUTES: Record<PageKey, Record<Locale, string>> = {
  home:            { en: '/',                      fr: '/fr/' },
  howitworks:      { en: '/how-it-works/',         fr: '/fr/comment-ca-marche/' },
  platforms:       { en: '/platforms/',            fr: '/fr/plateformes/' },
  privacy:         { en: '/privacy/',              fr: '/fr/confidentialite/' },
  docsindex:       { en: '/docs/',                 fr: '/fr/docs/' },
  install:         { en: '/docs/install/',         fr: '/fr/docs/installation/' },
  labels:          { en: '/docs/labels/',          fr: '/fr/docs/labels/' },
  configure:       { en: '/docs/configure/',       fr: '/fr/docs/configuration/' },
  adoption:        { en: '/docs/adoption/',        fr: '/fr/docs/adoption/' },
  server:          { en: '/docs/server/',          fr: '/fr/docs/serveur/' },
  troubleshooting: { en: '/docs/troubleshooting/', fr: '/fr/docs/diagnostic/' },
  releasenotes:    { en: '/release-notes/v1/',     fr: '/fr/notes-de-version/v1/' },
  version:         { en: '/version/',              fr: '/fr/version/' },
};

/** Les pages de documentation, dans l'ordre de la barre latérale. */
export const DOCS_PAGES: PageKey[] = [
  'docsindex', 'install', 'labels', 'configure', 'adoption', 'server', 'troubleshooting',
];

/**
 * Les pages qu'aucun lien du site ne doit atteindre.
 *
 * `/version` est une page d'exploitation : elle sert à un mainteneur qui vérifie ce
 * qu'un visiteur reçoit, pas à un visiteur. Elle est exclue du plan du site et de la
 * navigation, et `scripts/check-site.mjs` vérifie qu'aucun lien du site n'y mène
 * plutôt que de s'en remettre à la vigilance.
 */
export const UNLINKED: PageKey[] = ['version'];

export const href = (key: PageKey, lang: Locale): string => ROUTES[key][lang];

/** L'autre langue de la même page — ce que doit viser le sélecteur, jamais l'accueil. */
export const otherLocale = (lang: Locale): Locale => (lang === 'en' ? 'fr' : 'en');

/**
 * Retrouve la page à partir de l'adresse servie, pour que le gabarit sache où il est
 * sans que chaque page ait à se nommer deux fois.
 */
export function keyOf(pathname: string): PageKey | null {
  const p = pathname.endsWith('/') ? pathname : pathname + '/';
  for (const [key, byLocale] of Object.entries(ROUTES) as [PageKey, Record<Locale, string>][]) {
    if (byLocale.en === p || byLocale.fr === p) return key;
  }
  return null;
}
