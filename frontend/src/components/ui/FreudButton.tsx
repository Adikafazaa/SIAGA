"use client";

import React, { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type FreudButtonVariant =
  | "espresso"
  | "sage"
  | "creamGhost"
  | "orange"
  | "gold";

export type FreudButtonSize = "sm" | "md" | "lg" | "icon";

export interface FreudButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Gaya varian warna Freud Web UI */
  variant?: FreudButtonVariant;
  /** Ukuran tombol */
  size?: FreudButtonSize;
  /** Ikon sisi kiri teks tombol */
  leftIcon?: React.ReactNode;
  /** Ikon sisi kanan teks tombol */
  rightIcon?: React.ReactNode;
  /** Status sedang memuat / loading */
  loading?: boolean;
}

const VARIANT_STYLES: Record<FreudButtonVariant, string> = {
  // Primer Gelap: Espresso (#2C1D11)
  espresso:
    "bg-espresso text-cream hover:bg-espresso-hover active:bg-espresso shadow-sm",
  // Aksen Hijau Zaitun: Sage (#8DA85E)
  sage:
    "bg-sage text-white hover:brightness-95 active:brightness-90 shadow-sm",
  // Cream Ghost: Latar Krem Halus atau Transparan ber-border Sand
  creamGhost:
    "bg-cream text-espresso border border-sand hover:bg-oatmeal active:bg-sand/60",
  // Terracotta Orange: Aksen Obrolan (#E87934)
  orange:
    "bg-orange text-white hover:brightness-95 active:brightness-90 shadow-sm",
  // Gold Sparkle: Aksen Kilau AI (#FFD147)
  gold:
    "bg-gold text-espresso hover:brightness-95 active:brightness-90 shadow-sm",
};

const SIZE_STYLES: Record<FreudButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs font-semibold gap-1.5",
  md: "px-5 py-2.5 text-sm font-medium gap-2",
  lg: "px-7 py-3.5 text-base font-semibold gap-2.5",
  icon: "h-10 w-10 p-0 flex items-center justify-center shrink-0",
};

/**
 * FreudButton — Tombol Kapsul Freud Web UI (Dribbble 23734329)
 * Memiliki lengkung bulat penuh (rounded-full) dengan umpan balik taktil pegas (active:scale-[0.98]).
 */
export const FreudButton = forwardRef<HTMLButtonElement, FreudButtonProps>(
  function FreudButton(
    {
      variant = "espresso",
      size = "md",
      leftIcon,
      rightIcon,
      loading = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Bentuk kapsul penuh & transisi pegas taktil Emil Kowalski
          "inline-flex items-center justify-center rounded-full font-sans select-none shadow-clay-pill",
          "transition-all duration-200 ease-out",
          "hover:scale-[1.02] hover:-translate-y-0.5",
          "active:scale-[0.96] active:translate-y-0 active:duration-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
          "disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 disabled:hover:scale-100 disabled:hover:translate-y-0",
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

export default FreudButton;
