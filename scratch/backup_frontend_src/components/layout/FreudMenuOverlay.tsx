"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { FreudFlowerLoader } from "@/components/ui/FreudFlowerLoader";
import { cn } from "@/lib/utils";

export interface FreudMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { label: "Homepage", href: "/", isCurrent: true },
  { label: "Platform", href: "/chat" },
  { label: "Assessment", href: "/assessments" },
  { label: "About Us", href: "/#about" },
  { label: "Contact Us", href: "mailto:halo@siagajuara.id" },
  { label: "Blog", href: "/#blog" },
];

/**
 * FreudMenuOverlay — Full-Screen Navigation Menu Overlay (Dribbble 23734329 / Gambar 3)
 *
 * Menu navigasi layar penuh berlatar Espresso (#2C1D11) dengan dekorasi lengkungan abstrak tone-on-tone,
 * daftar menu tipografi raksasa Urbanist, identitas freud.ai, dan floating pill bar putih di bagian bawah.
 */
export const FreudMenuOverlay: React.FC<FreudMenuOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  // Cegah scroll pada body ketika overlay terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Dukungan tombol Escape untuk menutup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu Navigasi Penuh Freud"
      className={cn(
        "fixed inset-0 z-50 bg-[#2C1D11] text-[#FAF6EE]",
        "p-6 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden select-none",
        "animate-in fade-in duration-200"
      )}
    >
      {/* DEKORASI LENGKUNGAN SVG ORGANIK ABSTRAK TONE-ON-TONE (Persis Gambar 3) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover opacity-60"
        >
          {/* Lengkungan Layer 1 (Cokelat Hangat Menengah) */}
          <path
            d="M-200 900 C150 750, 450 450, 520 0 L-200 0 Z"
            fill="#3A2719"
          />
          {/* Lengkungan Layer 2 (Cokelat Tua) */}
          <path
            d="M300 900 C600 850, 950 600, 1050 0 L400 0 C400 350, 200 700, 300 900 Z"
            fill="#23160D"
            opacity="0.8"
          />
          {/* Lengkungan Layer 3 (Gradasi Lembut ke Espresso) */}
          <path
            d="M800 900 C1050 820, 1300 550, 1440 300 L1440 900 Z"
            fill="#342215"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* HEADER: Tombol Tutup Silang di Kanan Atas */}
      <div className="flex items-center justify-end relative z-20">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup menu navigasi"
          className={cn(
            "w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-cream",
            "flex items-center justify-center transition-all duration-150",
            "active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50"
          )}
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* AREA UTAMA DUA SISI (KIRI: MENU TIPOGRAFI, KANAN: BRAND & LEGAL) */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center my-auto relative z-10">
        {/* ========================================================= */}
        {/* AREA KIRI: Daftar Menu Tipografi Raksasa (Font Urbanist)   */}
        {/* ========================================================= */}
        <nav className="lg:col-span-7 flex flex-col space-y-3 sm:space-y-4">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={cn(
                "text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight font-sans text-left",
                "transition-all duration-200 ease-out hover:translate-x-3 flex items-center gap-3",
                item.isCurrent
                  ? "text-cream hover:text-orange"
                  : "text-cream/80 hover:text-orange"
              )}
            >
              {item.isCurrent && (
                <span className="w-3 h-3 rounded-full bg-sage shrink-0" />
              )}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* ========================================================= */}
        {/* AREA KANAN: Logo Bunga Freud, Tagline, & Teks Hak Cipta    */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col items-start space-y-6 lg:pl-6 text-left">
          {/* Logo Bunga 4-Kelopak + freud.ai */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-xs">
              <FreudFlowerLoader size={26} />
            </div>
            <span className="text-2xl font-bold tracking-wider text-cream font-sans lowercase">
              freud.ai
            </span>
          </div>

          {/* Tagline Utama */}
          <p className="text-sm sm:text-base text-cream/80 leading-relaxed font-normal max-w-sm">
            We use the power of AI technology to revolutionize mental health.
          </p>

          {/* Teks Kecil Hak Cipta & Kebijakan Hukum */}
          <div className="space-y-1 pt-4 text-[10px] tracking-wider uppercase text-cream/50 font-mono">
            <p>COPYRIGHT 2026. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-3 pt-1">
              <Link
                href="/#terms"
                onClick={onClose}
                className="hover:text-cream transition-colors"
              >
                TERMS &amp; CONDITIONS
              </Link>
              <span>•</span>
              <Link
                href="/#privacy"
                onClick={onClose}
                className="hover:text-cream transition-colors"
              >
                PRIVACY POLICY
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BILAH BAWAH (Floating White Pill Bar Khas Gambar 3)       */}
      {/* ========================================================= */}
      <div className="w-full max-w-5xl mx-auto relative z-20 pt-4">
        <div className="rounded-full bg-white text-espresso px-4 py-2 sm:px-6 sm:py-2.5 flex items-center justify-between shadow-2xl">
          {/* Sisi Kiri: Tombol Mini Apple Store & Google Play */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tombol Mini Sage: Apple Store */}
            <Link
              href="/chat"
              onClick={onClose}
              className={cn(
                "rounded-full bg-sage text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 sm:px-4 sm:py-2",
                "flex items-center gap-1.5 shadow-sm hover:brightness-95 active:scale-95 transition-all"
              )}
            >
              <span>Apple Store</span>
              <ArrowRight size={13} strokeWidth={2.5} />
            </Link>

            {/* Tombol Mini Orange: Google Play */}
            <Link
              href="/chat"
              onClick={onClose}
              className={cn(
                "rounded-full bg-orange text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 sm:px-4 sm:py-2",
                "flex items-center gap-1.5 shadow-sm hover:brightness-95 active:scale-95 transition-all"
              )}
            >
              <span>Google Play</span>
              <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Sisi Kanan: Ikon Media Sosial (Facebook, YouTube, LinkedIn) */}
          <div className="flex items-center gap-3 sm:gap-4 text-espresso/70 pr-1">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
              className="hover:text-espresso transition-colors hover:scale-110 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
              className="hover:text-espresso transition-colors hover:scale-110 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="hover:text-espresso transition-colors hover:scale-110 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreudMenuOverlay;
