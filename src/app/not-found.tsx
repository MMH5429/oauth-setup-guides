import Link from "next/link";

export default function NotFound() {
  return <main className="loading-page"><header className="topbar"><Link className="brand" href="/"><span className="brand-symbol">C</span><span>composio<span className="brand-light"> / guides</span></span></Link></header><div className="loading-card"><span className="loading-orb">?</span><h1>We couldn’t find that guide.</h1><p>It may have moved, or the link may be incomplete.</p><Link className="primary-button" href="/">Back to the library <span>→</span></Link></div></main>;
}
