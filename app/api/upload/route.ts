import { createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createServiceClient();

  // Verifiera auth via vanlig klient
  const authSupabase = await createServiceClient(); // service role kan läsa auth
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const bucket = (formData.get("bucket") as string) || "documents";
  const path = formData.get("path") as string;

  if (!file) return NextResponse.json({ error: "Ingen fil" }, { status: 400 });
  if (!path) return NextResponse.json({ error: "Ingen sökväg" }, { status: 400 });

  const filePath = `${path}/${Date.now()}_${file.name}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return NextResponse.json({ url: urlData.publicUrl, path: filePath });
}