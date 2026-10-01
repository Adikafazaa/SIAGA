"use client";

import React, { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LeftRailNav } from "./LeftRailNav";

export interface AppShellProps {
  children: ReactNode;
  /** Sembunyikan panel wawasan klinis kanan jika tidak diperlukan pada halaman tertentu */
  hideClinicalPanel?: boolean;
}

/**
 * AppShell — Master Shell Freud Web UI (Dribbble 23734329)
 *
 * Mengatur arsitektur navigasi dan kanvas:
 * - Rute /chat: Menghadirkan layout 4-kolom mulus terintegrasi (Left Rail + Chat Workspace)
 * - Rute non-chat (/profile, /assessments): Menyajikan kanvas Warm Cream (#FAF6EE) penuh,
 *   bersih, dan leluasa dengan Left Rail Navigation (w-[72px] Espresso) di sisi paling kiri.
 */
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // Pada rute /chat: tampilkan LeftRailNav dan delegasikan 3 kolom chat secara seamless
  if (pathname === "/chat") {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#FAF6EE] font-sans text-espresso select-none">
        {/* KOLOM 1: Dark Left Rail Navigation (w-[72px] Espresso) */}
        <LeftRailNav />

        {/* KOLOM 2, 3, 4: Unified Chat Canvas & Sidebars */}
        <div className="flex flex-1 min-w-0 h-screen overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  // Pada rute non-chat (/profile, /assessments):
  // HANYA render LeftRailNav di sisi kiri, kanvas sisa (flex-1) bersih tanpa sidebar chat
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-cream font-sans text-espresso select-none">
      {/* KOLOM 1: Dark Left Rail Navigation (~72px Espresso) */}
      <LeftRailNav />

      {/* Kanvas Penuh Warm Cream (#FAF6EE) Leluasa untuk Form Asesmen & Halaman Profil */}
      <main className="flex flex-1 flex-col min-w-0 h-screen overflow-y-auto bg-cream pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}

export default AppShell;
