"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Check,
  CheckCircle2,
  CornerDownLeft,
  Headphones,
  Info,
  MessageSquare,
  Mic,
  PhoneCall,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShieldX,
  Smile,
  Sparkles,
  Volume2,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ClinicalInsightPanel } from "@/components/layout/ClinicalInsightPanel";
import { SessionDrawer } from "@/components/layout/SessionDrawer";
import { InlineFreudScoreCard } from "@/components/chat/InlineFreudScoreCard";
import { DecisionBadge } from "@/components/ui/DecisionBadge";
import { FreudFlowerLoader } from "@/components/ui/FreudFlowerLoader";
import { AudioWaveformPlayer } from "@/components/ui/AudioWaveformPlayer";
import { Guard } from "@/features/auth/role-guard";
import { useAuth } from "@/features/auth/auth-provider";
import { useChatContext } from "@/features/chat/chat-context";
import { formatRelative, formatTime } from "@/lib/format";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  return (
    <Guard roles={["patient"]}>
      <AppShell>
        <ChatRealWorkspace />
      </AppShell>
    </Guard>
  );
}

const QUICK_MOODS = [
  { emoji: "😊", label: "Tenang", text: "Aku merasa tenang dan ingin merefleksikan hariku." },
  { emoji: "😌", label: "Cukup Baik", text: "Kondisiku cukup stabil hari ini." },
  { emoji: "😰", label: "Cemas", text: "Aku merasa agak cemas dan butuh teman mengurai pikiran." },
  { emoji: "🥱", label: "Lelah", text: "Aku merasa lelah secara emosional dan butuh ruang istirahat." },
  { emoji: "🆘", label: "Butuh Bantuan", text: "Aku merasa sangat tertekan dan butuh bantuan segera." },
];

/**
 * ChatRealWorkspace — Antarmuka Konseling 4-Kolom HavenCare AI
 *
 * Arsitektur:
 * - Kolom 1: LeftRailNav (w-[72px] Espresso diatur oleh AppShell)
 * - Kolom 2: SessionDrawer (w-[300px] dengan tab filter All/Active/Archived & pencarian sesi)
 * - Kolom 3: Central Chat Canvas (flex-1 dengan Welcome Banner, Quick Mood, Stream & Composer)
 * - Kolom 4: ClinicalInsightPanel (w-[320px] hidden xl:flex dengan Tren Skor, DPJP & Latihan Pernapasan)
 */
function ChatRealWorkspace() {
  const { user } = useAuth();
  const chat = useChatContext();
  const [inputText, setInputText] = useState("");
  const [showVoicePlayer, setShowVoicePlayer] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll ke pesan terbawah saat ada pesan baru atau streaming aktif
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, chat.streaming]);

  const activeSessionTitle =
    chat.active?.title ||
    (chat.sessions.length > 0 ? chat.sessions[0].title : "Sesi Konseling HavenCare AI");

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || chat.streaming) return;
    setInputText("");
    await chat.send(text);
  };

  const handleQuickMood = (text: string) => {
    if (chat.streaming) return;
    void chat.send(text);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#FAF6EE] text-[#2C1D11] select-none">
      {/* ========================================================================= */}
      {/* KOLOM 2: SESSION DRAWER (RIWAYAT SESI ASLI & FILTER KATEGORI)             */}
      {/* ========================================================================= */}
      <SessionDrawer className="hidden md:flex" />

      {/* ========================================================================= */}
      {/* KOLOM 3: CENTRAL CHAT WORKSPACE (STREAM PESAN + COMPOSER)                 */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-screen min-w-0 bg-[#FAF6EE] overflow-hidden border-r border-[#DCD7CE]">
        {/* HEADER ATAS CHAT WORKSPACE */}
        <div className="h-16 px-4 sm:px-6 bg-[#FAF6EE] border-b border-[#DCD7CE]/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-white border border-[#DCD7CE] flex items-center justify-center shrink-0 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1A7F8E] animate-pulse" />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-sm sm:text-base text-[#2C1D11] truncate tracking-tight">
                {activeSessionTitle}
              </h1>
              <p className="text-[11px] text-[#786A5E] flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DA85E]" />
                <span>HavenCare AI • Psychological First Aid</span>
              </p>
            </div>
          </div>

          {/* Tombol Aksi Kanan Header */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowVoicePlayer(!showVoicePlayer)}
              title="Refleksi Suara"
              className={cn(
                "h-8 px-3 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border",
                showVoicePlayer
                  ? "bg-[#E87934] text-white border-[#E87934] shadow-xs"
                  : "bg-white text-[#2C1D11] border-[#DCD7CE] hover:border-[#E87934]"
              )}
            >
              <Headphones size={13} />
              <span className="hidden sm:inline">Audio Refleksi</span>
            </button>

            <button
              type="button"
              onClick={() => void chat.createNewSession()}
              disabled={chat.streaming}
              className="h-8 px-3.5 rounded-full bg-[#2C1D11] hover:bg-[#3D2A1C] text-[#FAF6EE] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Sesi Baru</span>
            </button>
          </div>
        </div>

        {/* VOICE REFLECTION WIDGET (JIKA DIAKTIFKAN) */}
        {showVoicePlayer && (
          <div className="px-4 py-3 bg-white border-b border-[#DCD7CE]/60 flex items-center justify-center animate-in slide-in-from-top-2 duration-150">
            <AudioWaveformPlayer
              duration="02:30"
              timestamp="Refleksi Suara Ketenangan HavenCare"
              className="w-full max-w-lg shadow-xs"
            />
          </div>
        )}

        {/* QUICK MOOD CHECK-IN PILLS BAR */}
        <div className="px-4 sm:px-6 py-2 bg-white/60 border-b border-[#DCD7CE]/50 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <span className="text-[11px] font-bold text-[#786A5E] shrink-0 mr-1 flex items-center gap-1">
            <Smile size={12} className="text-[#E87934]" />
            <span>Pilih Emosi:</span>
          </span>
          {QUICK_MOODS.map((m, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickMood(m.text)}
              disabled={chat.streaming}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#FAF6EE] text-xs font-medium text-[#2C1D11] border border-[#DCD7CE] transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1 shadow-2xs disabled:opacity-50"
            >
              <span>{m.emoji}</span>
              <span className="text-[11px]">{m.label}</span>
            </button>
          ))}
        </div>

        {/* AREA STREAM PERCAKAPAN (MESSAGES CONTAINER) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
          {/* Welcome Card Pertama Kali */}
          <div className="max-w-xl mx-auto bg-white rounded-[24px] p-5 border border-[#DCD7CE] shadow-xs text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#1A7F8E]/10 text-[#1A7F8E] flex items-center justify-center mx-auto text-lg font-bold">
              🌿
            </div>
            <h2 className="text-sm font-extrabold text-[#2C1D11]">
              Halo, {user?.displayName || "Sahabat HavenCare"}
            </h2>
            <p className="text-xs text-[#786A5E] leading-relaxed">
              Ruang percakapan ini aman, terenkripsi, dan tidak menghakimi. Tuliskan apa pun yang sedang membebani pikiranmu atau pilih opsi panduan di atas.
            </p>
          </div>

          {/* Daftar Pesan Asli dari chat.messages */}
          {chat.messages.map((msg, index) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id || index}
                className={cn(
                  "flex flex-col gap-1 w-full",
                  isUser ? "items-end" : "items-start"
                )}
              >
                {/* Header Balon: Pengirim & Waktu */}
                <div className="flex items-center gap-2 px-1 text-[11px] text-[#786A5E] font-medium">
                  {!isUser && (
                    <span className="font-bold text-[#2C1D11] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#1A7F8E]" />
                      HavenCare AI
                    </span>
                  )}
                  {msg.timestamp && (
                    <span>{formatTime(msg.timestamp)}</span>
                  )}
                  {msg.decision && (
                    <DecisionBadge decision={msg.decision} size="sm" />
                  )}
                </div>

                {/* Balon Pesan */}
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[75%] rounded-[24px] px-5 py-3.5 text-xs sm:text-sm leading-relaxed shadow-xs transition-all",
                    isUser
                      ? "bg-[#E87934] text-white rounded-tr-sm font-normal selection:bg-white selection:text-[#E87934]"
                      : "bg-white text-[#2C1D11] border border-[#DCD7CE] rounded-tl-sm font-normal"
                  )}
                >
                  <p className="whitespace-pre-wrap font-sans">{msg.content}</p>
                </div>
              </div>
            );
          })}

          {/* Indikator Streaming Aktif */}
          {chat.streaming && (
            <div className="flex items-start gap-3 animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-full bg-white border border-[#DCD7CE] flex items-center justify-center text-[#1A7F8E] shadow-2xs">
                <FreudFlowerLoader size={18} />
              </div>
              <div className="bg-white rounded-[22px] rounded-tl-sm px-5 py-3.5 border border-[#DCD7CE] text-xs text-[#786A5E] flex items-center gap-2 shadow-xs">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A7F8E] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A7F8E] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A7F8E] animate-bounce [animation-delay:0.4s]" />
                </span>
                <span className="font-medium">HavenCare AI sedang merenungkan respons...</span>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* ========================================================================= */}
        {/* COMPOSER BILAH KETIK PESAN (BAWAH)                                        */}
        {/* ========================================================================= */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#DCD7CE]/70 shrink-0">
          <div className="max-w-4xl mx-auto flex items-end gap-2 bg-[#FAF6EE] rounded-[26px] border border-[#DCD7CE] p-2 focus-within:border-[#1A7F8E] focus-within:ring-2 focus-within:ring-[#1A7F8E]/20 transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              placeholder="Ceritakan apa yang sedang kamu rasakan... (Tekan Enter untuk kirim)"
              disabled={chat.streaming}
              className="flex-1 max-h-32 bg-transparent text-xs sm:text-sm text-[#2C1D11] placeholder:text-[#786A5E]/60 px-3 py-2 resize-none focus:outline-none font-sans"
            />

            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={!inputText.trim() || chat.streaming}
              aria-label="Kirim Pesan"
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all shadow-xs",
                inputText.trim() && !chat.streaming
                  ? "bg-[#8DA85E] text-white hover:bg-[#7b9451] active:scale-95"
                  : "bg-[#DCD7CE]/60 text-white cursor-not-allowed opacity-50"
              )}
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#786A5E] px-3 pt-2 max-w-4xl mx-auto">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-[#8DA85E]" />
              <span>Privasi Terlindungi • Enkripsi Zero-Plaintext</span>
            </span>
            <span>HavenCare AI v2.1</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KOLOM 4: CLINICAL INSIGHT PANEL (KANAN - HIDDEN DI BAWAH XL)              */}
      {/* ========================================================================= */}
      <ClinicalInsightPanel />
    </div>
  );
}
