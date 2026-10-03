"use client";

import React, { useEffect, useState, type ReactNode } from "react";
import { ResponsiveContainer } from "recharts";
import { FreudFlowerLoader } from "@/components/ui/FreudFlowerLoader";
import { cn } from "@/lib/utils";

export interface SafeRechartsContainerProps {
  children: ReactNode;
  /** Tinggi area visualisasi chart (default: 260) */
  height?: number | string;
  /** Lebar area visualisasi chart (default: '100%') */
  width?: number | string;
  /** Kelas CSS pembungkus container */
  className?: string;
  /** Pesan teks saat placeholder SSR aktif */
  loadingLabel?: string;
}

/**
 * SafeRechartsContainer — Wrapper Recharts Anti-Hydration Mismatch
 *
 * Mencegah error hydration SSR pada Next.js App Router dengan menyajikan
 * placeholder skeleton hangat khas Freud Web UI saat server-side rendering,
 * dan baru me-mount ResponsiveContainer ketika DOM telah terpasang di browser.
 */
export const SafeRechartsContainer: React.FC<SafeRechartsContainerProps> = ({
  children,
  height = 260,
  width = "100%",
  className,
  loadingLabel = "Menyiapkan visualisasi data klinis…",
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{ width, height, minHeight: typeof height === "number" ? height : 200 }}
        className={cn(
          "w-full rounded-2xl sm:rounded-[24px] bg-cream/70 border border-sand/60",
          "animate-pulse flex flex-col items-center justify-center gap-2.5 select-none",
          className
        )}
        role="status"
        aria-label={loadingLabel}
      >
        <FreudFlowerLoader size={24} className="opacity-70" />
        <span className="text-xs text-warm-muted font-medium tracking-wide">
          {loadingLabel}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ width, height }}
      className={cn("w-full relative select-none", className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
};

export default SafeRechartsContainer;
