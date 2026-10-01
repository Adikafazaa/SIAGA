"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { AuthShowcasePanel } from "@/components/auth/AuthShowcasePanel";
import { FreudFlowerLoader } from "@/components/ui/FreudFlowerLoader";
import { useAuth } from "@/features/auth/auth-provider";
import { DEMO_ACCOUNTS, ROLE_HOME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle, signInWithEmail, isMockAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"form" | "google" | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (loading || !user) return;
    if (user.role && user.onboardingCompleted) {
      router.replace(ROLE_HOME[user.role] ?? "/chat");
    } else {
      router.replace("/onboarding");
    }
  }, [user, loading, router]);

  async function onSubmit(values: FormValues) {
    setError(null);
    setBusy("form");
    try {
      const u = await signInWithEmail(values.email, values.password);
      router.replace(
        u.role && u.onboardingCompleted
          ? ROLE_HOME[u.role] ?? "/chat"
          : "/onboarding"
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal masuk ke akun. Silakan coba lagi.");
    } finally {
      setBusy(null);
    }
  }

  async function onGoogle() {
    setError(null);
    setBusy("google");
    try {
      const u = await signInWithGoogle();
      if (u) {
        router.replace(
          u.role && u.onboardingCompleted
            ? ROLE_HOME[u.role] ?? "/chat"
            : "/onboarding"
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google Sign-In gagal.");
    } finally {
      setBusy(null);
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
        {/* KARTU CLAYMORPHIC MEWAH PEMBUNGKUS FORMULIR */}
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
              Konseling Aman
            </span>
          </div>

          {/* SLIDING PILL TAB SWITCHER DI ATAS FORMULIR */}
          <div className="rounded-full bg-[#FAF6EE] p-1 border border-sand flex items-center shadow-2xs">
            <button
              type="button"
              className="flex-1 py-2 px-4 rounded-full bg-espresso text-cream text-xs font-bold shadow-sm transition-all text-center"
            >
              Masuk ke Akun
            </button>
            <Link
              href="/register"
              className="flex-1 py-2 px-4 rounded-full text-warm-muted hover:text-espresso text-xs font-bold transition-all text-center"
            >
              Daftar Baru
            </Link>
          </div>

          {/* Judul & Subjudul Halaman Login */}
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-espresso tracking-tight">
              Selamat Datang Kembali
            </h2>
            <p className="text-xs text-warm-muted leading-relaxed">
              Lanjutkan sesi konseling dan pemulihan mental Anda.
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

          {/* FORMULIR LOGIN INTERAKTIF */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Field Email dengan Ikon Mail di Kiri */}
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

            {/* Field Kata Sandi dengan Ikon Lock & Toggle Peek Eye */}
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
                  placeholder="Masukkan kata sandi..."
                  autoComplete="current-password"
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

            {/* Tombol Utama: Kapsul Espresso Membulat Penuh */}
            <button
              type="submit"
              disabled={busy !== null}
              className={cn(
                "w-full py-3.5 rounded-full bg-espresso text-cream font-bold text-sm",
                "hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 shadow-md",
                "flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              )}
            >
              {busy === "form" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Konseling</span>
                  <ArrowRight size={15} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          {/* Garis Pembatas 'ATAU' */}
          <div className="my-3 flex items-center gap-3">
            <span className="h-px flex-1 bg-sand/60" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-warm-muted">
              atau
            </span>
            <span className="h-px flex-1 bg-sand/60" />
          </div>

          {/* Tombol Masuk dengan Google */}
          <button
            type="button"
            onClick={onGoogle}
            disabled={busy !== null}
            className={cn(
              "w-full py-3 rounded-full bg-white border border-[#DCD7CE] text-espresso",
              "font-semibold text-xs shadow-xs hover:bg-[#EFECE6] active:scale-[0.98] transition-all",
              "flex items-center justify-center gap-2.5 disabled:opacity-50"
            )}
          >
            {busy === "google" ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span>Masuk dengan Google</span>
          </button>

          {/* Akses Cepat Akun Demo (Jika Demo Mode Aktif) */}
          {isMockAuth && (
            <div className="rounded-2xl border border-dashed border-sand bg-[#EFECE6]/60 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-warm-muted">
                <UserCheck size={13} />
                <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
                  Akses Cepat Akun Demo
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {DEMO_ACCOUNTS.map((a) => (
                  <button
                    key={a.email}
                    type="button"
                    onClick={() => {
                      setValue("email", a.email);
                      setValue("password", a.password);
                      void onSubmit({ email: a.email, password: a.password });
                    }}
                    className="rounded-full border border-sand bg-white px-3 py-1 text-[11px] font-semibold text-espresso hover:border-orange hover:text-orange active:scale-95 transition-all shadow-2xs"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

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

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.44.35-2.1V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}
