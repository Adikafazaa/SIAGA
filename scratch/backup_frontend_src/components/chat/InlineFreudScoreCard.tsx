"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FreudFlowerLoader } from "@/components/ui/FreudFlowerLoader";
import { cn } from "@/lib/utils";

export interface InlineFreudScoreCardProps {
  score?: number;
  timeframe?: string;
  className?: string;
}

/**
 * InlineFreudScoreCard — Widget Tersemat Kurva Freud Score (100% Identik Foto 2)
 *
 * Ditampilkan langsung di dalam balon respon AI:
 * - Header: Ikon bunga Freud + "Freud Score" + pill dropdown "1 month ⌵"
 * - Y-Axis: 100, 80, 60, 40, 20
 * - Garis kisi-kisi horizontal putus-putus
 * - Kurva spline halus warna Sage (#8DA85E) dengan gradien memudar
 * - Floating Badge "88.2": Kapsul Sage mengambang di puncak kurva tertinggi
 */
export const InlineFreudScoreCard: React.FC<InlineFreudScoreCardProps> = ({
  score = 88.2,
  timeframe = "1 month",
  className,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

  // Titik puncak tertinggi kurva di koordinat (x: 135, y: 35) pada viewBox 500 x 140
  return (
    <div
      className={cn(
        "w-full rounded-2xl bg-white border border-sand/80 p-4 sm:p-5 shadow-sm mt-3 relative select-none",
        className
      )}
    >
      {/* Header Kartu: Ikon Bunga Freud + Freud Score + Dropdown */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <FreudFlowerLoader size={18} />
          </div>
          <span className="font-bold text-xs sm:text-sm text-[#2C1D11]">
            Freud Score
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedTimeframe((prev) => (prev === "1 month" ? "6 months" : "1 month"));
          }}
          className="rounded-full bg-[#FAF6EE] border border-sand/80 px-2.5 py-1 text-[11px] font-semibold text-[#2C1D11]/80 flex items-center gap-1 hover:bg-[#EFECE6] transition-colors shadow-2xs"
        >
          <span>{selectedTimeframe}</span>
          <ChevronDown size={13} className="text-warm-muted" />
        </button>
      </div>

      {/* Area Kurva Grafik dengan Sumbu Y & Gridlines */}
      <div className="relative h-32 sm:h-36 w-full flex items-center">
        {/* Label Sumbu Y (100, 80, 60, 40, 20) di Kiri */}
        <div className="h-full flex flex-col justify-between text-[10px] font-mono text-warm-muted/70 pr-2 select-none">
          <span>100</span>
          <span>80</span>
          <span>60</span>
          <span>40</span>
          <span>20</span>
        </div>

        {/* Kanvas SVG Dinamis Presisi */}
        <div className="relative flex-1 h-full">
          <svg
            viewBox="0 0 500 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Gradien Lembut Hijau Sage memudar ke transparan */}
              <linearGradient id="inlineSageGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8DA85E" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#8DA85E" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Garis Grid Horizontal Abu-abu Putus-putus */}
            <line x1="0" y1="5" x2="500" y2="5" stroke="#E8DFD3" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="0" y1="35" x2="500" y2="35" stroke="#E8DFD3" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="0" y1="65" x2="500" y2="65" stroke="#E8DFD3" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="0" y1="95" x2="500" y2="95" stroke="#E8DFD3" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="0" y1="125" x2="500" y2="125" stroke="#E8DFD3" strokeWidth="1" />

            {/* Area Fill Gradien di Bawah Kurva */}
            <path
              d="M 0 120 
                 C 50 120, 80 80, 115 55 
                 C 130 45, 140 38, 160 38 
                 C 180 38, 195 70, 220 110 
                 C 250 125, 270 20, 300 20 
                 C 330 20, 340 120, 370 120 
                 C 400 120, 420 80, 450 65 
                 C 475 50, 490 50, 500 50 
                 L 500 125 L 0 125 Z"
              fill="url(#inlineSageGrad)"
            />

            {/* Garis Kurva Spline Sage #8DA85E */}
            <path
              d="M 0 120 
                 C 50 120, 80 80, 115 55 
                 C 130 45, 140 38, 160 38 
                 C 180 38, 195 70, 220 110 
                 C 250 125, 270 20, 300 20 
                 C 330 20, 340 120, 370 120 
                 C 400 120, 420 80, 450 65 
                 C 475 50, 490 50, 500 50"
              fill="none"
              stroke="#8DA85E"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Titik Peak Terkini (x: 160, y: 38) */}
            <circle cx="160" cy="38" r="4.5" fill="#8DA85E" />
            <circle cx="160" cy="38" r="8" fill="#8DA85E" opacity="0.25" className="animate-ping" />
          </svg>

          {/* FLOATING BADGE "88.2" SAGE TEPAT DI ATAS PEAK KURVA (Persis Foto 2) */}
          <div className="absolute top-[8%] left-[28%] -translate-x-1/2 -translate-y-1/2 bg-[#8DA85E] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md z-10 flex items-center gap-1 tabular-nums animate-in fade-in">
            <span>{score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineFreudScoreCard;
