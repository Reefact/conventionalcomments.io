# Contributing to conventionalcomments.io

This repository holds the showcase site for
[`conventional-comments-toolkit`](https://github.com/Reefact/conventional-comments-toolkit).

## Language

**Commit messages, branch names, pull request titles and descriptions are in
English.** They follow the convention of the other Reefact repositories, so a
maintainer moving between them does not have to remember which set of rules is in
force.

**Everything else in this repository is in French** — code comments, design
documents under `docs/`, the README, the comments inside the workflows. That is a
deliberate divergence from `justdummies.io`, whose rule pushes English into code
comments too. Here the reasoning is written in French because the design that
produced it was, and a comment that explains a French design document in English
adds a translation step to every reading of it.

The exception is `tools/commit-lint/lint-commit-message.sh`, kept a near-copy of
the file in `justdummies.io` — including its English comments — precisely so the
two do not drift.

The site's own copy is a third question, settled by the identity document: English
at the root, French under `/fr/`, each written rather than translated.

This is written down because an exception nobody wrote down is not an exception,
it is the beginning of a repository in two languages.

## Enabling the commit-message hook

A `commit-msg` hook checks every message against the convention below before it
is recorded. It is versioned under `.githooks/`; enable it once per clone:

```
git config core.hooksPath .githooks
```

The same check runs in CI on every pull request, so a bypassed hook
(`git commit --no-verify`) is caught before merge. Merge commits are exempt.
The check itself lives in `tools/commit-lint/lint-commit-message.sh`, shared by
the hook and CI so the two never diverge.

The hook lets `fixup!`, `squash!` and `amend!` commits through so you can build
an autosquash rebase; CI rejects them, so squash them away before merge.

## Commit messages

### Format

```
<type>[(<scope>)][!]: <description>

[body]

[footers]
```

* The commit MUST begin with a type, optionally followed by a scope and a `!`,
  then a colon and a space.
* Everything written in the message MUST be in English — header, body, footers.
* A commit MUST carry a single type, that of its intention. Two independent
  intentions MUST be two commits: the message forces the split that ought to
  happen.
* The description is imperative present, lowercase, with no trailing period:
  `add the release notes page`, never `Added the release notes page.`
* The whole header stays within **72 characters**.
* Leave a blank line between the header and the body. The body is prose, and it
  says **why** — the diff already says what.

### Types

The list is closed and identical to the other Reefact repositories'.

| Type | When to use |
|---|---|
| `feat` | A new capability, visible to a visitor of the site |
| `fix` | The correction of a defective behaviour |
| `build` | Build system, dependencies, deployment artefacts |
| `chore` | What touches neither the site's code nor its delivery |
| `ci` | Pipeline configuration |
| `docs` | Documentation only — this repository's own docs, not the site's content |
| `perf` | A performance gain, at constant observable behaviour |
| `refactor` | Restructuring, at constant observable behaviour |
| `revert` | The reversal of an earlier commit |
| `style` | Formatting with no semantic effect |
| `test` | Tests only |

The type MUST be lowercase and belong to this table.

Note the boundary between `docs` and `feat(site)`: a page of the site is the
site's content, so writing or rewriting one is `feat(site)` or `fix(site)`. `docs`
is for what explains this repository to whoever works on it — `docs/identite-fr.md`,
this file, the README.

### Scope

The scope MAY be provided, and is **required** on `feat` and `fix`. When present
it MUST be lowercase and MUST be one of:

| Scope | Covers |
|---|---|
| `ci` | The pipeline as a subject — a `docs(ci)` explaining a workflow, not a change to the workflow itself, which is the `ci` type |
| `schema` | The configuration schema served at `/schema/v1.json`, and the guard that keeps it in step with the toolkit |
| `site` | The Astro application — pages, layouts, components, routes, invariants |
| `tokens` | The design tokens and the stylesheets built on them, consumed by both the site and the mockups |

A scope names a **component**, never a file or a directory: `fix(site)`, never
`fix(Header.astro)`. Several scopes are comma-separated, unique and alphabetical,
with no space: `feat(site,tokens)`.

`feat` and `fix` require one because a capability added or a defect fixed always
belongs to a component, and the diff does not always say which — a change under
the design tokens serves the site and the mockups at once.

### Breaking changes

A `!` before the colon requires a `BREAKING CHANGE:` footer describing what
callers must do, and the footer requires the `!`. The two signals travel
together or not at all.

The site publishes no package, so a breaking change here means something narrow:
a URL that no longer resolves, a redirect removed, a public asset path that moved
— and `/schema/v1.json`, which other repositories read at their `$schema` line and
which therefore cannot move without warning.

### Issue references

When a GitHub issue exists, reference it in a footer:

```
Refs: #42
```

Issue-closing keywords (`Closes #42`) belong in the pull request description,
not in a commit — the commit is the unit of the change, the issue is the unit of
the request, and only the pull request closes one.

## Pull request titles

A pull request MAY gather several commits, of several types. Its title is read
in the list of open pull requests. It is **not** linted; it stands on the review,
as the code does.

* The title MUST be in **English** and name the **whole** pull request, not one
  of its commits.
* **One intention** — the title mirrors the commit header it collapses to:
  `<type>[(<scope>)]: <description>`, under the rules above. A one-commit pull
  request's title is that commit's header, verbatim.
* **Several intentions** — the title MUST NOT borrow a single `type:` prefix: it
  would name one commit and hide the rest. State the subject in plain words,
  with an initial capital and no trailing period.
* Keep it within **72 characters**.
* The issue reference lives in the description, never the title.
