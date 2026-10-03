"use client";

import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Plus,
  Send,
  ShieldCheck,
  ShieldX,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DecisionBadge } from "@/components/ui/DecisionBadge";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/ScreenStates";
import { Guard } from "@/features/auth/role-guard";
import { useChat } from "@/features/chat/use-chat";
import { formatRelative, formatTime } from "@/lib/format";
import type { ChatMessage } from "@/lib/types";
import { useCrisis } from "@/components/crisis/CrisisProvider";

export default function ChatPage() {
  return (
    <Guard roles={["patient"]}>
      <AppShell>
        <ChatWorkspace />
      </AppShell>
    </Guard>
  );
}

function ChatWorkspace() {
  const chat = useChat();
  const [showSessions, setShowSessions] = useState(false);
  const { openCrisis } = useCrisis();

  const blocked = chat.active?.status === "blocked";

  return (
    <div className="flex h-[calc(100dvh-230px)] min-h-[360px] flex-col gap-4 lg:h-[calc(100dvh-140px)] lg:min-h-[540px]">
      {/* Header sesi */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            HavenCare AI <span className="text-sm font-semibold text-[#5d7077]">· Ruang refleksi</span>
          </h1>
          <p className="text-[11px] text-slate-500">
            {chat.active
              ? `${chat.active.turns} turn · aktif ${formatRelative(chat.active.lastActivityAt)}`
              : "Memuat sesi…"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {chat.lastDecision && (
            <DecisionBadge decision={chat.lastDecision} score={chat.lastRisk ?? undefined} theme="light" />
          )}
          <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-700">
            <ShieldCheck size={12} />
            Ruang refleksi terlindungi
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        {/* Panel sesi — desktop */}
        <aside className="hc-glass hidden w-56 shrink-0 flex-col overflow-hidden rounded-3xl lg:flex">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
            <span className="text-xs font-extrabold text-slate-700">Riwayat refleksi</span>
            <button
              onClick={() => void chat.createNewSession()}
              className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-care-blue hover:bg-blue-50"
            >
              <Plus size={13} /> Baru
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {chat.sessionsLoading ? (
              <Skeleton rows={4} theme="light" />
            ) : chat.sessions.length === 0 ? (
              <p className="px-2 py-6 text-center text-xs text-slate-400">Belum ada sesi</p>
            ) : (
              <ul className="space-y-1">
                {chat.sessions.map((s) => (
                  <li key={s.sessionId}>
                    <button
                      onClick={() => chat.selectSession(s.sessionId)}
                      className={`w-full rounded-lg px-2.5 py-2 text-left transition-colors ${
                        s.sessionId === chat.activeId ? "bg-blue-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <p className="truncate text-xs font-medium text-slate-800">{s.title}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span
                          className={`inline-block h-1.5 w-1.5 rounded-full ${
                            s.status === "blocked"
                              ? "bg-red-500"
                              : s.status === "flagged"
                                ? "bg-purple-500"
                                : "bg-green-500"
                          }`}
                          aria-hidden
                        />
                        {s.turns} turn · {formatRelative(s.lastActivityAt)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Kolom percakapan */}
        <div className="hc-glass-strong flex min-w-0 flex-1 flex-col overflow-hidden rounded-3xl">
          {/* Toggle sesi (mobile) */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
            <button
              onClick={() => setShowSessions((v) => !v)}
              className="text-xs font-medium text-slate-600"
            >
              {showSessions ? "Tutup daftar sesi" : "Daftar sesi"}
            </button>
            <button
              onClick={() => void chat.createNewSession()}
              className="flex items-center gap-1 text-[11px] font-medium text-care-blue"
            >
              <Plus size={13} /> Sesi baru
            </button>
          </div>
          {showSessions && (
            <div className="max-h-40 overflow-y-auto border-b border-slate-200 bg-white p-2 lg:hidden">
              <ul className="space-y-1">
                {chat.sessions.map((s) => (
                  <li key={s.sessionId}>
                    <button
                      onClick={() => {
                        chat.selectSession(s.sessionId);
                        setShowSessions(false);
                      }}
                      className={`w-full rounded-lg px-2.5 py-2 text-left text-xs ${
                        s.sessionId === chat.activeId ? "bg-blue-50 font-medium text-care-blue" : "text-slate-700"
                      }`}
                    >
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pesan */}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {chat.messagesLoading ? (
              <Skeleton rows={3} theme="light" />
            ) : chat.messages.length === 0 ? (
              <EmptyState
                title="Mulai percakapanmu"
                hint="Ceritakan apa yang sedang kamu rasakan. HavenCare AI siap menemanimu berefleksi."
                theme="light"
              />
            ) : (
              <MessageList messages={chat.messages} streaming={chat.streaming} />
            )}
          </div>

          {/* Error */}
          {chat.error && (
            <div className="px-4 pb-2">
              <ErrorState message={chat.error} theme="light" onRetry={chat.clearError} />
            </div>
          )}

          {/* Composer */}
          <Composer key={chat.activeId ?? "none"} disabled={chat.streaming || !chat.activeId} blocked={blocked} onBlockedNew={() => void chat.createNewSession()} onSend={(t) => { if (/bunuh diri|menyakiti diri|melukai diri|ingin mati/i.test(t)) openCrisis(); void chat.send(t); }} />
        </div>
        <aside className="hc-glass hidden w-[260px] shrink-0 flex-col gap-4 rounded-3xl p-5 2xl:flex"><div><p className="hc-label">Teman refleksi</p><h2 className="mt-2 text-lg font-extrabold">Ruangmu hari ini</h2><p className="hc-muted mt-2 text-sm leading-relaxed">Tuliskan apa yang paling terasa. Kamu dapat mengambil jeda kapan pun.</p></div><div className="rounded-2xl bg-[#eaf7f8] p-4"><span className="text-2xl">🌿</span><h3 className="mt-2 text-sm font-extrabold">Latihan singkat</h3><p className="hc-muted mt-1 text-xs leading-relaxed">Tarik napas perlahan, rasakan pijakan kakimu, lalu sebutkan satu hal yang kamu butuhkan sekarang.</p></div><button onClick={openCrisis} className="mt-auto rounded-2xl border border-[#e06d6d]/30 bg-[#e06d6d]/10 p-4 text-left text-xs font-extrabold text-[#c9575d]">Butuh bantuan segera? Buka pusat bantuan krisis →</button></aside>
      </div>
    </div>
  );
}

function MessageList({ messages, streaming }: { messages: ChatMessage[]; streaming: boolean }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <MessageRow key={m.id} message={m} streaming={streaming} />
      ))}
      <div ref={endRef} />
    </div>
  );
}

function MessageRow({ message, streaming }: { message: ChatMessage; streaming: boolean }) {
  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end">
        <div className="max-w-[85%] rounded-xl rounded-br-sm bg-care-blue px-3.5 py-2.5 text-sm text-white shadow-sm">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <span className="mt-1 text-[10px] text-slate-400">{formatTime(message.createdAt)}</span>
      </div>
    );
  }

  if (message.role === "system") {
    const isBlock = message.content.includes("BLOCK");
    const isProbe = message.content.includes("PROBE");
    return (
      <div
        className={`mx-auto flex max-w-[95%] items-start gap-2 border-l-4 px-3 py-2.5 text-xs ${
          isBlock
            ? "border-block bg-red-50 text-red-800"
            : isProbe
              ? "border-probe bg-purple-50 text-purple-800"
              : "border-slate-300 bg-slate-100 text-slate-600"
        }`}
        role={isBlock ? "alert" : "status"}
      >
        <span className="mt-0.5 shrink-0" aria-hidden>
          {isBlock ? <ShieldX size={14} /> : <Zap size={14} />}
        </span>
        <p className="font-mono text-[11px] leading-relaxed">{message.content}</p>
      </div>
    );
  }

  const isDraftEmpty = streaming && message.content === "";
  return (
    <div className="flex flex-col items-start">
      <div className="max-w-[85%] rounded-xl rounded-bl-sm border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
          HavenCare AI
        </p>
        {isDraftEmpty ? (
          <span className="flex items-center gap-1.5 text-xs text-slate-400" role="status">
            <Loader2 size={12} className="animate-spin" />
            Model lokal sedang merespons…
          </span>
        ) : (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}
      </div>
      <span className="mt-1 text-[10px] text-slate-400">{formatTime(message.createdAt)}</span>
    </div>
  );
}

function Composer({
  disabled,
  blocked,
  onBlockedNew,
  onSend,
}: {
  disabled: boolean;
  blocked: boolean;
  onBlockedNew: () => void;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");

  function submit() {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  }

  if (blocked) {
    return (
      <div className="border-t border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-xs text-red-700">
            <ShieldX size={14} />
            Sesi ini dihentikan oleh SIAGA Guardrail demi keamanan data klinis.
          </p>
          <Button size="sm" onClick={onBlockedNew}>
            <Plus size={13} /> Mulai Sesi Baru
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-3">
      <div className="flex items-end gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={Math.min(4, Math.max(1, text.split("\n").length))}
          placeholder="Tulis apa yang kamu rasakan… (Enter untuk kirim)"
          className="min-h-[42px] max-h-32 flex-1 resize-none rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-care-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <Button onClick={submit} disabled={disabled || !text.trim()}>
          <Send size={15} />
          <span className="hidden sm:inline">Kirim</span>
        </Button>
      </div>
      <p className="mt-1.5 text-[10px] text-slate-400">
        HavenCare AI adalah teman refleksi, bukan pengganti diagnosis atau bantuan darurat.
      </p>
    </div>
  );
}
