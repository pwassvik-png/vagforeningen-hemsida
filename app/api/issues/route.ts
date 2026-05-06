import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });

  const { data, error } = await supabase
    .from("issues")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("name").eq("id", user.id).single();

  const body = await request.json();
  const { data, error } = await supabase.from("issues").insert({
    user_id: user.id,
    user_name: profile?.name || "Okänd",
    category: body.category,
    description: body.description,
    location: body.location || null,
    latitude: body.latitude || null,
    longitude: body.longitude || null,
    status: "Mottagen",
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== "admin" && profile.role !== "styrelse")) {
    return NextResponse.json({ error: "Behörighet saknas" }, { status: 403 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("issues")
    .update({ status: body.status })
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}