import type { Locale, PageKey } from './routes';

/**
 * Les chaînes de CHROME — navigation, barre latérale, pied de page, méta.
 *
 * Volontairement limité à ça. La prose des pages n'est pas ici et n'y sera jamais :
 * `identite-fr.md` §7.3 pose qu'on écrit chaque langue plutôt qu'on ne traduit l'autre,
 * et un dictionnaire clé → phrase pousse exactement à l'inverse. Le chrome, lui, est
 * répétitif et court : c'est le seul texte du site dont deux versions doivent dire la
 * même chose au mot près.
 *
 * Règle de typographie, §3.4 : en français, un deux-points de prose prend une espace
 * insécable — d'où les ` ` ci-dessous. Celui d'un jeton de grammaire n'en prend
 * jamais. Les deux ne se croisent pas ici, mais `<Token>` existe pour ça.
 */
const NBSP = ' ';

type Dict = {
  nav: Record<'howitworks' | 'platforms' | 'docs', string>;
  cta: string;
  github: string;
  brandAria: string;
  docsGroup: string;
  refGroup: string;
  docsNav: Record<PageKey, string>;
  jsonSchema: string;
  releaseNotes: string;
  footerIndependent: string;
  footerSpec: string;
  privacyLink: string;
  releaseNotesLink: string;
  skipToContent: string;
  langLabel: string;
};

export const UI: Record<Locale, Dict> = {
  en: {
    nav: { howitworks: 'how it works:', platforms: 'platforms:', docs: 'docs:' },
    cta: 'Adopt it in your team',
    github: 'github ↗',
    brandAria: 'conventionalcomments.io — home',
    docsGroup: 'docs:',
    refGroup: 'reference:',
    docsNav: {
      docsindex: 'Overview',
      install: 'Install',
      labels: 'Labels & decorations',
      configure: 'Configure',
      adoption: 'Adoption',
      server: 'The server',
      troubleshooting: 'Troubleshooting',
      home: '', howitworks: '', platforms: '', privacy: '', releasenotes: '', version: '',
    },
    jsonSchema: 'JSON schema ↗',
    releaseNotes: 'Release notes',
    footerIndependent: 'Independent tooling. The specification lives on',
    footerSpec: '; this site does not speak for it.',
    privacyLink: 'privacy',
    releaseNotesLink: 'release notes',
    skipToContent: 'Skip to content',
    langLabel: 'Language',
  },
  fr: {
    nav: {
      howitworks: `comment${NBSP}ça${NBSP}marche${NBSP}:`,
      platforms: `plateformes${NBSP}:`,
      docs: `doc${NBSP}:`,
    },
    cta: 'Adoptez-le dans votre équipe',
    github: 'github ↗',
    brandAria: 'conventionalcomments.io — accueil',
    docsGroup: `doc${NBSP}:`,
    refGroup: `référence${NBSP}:`,
    docsNav: {
      docsindex: "Vue d'ensemble",
      install: 'Installation',
      labels: 'Labels et décorations',
      configure: 'Configuration',
      adoption: 'Adoption',
      server: 'Le serveur',
      troubleshooting: 'Diagnostic',
      home: '', howitworks: '', platforms: '', privacy: '', releasenotes: '', version: '',
    },
    jsonSchema: 'schéma JSON ↗',
    releaseNotes: 'Notes de version',
    footerIndependent: 'Outillage indépendant. La spécification vit sur',
    footerSpec: `${NBSP}; ce site ne parle pas en son nom.`,
    privacyLink: 'confidentialité',
    releaseNotesLink: 'notes de version',
    skipToContent: 'Aller au contenu',
    langLabel: 'Langue',
  },
};

export const t = (lang: Locale) => UI[lang];
