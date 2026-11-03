import { notFound } from "next/navigation";
import { GuideDetail } from "@/components/guide-detail";
import { getGuideBySlug, guides } from "@/lib/guides";

export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();
  return <GuideDetail guide={guide} />;
}
