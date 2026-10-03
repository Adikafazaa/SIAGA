---
name: siaga-proposal-and-academic-writing-guide
description: Panduan baku dan spesifikasi komprehensif penyusunan proposal kompetisi/hackathon dan dokumen akademik proyek SIAGA. Mengintegrasikan rules resmi proposal (format file PDF, batas ketat 8-10 halaman di luar cover, struktur 6 bab wajib) dengan spesifikasi teknis tata letak, margin, spasi, tipografi (bold/italic), penyajian media visual (gambar, tabel, persamaan), dan sitasi IEEE dari standar 'Draft JURNAL PII - Eng Version.docx'.
version: 1.1.0
sources:
  - "SIAGA/Knowledge/Docs/proposal/rules/853ee2ee-039b-4e5f-8b00-06bf1178062a.png"
  - "Draft JURNAL PII - Eng Version.docx"
---

# Panduan Baku Penyusunan Proposal & Penulisan Ilmiah SIAGA

Dokumen ini merupakan panduan keterampilan (*skill reference*) otoritatif yang mengintegrasikan dua pilar utama:
1. **Aturan Resmi Penyusunan Proposal (*Proposal Rules & Chapter Structure*)** berdasarkan dokumen regulasi lomba `853ee2ee-039b-4e5f-8b00-06bf1178062a.png`.
2. **Kaidah Teknis Tipografi & Tata Letak Ilmiah (*Academic Formatting & Typography*)** yang diekstraksi secara presisi dari acuan baku `Draft JURNAL PII - Eng Version.docx`.

Seluruh anggota tim dan agen kecerdasan buatan (AI) pada proyek SIAGA wajib mematuhi panduan ini secara ketat dalam menyusun dokumen proposal, naskah riset, maupun laporan teknis.

---

## BAGIAN I: ATURAN RESMI PROPOSAL HACKATHON (*PROPOSAL RULES*)

Berdasarkan regulasi resmi lomba pada berkas `853ee2ee-039b-4e5f-8b00-06bf1178062a.png`, ketentuan penyusunan naskah proposal adalah sebagai berikut:

### 1. Ketentuan Dokumen & Batasan Halaman (*Document Constraints*)
* **Format Berkas Akhir:** **Dokumen PDF (`.pdf`)**.
* **Batasan Jumlah Halaman (*Length*):** **Strictly 8 to 10 pages maximum (excluding the cover page)**.
  * Halaman naskah inti (Bab 1 sampai Bab 6) **wajib berada di antara 8 hingga 10 halaman** (maksimum 10 halaman isi).
  * Halaman sampul (*cover page*) dihitung terpisah dan **tidak termasuk** dalam batas 8–10 halaman tersebut.
  * Naskah di bawah 8 halaman dinilai kurang komprehensif, sedangkan naskah di atas 10 halaman (di luar cover) berisiko terkena penalti diskualifikasi atau pengurangan poin format.

---

### 2. Struktur Bab Wajib (*Required Chapter Structure*)

Naskah proposal **wajib memuat 6 bab terstruktur** tanpa merubah esensi maupun urutannya:

```
[COVER PAGE] (Halaman Sampul Khusus - Di Luar Hitungan 8-10 Halaman)
      |
      +---> Chapter 1: Introduction & Background
      +---> Chapter 2: Solution Overview & Market Differentiation
      +---> Chapter 3: Proof of Concept (PoC) Implementation
      +---> Chapter 4: Technical Architecture & Feasibility
      +---> Chapter 5: Security Architecture & Intellectual Property Potential
      +---> Chapter 6: Scalability & Deployment Readiness
```

#### Rincian Muatan Wajib Tiap Bab:

#### **Chapter 1: Introduction & Background**
* **Fokus Utama:** Konteks mendalam mengenai permasalahan riil dan relevansinya dengan tema/trek hackathon (*Detailed context of the problem and its relevance to the hackathon track*).
* **Substansi yang Wajib Ada:**
  * Latar belakang masalah (*urgency* dan *pain point*) terkait kebocoran data pribadi (PII), tantangan privasi pada dokumen multimodal/citra, serta keterbatasan solusi eksisting.
  * Relevansi eksplisit terhadap trek kompetisi (*hackathon track*).
  * Tujuan strategis dari pengembangan solusi SIAGA.
* **Alokasi Halaman yang Disarankan:** $1.0 - 1.5\text{ halaman}$.

#### **Chapter 2: Solution Overview & Market Differentiation**
* **Fokus Utama:** Gambaran arsitektur solusi secara mendalam dan analisis kompetitif yang menonjolkan nilai keunikan produk (*In-depth architecture overview and competitive analysis highlighting your USP - Unique Selling Proposition*).
* **Substansi yang Wajib Ada:**
  * Konsep inovasi SIAGA: *Pre-inference contextual sanitization* berbasis model *vision-language* (VLM/LLM).
  * Analisis perbandingan kompetitif (*competitive matrix/table*) terhadap solusi konvensional (OCR rule-based, cloud API masking, dsb.).
  * *Unique Selling Proposition* (USP): Mengapa SIAGA lebih unggul (privasi terjaga sebelum inferensi, latency rendah di perangkat edge, perlindungan multimodal).
* **Alokasi Halaman yang Disarankan:** $1.5\text{ halaman}$.

#### **Chapter 3: Proof of Concept (PoC) Implementation**
* **Fokus Utama:** Rincian fitur fungsional yang telah dibangun dan pembuktian implementasi disertai tautan repositori kode (*Detailed breakdown of developed features and reference to your code repository*).
* **Substansi yang Wajib Ada:**
  * Penjabaran modul fitur yang telah berhasil diimplementasikan (ekstraksi teks VLM, deteksi entitas PII otomatis, masking payload terdistribusi).
  * Antarmuka pengguna (*UI/UX Showcase*) dan alur kerja pengguna (*user journey*).
  * Tautan resmi (*link*) ke repositori kode proyek (*GitHub repository*), demo video, atau live environment.
* **Alokasi Halaman yang Disarankan:** $1.5 - 2.0\text{ halaman}$.

#### **Chapter 4: Technical Architecture & Feasibility**
* **Fokus Utama:** Desain sistem secara komprehensif, diagram alur data, dan justifikasi teknis rekayasa sistem (*Comprehensive system design, data flows, and technical justification*).
* **Substansi yang Wajib Ada:**
  * Diagram arsitektur sistem (*system architecture diagram*) secara modular (Frontend, API Gateway, Worker 1 Sanitizer, Worker 2 Main LLM).
  * Alur data ujung-ke-ujung (*end-to-end data flow sequence diagram*).
  * Justifikasi teknis pemilihan stack (alasan pemilihan model SLM/VLM, FastAPI, Electron/Web frontend, isolasi proses).
  * Evaluasi kelayakan (*feasibility study*) berbasis metrik empiris (latensi pemrosesan, konsumsi VRAM/RAM, akurasi CER dan Mask Recall).
* **Alokasi Halaman yang Disarankan:** $1.5 - 2.0\text{ halaman}$.

#### **Chapter 5: Security Architecture & Intellectual Property Potential**
* **Fokus Utama:** Pemodelan ancaman keamanan, langkah mitigasi perlindungan, dan analisis potensi kekayaan intelektual/paten (*Threat modeling, security measures, and IP/patentability analysis*).
* **Substansi yang Wajib Ada:**
  * *Threat Modeling* (misal: STRIDE framework) mencakup risiko serangan injeksi prompt, kebocoran data via side-channel, manipulasi payload.
  * Mekanisme pertahanan keamanan (*defense-in-depth*): enkripsi lokal, zero-data retention, sanitasi deterministik sebelum data keluar ke LLM pihak ketiga.
  * Potensi Kekayaan Intelektual (HAKI): Analisis kebaruan (*novelty*), potensi paten metode/algoritma mitigasi kebocoran data multimodal pada edge computing, dan hak cipta perangkat lunak.
* **Alokasi Halaman yang Disarankan:** $1.0 - 1.5\text{ halaman}$.

#### **Chapter 6: Scalability & Deployment Readiness**
* **Fokus Utama:** Kebutuhan infrastruktur, analisis performa skala besar, dan rencana langkah komersialisasi (*Infrastructure requirements, performance analysis, and commercial deployment steps*).
* **Substansi yang Wajib Ada:**
  * Kebutuhan perangkat keras (*minimum & recommended hardware specs*) untuk deployment di edge vs on-premise cloud.
  * Analisis skalabilitas dan beban performa (*throughput*, *concurrency*, *batching*).
  * Peta jalan (*roadmap*) komersialisasi dan go-to-market strategy (integrasi B2B ke sektor perbankan, kesehatan, instansi publik, dan regulasi kepatuhan UU PDP / GDPR).
* **Alokasi Halaman yang Disarankan:** $1.0 - 1.5\text{ halaman}$.

---

### 3. Matriks Alokasi Halaman Ideal (*Page Budget Matrix*)

Untuk menjamin kepatuhan mutlak terhadap aturan **Strictly 8 to 10 pages maximum (excluding cover page)**:

| Bagian Dokumen | Rentang Target Halaman | Konten Utama yang Ditampilkan |
| :--- | :---: | :--- |
| **Cover Page** | **1 Halaman (Di Luar Kuota)** | Judul proposal, logo tim/instansi, trek lomba, nama anggota tim, tanggal |
| **Chapter 1: Introduction & Background** | $1.0 - 1.5$ halaman | Urgensi PII, kesenjangan teknologi, relevansi trek hackathon |
| **Chapter 2: Solution Overview & Differentiation**| $1.5$ halaman | Arsitektur solusi, matriks perbandingan kompetitor, USP |
| **Chapter 3: Proof of Concept (PoC)** | $1.5 - 2.0$ halaman | Breakdown fitur, screenshot UI, alur kerja, tautan repositori kode |
| **Chapter 4: Technical Architecture & Feasibility**| $1.5 - 2.0$ halaman | Diagram sistem, alur data, benchmark VRAM/Latency, justifikasi |
| **Chapter 5: Security Architecture & IP** | $1.0 - 1.5$ halaman | Threat model (STRIDE), mekanisme mitigasi, potensi paten/HAKI |
| **Chapter 6: Scalability & Deployment Readiness** | $1.0 - 1.5$ halaman | Infrastruktur, throughput/skalabilitas, roadmap komersial |
| **TOTAL HALAMAN ISI (Bab 1–6)** | **Tepat 8 – 10 Halaman** | **MEMENUHI ATURAN SECARA MUTLAK (STRICT COMPLIANCE)** |

---

## BAGIAN II: SPESIFIKASI TEKNIS TATA LETAK & TIPOGRAFI (*ACADEMIC & LAYOUT SPECIFICATIONS*)

Seluruh isi bab pada proposal wajib diformat mengikuti standar jurnal ilmiah acuan `Draft JURNAL PII - Eng Version.docx`:

### 1. Format Fisik & Margin Halaman (*Page Setup*)

| Parameter | Dimensi Baku (cm) | Dimensi OpenXML (Twips) | Keterangan |
| :--- | :--- | :--- | :--- |
| **Ukuran Kertas (*Paper Size*)** | **A4** (21.00 cm × 29.70 cm) | Lebar: `11,907`, Tinggi: `16,840` | Standar ISO 216 |
| **Orientasi (*Orientation*)** | **Portrait** (Tegak) | — | Seluruh halaman proposal |
| **Margin Atas (*Top*)** | **2.50 cm** | **1,418 twips** | Presisi |
| **Margin Bawah (*Bottom*)** | **2.50 cm** | **1,418 twips** | Presisi |
| **Margin Kiri (*Left*)** | **3.00 cm** | **1,701 twips** | Standar arsip & jilid |
| **Margin Kanan (*Right*)** | **2.50 cm** | **1,418 twips** | Presisi |
| **Header dari Tepi Atas** | **2.00 cm** | **1,134 twips** | Running header proposal |
| **Footer dari Tepi Bawah** | **2.00 cm** | **1,134 twips** | Nomor halaman proposal |
| **Lebar Bidang Cetak Efektif** | $\mathbf{15.50\text{ cm}}$ | **8,788 twips** | Batas maksimal gambar/tabel |

---

### 2. Tipografi & Gaya Spasi Paragraf (*Typography & Spacing*)

* **Jenis Huruf Utama (*Primary Font*):** **Times New Roman** untuk seluruh teks naskah.
* **Paragraf Isi (*Body Text*):**
  * Ukuran Font: **10.0 pt** (`sz val="20"`).
  * Jarak Baris (*Line Spacing*): **Single (1.0x)** (`line="240"` twips) atau *compact* (`line="259"` twips).
  * Spasi Paragraf: Spasi Sebelum (*Before*) = **0 pt**, Spasi Sesudah (*After*) = **0 pt**.
  * Indentasi Baris Pertama (*First-line Indent*): **1.27 cm** (`720 twips` / 0.5 in).
  * Perataan (*Alignment*): **Justified (Rata Kiri-Kanan)** (`jc val="both"`).

---

### 3. Hierarki Judul Bab & Sub-Bab (*Headings Hierarchy*)

Struktur penomoran bab dalam proposal menyesuaikan dengan 6 bab wajib:

```
[Bab / Heading 1]     ---------> Chapter X: Judul Bab (ALL CAPS, BOLD, 10 PT, LEFT-ALIGNED)
   [Paragraf Isi]     ---------> FIRST-LINE INDENT 1.27 CM, JUSTIFIED, 10 PT
   [Sub-Bab / Level 2]---------> X.Y.  Judul Sub-Bab (TITLE CASE, BOLD, 10 PT, FLUSH LEFT)
      [Paragraf Isi]  ---------> FIRST-LINE INDENT 1.27 CM, JUSTIFIED, 10 PT
```

#### Ketentuan Teknis:
1. **Bab Utama (*Heading Level 1*):**
   * Penulisan: `Chapter 1: Introduction & Background` (atau `CHAPTER 1: INTRODUCTION & BACKGROUND`).
   * Tipografi: **ALL CAPS**, **Bold**, 10.0 pt, Times New Roman.
   * Perataan: Rata Kiri (*Left*).
   * Indentasi: Margin Kiri `0.75 cm` (`426 twips`), Indentasi Gantung (*Hanging Indent*) `0.75 cm` (`426 twips`).
2. **Sub-Bab (*Heading Level 2*):**
   * Penulisan: `1.1.  Problem Background`, `2.1.  System Concept`, `3.1.  VLM Extraction Feature`.
   * Tipografi: **Kapitalisasi Judul (*Title Case*)**, **Bold**, 10.0 pt, Times New Roman.
   * Indentasi: **Flush Left / Rata Kiri Penuh ($0\text{ cm}$)**.
3. **Sub-Sub-Bab (*Heading Level 3* - Opsional):**
   * Penulisan: `1.1.1.  Multimodal Privacy Leakage Vectors`.
   * Tipografi: Title Case, Regular/Italic atau Bold 10.0 pt, Flush Left ($0\text{ cm}$).

---

### 4. Kaidah Huruf Tebal (*Bold*) & Miring (*Italic*)

* **Penggunaan Bold (Cetak Tebal):**
  * Judul Proposal pada Cover (16.0 pt) dan Nama Anggota Tim (11.0 pt).
  * Seluruh Judul Bab (`Chapter X: ...`) dan Sub-Bab (`X.Y.  ...`).
  * Baris Header Kolom Tabel (8.0 pt).
  * Metrik dan terminologi kunci yang ditekankan (**Unique Selling Proposition**, **STRIDE Threat Model**, **Mask Recall**).
* **Penggunaan Italic (Cetak Miring):**
  * Istilah teknologi berbahasa asing yang belum baku diserap ke Bahasa Indonesia (*pre-inference sanitization*, *edge computing*, *error propagation*).
  * Simbol rumus matematika (*$N_{correct}$*, *$N_{total}$*, *$Recall$*, *$CER$*).
  * Label sub-gambar/sub-grafik (*(a)*, *(b)*).
  * Judul publikasi jurnal/buku pada daftar pustaka.

---

### 5. Tata Cara Penyajian Media Visual & Matematis

#### A. Gambar, Diagram, Mockup, & Grafik (*Figures*)
1. **Posisi Gambar:** Wajib **Rata Tengah (*Center-aligned*)**, tajam, tidak pecah (minimal 300 DPI), lebar maksimal **15.50 cm**.
2. **Posisi Keterangan (*Caption*):** **WAJIB DI BAWAH GAMBAR (*BELOW THE FIGURE*)**.
3. **Format Judul Caption:**
   * Pola: `Figure X. Deskripsi Informatif Gambar.` (9.0–10.0 pt, Times New Roman, Regular).
   * Perataan: Rata Tengah jika 1 baris; Rata Kiri/Justified jika multi-baris.
4. **Gambar Majemuk / Multi-part:** Berikan penanda sub-grafik `(a)` dan `(b)` tepat di bawah masing-masing gambar, misal:
   `Figure 7. Text Extraction Accuracy Comparison of VLMs for (a) Macro Accuracy and (b) Macro CER`
5. **Kewajiban Sitasi Narasi (*Callout*):** Setiap diagram arsitektur, flowchart, maupun mockup UI **wajib dipanggil secara eksplisit dalam paragraf sebelum/di samping gambar** (misal: *"The proposed technical architecture of SIAGA is illustrated in Figure 4..."*).

#### B. Tabel Komparasi & Metrik (*Tables*)
1. **Posisi Keterangan (*Caption*):** **WAJIB DI ATAS TABEL (*ABOVE THE TABLE*)**.
2. **Format Judul Caption:** `Table X. Judul Deskriptif Tabel.` (10.0 pt, Times New Roman, Regular, Rata Tengah).
3. **Format Garis (*Three-Line Formal Open Table*):**
   * **Garis Horizontal Atas (*Top Border*):** Solid line 1.0 pt (`sz="4"` - `sz="8"`).
   * **Garis Bawah Header (*Header Bottom Border*):** Solid line 0.5 pt (`sz="4"`).
   * **Garis Horizontal Bawah (*Bottom Border*):** Solid line 1.0 pt (`sz="4"` - `sz="8"`).
   * **Garis Vertikal (*Vertical Gridlines*):** **DILARANG / TIDAK BOLEH ADA GARIS TEGAK SAMA SEKALI**.
4. **Ukuran Huruf Isi Tabel:** **8.0 pt**, Times New Roman, ringkas dan padat.
5. **Sitasi Narasi:** Wajib dipanggil dalam teks narasi (misal: *"As summarized in Table 2, our solution provides..."*).

#### C. Persamaan Matematika (*Equations*)
1. Ditulis menggunakan fitur Equation Word (`m:oMath`) atau sintaks formal.
2. Rumus diposisikan di **Tengah (*Centered*)**, dengan nomor persamaan di sisi **Kanan Penuh (*Flush Right*)** bertanda kurung: `(1)`, `(2)`.
3. Penjelasan notasi variabel dicantumkan tepat di bawah rumus diawali kata *"where"* (atau *"di mana"*):
   $$\text{Mask Recall} = \frac{TP}{TP + FN} \qquad (1)$$

#### D. Sitasi & Referensi (*IEEE Style*)
1. Format sitasi teks: Kurung siku numerik `[1]`, `[2]`, `[1]–[3]`.
2. Bagian daftar pustaka: Ditempatkan di bagian akhir dokumen dengan format gantung (*Hanging Indent 1.13 cm* / `640 twips`).

---

## 3. Lembar Contekan Konfigurasi Cepat (*Quick Reference Sheet*)

```yaml
proposal_rules:
  output_format: "PDF (.pdf)"
  page_budget:
    total_content_pages: "Strictly 8 to 10 pages maximum"
    cover_page: "1 page (Excluded from the 8-10 count)"
    enforcement: "Strict compliance - under 8 is incomplete, over 10 risks penalty"
  required_chapters:
    - chapter: 1
      title: "Introduction & Background"
      target_pages: "1.0 - 1.5"
      focus: "Detailed context of the problem and hackathon track relevance"
    - chapter: 2
      title: "Solution Overview & Market Differentiation"
      target_pages: "1.5"
      focus: "In-depth architecture overview, competitive analysis, and USP"
    - chapter: 3
      title: "Proof of Concept (PoC) Implementation"
      target_pages: "1.5 - 2.0"
      focus: "Feature breakdown and code repository reference"
    - chapter: 4
      title: "Technical Architecture & Feasibility"
      target_pages: "1.5 - 2.0"
      focus: "System design, data flows, and technical justification"
    - chapter: 5
      title: "Security Architecture & Intellectual Property Potential"
      target_pages: "1.0 - 1.5"
      focus: "Threat modeling, security measures, and IP/patentability analysis"
    - chapter: 6
      title: "Scalability & Deployment Readiness"
      target_pages: "1.0 - 1.5"
      focus: "Infrastructure requirements, performance analysis, and commercialization"

document_formatting:
  paper_size: "A4 (21.00 cm x 29.70 cm)"
  orientation: "Portrait"
  printable_width_cm: 15.50
  margins_cm:
    top: 2.50
    bottom: 2.50
    left: 3.00
    right: 2.50
    header: 2.00
    footer: 2.00
  typography:
    primary_font: "Times New Roman"
    math_font: "Cambria Math"
    body:
      size_pt: 10.0
      line_spacing: 1.0
      first_line_indent_cm: 1.27
      alignment: "Justified"
    heading_1:
      size_pt: 10.0
      case: "ALL CAPS"
      weight: "Bold"
      left_indent_cm: 0.75
      hanging_indent_cm: 0.75
    heading_2:
      size_pt: 10.0
      case: "Title Case"
      weight: "Bold"
      left_indent_cm: 0.00
    figure_caption:
      position: "BELOW the figure"
      format: "Figure X. Description"
      size_pt: 9.0 - 10.0
    table_caption:
      position: "ABOVE the table"
      format: "Table X. Description"
      size_pt: 10.0
    table_style:
      type: "Three-line formal open table"
      vertical_lines: "NONE"
      cell_font_size_pt: 8.0
    references_style: "IEEE [X] with 1.13 cm hanging indent"
```

---
*Dokumen ini merupakan standar baku resmi proyek SIAGA. Seluruh draf proposal wajib memenuhi batasan jumlah halaman (8–10 halaman di luar cover), 6 bab wajib, dan kaidah tipografi di atas.*
