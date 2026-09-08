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

### 🐛 Fixed

- **The pages no longer explain themselves by contrast with a version you never saw.** The
  home, platforms and install pages each singled out github.com in a sentence that had
  already stated the rule — that the extension reaches only the domains you have allowed.
  Naming one domain inside that rule only means something to a reader who knew github.com
  used to be built in; to everyone else it suggests the domain is an exception, which is the
  opposite of what the sentence says. The aside is gone from all three; the troubleshooting
  entry keeps it, because someone whose toolbar is missing on github.com needs that
  exception ruled out by name.
- **The French troubleshooting page no longer talks about granting a domain.** Under "la
  barre de labels n'apparaît pas", it read "tant que vous ne lui accordez pas un premier
  domaine" — in French one does not grant a domain to an extension, one authorizes the
  extension to reach it. Review caught the same wording in the last release's notes and it
  was fixed there; the page that wording came from was missed, and shipped.

## release/2026-09-08T10-40-39Z — September 8, 2026

### ✨ New

- **The toolkit's release notes now cover 1.0.0-beta.12.** `/release-notes/v1/` gains the
  release that makes the guided tour legible in both themes and stops the options page's
  "Status" section claiming more than the extension knows.
- **The toolkit's release notes now cover 1.0.0-beta.11.** `/release-notes/v1/` gains the
  release in which every platform — `github.com` included — is authorized the same way, the
  options page opens itself on a first install with a guided tour, and GitHub Enterprise
  Cloud with data residency works at all.

### 🐛 Fixed

- **The site no longer says the extension works on github.com out of the box.** It did, up
  to toolkit 1.0.0-beta.10; from 1.0.0-beta.11 a fresh install is active nowhere until you
  allow a first domain, github.com like any other. The install, platforms, troubleshooting
  and home pages said the opposite in both languages — the kind of claim that sends someone
  to a pull request where nothing happens, and leaves them looking for a bug rather than a
  button. The install page now walks through authorizing a domain, and warns anyone updating
  from an earlier version that github.com goes quiet until they do.
- **The troubleshooting page no longer says the platform changed its markup.** Under "the
  toolbar doesn't appear", the second cause was headed "The platform's page structure has
  changed" — the same over-claim the toolkit removed from the extension in 1.0.0-beta.12.
  What is actually recorded is that one of the extension's selectors found nothing, which
  may mean the markup changed or simply that the element is legitimately absent, like the
  merge button on a closed pull request. Sending someone to hunt for a platform change that
  never happened is the worst answer a troubleshooting page can give.
- **The `/version` page no longer names the same release twice.** On a build that came from a
  release tag, the heading right below the build facts repeated the page's own title,
  "Latest release". It now reads "What shipped" instead, on every build — naming the
  section's content rather than the release itself, and keeping a real heading between the
  page's h1 and the release card's own headings either way.

## release/2026-09-07T10-06-13Z — September 7, 2026

### 🔧 Improved

- **The site now presents the extension as the product available today, with no server to
  deploy.** Assist and warn are available through the browser extension today. Enforce —
  eventually, a platform-level merge check — is now clearly presented as roadmap work
  rather than a shipped or required backend. The former server deployment page is now an
  Enforce roadmap page that explains the goal without committing to a specific
  architecture.
- **The configuration schema now clearly reflects the product's current capabilities.**
  The `mode` descriptions distinguish what the extension already does today from what is
  still on the roadmap. Reserved `server` settings are clearly identified as having no
  effect in the current browser extension.

## release/2026-09-07T08-30-31Z — September 7, 2026

### ✨ New

- **`/version` now shows this site's own release history**, instead of the placeholder text it
  had shown since before any release existed. The latest release and up to five before it are
  read straight from this file, in your own language.

### 🐛 Fixed

- **Guessing a page's address in the wrong language, or under `/en/`, no longer 404s.**
  `/fr/docs/install/`, `/docs/installation/` (missing the `/fr/` prefix), and any
  `/en/`-prefixed address — which the site never actually uses — now redirect to the right
  page instead of a dead end.
- **The configure and adoption pages no longer describe a `toolCommands` history that never
  happened.** They said slash commands "used to be recognized through a built-in list" that
  "no longer exists" — a claim about a past version the extension has never had. They now
  simply state the current default.

## release/2026-09-07T05-34-29Z — September 7, 2026

### 🔧 Improved

- **The docs table of contents stays put while you scroll.** The left-hand navigation on
  documentation and release-notes pages now stays visible as you read down a long page,
  instead of scrolling out of view with the rest of the sidebar.

## release/2026-09-06T21-44-09Z — September 6, 2026

### 🐛 Fixed

- **Text no longer stretches edge to edge on wide screens.** The header, footer, and every
  content section now sit in a centered column instead of spanning the full width of a large
  monitor, where a line of text could otherwise run far past a comfortable reading width.

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
