"use client";

import React, { useState } from "react";
import {
  Check,
  CheckCircle2,
  Heart,
  HelpCircle,
  Lock,
  Maximize2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { FreudFlowerLoader } from "@/components/ui/FreudFlowerLoader";
import { cn } from "@/lib/utils";

export interface AuthShowcasePanelProps {
  className?: string;
}

// 6 Mood Klinis Terapeutik Lengkap dengan Skor & Respon Empati Doctor Freud AI
export const CLINICAL_MOODS = [
  {
    id: "happy",
    label: "Bahagia",
    emoji: "💜",
    score: 98.92,
    response:
      "Senang melihat suasana hati Anda mekar hari ini! Mari pertahankan momentum positif ini dengan refleksi bersyukur.",
  },
  {
    id: "calm",
    label: "Tenang",
    emoji: "🌿",
    score: 94.5,
    response:
      "Pikiran yang tenang adalah fondasi kejernihan emosional. Nikmati kedamaian momen ini untuk memulihkan energi tubuh.",
  },
  {
    id: "motivated",
    label: "Berenergi",
    emoji: "⚡",
    score: 91.0,
    response:
      "Energi tinggi terdeteksi! Salurkan fokus ini pada hal-hal bermakna yang mendukung perkembangan dan target Anda.",
  },
  {
    id: "overwhelmed",
    label: "Cemas",
    emoji: "🌧️",
    score: 68.4,
    response:
      "Napas dulu sebentar... Saya mendeteksi kecemasan. Mari lakukan teknik pernapasan grounding 4-7-8 bersama saya.",
  },
  {
    id: "burnout",
    label: "Lelah",
    emoji: "🥀",
    score: 54.2,
    response:
      "Beban pikiran terasa berat hari ini? Istirahat sejenak bukan berarti Anda gagal. Anda berhak mendapatkan jeda tanpa rasa bersalah.",
  },
  {
    id: "crisis",
    label: "Krisis",
    emoji: "🆘",
    score: 38.0,
    response:
      "Anda tidak sendirian di masa sulit ini. Tim dokter spesialis DPJP kami dan hotline krisis resmi 119 ext 8 siap mendampingi Anda sekarang.",
  },
];

/**
 * AuthShowcasePanel — Panel Kiri Showcase Visual Klinis & Simulasi Interaktif Freud Web UI
 *
 * Tampilan bersih, bebas elemen bertumpuk, dengan konteks klinis nyata:
 * 1. Live Security Telemetry Badge (SIAGA L0–L3 Guardrail, Latensi <60ms, Zero-Plaintext).
 * 2. Baris Metrik Dampak Industri (15.000+ Sesi, <60ms Deteksi, 8-Digit SIP).
 * 3. 3 Kartu Manfaat Interaktif dengan Tooltip Privasi Medis Mutlak.
 * 4. Kartu Foto Pemulihan Pasien Nyata (Rian Pratama - Terverifikasi DPJP) dengan efek 3D tilt.
 * 5. Horizontal Mood Bar di bawah foto (6 tombol pill emotikon 100% responsif klik).
 * 6. Balon Respon Simulasi Doctor Freud AI yang nyaman dibaca dan update real-time.
 */
export const AuthShowcasePanel: React.FC<AuthShowcasePanelProps> = ({
  className,
}) => {
  // State Mood yang sedang dipilih
  const [selectedMood, setSelectedMood] = useState(CLINICAL_MOODS[0]);
  const [showPrivacyTooltip, setShowPrivacyTooltip] = useState(false);

  return (
    <div
      className={cn(
        "lg:col-span-7 bg-[#2C1D11] text-white p-6 sm:p-10 lg:p-12",
        "flex flex-col justify-between relative overflow-hidden select-none min-h-[700px] lg:min-h-screen",
        className
      )}
    >
      {/* =================================================================== */}
      {/* 1. DEKORASI GELOMBANG PERNAPASAN KONSENTRIS (Breathing Waves SVG)   */}
      {/* =================================================================== */}
      <div
        className="absolute inset-0 pointer-events-none -z-0 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover opacity-25 animate-pulse"
          style={{ animationDuration: "8s" }}
        >
          <circle cx="850" cy="200" r="100" stroke="#FAF6EE" strokeWidth="1" opacity="0.08" />
          <circle cx="850" cy="200" r="190" stroke="#FAF6EE" strokeWidth="1" opacity="0.06" />
          <circle cx="850" cy="200" r="290" stroke="#FAF6EE" strokeWidth="1" opacity="0.04" />
          <circle cx="850" cy="200" r="410" stroke="#FAF6EE" strokeWidth="1" opacity="0.02" />

          <path
            d="M-100 800 C200 650, 400 350, 600 100 C750 -80, 900 -20, 1100 50"
            stroke="#FAF6EE"
            strokeWidth="1.5"
            opacity="0.05"
            fill="none"
          />
        </svg>
      </div>

      {/* =================================================================== */}
      {/* 2. BAGIAN ATAS: LIVE TELEMETRY BADGE, HEADLINE & IMPACT METRICS      */}
      {/* =================================================================== */}
      <div className="relative z-10 space-y-5 max-w-xl">
        {/* LIVE SECURITY TELEMETRY BADGE */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-[#FAF6EE] shadow-sm select-none backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8DA85E] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8DA85E]" />
          </span>
          <span className="font-mono text-[11px] font-medium tracking-wide">
            SIAGA L0–L3 Guardrail Aktif · Latensi &lt;60ms · Zero-Plaintext Encrypted
          </span>
        </div>

        {/* Judul Utama Raksasa Urbanist Tebal */}
        <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-white tracking-tight leading-[1.2] font-sans">
          We believe that mental health support should be accessible to everyone.
        </h1>

        {/* BARIS METRIK DAMPAK INDUSTRI (Social Proof) */}
        <div className="grid grid-cols-3 gap-3 py-3 border-y border-white/10 text-left">
          <div>
            <span className="text-xl sm:text-2xl font-extrabold text-[#FFD147] tracking-tight font-sans block">
              15.000+
            </span>
            <span className="text-[10px] text-cream/75 leading-tight block mt-0.5">
              Sesi Konseling Aman
            </span>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-extrabold text-[#FFD147] tracking-tight font-sans block">
              &lt; 60ms
            </span>
            <span className="text-[10px] text-cream/75 leading-tight block mt-0.5">
              Deteksi Krisis Real-Time
            </span>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-extrabold text-[#FFD147] tracking-tight font-sans block">
              8-Digit SIP
            </span>
            <span className="text-[10px] text-cream/75 leading-tight block mt-0.5">
              Dokter DPJP Berlisensi
            </span>
          </div>
        </div>

        {/* 3 KARTU MANFAAT INTERAKTIF */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#DCD7CE]/70 block">
            OUR BENEFITS
          </span>

          <div className="space-y-2">
            {/* Manfaat 1: Personalized Support */}
            <div className="p-3.5 rounded-2xl bg-[#3D2A1C]/70 hover:bg-[#3D2A1C] border border-white/10 hover:border-white/20 flex items-center justify-between gap-3 shadow-xs hover:scale-[1.01] transition-all duration-200 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#FFD147]/20 flex items-center justify-center text-[#FFD147] shrink-0 transition-colors">
                  <Sparkles size={16} className="fill-[#FFD147]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cream">
                    Personalized Support
                  </h4>
                  <p className="text-[11px] text-[#DCD7CE]/80">
                    We provide personalized empathetic AI companion
                  </p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD147] shrink-0 transition-all duration-200 group-hover:scale-125 group-hover:shadow-[0_0_8px_#FFD147]" />
            </div>

            {/* Manfaat 2: Clinical Accuracy */}
            <div className="p-3.5 rounded-2xl bg-[#3D2A1C]/70 hover:bg-[#3D2A1C] border border-white/10 hover:border-white/20 flex items-center justify-between gap-3 shadow-xs hover:scale-[1.01] transition-all duration-200 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#8DA85E]/20 flex items-center justify-center text-[#8DA85E] shrink-0 transition-colors">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cream">
                    Clinical Accuracy
                  </h4>
                  <p className="text-[11px] text-[#DCD7CE]/80">
                    Standardized PHQ-9 screening &amp; licensed psychiatrist referral
                  </p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD147] shrink-0 transition-all duration-200 group-hover:scale-125 group-hover:shadow-[0_0_8px_#FFD147]" />
            </div>

            {/* Manfaat 3: Zero-Plaintext Privacy dengan Tooltip Interaktif */}
            <div
              onMouseEnter={() => setShowPrivacyTooltip(true)}
              onMouseLeave={() => setShowPrivacyTooltip(false)}
              onClick={() => setShowPrivacyTooltip((prev) => !prev)}
              className="relative p-3.5 rounded-2xl bg-[#3D2A1C]/70 hover:bg-[#3D2A1C] border border-white/10 hover:border-white/20 flex items-center justify-between gap-3 shadow-xs hover:scale-[1.01] transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#9D8DF1]/20 flex items-center justify-center text-[#9D8DF1] shrink-0 transition-colors">
                  <Lock size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white group-hover:text-cream">
                      Zero-Plaintext Privacy
                    </h4>
                    <HelpCircle size={12} className="text-[#FFD147]" />
                  </div>
                  <p className="text-[11px] text-[#DCD7CE]/80">
                    End-to-end encrypted clinical telemetry &amp; safety guardrail
                  </p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD147] shrink-0 transition-all duration-200 group-hover:scale-125 group-hover:shadow-[0_0_8px_#FFD147]" />

              {/* Tooltip Privasi Medis Mutlak Popover */}
              {showPrivacyTooltip && (
                <div className="absolute -top-14 left-4 right-4 z-40 bg-[#1A120B] text-cream text-[11px] p-2.5 rounded-xl border border-sand/40 shadow-2xl animate-in fade-in zoom-in-95">
                  <p className="leading-snug">
                    <strong className="text-sage">Privasi Medis Mutlak:</strong> Chat tidak pernah disimpan sebagai teks biasa (plaintext), melainkan hanya vektor fitur dan token hash anonim untuk privasi pasien.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. BAGIAN BAWAH: KISAH PEMULIHAN PASIEN + HORIZONTAL MOOD BAR       */}
      {/* =================================================================== */}
      <div className="relative z-10 pt-6 pb-2 space-y-4 max-w-xl">
        {/* WADAH FOTO PASIEN (3D Tilt Hanya Melingkupi Foto & Badge) */}
        <div className="relative">
          <TiltCard className="relative w-full">
            {/* Aksen Doodle Sinar Matahari Oranye Ceria */}
            <div className="absolute -top-3.5 -right-3 z-30 text-[#E87934] pointer-events-none">
              <svg
                className="w-10 h-10 animate-spin-slow stroke-[#E87934]"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 0 V9" strokeWidth="3" strokeLinecap="round" />
                <path d="M20 31 V40" strokeWidth="3" strokeLinecap="round" />
                <path d="M0 20 H9" strokeWidth="3" strokeLinecap="round" />
                <path d="M31 20 H40" strokeWidth="3" strokeLinecap="round" />
                <path d="M6 6 L12 12" strokeWidth="3" strokeLinecap="round" />
                <path d="M28 28 L34 34" strokeWidth="3" strokeLinecap="round" />
                <path d="M6 34 L12 28" strokeWidth="3" strokeLinecap="round" />
                <path d="M28 12 L34 6" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            {/* FLOATING BADGE: LEVEL KESEHATAN MENTAL DINAMIS */}
            <div className="absolute -top-5 -right-2 sm:-right-4 z-30 bg-white rounded-2xl p-3 shadow-clay text-espresso w-44 border border-sand/40 animate-float">
              <div className="flex items-center justify-between text-[9px] font-bold text-warm-muted uppercase tracking-wider">
                <span>Mental Health Level</span>
                <Maximize2 size={11} className="text-warm-muted/60" />
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-extrabold text-espresso tracking-tight tabular-nums transition-all duration-300">
                  {selectedMood.score}%
                </span>
                <span className="text-[10px] font-semibold text-sage">
                  ({selectedMood.score >= 80 ? "Stabil" : selectedMood.score >= 60 ? "Adaptif" : "Perlu Jeda"})
                </span>
              </div>
              {/* Bilah Progres Animasi Hijau Sage #8DA85E */}
              <div className="w-full h-1.5 bg-sand/30 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-[#8DA85E] rounded-full transition-all duration-700 ease-out shadow-xs"
                  style={{ width: `${selectedMood.score}%` }}
                />
              </div>
            </div>

            {/* WADAH FOTO DENGAN KONTEKS KLINIS NYATA (100% Bersih Tanpa Pop-up Menutup) */}
            <div className="rounded-[28px] overflow-hidden border-2 border-white/20 shadow-2xl relative aspect-[16/9] sm:aspect-[2/1] w-full bg-[#3D2A1C]">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80"
                alt="Pasien pulih dari burnout"
                className="w-full h-full object-cover object-center filter brightness-95"
              />

              {/* Badge Terverifikasi DPJP di Kiri Atas Foto */}
              <div className="absolute top-3 left-3 z-10">
                <span className="rounded-full bg-sage/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <CheckCircle2 size={12} className="shrink-0" />
                  Kisah Pemulihan Pasien · Terverifikasi DPJP
                </span>
              </div>

              {/* Overlay Gradient Halus & Label Pasien di Kiri Bawah */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs leading-snug drop-shadow-sm">
                <p className="font-bold text-sm text-white">
                  Rian Pratama, 28 thn · Software Engineer
                </p>
                <p className="text-[11px] text-[#FAF6EE]/90 font-medium mt-0.5">
                  Pulih dari Burnout Akut &amp; Insomnia (Skor PHQ-9: 18 ➔ 2)
                </p>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* =================================================================== */}
        {/* 4. HORIZONTAL MOOD BAR (TERINTEGRASI DI BAWAH FOTO & 100% KLIKABLE) */}
        {/* =================================================================== */}
        <div className="space-y-2 pt-1 select-none pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cream/90 flex items-center gap-1.5">
              <span>Coba Simulasi Respon Empatik Doctor Freud AI:</span>
              <Sparkles size={13} className="text-[#FFD147] fill-[#FFD147]" />
            </span>
          </div>

          {/* Deretan 6 Tombol Pil Emotikon Mood 3D Responsif */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full pointer-events-auto">
            {CLINICAL_MOODS.map((mood) => {
              const isSelected = selectedMood.id === mood.id;

              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setSelectedMood(mood)}
                  className={cn(
                    "py-2 px-2.5 rounded-2xl text-xs font-bold transition-all duration-150",
                    "flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer select-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/50 pointer-events-auto",
                    isSelected
                      ? "bg-[#FCEBDD] text-[#E87934] border-2 border-[#E87934] shadow-md scale-105"
                      : "bg-white/10 hover:bg-white/20 text-cream border border-white/15"
                  )}
                >
                  <span className="text-sm">{mood.emoji}</span>
                  <span className="truncate">{mood.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =================================================================== */}
        {/* 5. BALON RESPON SIMULASI DOCTOR FREUD AI (DI BAWAH MOOD BAR)        */}
        {/* =================================================================== */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-md p-4 border border-sand text-espresso shadow-lg space-y-1.5 text-left animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-sand/40 pb-2">
            <div className="flex items-center gap-2">
              <FreudFlowerLoader size={16} />
              <span className="text-xs font-extrabold text-espresso">
                Doctor Freud AI
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sage/15 text-sage">
              Empathetic Response
            </span>
          </div>

          <p className="text-xs sm:text-sm text-espresso/90 leading-relaxed font-sans pt-0.5">
            &ldquo;{selectedMood.response}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthShowcasePanel;
