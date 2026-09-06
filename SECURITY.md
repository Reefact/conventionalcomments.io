# Security policy

This repository holds a **website**, not the toolkit. It is one static deployment — an Astro
application served as Cloudflare assets, with **no Worker script**, no application server, no
account, no database, and no visitor data to reach. What can go wrong here is narrower than in a
package: a script that runs where it should not, a link or redirect that sends a visitor
somewhere it should not, a secret that reached the built artefact, or a page that states
something false about what the toolkit does with your data.

That last one belongs here too. The privacy page and the server page make claims a reader uses
to decide whether to trust the tooling; a claim that is wrong is a defect of this site even when
no code is at fault.

Report any of those **privately**. Not as an issue: the tracker is public from the moment the
form is submitted, so an issue is a disclosure before it is a report.

**Use [Report a vulnerability](https://github.com/Reefact/conventionalcomments.io/security/advisories/new).**
It opens a thread that only the maintainer can read, and it stays closed until there is something
to publish.

A vulnerability in the **toolkit itself** — the browser extension or the server companion —
belongs to [its own repository](https://github.com/Reefact/conventional-comments-toolkit), not
here. This site only describes them; a defect in either reaches every user of the tooling rather
than only a visitor to this site.

The configuration schema served at
[`/schema/v1.json`](https://conventionalcomments.io/schema/v1.json) is read by other
repositories' editors. A defect there — a wrong constraint, a moved URL — affects them, so treat
it as belonging to this policy rather than to the toolkit's.
