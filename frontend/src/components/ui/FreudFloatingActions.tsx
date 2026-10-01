"use client";

import React, { useState } from "react";
import { ArrowUpRight, Lock, Settings, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FreudFloatingActionsProps {
  /** Callback saat tombol hijau besar diklik untuk membuka Full-screen Menu Overlay */
  onOpenMenu: () => void;
  /** Callback opsional saat tombol keamanan diklik */
  onSecurityClick?: () => void;
  /** Callback opsional saat tombol pengaturan diklik */
  onSettingsClick?: () => void;
  className?: string;
}

/**
 * FreudFloatingActions — Floating Action Dock Freud Web UI (Dribbble 23734329)
 *
 * Menampilkan 3 tombol melayang di pojok kanan bawah:
 * 1. Lingkaran Lavender (#9D8DF1): Zero-Plaintext Security
 * 2. Lingkaran Terracotta Orange (#E87934): Mode Terapi & Audio
 * 3. Lingkaran Sage Olive (#8DA85E) Besar: Pemicu Full-Screen Menu Overlay
 */
export const FreudFloatingActions: React.FC<FreudFloatingActionsProps> = ({
  onOpenMenu,
  onSecurityClick,
  onSettingsClick,
  className,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40",
          "flex items-center gap-3 select-none",
          className
        )}
      >
        {/* 1. LINGKARAN UNGU LAVENDER: Zero-Plaintext Security (~44px) */}
        <div className="relative flex flex-col items-center">
          {activeTooltip === "security" && (
            <div className="absolute -top-10 px-3 py-1 rounded-full bg-espresso text-cream text-[10px] font-bold whitespace-nowrap shadow-xl border border-sand/30 animate-in fade-in zoom-in-95 pointer-events-none">
              Zero-Plaintext Security
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              if (onSecurityClick) onSecurityClick();
              else setSecurityModalOpen(true);
            }}
            onMouseEnter={() => setActiveTooltip("security")}
            onMouseLeave={() => setActiveTooltip(null)}
            aria-label="Informasi Keamanan Zero-Plaintext"
            className={cn(
              "w-11 h-11 rounded-full bg-lavender text-white flex items-center justify-center",
              "shadow-[0_8px_20px_rgba(157,141,241,0.35)]",
              "hover:scale-110 active:scale-95 transition-all duration-200 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender"
            )}
          >
            <Lock size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* 2. LINGKARAN TERRACOTTA ORANGE: Mode Terapi & Pengaturan (~44px) */}
        <div className="relative flex flex-col items-center">
          {activeTooltip === "settings" && (
            <div className="absolute -top-10 px-3 py-1 rounded-full bg-espresso text-cream text-[10px] font-bold whitespace-nowrap shadow-xl border border-sand/30 animate-in fade-in zoom-in-95 pointer-events-none">
              Mode Terapi & Suara
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              if (onSettingsClick) onSettingsClick();
              else setSettingsModalOpen(true);
            }}
            onMouseEnter={() => setActiveTooltip("settings")}
            onMouseLeave={() => setActiveTooltip(null)}
            aria-label="Mode Terapi & Pengaturan"
            className={cn(
              "w-11 h-11 rounded-full bg-orange text-white flex items-center justify-center",
              "shadow-[0_8px_20px_rgba(232,121,52,0.35)]",
              "hover:scale-110 active:scale-95 transition-all duration-200 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            )}
          >
            <Settings size={19} strokeWidth={2.2} />
          </button>
        </div>

        {/* 3. LINGKARAN HIJAU SAGE BESAR: Pemicu Full-Screen Menu (~56px) */}
        <div className="relative flex flex-col items-center">
          {activeTooltip === "menu" && (
            <div className="absolute -top-10 px-3 py-1 rounded-full bg-espresso text-cream text-[10px] font-bold whitespace-nowrap shadow-xl border border-sand/30 animate-in fade-in zoom-in-95 pointer-events-none">
              Buka Navigasi Penuh
            </div>
          )}
          <button
            type="button"
            onClick={onOpenMenu}
            onMouseEnter={() => setActiveTooltip("menu")}
            onMouseLeave={() => setActiveTooltip(null)}
            aria-label="Buka Menu Navigasi Layar Penuh"
            className={cn(
              "w-14 h-14 rounded-full bg-sage text-white flex items-center justify-center",
              "ring-4 ring-sage/25 shadow-[0_10px_25px_rgba(141,168,94,0.4)]",
              "hover:scale-110 active:scale-95 transition-all duration-200 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            )}
          >
            <ArrowUpRight size={26} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Modal Cepat Info Keamanan Zero-Plaintext */}
      {securityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm p-6 bg-white rounded-[28px] border border-sand shadow-2xl text-espresso space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-lavender/20 text-lavender flex items-center justify-center">
                <Lock size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-espresso">Zero-Plaintext Privacy</h4>
                <p className="text-[11px] text-warm-muted">Standar Keamanan SIAGA L0–L3</p>
              </div>
            </div>
            <p className="text-xs text-warm-muted leading-relaxed">
              Seluruh riwayat sesi konseling tidak pernah disimpan dalam bentuk teks mentah (plaintext). Data diamankan melalui enkripsi token hash SHA-256 dan embedding terisolasi.
            </p>
            <button
              type="button"
              onClick={() => setSecurityModalOpen(false)}
              className="w-full py-2.5 rounded-full bg-espresso text-cream text-xs font-bold hover:bg-espresso-hover transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Modal Cepat Pengaturan Terapi & Suara */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm p-6 bg-white rounded-[28px] border border-sand shadow-2xl text-espresso space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange/20 text-orange flex items-center justify-center">
                <Settings size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-espresso">Mode Terapi & Audio</h4>
                <p className="text-[11px] text-warm-muted">Konfigurasi Pengalaman Pasien</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-espresso/90">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-cream/70 border border-sand/50">
                <span>Respon Audio Suara (TTS)</span>
                <input type="checkbox" defaultChecked className="rounded accent-orange" />
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-cream/70 border border-sand/50">
                <span>Mode Night Therapy (Warm Espresso)</span>
                <input type="checkbox" className="rounded accent-orange" />
              </label>
            </div>
            <button
              type="button"
              onClick={() => setSettingsModalOpen(false)}
              className="w-full py-2.5 rounded-full bg-espresso text-cream text-xs font-bold hover:bg-espresso-hover transition-colors"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FreudFloatingActions;
