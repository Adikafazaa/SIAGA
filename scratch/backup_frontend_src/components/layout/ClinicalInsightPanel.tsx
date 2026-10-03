"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  ChevronRight,
  HeartHandshake,
  PhoneCall,
  Sparkles,
  TrendingUp,
  Wind,
} from "lucide-react";
import { FreudButton } from "@/components/ui/FreudButton";
import { cn } from "@/lib/utils";

export interface ClinicalInsightPanelProps {
  className?: string;
}

/**
 * Kolom 4 — Right Clinical Insight Panel (Freud Web UI Dribbble 23734329)
 * Panel klinis sisi kanan berlatar putih/krem lembut dengan kartu bersudut organik rounded-[26px]:
 * 1. Tren Indeks Kesehatan Mental (Freud Score Curve)
 * 2. Kartu Rujukan Dokter Spesialis Jiwa (DPJP) berlisensi SIP 8-digit terverifikasi
 * 3. Tombol Intervensi Krisis Darurat SOS (Hotline 119 ext 8) & Latihan Pernapasan 4-7-8
 */
export const ClinicalInsightPanel: React.FC<ClinicalInsightPanelProps> = ({
  className,
}) => {
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);
  const [breathingStep, setBreathingStep] = useState<"inhale" | "hold" | "exhale">("inhale");

  return (
    <aside
      className={cn(
        "hidden xl:flex flex-col w-[320px] shrink-0 h-screen sticky top-0",
        "border-l border-sand/70 bg-[#FAF9F5]/90 backdrop-blur-sm overflow-y-auto p-5 space-y-4 select-none",
        className
      )}
    >
      {/* 1. PANEL TREN KESEHATAN MENTAL (FREUD SCORE) */}
      <div className="bg-white rounded-[26px] p-5 border border-sand/70 shadow-[0_4px_20px_rgba(44,29,17,0.05)] space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-espresso">
            <TrendingUp size={15} className="text-sage" />
            Freud Score
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sage/20 text-sage">
            Kondisi Stabil
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-espresso tracking-tight tabular-nums">
            88.2
          </span>
          <span className="text-xs font-semibold text-warm-muted">/ 100</span>
          <span className="ml-auto text-xs font-bold text-sage bg-sage/10 px-2 py-0.5 rounded-full">
            +4.2% pekan ini
          </span>
        </div>

        {/* Mini SVG Kurva Tren Kesejahteraan Halus */}
        <div className="h-14 w-full pt-1">
          <svg
            viewBox="0 0 200 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full stroke-sage overflow-visible"
          >
            <defs>
              <linearGradient id="miniCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8DA85E" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8DA85E" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Area gradient halus */}
            <path
              d="M0 36 C35 34, 50 16, 80 24 C115 32, 135 8, 170 14 C185 17, 195 7, 200 8 L200 45 L0 45 Z"
              fill="url(#miniCurveGrad)"
            />
            {/* Garis kurva utama */}
            <path
              d="M0 36 C35 34, 50 16, 80 24 C115 32, 135 8, 170 14 C185 17, 195 7, 200 8"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Titik metrik aktif dengan halo ring */}
            <circle cx="200" cy="8" r="4" fill="#8DA85E" />
            <circle cx="200" cy="8" r="9" fill="#8DA85E" opacity="0.25" className="animate-ping" />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sand/40 text-[11px]">
          <div>
            <span className="text-warm-muted block text-[10px]">PHQ-9 (Depresi)</span>
            <span className="font-semibold text-espresso">Skor 2 • Minimal</span>
          </div>
          <div>
            <span className="text-warm-muted block text-[10px]">GAD-7 (Cemas)</span>
            <span className="font-semibold text-espresso">Skor 3 • Ringan</span>
          </div>
        </div>
      </div>

      {/* 2. KARTU RUJUKAN DOKTER SPESIALIS (DPJP) BERLISENSI SIP */}
      <div className="bg-white rounded-[26px] p-5 border border-sand/70 shadow-[0_4px_20px_rgba(44,29,17,0.05)] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-warm-muted">
            Rujukan Dokter DPJP
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-sage">
            <span className="w-2 h-2 rounded-full bg-sage ring-2 ring-sage/20" />
            Siap Konsultasi
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-espresso text-cream flex items-center justify-center font-bold text-sm shrink-0 border border-sand shadow-sm">
            MB
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h4 className="text-xs font-bold text-espresso truncate">
                Dr. Megumin Black, Sp.KJ
              </h4>
              <BadgeCheck
                size={15}
                className="text-sage shrink-0"
                aria-label="Dokter Terverifikasi SIP"
              />
            </div>
            <p className="text-[10px] text-warm-muted mt-0.5">
              Psikiater Klinis & Konseling
            </p>
            {/* Nomor Lisensi SIP 8-Digit Terverifikasi */}
            <p className="font-mono text-[10px] text-espresso font-semibold mt-1">
              SIP: 8492-0193
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-warm-muted bg-cream/70 rounded-xl px-3 py-2 border border-sand/50">
          <span className="font-medium text-espresso">Rating: 4.9 ★ (128)</span>
          <span>8 th praktik</span>
        </div>

        <FreudButton
          variant="sage"
          size="sm"
          leftIcon={<HeartHandshake size={15} />}
          className="w-full justify-center shadow-sm"
          onClick={() => {
            window.location.href = "mailto:dpjp@siagajuara.id?subject=Permohonan%20Konsultasi%20Klinis%20DPJP";
          }}
        >
          Konsultasi Sekarang
        </FreudButton>
      </div>

      {/* 3. TOMBOL BANTUAN KRISIS DARURAT SOS */}
      <div className="bg-coral/10 rounded-[26px] p-5 border border-coral/30 shadow-[0_4px_20px_rgba(229,107,111,0.08)] space-y-3">
        <div className="flex items-center gap-2 text-coral">
          <AlertTriangle size={18} className="shrink-0" />
          <h4 className="text-xs font-bold uppercase tracking-wide">
            Bantuan Krisis Darurat
          </h4>
        </div>

        <p className="text-[11px] text-espresso/80 leading-relaxed">
          Jika Anda mengalami krisis mendesak atau dorongan melukai diri, bantuan profesional darurat siaga 24 jam.
        </p>

        <a
          href="tel:119"
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-full",
            "bg-coral text-white py-2.5 px-4 text-xs font-bold shadow-sm",
            "hover:brightness-95 active:scale-95 transition-all select-none"
          )}
        >
          <PhoneCall size={14} />
          Hotline Krisis 119 ext 8
        </a>

        {/* Latihan Pernapasan Grounding 4-7-8 Interaktif */}
        <button
          type="button"
          onClick={() => setShowBreathingGuide((v) => !v)}
          className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-espresso/80 hover:text-espresso py-1 transition-colors"
        >
          <Wind size={13} className="text-sage" />
          {showBreathingGuide ? "Tutup Latihan Napas" : "Latihan Grounding 4-7-8"}
        </button>

        {showBreathingGuide && (
          <div className="bg-white rounded-2xl p-3.5 border border-sand/70 text-[11px] space-y-2 animate-in fade-in duration-150 shadow-2xs">
            <p className="font-bold text-espresso">
              Panduan Menstabilkan Detak Jantung:
            </p>
            <div className="space-y-1.5 text-warm-muted">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-cream/70 border border-sand/40 text-espresso font-medium">
                <span>1. Tarik napas lewat hidung</span>
                <span className="font-mono text-sage font-bold">4 detik</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-cream/70 border border-sand/40 text-espresso font-medium">
                <span>2. Tahan napas tenang</span>
                <span className="font-mono text-orange font-bold">7 detik</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-cream/70 border border-sand/40 text-espresso font-medium">
                <span>3. Hembuskan tuntas lewat bibir</span>
                <span className="font-mono text-espresso font-bold">8 detik</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Penafian Medis Resmi */}
      <div className="pt-2 text-center text-[10px] text-warm-muted/80 leading-normal px-2">
        <p>
          AI PsychoBot adalah sarana refleksi mandiri, bukan pengganti penanganan medis gawat darurat psikiatri.
        </p>
      </div>
    </aside>
  );
};

export default ClinicalInsightPanel;
