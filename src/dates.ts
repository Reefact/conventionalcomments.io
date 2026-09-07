/**
 * Spelling an ISO date the way each language of this site writes one — the same two tables
 * `/prepare-release` uses to retitle `RELEASE_NOTES-*.md`, kept here so a release read back
 * out of `site-release.json` is spelled identically to how it was written in.
 *
 * No `Intl`/`toLocaleDateString` here, and that is deliberate: this runs at build time, in
 * whatever Node the machine doing the build happens to have, and a locale that Node's ICU
 * data does not carry falls back to English SILENTLY — "7 September 2026" under a French
 * heading, correct in form and wrong in substance, with nothing to catch it.
 */
import type { Locale } from './i18n/routes';

const EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/** `2026-09-07` → `September 7, 2026` (en) or `7 septembre 2026` (fr). */
export function formatReleaseDate(iso: string, locale: Locale): string {
  const [year, month, day] = iso.split('-').map(Number);
  const n = month - 1;

  if (locale === 'fr') {
    const j = day === 1 ? '1er' : String(day);
    return `${j} ${FR[n]} ${year}`;
  }
  return `${EN[n]} ${day}, ${year}`;
}
