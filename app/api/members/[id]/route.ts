import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });

  const { id } = await params;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  // Användare kan bara uppdatera sin egen profil, om de inte är admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (user.id !== id && profile?.role !== "admin") {
    return NextResponse.json({ error: "Behörighet saknas" }, { status: 403 });
  }

  const { data, error } = await supabase.from("profiles").update(body).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}