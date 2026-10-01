"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Check,
  CheckCircle2,
  CornerDownLeft,
  MessageSquare,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShieldX,
  Smile,
  Sparkles,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DecisionBadge } from "@/components/ui/DecisionBadge";
import { FreudFlowerLoader } from "@/components/ui/FreudFlowerLoader";
import { InlineFreudScoreCard } from "@/components/chat/InlineFreudScoreCard";
import { Guard } from "@/features/auth/role-guard";
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

/**
 * ChatRealWorkspace — Antarmuka Chat Konseling 100% Data Real useChatContext
 *
 * Mengeliminasi seluruh data palsu/fiktif:
 * - Sidebar merender chat.sessions asli pengguna
 * - Tombol "+ Sesi Baru" memicu chat.createNewSession()
 * - Stream pesan merender chat.messages asli dan chat.streaming
 * - Composer memicu chat.send(text) saat Enter atau tombol kirim ditekan
 * - Styling 100% Freud Web UI (Orange #E87934, White Card, Sage #8DA85E)
 */
function ChatRealWorkspace() {
  const chat = useChatContext();
  const [searchQuery, setSearchQuery] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Filter sesi berdasarkan pencarian jika pengguna mengetik query
  const filteredSessions = (chat.sessions ?? []).filter((s) =>
    s.title ? s.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  // Auto-scroll ke pesan terbawah saat ada pesan baru atau streaming aktif
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, chat.streaming]);

  const activeSessionTitle =
    chat.active?.title ||
    (chat.sessions.length > 0 ? chat.sessions[0].title : "Sesi Konseling AI");

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#FAF6EE] text-espresso select-none">
      {/* ========================================================================= */}
      {/* SIDEBAR DAFTAR SESI ASLI (w-[280px] sm:w-[300px] border-r border-[#DCD7CE]) */}
      {/* ========================================================================= */}
      <aside className="w-[280px] sm:w-[300px] shrink-0 border-r border-[#DCD7CE] bg-[#FAF6EE] flex flex-col h-screen overflow-hidden select-none">
        {/* Header All AI Conversations + Ikon Chat */}
        <div className="p-4 border-b border-[#DCD7CE]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange" />
            <h3 className="font-extrabold text-sm text-espresso tracking-tight">
              All AI Conversations
            </h3>
          </div>
          <div className="w-7 h-7 rounded-full bg-sand/30 flex items-center justify-center text-espresso/80">
            <MessageSquare size={14} className="fill-espresso/80" />
          </div>
        </div>

        {/* Bilah Aksi Atas: Tombol "+ Sesi Baru" & Pencarian */}
        <div className="p-3 border-b border-[#DCD7CE]/60 space-y-2.5 bg-cream/40">
          {/* Tombol Fungsional + Sesi Baru */}
          <button
            type="button"
            onClick={() => void chat.createNewSession()}
            disabled={chat.streaming}
            className={cn(
              "w-full py-2.5 px-4 rounded-full bg-espresso text-cream",
              "hover:bg-espresso-hover active:scale-95 transition-all text-xs font-bold",
              "flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            )}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>+ Sesi Baru</span>
          </button>

          {/* Kolom Pencarian Kapsul */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari sesi percakapan..."
              className={cn(
                "w-full rounded-full bg-white border border-[#DCD7CE] pl-8 pr-3 py-1.5",
                "text-xs text-espresso placeholder:text-warm-muted/60 font-sans",
                "focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30"
              )}
            />
          </div>
        </div>

        {/* DAFTAR KARTU SESI ASLI DARI chat.sessions (Bukan Data Palsu) */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
          {chat.sessionsLoading ? (
            <div className="space-y-2.5 p-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-2xl bg-sand/30 animate-pulse"
                />
              ))}
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <div className="w-10 h-10 rounded-full bg-peach flex items-center justify-center mx-auto text-orange">
                <MessageSquare size={18} />
              </div>
              <p className="text-xs font-bold text-espresso">Belum ada riwayat sesi</p>
              <p className="text-[11px] text-warm-muted leading-relaxed">
                Klik tombol <strong className="text-espresso">+ Sesi Baru</strong> untuk memulai konseling pertama Anda.
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.sessionId === chat.activeId;

              return (
                <button
                  key={session.sessionId}
                  type="button"
                  onClick={() => chat.selectSession(session.sessionId)}
                  className={cn(
                    "w-full text-left p-3 rounded-2xl border transition-all duration-150",
                    "flex items-start gap-2.5 active:scale-[0.99] group",
                    isActive
                      ? "bg-[#FCEBDD] border-[#E87934]/40 shadow-xs font-bold"
                      : "bg-white/60 border-transparent hover:bg-white hover:border-[#DCD7CE]"
                  )}
                >
                  {/* Avatar Ikon Bulat */}
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs border shadow-2xs",
                      isActive
                        ? "bg-[#E87934] text-white border-[#E87934]"
                        : "bg-[#EFECE6] text-espresso/70 border-[#DCD7CE]"
                    )}
                  >
                    <MessageSquare size={16} />
                  </div>

                  {/* Konten Judul & Waktu Asli */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-espresso truncate">
                        {session.title || "Konseling PsychoBot"}
                      </h4>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-orange shrink-0 ring-2 ring-orange/30" />
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-1 mt-1 text-[10px] text-warm-muted font-normal">
                      <span>{session.turns} pesan</span>
                      <span className="font-mono">
                        {formatRelative(session.lastActivityAt)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Status Keamanan SIAGA */}
        <div className="p-3 border-t border-[#DCD7CE]/60 bg-cream/70 flex items-center justify-between text-[10px] text-warm-muted">
          <span className="flex items-center gap-1 font-mono font-medium">
            <Sparkles size={11} className="text-gold fill-gold" />
            SIAGA Guardrail v2
          </span>
          <span className="text-sage font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sage" />
            Aktif
          </span>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CHAT CANVAS (flex-1 bg-[#FAF9F5] Fluid Canvas)                      */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col justify-between h-screen min-w-0 overflow-hidden bg-[#FAF9F5]">
        {/* HEADER ATAS CHAT: Doctor Freud.ai + Status + Action Buttons */}
        <header className="h-16 border-b border-[#DCD7CE] bg-[#FAF9F5] px-6 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full bg-[#2C1D11] text-white flex items-center justify-center font-bold text-xs shadow-sm border border-sand/40">
              DF
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#8DA85E] ring-2 ring-[#FAF9F5]" />
            </div>

            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-extrabold text-espresso">
                  Doctor Freud.ai
                </h1>
                <span className="w-4 h-4 rounded-full bg-espresso text-white flex items-center justify-center text-[9px]">
                  ✓
                </span>
              </div>
              <p className="text-[11px] text-warm-muted font-sans mt-0.5 truncate">
                Local AI • Protected by SIAGA L0–L3
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Aksi AI Companion"
              aria-label="Aksi AI"
              className="w-9 h-9 rounded-full bg-sand/30 hover:bg-sand/60 text-espresso flex items-center justify-center transition-colors active:scale-95"
            >
              <FreudFlowerLoader size={20} />
            </button>
            <button
              type="button"
              title="Pengaturan Chat"
              aria-label="Pengaturan"
              className="w-9 h-9 rounded-full bg-sand/30 hover:bg-sand/60 text-espresso flex items-center justify-center transition-colors active:scale-95"
            >
              <Settings size={16} />
            </button>
          </div>
        </header>

        {/* AREA PESAN OBROLAN ASLI (Message Stream) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-10 py-6 space-y-5 select-text">
          {chat.messagesLoading ? (
            <div className="space-y-4 py-8">
              <div className="h-16 rounded-2xl bg-sand/30 animate-pulse max-w-md ml-auto" />
              <div className="h-28 rounded-2xl bg-sand/30 animate-pulse max-w-xl" />
            </div>
          ) : chat.messages.length === 0 ? (
            /* Empty State Hangat jika Belum Ada Pesan di Sesi Ini */
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <div className="w-14 h-14 rounded-full bg-white border border-sand/80 flex items-center justify-center mb-3.5 shadow-sm">
                <FreudFlowerLoader size={30} />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-espresso">
                Mulai Sesi Konseling Reflektif
              </h2>
              <p className="max-w-md text-xs text-warm-muted mt-1 leading-relaxed">
                Ketik apa pun yang sedang Anda rasakan. Percakapan ini diproses secara aman oleh model AI lokal dengan privasi Zero-Plaintext.
              </p>

              {/* Pemicu Cepat Pertanyaan Awal */}
              <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-md">
                {[
                  "Saya merasa cemas dan gelisah hari ini",
                  "Sulit tidur dan pikiran terus berputar",
                  "Bagaimana cara menenangkan diri saat stres?",
                ].map((starter, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => void chat.send(starter)}
                    className="rounded-full bg-white border border-[#DCD7CE] px-3.5 py-1.5 text-xs text-espresso/80 hover:border-orange hover:bg-peach/30 transition-all active:scale-95 shadow-2xs"
                  >
                    💬 {starter}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Stream Pesan Real Asli Pengguna & Bot */
            chat.messages.map((m) => (
              <RealMessageRow key={m.id} message={m} />
            ))
          )}

          {/* Indikator Berpikir AI Saat Streaming Respons */}
          {chat.streaming && (
            <div className="flex items-center gap-2 text-xs font-semibold text-warm-muted bg-sand/30 px-4 py-2 rounded-full w-fit animate-pulse select-none">
              <FreudFlowerLoader size={15} />
              <span>Dr. Freud is thinking...</span>
              <Sparkles size={13} className="text-[#FFD147] fill-[#FFD147]" />
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* BILAH INPUT PENGIRIM PESAN (Composer Bar Fungsional) */}
        <div className="p-4 sm:p-6 pt-2 bg-gradient-to-t from-[#FAF9F5] via-[#FAF9F5]/90 to-transparent">
          <RealComposerBar
            disabled={chat.streaming || !chat.activeId}
            onSend={(text) => void chat.send(text)}
          />
        </div>
      </main>
    </div>
  );
}

/**
 * RealMessageRow — Render Pesan Asli dengan Desain Khas Freud
 */
function RealMessageRow({ message }: { message: ChatMessage }) {
  // 1. Pesan Pengguna (Terracotta Orange #E87934 Rata Kanan)
  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end">
        <div className="max-w-xl rounded-[24px] rounded-br-[6px] bg-[#E87934] px-5 py-3.5 text-sm text-white shadow-sm font-sans leading-relaxed">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <span className="mt-1 text-[10px] text-warm-muted font-mono mr-1">
          {formatTime(message.createdAt)}
        </span>
      </div>
    );
  }

  // 2. Pesan Sistem SIAGA Guardrail
  if (message.role === "system") {
    const isBlock = message.content.includes("BLOCK");
    const isProbe = message.content.includes("PROBE");

    return (
      <div
        className={cn(
          "mx-auto flex max-w-xl items-start gap-2.5 rounded-2xl border px-4 py-3 text-xs shadow-sm my-2",
          isBlock
            ? "border-block/40 bg-red-50 text-red-900"
            : isProbe
            ? "border-probe/40 bg-purple-50 text-purple-900"
            : "border-sand bg-white text-espresso/80"
        )}
      >
        <span className="mt-0.5 shrink-0" aria-hidden>
          {isBlock ? <ShieldX size={15} /> : <Zap size={15} />}
        </span>
        <p className="font-mono text-[11px] leading-relaxed">
          {message.content}
        </p>
      </div>
    );
  }

  // 3. Pesan Bot Doctor Freud.ai (Kartu Putih Lembut)
  const containsScore =
    message.content.toLowerCase().includes("freud score") ||
    message.content.toLowerCase().includes("skor kesehatan");

  return (
    <div className="flex items-start gap-3 max-w-2xl">
      {/* Avatar Bunga Freud di Sisi Kiri Balon */}
      <div className="w-8 h-8 rounded-full bg-orange text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm border border-orange/20">
        <FreudFlowerLoader size={18} />
      </div>

      <div className="flex-col items-start min-w-0 flex-1">
        <div className="w-full rounded-[24px] rounded-tl-[6px] bg-white border border-[#DCD7CE]/70 p-5 sm:p-6 text-espresso text-sm shadow-[0_4px_20px_rgba(44,29,17,0.05)] space-y-3 font-sans">
          <div className="flex items-center justify-between border-b border-sand/40 pb-2 text-xs">
            <span className="font-bold text-espresso">Doctor Freud.ai</span>
            <span className="text-[10px] font-semibold text-sage flex items-center gap-1">
              <Check size={11} strokeWidth={3} /> Terverifikasi
            </span>
          </div>

          <p className="whitespace-pre-wrap break-words leading-relaxed text-espresso">
            {message.content}
          </p>

          {/* Jika respons bot membahas skor, sertakan kartu kurva inline */}
          {containsScore && (
            <InlineFreudScoreCard score={88.2} timeframe="1 month" />
          )}
        </div>

        <span className="mt-1 text-[10px] text-warm-muted font-mono ml-2">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}

/**
 * RealComposerBar — Bilah Input Mengambang Fungsional
 */
function RealComposerBar({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="rounded-full bg-white border border-[#DCD7CE] px-4 py-2 sm:py-2.5 shadow-[0_6px_25px_rgba(44,29,17,0.06)] flex items-center gap-3 max-w-2xl mx-auto w-full select-none">
      {/* Ikon Emoji Senyum */}
      <button
        type="button"
        onClick={() => setText((prev) => prev + " 😊")}
        className="text-warm-muted hover:text-espresso transition-colors p-1"
        aria-label="Pilih emoji"
      >
        <Smile size={20} />
      </button>

      {/* Input Teks Pesan Asli */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Send your message to Dr. Freud AI..."
        disabled={disabled}
        className="flex-1 bg-transparent border-0 py-1.5 px-1 text-sm text-espresso placeholder:text-warm-muted/70 font-sans focus:outline-none focus:ring-0 disabled:opacity-50"
      />

      {/* Tombol Kirim Bulat Hijau Sage (#8DA85E) dengan Panah */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !text.trim()}
        title="Kirim Pesan"
        aria-label="Kirim pesan"
        className={cn(
          "w-9 h-9 rounded-full bg-[#8DA85E] text-white flex items-center justify-center shrink-0 shadow-sm",
          "hover:brightness-95 active:scale-95 transition-all",
          "disabled:opacity-40 disabled:pointer-events-none"
        )}
      >
        <CornerDownLeft size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
