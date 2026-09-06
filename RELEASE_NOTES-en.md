# Release notes — conventionalcomments.io

🌍 🇬🇧 English (this file) · 🇫🇷 [Français](RELEASE_NOTES-fr.md)

What changed on conventionalcomments.io, one section per `release/*` tag, in plain
language — for a visitor, a contributor, or the maintainer checking what is new. This is not
a commit log: it describes what a reader would notice, not which pull request brought it.
The technical history is the repository's.

Do not confuse it with [`/release-notes/v1/`](https://conventionalcomments.io/release-notes/v1/),
which is the **toolkit's** release notes. This file is the **site's**.

A release that has no section here does not ship: `scripts/release-notes.sh` refuses rather
than deriving a list from commits, and the `notes` job fails with it. An untagged release is
the wrong moment to discover that nobody wrote what it contains.

## Unreleased

_Nothing pending yet._

## release/2026-09-06T18-03-59Z — September 6, 2026

### ✨ New

- **The site exists.** conventionalcomments.io answers, in English at the root and in French
  under `/fr/`, with translated addresses — `/docs/configure/` and
  `/fr/docs/configuration/` are the same page in two languages, and the switcher keeps you
  on the page you were reading instead of sending you home.
- **Four pages to decide with**: what the convention fixes and why a label changes how a
  remark is read; how the extension and the server work; which platforms and browsers are
  supported; and what the extension does and does not do with what you write in a review.
- **Seven pages to work with**: install, labels and decorations, configuration, adoption,
  the server, and troubleshooting — each written from the toolkit's own sources.
- **The configuration schema is served** at
  [`/schema/v1.json`](https://conventionalcomments.io/schema/v1.json). Put that URL on the
  `$schema` line of a repository's `.conventional-comments.json` and your editor completes
  the keys, describes each one on hover, and underlines a wrong value before you commit.
- **The toolkit's release notes are readable on the site**, in both languages, at
  [`/release-notes/v1/`](https://conventionalcomments.io/release-notes/v1/) — ten versions,
  each saying what it changed for the person using it.

### 🙌 Improvements

- **The site serves its own fonts.** Nothing is fetched from a third party, so opening any
  page sends your address and the URL you are reading to nobody but this site — which is
  what the privacy page claims, and now what the network tab shows.
