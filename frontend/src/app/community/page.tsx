"use client";

import { useEffect, useState } from "react";
import { Heart, MessageCircle, Plus, Search, Send, Trash2, UsersRound } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Guard } from "@/features/auth/role-guard";
import { useAuth } from "@/features/auth/auth-provider";
import { useCrisis } from "@/components/crisis/CrisisProvider";

type Post = { id: string; author: string; handle: string; time: string; body: string; likes: number; liked?: boolean; local?: boolean };
const examples: Post[] = [
  { id: "sample-1", author: "Nadia", handle: "@langkahkecil", time: "Contoh", body: "Hari ini aku mencoba berhenti sejenak dan menarik napas. Ternyata memberi ruang kecil untuk diri sendiri terasa membantu. 🌿", likes: 24 },
  { id: "sample-2", author: "Raka", handle: "@ruangtenang", time: "Contoh", body: "Pengingat lembut: beristirahat bukan berarti menyerah. Semoga kita semua menemukan momen tenang hari ini.", likes: 17 },
  { id: "sample-3", author: "Maya", handle: "@ceritabersama", time: "Contoh", body: "Apa satu hal sederhana yang membuat kalian tersenyum minggu ini? Aku mulai: secangkir teh hangat di sore hari. ☕", likes: 31 },
];

export default function CommunityPage() { return <Guard roles={["patient"]}><AppShell><CommunityContent /></AppShell></Guard>; }

function CommunityContent() {
  const { user } = useAuth();
  const { openCrisis } = useCrisis();
  const storageKey = `havencare-community:${user?.uid ?? "guest"}`;
  const [posts, setPosts] = useState<Post[]>(examples);
  const [draft, setDraft] = useState("");
  const [joined, setJoined] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => { try { const saved = JSON.parse(localStorage.getItem(storageKey) || "{}"); setPosts(Array.isArray(saved.posts) ? [...saved.posts, ...examples] : examples); setJoined(Array.isArray(saved.joined) ? saved.joined : []); } catch {} }, [storageKey]);
  const persist = (nextPosts: Post[], nextJoined = joined) => { setPosts(nextPosts); setJoined(nextJoined); try { localStorage.setItem(storageKey, JSON.stringify({ posts: nextPosts.filter(p=>p.local), joined: nextJoined })); } catch {} };
  const publish = () => { const body = draft.trim(); if (!body) return; const item: Post = { id: `local-${Date.now()}`, author: user?.displayName || "Kamu", handle: "@akunmu", time: "Baru saja", body, likes: 0, local: true }; persist([item,...posts]); setDraft(""); };
  const like = (id: string) => persist(posts.map(p=>p.id===id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p));
  const remove = (id: string) => persist(posts.filter(p=>p.id!==id));
  const toggleJoin = (name: string) => persist(posts, joined.includes(name) ? joined.filter(n=>n!==name) : [...joined,name]);
  const filtered = posts.filter(p=>`${p.author} ${p.body}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-6"><div><span className="hc-label">Social micro-support</span><h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Komunitas berbagi</h1><p className="hc-muted mt-2">Ruang untuk cerita kecil, dukungan hangat, dan langkah bersama.</p></div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
      <div className="space-y-4"><section className="hc-glass-strong hc-card p-5"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#d8eef0] font-extrabold text-[#0b5963]">{(user?.displayName||"K").slice(0,1).toUpperCase()}</span><div><h2 className="font-extrabold">Bagikan cerita dengan tenang</h2><p className="hc-muted text-xs">Posting ini tersimpan di perangkatmu.</p></div></div><label className="sr-only" htmlFor="community-draft">Tulis cerita</label><textarea id="community-draft" value={draft} onChange={e=>setDraft(e.target.value)} maxLength={500} placeholder="Apa yang ingin kamu bagikan hari ini?" className="hc-input mt-4 min-h-28 resize-y"/><div className="mt-3 flex items-center justify-between"><span className="hc-muted text-xs">{draft.length}/500 karakter</span><button onClick={publish} disabled={!draft.trim()} className="hc-btn hc-btn-primary disabled:cursor-not-allowed disabled:opacity-50"><Send size={16}/> Bagikan</button></div></section>
        <div className="hc-glass flex items-center gap-3 rounded-2xl px-4"><Search size={18} className="text-[#5d7077]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari cerita komunitas" className="h-12 w-full bg-transparent text-sm outline-none" aria-label="Cari cerita komunitas"/></div>
        <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">Linimasa komunitas</h2><span className="hc-label">Cerita terkini</span></div>
        {filtered.map(post=><article key={post.id} className="hc-glass hc-card p-5 sm:p-6"><div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#dceff3] font-extrabold text-[#0b5963]">{post.author.slice(0,1).toUpperCase()}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2"><strong>{post.author}</strong><span className="hc-muted text-xs">{post.handle} · {post.time}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#334b52]">{post.body}</p><div className="mt-5 flex items-center gap-5"><button onClick={()=>like(post.id)} aria-pressed={!!post.liked} className={`flex items-center gap-2 text-xs font-bold ${post.liked ? "text-[#d85d62]" : "text-[#6e858a]"}`}><Heart size={17} fill={post.liked ? "currentColor" : "none"}/>{post.likes}</button><span className="flex items-center gap-2 text-xs text-[#84999d]"><MessageCircle size={17}/> Refleksi bersama</span>{post.local && <button onClick={()=>remove(post.id)} className="ml-auto flex items-center gap-1 text-xs font-bold text-[#9b6a6e] hover:text-[#d85d62]"><Trash2 size={15}/> Hapus</button>}</div></div></div></article>)}
        {filtered.length===0 && <p className="hc-glass hc-card p-8 text-center text-sm text-[#5d7077]">Belum ada cerita yang cocok dengan pencarianmu.</p>}
      </div>
      <aside className="space-y-5"><section className="hc-glass hc-card p-5"><div className="flex items-center gap-2"><UsersRound className="text-[#1a7f8e]"/><h2 className="font-extrabold">Komunitasku</h2></div><p className="hc-muted mt-2 text-xs">Pilih minat yang ingin kamu ikuti.</p><div className="mt-4 space-y-3">{["Ruang Tenang", "Langkah Kecil", "Cerita Sore"].map(name=><div key={name} className="flex items-center justify-between gap-2 rounded-2xl bg-white/70 p-3"><span className="text-sm font-bold">{name}</span><button onClick={()=>toggleJoin(name)} aria-pressed={joined.includes(name)} className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${joined.includes(name) ? "bg-[#dff2e9] text-[#4f8a65]" : "bg-[#1a7f8e]/10 text-[#1a7f8e]"}`}>{joined.includes(name) ? "Diikuti" : <span className="flex items-center gap-1"><Plus size={13}/> Ikuti</span>}</button></div>)}</div></section><section className="rounded-[24px] bg-[#0b5963] p-6 text-white"><h2 className="font-extrabold">Saling jaga, saling dengar</h2><p className="mt-2 text-sm leading-relaxed text-white/80">Berbagi dengan hormat. Jika kamu atau temanmu dalam bahaya, cari bantuan langsung.</p><button onClick={openCrisis} className="mt-5 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-[#0b5963]">Lihat bantuan krisis</button></section><p className="hc-muted text-xs leading-relaxed">Contoh cerita di linimasa adalah data simulasi. Belum ada fitur berbagi lintas akun atau moderasi server pada versi ini.</p></aside>
    </div>
  </div>;
}
