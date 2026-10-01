// SUMBER TUNGGAL WARNA (SIAGA-v2 DESIGN.md §2).
// Diimpor oleh tailwind.config.ts (palette) DAN komponen chart (hex SVG Recharts).
// Dilarang menulis hex di luar file ini — kecuali globals.css untuk aksen HUD statis.

export const DECISION = {
  /** Status Aman / ALLOW */
  allow: "#16A34A",
  /** Status Waspada / WATCH */
  watch: "#CA8A04",
  /** Interogasi Aktif / PROBE (sengaja keluarga ungu — jenis respons, bukan tingkatan risiko) */
  probe: "#7C3AED",
  /** Status Terblokir / BLOCK */
  block: "#DC2626",
} as const;

export const SOC = {
  /** Latar halaman konsol + grid titik */
  bg: "#0B1220",
  /** Permukaan panel/kartu */
  panel: "#111A2C",
  /** Border 1px semua elemen, garis grid chart */
  border: "#1F2A44",
  /** Teks utama, garis momentum di chart */
  text: "#E5E7EB",
  /** Label sekunder, caption, sumbu chart */
  muted: "#94A3B8",
} as const;

export const TEAM = {
  /** Segala hal milik Red-AI / penyerang */
  redai: "#EA580C",
  /** Blue-AI / guard (BUKAN status keputusan) */
  blueai: "#38BDF8",
  /** Komponen non-novel, baseline stateless */
  nonnovel: "#6B7280",
  /** Kurung sudut HUD di pojok panel (hanya globals.css) */
  hudLine: "#44548A",
} as const;

/**
 * Token Resmi Freud Web UI (Dribbble 23734329)
 * Warm Retro-Modern Organic Palette untuk Antarmuka Pasien, Dokter & Publik
 */
export const FREUD = {
  /** Espresso: Primer gelap / Left rail, heading, primary button (#2C1D11) */
  espresso: "#2C1D11",
  /** Espresso Hover (#3D2A1C) */
  espressoHover: "#3D2A1C",
  /** Warm Cream: Kanvas terang / Base canvas, chat background (#FAF6EE) */
  cream: "#FAF6EE",
  /** Terracotta Orange: Aksen obrolan & audio, balon pesan user, status aktif (#E87934) */
  orange: "#E87934",
  /** Sage Olive: Tombol kirim & grafik kurva mental health (#8DA85E) */
  sage: "#8DA85E",
  /** Gold Sparkle: Ikon sparkle & bintang, aksen kilau AI (#FFD147) */
  gold: "#FFD147",
  /** Peach: Sorotan kartu obrolan aktif (#FCEBDD) */
  peach: "#FCEBDD",
  /** Surface: Latar kartu respon bot & widget tersemat (#FFFFFF) */
  cardBg: "#FFFFFF",
  /** Border halus antar panel (#E8DFD3) */
  border: "#E8DFD3",

  // Tints Sekunder
  /** Oatmeal: Latar hover halus panel krem (#EFECE6) */
  oatmeal: "#EFECE6",
  /** Sand: Garis batas komponen (#DCD7CE) */
  sand: "#DCD7CE",
  /** Warm Muted: Label sekunder & caption (#786A5E) */
  warmMuted: "#786A5E",
  /** Lavender: Kategori insight & relaksasi (#9D8DF1) */
  lavender: "#9D8DF1",
  /** Coral Alert: Peringatan stres akut, lencana triase & kartu SOS (#E56B6F) */
  coral: "#E56B6F",
  /** Sky Dew: Kategori pernapasan & ketenangan (#7BB3C9) */
  skyDew: "#7BB3C9",

  // Freud Night Therapy Mode
  night: {
    /** Kanvas gelap mode malam (#1A120B) */
    bg: "#1A120B",
    /** Surface kartu mode malam (#261C14) */
    card: "#261C14",
    /** Teks utama mode malam (#FAF6EE) */
    text: "#FAF6EE",
    /** Teks sekunder mode malam (#A89A8D) */
    muted: "#A89A8D",
    /** Balon pesan pengguna mode malam (#D96F2E) */
    orange: "#D96F2E",
    /** Garis pembatas kartu malam (rgba(255, 255, 255, 0.08)) */
    border: "rgba(255, 255, 255, 0.08)",
  },
} as const;

export const colors = {
  ...FREUD,
  soc: SOC,
  decision: DECISION,
  team: TEAM,
} as const;
