"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  CheckCircle2,
  Filter,
  Flame,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Smile,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FreudButton } from "@/components/ui/FreudButton";
import { Guard } from "@/features/auth/role-guard";
import { useAuth } from "@/features/auth/auth-provider";
import { cn } from "@/lib/utils";

export default function CommunityPage() {
  return (
    <Guard roles={["patient", "doctor", "admin"]}>
      <AppShell hideClinicalPanel>
        <CommunityWorkspace />
      </AppShell>
    </Guard>
  );
}

type FeedFilter = "best" | "hot" | "new" | "top";

interface ReactionCounts {
  like: number;
  heart: number;
  haha: number;
  wow: number;
  sad: number;
}

interface CommunityComment {
  id: string;
  author: string;
  avatarColor: string;
  content: string;
  timeAgo: string;
}

interface CommunityPost {
  id: string;
  author: string;
  avatarColor: string;
  tag: string;
  timeAgo: string;
  content: string;
  reactions: ReactionCounts;
  userReaction?: keyof ReactionCounts;
  comments: CommunityComment[];
  sharesCount: number;
  isSaved?: boolean;
}

interface CommunityGroup {
  id: string;
  title: string;
  members: string;
  newPosts: number;
  joined: boolean;
  category: string;
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    author: "Tim Bakes",
    avatarColor: "bg-[#1A7F8E] text-white",
    tag: "Kecemasan",
    timeAgo: "1 jam lalu",
    content: "Halo sahabat semua. Ada yang punya saran praktis bagaimana mengatasi gelombang cemas mendadak saat di tempat kerja? Hari ini latihan pernapasan 4-7-8 dari HavenCare AI sangat membantu menstabilkan denyut nadiku.",
    reactions: { like: 24, heart: 42, haha: 2, wow: 8, sad: 1 },
    userReaction: "heart",
    sharesCount: 12,
    comments: [
      {
        id: "c1",
        author: "Sarah Andrews",
        avatarColor: "bg-[#8DA85E] text-white",
        content: "Membawa aromaterapi lavender dan minum air dingin perlahan juga sangat membantu saya saat grounding di meja kerja.",
        timeAgo: "45 mnt lalu",
      },
    ],
  },
  {
    id: "post-2",
    author: "Sarah Andrews",
    avatarColor: "bg-[#8DA85E] text-white",
    tag: "Tidur Berkualitas",
    timeAgo: "3 jam lalu",
    content: "Setelah rutin membatasi layar ponsel 1 jam sebelum tidur dan mencatat refleksi emosi di HavenCare, skor tidurku naik dari 5 jam menjadi 7.5 jam pulas. Pemulihan itu langkah kecil yang konsisten!",
    reactions: { like: 38, heart: 56, haha: 0, wow: 14, sad: 0 },
    sharesCount: 19,
    comments: [],
  },
  {
    id: "post-3",
    author: "Pejuang Tenang",
    avatarColor: "bg-[#E87934] text-white",
    tag: "Burnout",
    timeAgo: "5 jam lalu",
    content: "Mengakui bahwa kita lelah bukan berarti kita lemah. Belajar berkata 'tidak' pada beban yang melampaui kapasitas adalah bentuk cinta terbesar pada kesehatan mental sendiri.",
    reactions: { like: 62, heart: 89, haha: 1, wow: 5, sad: 2 },
    sharesCount: 31,
    comments: [
      {
        id: "c2",
        author: "Rian Pratama",
        avatarColor: "bg-[#9D8DF1] text-white",
        content: "Setuju sekali! Butuh waktu lama bagi saya untuk memahami batas kapasitas diri sendiri.",
        timeAgo: "2 jam lalu",
      },
    ],
  },
];

const INITIAL_GROUPS: CommunityGroup[] = [
  { id: "g1", title: "Pola Tidur & Ketenangan", members: "3.2k members", newPosts: 15, joined: true, category: "Istirahat" },
  { id: "g2", title: "Manajemen Stres & Cemas", members: "4.8k members", newPosts: 28, joined: true, category: "Kecemasan" },
  { id: "g3", title: "Mindfulness & Meditasi", members: "2.1k members", newPosts: 6, joined: false, category: "Kebugaran" },
  { id: "g4", title: "Dukungan Burnout Pekerja", members: "5.4k members", newPosts: 42, joined: false, category: "Karir" },
  { id: "g5", title: "Ruang Refleksi Lansia", members: "1.1k members", newPosts: 4, joined: false, category: "Keluarga" },
];

/**
 * CommunityWorkspace — Antarmuka Komunitas HavenCare ala X/Tweet & WhatsApp Image 6
 */
function CommunityWorkspace() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FeedFilter>("best");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [groups, setGroups] = useState<CommunityGroup[]>(INITIAL_GROUPS);

  // State Modal Post Baru
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState("Kecemasan");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // State Input Komentar
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const handleToggleReaction = (postId: string, reactionType: keyof ReactionCounts) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const currentRx = p.userReaction;
        const newReactions = { ...p.reactions };

        if (currentRx === reactionType) {
          // Batalkan reaksi
          newReactions[reactionType] = Math.max(0, newReactions[reactionType] - 1);
          return { ...p, reactions: newReactions, userReaction: undefined };
        } else {
          // Tambah reaksi baru, kurangi yang lama jika ada
          if (currentRx) {
            newReactions[currentRx] = Math.max(0, newReactions[currentRx] - 1);
          }
          newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
          return { ...p, reactions: newReactions, userReaction: reactionType };
        }
      })
    );
  };

  const handleToggleJoinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, joined: !g.joined } : g))
    );
  };

  const handleCreatePost = () => {
    if (!newContent.trim()) return;
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: isAnonymous ? "Sahabat Anonim" : (user?.displayName || "Pengguna HavenCare"),
      avatarColor: isAnonymous ? "bg-[#786A5E] text-white" : "bg-[#1A7F8E] text-white",
      tag: newTag,
      timeAgo: "Baru saja",
      content: newContent.trim(),
      reactions: { like: 1, heart: 1, haha: 0, wow: 0, sad: 0 },
      userReaction: "heart",
      sharesCount: 0,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewContent("");
    setShowCreateModal(false);
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const newComment: CommunityComment = {
          id: `comment-${Date.now()}`,
          author: user?.displayName || "Pengguna HavenCare",
          avatarColor: "bg-[#1A7F8E] text-white",
          content: commentText.trim(),
          timeAgo: "Baru saja",
        };
        return { ...p, comments: [...p.comments, newComment] };
      })
    );
    setCommentText("");
  };

  const filteredPosts = posts.filter((p) => {
    const query = searchQuery.toLowerCase();
    return p.content.toLowerCase().includes(query) || p.tag.toLowerCase().includes(query) || p.author.toLowerCase().includes(query);
  });

  return (
    <div className="w-full min-h-screen bg-[#FAF6EE] text-[#2C1D11] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto select-none font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & SEARCH BAR                                                */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-[28px] p-5 sm:p-6 border border-[#DCD7CE] shadow-xs mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1A7F8E]">
            <Users size={16} />
            <span>HavenCare Support Community</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#2C1D11] tracking-tight mt-0.5">
            Komunitas & Ruang Cerita Aman
          </h1>
          <p className="text-xs text-[#786A5E] mt-0.5">
            Berbagi pengalaman, saling menguatkan, dan belajar bersama dalam komunitas positif.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786A5E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik atau cerita..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full bg-[#FAF6EE] border border-[#DCD7CE] text-xs text-[#2C1D11] placeholder:text-[#786A5E]/60 focus:outline-none focus:border-[#1A7F8E]"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-full bg-[#2C1D11] hover:bg-[#3D2A1C] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <Plus size={15} />
            <span>Bagikan Cerita</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN LAYOUT (2 KOLOM: FEED KIRI + KOMUNITASKU KANAN)                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* KOLOM FEED UTAMA (8 KOLOM) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Segmented Control Tabs (Best Posts, Hot, New, Top) */}
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#DCD7CE] shadow-2xs">
            {(["best", "hot", "new", "top"] as const).map((tab) => {
              const isActive = filter === tab;
              const labels = {
                best: "Best Posts",
                hot: "Hot",
                new: "New",
                top: "Top",
              };
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 text-center",
                    isActive
                      ? "bg-[#1A7F8E] text-white shadow-xs"
                      : "text-[#786A5E] hover:text-[#2C1D11] hover:bg-[#FAF6EE]"
                  )}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {/* Feed Post List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-[26px] p-5 sm:p-6 border border-[#DCD7CE] shadow-xs space-y-3.5 hover:border-[#1A7F8E]/30 transition-all"
              >
                {/* Header Post: Avatar + Author + Tag + Waktu */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs", post.avatarColor)}>
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-extrabold text-[#2C1D11]">
                          {post.author}
                        </h3>
                        <span className="text-[10px] font-bold text-[#1A7F8E] bg-[#1A7F8E]/10 px-2 py-0.5 rounded-full">
                          {post.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#786A5E] mt-0.5">
                        {post.timeAgo}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    title="Menu"
                    className="w-8 h-8 rounded-full hover:bg-[#FAF6EE] text-[#786A5E] flex items-center justify-center"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                </div>

                {/* Post Content */}
                <p className="text-xs sm:text-sm text-[#2C1D11] leading-relaxed font-sans whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Reaction Picker Bar (Sesuai Referensi Gambar 6) */}
                <div className="pt-2 border-t border-[#DCD7CE]/60 flex items-center justify-between">
                  {/* Emoji Reactions Bar */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleReaction(post.id, "heart")}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all",
                        post.userReaction === "heart"
                          ? "bg-[#E06D6D]/15 text-[#E06D6D] border border-[#E06D6D]/30"
                          : "bg-[#FAF6EE] text-[#786A5E] hover:bg-[#FCEBDD]"
                      )}
                    >
                      <span>❤️</span>
                      <span className="text-[11px]">{post.reactions.heart}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleReaction(post.id, "like")}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all",
                        post.userReaction === "like"
                          ? "bg-[#1A7F8E]/15 text-[#1A7F8E] border border-[#1A7F8E]/30"
                          : "bg-[#FAF6EE] text-[#786A5E] hover:bg-[#EAF7F8]"
                      )}
                    >
                      <span>👍</span>
                      <span className="text-[11px]">{post.reactions.like}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleReaction(post.id, "wow")}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all",
                        post.userReaction === "wow"
                          ? "bg-[#F3C969]/20 text-[#8B670A] border border-[#F3C969]/40"
                          : "bg-[#FAF6EE] text-[#786A5E] hover:bg-[#FAF0ED]"
                      )}
                    >
                      <span>😮</span>
                      <span className="text-[11px]">{post.reactions.wow}</span>
                    </button>
                  </div>

                  {/* Actions: Komentar & Share */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="px-3 py-1 rounded-full bg-[#FAF6EE] hover:bg-[#EFECE6] text-xs font-semibold text-[#786A5E] flex items-center gap-1.5 transition-all"
                    >
                      <MessageSquare size={13} />
                      <span>{post.comments.length}</span>
                    </button>

                    <button
                      type="button"
                      className="p-1.5 rounded-full hover:bg-[#FAF6EE] text-[#786A5E] transition-all"
                      title="Bagikan"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Komentar Expandable List */}
                {activeCommentPostId === post.id && (
                  <div className="pt-3 border-t border-[#DCD7CE]/60 space-y-3 animate-in fade-in duration-150">
                    {post.comments.map((c) => (
                      <div key={c.id} className="p-3 rounded-2xl bg-[#FAF6EE] text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2C1D11]">{c.author}</span>
                          <span className="text-[10px] text-[#786A5E]">{c.timeAgo}</span>
                        </div>
                        <p className="text-[#2C1D11] leading-relaxed">{c.content}</p>
                      </div>
                    ))}

                    {/* Input Komentar Baru */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                        placeholder="Tulis tanggapan suportif..."
                        className="flex-1 px-4 py-2 rounded-full bg-[#FAF6EE] border border-[#DCD7CE] text-xs text-[#2C1D11] focus:outline-none focus:border-[#1A7F8E]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        className="w-8 h-8 rounded-full bg-[#1A7F8E] text-white flex items-center justify-center hover:bg-[#146875] shrink-0"
                      >
                        <Send size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* KOLOM KANAN: KOMUNITASKU & REKOMENDASI (4 KOLOM) */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Bagian Komunitasku (My Communities) */}
          <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-[#DCD7CE] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-[#2C1D11]">
                Komunitasku
              </h2>
              <span className="text-[11px] font-bold text-[#1A7F8E]">
                {groups.filter((g) => g.joined).length} Diikuti
              </span>
            </div>

            <div className="space-y-2.5">
              {groups
                .filter((g) => g.joined)
                .map((group) => (
                  <div
                    key={group.id}
                    className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#DCD7CE]/60 flex items-center justify-between gap-3 group hover:border-[#1A7F8E]/40 transition-all"
                  >
                    <div>
                      <p className="text-xs font-extrabold text-[#2C1D11]">
                        {group.title}
                      </p>
                      <p className="text-[10px] text-[#786A5E] mt-0.5">
                        {group.members} • {group.newPosts} Post Baru
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-[#8DA85E]/20 text-[#5F7836] px-2 py-0.5 rounded-full shrink-0">
                      Aktif
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Rekomendasi Komunitas untuk Diikuti */}
          <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-[#DCD7CE] shadow-xs space-y-3.5">
            <h2 className="text-sm font-extrabold text-[#2C1D11]">
              Rekomendasi Komunitas
            </h2>

            <div className="space-y-3">
              {groups
                .filter((g) => !g.joined)
                .map((group) => (
                  <div
                    key={group.id}
                    className="p-3 rounded-2xl border border-[#DCD7CE]/70 flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#2C1D11]">
                        {group.title}
                      </p>
                      <p className="text-[10px] text-[#786A5E]">
                        {group.members}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleJoinGroup(group.id)}
                      className="px-3 py-1 rounded-full bg-[#FAF6EE] hover:bg-[#1A7F8E] hover:text-white text-xs font-bold text-[#1A7F8E] border border-[#1A7F8E]/30 transition-all shrink-0 active:scale-95"
                    >
                      + Join
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Kartu Panduan Keamanan Komunitas */}
          <div className="bg-[#162831] text-white rounded-[28px] p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#38BDF8]">
              <ShieldCheck size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Pedoman Ruang Aman
              </h3>
            </div>
            <p className="text-[11px] text-white/80 leading-relaxed">
              Komunitas HavenCare dijaga untuk saling mendukung. Dilarang memberikan saran diagnosis medis atau resep obat mandiri.
            </p>
          </div>
        </aside>
      </div>

      {/* ========================================================================= */}
      {/* MODAL BUAT POSTINGAN BARU                                                 */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#162831]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#DCD7CE] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-[#2C1D11]">
                Bagikan Cerita atau Pertanyaan
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF6EE] text-[#786A5E] hover:text-[#2C1D11] flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* Pilihan Tag Topik */}
            <div>
              <label className="text-[11px] font-bold text-[#786A5E] block mb-1.5">
                Pilih Topik:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["Kecemasan", "Burnout", "Tidur Berkualitas", "Self-Care", "Mindfulness"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewTag(t)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold transition-all",
                      newTag === t
                        ? "bg-[#1A7F8E] text-white font-bold"
                        : "bg-[#FAF6EE] text-[#2C1D11] border border-[#DCD7CE]"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea Konten */}
            <div>
              <textarea
                rows={5}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Tuliskan cerita, perasaan, atau pertanyaan suportifmu di sini..."
                className="w-full p-4 rounded-2xl bg-[#FAF6EE] border border-[#DCD7CE] text-xs sm:text-sm text-[#2C1D11] placeholder:text-[#786A5E]/60 focus:outline-none focus:border-[#1A7F8E] font-sans resize-none"
              />
            </div>

            {/* Opsi Posting Anonim */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2C1D11]">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-[#1A7F8E] focus:ring-[#1A7F8E]"
                />
                <span>Posting sebagai Sahabat Anonim</span>
              </label>
            </div>

            {/* Tombol Kirim */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 rounded-full border border-[#DCD7CE] text-xs font-bold text-[#2C1D11]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCreatePost}
                disabled={!newContent.trim()}
                className="px-6 py-2.5 rounded-full bg-[#1A7F8E] text-white text-xs font-bold hover:bg-[#146875] disabled:opacity-40 transition-all shadow-xs"
              >
                Kirim Cerita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
