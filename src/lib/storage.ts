import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { OAuthGuide } from "@/lib/guides";

function supabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
}

export async function saveGuide(guide: OAuthGuide): Promise<void> {
  const supabase = supabaseClient();
  if (supabase) {
    const { error } = await supabase.from("generated_guides").upsert({ id: guide.id, guide, created_at: new Date().toISOString() });
    if (error) throw new Error("Could not save this guide. Check the Supabase table setup.");
    return;
  }
  const dir = path.join(process.cwd(), ".data");
  const file = path.join(dir, "generated-guides.json");
  await mkdir(dir, { recursive: true });
  let existing: Record<string, OAuthGuide> = {};
  try { existing = JSON.parse(await readFile(file, "utf8")) as Record<string, OAuthGuide>; } catch { /* first local save */ }
  existing[guide.id] = guide;
  await writeFile(file, JSON.stringify(existing, null, 2), "utf8");
}

export async function getSavedGuide(id: string): Promise<OAuthGuide | null> {
  const supabase = supabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from("generated_guides").select("guide").eq("id", id).maybeSingle();
    if (error) throw new Error("Could not load this guide from Supabase.");
    return (data?.guide as OAuthGuide | undefined) ?? null;
  }
  const file = path.join(process.cwd(), ".data", "generated-guides.json");
  try {
    const saved = JSON.parse(await readFile(file, "utf8")) as Record<string, OAuthGuide>;
    return saved[id] ?? null;
  } catch { return null; }
}

export async function listSavedGuides(): Promise<OAuthGuide[]> {
  const supabase = supabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from("generated_guides").select("guide, created_at").order("created_at", { ascending: false });
    if (error) throw new Error("Could not list saved guides from Supabase.");
    return (data || []).map((row) => row.guide as OAuthGuide).filter((guide) => guide?.generated);
  }
  const file = path.join(process.cwd(), ".data", "generated-guides.json");
  try {
    const saved = JSON.parse(await readFile(file, "utf8")) as Record<string, OAuthGuide>;
    return Object.values(saved).filter((guide) => guide?.generated).reverse();
  } catch { return []; }
}
