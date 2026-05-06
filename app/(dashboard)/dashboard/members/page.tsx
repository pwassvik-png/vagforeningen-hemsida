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

  if (loading) return <p className="text-gray-500">Laddar...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6"><Users size={24} /> Medlemmar</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Sök namn, fastighet, e-post..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-forest)] text-white">
              <tr>
                <th className="px-4 py-3 text-left">Namn</th>
                <th className="px-4 py-3 text-left">Fastighet</th>
                <th className="px-4 py-3 text-right">Andelstal</th>
                <th className="px-4 py-3 text-left">E-post</th>
                <th className="px-4 py-3 text-center">Avgift</th>
                <th className="px-4 py-3 text-center">Roll</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  {editId === m.id ? (
                    <>
                      <td className="px-4 py-2"><input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="border rounded px-2 py-1 w-full" /></td>
                      <td className="px-4 py-2"><input value={editForm.property_designation} onChange={(e) => setEditForm({ ...editForm, property_designation: e.target.value })} className="border rounded px-2 py-1 w-full" /></td>
                      <td className="px-4 py-2"><input type="number" value={editForm.share_value} onChange={(e) => setEditForm({ ...editForm, share_value: Number(e.target.value) })} className="border rounded px-2 py-1 w-20 text-right" /></td>
                      <td className="px-4 py-2"><input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="border rounded px-2 py-1 w-full" /></td>
                      <td className="px-4 py-2 text-center">—</td>
                      <td className="px-4 py-2">
                        <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })} className="border rounded px-2 py-1">
                          <option value="admin">Admin</option>
                          <option value="styrelse">Styrelse</option>
                          <option value="medlem">Medlem</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button onClick={saveEdit} className="text-green-600 hover:text-green-800"><Check size={16} /></button>
                          <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-600"><XIcon size={16} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2 font-medium">{m.name}</td>
                      <td className="px-4 py-2">{m.property_designation}</td>
                      <td className="px-4 py-2 text-right">{m.share_value}</td>
                      <td className="px-4 py-2 text-gray-600">{m.email}</td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => togglePaid(m.id, m.has_paid_fee)} className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${m.has_paid_fee ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {m.has_paid_fee ? <Check size={14} /> : <XIcon size={14} />}
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${m.role === "admin" ? "bg-purple-100 text-purple-700" : m.role === "styrelse" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                          {m.role}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button onClick={() => { setEditId(m.id); setEditForm(m); }} className="text-sm text-[var(--color-forest)] hover:underline">
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
      <p className="text-sm text-gray-500 mt-4">{filtered.length} av {members.length} medlemmar</p>
    </div>
  );
}