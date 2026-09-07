# 🎨 UI/UX Design System: Anti-"AI Slop" & Dual Interface Paradigm

> **Knowledge Base Bab 4** · Platform: PsychoBot Clinical Care & SIAGA Guardrail Platform  
> **Komponen:** `frontend/src/theme/colors.ts`, `globals.css`, `components/ui/`, `Modules/DESIGN.md`  
> **Klasifikasi:** Dokumen Spesifikasi Desain Antarmuka, Filosofi Visual & Aksesibilitas

---

## 📌 1. Filosofi Inti: Menolak "AI Slop"

Dalam pengembangan produk AI kontemporer, sering dijumpai tampilan generik yang disebut sebagai **"AI Slop"**:
- Kartu SaaS membulat berlebihan (`rounded-2xl` / `rounded-3xl`)
- Drop shadow tebal berwarna ungu/biru neon
- Gradien warna dekoratif tanpa fungsi semantik
- Grafik dengan animasi masuk dramatis yang mengaburkan pembacaan data riil

Sistem desain SIAGA secara sadar dan tegas **menolak semua elemen tersebut**:

> *"Dasbor SIAGA adalah konsol instrumen keamanan (SOC Console) — bukan produk SaaS komersial, bukan landing page pemasaran. Dasbor adalah alat bukti visual."*

---

## 🌓 2. Paradigma Antarmuka Ganda (Dual Interface)

Platform menyajikan dua atmosfer visual yang berbeda secara fungsional dan naratif:

```
┌─────────────────────────────────────────┬─────────────────────────────────────────┐
│     1. PATIENT CARE CONSOLE             │      2. SOC & DPJP CLINICAL HUD         │
│     (Antarmuka Pasien - AppShell)       │      (Antarmuka Keamanan - ConsoleShell)│
├─────────────────────────────────────────┼─────────────────────────────────────────┤
│ • Nuansa: Terang, Tenang, Humanis       │ • Nuansa: Gelap, Tajam, Forensik        │
│ • Latar: Care Light (#F8FAFC, Putih)    │ • Latar: Deep SOC Dark (#0B1220)        │
│ • Aksen: Care Blue (#2563EB)            │ • Tekstur: Radial Dot Grid 22px         │
│ • Sudut: Membulat Lembut (rounded-lg)   │ • Sudut: Tajam Murni (border-radius: 0) │
│ • Target: Pasien mencari kenyamanan     │ • Target: Operator SOC & Dokter audit   │
│   skrining PHQ-9/GAD-7 & konseling      │   memeriksa telemetri kurva risiko      │
└─────────────────────────────────────────┴─────────────────────────────────────────┘
```

---

## 🎨 3. Sistem Token Warna Semantik ([`colors.ts`](file:///D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA-v2/frontend/src/theme/colors.ts))

Seluruh komponen UI dan visualisasi grafik Recharts wajib mengimpor warna dari sumber tunggal `frontend/src/theme/colors.ts`. **Dilarang keras menuliskan kode hex manual di luar file ini.**

### A. Palet Keputusan Risiko (Decision Palette)
| Token | Hex | Ikon Derajat | Makna & Perilaku Sistem |
|---|---|---|---|
| **`allow`** | `#16A34A` | `○` | Sesi aman, momentum rendah ($M_t < 0.45$). Lolos ke LLM. |
| **`watch`** | `#CA8A04` | `◔ ◑` | Status waspada, tren kenaikan arah risiko ($0.45 \le M_t < 0.60$). |
| **`probe`** | `#7C3AED` | `⚡` | Tindakan respons aktif. **Sengaja dipilih keluarga ungu** (bukan oranye), karena ini adalah interogasi aktif, bukan tingkatan keparahan bahaya. |
| **`block`** | `#DC2626` | `● 🛑` | Pelanggaran fatal ($M_t \ge 0.80$). Sesi diputus permanen. |

### B. Palet Permukaan Konsol SOC
| Token | Hex | Pemakaian |
|---|---|---|
| **`SOC.bg`** | `#0B1220` | Latar belakang halaman utama dan grid titik. |
| **`SOC.panel`** | `#111A2C` | Permukaan kartu, panel instrumen, dan dropdown. |
| **`SOC.border`** | `#1F2A44` | Garis tepi 1px di seluruh elemen dan garis grid grafik. |
| **`SOC.text`** | `#E5E7EB` | Warna teks utama dan garis momentum grafik stateful. |
| **`SOC.muted`** | `#94A3B8` | Label sekunder, caption, dan sumbu koordinat. |

### C. Penanda Tim (Red-AI vs Blue-AI)
- **`TEAM.redai` (`#EA580C`):** Segala atribut milik penyerang / skenario simulasi serangan red-team.
- **`TEAM.blueai` (`#38BDF8`):** Atribut milik pertahanan guardrail SIAGA.
- **`TEAM.nonnovel` (`#6B7280`):** Penanda baseline stateless non-novel (garis perbandingan).
- **`TEAM.hudLine` (`#44548A`):** Warna kurung aksen sudut panel 4 pojok.

---

## 🔤 4. Tipografi & Prinsip Monospace Tabular

Sistem hanya menggunakan dua keluarga font:
1. **Montserrat (`next/font/google`):** Digunakan untuk teks judul, navigasi, dan antarmuka umum.
2. **JetBrains Mono (`--font-jetbrains`):** Wajib digunakan untuk semua angka, skor probabilitas, hash token SHA-256, dan label teknis dengan utilitas `.tabular`:

```css
.tabular {
  font-family: var(--font-jetbrains), ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}
```
*Dengan angka tabular, kolom data pada tabel perbandingan antar-turn sejajar lurus secara presisi dan mudah diaudit.*

---

## 📐 5. Bahasa Visual HUD (Heads-Up Display)

Tanda tangan visual konsol SOC yang membedakannya dari dasbor biasa:
1. **Kurung Sudut HUD (`.hud-corners`):** Pseudo-element CSS yang menggambar bracket 10px di tiap 4 pojok panel (warna `#44548A`).
2. **Bracket Label:** Judul panel selalu menggunakan format mono uppercase dengan kurung: `[ 01 LIVE GUARD ]`, `[ SIGNAL BREAKDOWN ]`.
3. **Kursor Terminal Aktif:** Logo konsol berkedip dengan tanda strip ungu `SIAGA_` (`.blink-cursor`).
4. **Meteran ASCII:** Rincian sinyal dilengkapi meter bar mono: `▓▓▓▓▓▓░░░░ 0.62` yang dapat dibaca tanpa ketergantungan warna.

---

## 📈 6. Aturan Pergerakan & Grafik Tanpa Manipulasi

> *"Hasil pengukuran keamanan jangan pernah dipalsukan atau dianimasikan."*

- **Recharts Disetel Non-Aktif:** Komponen [`MomentumChart.tsx`](file:///D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA-v2/frontend/src/components/charts/MomentumChart.tsx) disetel secara eksplisit:
  ```tsx
  <Line ... isAnimationActive={false} />
  ```
  Data yang disajikan langsung mencerminkan kondisi riil di database tanpa efek *easing* yang memperlambat penilaian forensik.
- **Dual-Curve Visualization:** Menampilkan 2 garis sekaligus:
  - Garis Solid Putih (`SOC.text`): Momentum Stateful SIAGA (CIM).
  - Garis Putus-putus Abu (`TEAM.nonnovel`): Baseline filter stateless konvensional per-pesan.

---

## ♿ 7. Aksesibilitas Standar WCAG AA

Setiap elemen visual memenuhi kepatuhan inklusif:
1. **Dual-Coding:** Warna tidak pernah berdiri sendiri. Indikator keputusan selalu menyertakan label teks dan glyph derajat:
   - `ALLOW` disertai lingkaran kosong `○`
   - `WATCH` disertai lingkaran terisi sebagian `◔ ◑`
   - `PROBE` disertai kilat `⚡`
   - `BLOCK` disertai lingkaran penuh `●` atau `🛑`
2. **Kontras Teks Minimum 4.5:1:** Seluruh kombinasi hex telah diverifikasi kontrasnya terhadap latar gelap `#0B1220`.
3. **Audit Statis Skill UI:** Konsistensi sistem desain diaudit secara berkala menggunakan perangkat `skillui` (`npx skillui --dir frontend`) untuk mencegah kebocoran kelas CSS liar.
