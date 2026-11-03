"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { OAuthGuide } from "@/lib/guides";
import { GuideCard } from "@/components/guide-card";

const categories = ["All guides", "Developer tools", "Communication", "Productivity", "Other"] as const;

export function LibraryClient({ guides, generatedGuides: initialGeneratedGuides }: { guides: OAuthGuide[]; generatedGuides: OAuthGuide[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All guides");
  const [generatedGuides, setGeneratedGuides] = useState(initialGeneratedGuides);
  const [appInput, setAppInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);
  useEffect(() => {
    let active = true;
    async function refreshSavedGuides() {
      try {
        const response = await fetch("/api/guides", { cache: "no-store" });
        if (!response.ok) return;
        const result = await response.json() as { guides?: OAuthGuide[] };
        if (!active || !Array.isArray(result.guides)) return;
        setGeneratedGuides((current) => {
          const loadedIds = new Set(result.guides?.map((guide) => guide.id));
          return [...current.filter((guide) => !loadedIds.has(guide.id)), ...result.guides!];
        });
      } catch { /* keep the server-rendered and locally added guides visible */ }
    }
    void refreshSavedGuides();
    window.addEventListener("focus", refreshSavedGuides);
    window.addEventListener("pageshow", refreshSavedGuides);
    return () => {
      active = false;
      window.removeEventListener("focus", refreshSavedGuides);
      window.removeEventListener("pageshow", refreshSavedGuides);
    };
  }, []);
  const visibleGuides = useMemo(() => guides.filter((guide) => {
    const searchable = [guide.name, guide.vendor, guide.tagline, guide.category].join(" ").toLowerCase();
    return searchable.includes(query.toLowerCase()) && (activeCategory === "All guides" || guide.category === activeCategory);
  }), [guides, query, activeCategory]);
  const visibleGeneratedGuides = useMemo(() => generatedGuides.filter((guide) => {
    const searchable = [guide.name, guide.vendor, guide.tagline, guide.category].join(" ").toLowerCase();
    return searchable.includes(query.toLowerCase()) && (activeCategory === "All guides" || guide.category === activeCategory);
  }), [generatedGuides, query, activeCategory]);

  async function generateGuide(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (appInput.trim().length < 2) { setError("Enter an app name or website to get started."); return; }
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/guides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ app: appInput.trim() }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn’t research that app right now.");
      if (result.guide) setGeneratedGuides((current) => [result.guide, ...current.filter((guide) => guide.id !== result.guide.id)]);
      router.push("/g/" + encodeURIComponent(result.id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <main>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="OAuth Setup Guides home"><span className="brand-symbol">C</span><span>composio<span className="brand-light"> / guides</span></span></Link>
        <nav className="topnav" aria-label="Main navigation"><a href="#library">Guides</a><Link href="/saved">Saved ({generatedGuides.length})</Link><a href="#how-it-works">How it works</a><a className="nav-cta" href="#research">Research an app <span aria-hidden="true">↗</span></a></nav>
      </header>

      <section className="hero-wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> THE OAUTH FIELD GUIDE</div>
          <h1>Get connected.<br /><span>Know what comes next.</span></h1>
          <p className="hero-subtitle">Clear, practical guides for getting an OAuth app ready to ship — with real requirements, honest timelines, and a hand when you need one.</p>
          <a className="text-link" href="#library">Explore the guides <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="orbit-node node-top">AUTH</div><div className="orbit-node node-bottom">SHIP</div>
          <div className="core-card"><div className="core-lock">◈</div><div className="core-label">YOUR INTEGRATION</div><div className="core-line" /><div className="core-caption">from first setup<br />to first connection</div></div>
          <div className="float-card float-left"><span className="float-check">✓</span><span>Requirements<br /><b>made clear</b></span></div>
          <div className="float-card float-right"><span className="float-clock">◷</span><span>Know your<br /><b>time to launch</b></span></div>
        </div>
      </section>

      <section className="trust-strip" aria-label="What each guide covers">
        <div><span className="trust-icon">↗</span><b>Clear next steps</b><small>Know where to start</small></div>
        <div><span className="trust-icon">◷</span><b>Honest timelines</b><small>Effort and review, apart</small></div>
        <div><span className="trust-icon">◎</span><b>Source-backed</b><small>Know what’s verified</small></div>
        <div><span className="trust-icon">✳</span><b>Agent-ready</b><small>See who does what</small></div>
      </section>

      <section className="library-section page-shell" id="library">
        <div className="section-heading"><div><div className="eyebrow muted">THE LIBRARY</div><h2>Pick up where you are.</h2><p>Start with a provider guide, or tell us what app you’re working with.</p></div><div className="library-count"><b>{String(guides.length).padStart(2, "0")}</b><span>FIELD-TESTED<br />STARTING POINTS</span></div></div>
        <div className="filter-row">
          <label className="search-box"><span aria-hidden="true">⌕</span><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search apps or requirements" aria-label="Search guides" /><kbd>⌘ K</kbd></label>
          <div className="category-tabs" role="tablist" aria-label="Filter by category">{categories.map((category) => <button key={category} role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? "category-tab active" : "category-tab"} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
        </div>
        <div className="guide-grid">
          {visibleGuides.map((guide) => <GuideCard key={guide.id} guide={guide} />)}
          <article className="research-card" id="research">
            <div className="research-card-top"><span className="sparkle">✳</span><span className="new-pill">LIVE RESEARCH</span></div>
            <h3>Looking for something else?</h3>
            <p>Drop in an app name or URL. The research agent will trace the real setup path and build you a guide with sources.</p>
            <form onSubmit={generateGuide} className="research-form">
              <label className="sr-only" htmlFor="app-input">App name or website</label>
              <input id="app-input" value={appInput} onChange={(event) => setAppInput(event.target.value)} maxLength={200} placeholder="e.g. Linear or linear.app" disabled={pending} />
              <button type="submit" disabled={pending}>{pending ? <><span className="button-spinner" /> Researching</> : <>Build my guide <span aria-hidden="true">→</span></>}</button>
            </form>
            {error && <div className="form-error" role="alert">{error}</div>}
            <div className="research-foot"><span>◷ Usually takes about a minute</span><span>↗ Sources included</span></div>
          </article>
        </div>
        {visibleGuides.length === 0 && visibleGeneratedGuides.length === 0 && <div className="empty-state"><span>⌕</span><h3>No guides match that search</h3><p>Try another app name or clear your filters.</p><button className="quiet-button" onClick={() => { setQuery(""); setActiveCategory("All guides"); }}>Clear filters</button></div>}
        <section className="saved-guide-section" id="saved-guides">
          <div className="saved-guide-heading"><div><div className="eyebrow muted">YOUR RESEARCH</div><h2>Saved guides</h2><p>Guides you’ve generated stay here, ready to open again.</p></div><Link href="/saved" className="text-link">View all <span aria-hidden="true">→</span></Link></div>
          {visibleGeneratedGuides.length > 0 ? <div className="guide-grid">{visibleGeneratedGuides.map((guide) => <GuideCard key={guide.id} guide={guide} />)}</div> : generatedGuides.length === 0 ? <div className="saved-guides-empty"><span>✳</span><p>Your researched guides will appear here after you build one.</p></div> : <div className="saved-guides-empty"><p>No saved guides match the current search or category.</p></div>}
        </section>
      </section>

      <section className="why-section" id="how-it-works"><div className="page-shell why-inner">
        <div className="why-copy"><div className="eyebrow muted">A BETTER PLACE TO START</div><h2>Not every integration needs your own OAuth app.</h2><p>Composio’s managed auth can get users connecting without you registering a provider app. Bring your own only when your product needs a different brand, scopes, quota, or setup.</p><a href="https://docs.composio.dev/toolkits/managed-auth" target="_blank" rel="noreferrer" className="text-link">Understand managed auth <span>↗</span></a></div>
        <div className="decision-card">
          <div className="decision-step"><div className="decision-number">01</div><div><b>Can managed auth do the job?</b><span>Check the provider, scopes, and consent branding.</span></div><i>→</i></div><div className="decision-connector" />
          <div className="decision-step"><div className="decision-number">02</div><div><b>Need your own app?</b><span>Follow the provider’s setup and approval path.</span></div><i>→</i></div><div className="decision-connector" />
          <div className="decision-step"><div className="decision-number done">03</div><div><b>Ready for users to connect</b><span>Know what you can automate — and what you own.</span></div><i>✓</i></div>
        </div>
      </div></section>
      <footer className="footer page-shell"><Link className="brand" href="/"><span className="brand-symbol">C</span><span>composio<span className="brand-light"> / guides</span></span></Link><span>Know the path. Ship with confidence.</span><a href="https://docs.composio.dev/toolkits/managed-auth" target="_blank" rel="noreferrer">Managed auth docs ↗</a></footer>
    </main>
  );
}
