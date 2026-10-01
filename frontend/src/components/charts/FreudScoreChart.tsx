"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import { SafeRechartsContainer } from "./SafeRechartsContainer";
import { FREUD } from "@/theme/colors";
import { cn } from "@/lib/utils";

export interface FreudScorePoint {
  day: string;
  score: number;
  anxiety?: number;
  note?: string;
}

const DEFAULT_WEEKLY_DATA: FreudScorePoint[] = [
  { day: "Sen", score: 68, anxiety: 34, note: "Stres kerja ringan" },
  { day: "Sel", score: 72, anxiety: 30, note: "Latihan napas 4-7-8" },
  { day: "Rab", score: 76, anxiety: 26, note: "Tidur 7.5 jam" },
  { day: "Kam", score: 81, anxiety: 22, note: "Refleksi sesi Freud" },
  { day: "Jum", score: 85, anxiety: 18, note: "Ketenangan meningkat" },
  { day: "Sab", score: 87, anxiety: 16, note: "Aktivitas luar ruangan" },
  { day: "Min", score: 90, anxiety: 14, note: "Kondisi optimal stabil" },
];

export interface FreudChartTooltipPayloadItem {
  value?: number | string;
  name?: string;
  dataKey?: string | number;
  color?: string;
  payload?: FreudScorePoint;
}

export interface FreudChartTooltipProps {
  active?: boolean;
  payload?: FreudChartTooltipPayloadItem[];
  label?: string;
}

/**
 * FreudChartTooltip — Tooltip Kapsul Kustom Recharts Freud Web UI
 * Berlatar Espresso (#2C1D11) dengan teks Cream (#FAF6EE), backdrop blur,
 * dan indikator dot Sage (#8DA85E).
 */
export const FreudChartTooltip: React.FC<FreudChartTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0];
  const scoreValue = item?.value ?? 0;
  const note = item?.payload?.note;

  return (
    <div className="rounded-2xl bg-espresso/95 px-4 py-2.5 text-cream shadow-xl backdrop-blur-md border border-sand/30 animate-in fade-in zoom-in-95 duration-150 select-none">
      <div className="flex items-center justify-between gap-3 mb-1">
        <span className="text-[10px] font-bold tracking-wider uppercase text-cream/70">
          {label}
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sage/25 text-sage">
          Freud Score
        </span>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <span className="h-2.5 w-2.5 rounded-full bg-sage ring-2 ring-sage/30 shrink-0" />
        <span className="text-xs font-medium text-cream/80">Indeks Kesejahteraan:</span>
        <span className="text-sm font-extrabold text-cream tabular-nums">
          {scoreValue}
          <span className="text-[10px] font-normal text-cream/60 ml-0.5">/100</span>
        </span>
      </div>

      {note && (
        <p className="mt-1.5 text-[10px] text-cream/75 border-t border-sand/20 pt-1 leading-snug">
          Catatan: {note}
        </p>
      )}
    </div>
  );
};

export interface FreudScoreChartProps {
  data?: FreudScorePoint[];
  height?: number;
  timeframe?: string;
  className?: string;
}

/**
 * FreudScoreChart — Grafik Kurva Tren Skor Kesehatan Mental
 *
 * Menggunakan Recharts AreaChart dengan kurva halus warna Sage (#8DA85E),
 * gradient fill memudar ke transparan, dan tooltip kapsul kustom Espresso/Cream.
 * Dibungkus SafeRechartsContainer untuk perlindungan SSR 100%.
 */
export const FreudScoreChart: React.FC<FreudScoreChartProps> = ({
  data = DEFAULT_WEEKLY_DATA,
  height = 220,
  timeframe = "7 Hari Terakhir",
  className,
}) => {
  const latestScore = data[data.length - 1]?.score ?? 88;
  const firstScore = data[0]?.score ?? 68;
  const scoreDiff = latestScore - firstScore;
  const isPositive = scoreDiff >= 0;

  return (
    <div
      className={cn(
        "rounded-2xl sm:rounded-[28px] bg-white border border-sand/70 p-4 sm:p-5 shadow-sm space-y-3",
        className
      )}
    >
      {/* Header Kartu Metrik */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sage animate-pulse" />
            <h3 className="text-xs sm:text-sm font-bold text-espresso">
              Tren Kesehatan Mental
            </h3>
          </div>
          <p className="text-[10px] text-warm-muted mt-0.5">
            Refleksi Asesmen Klinis Mandiri (PHQ-9 & GAD-7)
          </p>
        </div>

        <span className="text-[11px] font-semibold text-espresso/80 bg-cream border border-sand px-3 py-1 rounded-full shrink-0">
          {timeframe}
        </span>
      </div>

      {/* Nilai Metrik Utama & Persentase Tren */}
      <div className="flex items-baseline gap-2 pt-1">
        <span className="text-2xl sm:text-3xl font-extrabold text-espresso tabular-nums tracking-tight">
          {latestScore}
        </span>
        <span className="text-xs font-semibold text-warm-muted">/ 100</span>
        <span
          className={cn(
            "ml-auto text-xs font-bold px-2 py-0.5 rounded-full",
            isPositive ? "bg-sage/15 text-sage" : "bg-coral/15 text-coral"
          )}
        >
          {isPositive ? `+${scoreDiff} poin` : `${scoreDiff} poin`}
        </span>
      </div>

      {/* Area Visualisasi Recharts Terlindungi SSR */}
      <SafeRechartsContainer height={height}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 8, bottom: 0, left: -22 }}
        >
          <defs>
            {/* Gradient lembut Sage memudar ke transparan */}
            <linearGradient id="freudSageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={FREUD.sage} stopOpacity={0.4} />
              <stop offset="95%" stopColor={FREUD.sage} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Garis Kisi Horizontal Lembut Minimalis */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={FREUD.sand}
            vertical={false}
            opacity={0.6}
          />

          {/* Sumbu X (Hari) */}
          <XAxis
            dataKey="day"
            stroke={FREUD.warmMuted}
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: FREUD.sand }}
            dy={8}
            fontFamily="var(--font-urbanist)"
          />

          {/* Sumbu Y (Skor 0 - 100) */}
          <YAxis
            domain={[40, 100]}
            stroke={FREUD.warmMuted}
            fontSize={10}
            tickLine={false}
            axisLine={false}
            dx={-5}
            fontFamily="var(--font-urbanist)"
          />

          {/* Tooltip Kapsul Kustom Freud Web UI */}
          <Tooltip
            content={<FreudChartTooltip />}
            cursor={{
              stroke: FREUD.sage,
              strokeWidth: 1.5,
              strokeDasharray: "4 4",
            }}
          />

          {/* Kurva Area Sage Halus */}
          <Area
            type="monotone"
            dataKey="score"
            name="Freud Score"
            stroke={FREUD.sage}
            strokeWidth={3}
            fill="url(#freudSageGradient)"
            activeDot={{
              r: 6,
              fill: FREUD.sage,
              stroke: "#FFFFFF",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </SafeRechartsContainer>

      {/* Keterangan Bawah */}
      <div className="pt-2 border-t border-sand/40 flex items-center justify-between text-[11px] text-warm-muted">
        <span>Kondisi Emosional: <strong className="text-sage font-bold">Stabil</strong></span>
        <span>Target Pemulihan: <strong>≥ 85.0</strong></span>
      </div>
    </div>
  );
};

export default FreudScoreChart;
