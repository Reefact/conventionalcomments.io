// Read this site's own release history into src/generated/site-release.json, for /version.
//
// WHAT IT READS is `RELEASE_NOTES-<en|fr>.md` at the root of this repository — what changed
// on conventionalcomments.io, written by hand under `## Unreleased` and retitled to
// `## release/<tag> — <date>` by the `ci: prepare` pull request (CONTRIBUTING.md). Not the
// toolkit's own release notes: those describe a different product and are read from a
// different source by a different page (`/release-notes/v1/`), and the two must never be
// shown as one another.
//
// ONLY RELEASED SECTIONS, and deliberately not `## Unreleased`. That section is the drafting
// surface for what will ship next; a page reporting what this deployment actually is must
// not show a promise as if it were a fact.
//
// REGENERATED EVERY BUILD, LIKE version.json, AND NOT COMMITTED FOR THE SAME REASON
// (scripts/generate-version.mjs): the source it reads — RELEASE_NOTES-*.md — is already
// committed, so the JSON is a derived build artefact, not a second copy of the truth to keep
// in sync by hand. `npm run dev` / `npm run build` both run this before Astro so the page and
// the file it imports can never disagree.
//
// IT REFUSES RATHER THAN PUBLISHING SOMETHING INCOMPLETE: a file with no released section
// yet, a heading that names neither a tag nor `Unreleased`, or two languages whose releases
// disagree in shape. A page complete in English and short in French is exactly what
// `check-release-notes.mjs` already exists to catch before this script ever runs — this
// script re-checks it anyway, because it reads more of the file than that one does.
//
//   node scripts/generate-site-release-note.mjs

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { releaseNotesReader, siteHrefResolver } from './lib/release-notes-markdown.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SITE_ORIGIN = 'https://conventionalcomments.io';
const LOCALES = ['en', 'fr'];

/** How many releases before the latest one /version's "previous releases" section shows. */
const PREVIOUS_COUNT = 5;

function fileOf(locale) {
  return `RELEASE_NOTES-${locale}.md`;
}

function refuse(message) {
  console.error(`generate-site-release-note: ${message}`);
  process.exit(1);
}

/** A `## ` heading that is not a release — `## Unreleased`, and nothing else. Named rather
 *  than inferred from "does not start with release/", so a mistyped heading (a stray capital,
 *  a missing slash) stops the build instead of being silently dropped like `## Unreleased`
 *  itself, one release short and none the wiser. */
function notARelease(heading, file) {
  if (heading === 'Unreleased') return true;
  if (!heading.startsWith('release/')) {
    refuse(`${file} heads a section "${heading}", which is neither "Unreleased" nor a release/ tag`);
  }
  return false;
}

for (const locale of LOCALES) {
  if (!existsSync(join(ROOT, fileOf(locale)))) refuse(`${fileOf(locale)} is missing`);
}

const markdowns = Object.fromEntries(LOCALES.map((locale) => [locale, readFileSync(join(ROOT, fileOf(locale)), 'utf8')]));

const resolveLink = siteHrefResolver({ siteOrigin: SITE_ORIGIN });
const { releasesOf, isoDateOf } = releaseNotesReader({ refuse, resolveLink });

const allReleases = Object.fromEntries(
  LOCALES.map((locale) => [locale, releasesOf(markdowns[locale], fileOf(locale), { skip: (heading) => notARelease(heading, fileOf(locale)) })]),
);

/** The two languages are one document in two spellings, joined positionally: the page puts
 *  the English bullet and the French bullet of the same rubric on the same line of the same
 *  release. A file that gained a rubric, or a rubric that gained a bullet, on one side only
 *  breaks that join silently — refused here instead, where the message can name both files. */
function checkAgree(en, fr, index) {
  if (fr.tag !== en.tag) {
    refuse(`${fileOf('en')} names release #${index + 1} as ${en.tag} and ${fileOf('fr')} names it ${fr.tag}`);
  }
  if (fr.sections.length !== en.sections.length) {
    refuse(`${fileOf('en')} and ${fileOf('fr')} disagree on ${en.tag}: ${en.sections.length} rubric(s) against ${fr.sections.length}`);
  }
  en.sections.forEach((section, i) => {
    const twin = fr.sections[i];
    if (twin.items.length !== section.items.length) {
      refuse(
        `${fileOf('en')} and ${fileOf('fr')} disagree on ${en.tag}, rubric ${i + 1} ` +
          `("${section.label}" against "${twin.label}"): ${section.items.length} bullet(s) against ${twin.items.length}`,
      );
    }
  });
}

if (allReleases.en.length !== allReleases.fr.length) {
  refuse(`${fileOf('en')} holds ${allReleases.en.length} release(s), ${fileOf('fr')} holds ${allReleases.fr.length}`);
}
allReleases.en.forEach((en, index) => checkAgree(en, allReleases.fr[index], index));

function releaseDocumentOf(index) {
  const en = allReleases.en[index];
  const fr = allReleases.fr[index];

  return {
    tag: en.tag,
    date: isoDateOf(en.date, fileOf('en')),
    locales: {
      en: { summaryHtml: en.summaryHtml, sections: en.sections },
      fr: { summaryHtml: fr.summaryHtml, sections: fr.sections },
    },
  };
}

const total = allReleases.en.length;
const latest = releaseDocumentOf(0);
const previous = Array.from({ length: Math.min(PREVIOUS_COUNT, total - 1) }, (_unused, offset) => releaseDocumentOf(offset + 1));

// Null once every release this file holds is already shown between `latest` and `previous` —
// the common case today, with only a handful of releases behind this one. Once a release
// exists beyond what's shown, this names it; but /version does not paginate its history and
// has no per-release anchor to send that link to — going further means the tag list, at
// /tags, which is what the page links to instead.
const shown = 1 + previous.length;
const moreTag = shown < total ? allReleases.en[shown].tag : null;

const document = { ...latest, previous, moreTag };

mkdirSync(join(ROOT, 'src/generated'), { recursive: true });
writeFileSync(join(ROOT, 'src/generated/site-release.json'), `${JSON.stringify(document, null, 2)}\n`);

console.log(`site-release.json : latest=${document.tag} previous=${previous.length} moreTag=${moreTag ?? '—'}`);
