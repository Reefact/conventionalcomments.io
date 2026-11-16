import type { Locale, PageKey } from './routes';

/**
 * What the site says about each supported platform, in one place.
 *
 * The cards on `/platforms/` and the page of each platform read the same hosts and the
 * same support level from here, so the two can never disagree. The cards had drifted
 * apart once already: each fix added to one card what it needed, and the three ended up
 * with three different shapes.
 *
 * Only the short, repeated strings live here — host names, the feature grid, the section
 * headings. The prose of each platform page is written in the page itself, one language
 * at a time (`identite-fr.md` §7.3).
 */

export type PlatformKey = Extract<PageKey, 'github' | 'azuredevops' | 'gitlab'>;

/** `full`: everything the extension does, blocking included. `assist`: no blocking. */
export type Support = 'full' | 'assist';

type L = Record<Locale, string>;
type Host = { name: string; note?: L };

/**
 * The feature grid. Every platform page lists these rows, in this order, so that two
 * pages can be compared row by row. A feature that does not exist on a platform is
 * still listed, marked unavailable: a missing row reads as an oversight.
 */
export const FEATURES = ['toolbar', 'live', 'badges', 'filter', 'banner', 'block'] as const;
export type Feature = (typeof FEATURES)[number];

export type Platform = {
  name: string;
  support: Support;
  /** The hosts the extension works on — the only thing the card on `/platforms/` lists. */
  covered: Host[];
  /** Editions of the same platform the extension does not cover. Empty: nothing to say. */
  notCovered: Host[];
  /** `true` available, `false` not; the optional note qualifies either. */
  features: Record<Feature, boolean | { ok: boolean; note: L }>;
};

export const PLATFORMS: Record<PlatformKey, Platform> = {
  github: {
    name: 'GitHub',
    support: 'full',
    covered: [
      { name: 'github.com' },
      { name: 'Enterprise Cloud' },
      { name: 'Enterprise Managed Users' },
      { name: 'Enterprise Server', note: { en: 'self-hosted', fr: 'auto-hébergé' } },
    ],
    notCovered: [],
    features: { toolbar: true, live: true, badges: true, filter: true, banner: true, block: true },
  },
  azuredevops: {
    name: 'Azure DevOps',
    support: 'full',
    covered: [
      { name: 'Services', note: { en: 'dev.azure.com', fr: 'dev.azure.com' } },
    ],
    notCovered: [
      { name: 'Azure DevOps Server', note: { en: 'self-hosted', fr: 'auto-hébergé' } },
      { name: '{org}.visualstudio.com', note: { en: 'legacy address', fr: 'ancienne adresse' } },
    ],
    features: {
      toolbar: true,
      live: true,
      badges: {
        ok: true,
        note: {
          en: 'The label prefix stays visible in a published comment.',
          fr: 'Le préfixe du label reste visible dans un commentaire publié.',
        },
      },
      filter: true,
      banner: true,
      block: true,
    },
  },
  gitlab: {
    name: 'GitLab',
    support: 'assist',
    covered: [{ name: 'gitlab.com' }],
    notCovered: [
      { name: 'GitLab Self-Managed', note: { en: 'self-hosted', fr: 'auto-hébergé' } },
      { name: 'GitLab Dedicated' },
    ],
    features: {
      toolbar: true,
      live: true,
      badges: true,
      filter: true,
      banner: true,
      block: {
        ok: false,
        note: {
          en: "The extension cannot read a repository's configuration on GitLab yet.",
          fr: "L'extension ne sait pas encore lire la configuration d'un dépôt sur GitLab.",
        },
      },
    },
  },
};

export const PLATFORM_UI: Record<Locale, {
  support: Record<Support, string>;
  features: Record<Feature, string>;
  available: string;
  unavailable: string;
  feature: string;
  status: string;
  /** The fixed sections of a platform page, in order. */
  sections: {
    intro: string; hosts: string; features: string; where: string;
    setup: string; merge: string; limits: string;
  };
  covered: string;
  notCovered: string;
  /** Said by a section that has nothing to report — it is never left out. */
  nothing: string;
  noLimits: string;
  details: string;
  crumb: string;
}> = {
  en: {
    support: { full: 'full support', assist: 'assistance only' },
    features: {
      toolbar: 'Toolbar and keyboard quick input',
      live: 'Live validation while you type',
      badges: 'Badges on published comments',
      filter: 'Thread filter by label',
      banner: 'Banner counting unresolved blocking threads',
      block: 'Blocking a non-compliant comment in enforce',
    },
    available: 'available',
    unavailable: 'not available',
    feature: 'Feature',
    status: 'Status',
    sections: {
      intro: 'The platform',
      hosts: 'Hosts and editions',
      features: 'Features',
      where: 'Where the extension acts',
      setup: 'Setting it up',
      merge: 'Making merges wait',
      limits: 'Limitations',
    },
    covered: 'Covered',
    notCovered: 'Not covered',
    nothing: 'Nothing to report.',
    noLimits: 'No known limitation.',
    details: 'Details →',
    crumb: 'platforms',
  },
  fr: {
    support: { full: 'prise en charge complète', assist: 'assistance seule' },
    features: {
      toolbar: 'Barre de labels et saisie rapide au clavier',
      live: 'Validation en direct pendant la saisie',
      badges: 'Badges sur les commentaires publiés',
      filter: 'Filtre des fils par label',
      banner: 'Bandeau qui compte les fils bloquants non résolus',
      block: "Blocage d'un commentaire non conforme en enforce",
    },
    available: 'disponible',
    unavailable: 'indisponible',
    feature: 'Fonctionnalité',
    status: 'État',
    sections: {
      intro: 'La plateforme',
      hosts: 'Hôtes et éditions',
      features: 'Fonctionnalités',
      where: "Où l'extension agit",
      setup: 'Mise en place',
      merge: 'Faire attendre la fusion',
      limits: 'Limitations',
    },
    covered: 'Couvert',
    notCovered: 'Non couvert',
    nothing: 'Rien à signaler.',
    noLimits: 'Aucune limitation connue.',
    details: 'Voir le détail →',
    crumb: 'plateformes',
  },
};
