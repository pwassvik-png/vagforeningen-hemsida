"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Meeting } from "@/types";
import { Calendar, Plus, X, Send } from "lucide-react";

const MEETING_TYPES = [
  { value: "annual", label: "Årsmöte" },
  { value: "extra", label: "Extra stämma" },
  { value: "board", label: "Styrelsemöte" },
];

export default function MeetingsPage() {
  const supabase = createClient();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState("medlem");
  const [sending, setSending] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", date: "", time: "19:00", location: "Skogstorp", type: "annual" as Meeting["type"],
  });

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (profile) setUserRole(profile.role);
    }
    const { data } = await supabase.from("meetings").select("*").order("date", { ascending: false });
    if (data) setMeetings(data as Meeting[]);
    setLoading(false);
  }

  const canEdit = userRole === "admin" || userRole === "styrelse";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { data } = await supabase.from("meetings").insert({
      ...form,
      status: "planning",
    }).select().single();
    if (data) {
      setMeetings([data as Meeting, ...meetings]);
      setShowForm(false);
      setForm({ title: "", date: "", time: "19:00", location: "Skogstorp", type: "annual" });
    }
  }

  async function sendNotice(meeting: Meeting) {
    setSending(meeting.id);
    try {
      const res = await fetch("/api/email/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "meeting",
          data: { title: meeting.title, date: meeting.date, time: meeting.time || "", location: meeting.location },
        }),
      });
      const result = await res.json();
      alert(`Skickade ${result.sent} e-postmeddelanden${result.failed > 0 ? ` (${result.failed} misslyckades)` : ""}`);
    } catch { alert("Kunde inte skicka e-post"); }
    setSending(null);
  }

  const statusLabels: Record<string, string> = {
    planning: "Planering",
    notice_sent: "Kallelse skickad",
    completed: "Genomfört",
    archived: "Arkiverat",
  };

  if (loading) return <p className="text-gray-500">Laddar...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Calendar size={24} /> Möten</h1>
        {canEdit && (
          <button onClick={() => setShowForm(true)} className="bg-[var(--color-forest)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--color-forest-light)] transition text-sm">
            <Plus size={16} /> Nytt möte
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Nytt möte</h2>
            <button type="button" onClick={() => setShowForm(false)}><X size={20} /></button>
          </div>
          <input type="text" placeholder="Titel" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-2 border rounded-lg" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="px-4 py-2 border rounded-lg" />
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Plats" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="px-4 py-2 border rounded-lg" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Meeting["type"] })} className="px-4 py-2 border rounded-lg">
              {MEETING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-[var(--color-forest)] text-white px-6 py-2 rounded-lg hover:bg-[var(--color-forest-light)] transition">Skapa möte</button>
        </form>
      )}

      <div className="space-y-4">
        {meetings.length === 0 && <p className="text-gray-500">Inga möten planerade.</p>}
        {meetings.map((m) => {
          const typeLabel = MEETING_TYPES.find((t) => t.value === m.type)?.label || m.type;
          return (
            <div key={m.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[var(--color-forest)]/10 text-[var(--color-forest)] text-xs px-2 py-0.5 rounded-full">{typeLabel}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{statusLabels[m.status] || m.status}</span>
                  </div>
                  <h2 className="text-lg font-semibold">{m.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    📅 {new Date(m.date).toLocaleDateString("sv-SE")} {m.time && `kl ${m.time}`} • 📍 {m.location}
                  </p>
                  {m.fee_per_share && (
                    <p className="text-sm text-gray-600 mt-1">Avgift per andel: {m.fee_per_share} kr</p>
                  )}
                </div>
                {canEdit && (
                  <button
                    onClick={() => sendNotice(m)}
                    disabled={sending === m.id}
                    className="text-sm flex items-center gap-1 text-[var(--color-forest)] hover:underline disabled:opacity-50"
                  >
                    <Send size={14} />
                    {sending === m.id ? "Skickar..." : "Skicka kallelse"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}