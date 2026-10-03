"use client";

import React, { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Archive,
  CheckCircle2,
  Clock,
  Flame,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useChatContext } from "@/features/chat/chat-context";
import { FreudButton } from "@/components/ui/FreudButton";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface SessionDrawerProps {
  /** Kontrol buka/tutup laci untuk tampilan mobile */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  className?: string;
}

type SessionFilter = "all" | "active" | "archived";

/**
 * Kolom 2 — Session Drawer (Freud Web UI Dribbble 23734329)
 * Riwayat percakapan dengan kartu aktif berlatar Peach (#FCEBDD), radius rounded-[22px],
 * chip kategori status sesi, dan tombol kapsul New Conversation.
 */
export const SessionDrawer: React.FC<SessionDrawerProps> = ({
  mobileOpen = false,
  onMobileClose,
  className,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const chat = useChatContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<SessionFilter>("all");

  const filteredSessions = useMemo(() => {
    let list = chat.sessions;

    if (filter === "active") {
      list = list.filter((s) => s.status !== "blocked");
    } else if (filter === "archived") {
      list = list.filter((s) => s.status === "blocked");
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((s) => s.title.toLowerCase().includes(q));
  }, [chat.sessions, filter, searchQuery]);

  const handleSelectSession = (sessionId: string) => {
    chat.selectSession(sessionId);
    if (pathname !== "/chat") {
      router.push("/chat");
    }
    onMobileClose?.();
  };

  const handleCreateNew = async () => {
    await chat.createNewSession();
    if (pathname !== "/chat") {
      router.push("/chat");
    }
    onMobileClose?.();
  };

  const content = (
    <div className="flex flex-col h-full bg-[#FAF9F5] text-espresso select-none">
      {/* Header Drawer, Pencarian & Kategori Filter */}
      <div className="p-4 border-b border-sand/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-warm-muted">
              Percakapan AI
            </h2>
          </div>
          {onMobileClose && (
            <button
              type="button"
              onClick={onMobileClose}
              className="lg:hidden p-1 rounded-full text-warm-muted hover:bg-sand/40"
              aria-label="Tutup daftar sesi"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Input Pencarian Obrolan Kapsul Bulat */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari sesi atau kata kunci…"
            className={cn(
              "w-full rounded-full bg-white border border-sand pl-9 pr-4 py-2",
              "text-xs text-espresso placeholder:text-warm-muted/60 font-sans",
              "focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all"
            )}
          />
        </div>

        {/* Chip Kategori Sesi Khas Freud UI8 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap",
              filter === "all"
                ? "bg-espresso text-cream shadow-2xs"
                : "bg-white text-warm-muted border border-sand/60 hover:bg-oatmeal"
            )}
          >
            Semua ({chat.sessions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("active")}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap",
              filter === "active"
                ? "bg-orange text-white shadow-2xs"
                : "bg-white text-warm-muted border border-sand/60 hover:bg-oatmeal"
            )}
          >
            Aktif ({chat.sessions.filter((s) => s.status !== "blocked").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("archived")}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap",
              filter === "archived"
                ? "bg-espresso text-cream shadow-2xs"
                : "bg-white text-warm-muted border border-sand/60 hover:bg-oatmeal"
            )}
          >
            Diarsipkan
          </button>
        </div>

        {/* Tombol Buat Percakapan Baru */}
        <FreudButton
          variant="espresso"
          size="sm"
          onClick={() => void handleCreateNew()}
          leftIcon={<Plus size={15} />}
          className="w-full justify-center shadow-sm"
        >
          Percakapan Baru
        </FreudButton>
      </div>

      {/* Daftar Kartu Percakapan Berlekuk Lembut (rounded-[22px]) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {chat.sessionsLoading ? (
          <div className="space-y-3 py-3 px-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 rounded-[22px] bg-sand/30 animate-pulse"
              />
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-peach flex items-center justify-center mx-auto mb-2.5 text-orange">
              <MessageSquare size={20} />
            </div>
            <p className="text-xs font-bold text-espresso">
              {searchQuery ? "Tidak ada sesi cocok" : "Belum ada riwayat"}
            </p>
            <p className="text-[11px] text-warm-muted mt-1 leading-relaxed">
              Mulai percakapan baru untuk refleksi kesehatan mental Anda
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isActive = session.sessionId === chat.activeId;

            return (
              <button
                key={session.sessionId}
                type="button"
                onClick={() => handleSelectSession(session.sessionId)}
                className={cn(
                  "w-full text-left p-3.5 rounded-[22px] border transition-all duration-150",
                  "flex items-start gap-3 active:scale-[0.99] group",
                  isActive
                    ? "bg-peach border-orange/50 shadow-sm"
                    : "bg-white border-sand/70 hover:border-sand hover:bg-oatmeal text-espresso/80"
                )}
              >
                {/* Avatar Ikon Obrolan Bulat */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border transition-colors",
                    isActive
                      ? "bg-orange text-white border-orange shadow-2xs"
                      : "bg-cream text-espresso/80 border-sand/80 group-hover:border-orange/50"
                  )}
                >
                  <MessageSquare size={16} />
                </div>

                {/* Konten Judul & Metadata */}
                <div className="min-w-0 flex-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span
                      className={cn(
                        "truncate text-xs",
                        isActive ? "text-espresso font-bold" : "text-espresso/90 font-medium"
                      )}
                    >
                      {session.title || "Konseling PsychoBot"}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-orange shrink-0 ring-2 ring-orange/25" />
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-warm-muted">
                    <span className="flex items-center gap-1">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          session.status === "blocked"
                            ? "bg-red-500"
                            : session.status === "flagged"
                            ? "bg-purple-500"
                            : "bg-sage"
                        )}
                      />
                      {session.turns} pesan
                    </span>
                    <span className="font-mono">{formatRelative(session.lastActivityAt)}</span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Bagian Bawah: Model AI & Status Keamanan */}
      <div className="p-3.5 border-t border-sand/60 bg-cream/60 flex items-center justify-between text-[10px] text-warm-muted">
        <span className="flex items-center gap-1 font-mono font-medium">
          <Sparkles size={12} className="text-gold fill-gold" />
          SIAGA v2 Guardrail
        </span>
        <span className="text-sage font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-sage" />
          Local AI
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SESSION DRAWER (~280px) */}
      <aside
        className={cn(
          "hidden lg:flex flex-col w-[280px] shrink-0 h-screen sticky top-0 border-r border-sand/60 z-20",
          className
        )}
      >
        {content}
      </aside>

      {/* MOBILE SLIDE-OVER DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-espresso/40 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <div className="relative w-[85%] max-w-xs h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default SessionDrawer;
