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

### ✨ New

- **The toolkit's release notes now run up to 1.0.0-rc.2.** `/release-notes/v1/` gains eleven
  versions, from 1.0.0-beta.13 to the release candidate: labels for replying to a review,
  GitLab support, review-session markers, an `enforce` mode that really blocks, and the
  retirement of the verifier. Its introduction no longer mentions a server: the extension
  never blocks a merge.
- **The labels page covers the nineteen labels the toolkit ships.** `/docs/labels/` groups
  them the way the toolbar does — remarks, review status, replies — and says which come from
  Conventional Comments and which the toolkit adds. New sections explain how to reply to a
  remark (`thanks`, `done`, `ack`, `disagree`, `decision`), how to say where a review stands
  (`summary`, `reviewed`), and how a team that wants only the original list turns the rest
  off.
- **The Enforce page now describes the mode as it ships.** `/docs/enforce/` replaces the
  former roadmap page: when the extension blocks a comment, why it re-reads the
  configuration first, and why it never blocks a merge. The old `/docs/server/` address
  redirects there.
- **A new page covers AI-assisted review.** `/docs/ai-review/` explains the session marker
  that tells apart the comments of several review sessions, and the two skills the toolkit
  ships for agents that review a pull request or answer a review.
- **GitLab appears among the supported platforms.** gitlab.com gets the toolbar, live
  validation, badges, the thread filter and the banner; the extension never blocks a comment
  there.
- **"How it works" describes what the extension has gained:** the three-group toolbar and
  personal button order, configuration notices, the collapsed banner, the thread filter and
  review-session markers.
- **The adoption guide follows the path the toolkit recommends.** `/docs/adoption/` goes from
  `assist` to `enforce` on a pilot repository, then everywhere; it says what to prepare
  before the switch and how to roll back in minutes.
- **The configuration page explains what the extension tells you.** `/docs/configure/` gains
  two sections: when a change takes effect, and the configuration notices shown in the
  status pill.
- **The installation page covers GitLab.com and organization-wide deployment:** forced
  installation, domains authorized in advance, the floor and the telemetry endpoint.
- **Troubleshooting covers what an update to 1.0.0-rc.1 brings.** Two new entries —
  configuration notices that appear in the status pill, and comments that are suddenly
  blocked in `enforce` — and a last section on downloading the diagnostic archive and
  attaching it to an issue.

### 🐛 Fixed

- **The site no longer announces a platform-level merge check.** The home page, "How it
  works", the platforms page, the adoption guide, the docs index and the privacy page all
  presented it as on the roadmap. The toolkit has decided otherwise: the extension is the
  whole product, it reports unresolved blocking threads and never blocks a merge. The
  `warn` stage is gone with it.
- **Azure DevOps is listed for dev.azure.com only.** The platforms page offered Azure DevOps
  Server as supported; the extension acts on dev.azure.com and nowhere else. Bitbucket is
  no longer announced as coming.
- **The home page no longer says the extension sends nothing, ever.** Its privacy block read
  "Nothing is sent anywhere. No telemetry.", while the privacy page explains the opt-in
  telemetry an organization can set up. It now says nothing is sent by default. The block
  next to it also stops listing browsers as a platform, and no longer points to "documented
  limitations" the site never documented.
- **The home page shows the right icons and the right shortcut.** `praise` is 👏, `decision`
  is ⚖️, and `nitpick:` is typed `?ni`.
- **The labels page shows the defaults the toolkit ships.** `typo` and `polish` are enabled,
  only `quibble` is not; and the page no longer cites `formatSeverity`, or a group entitled
  to record a `decision`, both retired.
- **"How it works" gives the two real conditions for blocking a comment.** The activation
  date is gone, and the page now says that the extension re-reads the configuration before
  blocking.
- **The docs no longer describe settings and a mode that are gone.** `warn`,
  `formatSeverity` and `resolverOverrideGroup` are out of the configuration and adoption
  pages, which now say what happens to a file that still carries them.
- **The installation page no longer suggests authorizing Azure DevOps Server or
  `visualstudio.com`,** where the extension does nothing.
- **The privacy page lists everything the extension keeps.** Three synced preferences rather
  than two, the configuration notices and the diagnostic journal as they are stored, and a
  revision date. The journal was described as "the latest 50 entries"; it keeps one line
  per rule, with the page where the rule failed.
- **The troubleshooting page describes the extension as it is today.** "Configuration
  unread" is a message of the status pill, permanent on GitLab; a blocking thread is
  resolved on the platform, with no entitled group; and the journal is described as the
  extension keeps it.
- **The pages no longer explain themselves by contrast with a version you never saw.** The
  home, platforms and install pages each singled out github.com in a sentence that had
  already stated the rule — that the extension reaches only the domains you have allowed.
  Naming one domain inside that rule only means something to a reader who knew github.com
  used to be built in; to everyone else it suggests the domain is an exception, which is the
  opposite of what the sentence says. The aside is gone from all three; the troubleshooting
  entry keeps it, because someone whose toolbar is missing on github.com needs that
  exception ruled out by name.
- **Neither language talks about granting a domain any more.** What is granted is access to
  a domain, not the domain itself, and both languages had lost that distinction. In French,
  the troubleshooting page read "tant que vous ne lui accordez pas un premier domaine"; in
  English, the install and platforms pages read "every domain is granted one at a time" and
  the troubleshooting page "until you grant a first domain". All four now name what is
  actually granted. The same pass reworded the second sentence of the domain-authorization
  section on each install page: in English, "has no permanent access to any site" replaces
  "holds no permanent access to any site"; in French, "ne dispose d'aucun accès permanent"
  replaces "ne détient d'accès permanent à aucun site". Review caught the French wording in
  the last release's notes and it was fixed there; the page it came from was missed, and
  shipped.

### 🔧 Improved

- **The configuration schema follows the toolkit's 1.0.0-rc.2.** `/schema/v1.json` now knows
  `sessionIcon`, the `kind`, `description` and `usage` of a label, and the
  `W-SESSION-MULTIPLE` diagnostic. It no longer offers the seven keys the toolkit retired
  with the verifier — `formatSeverity`, `overrideLabel`, `resolverOverrideGroup`,
  `activation`, `docUrl`, `server` and `exemptionLog` — so your editor now underlines them.
  `"mode": "warn"` is still accepted, and flagged as obsolete.
- **The platforms page no longer lists browsers as a platform.** Chrome, Edge, Brave and
  Firefox sat in the same grid as GitHub and Azure DevOps, as if they answered the same
  question. They now have their own short section under the platforms: where you review
  code on one side, where the extension installs on the other.

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
