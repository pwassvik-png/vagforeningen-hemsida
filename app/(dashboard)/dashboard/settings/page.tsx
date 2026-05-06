"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { NotificationPreference } from "@/types";
import { Settings, Bell, Save } from "lucide-react";

const defaultPrefs: NotificationPreference = {
  id: "",
  user_id: "",
  news_updates: true,
  issue_updates: true,
  meeting_notices: true,
  maintenance_updates: false,
  fee_reminders: true,
};

export default function SettingsPage() {
  const supabase = createClient();
  const [prefs, setPrefs] = useState<NotificationPreference>(defaultPrefs);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPrefs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPrefs() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase.from("notification_preferences").select("*").eq("user_id", user.id).single();
    if (data) setPrefs(data as NotificationPreference);
    setLoading(false);
  }

  async function savePrefs() {
    setSaving(true);
    setSaved(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { data } = await supabase.from("notification_preferences").upsert({
      user_id: user.id,
      news_updates: prefs.news_updates,
      issue_updates: prefs.issue_updates,
      meeting_notices: prefs.meeting_notices,
      maintenance_updates: prefs.maintenance_updates,
      fee_reminders: prefs.fee_reminders,
    }).select().single();

    if (data) setPrefs(data as NotificationPreference);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <p className="text-gray-500">Laddar...</p>;

  const toggles: { key: keyof NotificationPreference; label: string; desc: string }[] = [
    { key: "news_updates", label: "Nyheter", desc: "Få e-post när styrelsen publicerar nyheter" },
    { key: "issue_updates", label: "Problemrapporter", desc: "Få e-post när en problemrapport uppdateras" },
    { key: "meeting_notices", label: "Möteskallelser", desc: "Få kallelse när årsmöte eller styrelsemöte anordnas" },
    { key: "maintenance_updates", label: "Underhåll", desc: "Få e-post om underhållsplanering" },
    { key: "fee_reminders", label: "Avgiftspåminnelser", desc: "Få påminnelse när årsavgiften förfaller" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6"><Settings size={24} /> Inställningar</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4"><Bell size={20} /> E-postnotiser</h2>
        <p className="text-sm text-gray-500 mb-6">Välj vilka e-postnotiser du vill få från föreningen.</p>

        <div className="space-y-4">
          {toggles.map(({ key, label, desc }) => (
            <label key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={prefs[key] as boolean}
                  onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full transition ${prefs[key] ? "bg-[var(--color-forest)]" : "bg-gray-300"}`} />
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition ${prefs[key] ? "translate-x-5" : ""}`} />
              </div>
            </label>
          ))}
        </div>

        <button onClick={savePrefs} disabled={saving} className="mt-6 bg-[var(--color-forest)] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--color-forest-light)] transition disabled:opacity-50">
          <Save size={16} />
          {saving ? "Sparar..." : saved ? "Sparat ✓" : "Spara inställningar"}
        </button>
      </div>
    </div>
  );
}