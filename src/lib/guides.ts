export type EvidenceSource = {
  title: string;
  url: string;
  kind?: "official" | "community";
};

export type GuideStep = {
  title: string;
  description: string;
  owner: "you" | "agent" | "both";
};

export type OAuthGuide = {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  tagline: string;
  category: "Developer tools" | "Communication" | "Productivity" | "Other";
  mark: string;
  markColor: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  effort: string;
  approval: string;
  summary: string;
  managedAuth: string;
  prerequisites: string[];
  steps: GuideStep[];
  blockers: string[];
  agentCan: string[];
  youMust: string[];
  uncertainty: string[];
  sources: EvidenceSource[];
  lastChecked: string;
  generated?: boolean;
};

export const managedAuthSource: EvidenceSource = {
  title: "Composio managed auth",
  url: "https://docs.composio.dev/toolkits/managed-auth",
  kind: "official",
};

export const guides: OAuthGuide[] = [
  {
    id: "github",
    slug: "github",
    name: "GitHub",
    vendor: "GitHub, Inc.",
    tagline: "A quick self-serve registration, with an important app-type choice.",
    category: "Developer tools",
    mark: "GH",
    markColor: "#24292f",
    difficulty: 1,
    effort: "About 20–40 min · estimate",
    approval: "No separate review for registration. Organization access can need an owner’s approval.",
    summary:
      "Creating an OAuth app is mostly a short form. First decide whether a GitHub App is a better fit: GitHub recommends GitHub Apps for many integrations that need fine-grained repository access or installation-based behavior.",
    managedAuth:
      "Composio lists GitHub among its managed OAuth apps. Use that if its branding, scopes, and shared quota fit. Register your own app for your own consent-screen identity, different scopes, or dedicated quota.",
    prerequisites: [
      "A GitHub personal account, or admin access to the organization that will own the app.",
      "A public-facing app name and homepage URL.",
      "Your application’s HTTPS callback URL (localhost can be used during development).",
      "A short list of the minimum OAuth scopes your integration needs.",
    ],
    steps: [
      { title: "Choose OAuth App or GitHub App", description: "Use an OAuth App when the integration acts on behalf of a user. Consider a GitHub App for fine-grained repository permissions, installations, or actions that can run independently of a user.", owner: "both" },
      { title: "Open Developer settings", description: "In GitHub, go to Settings → Developer settings → OAuth Apps → New OAuth App. Register it under your personal account or an organization where you are an administrator.", owner: "you" },
      { title: "Enter app details", description: "Provide the application name and homepage URL, then enter the authorization callback URL. You can register up to 10 callback URLs.", owner: "both" },
      { title: "Create the app and protect its secret", description: "Register the application, copy the client ID, and generate or retrieve the client secret. Store the secret on your server and configure the authorization flow with state and the exact callback URL.", owner: "you" },
      { title: "Test with the right account", description: "Authorize a test account using only the scopes you need. If the integration will access organization resources, ask an organization owner whether OAuth app restrictions require approval.", owner: "both" },
    ],
    blockers: [
      "OAuth Apps act on behalf of a user and can request broad scopes; GitHub Apps offer more granular repository permissions.",
      "An organization may restrict third-party OAuth apps. An organization owner may need to review and approve access.",
      "GitHub warns that callback wildcard matching can expose authorization codes; keep callback URLs exact unless there is a clear need.",
    ],
    agentCan: ["Compare OAuth App vs GitHub App for your use case.", "Draft the homepage and callback URL checklist.", "Map the minimum scopes to the actions your integration needs."],
    youMust: ["Create the registration in the correct account or organization.", "Keep the client secret private and configure it in your backend.", "Ask an organization owner to approve access when policy requires it."],
    uncertainty: ["The 20–40 minute setup estimate is an implementation estimate, not a GitHub commitment.", "Organization-owner approval timing depends on that organization."],
    sources: [
      { title: "Create an OAuth app", url: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app", kind: "official" },
      { title: "GitHub Apps vs. OAuth apps", url: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps", kind: "official" },
      { title: "OAuth app access restrictions", url: "https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/about-oauth-app-access-restrictions", kind: "official" },
      { title: "Approve OAuth apps for an organization", url: "https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization", kind: "official" },
      managedAuthSource,
    ],
    lastChecked: "November 3, 2026",
  },
  {
    id: "slack",
    slug: "slack",
    name: "Slack",
    vendor: "Salesforce, Inc.",
    tagline: "Unlisted distribution can come before Marketplace review.",
    category: "Communication",
    mark: "#",
    markColor: "#611f69",
    difficulty: 3,
    effort: "About 2–4 hours · estimate",
    approval: "Unlisted distribution: no Marketplace listing review. Marketplace: preliminary feedback up to 10 business days; functional review up to 10 weeks for new submissions (estimate).",
    summary:
      "A Slack app starts in one workspace. To let other workspaces install it, configure OAuth and enable public distribution. Marketplace listing is a separate review step; it is not required for an unlisted pilot.",
    managedAuth:
      "Composio lists Slack as a managed OAuth toolkit. Use managed auth if its scopes, shared quota, and consent branding work for your product. A custom app is useful for your own consent experience, additional scopes, or a dedicated quota.",
    prerequisites: [
      "A Slack workspace where you can create and test an app.",
      "A public HTTPS redirect URL and a server endpoint to exchange OAuth codes.",
      "A clear list of bot and user scopes. Request only what your app needs.",
      "For Marketplace listing: a finished public product, support contact, test plan, and access to at least 10 active workspaces.",
    ],
    steps: [
      { title: "Create an app in a development workspace", description: "Create the Slack app and configure its name, redirect URL, and OAuth scopes in the app settings.", owner: "you" },
      { title: "Build and test the OAuth flow", description: "Send users to Slack’s authorization page, include and validate a state value, handle the callback, and exchange the code on your server. Test install, use, and uninstall.", owner: "both" },
      { title: "Enable public distribution", description: "Complete the Manage Distribution checklist, then activate public distribution to get an install URL or Add to Slack button for other workspaces.", owner: "you" },
      { title: "Run an unlisted pilot", description: "Share the install flow with pilot workspaces. Workspace admins may still screen or approve installation requests based on their policies.", owner: "both" },
      { title: "Decide whether Marketplace listing is needed", description: "For broader commercial discovery, prepare a listing and submit only after the app is fully functional and tested on 10 or more active workspaces.", owner: "you" },
    ],
    blockers: [
      "An app that has not enabled distribution is limited to its development workspace.",
      "Marketplace review is separate from unlisted distribution and can involve a long wait; incomplete submissions can restart the queue.",
      "Workspace or Enterprise Grid administrators can require approval for installs or requested scopes.",
    ],
    agentCan: ["Draft the OAuth scope list from your intended actions.", "Prepare the distribution checklist and Marketplace evidence list.", "Review your install flow for missing state validation or mismatched redirect URLs."],
    youMust: ["Create and configure the app in a Slack workspace.", "Implement and operate the callback endpoint and keep the client secret private.", "Test with external workspaces and submit a Marketplace listing if you choose that route."],
    uncertainty: ["The 2–4 hour implementation estimate is a planning estimate, not a Slack commitment.", "Slack’s published review windows are estimates and may change; verify the current Marketplace review guide before submission."],
    sources: [
      { title: "Installing with OAuth", url: "https://docs.slack.dev/authentication/installing-with-oauth/", kind: "official" },
      { title: "App lifecycle and distribution", url: "https://docs.slack.dev/app-management/distribution/", kind: "official" },
      { title: "Slack Marketplace review process", url: "https://docs.slack.dev/slack-marketplace/slack-marketplace-review-guide/", kind: "official" },
      managedAuthSource,
    ],
    lastChecked: "November 3, 2026",
  },
  {
    id: "google",
    slug: "google",
    name: "Google",
    vendor: "Google LLC",
    tagline: "Scope choice shapes verification, testing, and launch constraints.",
    category: "Productivity",
    mark: "G",
    markColor: "#4285f4",
    difficulty: 5,
    effort: "About 3–6 hours for setup · estimate",
    approval: "Brand verification is usually a few minutes automatically; manual review typically takes 2–3 business days. Sensitive or restricted-scope review can add more time; no single end-to-end ETA applies.",
    summary:
      "Google setup begins with choosing the APIs and OAuth scopes. Internal testing can start before public verification, but production availability, consent-screen branding, and sensitive data access can bring additional verification requirements.",
    managedAuth:
      "Composio provides managed OAuth for many Google toolkits. Check the specific toolkit’s scopes and managed-auth status first. Bring your own client when you need a different consent-screen brand, scopes, quota, or custom configuration.",
    prerequisites: [
      "A Google Cloud project with the exact APIs your app needs enabled.",
      "A verified domain, public homepage, and privacy policy for a public branded consent screen.",
      "A web application callback URL and a secure server for the OAuth client secret.",
      "A list of the minimum scopes, classified as non-sensitive, sensitive, or restricted.",
    ],
    steps: [
      { title: "Choose APIs and minimum scopes", description: "Enable only the Google APIs you need. Review the scope classifications because sensitive and restricted scopes can require additional verification.", owner: "both" },
      { title: "Configure the consent screen", description: "Set up the app name, audience, support email, authorized domains, homepage, privacy policy, and terms. Verify domain ownership where required.", owner: "you" },
      { title: "Create a Web application OAuth client", description: "In Google Cloud, create the OAuth client and enter the exact authorized redirect URI used by your server callback.", owner: "you" },
      { title: "Test with an allowlisted user", description: "External apps in Testing are limited to listed test users. Validate consent and refresh-token behavior before relying on testing credentials for longer-running workflows.", owner: "both" },
      { title: "Submit the required verification", description: "For a public branded app, verify the brand. If requested scopes require sensitive or restricted-scope review, prepare a clear use-case explanation, demo, and any required security materials.", owner: "you" },
    ],
    blockers: [
      "Testing-mode refresh tokens for external apps typically expire after 7 days unless only basic identity scopes are requested.",
      "Sensitive or restricted scopes raise the evidence and review burden; requesting fewer scopes can reduce it.",
      "A manual brand review is commonly 2–3 business days, but that is only one part of verification. Scope review timing depends on the app and can take longer.",
      "Workspace policies can prevent users from authorizing an app even after its configuration is complete.",
    ],
    agentCan: ["Map requested product actions to candidate Google scopes.", "Draft the consent-screen content and verification checklist.", "Prepare a reviewer walkthrough and identify missing public URLs."],
    youMust: ["Own the Cloud project and verify the domain.", "Create and secure OAuth credentials.", "Explain your data use and submit provider verification; answer reviewer follow-ups."],
    uncertainty: ["The 3–6 hour setup estimate excludes app-specific security assessments and review cycles.", "Brand verification timing does not predict total approval time for sensitive or restricted scopes.", "Google’s requirements vary by API, scope, user type, and intended audience."],
    sources: [
      { title: "OAuth 2.0 for Web Server Applications", url: "https://developers.google.com/identity/protocols/oauth2/web-server", kind: "official" },
      { title: "Brand verification", url: "https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification", kind: "official" },
      { title: "OAuth policy compliance", url: "https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance", kind: "official" },
      { title: "OAuth app state overview", url: "https://developers.google.com/identity/protocols/oauth2/production-readiness/overview", kind: "official" },
      managedAuthSource,
    ],
    lastChecked: "November 3, 2026",
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
