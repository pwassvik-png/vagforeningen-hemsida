"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MaintenanceItem, Contractor, MaintenanceStatus } from "@/types";
import { Wrench, Plus, X, Edit, Check } from "lucide-react";

const STATUS_CONFIG: Record<MaintenanceStatus, { label: string; color: string }> = {
  planned: { label: "Planerat", color: "bg-yellow-100 text-yellow-800" },
  in_progress: { label: "Pågående", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Genomfört", color: "bg-green-100 text-green-800" },
  deferred: { label: "Uppskjutet", color: "bg-gray-100 text-gray-700" },
};

export default function MaintenancePage() {
  const supabase = createClient();
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState("medlem");
  const [form, setForm] = useState({ title: "", description: "", year: new Date().getFullYear(), estimated_cost: 0, status: "planned" as MaintenanceStatus, contractor_id: "" });

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
    const [itemsRes, contractorsRes] = await Promise.all([
      supabase.from("maintenance_items").select("*").order("year", { ascending: false }),
      supabase.from("contractors").select("*").order("company_name"),
    ]);
    if (itemsRes.data) setItems(itemsRes.data as MaintenanceItem[]);
    if (contractorsRes.data) setContractors(contractorsRes.data as Contractor[]);
    setLoading(false);
  }

  const canEdit = userRole === "admin" || userRole === "styrelse";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, estimated_cost: Number(form.estimated_cost), contractor_id: form.contractor_id || null };
    const { data } = await supabase.from("maintenance_items").insert(payload).select().single();
    if (data) { setItems([data as MaintenanceItem, ...items]); setShowForm(false); setForm({ title: "", description: "", year: new Date().getFullYear(), estimated_cost: 0, status: "planned", contractor_id: "" }); }
  }

  async function updateStatus(id: string, status: MaintenanceStatus) {
    await supabase.from("maintenance_items").update({ status }).eq("id", id);
    setItems(items.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  if (loading) return <p className="text-gray-500">Laddar...</p>;

  const grouped = items.reduce((acc, item) => {
    const key = String(item.year);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, MaintenanceItem[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Wrench size={24} /> Underhållsplan</h1>
        {canEdit && (
          <button onClick={() => setShowForm(true)} className="bg-[var(--color-forest)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--color-forest-light)] transition text-sm">
            <Plus size={16} /> Ny post
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Ny underhållspost</h2>
            <button type="button" onClick={() => setShowForm(false)}><X size={20} /></button>
          </div>
          <input type="text" placeholder="Titel" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-2 border rounded-lg" />
          <textarea placeholder="Beskrivning" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="w-full px-4 py-2 border rounded-lg" />
          <div className="grid grid-cols-3 gap-4">
            <input type="number" placeholder="År" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className="px-4 py-2 border rounded-lg" />
            <input type="number" placeholder="Kostnad (kr)" value={form.estimated_cost} onChange={(e) => setForm({ ...form, estimated_cost: Number(e.target.value) })} className="px-4 py-2 border rounded-lg" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as MaintenanceStatus })} className="px-4 py-2 border rounded-lg">
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          {contractors.length > 0 && (
            <select value={form.contractor_id} onChange={(e) => setForm({ ...form, contractor_id: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
              <option value="">Ingen entreprenör vald</option>
              {contractors.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
            </select>
          )}
          <button type="submit" className="bg-[var(--color-forest)] text-white px-6 py-2 rounded-lg hover:bg-[var(--color-forest-light)] transition">Spara</button>
        </form>
      )}

      {Object.entries(grouped).sort(([a], [b]) => Number(b) - Number(a)).map(([year, yearItems]) => (
        <div key={year} className="mb-6">
          <h2 className="text-lg font-semibold mb-3">{year}</h2>
          <div className="space-y-2">
            {yearItems.map((item) => {
              const sc = STATUS_CONFIG[item.status];
              const contractor = contractors.find((c) => c.id === item.contractor_id);
              return (
                <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        {item.estimated_cost > 0 && <span>💰 {item.estimated_cost.toLocaleString("sv-SE")} kr</span>}
                        {contractor && <span>🔧 {contractor.company_name}</span>}
                      </div>
                    </div>
                    {canEdit && (
                      <select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value as MaintenanceStatus)} className="text-xs border rounded px-2 py-1">
                        {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}