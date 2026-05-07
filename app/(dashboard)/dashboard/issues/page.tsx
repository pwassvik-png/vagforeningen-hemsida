"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Issue, IssueCategory, IssueStatus } from "@/types";
import { Bug, Plus, X, AlertCircle, Clock, CheckCircle } from "lucide-react";

const CATEGORIES: IssueCategory[] = ["Hål i vägen", "Träd/Vegetation", "Snöröjning", "Belysning", "Dikning/Avrinning", "Övrigt"];
const STATUSES: IssueStatus[] = ["Mottagen", "Pågående", "Åtgärdad"];

const statusConfig: Record<string, { icon: React.ReactNode; bg: string; text: string; border: string }> = {
  "Mottagen": { icon: <AlertCircle size={12} />, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Pågående": { icon: <Clock size={12} />, bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Åtgärdad": { icon: <CheckCircle size={12} />, bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
};

export default function IssuesPage() {
  const supabase = createClient();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState("medlem");
  const [form, setForm] = useState({ category: "Övrigt" as IssueCategory, description: "", location: "" });

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role, name").eq("id", user.id).single();
      if (profile) setUserRole(profile.role);
    }
    const { data } = await supabase.from("issues").select("*").order("created_at", { ascending: false });
    if (data) setIssues(data as Issue[]);
    setLoading(false);
  }

  const canChangeStatus = userRole === "admin" || userRole === "styrelse";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from("profiles").select("name").eq("id", user?.id).single();
    const { data } = await supabase.from("issues").insert({
      user_id: user?.id,
      user_name: profile?.name || "Okänd",
      ...form,
      status: "Mottagen",
    }).select().single();
    if (data) {
      setIssues([data as Issue, ...issues]);
      setForm({ category: "Övrigt", description: "", location: "" });
      setShowForm(false);
    }
  }

  async function updateStatus(id: string, status: IssueStatus) {
    await supabase.from("issues").update({ status }).eq("id", id);
    setIssues(issues.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  if (loading) return <div className="text-[var(--color-on-surface-variant)] py-8 text-center">Laddar...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center">
            <Bug size={20} className="text-[var(--color-secondary)]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Problemrapporter</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[var(--color-secondary)] text-white px-4 py-2.5 rounded-[10px] flex items-center gap-2 hover:brightness-110 transition text-sm font-semibold"
        >
          <Plus size={16} /> Ny rapport
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-[var(--color-outline-variant)] shadow-sm mb-6 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Ny problemrapport</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition">
              <X size={20} />
            </button>
          </div>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as IssueCategory })}
            className="w-full px-4 py-3 border border-[var(--color-outline-variant)] rounded-[10px] bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent outline-none transition"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea
            placeholder="Beskriv problemet"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-3 border border-[var(--color-outline-variant)] rounded-[10px] bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent outline-none transition resize-none"
          />
          <input
            type="text"
            placeholder="Plats (t.ex. &quot;vid nr 12&quot;)"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full px-4 py-3 border border-[var(--color-outline-variant)] rounded-[10px] bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent outline-none transition"
          />
          <button
            type="submit"
            className="bg-[var(--color-secondary)] text-white px-6 py-2.5 rounded-[10px] hover:brightness-110 transition font-semibold"
          >
            Skicka rapport
          </button>
        </form>
      )}

      <div className="space-y-4">
        {issues.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--color-outline-variant)] shadow-sm text-center text-[var(--color-on-surface-variant)]">
            Inga problemrapporter ännu.
          </div>
        )}
        {issues.map((issue) => {
          const sc = statusConfig[issue.status] || statusConfig["Mottagen"];
          return (
            <div key={issue.id} className="bg-white rounded-2xl p-5 sm:p-6 border border-[var(--color-outline-variant)] shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-semibold ${sc.bg} ${sc.text} border ${sc.border}`}>
                    {sc.icon} {issue.status}
                  </span>
                  <h2 className="text-lg font-semibold mt-1.5 text-[var(--color-on-surface)]">{issue.category}</h2>
                  <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
                    {issue.user_name} • {new Date(issue.created_at).toLocaleDateString("sv-SE")}
                  </p>
                  {issue.location && (
                    <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">📍 {issue.location}</p>
                  )}
                </div>
                {canChangeStatus && (
                  <select
                    value={issue.status}
                    onChange={(e) => updateStatus(issue.id, e.target.value as IssueStatus)}
                    className="text-sm border border-[var(--color-outline-variant)] rounded-[10px] px-3 py-1.5 bg-[var(--color-surface)] text-[var(--color-on-surface)] shrink-0"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
              <p className="mt-3 text-[var(--color-on-surface-variant)] leading-relaxed">{issue.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}