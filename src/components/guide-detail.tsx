"use client";

import Link from "next/link";
import { useState } from "react";
import type { OAuthGuide } from "@/lib/guides";

export function GuideDetail({ guide }: { guide: OAuthGuide }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this guide link", window.location.href);
    }
  }
  return <main className="guide-page">
    <header className="topbar"><Link className="brand" href="/"><span className="brand-symbol">C</span><span>composio<span className="brand-light"> / guides</span></span></Link><nav className="topnav"><Link href="/#library">All guides</Link><a className="nav-cta" href="https://docs.composio.dev/toolkits/managed-auth" target="_blank" rel="noreferrer">Managed auth <span>↗</span></a></nav></header>
    <div className="guide-hero page-shell">
      <div className="breadcrumbs"><Link href="/">Library</Link><span>/</span><span>{guide.name}</span></div>
      <div className="guide-hero-layout">
        <div className="guide-title-block"><div className="guide-brandline"><div className="provider-mark large" style={{ backgroundColor: guide.markColor }}>{guide.mark}</div><span className="category-badge">{guide.category}</span>{guide.generated && <span className="generated-badge">✳ LIVE RESEARCH</span>}</div><h1>{guide.name}<span> OAuth setup guide</span></h1><p>{guide.summary}</p><div className="guide-title-actions"><button className="share-button" onClick={share}>{copied ? "✓ Link copied" : "↗ Share this guide"}</button><span className="checked-date">Sources checked {guide.lastChecked}</span></div></div>
        <div className="difficulty-panel"><div className="difficulty-panel-top"><span>SETUP COMPLEXITY</span><b>{guide.difficulty}<small> / 5</small></b></div><div className="complexity-bars">{[1,2,3,4,5].map((n) => <i key={n} className={n <= guide.difficulty ? "filled" : ""} />)}</div><div className="complexity-label">{guide.difficulty <= 2 ? "Straightforward" : guide.difficulty <= 3 ? "Some moving parts" : "More involved"}</div><div className="metric-divider" /><div className="metric-row"><span>Hands-on setup</span><b>{guide.effort}</b></div><div className="metric-row"><span>Provider wait</span><b>{guide.approval}</b></div></div>
      </div>
    </div>
    <div className="page-shell guide-content-grid">
      <aside className="guide-toc"><div className="toc-label">IN THIS GUIDE</div><a href="#before-you-start">Before you start</a><a href="#setup-steps">Setup steps</a><a href="#blockers">What can slow you down</a><a href="#handoff">Who does what</a><a href="#sources">Sources & confidence</a><div className="toc-nudge"><span>✳</span><p>New app?<br /><Link href="/#research">Research it live →</Link></p></div></aside>
      <div className="guide-main-content">
        <section className="managed-callout"><div className="callout-icon">◎</div><div><div className="callout-kicker">FIRST, CHECK THE SHORTCUT</div><h2>Do you need your own OAuth app?</h2><p>{guide.managedAuth}</p><a href="https://docs.composio.dev/toolkits/managed-auth" target="_blank" rel="noreferrer">Check Composio managed auth <span>↗</span></a></div></section>
        <section className="guide-section" id="before-you-start"><div className="section-kicker">01 — GET READY</div><h2>Before you start</h2><p className="section-intro">Gather these pieces first. It keeps setup from turning into a scavenger hunt.</p><div className="prereq-list">{guide.prerequisites.map((item, i) => <div className="prereq-item" key={item}><span className="prereq-check">{String(i + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div></section>
        <section className="guide-section" id="setup-steps"><div className="section-kicker">02 — THE PATH</div><h2>Get your app ready</h2><p className="section-intro">A practical order to work through. The labels show when the agent can prepare and when you need to act.</p><div className="steps-list">{guide.steps.map((step, i) => <article className="step-item" key={step.title}><div className="step-rail"><span>{String(i + 1).padStart(2, "0")}</span>{i !== guide.steps.length - 1 && <i />}</div><div className="step-body"><div className="step-title-row"><h3>{step.title}</h3><OwnerTag owner={step.owner} /></div><p>{step.description}</p></div></article>)}</div></section>
        <section className="blocker-section" id="blockers"><div className="section-kicker">03 — EXPECT THE SNAGS</div><h2>What could slow you down</h2><div className="blocker-list">{guide.blockers.map((blocker) => <div className="blocker-item" key={blocker}><span>!</span><p>{blocker}</p></div>)}</div></section>
        <section className="guide-section handoff-section" id="handoff"><div className="section-kicker">04 — SHARED WORK</div><h2>What the agent can do — and what’s yours</h2><div className="handoff-columns">
          <div className="handoff-card agent"><div className="handoff-card-head"><span>✳</span><div><small>AGENT CAN</small><b>Research & prepare</b></div></div><ul>{guide.agentCan.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="handoff-card human"><div className="handoff-card-head"><span>↗</span><div><small>YOU TAKE OVER</small><b>Accounts & approval</b></div></div><ul>{guide.youMust.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div></section>
        <section className="evidence-section" id="sources"><div className="section-kicker">05 — CHECK THE EVIDENCE</div><h2>Sources & confidence</h2><p className="section-intro">Provider policies can change. Follow the official links before you submit anything.</p><div className="source-list">{guide.sources.map((source, i) => <a key={source.url + String(i)} href={source.url} target="_blank" rel="noreferrer" className="source-row"><span className="source-number">{String(i + 1).padStart(2, "0")}</span><span>{source.title}<small>{source.kind === "community" ? "COMMUNITY SOURCE" : "OFFICIAL DOCUMENTATION"}</small></span><b>↗</b></a>)}</div>
          <div className="uncertainty-box"><span>◌</span><div><b>What we can’t promise</b><ul>{guide.uncertainty.map((item) => <li key={item}>{item}</li>)}</ul><small>{guide.generated ? "AI-generated research — verify critical requirements with the provider." : "Research checked against linked sources; account setup and provider review were not completed."}</small></div></div>
        </section>
        <div className="guide-bottom-cta"><div><span className="eyebrow">KEEP THE MOMENTUM</span><h2>Need another app’s path?</h2><p>Research a provider and make a guide you can share.</p></div><Link href="/#research" className="primary-button">Research an app <span>→</span></Link></div>
      </div>
    </div>
    <footer className="footer page-shell"><Link className="brand" href="/"><span className="brand-symbol">C</span><span>composio<span className="brand-light"> / guides</span></span></Link><span>Know the path. Ship with confidence.</span><Link href="/#library">Back to library ↑</Link></footer>
  </main>;
}

function OwnerTag({ owner }: { owner: "you" | "agent" | "both" }) {
  const label = owner === "you" ? "YOU" : owner === "agent" ? "AGENT" : "TOGETHER";
  const icon = owner === "agent" ? "✳ " : owner === "you" ? "↗ " : "◎ ";
  return <span className={"owner-tag owner-" + owner}>{icon}{label}</span>;
}
