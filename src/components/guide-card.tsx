import Link from "next/link";
import type { OAuthGuide } from "@/lib/guides";

export function GuideCard({ guide }: { guide: OAuthGuide }) {
  const effort = guide.effort.split(" · ")[0];
  const approval = guide.approval.split(".")[0];
  const difficultyText = guide.difficulty <= 2 ? "SMOOTH SAILING" : guide.difficulty <= 3 ? "SOME STEPS" : "MORE INVOLVED";
  const href = guide.generated ? "/g/" + guide.id : "/guides/" + guide.slug;

  return <Link href={href} className="guide-card">
    <div className="guide-card-head"><div className="provider-mark" style={{ backgroundColor: guide.markColor }}>{guide.mark}</div><span className="difficulty"><span>{"●".repeat(guide.difficulty)}<i>{"●".repeat(5 - guide.difficulty)}</i></span><small>{difficultyText}</small></span></div>
    <div className="guide-card-copy"><div className="provider-vendor">{guide.vendor}{guide.generated ? " · LIVE RESEARCH" : ""}</div><h3>{guide.name}<span aria-hidden="true">↗</span></h3><p>{guide.tagline}</p></div>
    <div className="guide-card-meta"><span><small>SETUP</small><b>{effort}</b></span><span className="meta-divider" /><span><small>APPROVAL</small><b>{approval}</b></span></div>
    <div className="guide-card-foot"><span>{guide.category}</span><span className="open-guide">Read guide <b>→</b></span></div>
  </Link>;
}
