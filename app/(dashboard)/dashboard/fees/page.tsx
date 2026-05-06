"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Member, FeeSettings } from "@/types";
import { DollarSign, Check, X } from "lucide-react";

export default function FeesPage() {
  const supabase = createClient();
  const [members, setMembers] = useState<Member[]>([]);
  const [feeSettings, setFeeSettings] = useState<FeeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("medlem");
  const [currentUserId, setCurrentUserId] = useState("");
  const [editUnitCost, setEditUnitCost] = useState(false);
  const [newUnitCost, setNewUnitCost] = useState("");

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (profile) setUserRole(profile.role);
    }
    const { data: membersData } = await supabase.from("profiles").select("*").order("property_designation");
    if (membersData) setMembers(membersData as Member[]);
    const { data: feeData } = await supabase.from("fee_settings").select("*").limit(1).single();
    if (feeData) setFeeSettings(feeData as FeeSettings);
    setLoading(false);
  }

  async function togglePaid(id: string, current: boolean) {
    await supabase.from("profiles").update({ has_paid_fee: !current }).eq("id", id);
    setMembers(members.map((m) => (m.id === id ? { ...m, has_paid_fee: !current } : m)));
  }

  async function saveFeeSettings() {
    const unitCost = Number(newUnitCost);
    if (isNaN(unitCost) || unitCost <= 0) return;
    await supabase.from("fee_settings").upsert({ id: 1, year: new Date().getFullYear(), unit_cost: unitCost });
    setFeeSettings({ year: new Date().getFullYear(), unit_cost: unitCost });
    setEditUnitCost(false);
  }

  const isAdmin = userRole === "admin";
  const currentUser = members.find((m) => m.id === currentUserId);
  const totalShares = members.reduce((sum, m) => sum + Number(m.share_value), 0);
  const paidShares = members.filter((m) => m.has_paid_fee).reduce((sum, m) => sum + Number(m.share_value), 0);
  const unitCost = feeSettings?.unit_cost || 963;

  if (loading) return <p className="text-gray-500">Laddar...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6"><DollarSign size={24} /> Avgifter</h1>

      {/* Egen avgift */}
      {currentUser && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-2">Din avgift</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-sm text-gray-500">Fastighet</p><p className="font-semibold">{currentUser.property_designation}</p></div>
            <div><p className="text-sm text-gray-500">Andelstal</p><p className="font-semibold">{currentUser.share_value}</p></div>
            <div><p className="text-sm text-gray-500">Att betala</p><p className="font-semibold text-xl">{(Number(currentUser.share_value) * unitCost).toLocaleString("sv-SE")} kr</p></div>
            <div><p className="text-sm text-gray-500">Status</p><p className={`font-semibold ${currentUser.has_paid_fee ? "text-green-600" : "text-red-600"}`}>{currentUser.has_paid_fee ? "✓ Betald" : "✗ Obetald"}</p></div>
          </div>
        </div>
      )}

      {/* Admin: avgiftsinställningar */}
      {isAdmin && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Avgiftsinställningar</h2>
            {!editUnitCost && <button onClick={() => { setEditUnitCost(true); setNewUnitCost(String(unitCost)); }} className="text-sm text-[var(--color-forest)] hover:underline">Ändra</button>}
          </div>
          {editUnitCost ? (
            <div className="flex gap-2 items-center">
              <span>Kr per andel:</span>
              <input type="number" value={newUnitCost} onChange={(e) => setNewUnitCost(e.target.value)} className="border rounded px-3 py-1 w-32" />
              <button onClick={saveFeeSettings} className="bg-[var(--color-forest)] text-white px-4 py-1 rounded text-sm">Spara</button>
              <button onClick={() => setEditUnitCost(false)} className="text-gray-500 text-sm">Avbryt</button>
            </div>
          ) : (
            <p className="text-2xl font-bold">{unitCost.toLocaleString("sv-SE")} kr <span className="text-sm font-normal text-gray-500">per andelstal</span></p>
          )}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><p className="text-gray-500">Totalt antal andelar</p><p className="font-semibold">{totalShares.toFixed(2)}</p></div>
            <div><p className="text-gray-500">Betalda andelar</p><p className="font-semibold text-green-600">{paidShares.toFixed(2)}</p></div>
            <div><p className="text-gray-500">Obetalda andelar</p><p className="font-semibold text-red-600">{(totalShares - paidShares).toFixed(2)}</p></div>
          </div>
        </div>
      )}

      {/* Admin: medlemslista med avgiftsstatus */}
      {isAdmin && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-forest)] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Namn</th>
                  <th className="px-4 py-3 text-left">Fastighet</th>
                  <th className="px-4 py-3 text-right">Andelstal</th>
                  <th className="px-4 py-3 text-right">Belopp</th>
                  <th className="px-4 py-3 text-center">Betald</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{m.name}</td>
                    <td className="px-4 py-2">{m.property_designation}</td>
                    <td className="px-4 py-2 text-right">{m.share_value}</td>
                    <td className="px-4 py-2 text-right">{(Number(m.share_value) * unitCost).toLocaleString("sv-SE")} kr</td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => togglePaid(m.id, m.has_paid_fee)} className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${m.has_paid_fee ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {m.has_paid_fee ? <Check size={14} /> : <X size={14} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}