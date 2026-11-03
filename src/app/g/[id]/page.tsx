"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GuideDetail } from "@/components/guide-detail";
import type { OAuthGuide } from "@/lib/guides";

export default function GeneratedGuidePage({ params }: { params: Promise<{ id: string }> }) {
  const [guide, setGuide] = useState<OAuthGuide | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    void params.then(({ id }) => fetch("/api/guides/" + encodeURIComponent(id)).then(async (response) => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "This generated guide could not be found.");
      if (active) setGuide(result.guide);
    }).catch((caught: unknown) => {
      if (active) setError(caught instanceof Error ? caught.message : "This generated guide could not be found.");
    }));
    return () => { active = false; };
  }, [params]);
  if (guide) return <GuideDetail guide={guide} />;
  return <main className="loading-page"><header className="topbar"><Link className="brand" href="/"><span className="brand-symbol">C</span><span>composio<span className="brand-light"> / guides</span></span></Link></header><div className="loading-card"><span className="loading-orb">{error ? "!" : "✳"}</span><h1>{error ? "Guide unavailable" : "Opening your guide…"}</h1><p>{error || "Fetching the saved research and its sources."}</p>{error && <Link className="primary-button" href="/">Back to the library <span>→</span></Link>}</div></main>;
}
