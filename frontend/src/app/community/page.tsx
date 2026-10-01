"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Heart,
  MessageSquare,
  Plus,
  Send,
  Smile,
  Sparkles,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FreudButton } from "@/components/ui/FreudButton";
import { FreudFlowerLoader } from "@/components/ui/FreudFlowerLoader";
import { Guard } from "@/features/auth/role-guard";
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

interface CommunityStory {
  id: string;
  authorAlias: string;
  avatarColor: string;
  tag: string;
  tagColor: string;
  timeAgo: string;
  content: string;
  hugsCount: number;
  strengthCount: number;
  hasHugged?: boolean;
  hasStrengthened?: boolean;
}

const INITIAL_STORIES: CommunityStory[] = [
  {
    id: "story-1",
    authorAlias: "Pejuang Tenang",
    avatarColor: "bg-[#8DA85E] text-white",
    tag: "Kecemasan",
    tagColor: "bg-[#8DA85E]/15 text-[#8DA85E] border-[#8DA85E]/30",
    timeAgo: "2 jam lalu",
    content:
      "Hari ini aku berhasil mempraktikkan latihan pernapasan 4-7-8 yang disarankan Doctor Freud saat panik datang di kantor. Rasanya melegakan sekali bisa menenangkan diri tanpa harus menghakimi apa yang sedang kurasakan. Terima kasih untuk ruang aman ini.",
    hugsCount: 34,
    strengthCount: 18,
  },
  {
    id: "story-2",
    authorAlias: "Kawan Bernapas",
    avatarColor: "bg-[#9D8DF1] text-white",
    tag: "Burnout",
    tagColor: "bg-[#9D8DF1]/15 text-[#9D8DF1] border-[#9D8DF1]/30",
    timeAgo: "5 jam lalu",
    content:
      "Setelah berminggu-minggu merasa lelah emosional dan kehilangan motivasi, akhirnya hari ini aku bisa beristirahat penuh tanpa rasa bersalah. Belajar menerima bahwa pulih bukanlah garis lurus, melainkan langkah kecil setiap hari.",
    hugsCount: 52,
    strengthCount: 29,
  },
  {
    id: "story-3",
    authorAlias: "Penjelajah Malam",
    avatarColor: "bg-[#E87934] text-white",
    tag: "Self-Care",
    tagColor: "bg-[#E87934]/15 text-[#E87934] border-[#E87934]/30",
    timeAgo: "1 hari lalu",
    content:
      "Skrining asesmen rutin membantuku menyadari pola overthinking sebelum tidur. Mengobrol dengan PsychoBot malam hari memberiku sudut pandang reflektif yang tidak menghakimi.",
    hugsCount: 41,
    strengthCount: 23,
  },
];

const SATISFACTION_MOODS = [
  { level: 5, emoji: "😊", label: "Sangat Baik" },
  { level: 4, emoji: "🙂", label: "Baik" },
  { level: 3, emoji: "😐", label: "Netral" },
  { level: 2, emoji: "🙁", label: "Kurang" },
  { level: 1, emoji: "😞", label: "Buruk" },
];

function CommunityWorkspace() {
  const [activeTab, setActiveTab] = useState<"stories" | "feedback">("stories");
  const [stories, setStories] = useState<CommunityStory[]>(INITIAL_STORIES);

  // State Modal Tambah Cerita Anonim
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlias, setNewAlias] = useState("Sobat Pulih");
  const [newTag, setNewTag] = useState("Self-Care");
  const [newContent, setNewContent] = useState("");

  // State Form Umpan Balik (Feedback)
  const [selectedMood, setSelectedMood] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);
  const [isFeedbackSuccess, setIsFeedbackSuccess] = useState(false);

  // Toggle Reaksi Pelukan Hangat
  const handleToggleHug = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => {
        if (s.id !== storyId) return s;
        const nextState = !s.hasHugged;
        return {
          ...s,
          hasHugged: nextState,
          hugsCount: nextState ? s.hugsCount + 1 : s.hugsCount - 1,
        };
      })
    );
  };

  // Toggle Reaksi Menguatkan
  const handleToggleStrength = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => {
        if (s.id !== storyId) return s;
        const nextState = !s.hasStrengthened;
        return {
          ...s,
          hasStrengthened: nextState,
          strengthCount: nextState ? s.strengthCount + 1 : s.strengthCount - 1,
        };
      })
    );
  };

  // Kirim Cerita Anonim Baru
  const handlePostStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newEntry: CommunityStory = {
      id: `story-${Date.now()}`,
      authorAlias: newAlias.trim() || "Anonim Empatis",
      avatarColor: "bg-[#8DA85E] text-white",
      tag: newTag,
      tagColor: "bg-peach text-orange border-orange/30",
      timeAgo: "Baru saja",
      content: newContent.trim(),
      hugsCount: 1,
      strengthCount: 1,
    };

    setStories([newEntry, ...stories]);
    setNewContent("");
    setIsModalOpen(false);
  };

  // Kirim Umpan Balik
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsFeedbackSubmitting(true);
    setTimeout(() => {
      setIsFeedbackSubmitting(false);
      setIsFeedbackSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-cream py-8 sm:py-12 px-4 sm:px-6 select-none font-sans text-espresso">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ============================================================= */}
        {/* HEADER RUANG DUKUNGAN KOMUNITAS                               */}
        {/* ============================================================= */}
        <div className="space-y-3 pb-2 border-b border-sand/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-espresso">
                Ruang Dukungan Komunitas
              </h1>
              <p className="text-xs sm:text-sm text-warm-muted mt-1 leading-relaxed max-w-xl">
                Ruang aman anonim untuk saling berbagi pengalaman, pemulihan mental, dan memberi masukan demi layanan yang lebih baik.
              </p>
            </div>

            {/* Tab Switcher Pills Kapsul Membulat Penuh */}
            <div className="inline-flex rounded-full bg-white border border-sand/70 p-1 shadow-2xs shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("stories")}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 flex items-center gap-2",
                  activeTab === "stories"
                    ? "bg-espresso text-cream shadow-sm"
                    : "text-warm-muted hover:text-espresso"
                )}
              >
                <MessageSquare size={14} />
                <span>Berbagi Pengalaman</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("feedback");
                  setIsFeedbackSuccess(false);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 flex items-center gap-2",
                  activeTab === "feedback"
                    ? "bg-espresso text-cream shadow-sm"
                    : "text-warm-muted hover:text-espresso"
                )}
              >
                <Sparkles size={14} className={activeTab === "feedback" ? "fill-gold text-gold" : ""} />
                <span>Umpan Balik</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* TAB 1: BERBAGI PENGALAMAN (Stories & Empathy Feed)             */}
        {/* ============================================================= */}
        {activeTab === "stories" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Header Feed Cerita & Tombol Buat Cerita Baru */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">
                Cerita Pemulihan &amp; Refleksi ({stories.length})
              </span>

              <FreudButton
                variant="espresso"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus size={15} />}
                className="shadow-sm"
              >
                + Tulis Cerita Baru (Anonim)
              </FreudButton>
            </div>

            {/* Daftar Feed Kartu Cerita Komunitas */}
            <div className="space-y-4">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-2xl sm:rounded-[24px] p-5 sm:p-6 border border-[#DCD7CE] shadow-[0_4px_20px_rgba(44,29,17,0.04)] space-y-4 text-left"
                >
                  {/* Header Kartu: Avatar Anonim + Nama Samaran + Waktu + Badge Emosi */}
                  <div className="flex items-center justify-between gap-3 border-b border-sand/30 pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs shrink-0",
                          story.avatarColor
                        )}
                      >
                        {story.authorAlias.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="leading-tight">
                        <h4 className="text-xs sm:text-sm font-bold text-espresso">
                          {story.authorAlias}
                        </h4>
                        <span className="text-[10px] text-warm-muted font-mono">
                          {story.timeAgo}
                        </span>
                      </div>
                    </div>

                    {/* Badge Pil Kategori Emosi */}
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[11px] font-bold border",
                        story.tagColor
                      )}
                    >
                      {story.tag}
                    </span>
                  </div>

                  {/* Isi Konten Cerita */}
                  <p className="text-xs sm:text-sm text-espresso/90 leading-relaxed font-sans">
                    {story.content}
                  </p>

                  {/* Tombol Reaksi Interaktif dengan Animasi Spring */}
                  <div className="flex items-center gap-3 pt-1">
                    {/* Reaksi 1: Pelukan Hangat */}
                    <button
                      type="button"
                      onClick={() => handleToggleHug(story.id)}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all duration-150 select-none",
                        "flex items-center gap-1.5 active:scale-90 hover:scale-105",
                        story.hasHugged
                          ? "bg-peach border-orange text-orange font-bold shadow-2xs"
                          : "bg-cream/60 border-sand/60 text-espresso/75 hover:bg-cream"
                      )}
                    >
                      <span>🫂 Pelukan Hangat</span>
                      <span className="font-mono text-[11px] font-bold">
                        ({story.hugsCount})
                      </span>
                    </button>

                    {/* Reaksi 2: Menguatkan */}
                    <button
                      type="button"
                      onClick={() => handleToggleStrength(story.id)}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all duration-150 select-none",
                        "flex items-center gap-1.5 active:scale-90 hover:scale-105",
                        story.hasStrengthened
                          ? "bg-sage/20 border-sage text-sage font-bold shadow-2xs"
                          : "bg-cream/60 border-sand/60 text-espresso/75 hover:bg-cream"
                      )}
                    >
                      <span>💚 Menguatkan</span>
                      <span className="font-mono text-[11px] font-bold">
                        ({story.strengthCount})
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 2: UMPAN BALIK (Feedback Form)                            */}
        {/* ============================================================= */}
        {activeTab === "feedback" && (
          <div className="animate-in fade-in duration-200 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-[24px] p-6 sm:p-8 border border-[#DCD7CE] shadow-[0_4px_20px_rgba(44,29,17,0.05)] space-y-6">
              {isFeedbackSuccess ? (
                /* State Sukses Setelah Kirim Feedback */
                <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-full bg-sage/20 text-sage flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-espresso">
                    Terima Kasih atas Masukan Berharga Anda!
                  </h3>
                  <p className="text-xs text-warm-muted leading-relaxed max-w-md mx-auto">
                    Umpan balik Anda sangat berarti bagi tim pengembang dan dewan klinisi kami untuk terus menyempurnakan empati serta keandalan PsychoBot.
                  </p>
                  <FreudButton
                    variant="espresso"
                    size="sm"
                    onClick={() => {
                      setIsFeedbackSuccess(false);
                      setFeedbackText("");
                    }}
                  >
                    Kirim Masukan Lain
                  </FreudButton>
                </div>
              ) : (
                /* Formulir Feedback Interaktif */
                <form onSubmit={handleSubmitFeedback} className="space-y-6 text-left">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-espresso">
                      Bagaimana Pengalaman Anda Menggunakan Platform?
                    </h3>
                    <p className="text-xs text-warm-muted">
                      Pilih emotikon yang paling mewakili kepuasan Anda saat berinteraksi dengan AI Companion.
                    </p>
                  </div>

                  {/* 5 Tombol Lingkaran Emotikon Mood 3D */}
                  <div className="flex items-center justify-between sm:justify-around gap-2 pt-1">
                    {SATISFACTION_MOODS.map((m) => {
                      const isSelected = selectedMood === m.level;

                      return (
                        <button
                          key={m.level}
                          type="button"
                          onClick={() => setSelectedMood(m.level)}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-150",
                            "hover:scale-110 active:scale-95 focus-visible:outline-none",
                            isSelected
                              ? "bg-sage/15 border-2 border-sage shadow-xs scale-105"
                              : "bg-cream/70 border border-sand/50 hover:bg-cream"
                          )}
                        >
                          <span className="text-2xl sm:text-3xl select-none">{m.emoji}</span>
                          <span className="text-[10px] font-bold text-espresso/80">
                            {m.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bidang Teks Masukan (Textarea) */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="feedback-input"
                      className="text-xs font-bold text-espresso block"
                    >
                      Saran, Kritik, atau Kendala:
                    </label>
                    <textarea
                      id="feedback-input"
                      rows={4}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Tuliskan saran atau kendala yang Anda alami saat menggunakan platform ini..."
                      required
                      className={cn(
                        "w-full rounded-2xl border border-sand bg-[#FAF9F5] p-4 text-xs sm:text-sm text-espresso font-sans",
                        "placeholder:text-warm-muted/60 focus:outline-none focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/20"
                      )}
                    />
                  </div>

                  {/* Tombol Kirim Umpan Balik */}
                  <div className="flex justify-end pt-2">
                    <FreudButton
                      variant="espresso"
                      size="md"
                      type="submit"
                      disabled={isFeedbackSubmitting || !feedbackText.trim()}
                      leftIcon={
                        isFeedbackSubmitting ? (
                          <FreudFlowerLoader size={16} />
                        ) : (
                          <Send size={15} />
                        )
                      }
                    >
                      {isFeedbackSubmitting ? "Mengirimkan…" : "Kirim Umpan Balik"}
                    </FreudButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================= */}
      {/* MODAL FORM TULIS CERITA ANONIM BARU                           */}
      {/* ============================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg p-6 sm:p-7 bg-white rounded-[28px] border border-sand shadow-2xl text-espresso space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-sand/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange animate-pulse" />
                <h3 className="text-base font-bold text-espresso">
                  Tulis Cerita Refleksi (Anonim)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-warm-muted hover:bg-sand/40"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePostStory} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-warm-muted block mb-1">
                    Nama Samaran (Anonim):
                  </label>
                  <input
                    type="text"
                    value={newAlias}
                    onChange={(e) => setNewAlias(e.target.value)}
                    placeholder="Contoh: Kawan Sabar"
                    className="w-full rounded-xl border border-sand bg-cream/40 px-3.5 py-2 text-xs text-espresso focus:outline-none focus:border-orange"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-warm-muted block mb-1">
                    Topik Emosi:
                  </label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full rounded-xl border border-sand bg-cream/40 px-3 py-2 text-xs text-espresso focus:outline-none focus:border-orange"
                  >
                    <option value="Self-Care">Self-Care</option>
                    <option value="Kecemasan">Kecemasan</option>
                    <option value="Burnout">Burnout</option>
                    <option value="Duka & Kehilangan">Duka &amp; Kehilangan</option>
                    <option value="Insomnia">Insomnia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-warm-muted block mb-1">
                  Isi Cerita / Pengalaman:
                </label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Bagikan apa yang Anda pelajari, bagaimana Anda bertahan, atau kata-kata penyemangat untuk sesama pejuang..."
                  required
                  className="w-full rounded-xl border border-sand bg-cream/40 p-3.5 text-xs text-espresso focus:outline-none focus:border-orange"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-warm-muted hover:text-espresso"
                >
                  Batal
                </button>
                <FreudButton variant="espresso" size="sm" type="submit">
                  Bagikan Cerita
                </FreudButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
