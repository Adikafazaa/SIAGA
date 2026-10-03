"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  MessageSquare,
  Moon,
  PhoneCall,
  Plus,
  Send,
  ShieldCheck,
  Smile,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FreudButton } from "@/components/ui/FreudButton";
import { Guard } from "@/features/auth/role-guard";
import { useAuth } from "@/features/auth/auth-provider";
import { useChatContext } from "@/features/chat/chat-context";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <Guard roles={["patient"]}>
      <AppShell>
        <DashboardWorkspace />
      </AppShell>
    </Guard>
  );
}

type MoodOption = "tenang" | "cukup_baik" | "cemas" | "lelah" | "tertekan";

interface MoodConfig {
  id: MoodOption;
  label: string;
  emoji: string;
  desc: string;
  color: string;
  badgeBg: string;
}

const MOODS: MoodConfig[] = [
  {
    id: "tenang",
    label: "Tenang",
    emoji: "😊",
    desc: "Pikiran jernih dan santai",
    color: "#8DA85E",
    badgeBg: "bg-[#8DA85E]/15 text-[#5F7836] border-[#8DA85E]/40",
  },
  {
    id: "cukup_baik",
    label: "Cukup Baik",
    emoji: "😌",
    desc: "Kondisi stabil & terkendali",
    color: "#F3C969",
    badgeBg: "bg-[#F3C969]/20 text-[#8B670A] border-[#F3C969]/50",
  },
  {
    id: "cemas",
    label: "Cemas",
    emoji: "😰",
    desc: "Ada rasa khawatir atau tegang",
    color: "#E87934",
    badgeBg: "bg-[#E87934]/15 text-[#B24B0D] border-[#E87934]/40",
  },
  {
    id: "lelah",
    label: "Lelah",
    emoji: "🥱",
    desc: "Energi menurun, butuh istirahat",
    color: "#9D8DF1",
    badgeBg: "bg-[#9D8DF1]/15 text-[#5A46BC] border-[#9D8DF1]/40",
  },
  {
    id: "tertekan",
    label: "Sangat Tertekan",
    emoji: "🆘",
    desc: "Butuh bantuan & dukungan segera",
    color: "#E06D6D",
    badgeBg: "bg-[#E06D6D]/15 text-[#A82626] border-[#E06D6D]/40",
  },
];

const PROMPT_SUGGESTIONS = [
  { label: "🌱 Bantu aku mengurai cemas", prompt: "Halo HavenCare AI, aku sedang merasa cemas hari ini. Bisakah bantu aku menguraikannya?" },
  { label: "🌬️ Latihan pernapasan 4-7-8", prompt: "Aku ingin melakukan latihan pernapasan 4-7-8 untuk menenangkan diri." },
  { label: "📝 Refleksi emosi hari ini", prompt: "Bisakah kamu membimbingku merefleksikan emosi yang sedang kurasakan?" },
  { label: "📊 Evaluasi pola tidur & energi", prompt: "Bagaimana cara meningkatkan kualitas tidur dan enerjiku minggu ini?" },
];

function DashboardWorkspace() {
  const router = useRouter();
  const { user } = useAuth();
  const chat = useChatContext();

  const [selectedMood, setSelectedMood] = useState<MoodOption | null>("tenang");
  const [quickInput, setQuickInput] = useState("");
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const userName = user?.displayName || "Pengguna";
  const todayFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const handleSelectMood = (mood: MoodOption) => {
    setSelectedMood(mood);
    if (mood === "tertekan") {
      setShowCrisisModal(true);
    }
  };

  const handleSendQuickPrompt = (text: string) => {
    if (!text.trim()) return;
    void chat.createNewSession().then(() => {
      void chat.send(text);
      router.push("/chat");
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF6EE] text-[#2C1D11] p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* 1. HEADER: SAPAAN PERSONAL & QUICK STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-6 rounded-[28px] border border-[#DCD7CE] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#786A5E] mb-1">
            <Calendar size={14} className="text-[#E87934]" />
            <span>{todayFormatted}</span>
            <span className="w-1 h-1 rounded-full bg-[#DCD7CE]" />
            <span className="inline-flex items-center gap-1 text-[#8DA85E] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#8DA85E] animate-pulse" />
              Sistem Aktif & Terlindungi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C1D11] tracking-tight">
            Hai, {userName} <span className="inline-block hover:rotate-12 transition-transform">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#786A5E] mt-1">
            HavenCare AI siap mendampingi refleksi pikiran dan kesehatan mentalmu hari ini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCrisisModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FAF0ED] text-[#E06D6D] border border-[#E06D6D]/30 hover:bg-[#FBE4E0] active:scale-95 transition-all text-xs font-bold shadow-xs"
          >
            <PhoneCall size={14} className="text-[#E06D6D]" />
            <span>Hotline 119 SOS</span>
          </button>

          <Link
            href="/profile"
            className="flex items-center gap-2 p-2 sm:px-4 sm:py-2.5 rounded-full bg-white border border-[#DCD7CE] hover:border-[#E87934] transition-all text-xs font-bold shadow-xs text-[#2C1D11]"
          >
            <div className="w-6 h-6 rounded-full bg-[#FAF6EE] text-[#2C1D11] flex items-center justify-center text-[10px] font-bold border border-[#DCD7CE]">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline">Profil Saya</span>
          </Link>
        </div>
      </div>

      {/* 2. GRID UTAMA: CHECK-IN EMOSI (7 COLS) + HEALTH OVERVIEW (5 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHECK-IN EMOSI HARIAN (7 Kolom) */}
        <section className="lg:col-span-7 bg-white rounded-[28px] p-6 sm:p-7 border border-[#DCD7CE] shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8DA85E]" />
                <h2 className="text-base sm:text-lg font-extrabold text-[#2C1D11]">
                  Check-in Suasana Hati
                </h2>
              </div>
              <span className="text-[11px] font-medium text-[#786A5E] bg-[#FAF6EE] px-2.5 py-1 rounded-full border border-[#DCD7CE]">
                Self-Report
              </span>
            </div>
            <p className="text-xs text-[#786A5E] mt-1.5 leading-relaxed">
              Bagaimana suasana hati dan pikiranmu saat ini? Memilih kondisi membantumu mengenali kebutuhan emosi secara sadar.
            </p>
          </div>

          {/* Opsi Kartu Emosi */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {MOODS.map((m) => {
              const isSelected = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectMood(m.id)}
                  className={cn(
                    "p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5",
                    "hover:scale-[1.02] active:scale-95",
                    isSelected
                      ? "bg-[#FAF6EE] border-[#2C1D11] shadow-md ring-2 ring-[#2C1D11]/15 font-bold"
                      : "bg-white border-[#DCD7CE]/70 hover:border-[#DCD7CE] hover:bg-[#FAF6EE]/50"
                  )}
                >
                  <span className="text-2xl sm:text-3xl">{m.emoji}</span>
                  <span className="text-[11px] text-[#2C1D11] leading-tight mt-0.5">
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Rekomendasi Langkah Berdasarkan Pilihan */}
          {selectedMood && (
            <div className="bg-[#FAF6EE] rounded-2xl p-4 border border-[#DCD7CE]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#DCD7CE] flex items-center justify-center text-xl shrink-0 shadow-2xs">
                  {MOODS.find((m) => m.id === selectedMood)?.emoji}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2C1D11]">
                    Kamu merasa: {MOODS.find((m) => m.id === selectedMood)?.label}
                  </p>
                  <p className="text-[11px] text-[#786A5E]">
                    {MOODS.find((m) => m.id === selectedMood)?.desc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const m = MOODS.find((item) => item.id === selectedMood);
                  handleSendQuickPrompt(`Aku sedang merasa ${m?.label}. Bisakah kita berbicara tentang hal ini?`);
                }}
                className="px-4 py-2 rounded-xl bg-[#2C1D11] text-white hover:bg-[#3D2A1C] text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Refleksikan</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </section>

        {/* HEALTH OVERVIEW (5 Kolom) - Sesuai Mockup Referensi WhatsApp Image 4 */}
        <section className="lg:col-span-5 bg-white rounded-[28px] p-6 sm:p-7 border border-[#DCD7CE] shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-[#8DA85E]" />
              <h2 className="text-base font-extrabold text-[#2C1D11]">Ringkasan Kesejahteraan</h2>
            </div>
            <Link
              href="/assessments"
              className="text-[11px] font-bold text-[#E87934] hover:underline flex items-center gap-1"
            >
              <span>Asesmen</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Semicircular Energy Score Indicator */}
          <div className="bg-gradient-to-b from-[#FAF6EE] to-white rounded-2xl p-4 border border-[#DCD7CE]/60 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="relative w-36 h-20 flex items-end justify-center mb-1">
              <div className="absolute inset-0 border-[10px] border-[#DCD7CE]/40 rounded-t-full border-b-0" />
              <div
                className="absolute inset-0 border-[10px] border-[#8DA85E] rounded-t-full border-b-0"
                style={{ clipPath: "polygon(0 0, 85% 0, 85% 100%, 0 100%)" }}
              />
              <div className="flex flex-col items-center pb-1">
                <span className="text-2xl font-black text-[#2C1D11]">82</span>
                <span className="text-[10px] text-[#786A5E] font-bold -mt-1">/ 100</span>
              </div>
            </div>
            <p className="text-xs font-bold text-[#2C1D11]">Indeks Energi Optimal</p>
            <p className="text-[11px] text-[#786A5E] mt-0.5">
              Ritme emosi dan istirahat Anda seimbang minggu ini
            </p>
          </div>

          {/* 3 Metric Pills: Heart, Sleep, Stress */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-[#FAF6EE] rounded-xl p-2.5 text-center border border-[#DCD7CE]/60">
              <div className="flex items-center justify-center gap-1 text-[#E06D6D] text-[11px] font-bold mb-0.5">
                <Heart size={12} className="fill-[#E06D6D]" />
                <span>Nadi</span>
              </div>
              <p className="text-xs font-extrabold text-[#2C1D11]">72 <span className="text-[10px] font-normal text-[#786A5E]">bpm</span></p>
            </div>

            <div className="bg-[#FAF6EE] rounded-xl p-2.5 text-center border border-[#DCD7CE]/60">
              <div className="flex items-center justify-center gap-1 text-[#9D8DF1] text-[11px] font-bold mb-0.5">
                <Moon size={12} className="fill-[#9D8DF1]" />
                <span>Tidur</span>
              </div>
              <p className="text-xs font-extrabold text-[#2C1D11]">7j 45m</p>
            </div>

            <div className="bg-[#FAF6EE] rounded-xl p-2.5 text-center border border-[#DCD7CE]/60">
              <div className="flex items-center justify-center gap-1 text-[#8DA85E] text-[11px] font-bold mb-0.5">
                <Zap size={12} className="fill-[#8DA85E]" />
                <span>Stres</span>
              </div>
              <p className="text-xs font-extrabold text-[#2C1D11]">28 <span className="text-[10px] font-normal text-[#8DA85E]">rendah</span></p>
            </div>
          </div>
        </section>
      </div>

      {/* 3. ASSISTANT HERO CARD (12 COLS) - Sesuai Foto WhatsApp Image 4 */}
      <section className="bg-gradient-to-r from-[#EAF7F8]/80 via-white to-[#FAF6EE] rounded-[32px] p-6 sm:p-8 border border-[#D8E5E3] shadow-sm relative overflow-hidden">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#1A7F8E] via-[#0B5963] to-[#162831] p-1 shadow-lg ring-4 ring-[#1A7F8E]/20 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#162831] flex items-center justify-center relative overflow-hidden">
              <div className="w-12 h-8 rounded-full bg-[#1A7F8E]/30 border border-[#1A7F8E] flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-ping" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
              </div>
              <div className="absolute top-1 right-2 w-5 h-5 rounded-full bg-[#8DA85E] text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                +
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2C1D11] tracking-tight">
              Ada yang ingin kamu ceritakan atau renungkan hari ini?
            </h2>
            <p className="text-xs sm:text-sm text-[#786A5E] mt-1 max-w-xl mx-auto">
              HavenCare AI hadir sebagai ruang reflektif yang aman, mendengarkan tanpa menghakimi dengan privasi penuh.
            </p>
          </div>

          {/* Prompt Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {PROMPT_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuickPrompt(item.prompt)}
                className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-xs font-semibold text-[#2C1D11] border border-[#DCD7CE] shadow-2xs hover:border-[#1A7F8E] transition-all hover:scale-105 active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick Input Bar leading to /chat */}
          <div className="w-full max-w-xl relative mt-2">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && quickInput.trim()) {
                  handleSendQuickPrompt(quickInput);
                }
              }}
              placeholder="Ketik apa saja yang terlintas di pikiranmu..."
              className="w-full pl-5 pr-14 py-3.5 rounded-full bg-white border border-[#DCD7CE] text-xs sm:text-sm text-[#2C1D11] placeholder:text-[#786A5E]/60 shadow-xs focus:outline-none focus:border-[#1A7F8E] focus:ring-2 focus:ring-[#1A7F8E]/20 font-sans"
            />
            <button
              type="button"
              onClick={() => handleSendQuickPrompt(quickInput)}
              disabled={!quickInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#1A7F8E] text-white flex items-center justify-center hover:bg-[#146875] disabled:opacity-40 transition-all shadow-xs active:scale-95"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. BARIS 3: RIWAYAT KONSULTASI (7 COLS) + JADWAL & PRIVASI (5 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Aktivitas Sesi Konseling Terakhir (7 Kolom) */}
        <section className="lg:col-span-7 bg-white rounded-[28px] p-6 sm:p-7 border border-[#DCD7CE] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-[#E87934]" />
              <h2 className="text-base font-extrabold text-[#2C1D11]">
                Sesi Percakapan Aktif
              </h2>
            </div>
            <Link
              href="/chat"
              className="text-xs font-bold text-[#E87934] hover:underline flex items-center gap-1"
            >
              <span>Buka Ruang Chat</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-2.5">
            {chat.sessions.length === 0 ? (
              <div className="text-center py-8 px-4 bg-[#FAF6EE] rounded-2xl border border-dashed border-[#DCD7CE]">
                <p className="text-xs font-bold text-[#2C1D11]">Belum ada riwayat percakapan</p>
                <p className="text-[11px] text-[#786A5E] mt-1">
                  Mulai sesi pertama Anda bersama HavenCare AI untuk mencurahkan pikiran.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/chat")}
                  className="mt-3 px-4 py-2 rounded-full bg-[#2C1D11] text-white text-xs font-bold hover:bg-[#3D2A1C] transition-all"
                >
                  + Mulai Sesi Baru
                </button>
              </div>
            ) : (
              chat.sessions.slice(0, 3).map((s) => (
                <div
                  key={s.sessionId}
                  onClick={() => {
                    chat.selectSession(s.sessionId);
                    router.push("/chat");
                  }}
                  className="p-4 rounded-2xl border border-[#DCD7CE]/70 bg-[#FAF6EE]/50 hover:bg-[#FAF6EE] hover:border-[#E87934]/40 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-white border border-[#DCD7CE] text-[#E87934] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <MessageSquare size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#2C1D11] truncate">
                        {s.title || "Sesi Refleksi Harian"}
                      </p>
                      <p className="text-[11px] text-[#786A5E] flex items-center gap-1 mt-0.5">
                        <Clock size={11} />
                        <span>{formatRelative(s.updatedAt)}</span>
                        <span>•</span>
                        <span>{s.messageCount} pesan</span>
                      </p>
                    </div>
                  </div>

                  <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#2C1D11]/60 group-hover:text-[#E87934] group-hover:translate-x-0.5 transition-all shrink-0">
                    <ArrowRight size={14} />
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Jadwal Dokter & Komitmen Privasi (5 Kolom) */}
        <section className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-[28px] p-6 border border-[#DCD7CE] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={17} className="text-[#1A7F8E]" />
                <h3 className="text-sm font-extrabold text-[#2C1D11]">Jadwal Konsultasi Dokter</h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#DCD7CE]/60 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8DA85E] bg-[#8DA85E]/15 px-2 py-0.5 rounded-full">
                    Rujukan Tersedia
                  </span>
                  <p className="text-xs font-bold text-[#2C1D11] mt-1.5">
                    dr. Savira Wardhani, Sp.KJ
                  </p>
                  <p className="text-[11px] text-[#786A5E]">
                    Psikiatri Dewasa • RS Hermina Pasteur
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-[#786A5E] leading-relaxed pt-1 border-t border-[#DCD7CE]/60">
                Jadwal telekonsultasi dapat diatur melalui rujukan klinis HavenCare.
              </p>
            </div>
          </div>

          <div className="bg-[#162831] text-white rounded-[28px] p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#38BDF8]">
              <ShieldCheck size={18} />
              <h3 className="text-xs font-bold tracking-wide uppercase">
                Jaminan Privasi Zero-Plaintext
              </h3>
            </div>
            <p className="text-[11px] text-white/80 leading-relaxed">
              Seluruh percakapan Anda diproses dengan enkripsi end-to-end tanpa penyimpanan plaintext. HavenCare AI adalah asisten reflektif & Psychological First Aid, bukan pengganti diagnosis medis resmi.
            </p>
            <div className="flex items-center justify-between pt-1 text-[10px] text-white/50 border-t border-white/10">
              <span>Guardrail Aktif (L0 - L3)</span>
              <span className="text-[#8DA85E] font-bold">Terkonfirmasi Aman</span>
            </div>
          </div>
        </section>
      </div>

      {/* CRISIS OVERRIDE MODAL */}
      {showCrisisModal && (
        <div className="fixed inset-0 z-50 bg-[#162831]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E06D6D]/40 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-[#E06D6D]">
              <div className="w-12 h-12 rounded-2xl bg-[#E06D6D]/15 flex items-center justify-center shrink-0">
                <AlertCircle size={28} />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#2C1D11]">
                  Kamu Tidak Sendirian
                </h3>
                <p className="text-xs text-[#786A5E]">
                  Bantuan profesional dan dukungan krisis siap mendampingimu 24 jam.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF0ED] border border-[#E06D6D]/30 space-y-2">
              <p className="text-xs font-bold text-[#A82626]">
                Layanan Gawat Darurat & Hotline Konseling:
              </p>
              <ul className="text-xs text-[#2C1D11] space-y-1.5">
                <li className="flex items-center justify-between font-semibold">
                  <span>📞 Hotline Krisis Kemenkes:</span>
                  <a href="tel:119" className="text-[#E06D6D] underline font-bold">119 ext 8</a>
                </li>
                <li className="flex items-center justify-between font-semibold">
                  <span>💬 WhatsApp Sejiwa:</span>
                  <a href="https://wa.me/6281119224419" target="_blank" rel="noreferrer" className="text-[#1A7F8E] underline font-bold">0811-1922-4419</a>
                </li>
                <li className="flex items-center justify-between font-semibold">
                  <span>🏥 UGD Psikiatri Terdekat:</span>
                  <span className="font-bold">Hubungi 112</span>
                </li>
              </ul>
            </div>

            <p className="text-[11px] text-[#786A5E] leading-relaxed">
              Jika kamu atau orang di sekitarmu sedang dalam krisis atau bahaya langsung, mohon segera hubungi nomor di atas atau kunjungi instalasi gawat darurat rumah sakit terdekat.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCrisisModal(false)}
                className="px-5 py-2.5 rounded-full border border-[#DCD7CE] text-xs font-bold text-[#2C1D11] hover:bg-[#FAF6EE] transition-all"
              >
                Tutup
              </button>
              <a
                href="tel:119"
                className="px-6 py-2.5 rounded-full bg-[#E06D6D] text-white text-xs font-bold hover:bg-[#c95959] transition-all shadow-sm"
              >
                Telepon 119 Sekarang
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
