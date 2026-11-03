# OAuth Setup Guides

A small, source-backed guide library for agent builders preparing OAuth integrations. It explains the provider app registration path, likely setup effort and review wait, common blockers, and the split between agent research and developer-owned actions.

## Run locally

1. Install Node.js 20.9 or later.
2. Install dependencies with npm install.
3. Copy .env.example to .env.local.
4. Set NVIDIA_API_KEY in .env.local to enable live research. Create the key in the NVIDIA API Catalog at build.nvidia.com. The library and curated guides work without it.
5. Run npm run dev and open http://localhost:3000.

Generated guides are stored in .data/generated-guides.json during local development. They appear in the home page's Saved guides section and on /saved, and each opens at a stable /g/:id page. The .data directory is ignored by Git.

## Deploy and persist share links

Deploy the repository to Vercel. Add NVIDIA_API_KEY (and optionally NVIDIA_MODEL) as server-side environment variables. For durable generated-guide links across serverless instances, create a Supabase project, run supabase/schema.sql, and set SUPABASE_URL and SUPABASE_SECRET_KEY in Vercel. The Supabase secret key is read only by server routes. Never add real credentials to the repository or browser code.

The local JSON store is a development fallback; serverless deployments need Supabase for durable generated guides. Generation is unlimited in local development and limited to four requests per client IP per hour in production per running process. This in-memory limit is a demo safeguard, not production-grade distributed abuse protection.

## Product decisions

- The guide opens with the managed-auth decision. A developer may not need a provider-owned OAuth client when Composio’s managed app meets their branding, scope, and quota needs.
- GitHub, Slack, and Google show different paths: quick self-service registration; unlisted distribution with separate Marketplace review; and consent-screen plus scope-dependent verification.
- Setup effort is an engineering estimate. Provider review times are kept separate and only shown when the provider publishes an estimate.
- The live generator searches current public sources, prioritizes provider and Composio documentation, and requires source links. A generated guide is a research draft, not a provider decision or completed setup.
- Provider credentials, app registration, consent, domain ownership, secret management, security assessments, and review responses remain developer actions.

## Evidence and validation notes

The curated guides were researched against official documentation on November 3, 2026. No provider accounts were available, so no OAuth app was created and no provider console flow was submitted.

- **GitHub:** Registration is self-service. GitHub recommends considering GitHub Apps for fine-grained repository permissions; organization policy can require owner approval. The 20–40 minute setup range is our estimate. [Create an OAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) · [GitHub Apps vs. OAuth apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps) · [Organization approval](https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization)
- **Slack:** Unlisted public distribution is separate from Marketplace listing. The current review guide calls for a functional public app and testing on at least 10 active workspaces. Its published review windows are estimates, not guarantees. [Distribution](https://docs.slack.dev/app-management/distribution/) · [OAuth installation](https://docs.slack.dev/authentication/installing-with-oauth/) · [Marketplace review](https://docs.slack.dev/slack-marketplace/slack-marketplace-review-guide/)
- **Google:** External apps in Testing are limited to test users; refresh-token expiry can affect testing. Brand review is commonly 2–3 business days, but sensitive or restricted scopes can require additional work and do not share a single overall ETA. [Web server OAuth](https://developers.google.com/identity/protocols/oauth2/web-server) · [Brand verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification) · [Policy compliance](https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance) · [App states](https://developers.google.com/identity/protocols/oauth2/production-readiness/overview)
- **Composio:** Managed auth supplies and maintains the OAuth app for supported toolkits. Custom credentials are useful for own branding, scopes, or quota. [Managed OAuth apps](https://docs.composio.dev/toolkits/managed-auth)

Live research uses DuckDuckGo's public HTML search to discover current pages, fetches up to eight pages, then sends short text extracts to NVIDIA's chat API to produce the guide. Sources are restricted to pages actually retrieved and every guide is schema-validated before saving. DuckDuckGo's public HTML markup can change or rate-limit requests; some provider pages block automated fetches. The guide's facts and estimates still need developer review. See NVIDIA's [LLM API documentation](https://docs.api.nvidia.com/nim/reference/llm-apis).

## Routes

- / — searchable guide library and live research form
- /guides/github, /guides/slack, /guides/google — curated guides
- /saved — list of generated guides saved to local JSON or Supabase
- /g/:id — generated guide share page
- POST /api/guides — research an app and save its guide
- GET /api/guides — list saved generated guides
- GET /api/guides/:id — retrieve a saved guide

## Build checks

Run npm run lint and npm run build. Live generation requires a working NVIDIA API key and server access to DuckDuckGo; durable deployed guide links require Supabase configuration.
