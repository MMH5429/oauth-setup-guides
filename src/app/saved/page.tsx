import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import type { OAuthGuide } from "@/lib/guides";
import { listSavedGuides } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function SavedGuidesPage() {
  let generatedGuides: OAuthGuide[] = [];
  let loadError = "";
  try { generatedGuides = await listSavedGuides(); }
  catch { loadError = "Saved guides could not be loaded. Check the storage configuration."; }

  return <main>
    <header className="topbar">
      <Link className="brand" href="/" aria-label="OAuth Setup Guides home"><span className="brand-symbol">C</span><span>composio<span className="brand-light"> / guides</span></span></Link>
      <nav className="topnav" aria-label="Main navigation"><Link href="/#library">Guide library</Link><Link href="/#research" className="nav-cta">Research an app <span aria-hidden="true">↗</span></Link></nav>
    </header>
    <section className="saved-page page-shell">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><span>Saved guides</span></div>
      <div className="saved-guide-heading saved-page-heading"><div><div className="eyebrow muted">YOUR RESEARCH</div><h1>Saved guides</h1><p>Every guide you generate is kept here so you can return to it without researching again.</p></div><span className="saved-page-count">{String(generatedGuides.length).padStart(2, "0")} GUIDES</span></div>
      {loadError ? <div className="saved-guides-empty" role="alert"><p>{loadError}</p></div> : generatedGuides.length ? <div className="guide-grid">{generatedGuides.map((guide) => <GuideCard key={guide.id} guide={guide} />)}</div> : <div className="saved-guides-empty"><span>✳</span><h2>No generated guides yet</h2><p>Research an app and its saved guide will appear here.</p><Link className="primary-button" href="/#research">Research an app <span>→</span></Link></div>}
    </section>
    <footer className="footer page-shell"><Link className="brand" href="/"><span className="brand-symbol">C</span><span>composio<span className="brand-light"> / guides</span></span></Link><span>Know the path. Ship with confidence.</span><Link href="/">Back to the library ↑</Link></footer>
  </main>;
}
