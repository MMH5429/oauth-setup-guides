import { NextResponse } from "next/server";
import { getSavedGuide } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{20,40}$/i.test(id)) return NextResponse.json({ error: "This generated guide could not be found." }, { status: 404 });
  try {
    const guide = await getSavedGuide(id);
    if (!guide) return NextResponse.json({ error: "This generated guide could not be found." }, { status: 404 });
    return NextResponse.json({ guide }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("OAuth guide retrieval failed:", error);
    return NextResponse.json({ error: "This guide could not be loaded. Check the storage configuration." }, { status: 503 });
  }
}
