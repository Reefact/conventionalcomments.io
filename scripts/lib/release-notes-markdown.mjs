// The markdown RELEASE_NOTES-<locale>.md is written in, read into structure.
//
// One grammar, one parser: `## <tag> — <date>`, an optional summary paragraph in italics,
// then `### Rubric` blocks of `- ` bullets. `scripts/generate-site-release-note.mjs` is
// the only caller today, but the grammar is the same one `check-release-notes.mjs` already
// assumes when it counts headings and bullets — this is what reads that grammar into
// something a page can render, rather than just counting it.
//
// WHAT IT RETURNS IS STRUCTURE, NOT A PAGE. A release comes back as its tag, its date as
// written, its summary and its rubrics — nothing else. What a page makes of that (a card,
// a link, an anchor) is the caller's decision.
//
// IT IS NOT A MARKDOWN PARSER. It knows the block forms this repository's release notes use
// and no others, which is the whole reason this repository has no markdown dependency to
// keep current. A file that starts using tables or nested lists is a file this stops being
// right about, and the fix is to teach it that form rather than to reach for a library.

/**
 * A reader bound to one decision: where a link in these notes should point.
 *
 * `resolveLink` is asked about every destination these notes carry, absolute ones included,
 * and answers with the URL to publish and whether it leaves this site. Every link in
 * `RELEASE_NOTES-en.md` / `-fr.md` is written out in full (`https://conventionalcomments.io/…`
 * or an external URL) — this repository has no relative-link authoring habit to preserve —
 * so the resolver's only real job is telling the two apart for the reader's sake: a link to
 * this site's own page should not announce itself as leaving it.
 */
export function releaseNotesReader({ refuse, resolveLink }) {
  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /** The one escape `escapeHtml` does not do: a literal quote in a link destination closes
   *  an `href="…"` early and lets whatever follows be read as markup or a second attribute. */
  function escapeQuotes(text) {
    return text.replace(/"/g, '&quot;');
  }

  /**
   * The inline markdown these files actually use — code spans, bold, italics and links —
   * turned into safe, ready-to-display HTML. Not a markdown parser: it knows nothing about
   * block structure, lists or headings, because splitting on those happens before this runs.
   */
  function inlineHtml(markdown) {
    // What is between backticks is a literal, and the only thing that may happen to it is
    // HTML escaping. Each span is lifted out to a NUL-delimited hole before the other passes
    // run, and put back after — so `**a `b` c**` stays one `<strong>`, and a link written
    // inside a code span cannot come out as a live anchor.
    const escaped = escapeHtml(markdown.replace(/\0/g, ''));

    const codes = [];
    const coded = escaped.replace(/`([^`]+)`/g, (_match, code) => `\0${codes.push(escapeQuotes(code)) - 1}\0`);

    const bolded = coded.replace(/\*\*([^*]+)\*\*/g, (_match, text) => `<strong>${text}</strong>`);
    // After bold consumes every `**` pair, a remaining single `*…*` is italic.
    const italicised = bolded.replace(/\*([^*]+)\*/g, (_match, text) => `<em>${text}</em>`);

    const linked = italicised.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, href) => {
      const link = resolveLink(href);
      const away = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';

      return `<a href="${escapeQuotes(link.href)}"${away}>${text}</a>`;
    });

    return linked.replace(/\0(\d+)\0/g, (_match, index) => `<code>${codes[Number(index)]}</code>`);
  }

  /** A paragraph, with the one block-level form these files use handled first: a release's
   *  own summary is written as a whole line in italics, `_like this_`. */
  function paragraphHtml(paragraph) {
    const italic = /^_(.+)_$/.exec(paragraph.trim());

    return italic === null ? inlineHtml(paragraph) : `<em>${inlineHtml(italic[1])}</em>`;
  }

  /**
   * One file's releases, newest first — the order the file already writes them in.
   *
   * Everything above the first `## ` is dropped: a notes file opens with its own title and
   * a paragraph pointing at its translation and at the toolkit's own notes, which is that
   * file's navigation rather than a release's content.
   *
   * `skip` is asked about each heading before it is parsed, and is how a caller declines a
   * section that is not a release — this file opens with `## Unreleased`, which names no tag
   * and dates nothing, and which a page describing what shipped must not show.
   */
  function releasesOf(markdown, file, { skip = () => false } = {}) {
    const lines = markdown.split('\n');
    const releases = [];
    let heading = null;
    let body = [];

    function flush() {
      if (heading === null) return;

      const match = /^(\S+)\s+—\s+(.+)$/.exec(heading);
      if (match === null) refuse(`${file} heads a release "${heading}", where "<tag> — <date>" was expected`);

      const [, tag, date] = match;
      const firstRubric = body.findIndex((line) => /^### /.test(line));
      const summaryLines = firstRubric === -1 ? body : body.slice(0, firstRubric);

      const sections = [];
      let current = null;
      for (const line of body) {
        const rubric = /^### (.+)/.exec(line);
        if (rubric !== null) {
          current = { label: rubric[1].trim(), lines: [] };
          sections.push(current);
        } else if (current !== null) {
          current.lines.push(line);
        }
      }

      if (sections.length === 0 && summaryLines.every((line) => line.trim() === '')) {
        refuse(`${file} carries a release ${tag} with neither a summary nor a rubric`);
      }

      releases.push({
        tag,
        date,
        summaryHtml: paragraphsOf(summaryLines).map(paragraphHtml),
        sections: sections.map((section) => ({
          label: section.label,
          items: blockItemsOf(section.lines).map(inlineHtml),
        })),
      });
    }

    for (const line of lines) {
      const release = /^## (.+)/.exec(line);
      if (release !== null) {
        flush();
        heading = skip(release[1].trim()) ? null : release[1].trim();
        body = [];
      } else if (heading !== null) {
        body.push(line);
      }
    }
    flush();

    if (releases.length === 0) refuse(`${file} holds no release at all`);

    return releases;
  }

  /**
   * `September 7, 2026` → `2026-09-07`.
   *
   * Read from the English file only, and reused for both languages: the French twin writes
   * the same day as `7 septembre 2026`, and a page that formats an ISO date in the reader's
   * own locale needs one date, not two spellings of it.
   */
  function isoDateOf(text, file) {
    const match = /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/.exec(text.trim());
    const month = match === null ? -1 : MONTHS.indexOf(match[1].toLowerCase());

    if (match === null || month === -1) {
      refuse(`${file} dates a release "${text}", which is not a month, day and year in English`);
    }

    const year = Number(match[3]);
    const day = Number(match[2]);

    // Built and read back through UTC rather than trusted as typed: "November 31, 2026"
    // matches the shape above and rolls over to December 1st in `new Date`, and "January 99,
    // 2026" produces an Invalid Date deep inside a component, naming neither file nor text.
    const built = new Date(Date.UTC(year, month, day));
    if (built.getUTCFullYear() !== year || built.getUTCMonth() !== month || built.getUTCDate() !== day) {
      refuse(`${file} dates a release "${text}", which is not a day the calendar has`);
    }

    return `${match[3]}-${String(month + 1).padStart(2, '0')}-${match[2].padStart(2, '0')}`;
  }

  return { inlineHtml, paragraphHtml, releasesOf, isoDateOf };
}

/** Blank-line-separated paragraphs, each unwrapped onto one line. */
function paragraphsOf(lines) {
  const paragraphs = [];
  let current = [];

  for (const line of lines) {
    if (line.trim() === '') {
      if (current.length > 0) {
        paragraphs.push(current.join(' '));
        current = [];
      }
    } else {
      current.push(line.trim());
    }
  }
  if (current.length > 0) paragraphs.push(current.join(' '));

  return paragraphs;
}

/** The items of one `### Rubric` block, in the order they were written — a `- ` line starts
 *  a bullet, a blank line ends whatever is open, and any other line extends it. */
function blockItemsOf(lines) {
  const items = [];
  let current = null;

  for (const line of lines) {
    const bullet = /^- (.*)/.exec(line);
    if (bullet !== null) {
      if (current !== null) items.push(current);
      current = bullet[1];
    } else if (line.trim() === '') {
      if (current !== null) {
        items.push(current);
        current = null;
      }
    } else if (current !== null) {
      current += ` ${line.trim()}`;
    } else {
      current = line.trim();
    }
  }
  if (current !== null) items.push(current);

  return items;
}

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

/**
 * A destination as this site's own notes actually write them: absolute, always. A link to
 * `siteOrigin` itself (or a page under it) is not a link away from the site; anything else —
 * GitHub, the schema URL, the toolkit's own docs — is external and says so.
 *
 * This repository's `RELEASE_NOTES-*.md` carry no repository-relative links (unlike a
 * project that mirrors another repository's notes into its own tree), so unlike a resolver
 * built for that case, this one has no ref to pin and nothing to rewrite — it only classifies.
 */
export function siteHrefResolver({ siteOrigin }) {
  return function resolved(href) {
    const external = !(href === siteOrigin || href.startsWith(`${siteOrigin}/`));

    return { href, external };
  };
}
