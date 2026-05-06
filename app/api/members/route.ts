import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  // Alla inloggade ser medlemmar, men med begränsade fält för vanliga medlemmar
  const query = supabase.from("profiles").select("*").order("property_designation");
  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Begränsa fält för vanliga medlemmar
  if (profile?.role === "medlem") {
    const limited = data?.map(({ id, name, property_designation, share_value, has_paid_fee }: any) => ({
      id, name, property_designation, share_value, has_paid_fee,
    }));
    return NextResponse.json(limited);
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Behörighet saknas" }, { status: 403 });
  }

  const body = await request.json();
  const { id, ...updates } = body;
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}