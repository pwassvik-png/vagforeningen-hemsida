"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Member } from "@/types";
import { Users, Search, Check, X as XIcon } from "lucide-react";

export default function MembersPage() {
  const supabase = createClient();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Member>>({});

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    const { data } = await supabase.from("profiles").select("*").order("property_designation");
    if (data) setMembers(data as Member[]);
    setLoading(false);
  }

  async function togglePaid(id: string, current: boolean) {
    await supabase.from("profiles").update({ has_paid_fee: !current }).eq("id", id);
    setMembers(members.map((m) => (m.id === id ? { ...m, has_paid_fee: !current } : m)));
  }

  async function saveEdit() {
    if (!editId) return;
    await supabase.from("profiles").update({
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      property_designation: editForm.property_designation,
      share_value: editForm.share_value,
      role: editForm.role,
    }).eq("id", editId);
    setMembers(members.map((m) => (m.id === editId ? { ...m, ...editForm } as Member : m)));
    setEditId(null);
  }

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.property_designation.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const paidCount = members.filter((m) => m.has_paid_fee).length;

  if (loading) return <div className="text-[var(--color-on-surface-variant)] py-8 text-center">Laddar...</div>;

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-6 sm:mb-8">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center">
          <Users size={20} className="text-[var(--color-secondary)]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Medlemmar</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">{members.length} medlemmar • {paidCount} betalat</p>
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" size={18} />
        <input
          type="text"
          placeholder="Sök namn, fastighet, e-post..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-[var(--color-outline-variant)] rounded-[10px] bg-white text-[var(--color-on-surface)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent outline-none transition"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-variant)]">
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-on-surface-variant)]">Namn</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-on-surface-variant)]">Fastighet</th>
                <th className="px-4 py-3 text-right font-semibold text-[var(--color-on-surface-variant)]">Andelstal</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-on-surface-variant)] hidden sm:table-cell">E-post</th>
                <th className="px-4 py-3 text-center font-semibold text-[var(--color-on-surface-variant)]">Avgift</th>
                <th className="px-4 py-3 text-center font-semibold text-[var(--color-on-surface-variant)] hidden md:table-cell">Roll</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline-variant)]">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-[var(--color-surface-container-low)] transition">
                  {editId === m.id ? (
                    <>
                      <td className="px-4 py-2"><input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="border border-[var(--color-outline-variant)] rounded-[10px] px-2 py-1.5 w-full bg-[var(--color-surface)] text-[var(--color-on-surface)]" /></td>
                      <td className="px-4 py-2"><input value={editForm.property_designation} onChange={(e) => setEditForm({ ...editForm, property_designation: e.target.value })} className="border border-[var(--color-outline-variant)] rounded-[10px] px-2 py-1.5 w-full bg-[var(--color-surface)] text-[var(--color-on-surface)]" /></td>
                      <td className="px-4 py-2"><input type="number" value={editForm.share_value} onChange={(e) => setEditForm({ ...editForm, share_value: Number(e.target.value) })} className="border border-[var(--color-outline-variant)] rounded-[10px] px-2 py-1.5 w-20 text-right bg-[var(--color-surface)] text-[var(--color-on-surface)]" /></td>
                      <td className="px-4 py-2 hidden sm:table-cell"><input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="border border-[var(--color-outline-variant)] rounded-[10px] px-2 py-1.5 w-full bg-[var(--color-surface)] text-[var(--color-on-surface)]" /></td>
                      <td className="px-4 py-2 text-center">—</td>
                      <td className="px-4 py-2 hidden md:table-cell">
                        <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })} className="border border-[var(--color-outline-variant)] rounded-[10px] px-2 py-1.5 bg-[var(--color-surface)] text-[var(--color-on-surface)]">
                          <option value="admin">Admin</option>
                          <option value="styrelse">Styrelse</option>
                          <option value="medlem">Medlem</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-1.5">
                          <button onClick={saveEdit} className="w-8 h-8 rounded-[10px] flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition"><Check size={14} /></button>
                          <button onClick={() => setEditId(null)} className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] transition"><XIcon size={14} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2.5 font-semibold text-[var(--color-on-surface)]">{m.name}</td>
                      <td className="px-4 py-2.5 text-[var(--color-on-surface-variant)]">{m.property_designation}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-[var(--color-on-surface)]">{m.share_value}</td>
                      <td className="px-4 py-2.5 text-[var(--color-on-surface-variant)] hidden sm:table-cell">{m.email}</td>
                      <td className="px-4 py-2.5 text-center">
                        <button onClick={() => togglePaid(m.id, m.has_paid_fee)} className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition ${m.has_paid_fee ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-500 border border-red-200"}`}>
                          {m.has_paid_fee ? <Check size={14} /> : <XIcon size={14} />}
                        </button>
                      </td>
                      <td className="px-4 py-2.5 hidden md:table-cell">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${m.role === "admin" ? "bg-purple-50 text-purple-700 border border-purple-200" : m.role === "styrelse" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"}`}>
                          {m.role}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <button onClick={() => { setEditId(m.id); setEditForm(m); }} className="text-sm text-[var(--color-secondary)] hover:underline font-medium">
                          Redigera
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-sm text-[var(--color-on-surface-variant)] mt-4">{filtered.length} av {members.length} medlemmar</p>
    </div>
  );
}