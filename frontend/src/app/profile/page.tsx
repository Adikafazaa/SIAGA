"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Calendar,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User as UserIcon,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Guard } from "@/features/auth/role-guard";
import { useAuth } from "@/features/auth/auth-provider";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  return (
    <Guard roles={["patient", "doctor", "admin"]}>
      <AppShell>
        <FreudProfileWorkspace />
      </AppShell>
    </Guard>
  );
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * FreudProfileWorkspace — Halaman Pengaturan Akun & Profil Khas Freud Web UI
 *
 * Mengusung kanvas bersih, leluasa, dan elegan:
 * - Latar kanvas Warm Cream (#FAF6EE), tipografi Urbanist, teks Espresso (#2C1D11)
 * - Layout terpusat: max-w-3xl mx-auto py-10 px-6 space-y-6
 * - Kartu 1: Identitas Akun (Avatar, Nama, Email, Role, Tanggal Terdaftar)
 * - Kartu 2: Keamanan & Privasi (Zero-Plaintext Privacy & SIAGA L0–L3)
 * - Kartu 3: Aksi Akun (Tombol Keluar Kapsul Coral Alert #E56B6F)
 */
function FreudProfileWorkspace() {
  const { user, signOutUser } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await signOutUser();
    router.replace("/login");
  };

  const userRoleLabel =
    user.role === "doctor"
      ? "Dokter Spesialis Jiwa"
      : user.role === "admin"
      ? "SOC Security Admin"
      : "Pasien Terdaftar";

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-14 px-4 sm:px-6 select-none font-sans text-espresso">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Halaman Pengaturan */}
        <div className="space-y-1 pb-2 border-b border-sand/40">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-espresso">
            Pengaturan Akun &amp; Profil
          </h1>
          <p className="text-xs sm:text-sm text-warm-muted">
            Kelola informasi identitas klinis, preferensi konseling, dan protokol keamanan data Anda.
          </p>
        </div>

        {/* ============================================================= */}
        {/* KARTU 1: IDENTITAS AKUN PENGGUNA                              */}
        {/* ============================================================= */}
        <div className="bg-white rounded-2xl sm:rounded-[24px] p-6 sm:p-7 border border-[#DCD7CE] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar Inisial Bulat Elegan */}
              <div className="w-16 h-16 rounded-full bg-espresso text-cream text-xl font-bold flex items-center justify-center border-2 border-sand shadow-sm shrink-0">
                {getInitials(user.displayName)}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-espresso truncate">
                    {user.displayName}
                  </h2>
                  {user.role === "doctor" && user.doctorLicenseId && (
                    <BadgeCheck
                      size={17}
                      className="text-sage shrink-0"
                      aria-label="SIP Terverifikasi"
                    />
                  )}
                </div>

                <p className="flex items-center gap-1.5 text-xs text-warm-muted mt-0.5">
                  <Mail size={13} className="text-warm-muted/70" />
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            {/* Lencana Role Status Kapsul */}
            <span
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase w-fit shadow-2xs",
                user.role === "doctor"
                  ? "bg-sage/15 text-sage border border-sage/30"
                  : user.role === "admin"
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "bg-peach text-orange border border-orange/25"
              )}
            >
              {userRoleLabel}
            </span>
          </div>

          {/* Grid Informasi Rinci Akun */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-sand/40">
            {/* Metode Masuk */}
            <div className="p-3.5 rounded-2xl bg-[#FAF6EE]/70 border border-sand/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-espresso/70 shrink-0 shadow-xs">
                <KeyRound size={15} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-warm-muted uppercase tracking-wider block">
                  Metode Masuk
                </span>
                <span className="text-xs font-semibold text-espresso">
                  {user.provider === "google" ? "Google Sign-In" : "Email & Kata Sandi"}
                </span>
              </div>
            </div>

            {/* Tanggal Terdaftar */}
            <div className="p-3.5 rounded-2xl bg-[#FAF6EE]/70 border border-sand/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-espresso/70 shrink-0 shadow-xs">
                <Calendar size={15} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-warm-muted uppercase tracking-wider block">
                  Tanggal Terdaftar
                </span>
                <span className="text-xs font-semibold text-espresso font-mono">
                  {formatDate(user.createdAt)}
                </span>
              </div>
            </div>

            {/* Khusus Pasien: Preferensi Pendekatan Konseling */}
            {user.role === "patient" && (
              <>
                <div className="p-3.5 rounded-2xl bg-[#FAF6EE]/70 border border-sand/50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-espresso/70 shrink-0 shadow-xs">
                    <Sparkles size={15} className="text-gold fill-gold" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-warm-muted uppercase tracking-wider block">
                      Slot Konseling
                    </span>
                    <span className="text-xs font-semibold text-espresso">
                      {user.preferredSlot ?? "Malam Hari (Fleksibel)"}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF6EE]/70 border border-sand/50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-espresso/70 shrink-0 shadow-xs">
                    <ShieldCheck size={15} className="text-sage" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-warm-muted uppercase tracking-wider block">
                      Pendekatan Terapi
                    </span>
                    <span className="text-xs font-semibold text-espresso truncate">
                      {user.counselingPreferences?.length
                        ? user.counselingPreferences.join(", ")
                        : "Cognitive Behavioral Therapy (CBT)"}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Khusus Dokter DPJP: Nomor Lisensi SIP & Spesialisasi */}
            {user.role === "doctor" && (
              <>
                <div className="p-3.5 rounded-2xl bg-[#FAF6EE]/70 border border-sand/50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sage shrink-0 shadow-xs">
                    <BadgeCheck size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-warm-muted uppercase tracking-wider block">
                      Nomor SIP 8-Digit
                    </span>
                    <span className="text-xs font-bold text-espresso font-mono">
                      {user.doctorLicenseId ?? "SIP-84920193"}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF6EE]/70 border border-sand/50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-espresso/70 shrink-0 shadow-xs">
                    <Stethoscope size={15} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-warm-muted uppercase tracking-wider block">
                      Spesialisasi
                    </span>
                    <span className="text-xs font-semibold text-espresso">
                      {user.specialization ?? "Psikiatri Klinis & Gangguan Afektif"}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ============================================================= */}
        {/* KARTU 2: PROTOKOL KEAMANAN & PRIVASI ZERO-PLAINTEXT           */}
        {/* ============================================================= */}
        <div className="bg-white rounded-2xl sm:rounded-[24px] p-6 sm:p-7 border border-[#DCD7CE] shadow-sm space-y-4 text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-sage/15 text-sage flex items-center justify-center shrink-0">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-espresso">
                Keamanan &amp; Privasi Zero-Plaintext
              </h3>
              <p className="text-[11px] text-warm-muted">
                Standar Perlindungan Data Kesehatan Jiwa Digital
              </p>
            </div>
          </div>

          <p className="text-xs text-warm-muted leading-relaxed">
            Seluruh pesan percakapan Anda dengan Doctor Freud.ai diproses secara lokal dan terisolasi. Sistem menerapkan kebijakan ketat <strong>Zero-Plaintext</strong>: teks percakapan mentah tidak pernah disimpan secara permanen di database publik, melainkan diamankan sebagai hash token terenkripsi dan vektor embedding berlatensi CPU &lt; 60ms.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px] font-semibold text-espresso/80">
            <div className="p-2 rounded-xl bg-cream/70 border border-sand/40 text-center">
              ✔ L0 UTS #39 Sanitasi
            </div>
            <div className="p-2 rounded-xl bg-cream/70 border border-sand/40 text-center">
              ✔ L1 ONNX Dual-Axis
            </div>
            <div className="p-2 rounded-xl bg-cream/70 border border-sand/40 text-center">
              ✔ L2 Context Match
            </div>
            <div className="p-2 rounded-xl bg-cream/70 border border-sand/40 text-center">
              ✔ L3 CIM Momentum
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* KARTU 3: AKSI AKUN & KELUAR (CORAL ALERT)                      */}
        {/* ============================================================= */}
        <div className="bg-white rounded-2xl sm:rounded-[24px] p-6 sm:p-7 border border-[#DCD7CE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-espresso">
              Keluar dari Sesi
            </h4>
            <p className="text-xs text-warm-muted">
              Akhiri sesi aktif Anda pada perangkat ini dengan aman.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className={cn(
              "rounded-full bg-white border border-coral text-coral",
              "hover:bg-coral/10 active:scale-95 transition-all",
              "px-6 py-2.5 text-xs font-bold inline-flex items-center justify-center gap-2 shadow-xs select-none"
            )}
          >
            <LogOut size={14} />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
}
