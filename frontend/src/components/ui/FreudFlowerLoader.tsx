import React from "react";
import { cn } from "@/lib/utils";

export interface FreudFlowerLoaderProps {
  /** Ukuran lebar dan tinggi ikon bunga dalam pixel (default: 32) */
  size?: number;
  /** Kelas CSS tambahan Tailwind */
  className?: string;
  /** Label aksesibilitas untuk screen reader */
  accessibleLabel?: string;
}

/**
 * Freud 4-Petal Flower Brand Loader Widget
 * Ikon bunga 4-kelopak geometris khas Freud Web UI yang berputar 360° secara halus.
 * Menggunakan 4 token warna primer: Sage (#8DA85E), Orange (#E87934), Gold (#FFD147), Espresso (#2C1D11).
 */
export const FreudFlowerLoader: React.FC<FreudFlowerLoaderProps> = ({
  size = 32,
  className,
  accessibleLabel = "Memuat...",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="status"
    aria-label={accessibleLabel}
    className={cn("animate-[spin_4s_linear_infinite] shrink-0", className)}
  >
    {/* 4 Kelopak Geometris Simetris */}
    {/* Kelopak Atas: Sage Olive */}
    <circle cx="18" cy="9" r="6" fill="#8DA85E" />
    {/* Kelopak Kanan: Terracotta Orange */}
    <circle cx="27" cy="18" r="6" fill="#E87934" />
    {/* Kelopak Bawah: Gold Sparkle */}
    <circle cx="18" cy="27" r="6" fill="#FFD147" />
    {/* Kelopak Kiri: Deep Espresso */}
    <circle cx="9" cy="18" r="6" fill="#2C1D11" />
    {/* Inti Bunga: Warm Cream */}
    <circle cx="18" cy="18" r="3" fill="#FAF6EE" />
  </svg>
);

export default FreudFlowerLoader;
