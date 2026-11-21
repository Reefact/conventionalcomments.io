# CLAUDE.md

## Infrastructure: Cloudflare WAF rule "Block .env probes"

A custom security rule (WAF) was created on 2026-11-21 for the
conventionalcomments.io domain, in Cloudflare (Security → Security rules →
Custom rules).

- Name: `Block .env probes`
- Condition: `(http.request.uri.path contains ".env")`
- Action: Block (Cloudflare refuses the request before it reaches the site)
- Status: Active

Why: automated scanners constantly probe paths such as `/.env`, `/.env.txt`,
`/old/.env` or `/frontend/.env` to retrieve secrets. About 300 such requests
were seen over 24 hours (about 28% of the traffic over 30 days), all refused.
The rule stops them upstream and keeps the statistics cleaner.

### What this means for development

The rule tests the **request path** only (`http.request.uri.path`). The query
string and the fragment are not part of it: a fragment never leaves the
browser, and `/docs/configure/?example=.env` has no `.env` in its path.

1. No path served by the site may contain the string `.env` (page, asset,
   API route, static file…). Cloudflare would block it, real visitors
   included. Examples to avoid: `/docs/.environment`, `config.env.json`.
2. A 403 on a URL whose path contains `.env` (test, monitoring, link checker)
   most likely comes from this rule, not from a bug in the site. A `.env`
   only in the query string or the fragment is not matched by the rule, so do
   not blame it there.
3. Never deploy a `.env` file (or a variant) in the published folder. The rule
   is an additional protection, not the only one: it does not replace a proper
   build configuration.
4. Do not delete or disable the rule without discussing it first. Any change
   goes through the Cloudflare dashboard.
5. The rule is not described in the repository's code. If infrastructure as
   code (Terraform, Wrangler, etc.) is added later, reproduce it there so it
   is not lost or overwritten.

The `contains` filter is deliberately broad (it also covers `/.env.txt`,
`/.env.dist`, etc.). The site's current pages (`/docs/...`, `/fr/...`) are not
affected.
