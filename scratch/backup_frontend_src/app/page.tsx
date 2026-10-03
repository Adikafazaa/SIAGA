"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Heart,
  Maximize2,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import { ROLE_HOME } from "@/lib/constants";
import { FreudFlowerLoader } from "@/components/ui/FreudFlowerLoader";
import { FreudFloatingActions } from "@/components/ui/FreudFloatingActions";
import { FreudMenuOverlay } from "@/components/layout/FreudMenuOverlay";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    if (!user.role || !user.onboardingCompleted) {
      router.replace("/onboarding");
    } else {
      router.replace(ROLE_HOME[user.role] ?? "/chat");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-cream font-sans text-espresso selection:bg-orange selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* 1. HEADER & NAVBAR (Sesuai Bagian Atas Gambar 1) */}
      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-sand/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo Sisi Kiri: Ikon Bunga 4-Kelopak Freud + Teks SIAGA */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-espresso flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <FreudFlowerLoader size={24} />
            </div>
            <span className="font-extrabold text-xl tracking-wider text-espresso">
              SIAGA
            </span>
          </Link>

          {/* Navigasi Tengah Teks Cokelat Lembut (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-espresso/80">
            <Link
              href="/"
              className="text-espresso font-bold hover:text-espresso transition-colors"
            >
              Homepage
            </Link>
            <Link
              href="/chat"
              className="hover:text-espresso transition-colors"
            >
              Platform
            </Link>
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-espresso transition-colors">
              <span>About Us</span>
              <ChevronDown size={14} className="text-warm-muted" />
            </div>
            <Link
              href="/assessments"
              className="hover:text-espresso transition-colors"
            >
              Careers
            </Link>
            <a
              href="mailto:halo@siagajuara.id"
              className="hover:text-espresso transition-colors"
            >
              Contact Us
            </a>
            <Link
              href="/admin/telemetry"
              className="hover:text-espresso transition-colors"
            >
              Resources
            </Link>
          </nav>

          {/* Aksi Kanan: Tombol Pil Bulat Penuh Espresso #2C1D11 */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/chat"
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 rounded-full px-5 py-2.5",
                "bg-espresso text-cream text-xs font-semibold shadow-sm",
                "hover:bg-espresso-hover active:scale-95 transition-all select-none"
              )}
            >
              Download App <ArrowDown size={13} strokeWidth={2.5} />
            </Link>

            <Link
              href="/register"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-5 py-2.5",
                "bg-espresso text-cream text-xs font-semibold shadow-sm",
                "hover:bg-espresso-hover active:scale-95 transition-all select-none"
              )}
            >
              Get In Touch <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-sand/40 text-espresso transition-colors"
              aria-label="Buka menu navigasi"
            >
              <span className="w-5 h-0.5 bg-espresso block mb-1" />
              <span className="w-5 h-0.5 bg-espresso block mb-1" />
              <span className="w-5 h-0.5 bg-espresso block" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION ASIMETRIS 2-KOLOM (Sesuai Inti Gambar 1) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-16 lg:pb-24 flex-1">
        {/* Latar Belakang Gradien Lengkungan Organik */}
        <div
          className="absolute -top-10 left-1/4 w-[500px] h-[500px] bg-sand/30 rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-peach/40 rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ========================================================= */}
          {/* KOLOM KIRI: Mockup Visual Interaktif Melayang 3D (6 Cols) */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-start">
            <TiltCard className="w-full max-w-[460px]">
              {/* FLOATING BADGE KANAN ATAS: "Current Mood: Happy 💜" (Melayang Organik) */}
              <div className="absolute -top-5 right-2 sm:-right-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-sand/80 shadow-clay-pill animate-float flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-warm-muted">
                    Current Mood
                  </span>
                  <span className="text-xs font-bold text-espresso">
                    Happy
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-lavender text-white flex items-center justify-center shadow-xs">
                  <Heart size={15} className="fill-white" />
                </div>
              </div>

              {/* FLOATING METRIC CARD KIRI: "Mental Health: 98.92%" */}
              <div className="absolute top-[48%] -left-3 sm:-left-7 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-sand/80 shadow-clay animate-float-delayed w-44 sm:w-48">
                <div className="flex items-center justify-between text-[10px] font-bold text-warm-muted uppercase">
                  <span>Mental Health</span>
                  <Maximize2 size={12} className="text-warm-muted/70" />
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl sm:text-2xl font-extrabold text-espresso tracking-tight tabular-nums">
                    98.92%
                  </span>
                  <span className="text-[10px] text-warm-muted">?</span>
                </div>
                {/* Bilah Indikator Oranye Terracotta */}
                <div className="w-full h-1.5 bg-sand/30 rounded-full overflow-hidden mt-2">
                  <div className="h-full w-[98.92%] bg-orange rounded-full" />
                </div>
              </div>

              {/* WADAH KARTU UTAMA CHATBOT (Putih Melayang, rounded-[32px]) */}
              <div className="bg-white/95 backdrop-blur-sm rounded-[32px] p-6 sm:p-7 border border-sand/80 shadow-clay-card space-y-4">
                {/* Header Kartu Chatbot */}
                <div className="flex items-center justify-between pb-3 border-b border-sand/40">
                  <h3 className="text-base font-extrabold text-espresso tracking-tight">
                    HavenCare AI Chatbot
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-sand/30 flex items-center justify-center text-espresso/80">
                    <Phone size={14} className="fill-espresso/80" />
                  </div>
                </div>

                {/* 1. Balon Pesan Pasien: Hijau Zaitun / Sage #8DA85E */}
                <div className="bg-sage text-white rounded-[22px] rounded-tl-[4px] p-4 text-xs font-medium leading-relaxed flex items-start gap-2.5 shadow-sm">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <FreudFlowerLoader size={12} />
                  </div>
                  <p>
                    What should I do then doc? I feel like I just wanna end everything!
                  </p>
                </div>

                {/* 2. Balon Balasan AI: Putih Bersih Bayangan Lembut */}
                <div className="bg-[#FAF9F5] rounded-[22px] rounded-tr-[4px] p-4 sm:p-5 text-xs text-espresso leading-relaxed border border-sand/60 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-warm-muted uppercase">
                    <FreudFlowerLoader size={12} />
                    <span>HavenCare AI Response</span>
                  </div>
                  <p className="text-espresso font-normal">
                    I hear you. It&apos;s common to experience a lack of motivation and pleasure when going through difficult times.
                  </p>
                  <p className="text-espresso font-normal">
                    Let&apos;s focus on self-care activities, like engaging in hobbies, connecting with loved ones!
                  </p>
                </div>

                {/* 3. Voice Note Waveform: Balon Hijau Sage Memanjang */}
                <div className="bg-sage text-white rounded-[22px] rounded-tl-[4px] px-4 py-3 flex items-center gap-3 shadow-sm">
                  <button
                    type="button"
                    className="w-7 h-7 rounded-full bg-white text-sage flex items-center justify-center shrink-0 shadow-xs"
                    aria-label="Play audio note"
                  >
                    <Play size={11} className="fill-sage ml-0.5" />
                  </button>

                  <span className="text-[11px] font-bold tabular-nums">0:20</span>

                  {/* SVG Gelombang Suara Dinamis */}
                  <div className="flex items-center gap-[3px] h-4 flex-1">
                    {[35, 65, 45, 90, 60, 100, 50, 80, 40, 95, 70, 50, 85, 60, 40].map(
                      (h, i) => (
                        <span
                          key={i}
                          className="w-[2.5px] bg-white rounded-full"
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>

                  <span className="text-[10px] text-white/80 whitespace-nowrap">
                    09.13 • Read
                  </span>
                </div>

                {/* 4. Balon Balasan Lanjutan (Cuplikan Bawah) */}
                <div className="bg-[#FAF9F5] rounded-[22px] p-3.5 text-xs text-espresso/80 border border-sand/50 shadow-2xs opacity-80">
                  <p className="truncate">
                    I understand. It&apos;s very easy to experience a lack of motivation and...
                  </p>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* ========================================================= */}
          {/* KOLOM KANAN: Typography & Call to Action (6 Cols)        */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 lg:pl-4">
            {/* Judul Utama Raksasa (Font Urbanist Tebal) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold text-espresso tracking-tight leading-[1.12]">
              A Mindful <br />
              Conversation <br />
              AI{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">Chatbot</span>
                {/* Aksen Highlight Oval Hangat di Belakang "Chatbot" */}
                <svg
                  className="absolute -inset-x-4 -inset-y-2 w-[calc(100%+32px)] h-[calc(100%+16px)] pointer-events-none"
                  viewBox="0 0 240 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse
                    cx="120"
                    cy="40"
                    rx="110"
                    ry="32"
                    stroke="#DCD7CE"
                    strokeWidth="3"
                    strokeDasharray="5 3"
                    fill="#FAF6EE"
                    fillOpacity="0.6"
                  />
                </svg>
              </span>
            </h1>

            {/* Deskripsi Empatik */}
            <p className="text-base sm:text-lg text-warm-muted max-w-lg leading-relaxed font-normal">
              Step into a world of cutting-edge technology and compassionate care, tailored to your unique needs.
            </p>

            {/* Badges Tombol Toko: App Store & Google Play */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {/* Tombol App Store */}
              <Link
                href="/chat"
                className={cn(
                  "rounded-2xl bg-espresso text-cream px-5 py-3 flex items-center gap-3 shadow-md",
                  "hover:bg-espresso-hover active:scale-95 transition-all select-none border border-sand/30"
                )}
              >
                {/* Ikon Apple SVG */}
                <svg
                  className="w-6 h-6 fill-cream shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.62-.77 1.05-1.84.93-2.91-.94.04-2.03.64-2.68 1.4-.57.66-.99 1.74-.88 2.78 1.02.08 2.01-.52 2.63-1.27z" />
                </svg>
                <div className="leading-tight text-left">
                  <span className="block text-[9px] uppercase tracking-wider text-cream/70 font-medium">
                    Download on the
                  </span>
                  <span className="block text-xs font-extrabold text-cream">
                    App Store
                  </span>
                </div>
              </Link>

              {/* Tombol Google Play */}
              <Link
                href="/chat"
                className={cn(
                  "rounded-2xl bg-espresso text-cream px-5 py-3 flex items-center gap-3 shadow-md",
                  "hover:bg-espresso-hover active:scale-95 transition-all select-none border border-sand/30"
                )}
              >
                {/* Ikon Google Play SVG */}
                <svg
                  className="w-6 h-6 fill-cream shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3.609 1.814L13.792 12 3.61 22.186c-.365-.365-.61-.926-.61-1.606V3.42c0-.68.245-1.241.61-1.606zm11.233 11.233l2.25 2.25-11.758 6.786 9.508-9.036zm0-2.094L5.334 1.917l11.758 6.786-2.25 2.25zm1.482 1.047l3.242-1.868c.847-.488.847-1.286 0-1.774l-3.242-1.868-2.316 2.316 2.316 2.194z" />
                </svg>
                <div className="leading-tight text-left">
                  <span className="block text-[9px] uppercase tracking-wider text-cream/70 font-medium">
                    GET IT ON
                  </span>
                  <span className="block text-xs font-extrabold text-cream">
                    Google Play
                  </span>
                </div>
              </Link>
            </div>

            {/* CTA Tambahan Mulai Sesi */}
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-xs font-bold text-orange hover:underline group"
              >
                <span>Mulai Sesi Konseling Mandiri Gratis</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BOTTOM BANNER ESPRESSO PEKAT (Sesuai Bagian Bawah Gambar 1) */}
      <footer className="w-full bg-espresso text-cream rounded-t-[48px] pt-14 sm:pt-16 pb-16 px-6 sm:px-10 lg:px-16 mt-6 select-none shadow-[0_-20px_50px_rgba(44,29,17,0.15)]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          {/* Judul Utama Tebal Banner */}
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold tracking-tight text-cream leading-snug max-w-4xl">
            Our advanced algorithms analyze your data and provide valuable insights into your mental health{" "}
            <span className="text-orange font-extrabold">patterns.</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
            {/* Sisi Kiri: Badge Pil "Our Core Idea" */}
            <div className="lg:col-span-5 space-y-3">
              <span className="inline-block rounded-full border border-sand/30 bg-espresso-hover px-4 py-1.5 text-xs font-semibold text-cream/90 shadow-2xs">
                Our Core Idea
              </span>
              <p className="text-xs text-cream/70 leading-relaxed max-w-md">
                Platform ini mentransformasi pendampingan kesehatan mental melalui teknologi AI lokal dengan privasi Zero-Plaintext dan latensi CPU di bawah 60ms.
              </p>
            </div>

            {/* Sisi Kanan: Dua Kartu Pil Informasi Elegan */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:justify-end">
              {/* Pil 1 */}
              <div className="rounded-full bg-cream/10 border border-sand/20 px-5 py-3.5 text-xs sm:text-sm font-medium text-cream flex items-center gap-3 backdrop-blur-sm shadow-xs">
                <span className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center shrink-0 text-xs">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span>Personalized mental health support</span>
              </div>

              {/* Pil 2 */}
              <div className="rounded-full bg-cream/10 border border-sand/20 px-5 py-3.5 text-xs sm:text-sm font-medium text-cream flex items-center gap-3 backdrop-blur-sm shadow-xs">
                <span className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center shrink-0 text-xs">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span>24/7 availability for everyone, anywhere.</span>
              </div>
            </div>
          </div>

          {/* Baris Hak Cipta & Keamanan Bawah */}
          <div className="pt-8 border-t border-sand/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-cream/60 gap-3">
            <p>© 2026 HavenCare • Freud Web UI Design Standard. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-cream transition-colors">
                Masuk Akun
              </Link>
              <span>•</span>
              <Link href="/register" className="hover:text-cream transition-colors">
                Daftar Pasien
              </Link>
              <span>•</span>
              <Link href="/admin/telemetry" className="hover:text-cream transition-colors">
                Telemetri SOC
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Dock (Pojok Kanan Bawah Khas Freud) */}
      <FreudFloatingActions onOpenMenu={() => setIsMenuOpen(true)} />

      {/* Full-Screen Navigation Menu Overlay */}
      <FreudMenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}
