"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ClipboardList, HeartPulse, Home, LogOut, MessageCircle, UsersRound, UserRound } from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import { useCrisis } from "@/components/crisis/CrisisProvider";
import { BrandMark } from "@/components/brand/BrandMark";

const NAV = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/chat", label: "HavenCare AI", icon: MessageCircle },
  { href: "/assessments", label: "Self Check-in", icon: ClipboardList },
  { href: "/community", label: "Komunitas", icon: UsersRound },
  { href: "/profile", label: "Profil", icon: UserRound },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOutUser } = useAuth();
  const { openCrisis } = useCrisis();
  const name = user?.displayName || "Sahabat HavenCare";

  async function handleLogout() {
    await signOutUser();
    router.replace("/login");
  }

  return <div className="hc-canvas min-h-dvh">
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-[250px] shrink-0 flex-col border-r border-[#d5e9e9] bg-white/65 px-4 py-6 backdrop-blur-xl lg:flex">
        <Link href="/dashboard" className="hc-brand mb-10 px-2"><BrandMark /> HavenCare</Link>
        <p className="hc-label mb-3 px-4 text-[11px]">Ruang pribadimu</p>
        <nav className="space-y-1" aria-label="Navigasi utama pasien">{NAV.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-bold transition-colors ${pathname === href ? "bg-[#1a7f8e] text-white shadow-md shadow-[#1a7f8e]/20" : "text-[#5d7077] hover:bg-white/80 hover:text-[#0b5963]"}`}><Icon size={19} />{label}</Link>)}</nav>
        <div className="mt-auto space-y-3">
          <button onClick={openCrisis} className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-[#e06d6d]/35 bg-[#e06d6d]/10 px-4 text-left text-sm font-extrabold text-[#bd5258] hover:bg-[#e06d6d]/20"><HeartPulse size={20} /> Bantuan darurat</button>
          <div className="rounded-2xl bg-[#eaf7f8]/80 p-4"><p className="text-xs font-bold text-[#162831]">{name}</p><p className="mt-1 text-[11px] text-[#5d7077]">Ruang aman untuk bertumbuh</p><button onClick={handleLogout} className="mt-3 flex items-center gap-2 text-xs font-bold text-[#5d7077] hover:text-[#1a7f8e]"><LogOut size={14} /> Keluar akun</button></div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-between gap-3 border-b border-[#d5e9e9] bg-white/60 px-5 backdrop-blur-xl lg:px-9">
          <Link href="/dashboard" className="hc-brand text-lg lg:hidden"><BrandMark /> HavenCare</Link>
          <p className="hidden text-sm font-bold text-[#5d7077] lg:block">Ruang refleksi & pendampinganmu</p>
          <div className="flex items-center gap-3"><span className="hidden text-sm font-semibold text-[#5d7077] sm:inline">Hai, {name.split(" ")[0]}</span><span className="grid h-10 w-10 place-items-center rounded-full bg-[#d8eef0] font-extrabold text-[#0b5963]">{name.slice(0,1).toUpperCase()}</span><button onClick={openCrisis} className="grid h-10 w-10 place-items-center rounded-full bg-[#e06d6d]/12 text-[#d45c63] lg:hidden" aria-label="Bantuan darurat"><HeartPulse size={20} /></button></div>
        </header>
        <main className="mx-auto w-full max-w-[1480px] px-4 pb-24 pt-6 sm:px-6 lg:px-9 lg:pb-8 lg:pt-8">{children}</main>
      </div>
    </div>
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-[#d5e9e9] bg-white/95 px-1 py-2 backdrop-blur-xl lg:hidden" aria-label="Navigasi bawah">{NAV.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-1 text-center text-[10px] font-bold ${pathname === href ? "text-[#1a7f8e]" : "text-[#71858b]"}`}><Icon size={20} /><span className="truncate">{label}</span></Link>)}</nav>
  </div>;
}
