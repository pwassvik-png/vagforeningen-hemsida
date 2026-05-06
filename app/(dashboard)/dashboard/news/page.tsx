"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/types";
import { Newspaper, Plus, AlertTriangle, X } from "lucide-react";

export default function NewsPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState<string>("medlem");
  const [form, setForm] = useState({ title: "", content: "", is_urgent: false, is_public: false });

  useEffect(() => {
    loadPosts();
    async function loadPosts() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (profile) setUserRole(profile.role);
      }
      const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      if (data) setPosts(data as Post[]);
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canWrite = userRole === "admin" || userRole === "styrelse";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from("profiles").select("name").eq("id", user?.id).single();
    const { data } = await supabase.from("posts").insert({
      ...form,
      author_id: user?.id,
      author_name: profile?.name || "Okänd",
    }).select().single();
    if (data) {
      setPosts([data as Post, ...posts]);
      setForm({ title: "", content: "", is_urgent: false, is_public: false });
      setShowForm(false);
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("posts").delete().eq("id", id);
    setPosts(posts.filter((p) => p.id !== id));
  }

  if (loading) return <p className="text-gray-500">Laddar...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Newspaper size={24} /> Nyheter</h1>
        {canWrite && (
          <button onClick={() => setShowForm(true)} className="bg-[var(--color-forest)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--color-forest-light)] transition text-sm">
            <Plus size={16} /> Nytt inlägg
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Nytt inlägg</h2>
            <button type="button" onClick={() => setShowForm(false)}><X size={20} /></button>
          </div>
          <input type="text" placeholder="Rubrik" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-2 border rounded-lg" />
          <textarea placeholder="Innehåll" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={5} className="w-full px-4 py-2 border rounded-lg" />
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_urgent} onChange={(e) => setForm({ ...form, is_urgent: e.target.checked })} /> Brådskande</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} /> Offentlig (synlig utan inloggning)</label>
          </div>
          <button type="submit" className="bg-[var(--color-forest)] text-white px-6 py-2 rounded-lg hover:bg-[var(--color-forest-light)] transition">Publicera</button>
        </form>
      )}

      <div className="space-y-4">
        {posts.length === 0 && <p className="text-gray-500">Inga nyheter ännu.</p>}
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {post.is_urgent && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle size={12} /> Brådskande</span>}
                  {post.is_public && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Offentlig</span>}
                </div>
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{post.author_name} • {new Date(post.created_at).toLocaleDateString("sv-SE")}</p>
              </div>
              {canWrite && (
                <button onClick={() => handleDelete(post.id)} className="text-gray-400 hover:text-red-500 transition" title="Ta bort">
                  <X size={16} />
                </button>
              )}
            </div>
            <p className="mt-3 text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}