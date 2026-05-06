import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code === "PGRST116") {
    // Ingen post finns än, returnera defaults
    return NextResponse.json({
      news_updates: true,
      issue_updates: true,
      meeting_notices: true,
      maintenance_updates: false,
      fee_reminders: true,
    });
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });

  const body = await request.json();
  const { data, error } = await supabase
    .from("notification_preferences")
    .upsert({
      user_id: user.id,
      news_updates: body.news_updates ?? true,
      issue_updates: body.issue_updates ?? true,
      meeting_notices: body.meeting_notices ?? true,
      maintenance_updates: body.maintenance_updates ?? false,
      fee_reminders: body.fee_reminders ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}