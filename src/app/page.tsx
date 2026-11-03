import { LibraryClient } from "@/components/library-client";
import { guides } from "@/lib/guides";
import { listSavedGuides } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const generatedGuides = await listSavedGuides();
  return <LibraryClient guides={guides} generatedGuides={generatedGuides} />;
}
