import { createClient } from "@/lib/supabase/server";
import { sendMeetingNotice, sendFeeReminder, sendIssueNotification } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== "admin" && profile.role !== "styrelse")) {
    return NextResponse.json({ error: "Behörighet saknas" }, { status: 403 });
  }

  const body = await request.json();
  const { type, data: notifyData } = body;

  // Hämta mottagare baserat på typ och deras notisinställningar
  let recipients: { email: string; name: string }[] = [];

  if (type === "meeting") {
    const { data: prefs } = await supabase
      .from("notification_preferences")
      .select("user_id, meeting_notices")
      .eq("meeting_notices", true);

    if (prefs && prefs.length > 0) {
      const userIds = prefs.map((p: any) => p.user_id);
      const { data: members } = await supabase
        .from("profiles")
        .select("id, email, name")
        .in("id", userIds);
      recipients = members || [];
    }
  } else if (type === "fee_reminder") {
    const { data: prefs } = await supabase
      .from("notification_preferences")
      .select("user_id, fee_reminders")
      .eq("fee_reminders", true);

    if (prefs && prefs.length > 0) {
      const userIds = prefs.map((p: any) => p.user_id);
      // Bara obetalda
      const { data: members } = await supabase
        .from("profiles")
        .select("id, email, name, has_paid_fee")
        .in("id", userIds)
        .eq("has_paid_fee", false);
      recipients = members || [];
    }
  } else if (type === "issue") {
    const { data: prefs } = await supabase
      .from("notification_preferences")
      .select("user_id, issue_updates")
      .eq("issue_updates", true);

    if (prefs && prefs.length > 0) {
      const userIds = prefs.map((p: any) => p.user_id);
      const { data: members } = await supabase
        .from("profiles")
        .select("id, email, name")
        .in("id", userIds);
      recipients = members || [];
    }
  }

  if (recipients.length === 0) {
    return NextResponse.json({ sent: 0, message: "Inga mottagare" });
  }

  const results = [];

  for (const r of recipients) {
    try {
      if (type === "meeting") {
        await sendMeetingNotice(
          r.email, r.name,
          notifyData.title, notifyData.date, notifyData.time, notifyData.location
        );
      } else if (type === "fee_reminder") {
        await sendFeeReminder(
          r.email, r.name,
          notifyData.amount, notifyData.dueDate
        );
      } else if (type === "issue") {
        await sendIssueNotification(
          r.email, notifyData.category, notifyData.description
        );
      }
      results.push({ email: r.email, status: "sent" });
    } catch (err: any) {
      results.push({ email: r.email, status: "failed", error: err.message });
    }
  }

  const sent = results.filter((r) => r.status === "sent").length;
  const failed = results.filter((r) => r.status === "failed").length;

  return NextResponse.json({ sent, failed, results });
}