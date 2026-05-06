import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });

  // Kontrollera roll
  const { data: profile } = await supabase.from("profiles").select("role, name").eq("id", user.id).single();
  if (!profile || (profile.role !== "admin" && profile.role !== "styrelse")) {
    return NextResponse.json({ error: "Behörighet saknas" }, { status: 403 });
  }

  const body = await request.json();
  const { data, error } = await supabase.from("posts").insert({
    title: body.title,
    content: body.content,
    is_urgent: body.is_urgent || false,
    is_public: body.is_public || false,
    author_id: user.id,
    author_name: profile.name,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}