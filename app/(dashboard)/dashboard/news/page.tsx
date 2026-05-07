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

  if (loading) return <div className="text-on-surface-variant py-8 text-center">Laddar...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Newspaper size={20} className="text-secondary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Nyheter</h1>
        </div>
        {canWrite && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-secondary text-white px-4 py-2.5 rounded-[10px] flex items-center gap-2 hover:brightness-110 transition text-sm font-semibold"
          >
            <Plus size={16} /> Nytt inlägg
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-outline-variant shadow-sm mb-6 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Nytt inlägg</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-on-surface-variant hover:text-on-surface transition">
              <X size={20} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Rubrik"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full px-4 py-3 border border-outline-variant rounded-[10px] bg-surface text-on-surface focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
          />
          <textarea
            placeholder="Innehåll"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            rows={5}
            className="w-full px-4 py-3 border border-outline-variant rounded-[10px] bg-surface text-on-surface focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition resize-none"
          />
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              <input type="checkbox" checked={form.is_urgent} onChange={(e) => setForm({ ...form, is_urgent: e.target.checked })} className="rounded" /> Brådskande
            </label>
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} className="rounded" /> Offentlig
            </label>
          </div>
          <button
            type="submit"
            className="bg-secondary text-white px-6 py-2.5 rounded-[10px] hover:brightness-110 transition font-semibold"
          >
            Publicera
          </button>
        </form>
      )}

      <div className="space-y-4">
        {posts.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-outline-variant shadow-sm text-center text-on-surface-variant">
            Inga nyheter ännu.
          </div>
        )}
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl p-5 sm:p-6 border border-outline-variant shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  {post.is_urgent && (
                    <span className="bg-red-50 text-red-700 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold border border-red-200">
                      <AlertTriangle size={11} /> Brådskande
                    </span>
                  )}
                  {post.is_public && (
                    <span className="bg-secondary/5 text-secondary text-xs px-2.5 py-0.5 rounded-full font-semibold border border-secondary/20">
                      Offentlig
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-on-surface">{post.title}</h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  {post.author_name} • {new Date(post.created_at).toLocaleDateString("sv-SE")}
                </p>
              </div>
              {canWrite && (
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-outline hover:text-error transition shrink-0"
                  title="Ta bort"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <p className="mt-3 text-on-surface-variant whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}