import { LibraryClient } from "@/components/library-client";
import { guides } from "@/lib/guides";

export default function Home() {
  return <LibraryClient guides={guides} />;
}
