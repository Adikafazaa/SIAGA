import type { Config } from "tailwindcss";
import { DECISION, FREUD, SOC, TEAM } from "./src/theme/colors";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palet keputusan (DESIGN.md §2.1 — mengikat)
        allow: DECISION.allow,
        watch: DECISION.watch,
        probe: DECISION.probe,
        block: DECISION.block,
        // Permukaan konsol SOC (DESIGN.md §2.2)
        "soc-bg": SOC.bg,
        "soc-panel": SOC.panel,
        "soc-border": SOC.border,
        "soc-text": SOC.text,
        "soc-muted": SOC.muted,
        // Penanda tim (DESIGN.md §2.3)
        redai: TEAM.redai,
        blueai: TEAM.blueai,
        nonnovel: TEAM.nonnovel,
        // Palet Freud Web UI (Dribbble 23734329 & design_system.md §3)
        espresso: FREUD.espresso,
        "espresso-hover": FREUD.espressoHover,
        cream: FREUD.cream,
        orange: FREUD.orange,
        sage: FREUD.sage,
        gold: FREUD.gold,
        peach: FREUD.peach,
        "card-bg": FREUD.cardBg,
        "border-freud": FREUD.border,
        // Tints Sekunder
        oatmeal: FREUD.oatmeal,
        sand: FREUD.sand,
        "warm-muted": FREUD.warmMuted,
        lavender: FREUD.lavender,
        coral: FREUD.coral,
        "sky-dew": FREUD.skyDew,
        // Freud Night Therapy Mode
        "night-bg": FREUD.night.bg,
        "night-card": FREUD.night.card,
        "night-text": FREUD.night.text,
        "night-muted": FREUD.night.muted,
        "night-orange": FREUD.night.orange,
        // Alias jembatan migrasi antarmuka pasien (mengarah ke Freud)
        "care-blue": FREUD.espresso,
        "care-bg": FREUD.cream,
      },
      fontFamily: {
        sans: ["var(--font-urbanist)", "system-ui", "sans-serif"],
        urbanist: ["var(--font-urbanist)", "system-ui", "sans-serif"],
        display: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      minHeight: {
        screen: "100dvh",
      },
    },
  },
  plugins: [],
};

export default config;
