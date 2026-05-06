"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Document, DocumentType } from "@/types";
import { FileText, Upload, Download, Trash2, Plus, X } from "lucide-react";

const CATEGORIES: { value: DocumentType; label: string }[] = [
  { value: "protocol", label: "Protokoll" },
  { value: "financial", label: "Ekonomi" },
  { value: "bylaws", label: "Stadgar" },
  { value: "budget", label: "Budget" },
  { value: "agenda", label: "Kallelse/Dagordning" },
  { value: "minutes", label: "Stämmoprotokoll" },
  { value: "other", label: "Övrigt" },
];

export default function DocumentsPage() {
  const supabase = createClient();
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState("medlem");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ title: "", category: "other" as DocumentType, file: null as File | null, is_public: true });

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
    const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
    if (data) setDocs(data as Document[]);
    setLoading(false);
  }

  const canUpload = userRole === "admin" || userRole === "styrelse";
  const canDelete = userRole === "admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.file) return;
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const filePath = `${form.category}/${Date.now()}_${form.file.name}`;
    const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, form.file);
    if (uploadError) { alert("Uppladdning misslyckades: " + uploadError.message); setUploading(false); return; }

    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath);
    const fileUrl = urlData.publicUrl;

    const { data } = await supabase.from("documents").insert({
      title: form.title,
      category: form.category,
      file_url: fileUrl,
      file_size: form.file.size,
      is_public: form.is_public,
      uploaded_by: user?.id,
    }).select().single();

    if (data) {
      setDocs([data as Document, ...docs]);
      setShowForm(false);
      setForm({ title: "", category: "other", file: null, is_public: true });
    }
    setUploading(false);
  }

  async function handleDelete(id: string, fileUrl: string) {
    if (!confirm("Vill du verkligen ta bort detta dokument?")) return;
    await supabase.from("documents").delete().eq("id", id);
    setDocs(docs.filter((d) => d.id !== id));
  }

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    docs: docs.filter((d) => d.category === cat.value),
  })).filter((g) => g.docs.length > 0);

  if (loading) return <p className="text-gray-500">Laddar...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><FileText size={24} /> Dokument</h1>
        {canUpload && (
          <button onClick={() => setShowForm(true)} className="bg-[var(--color-forest)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--color-forest-light)] transition text-sm">
            <Plus size={16} /> Ladda upp
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Ladda upp dokument</h2>
            <button type="button" onClick={() => setShowForm(false)}><X size={20} /></button>
          </div>
          <input type="text" placeholder="Titel" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-2 border rounded-lg" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as DocumentType })} className="w-full px-4 py-2 border rounded-lg">
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <input ref={fileRef} type="file" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} required className="w-full" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} />
            Offentlig (synlig för alla medlemmar)
          </label>
          <button type="submit" disabled={uploading} className="bg-[var(--color-forest)] text-white px-6 py-2 rounded-lg hover:bg-[var(--color-forest-light)] transition disabled:opacity-50">
            {uploading ? "Laddar upp..." : "Ladda upp"}
          </button>
        </form>
      )}

      {grouped.length === 0 && <p className="text-gray-500">Inga dokument ännu.</p>}
      {grouped.map((group) => (
        <div key={group.value} className="mb-6">
          <h2 className="text-lg font-semibold mb-3">{group.label}</h2>
          <div className="space-y-2">
            {group.docs.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-[var(--color-forest)]" />
                  <div>
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">{doc.title}</a>
                    <p className="text-xs text-gray-500">{new Date(doc.created_at).toLocaleDateString("sv-SE")} {doc.file_size ? `• ${(doc.file_size / 1024).toFixed(0)} KB` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-forest)] hover:text-[var(--color-forest-light)]"><Download size={18} /></a>
                  {canDelete && (
                    <button onClick={() => handleDelete(doc.id, doc.file_url)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}