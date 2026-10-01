"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Stethoscope,
  User as UserIcon,
  UserRound,
} from "lucide-react";
import { AuthShowcasePanel } from "@/components/auth/AuthShowcasePanel";
import { FreudFlowerLoader } from "@/components/ui/FreudFlowerLoader";
import { useAuth } from "@/features/auth/auth-provider";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Minimal 8 karakter"),
  name: z.string().min(2, "Nama minimal 2 karakter"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();
  const [role, setRole] = useState<Role>("patient");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setError(null);
    setBusy(true);
    try {
      await signUpWithEmail(values.email, values.password, role);
      router.replace("/onboarding");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Pendaftaran akun gagal. Silakan coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-cream font-sans text-espresso selection:bg-orange selection:text-white">
      {/* ======================================================================= */}
      {/* PANEL KIRI: VISUAL BRAND & 3D INTERACTIVE WORLD (lg:col-span-7 #2C1D11) */}
      {/* ======================================================================= */}
      <AuthShowcasePanel />

      {/* ======================================================================= */}
      {/* PANEL KANAN: CLAYMORPHIC ELEVATED FORM CARD (lg:col-span-5 bg-cream)    */}
      {/* ======================================================================= */}
      <div className="lg:col-span-5 bg-cream p-4 sm:p-8 lg:p-12 flex flex-col justify-center items-center min-h-screen relative select-none">
        {/* KARTU CLAYMORPHIC MEWAH PEMBUNGKUS PENDAFTARAN */}
        <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-10 shadow-[0_24px_60px_-15px_rgba(44,29,17,0.08)] border border-[#E8DFD3] space-y-6 shadow-clay-card">
          {/* Header Brand: Logo Bunga Freud + SIAGA */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group focus-visible:outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-espresso flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <FreudFlowerLoader size={22} />
              </div>
              <span className="font-extrabold text-lg tracking-wider text-espresso">
                SIAGA
              </span>
            </Link>

            <span className="text-[10px] font-bold uppercase tracking-wider text-sage px-3 py-1 rounded-full bg-sage/15 border border-sage/30">
              Registrasi Pasien &amp; DPJP
            </span>
          </div>

          {/* SLIDING PILL TAB SWITCHER DI ATAS FORMULIR */}
          <div className="rounded-full bg-[#FAF6EE] p-1 border border-sand flex items-center shadow-2xs">
            <Link
              href="/login"
              className="flex-1 py-2 px-4 rounded-full text-warm-muted hover:text-espresso text-xs font-bold transition-all text-center"
            >
              Masuk ke Akun
            </Link>
            <button
              type="button"
              className="flex-1 py-2 px-4 rounded-full bg-espresso text-cream text-xs font-bold shadow-sm transition-all text-center"
            >
              Daftar Baru
            </button>
          </div>

          {/* Judul & Subjudul Pendaftaran */}
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-espresso tracking-tight">
              Mulai Perjalanan Pemulihan Anda
            </h2>
            <p className="text-xs text-warm-muted leading-relaxed">
              Pilih peran akun Anda — alur pendampingan klinis akan menyesuaikan.
            </p>
          </div>

          {/* Notifikasi Error */}
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 animate-in fade-in"
            >
              {error}
            </div>
          )}

          {/* FORMULIR PENDAFTARAN INTERAKTIF */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* PEMILIH PERAN INTERAKTIF (ROLE SELECTOR DUA KARTU) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-espresso block">
                Pilih Peran Akun:
              </label>

              <div
                className="grid grid-cols-2 gap-3"
                role="radiogroup"
                aria-label="Peran pengguna"
              >
                {[
                  {
                    value: "patient" as const,
                    label: "Pasien",
                    desc: "Konseling & Asesmen",
                    icon: UserRound,
                  },
                  {
                    value: "doctor" as const,
                    label: "Dokter Jiwa",
                    desc: "Portal DPJP & SIP",
                    icon: Stethoscope,
                  },
                ].map((opt) => {
                  const active = role === opt.value;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setRole(opt.value)}
                      className={cn(
                        "rounded-2xl p-3.5 text-left transition-all duration-150 relative",
                        "flex flex-col gap-1 active:scale-[0.98] border select-none",
                        active
                          ? "bg-[#FCEBDD] border-2 border-espresso shadow-xs"
                          : "bg-white border-sand/70 text-espresso/80 hover:border-sand hover:bg-white/80"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <opt.icon
                          size={18}
                          className={active ? "text-orange" : "text-warm-muted"}
                        />
                        {active && (
                          <span className="w-4 h-4 rounded-full bg-espresso text-white flex items-center justify-center text-[10px]">
                            <Check size={10} strokeWidth={3} />
                          </span>
                        )}
                      </div>

                      <p
                        className={cn(
                          "mt-1 text-xs sm:text-sm font-bold",
                          active ? "text-espresso" : "text-espresso/90"
                        )}
                      >
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-warm-muted leading-tight">
                        {opt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Nama Lengkap dengan Ikon User di Kiri */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-espresso block">
                Nama Lengkap
              </label>
              <div className="relative">
                <UserIcon
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="cth. Andi Pratama"
                  autoComplete="name"
                  {...register("name")}
                  className={cn(
                    "w-full rounded-xl border border-sand bg-white pl-10 pr-4 py-3 text-xs sm:text-sm text-espresso font-sans",
                    "placeholder:text-warm-muted/60 focus:ring-2 focus:ring-sage/40 focus:border-sage outline-none transition-all",
                    errors.name && "border-red-400 focus:ring-red-200"
                  )}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Input Email dengan Ikon Mail di Kiri */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-espresso block">
                Alamat Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted pointer-events-none"
                />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  autoComplete="email"
                  {...register("email")}
                  className={cn(
                    "w-full rounded-xl border border-sand bg-white pl-10 pr-4 py-3 text-xs sm:text-sm text-espresso font-sans",
                    "placeholder:text-warm-muted/60 focus:ring-2 focus:ring-sage/40 focus:border-sage outline-none transition-all",
                    errors.email && "border-red-400 focus:ring-red-200"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Input Kata Sandi dengan Ikon Lock & Toggle Peek Eye */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-espresso block">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[11px] font-semibold text-orange hover:underline flex items-center gap-1 select-none"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPassword ? "Sembunyikan" : "Lihat"}</span>
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter..."
                  autoComplete="new-password"
                  {...register("password")}
                  className={cn(
                    "w-full rounded-xl border border-sand bg-white pl-10 pr-10 py-3 text-xs sm:text-sm text-espresso font-sans",
                    "placeholder:text-warm-muted/60 focus:ring-2 focus:ring-sage/40 focus:border-sage outline-none transition-all",
                    errors.password && "border-red-400 focus:ring-red-200"
                  )}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Tombol Utama Daftar */}
            <button
              type="submit"
              disabled={busy}
              className={cn(
                "w-full py-3.5 rounded-full bg-espresso text-cream font-bold text-sm",
                "hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 shadow-md",
                "flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              )}
            >
              {busy ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span>Daftar &amp; Mulai Onboarding</span>
                  <ArrowRight size={15} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          {/* Kutipan Terapeutik Menenangkan di Bagian Bawah */}
          <div className="pt-2 border-t border-sand/40 text-center">
            <p className="text-[11px] italic text-warm-muted leading-relaxed">
              &ldquo;Setiap langkah kecil adalah bagian dari proses pemulihan pikiran Anda.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
