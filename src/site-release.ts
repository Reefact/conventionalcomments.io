/**
 * What this site last shipped, and the handful of releases before it, in the reader's own
 * language.
 *
 * Read from `generated/site-release.json`, written by `scripts/generate-site-release-note.mjs`
 * out of `RELEASE_NOTES-<locale>.md` at the repository root — the newest `## release/*`
 * section of each, never `## Unreleased`. The prose is the maintainer's, written by hand
 * before the tag that names it is pushed (CONTRIBUTING.md's release process); nothing here
 * translates anything, the file already is the translation.
 *
 * NOT THE TOOLKIT'S RELEASE NOTES. Those describe a different product and live at
 * `/release-notes/v1/`, read from the toolkit's own sources. Showing one as the other would
 * tell a reader that a website deployment changed the tool they install.
 */
import siteReleaseDocument from './generated/site-release.json';
import type { Locale } from './i18n/routes';

/** A `### Rubric` block — `✨ New`, `🐛 Fixed` — as that locale's file writes it. */
export interface SiteReleaseRubric {
  readonly label: string;
  /** One entry per fact worth a line. Every string is ready-to-display HTML. */
  readonly items: readonly string[];
}

/** One locale's half of a release: the prose, and only the prose. */
export interface SiteReleaseProse {
  /** The release's own "why", when it wrote one — each entry one paragraph of HTML. */
  readonly summaryHtml: readonly string[];
  readonly sections: readonly SiteReleaseRubric[];
}

/** One release, the same shape whether it is the latest or one of the previous ones. */
export interface SiteReleaseSummary {
  readonly tag: string;
  /** ISO, read from the English file: the French twin spells the same day differently,
   *  which is a spelling and not a second fact. */
  readonly date: string;
  readonly locales: Readonly<Record<Locale, SiteReleaseProse>>;
}

export interface SiteRelease extends SiteReleaseSummary {
  /** The releases published just before this one, newest first — up to five. */
  readonly previous: readonly SiteReleaseSummary[];
  /** The tag right after `previous`'s last entry, when one exists — null once every release
   *  this file holds is already shown between the latest one and `previous`. Only ever used
   *  to know whether more releases exist; see `version.astro` for why it is never turned into
   *  a deep link. */
  readonly moreTag: string | null;
}

export const siteRelease: SiteRelease = siteReleaseDocument as SiteRelease;

/** The note as a page reads it: the prose of the locale asked for, plus the facts that are
 *  the same in every locale. */
export interface LocalisedSiteRelease extends SiteReleaseProse {
  readonly tag: string;
  readonly date: string;
}

function localise(release: SiteReleaseSummary, locale: Locale): LocalisedSiteRelease {
  return { tag: release.tag, date: release.date, ...release.locales[locale] };
}

export function siteReleaseIn(locale: Locale): LocalisedSiteRelease {
  return localise(siteRelease, locale);
}

/** The previous releases, newest first, in the locale asked for. */
export function previousSiteReleasesIn(locale: Locale): readonly LocalisedSiteRelease[] {
  return siteRelease.previous.map((release) => localise(release, locale));
}

/** Where a tag of this repository is read on GitHub.
 *
 * `/tree/<tag>`, not `/releases/tag/<tag>`: `release.yml` does publish a GitHub Release for
 * every `release/*` tag, but only in its `notes` job, which runs after the tag has already
 * deployed — so for the short window between the tag existing and that job completing, a
 * Release-page URL 404s while `/tree/<tag>` already resolves. `BuildFacts.astro` links the
 * current build's tag the same way, for the same reason. */
export function releaseTreeUrl(tag: string): string {
  return `https://github.com/Reefact/conventionalcomments.io/tree/${tag}`;
}
