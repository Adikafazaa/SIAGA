"use client";

import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SafeRechartsContainer } from "./SafeRechartsContainer";
import { DECISION, SOC, TEAM } from "@/theme/colors";
import type { MomentumPoint } from "@/lib/types";
import { fixed } from "@/lib/format";

export interface MomentumChartProps {
  data: MomentumPoint[];
  height?: number;
}

/**
 * Kurva momentum CIM Telemetri SOC (DESIGN.md §7.3):
 * Garis solid stateful vs dashed baseline stateless + ambang batas PROBE/BLOCK.
 *
 * KRITIKAL 60 FPS:
 * Seluruh kurva dan tooltip wajib isAnimationActive={false} agar streaming real-time
 * dari backend/CIM Engine tidak memicu re-render lag atau drop frame.
 * Dilindungi SafeRechartsContainer dari error hydration SSR.
 */
export function MomentumChart({ data, height = 220 }: MomentumChartProps) {
  return (
    <SafeRechartsContainer
      height={height}
      loadingLabel="Menyiapkan telemetri momentum CIM…"
      className="bg-soc-panel border border-soc-border"
    >
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
        {/* Garis grid konsol tajam SOC tanpa animasi */}
        <CartesianGrid stroke={SOC.border} strokeDasharray="0" />

        <XAxis
          dataKey="turn"
          stroke={SOC.muted}
          tick={{ fontSize: 10, fontFamily: "var(--font-jetbrains)" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 1]}
          ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
          stroke={SOC.muted}
          tick={{ fontSize: 10, fontFamily: "var(--font-jetbrains)" }}
          tickLine={false}
          width={46}
        />

        <Tooltip
          isAnimationActive={false}
          contentStyle={{
            backgroundColor: SOC.panel,
            border: `1px solid ${SOC.border}`,
            borderRadius: 0,
            fontFamily: "var(--font-jetbrains)",
            fontSize: 11,
            color: SOC.text,
          }}
          labelStyle={{ color: SOC.muted }}
          formatter={(value, name) => [
            fixed(Number(value ?? 0)),
            name === "momentum" ? "momentum (CIM)" : "baseline stateless",
          ]}
          labelFormatter={(label) => `Turn ${label}`}
        />

        {/* Garis Ambang Probe (Ungu #7C3AED) */}
        <ReferenceLine
          y={0.6}
          stroke={DECISION.probe}
          strokeDasharray="4 4"
          label={{
            value: "PROBE 0.6",
            fill: DECISION.probe,
            fontSize: 9,
            position: "insideTopRight",
            fontFamily: "var(--font-jetbrains)",
          }}
        />

        {/* Garis Ambang Block (Merah #DC2626) */}
        <ReferenceLine
          y={0.8}
          stroke={DECISION.block}
          label={{
            value: "BLOCK 0.8",
            fill: DECISION.block,
            fontSize: 9,
            position: "insideTopRight",
            fontFamily: "var(--font-jetbrains)",
          }}
        />

        {/* Garis Baseline Stateless (Abu-abu putus-putus) — 60 FPS isAnimationActive={false} */}
        <Line
          type="monotone"
          dataKey="baseline"
          stroke={TEAM.nonnovel}
          strokeDasharray="6 3"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />

        {/* Garis Momentum Stateful (Putih Solid) — 60 FPS isAnimationActive={false} */}
        <Line
          type="monotone"
          dataKey="momentum"
          stroke={SOC.text}
          strokeWidth={2}
          dot={{ r: 2.5, fill: SOC.text, strokeWidth: 0 }}
          isAnimationActive={false}
        />
      </LineChart>
    </SafeRechartsContainer>
  );
}

export default MomentumChart;
