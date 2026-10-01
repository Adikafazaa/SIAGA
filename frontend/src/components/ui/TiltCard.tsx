"use client";

import React, { useCallback, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Derajat kemiringan maksimum (default: 7) */
  maxTilt?: number;
  /** Jarak perspektif CSS dalam pixel (default: 1000) */
  perspective?: number;
  /** Skala saat di-hover (default: 1.02) */
  scale?: number;
  className?: string;
}

/**
 * TiltCard — Komponen Interaktif 3D Perspective Mouse Parallax
 *
 * Mengikuti filosofi micro-interactions Emil Kowalski:
 * - Mengikuti kursor mouse secara presisi dengan rotasi 3D rotateX & rotateY
 * - Kembali ke orientasi awal dengan transisi pegas lembut saat kursor pergi
 * - Mendukung kedalaman preserve-3d untuk elemen badge yang melayang di atasnya
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  maxTilt = 7,
  perspective = 1000,
  scale = 1.02,
  className,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    isHovered: false,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Hitung derajat rotasi: kursor di kanan memutar ke kanan (rotateY positif), kursor di atas memutar ke atas (rotateX negatif)
      const rotateX = Number((-((y - centerY) / centerY) * maxTilt).toFixed(2));
      const rotateY = Number((((x - centerX) / centerX) * maxTilt).toFixed(2));

      setTransform({ rotateX, rotateY, isHovered: true });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0, isHovered: false });
  }, []);

  const currentScale = transform.isHovered ? scale : 1;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
      }}
      className={cn("transition-transform duration-100 ease-out select-none", className)}
      {...props}
    >
      <div
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale3d(${currentScale}, ${currentScale}, ${currentScale})`,
          transformStyle: "preserve-3d",
          transition: transform.isHovered
            ? "transform 100ms ease-out"
            : "transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1)", // Emil Kowalski spring easing
        }}
        className="w-full h-full"
      >
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
