"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Document, DocumentType } from "@/types";
import { FileText, Upload, Download, Trash2, Plus, X } from "lucide-react";

const CATEGORIES: { value: DocumentType; label: string; icon: string }[] = [
  { value: "protocol", label: "Protokoll", icon: "📋" },
  { value: "financial", label: "Ekonomi", icon: "💰" },
  { value: "bylaws", label: "Stadgar", icon: "📜" },
  { value: "budget", label: "Budget", icon: "📊" },
  { value: "agenda", label: "Kallelse/Dagordning", icon: "📅" },
  { value: "minutes", label: "Stämmoprotokoll", icon: "🏛️" },
  { value: "other", label: "Övrigt", icon: "📎" },
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

  if (loading) return <div className="text-[var(--color-on-surface-variant)] py-8 text-center">Laddar...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center">
            <FileText size={20} className="text-[var(--color-secondary)]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Dokument</h1>
        </div>
        {canUpload && (
          <button onClick={() => setShowForm(true)} className="bg-[var(--color-secondary)] text-white px-4 py-2.5 rounded-[10px] flex items-center gap-2 hover:brightness-110 transition text-sm font-semibold">
            <Plus size={16} /> Ladda upp
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 sm:p-6 border border-[var(--color-outline-variant)] shadow-sm mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Ladda upp dokument</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"><X size={20} /></button>
          </div>
          <input type="text" placeholder="Titel" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-3 border border-[var(--color-outline-variant)] rounded-[10px] bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent outline-none transition" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as DocumentType })} className="w-full px-4 py-3 border border-[var(--color-outline-variant)] rounded-[10px] bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent outline-none transition">
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
          </select>
          <input ref={fileRef} type="file" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} required className="w-full text-sm text-[var(--color-on-surface-variant)] file:mr-4 file:py-2.5 file:px-4 file:rounded-[10px] file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-secondary)]/10 file:text-[var(--color-secondary)] hover:file:bg-[var(--color-secondary)]/20" />
          <label className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)]">
            <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} className="rounded" />
            Offentlig (synlig för alla medlemmar)
          </label>
          <button type="submit" disabled={uploading} className="bg-[var(--color-secondary)] text-white px-6 py-2.5 rounded-[10px] hover:brightness-110 transition font-semibold disabled:opacity-50">
            {uploading ? "Laddar upp..." : "Ladda upp"}
          </button>
        </form>
      )}

      {grouped.length === 0 && (
        <div className="bg-white rounded-2xl p-8 border border-[var(--color-outline-variant)] shadow-sm text-center text-[var(--color-on-surface-variant)]">
          Inga dokument ännu.
        </div>
      )}
      {grouped.map((group) => (
        <div key={group.value} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{group.icon}</span>
            <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">{group.label}</h2>
            <span className="text-xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)] px-2 py-0.5 rounded-full">{group.docs.length}</span>
          </div>
          <div className="space-y-2">
            {group.docs.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl p-4 border border-[var(--color-outline-variant)] shadow-sm flex items-center justify-between gap-3 hover:shadow-md transition">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-container)] flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-[var(--color-secondary)]" />
                  </div>
                  <div className="min-w-0">
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-secondary)] transition truncate block">{doc.title}</a>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{new Date(doc.created_at).toLocaleDateString("sv-SE")} {doc.file_size ? `• ${(doc.file_size / 1024).toFixed(0)} KB` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-secondary)]/10 hover:text-[var(--color-secondary)] transition">
                    <Download size={16} />
                  </a>
                  {canDelete && (
                    <button onClick={() => handleDelete(doc.id, doc.file_url)} className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[var(--color-outline)] hover:bg-red-50 hover:text-[var(--color-error)] transition">
                      <Trash2 size={16} />
                    </button>
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