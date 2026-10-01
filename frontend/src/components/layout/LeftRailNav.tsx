"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart2,
  LogOut,
  LucideIcon,
  MessageSquare,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import { FreudFlowerLoader } from "@/components/ui/FreudFlowerLoader";
import { cn } from "@/lib/utils";

interface RailIconItem {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
}

const RAIL_ITEMS: RailIconItem[] = [
  { id: "chat", href: "/chat", label: "Chat Konseling", icon: MessageSquare },
  { id: "assessments", href: "/assessments", label: "Asesmen Klinis", icon: BarChart2 },
  { id: "community", href: "/community", label: "Support Community", icon: Users, badge: "8" },
  { id: "telemetry", href: "/admin/telemetry", label: "Telemetri SIAGA", icon: ShieldCheck },
  { id: "profile", href: "/profile", label: "Pengaturan & Profil", icon: Settings },
];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Kolom 1 — Dark Left Rail Navigation (100% Identik Foto 2 Freud Asli)
 * - Lebar presisi: w-[72px]
 * - Latar: Espresso pekat #2C1D11
 * - Atas: Logo bunga 4-kelopak Freud di dalam lingkaran putih bulat
 * - Tengah: Ikon navigasi vertikal (Inbox aktif, Analytics, Bookmark, Community [8], Settings)
 * - Bawah: Avatar profil pengguna
 */
export const LeftRailNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOutUser } = useAuth();

  const handleLogout = async () => {
    await signOutUser();
    router.replace("/login");
  };

  const userInitial = user?.displayName ? getInitials(user.displayName) : "S";

  return (
    <>
      {/* DESKTOP LEFT RAIL (w-[72px] Espresso) */}
      <aside
        className={cn(
          "hidden md:flex flex-col items-center justify-between",
          "w-[72px] shrink-0 h-screen sticky top-0 py-6",
          "bg-[#2C1D11] text-white z-30 select-none shadow-md border-r border-[#3D2A1C]/50"
        )}
      >
        {/* ATAS: Logo Bunga Freud di dalam Lingkaran Putih Bulat */}
        <Link
          href="/"
          title="Freud Web UI • SIAGA"
          className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
        >
          <FreudFlowerLoader size={26} />
        </Link>

        {/* TENGAH: Menu Ikon Navigasi Vertikal */}
        <nav className="flex flex-col items-center gap-5 my-auto">
          {RAIL_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.id}
                href={item.href}
                title={item.label}
                className={cn(
                  "relative group w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150",
                  "active:scale-95",
                  isActive
                    ? "bg-[#FAF6EE] text-[#2C1D11] shadow-md font-bold"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <item.icon size={20} />

                {/* Lencana Angka Komunitas Oranye ('8') */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E87934] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
                {/* Tooltip Hover Kanan */}
                <span
                  className={cn(
                    "absolute left-14 px-2.5 py-1 rounded-xl bg-[#2C1D11] border border-white/20",
                    "text-[#FAF6EE] text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none shadow-xl",
                    "group-hover:opacity-100 transition-opacity duration-150 z-50 font-sans"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* BAWAH: Avatar Pengguna & Tombol Keluar */}
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/profile"
            title={`Profil: ${user?.displayName ?? "Pengguna"}`}
            className="w-10 h-10 rounded-full bg-[#FAF6EE]/20 border border-white/30 text-white flex items-center justify-center text-xs font-bold hover:border-gold transition-colors shadow-xs"
          >
            {userInitial}
          </Link>

          <button
            type="button"
            onClick={() => void handleLogout()}
            title="Keluar"
            aria-label="Keluar"
            className="w-8 h-8 rounded-full text-white/40 hover:text-coral hover:bg-white/10 flex items-center justify-center transition-colors active:scale-95"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav
        aria-label="Navigasi Bawah"
        className={cn(
          "fixed bottom-3 left-4 right-4 h-14 bg-[#2C1D11] text-white rounded-full",
          "shadow-2xl flex items-center justify-around z-50 md:hidden border border-white/20 px-2"
        )}
      >
        {RAIL_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-90",
                isActive ? "bg-[#FAF6EE] text-[#2C1D11] shadow font-bold" : "text-white/70 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#E87934] text-white text-[8px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
        <Link
          href="/profile"
          className="w-8 h-8 rounded-full bg-white/20 text-white text-[11px] font-bold flex items-center justify-center border border-white/40"
        >
          {userInitial}
        </Link>
      </nav>
    </>
  );
};

export default LeftRailNav;
