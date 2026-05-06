"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Issue, IssueCategory, IssueStatus } from "@/types";
import { Bug, Plus, X, AlertCircle, Clock, CheckCircle } from "lucide-react";

const CATEGORIES: IssueCategory[] = ["Hål i vägen", "Träd/Vegetation", "Snöröjning", "Belysning", "Dikning/Avrinning", "Övrigt"];
const STATUSES: IssueStatus[] = ["Mottagen", "Pågående", "Åtgärdad"];

const statusConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  "Mottagen": { icon: <AlertCircle size={14} />, color: "bg-yellow-100 text-yellow-800" },
  "Pågående": { icon: <Clock size={14} />, color: "bg-blue-100 text-blue-800" },
  "Åtgärdad": { icon: <CheckCircle size={14} />, color: "bg-green-100 text-green-800" },
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

  if (loading) return <p className="text-gray-500">Laddar...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Bug size={24} /> Problemrapporter</h1>
        <button onClick={() => setShowForm(true)} className="bg-[var(--color-forest)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--color-forest-light)] transition text-sm">
          <Plus size={16} /> Ny rapport
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Ny problemrapport</h2>
            <button type="button" onClick={() => setShowForm(false)}><X size={20} /></button>
          </div>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as IssueCategory })} className="w-full px-4 py-2 border rounded-lg">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea placeholder="Beskriv problemet" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} className="w-full px-4 py-2 border rounded-lg" />
          <input type="text" placeholder="Plats (t.ex. &quot;vid nr 12&quot;)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
          <button type="submit" className="bg-[var(--color-forest)] text-white px-6 py-2 rounded-lg hover:bg-[var(--color-forest-light)] transition">Skicka rapport</button>
        </form>
      )}

      <div className="space-y-4">
        {issues.length === 0 && <p className="text-gray-500">Inga problemrapporter.</p>}
        {issues.map((issue) => {
          const sc = statusConfig[issue.status] || statusConfig["Mottagen"];
          return (
            <div key={issue.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${sc.color}`}>
                    {sc.icon} {issue.status}
                  </span>
                  <h2 className="text-lg font-semibold mt-1">{issue.category}</h2>
                  <p className="text-sm text-gray-500">{issue.user_name} • {new Date(issue.created_at).toLocaleDateString("sv-SE")}</p>
                  {issue.location && <p className="text-sm text-gray-500 mt-1">📍 {issue.location}</p>}
                </div>
                {canChangeStatus && (
                  <select value={issue.status} onChange={(e) => updateStatus(issue.id, e.target.value as IssueStatus)} className="text-sm border rounded px-2 py-1">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
              <p className="mt-3 text-gray-700">{issue.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}