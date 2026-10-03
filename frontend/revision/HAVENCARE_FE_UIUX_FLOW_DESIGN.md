# HavenCare Front-End UI/UX Flow Design & Governance

> Status: Normatif — sumber aturan implementasi UI/UX front-end HavenCare  
> Versi: 2.1 — remediation implementasi untuk route, redirect, package, metadata, font, legacy identity, legal page, dan migrasi tema  
> Tanggal: 3 Oktober 2026  
> Cakupan: pengalaman publik, autentikasi, pasien, dokter, komunitas, dan batas visual konsol SOC  
> Sumber revisi: dokumen revisi master awal dan audit kode aktual pada folder frontend

---

## 0. Cara Menggunakan Dokumen Ini

Dokumen ini bukan sekadar konsep visual. Dokumen ini adalah kontrak desain dan alur yang wajib menjadi acuan saat membuat, mengubah, meninjau, atau menguji antarmuka HavenCare.

Kata kunci normatif:

- WAJIB: harus dipenuhi sebelum fitur dinyatakan selesai.
- DILARANG: tidak boleh muncul dalam implementasi.
- SEBAIKNYA: dilakukan kecuali ada alasan teknis atau klinis yang terdokumentasi.
- BOLEH: opsional dan tidak menjadi syarat rilis.

Jika mockup, komentar lama di kode, nama komponen lama, atau aturan visual lama bertentangan dengan dokumen ini, dokumen ini menjadi rujukan desain terbaru untuk ranah publik dan pasien. Aturan keamanan, role guard, privasi, dan konsol SOC tetap berlaku selama tidak bertentangan dengan revisi ini.

### 0.1 Urutan sumber kebenaran

1. Keselamatan pengguna dan batas klinis.
2. Dokumen flow design ini.
3. Kontrak data/API dan aturan akses berdasarkan peran.
4. Design token pada src/theme/colors.ts dan konfigurasi Tailwind.
5. Komponen bersama.
6. Implementasi halaman.
7. Mockup, komentar lama, dan nama komponen warisan.

### 0.2 Keputusan konflik desain

Audit menemukan aturan lama masih mewajibkan identitas Freud Web UI, palet espresso, dan komponen bernama Freud. Revisi terbaru mengubah arah tersebut secara besar-besaran. Keputusan final:

- Identitas produk adalah HavenCare.
- Nama project, product title, metadata, wordmark, document title, dan identitas yang terlihat pengguna adalah HavenCare pada seluruh halaman.
- Nama asisten AI untuk pasien adalah HavenCare AI.
- Sistem visual utama seluruh website adalah HavenCare Glass SaaS: glass biru-turquoise, Calm Turquoise, Sage, Sunrise, Clean Canvas, dan Deep Turquoise untuk shell gelap.
- Palet dan istilah Freud dinyatakan deprecated untuk UI yang terlihat pengguna.
- Konsol SOC tetap memakai sistem visual gelap dan tajam yang sudah ada.
- Nama internal lama boleh dipertahankan sementara selama migrasi, tetapi tidak boleh muncul sebagai copy, label, aria-label, judul, atau identitas visual yang terlihat pengguna.

---

## 1. Hasil Audit Front-End Saat Ini

### 1.1 Ringkasan kondisi

Front-end menggunakan Next.js App Router, TypeScript, Tailwind CSS, role guard, repository autentikasi, React Query, serta API yang dapat beralih ke mock backend. Fondasi fungsional sudah ada, tetapi pengalaman pasien masih dibangun di atas identitas Freud, palet espresso, tampilan dekoratif berlebih, dan beberapa data simulasi yang terlihat seperti fakta klinis.

### 1.2 Temuan per area

| Area | Kondisi saat audit | Gap terhadap target | Keputusan |
|---|---|---|---|
| Theme | Token pasien masih bernama FREUD dan didominasi espresso, cream, orange | Tidak sesuai arah HavenCare Glass dan identitas HavenCare AI | Migrasikan ke token HavenCare Glass; pertahankan makna status SOC dalam dark-glass variant |
| Landing | Hero berisi Freud.AI, skor 98.92%, contoh percakapan krisis, tombol toko aplikasi palsu, link salah tujuan, kartu/audio dekoratif, dan floating action dock | Terasa seperti template; sebagian aksi tidak berfungsi atau tidak jelas, serta berisiko menampilkan klaim klinis fiktif | Pertahankan kekuatan komposisi web, tetapi bangun ulang menjadi landing interaktif berpusat pada Emotion Entry dan jalur nyata menuju Chat HavenCare AI |
| Navigasi publik | Menu desktop tidak mencerminkan kebutuhan pasien; admin telemetry tampil sebagai Resources; ada dock mengambang | Hierarki rute tidak jelas dan membuka rute sensitif dari navigasi publik | Ganti dengan header utama dan menu terstruktur |
| Autentikasi | Showcase memuat telemetry badge, metrik 15.000+, Our Benefits, profil Rian, dan simulasi Freud | Klaim tidak tervalidasi; layout belum clean, interaktif, atau selaras dengan revisi split-screen | Ganti dengan AuthWebShell glass: form HavenCare di kiri dan visual HavenCare AI yang aman serta menarik di kanan |
| Redirect pasien | ROLE_HOME.patient mengarah ke /chat | Pasien tidak mempunyai orientasi setelah masuk | Buat /dashboard dan jadikan rumah pasien |
| Dashboard pasien | Rute belum ada | Hub utama, mood check-in, jadwal, dan quick actions hilang | Wajib dibangun |
| Chat | Data sesi dan pesan sudah fungsional; nama Doctor Freud masih dominan; composer belum memiliki welcome personal, Quick Emoji, Wellbeing Overview, dan voice input lengkap | Sesi baru belum personal, pengguna cemas/lansia masih harus mengetik, serta konteks check-in belum mudah diakses | Bangun Chat HavenCare AI Web dengan welcome dialog bernama, Quick Emoji auto-send, Wellbeing Overview pada composer, voice/TTS, dan Crisis Override |
| Assessment | UI memakai satu skala 1–10 dan tiga pertanyaan Yes/No, lalu disimpan sebagai PHQ-9 | Tidak valid sebagai PHQ-9, terasa seperti ujian, dan belum mengikuti referensi interaksi | Ganti menjadi wellness assessment interaktif tepat 3 halaman: Mood Wheel, Sleep Quality Slider, dan Expression Analysis; jangan labeli sebagai PHQ-9/GAD-7 |
| Community | Feed, posting anonim, reaksi, dan feedback masih state lokal; belum ada komentar, komunitas yang dapat diikuti, pencarian, atau moderation flow | Belum menyerupai social community yang fungsional dan belum mengakomodasi Gen Z serta lansia | Bangun ulang /community dengan feed ala X/Tweet, panel Komunitasku, rekomendasi, composer, thread, reaction, join, search, report, dan guardrail |
| Crisis support | Ada deteksi mock dan kartu SOS di panel klinis, tetapi alurnya tidak konsisten di semua viewport | Risiko bantuan krisis tidak terlihat atau terputus | Terapkan Crisis Override global |
| Dokter dan admin | Rute dokter dan SOC sudah memiliki pola khusus | Tidak perlu diseragamkan dengan halaman pasien | Pertahankan perbedaan peran; harmonisasi brand saja |

### 1.3 Hal yang sudah baik dan dipertahankan

- Pemisahan peran patient, doctor, dan admin.
- Guard berbasis role pada rute privat.
- Session, message, assessment, patient, license, dan telemetry API layer.
- Empty, loading, error, dan skeleton primitives yang sudah tersedia.
- Konstanta PHQ-9/GAD-7 tetap dapat dipertahankan untuk modul skrining klinis terpisah, tetapi tidak dipakai atau diklaim oleh wellness assessment 3 halaman.
- Konsol SOC yang membedakan ALLOW, WATCH, PROBE, dan BLOCK tanpa mengandalkan warna saja.
- Zero-plaintext sebagai prinsip privasi arsitektur, selama copy yang ditampilkan benar-benar sesuai implementasi backend.

### 1.4 Verifikasi route aktual terhadap target

Audit `src/app` pada 3 Oktober 2026 menghasilkan matriks berikut:

| Route target | Status pada kode saat audit | Keputusan normatif |
|---|---|---|
| / | Ada | Revisi menjadi LandingWebShell HavenCare sesuai Bab 5 |
| /login | Ada | Migrasi ke AuthWebShell glass dan identitas HavenCare |
| /register | Ada | Migrasi ke AuthWebShell glass dan flow consent terstruktur |
| /onboarding | Ada | Pertahankan route; selaraskan token, typography, dan redirect |
| /dashboard | **Belum ada** | WAJIB dibuat sebelum `ROLE_HOME.patient` dipindahkan ke /dashboard |
| /chat | Ada | Revisi menjadi Chat HavenCare AI sesuai Bab 8 |
| /assessments | Ada | Revisi menjadi wellness assessment tepat 3 halaman |
| /community | Ada | Revisi menjadi Community Web fungsional sesuai Bab 11 |
| /profile | Ada | Lengkapi aksesibilitas, privasi, audio, dan emergency preference |
| /doctor/dashboard | Ada | Pertahankan role guard; harmonisasi brand dan glass clinical shell |
| /doctor/patients/[id] | Ada | Pertahankan kebutuhan klinis dan state data |
| /doctor/license | Ada | Pertahankan verifikasi serta state error/loading |
| /admin/telemetry | Ada | Pertahankan role admin dan SOC dark-glass variant |
| /privacy, /terms, /help | Belum terdeteksi | Jangan membuat dead link; gunakan section/modal tervalidasi sampai route nyata tersedia |

Verifikasi identity/runtime aktual:

| Area kode | Temuan saat audit | Migrasi wajib |
|---|---|---|
| package.json | package name masih `siaga-frontend` | Ubah menjadi `havencare-frontend` dan sinkronkan lockfile/tooling bila diperlukan |
| src/app/layout.tsx | title/description masih SIAGA dan bernuansa teknis; Montserrat dimuat global | Ubah metadata ke HavenCare/HavenCare AI, gunakan copy humanis, dan hapus Montserrat dari root public/patient |
| Landing/Auth/Onboarding | Masih memuat SIAGA/Freud, metrik/copy legacy, dan komponen bunga legacy | Migrasikan visible copy, asset, component, alt, aria, serta state ke HavenCare Glass |
| Chat/Assessment/Community/Profile | Masih memuat Doctor Freud/Freud Score/claim legacy | Ganti dengan HavenCare AI dan domain model yang tidak membuat skor/diagnosis palsu |
| Navigation/ScreenStates/Console | Masih memuat label SIAGA/Freud | Migrasikan title, loader, empty/error, rail, dan SOC shell ke HavenCare |
| Mock/API comments dan protocol string | Namespace `SIAGA_` masih ada pada mock guardrail | Putuskan migrasi kontrak ke `HAVENCARE_`; jika backend belum berubah, mapping internal boleh sementara tetapi UI tidak menampilkan namespace legacy |

Audit string memperlihatkan identity legacy tersebar di banyak file; karena itu brand migration harus memakai inventory/import graph dan test, bukan sekadar mengganti heading page.

Aturan dependency route:

1. Jangan mengubah `ROLE_HOME.patient` ke /dashboard sebelum page, loading, error boundary, dan role test untuk /dashboard tersedia.
2. Setelah /dashboard tersedia, migrasi redirect dan navigation item dilakukan dalam perubahan yang sama agar tidak terjadi 404 sementara.
3. CTA ke route privat melewati auth guard dan `next` allowlist; URL eksternal atau open redirect dilarang.
4. Route yang belum tersedia disembunyikan atau memakai non-link disclosure; dilarang membuat anchor/tombol aktif menuju 404.
5. Seluruh route privat wajib menguji unauthenticated, wrong-role, expired-session, loading, offline, dan forbidden state.

---

## 2. Prinsip Produk dan Batas Non-Negosiasi

### 2.1 Janji pengalaman

HavenCare harus terasa seperti ruang pendampingan yang tenang, aman, jelas, dan manusiawi. Pengguna tidak perlu memahami L0–L3, ONNX, CIM, SHA-256, atau latensi sistem untuk dapat menggunakan layanan.

Urutan pengalaman yang harus dirasakan:

1. Saya tahu saya berada di tempat yang tepat.
2. Saya tahu apa yang dapat dan tidak dapat dilakukan HavenCare AI.
3. Saya dapat memulai tanpa merasa diinterogasi.
4. Saya dapat melihat pilihan bantuan manusia.
5. Saya dapat keluar, membatalkan, atau meminta bantuan darurat kapan saja.

### 2.2 Identitas

| Elemen | Aturan final |
|---|---|
| Project, produk, dan platform | HavenCare |
| Wordmark seluruh UI publik/pasien | HavenCare; mengganti semua identitas SmartSave/SmartMave/Freud/legacy tanpa menyalin merek referensi |
| Asisten AI pasien | HavenCare AI |
| Fungsi HavenCare AI | Teman refleksi dan psychological first aid, bukan dokter |
| Sistem keamanan | Guardrail HavenCare; detail teknis hanya pada area edukasi privasi dan SOC |
| Dokter | Manusia berlisensi; tidak boleh disamakan dengan HavenCare AI |
| Istilah deprecated | Freud.ai, Doctor Freud, Freud Score, Freud Web UI |

Aturan penamaan:

- Product wordmark selalu `HavenCare`; sender/avatar AI selalu `HavenCare AI`.
- Jangan menyingkat AI menjadi `HavenCare` pada bubble karena pengguna harus dapat membedakan produk, AI, dan tenaga profesional.
- Root title: `HavenCare — Ruang refleksi dan dukungan kesehatan mental`.
- Template page title: `%s | HavenCare`; contoh `Chat HavenCare AI | HavenCare`.
- Notification title memakai `HavenCare`; isi notifikasi tidak memuat pesan sensitif secara default.
- Metadata description tidak menyebut ONNX, L0–L3, latency, atau klaim klinis; gunakan manfaat awam dan batas AI.
- File asset, component baru, analytics event namespace, dan CSS token memakai `havencare`/`HavenCare`; nama legacy hanya boleh hidup sementara pada adapter yang tidak terlihat pengguna dan memiliki rencana penghapusan.

### 2.3 Batas klinis dan regulasi

HavenCare AI DILARANG:

- mendiagnosis pengguna;
- mengaku sebagai dokter atau psikiater;
- membuat, merekomendasikan, menjual, menebus, atau menghitung transaksi obat;
- menyatakan hasil assessment sebagai diagnosis;
- menggantikan bantuan gawat darurat;
- menjanjikan kesembuhan, kerahasiaan absolut, atau akurasi yang tidak dapat dibuktikan.

HavenCare BOLEH:

- membantu pengguna mengidentifikasi dan merefleksikan emosi;
- memberi latihan grounding atau pernapasan yang aman;
- menjalankan skrining mandiri berbasis instrumen baku;
- membantu pengguna menyiapkan topik untuk konsultasi;
- mengarahkan ke dokter berlisensi dan layanan darurat resmi.

### 2.4 Integritas konten

- DILARANG menampilkan angka dampak, skor kesehatan, jumlah pengguna, rating, testimoni, lisensi, atau status terverifikasi yang tidak bersumber dari data nyata.
- Konten demo wajib diberi label Data simulasi atau Akun demo.
- Profil dr. Savira Wardhani, Sp.KJ dan nomor SIP dari dokumen revisi boleh menjadi fixture demo, tetapi tidak boleh ditampilkan sebagai dokter nyata/terverifikasi di produksi sebelum proses verifikasi legal selesai.
- Testimoni hanya boleh muncul jika ada persetujuan, provenance, dan proses editorial yang terdokumentasi. Jika belum ada, gunakan edukasi atau contoh alur yang jelas berlabel ilustrasi.
- DILARANG menempatkan kalimat krisis atau self-harm sebagai dekorasi hero/marketing.

---

## 3. Arsitektur Informasi Target

### 3.1 Peta rute

| Rute | Audiens | Tujuan | Aksi utama |
|---|---|---|---|
| / | Publik | Memahami manfaat, batas, privasi, memilih emotion entry, dan menuju Chat HavenCare AI | Mulai chat / Masuk |
| /login | Publik | Masuk secara aman | Masuk |
| /register | Publik | Membuat akun | Buat akun |
| /onboarding | Semua role baru | Mengatur role dan data awal | Selesaikan profil |
| /dashboard | Pasien | Orientasi dan pusat aktivitas pasien | Check-in / Bicara dengan HavenCare AI |
| /chat | Pasien | Sesi refleksi personal dengan HavenCare AI | Ketik, suara, Quick Emoji, dan buka Ringkasan Kesejahteraan |
| /assessments | Pasien | Wellness Assessment interaktif 3 halaman | Mulai atau lanjutkan assessment |
| /community | Pasien | Social micro-support untuk Gen Z dan lansia | Cari komunitas, bergabung, posting, bereaksi, dan berdiskusi |
| /profile | Pengguna login | Profil, preferensi, privasi, aksesibilitas | Simpan pengaturan |
| /doctor/dashboard | Dokter | Ringkasan pasien dan aktivitas klinis | Buka pasien |
| /doctor/patients/[id] | Dokter | Tinjauan pasien dan catatan | Perbarui catatan |
| /doctor/license | Dokter | Verifikasi SIP | Verifikasi |
| /admin/telemetry | Admin | Monitoring guardrail/SOC | Tinjau sinyal |

### 3.2 Navigasi global

Navigasi publik desktop:

- Beranda
- Cara Kerja
- Keamanan
- Aksesibilitas
- Masuk
- CTA utama: Mulai chat

Navigasi pasien:

- Beranda
- Bicara dengan HavenCare AI
- Self Check-in
- Komunitas
- Profil
- Bantuan Darurat

Navigasi pasien dirender melalui Expandable Patient Rail pada workspace setelah login sesuai Bab 12. Landing, autentikasi, dan onboarding tidak memakai rail ini.

Navigasi dokter:

- Dashboard
- Pasien
- Verifikasi SIP
- Profil

Navigasi admin tidak boleh muncul di navigasi publik atau pasien. Akses admin hanya melalui role redirect atau entry point internal yang dilindungi.

### 3.3 Alur global berdasarkan peran

~~~mermaid
flowchart TD
    V[Pengunjung] --> L[Landing HavenCare]
    L -->|Pilih emosi opsional| L
    L -->|Mulai chat| AU{Status auth}
    AU -->|Belum login| R[Daftar]
    AU -->|Login, onboarding belum lengkap| O[Onboarding]
    AU -->|Login dan lengkap| CH[Chat HavenCare AI sesi baru]
    L -->|Sudah punya akun| I[Masuk]
    R --> O
    I --> C{Role dan onboarding valid?}
    C -->|Belum| O
    O --> P{Role}
    C -->|Ya| P
    P -->|Patient| D[Dashboard Pasien]
    P -->|Doctor| DD[Dashboard Dokter]
    P -->|Admin| S[Konsol SOC]
    D --> CH
    D --> A[Self Check-in]
    D --> CO[Komunitas]
    D --> AP[Jadwal/rujukan dokter]
    CH --> X{Sinyal krisis?}
    A --> X
    CO --> X
    X -->|Tidak| D
    X -->|Ya| E[Crisis Override]
~~~

### 3.4 Aturan redirect

- patient menuju /dashboard;
- doctor menuju /doctor/dashboard;
- admin menuju /admin/telemetry;
- pengguna tanpa role atau onboarding lengkap menuju /onboarding;
- pengguna tidak login yang membuka rute privat menuju /login dengan parameter returnUrl yang aman;
- redirect tidak boleh membentuk loop;
- fallback role tidak boleh langsung ke /chat; fallback aman adalah /onboarding.

### 3.5 Flow SaaS lintas halaman pasien

~~~mermaid
flowchart LR
    L[Landing] --> AU[Login/Register]
    AU --> ON[Onboarding]
    ON --> D[Dashboard]
    D --> CH[Chat HavenCare AI]
    D --> AS[Assessment 1–3]
    D --> CM[Community]
    D --> PR[Profile]
    CH --> D
    AS --> D
    AS --> CH
    CM --> D
    PR --> D
    PR -. preference root .-> CH
    PR -. preference root .-> AS
    PR -. preference root .-> CM
    CH --> CR[Crisis Override]
    AS --> CR
    CM --> CR
    D --> CR
~~~

Aturan keterhubungan:

- Dashboard adalah hub default pasien; rail memungkinkan perpindahan langsung antarfungsi tanpa kembali ke landing.
- Chat, Assessment, Community, dan Profile mempertahankan state lokal yang aman ketika rail expand/collapse, tetapi tidak mempertahankan data sensitif setelah logout.
- Hasil Assessment boleh menawarkan Chat HavenCare AI, tetapi konteks hanya diteruskan setelah consent eksplisit.
- Community tidak meneruskan post atau alias ke Chat HavenCare AI secara otomatis.
- Preference visual/profile diterapkan dari root ke seluruh workspace dengan satu store/provider agar tidak berbeda antarpage.
- Crisis Override dapat dipanggil dari semua permukaan input dan selalu mengalahkan modal, popover, drawer, atau loading state biasa.
- Browser Back/Forward, deep link, refresh, dan session restore harus menghasilkan route, title, active navigation, dan permission yang sama.

---

## 4. Sistem Visual HavenCare Glass

### 4.1 Palet normatif

| Token semantik | Nilai | Fungsi |
|---|---:|---|
| brand.primary | #1A7F8E | CTA utama, link aktif, identitas HavenCare |
| brand.primaryHover | #146875 | Hover/focus state primary |
| brand.primaryPressed | #105560 | Pressed state primary |
| brand.deepTurquoise | #0B5963 | Shell/navigation gelap yang tetap satu keluarga warna |
| brand.onPrimary | #FFFFFF | Teks/icon di atas primary/deep turquoise |
| brand.secondary | #7EA172 | Status pemulihan, aksi pendamping, grafik wellbeing |
| brand.warm | #F3C969 | Aksen hangat, highlight positif, sparkle terbatas |
| surface.canvas | #FFFFFF | Kartu dan panel utama |
| surface.muted | #F8FAF9 | Latar halaman pasien/publik |
| surface.mint | #E8F3F1 | Area edukasi, selected soft state |
| surface.glassBlue | #EAF7F8 | Dasar tint glass biru-turquoise |
| surface.glassBlueDeep | #DCEFF3 | Ujung gradient/background section |
| border.subtle | #D8E5E3 | Border dan divider |
| text.primary | #162831 | Heading dan body utama |
| text.muted | #5D7077 | Label/caption yang tetap kontras |
| status.danger | #E06D6D | SOS dan peringatan krisis |
| status.success | #4F8A65 | Konfirmasi sukses |
| focus.ring | #0E7490 | Focus ring keyboard |

Aturan implementasi:

- Semua warna pasien/publik wajib bersumber dari src/theme/colors.ts.
- Tailwind config hanya memetakan token dari sumber tersebut.
- DILARANG menambah hex tersebar pada JSX.
- SOC memakai dark-glass variant yang tetap menggunakan accent turquoise; warna status keamanan tetap dipertahankan agar makna operasional tidak berubah.
- Warna tidak boleh menjadi satu-satunya pembeda status; sertakan icon dan label.

#### Warna ekspresi khusus assessment

Warna ekspresi pada referensi visual dipertahankan sebagai token domain, bukan sebagai warna dasar website. Warna ini hanya digunakan pada emoji, segmen Mood Wheel, indikator Sleep Quality, dan legend emosi.

| Token domain | Nilai acuan | Makna |
|---|---:|---|
| assessment.emotion.positive | #93AD5D | Baik / positif |
| assessment.emotion.neutral | #F5C652 | Netral |
| assessment.emotion.fair | #B49682 | Cukup / fair |
| assessment.emotion.low | #F58A55 | Sedih / kualitas rendah |
| assessment.emotion.intense | #F36F43 | Sangat berat / buruk |
| assessment.emotion.exhausted | #8064E8 | Sangat lelah / tertekan |

Token tersebut adalah pengecualian terkontrol. Background, header, button utama, border, text, dan container tetap memakai HavenCare Glass. Warna emoji tidak boleh dipakai sebagai warna brand global.

#### Warna reaksi khusus community

Seperti referensi, emoji reaction boleh mempertahankan warna emosional yang bervariasi. Warna berikut hanya digunakan pada icon/reaction chip dan tidak mengganti base color halaman Community.

| Token domain | Nilai acuan | Penggunaan |
|---|---:|---|
| community.reaction.support | #4C8FDB | Dukungan / saya mendengar |
| community.reaction.care | #E85B78 | Peduli / hati |
| community.reaction.joy | #F3C969 | Senyum / ikut bahagia |
| community.reaction.surprised | #E9A23B | Tersentuh / terkejut |
| community.reaction.empathy | #6CA9D6 | Pelukan / ikut merasakan |
| community.reaction.concern | #F07955 | Prihatin / butuh dukungan |

Header, active tab, tombol Buat Post, link, focus ring, dan selected community tetap memakai brand.primary. Join/Joined dan status aman memakai brand.secondary.

#### Token glass global HavenCare

Glass biru-turquoise adalah bahasa visual lintas Landing, Auth, Dashboard, Chat, Assessment, Community, Profile, dan workspace dokter. Glass membentuk hierarchy SaaS, bukan dekorasi acak dan bukan hanya milik halaman autentikasi.

| Token domain | Nilai acuan | Penggunaan |
|---|---:|---|
| glass.canvasStart | #F7FCFD | Awal gradient halaman publik/pasien |
| glass.canvasMid | #EAF7F8 | Midpoint glass biru-turquoise |
| glass.canvasEnd | #DCEFF3 | Ujung gradient lembut dan section tint |
| glass.surface | rgba(255,255,255,0.68) | Card, shell, form, dan panel utama |
| glass.surfaceStrong | rgba(255,255,255,0.88) | Input, modal, menu, dan fallback blur |
| glass.surfaceSubtle | rgba(234,247,248,0.62) | Nested panel yang tidak dominan |
| glass.border | rgba(255,255,255,0.68) | Border glass di atas tint |
| glass.innerBorder | rgba(26,127,142,0.12) | Garis dalam agar card tidak hilang di canvas |
| glass.shadow | rgba(22,40,49,0.14) | Shadow lembut card/modal |
| glass.glowPrimary | rgba(26,127,142,0.24) | Glow HavenCare AI, active feature, ambient orb |
| glass.glowSage | rgba(126,161,114,0.20) | Secondary ambient tint |
| glass.scrim | rgba(22,40,49,0.16) | Scrim agar copy pada visual tetap terbaca |

- CTA, link, focus, dan selected state tetap memakai brand.primary dan brand.primaryHover.
- Background page memakai gradient token `glass.canvasStart → glass.canvasMid → glass.canvasEnd`; halaman tidak boleh membuat gradient baru sendiri.
- Gunakan glass pada shell/kartu utama. Nested card maksimal satu level agar tidak menjadi tumpukan transparansi yang ramai.
- Jika backdrop-filter tidak didukung, gunakan glass.surfaceStrong; teks dan control tetap harus terbaca tanpa blur.
- Blur maksimal 24 px pada card besar dan 16 px pada elemen kecil agar teks tidak kabur dan performa tetap baik.
- Kontras teks di atas glass wajib diuji terhadap kondisi background paling terang dan paling gelap.
- Jangan meletakkan teks body langsung di atas foto/gradient tanpa surface atau scrim yang teruji.
- `backdrop-filter`, shadow, dan gradient harus mempunyai fallback untuk Safari/Firefox serta reduced-transparency/high-contrast mode.

#### Aksen authenticated navigation rail

Navigation rail setelah login memakai Deep Turquoise Glass. Warna ini merupakan versi gelap dari base turquoise, sehingga rail tetap berbeda dari canvas tetapi menyatu dengan semua page HavenCare.

| Token domain | Nilai | Penggunaan |
|---|---:|---|
| navigation.shell | rgba(11,89,99,0.90) | Container rail glass utama |
| navigation.shellHover | rgba(26,127,142,0.92) | Hover item nonaktif |
| navigation.shellPressed | #084A53 | Pressed state |
| navigation.activeSurface | rgba(255,255,255,0.92) | Capsule item aktif |
| navigation.activeText | #0B5963 | Icon dan label aktif |
| navigation.inactiveText | #EAFBFC | Icon dan label nonaktif |
| navigation.focus | #F3C969 | Focus ring di atas shell gelap |
| navigation.border | rgba(255,255,255,0.22) | Border rail dan divider |

Deep Turquoise Glass menjaga active capsule rounded tetap terbaca sekaligus menghindari palet hijau terpisah yang membuat website terlihat tidak berhubungan. Seluruh token wajib berada di src/theme/colors.ts; nilai rgba dapat diwakili token dengan format yang didukung sistem tema.

### 4.2 Tipografi

- Font utama seluruh produk adalah Urbanist Variable dengan fallback `Inter, ui-sans-serif, system-ui, sans-serif`.
- Montserrat tidak digunakan lagi pada page publik/pasien/dokter untuk mencegah tabrakan karakter; SOC boleh memakai JetBrains Mono hanya pada hash, timestamp, log, dan nilai tabular.
- Font dimuat sekali melalui root layout, memakai `font-display: swap`, subset yang diperlukan, dan size-adjust/fallback yang mencegah layout shift.

| Style token | Desktop | Mobile | Weight | Penggunaan |
|---|---:|---:|---:|---|
| type.display | 64/68 px | 40/44 px | 700 | Hero, maksimal 3 baris |
| type.h1 | 48/56 px | 36/42 px | 700 | Judul page |
| type.h2 | 36/44 px | 28/36 px | 650–700 | Judul section |
| type.h3 | 24/32 px | 22/30 px | 600–650 | Judul card/panel |
| type.bodyLarge | 18/28 px | 18/28 px | 400–500 | Lead copy |
| type.body | 16/24 px | 16/24 px | 400–500 | Body dan form |
| type.label | 14/20 px | 14/20 px | 600 | Label/button/tab |
| type.caption | 12/18 px | 12/18 px | 500 | Metadata non-kritis |

- Heading maksimal tiga tingkat visual per halaman dan mengikuti urutan h1 → h2 → h3 secara semantik.
- Input mobile minimum 16 px agar browser tidak melakukan auto-zoom.
- Button tidak boleh memakai font di bawah 14 px; target lansia memakai body/label 16 px ketika mode Teks besar aktif.
- Hindari uppercase panjang, letter-spacing berlebihan, dan font-weight < 400 pada teks penting.
- Container teks tidak memakai fixed height. Gunakan `min-width:0`, `overflow-wrap:anywhere`, dan line clamp hanya untuk preview yang mempunyai cara membuka teks lengkap.
- Label tidak boleh bertabrakan dengan icon/badge pada zoom 200%, Bahasa Indonesia panjang, atau mode Teks besar.

### 4.3 Bentuk dan elevasi

- Gunakan token radius: radius.sm 12 px, radius.md 16 px, radius.lg 24 px, radius.xl 32 px, radius.pill 9999 px.
- Input dan compact control memakai radius.md; card memakai radius.lg; hero/modal/auth shell memakai radius.xl; chip dan primary navigation capsule boleh memakai radius.pill.
- Nested surfaces tidak boleh memiliki radius lebih besar daripada parent setelah dikurangi padding.
- Border radius harus konsisten pada clipping image, overlay, skeleton, hover, dan focus ring agar tidak tampak bocor di sudut.
- Gunakan maksimum tiga tingkat elevasi: canvas, card, modal.
- Canvas tidak memakai shadow; card memakai glass.shadow ringan; modal memakai shadow yang lebih tegas + scrim.
- 3D clay icon dan scribble hanya menjadi aksen pada hero, empty state, dan check-in; tidak boleh mengganggu konten atau menjadi satu-satunya pembawa informasi.
- Maksimum satu elemen ambient animation per viewport.
- Hormati prefers-reduced-motion.

### 4.4 Grid dan responsivitas

| Breakpoint | Perilaku |
|---|---|
| 320–639 px | Satu kolom, bottom-safe spacing, drawer menu, CTA selebar container |
| 640–1023 px | Satu atau dua kolom selektif, panel sekunder menjadi accordion/drawer |
| 1024 px ke atas | Dashboard grid, chat multi-panel, navigasi rail bila relevan |

Tidak ada horizontal scroll pada 320 px. Target sentuh minimum HavenCare adalah 48 × 48 px untuk mendukung lansia dan kondisi cemas. Konten penting tidak boleh tertutup keyboard, sticky element, atau safe area perangkat.

Layout foundation:

- max-width marketing/public 1440 px; workspace aplikasi 1600 px; reading content 720–800 px;
- gutter 20–24 px mobile, 32 px tablet, 40–64 px desktop;
- spacing scale hanya 4, 8, 12, 16, 24, 32, 48, 64, dan 80 px kecuali kebutuhan komponen yang terdokumentasi;
- semua anak flex/grid yang memuat teks mempunyai `min-width:0`;
- gunakan `clamp()` untuk heading/gutter, bukan breakpoint dengan lompatan ekstrem;
- jangan memakai `100vw` di dalam container berpadded karena dapat memicu overflow scrollbar;
- sticky header/rail memiliki offset yang menjadi satu token dan tidak ditulis ulang per page;
- overlay, popover, tooltip, dan menu dirender melalui portal dengan collision detection serta boundary viewport.

Referensi assessment berasal dari tampilan aplikasi ponsel, tetapi implementasi target adalah responsive web. DILARANG meniru bingkai perangkat, dynamic island, status bar ponsel, home indicator, atau proporsi layar aplikasi. Yang diadopsi hanya hierarki, interaksi wheel/slider, ukuran ekspresi, dan ritme whitespace.

### 4.5 Konsistensi tema lintas halaman

| Area | Background | Surface utama | Aksen | Catatan |
|---|---|---|---|---|
| Landing | glass.canvasStart → canvasEnd | glass.surface | brand.primary + warm terbatas | Hero interaktif, bukan mockup app |
| Login/Register | gradient global yang sama | glass.surface / surfaceStrong | brand.primary | Split web dan visual HavenCare AI |
| Dashboard | gradient global lebih tenang | glass.surface | brand.primary + secondary | Data/status nyata saja |
| Chat | glass.canvasMid | glass.surfaceStrong untuk conversation, surface untuk side panel | brand.primary | Bubble tetap kontras dan terbaca |
| Assessment | gradient global | glass.surface | domain emotion terbatas | Warna emoji tidak menjadi page theme |
| Community | gradient global | glass.surface | brand.primary + reaction domain | Feed tidak berubah menjadi rainbow UI |
| Profile | gradient global | glass.surface | brand.primary | Group settings konsisten |
| Doctor | glass.canvasStart | glass.surfaceStrong | brand.deepTurquoise | Lebih klinis, tetap satu brand |
| Admin/SOC | #0B1F28 dark glass | rgba(15,43,53,0.88) | turquoise + status operasional | Satu identitas, density berbeda |

- Perpindahan page tidak boleh terasa seperti pindah produk: root background, font, radius, focus ring, CTA, dan shell memakai token yang sama.
- Domain colors hanya berlaku pada data/emoji/status terkait dan tidak boleh mengambil alih header, navigation, CTA, atau canvas.
- Theme preference dan text-size preference diterapkan dari root sebelum paint untuk mencegah flash tema dan hydration mismatch.

### 4.6 SaaS UI/UX foundation

HavenCare menggunakan pola SaaS web yang konsisten, bukan kumpulan mockup page terpisah:

1. PublicShell untuk landing dan auth; PatientWorkspaceShell untuk dashboard/chat/assessment/community/profile; DoctorWorkspaceShell dan SocWorkspaceShell tetap role-scoped.
2. Route, navigation, breadcrumb/page title, permission, feature flag, dan active state berasal dari konfigurasi terpusat, bukan duplikasi string di setiap page.
3. Setiap page menyediakan loading, empty, error, success, offline, unauthorized, forbidden, dan stale-data state yang relevan.
4. Mutation mempunyai pending state, idempotency/deduplication, rollback bila optimistic, pesan error yang dapat ditindaklanjuti, dan retry yang tidak menggandakan data.
5. Filter/tab yang perlu dibagikan disimpan di URL; draft sensitif tidak diletakkan di query string, analytics, atau localStorage tanpa aturan eksplisit.
6. Toast hanya untuk hasil global singkat; error field berada dekat field, error page berada di panel page, dan crisis response tidak boleh hanya berupa toast.
7. Error boundary dipasang per workspace/page sehingga kegagalan panel sekunder tidak meruntuhkan seluruh aplikasi.
8. Feature flag menyembunyikan fitur belum siap; disabled control tidak digunakan sebagai teaser tanpa penjelasan.
9. Skeleton mengikuti ukuran final untuk mencegah CLS; jangan mengganti skeleton dengan spinner fullscreen untuk data panel kecil.
10. Semua control menggunakan component primitive bersama untuk button, input, dialog, drawer, popover, tabs, tooltip, toast, skeleton, dan error state.

Bug-prevention baseline:

- satu user action menghasilkan maksimal satu navigation atau mutation;
- async response lama diabaikan/di-cancel saat route, filter, atau session berubah;
- button submit tidak diletakkan di dalam link dan interactive element tidak saling bersarang;
- list memakai stable ID, bukan array index untuk data yang dapat berubah;
- modal/drawer mengunci scroll, trap focus, menutup dengan Escape, dan mengembalikan focus ke trigger;
- localStorage hanya dibaca setelah environment browser tersedia atau melalui hydration-safe initializer;
- cleanup subscription, timer, media stream, speech, dan AbortController dilakukan saat unmount;
- image memiliki width/height atau aspect-ratio; fallback tidak mengubah layout;
- z-index memakai layer token: base 0, sticky 20, rail/header 30, popover 50, modal 70, crisis 90;
- visual regression wajib mencakup 320, 768, 1024, 1440, dan 1920 px pada zoom 100% serta 200%.

---

## 5. Flow Landing Page

### 5.1 Tujuan

Landing adalah jalur orientasi publik dan pintu utama menuju Chat HavenCare AI. Dalam satu layar pertama, pengguna harus memahami:

1. Apa itu HavenCare?
2. Bahwa HavenCare AI dapat menjadi tempat awal untuk menceritakan perasaan, termasuk cemas maupun senang.
3. Tindakan apa yang dapat dilakukan sekarang.
4. Bahwa HavenCare AI bukan dokter dan tidak menggantikan bantuan darurat.
5. Bahwa website dapat digunakan dengan nyaman oleh Gen Z maupun lansia.

Tujuan konversi utama adalah `Mulai chat dengan HavenCare AI`. Assessment dan Community menjadi jalur sekunder; keduanya tidak boleh mengalahkan CTA chat pada hierarchy, ukuran, atau urutan keyboard.

### 5.2 Elemen lama yang wajib dihapus

Hapus dari landing:

- skor `Mental Health 98.92%` dan progress bar fiktif;
- kartu `Current Mood: Happy` yang tampil tanpa pilihan pengguna;
- contoh percakapan self-harm sebagai dekorasi marketing;
- label `Freud.AI`, `Doctor Freud`, atau istilah Freud lain;
- tombol Play/audio jika tidak ada audio nyata dan state player yang berfungsi;
- tombol App Store/Google Play serta copy `Download App` selama aplikasi native belum tersedia;
- CTA `Get In Touch`, `Platform`, `Careers`, atau label generik lain yang tidak menjelaskan tujuan;
- About dropdown tanpa menu atau destination;
- link publik menuju /admin/telemetry atau halaman internal lain;
- floating action dock lock/settings/menu;
- badge, avatar anggota, testimoni anonim, jumlah pengguna, jadwal, status online, atau klaim 24/7 yang tidak berasal dari data tervalidasi;
- copy `konseling mandiri gratis` jika layanan tersebut bukan konseling berlisensi yang benar-benar tersedia;
- klaim latensi, zero-plaintext, personalisasi algoritmik, atau privasi absolut yang belum dibuktikan implementasi.

Aturan fitur anonim/ambigu:

- Landing tidak memiliki mode, tombol, atau badge `Anonim`.
- Community boleh menggunakan nama samaran sesuai Bab 11, tetapi landing tidak boleh menjanjikan anonimitas terhadap moderator/sistem.
- Quote tanpa nama dan provenance, kartu member dengan avatar generik, angka reaction palsu, atau preview activity buatan harus dihilangkan.
- Jika sebuah fitur belum mempunyai route, backend, atau fallback yang bekerja, sembunyikan fitur tersebut; jangan membuat kontrol dekoratif yang menyerupai tombol.

### 5.3 Urutan section

~~~text
Public Header
  ↓
Hero interaktif: copy + Emotion Entry + visual HavenCare AI/manusia
  ↓
Pilih cara memulai: Chat HavenCare AI sebagai primary, Assessment dan Community sebagai secondary
  ↓
Cara HavenCare AI mendampingi dalam 3 langkah
  ↓
Privasi, batas AI, dan akses bantuan manusia
  ↓
Personalisasi akses: teks besar, motion, dan gaya panduan
  ↓
CTA akhir menuju Chat HavenCare AI
  ↓
Footer publik
~~~

Testimoni atau bukti sosial hanya boleh disisipkan di antara bagian privasi dan personalisasi jika sudah memenuhi provenance, consent, dan verifikasi pada Bab 2. Jika belum, section tersebut tidak dirender dan tidak meninggalkan ruang kosong.

### 5.4 Public header

Desktop header:

- tinggi 72–80 px;
- max-width mengikuti page container 1440 px;
- brand lockup di kiri;
- anchor `Cara kerja`, `Keamanan`, dan `Aksesibilitas` di tengah;
- `Masuk` sebagai text/ghost action;
- `Mulai chat` sebagai primary pill di kanan;
- sticky dengan surface.canvas 88–92% + backdrop blur 16 px setelah pengguna scroll lebih dari 16 px;
- tidak memakai patient navigation rail.

Aturan aksi:

| Label | Tujuan |
|---|---|
| Logo/wordmark | / |
| Cara kerja | #cara-kerja |
| Keamanan | #keamanan |
| Aksesibilitas | #aksesibilitas |
| Masuk | /login?next=/chat |
| Mulai chat | Auth-aware Chat Entry pada Bab 5.7 |

- Jangan menampilkan Community, Assessment, dokter, atau SOC sebagai menu publik utama jika route tersebut membutuhkan login.
- Mobile/tablet menu hanya berisi item yang sama; tidak menambah menu tersembunyi yang berbeda makna.
- Mobile menu focus-trapped, menutup dengan Escape/outside click, mengembalikan focus ke trigger, dan mengunci body scroll selama terbuka.
- Anchor scroll menghormati sticky header dan prefers-reduced-motion.

### 5.5 Hero web interaktif

Komposisi mengadaptasi susunan editorial pada referensi—headline besar, visual manusia, card layanan, dan depth—tanpa memiringkan seluruh halaman atau membuat mockup aplikasi.

~~~text
┌────────────────────────────────────── max 1440 px ──────────────────────────────────────┐
│ Header                                                                                   │
├────────────────────────────── 5 kolom ─────────────┬──────────────────── 7 kolom ─────────┤
│ Eyebrow: Temui HavenCare AI                               │ [visual HavenCare AI + manusia inklusif]         │
│ Apa pun rasanya hari ini,                        │                                        │
│ kamu boleh mulai dari sini.                      │ [😟 Cemas] [🙂 Cukup baik]              │
│ Supporting copy                                  │ [glass response preview dari HavenCare AI]       │
│                                                  │                                        │
│ Bagaimana perasaanmu sekarang?                   │ [batas AI / privasi singkat]            │
│ [Cemas][Sedih][Biasa][Cukup baik][Senang]        │                                        │
│ [Mulai chat dengan HavenCare AI →] [Pelajari cara kerja]  │                                        │
└──────────────────────────────────────────────────┴────────────────────────────────────────┘
~~~

Ukuran desktop:

- Hero minimum 680 px dan tidak dipaksa memenuhi 100vh jika menyebabkan content di bawah fold tidak terlihat.
- Container maksimal 1440 px, padding horizontal 40–64 px, gap 48–72 px.
- Heading memakai type.display `clamp(40px, 5vw, 64px)`, maksimal 3 baris, dan lebar maksimal 680 px.
- Body memakai type.bodyLarge 18/28 px dan maksimal 60 karakter per baris.
- Primary CTA tinggi 54–58 px; secondary action tinggi minimum 48 px.
- Hero visual memiliki aspect-ratio sekitar 4:3, radius.xl 32 px, dan tidak memakai device frame.

Copy utama:

> Apa pun rasanya hari ini, kamu boleh mulai dari sini.

Subcopy:

> Ceritakan yang sedang kamu rasakan kepada HavenCare AI—teman refleksi yang membantumu berhenti sejenak, memahami emosi, dan menentukan langkah berikutnya dengan lebih tenang.

CTA:

- Primer: `Mulai chat dengan HavenCare AI`.
- Sekunder: `Lihat cara kerjanya` menuju #cara-kerja.

Trust line tepat di bawah CTA:

- `HavenCare AI bukan dokter dan tidak memberikan diagnosis.`
- Link `Privasi dan batas layanan` menuju #keamanan.

### 5.6 Emotion Entry

Emotion Entry membuat landing interaktif tanpa mengumpulkan data klinis sebelum consent.

Pilihan awal:

| Pilihan | Warna domain | Preview HavenCare AI | Suggested action |
|---|---|---|---|
| 😟 Cemas | assessment.emotion.intense | `Kita bisa mulai perlahan. Kamu tidak harus menjelaskan semuanya sekaligus.` | Mulai chat |
| 😔 Sedih | assessment.emotion.low | `Aku di sini untuk mendengarkan. Ceritakan sebanyak yang terasa aman.` | Mulai chat |
| 😐 Biasa saja | assessment.emotion.neutral | `Kita bisa melakukan check-in singkat untuk melihat apa yang sedang kamu butuhkan.` | Chat atau Assessment |
| 🙂 Cukup baik | assessment.emotion.positive | `Senang mendengarnya. Kamu bisa mencatat hal yang membantu hari ini.` | Mulai chat |
| 😄 Senang | brand.warm sebagai aksen | `Mari simpan momen baik ini dan cari tahu apa yang membuatnya berarti.` | Mulai chat |

Aturan interaksi:

1. Initial state tidak memilih atau menebak mood pengguna.
2. Klik/keyboard memilih tepat satu chip dan memperbarui preview copy dalam aria-live polite.
3. Chip selected memakai icon/check, border, dan label; warna bukan satu-satunya pembeda.
4. Pemilihan tidak langsung mengirim data, membuat assessment, atau memanggil AI.
5. Mood tidak dimasukkan ke URL, analytics, cookie, localStorage, atau sessionStorage sebelum consent.
6. Saat CTA ditekan, landing hanya meneruskan intent `start-chat`; pengguna memilih/menyetujui konteks mood lagi setelah autentikasi.
7. `Bantuan sekarang` selalu tersedia sebagai link terpisah dan tidak tersembunyi di balik pilihan Cemas/Sedih.
8. Jika JavaScript gagal, headline, CTA, disclaimer, dan navigasi tetap dapat digunakan; preview interaktif boleh hilang secara graceful.

~~~mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> EmotionSelected: pilih chip
    EmotionSelected --> EmotionSelected: ganti chip
    Idle --> ChatEntry: klik Mulai chat
    EmotionSelected --> ChatEntry: klik Mulai chat
    ChatEntry --> Register: belum login
    ChatEntry --> Onboarding: login + onboarding belum lengkap
    ChatEntry --> NewChat: login + onboarding lengkap
~~~

### 5.7 Auth-aware Chat Entry

Semua CTA chat pada landing memakai satu handler/komponen yang sama:

| Kondisi | Hasil |
|---|---|
| Belum login | /register?next=/chat&intent=start-chat |
| Sudah login, onboarding belum lengkap | /onboarding?next=/chat&intent=start-chat |
| Sudah login, onboarding lengkap | /chat?new=1 |
| Auth sedang diperiksa | Tampilkan label `Memeriksa sesi…`; cegah double navigation |
| Auth gagal/offline | Tetap izinkan menuju /login?next=/chat dan tampilkan pesan jaringan yang aman |

- `next` hanya menerima allowlist route internal; open redirect dilarang.
- Satu klik menghasilkan tepat satu navigation event.
- Jangan merender CTA palsu yang hanya scroll ke atas atau tidak mempunyai destination.
- Pengguna login yang membuka / tidak boleh melihat flash landing lalu redirect acak; session resolution memiliki skeleton singkat dan deterministic redirect sesuai role.

### 5.8 Visual hero dan personalisasi emosi

- Focal point adalah HavenCare AI bersama figur manusia inklusif, bukan foto pasien yang diberi label gangguan.
- Gunakan representasi Gen Z dan lansia secara setara serta bermartabat; hindari stereotip lansia lemah atau Gen Z selalu cemas.
- Visual dapat berupa komposisi editorial: foto/ilustrasi manusia, HavenCare AI, dan maksimal tiga floating glass cards yang semuanya berasal dari state nyata.
- Floating cards yang diizinkan: emotion chip terpilih, preview balasan HavenCare AI, dan privacy/boundary note.
- Floating cards tidak boleh berisi skor, statistik, anonymous member avatars, jadwal, reaction count, atau status online palsu.
- Visual background memakai surface.mint, glass.canvasEnd, brand.primary pada opacity rendah, sage glow, serta warm accent terbatas; warna biru/pink referensi tidak menjadi base color baru.
- Aset menjaga safe area pada crop 16:10, 4:3, dan 1:1. Copy utama dirender sebagai HTML, bukan menyatu dalam gambar.
- Jika visual informatif, alt text menjelaskan HavenCare AI dan dua generasi yang direpresentasikan; jika seluruh makna sudah ada dalam HTML, gunakan alt kosong.
- Maksimal satu aset hero prioritas tinggi. Gunakan responsive image, ukuran intrinsic, modern format, dan cegah layout shift.

### 5.9 Jalur fitur yang jelas

Bagian `Pilih cara memulai` hanya menampilkan fitur yang benar-benar tersedia:

| Fitur | Penjelasan awam | CTA | Destination |
|---|---|---|---|
| Chat HavenCare AI | Ceritakan perasaan dan dapatkan pertanyaan reflektif | Mulai chat | Auth-aware Chat Entry |
| Check-in 3 langkah | Pilih mood, kualitas tidur, lalu tuliskan ekspresi | Mulai check-in | /assessments melalui auth guard |
| Komunitas | Baca dan berbagi dukungan menggunakan nama samaran yang terlihat moderator | Lihat komunitas | /community melalui auth guard |

- Chat HavenCare AI tampil sebagai card utama berukuran lebih besar atau berada di urutan pertama.
- Card dapat diklik hanya pada CTA/link yang jelas; jangan membuat area dekoratif besar sebagai control tanpa focus state.
- Setiap card menjelaskan kebutuhan login sebelum navigasi bila relevan.
- Jika Assessment atau Community belum fungsional di environment tertentu, card disembunyikan dari konfigurasi feature flag; jangan menampilkan `Segera hadir` sebagai control aktif.
- Tidak ada card dokter, jadwal, konsultasi, atau booking sebelum layanan serta route terkait benar-benar tersedia.

### 5.10 Cara kerja

Section #cara-kerja memakai tiga langkah horizontal desktop dan vertikal pada layar sempit:

1. `Pilih cara memulai` — chat langsung atau check-in singkat.
2. `Ceritakan dengan caramu` — teks, quick emoji, atau suara bila browser/backend mendukung.
3. `Tentukan langkah berikutnya` — lanjut refleksi, buka assessment, lihat Community, atau cari bantuan manusia.

Setiap langkah mempunyai icon semantik, heading, deskripsi maksimal dua baris, dan link ke penjelasan terkait. Hindari istilah model AI, vektor, telemetry, dan protokol teknis.

### 5.11 Keamanan, batas layanan, dan bantuan

Section #keamanan wajib terlihat sebelum CTA akhir:

- HavenCare AI bukan dokter, tidak mendiagnosis, dan tidak meresepkan obat.
- Jelaskan praktik privasi hanya sesuai implementasi yang sudah diverifikasi.
- `Pelajari privasi` menuju halaman/section legal yang tersedia.
- `Bantuan sekarang` membuka Crisis Support Panel tanpa login.
- Jika layanan profesional tersedia, CTA memakai label konkret seperti `Cari bantuan profesional`; jangan memakai `Book now` atau `Check availability` tanpa sistem booking nyata.
- Tidak ada testimonial pasien, foto dokter, lisensi, badge verified, atau sertifikasi sebelum datanya tervalidasi.

### 5.12 Personalisasi untuk Gen Z dan lansia

Section #aksesibilitas menawarkan preferensi tampilan yang benar-benar bekerja:

- `Teks standar` / `Teks besar` meningkatkan root font-size tanpa memotong komponen.
- `Gerakan lembut` / `Kurangi gerakan` mengikuti prefers-reduced-motion dan dapat dioverride pengguna.
- `Ringkas` / `Terpandu` mengubah panjang helper copy, bukan menyembunyikan disclaimer atau informasi keselamatan.
- Preference non-sensitif boleh disimpan lokal dengan key terpisah dan dapat di-reset.
- Control memakai segmented button/radio semantics, label yang jelas, dan preview langsung.
- Default berasal dari preferensi browser/OS bila tersedia; jangan menebak preferensi berdasarkan usia.

Gen Z mendapatkan interaksi cepat melalui emotion chips, microcopy ringkas, dan visual HavenCare AI. Lansia mendapatkan type scale lebih besar, target minimum 48 px, bahasa langsung, kontras AA, dan tidak ada tindakan yang hanya tersedia melalui hover/gesture.

### 5.13 Responsive web layout

| Viewport | Perilaku |
|---|---|
| ≥ 1280 px | Hero 5/7 kolom, visual editorial penuh, tiga feature cards dan tiga langkah horizontal |
| 1024–1279 px | Hero 6/6 kolom, type.display turun secara fluid sampai sekitar 56 px, floating cards maksimal dua |
| 768–1023 px | Hero bertumpuk: copy/emotion entry lebih dahulu, visual setelah CTA; cards 2+1 grid |
| 320–767 px | Satu kolom, visual disederhanakan atau disembunyikan, chips horizontal wrap, CTA selebar container |

- Landing adalah website, bukan mockup aplikasi: tidak ada device frame, status bar, dynamic island, bottom tab, atau gesture-only control.
- Hero copy selalu muncul sebelum visual dalam DOM untuk orientasi dan screen reader.
- Pada mobile, primary CTA tetap terlihat tanpa sticky bar yang menutupi footer/content.
- Pada 320 px dan zoom 200%, tidak ada horizontal scroll, text clipping, atau overlap floating card.
- Section menggunakan scroll-margin-top sesuai tinggi header.

### 5.14 Motion, feedback, dan performa

- Hero boleh memakai satu ambient gradient drift 8–12 detik dan HavenCare AI idle float maksimal 4–6 px.
- Emotion chip transition 140–180 ms; preview response 180–240 ms menggunakan fade/translate maksimal 4 px.
- Tilt/parallax hanya aktif untuk fine pointer, maksimal 2–3 derajat, dan tidak menghambat klik; nonaktif pada touch, reduced motion, atau perangkat berperforma rendah.
- Jangan menjalankan beberapa `animate-float` tanpa batas pada card terpisah.
- Hover, focus, pressed, loading, disabled, success, dan error state harus terlihat jelas untuk setiap control.
- Target performa: LCP ≤ 2,5 detik, CLS ≤ 0,1, INP ≤ 200 ms pada baseline produksi yang disepakati.
- Hero asset tidak boleh memblokir form/chat route prefetch; prefetch hanya untuk CTA yang wajar dan tidak memanggil data sensitif.

### 5.15 Analytics dan privasi landing

Event yang diizinkan:

- landing_view;
- landing_emotion_option_selected dengan kategori agregat hanya setelah consent analytics;
- landing_chat_cta_clicked;
- landing_feature_cta_clicked dengan destination;
- landing_accessibility_preference_changed.

Dilarang merekam:

- teks bebas;
- nama, email, atau identifier sebelum auth;
- pilihan emosi tanpa consent analytics;
- crisis/help click sebagai event marketing;
- isi preview atau data kesehatan mental pada URL/referrer.

### 5.16 Footer publik

- Kelompok Produk: Cara kerja, Chat HavenCare AI, Assessment, Community.
- Kelompok Dukungan: Keamanan, Privasi, Syarat, Bantuan sekarang.
- Kelompok Akun: Masuk, Daftar.
- SOC/admin tidak ditampilkan pada footer publik.
- Copyright memakai identitas publik yang telah diputuskan; `Freud Web UI Design Standard` dihapus.
- Hanya tampilkan email, social link, alamat, atau legal entity yang benar-benar aktif dan terverifikasi.

---

## 6. Flow Autentikasi dan Onboarding

### 6.1 Login/register

~~~mermaid
flowchart LR
    A[Buka Login/Register] --> B[Isi form]
    B --> C{Validasi lokal}
    C -->|Gagal| D[Error dekat field + summary]
    C -->|Lolos| E[Submit]
    E --> F{Respons auth}
    F -->|Gagal| G[Pesan aman, tidak membocorkan akun]
    F -->|Berhasil, onboarding belum lengkap| H[Onboarding]
    F -->|Berhasil, profil lengkap| I[Role Home]
~~~

Aturan:

- /login dan /register memakai AuthWebShell yang sama agar perpindahan mode tidak mengubah layout secara mendadak.
- Form tetap dapat dipakai tanpa panel visual pada mobile.
- Password manager, autocomplete, Enter submit, loading, dan error state wajib didukung.
- Jangan menggunakan copy rasa takut, urgensi palsu, atau janji kesembuhan untuk mendorong registrasi.
- Akun demo harus diberi label demo dan tidak bercampur dengan login produksi.
- Patient navigation rail DILARANG tampil di kedua route autentikasi.
- SmartSave/SmartMave dan seluruh copy finansial pada referensi tidak boleh muncul dalam produk.

### 6.2 Identitas auth: HavenCare

Pada lokasi wordmark SmartSave dalam referensi, tampilkan brand lockup sementara:

- default placeholder logo geometris sederhana;
- tulisan HavenCare;
- accessible name `HavenCare` pada link yang menuju landing page;
- HavenCare AI tetap menjadi nama chatbot/asisten AI.

Aturan wordmark:

- Gunakan Urbanist, mengikuti geometric sans yang sudah menjadi font publik/pasien dan karakter visual referensi.
- Desktop: 30–34 px, weight 600, line-height 1, letter-spacing -0.02em.
- Tablet/mobile: 24–28 px.
- Logo 40 × 40 px desktop dan 32 × 32 px mobile; gap wordmark 12 px.
- Warna wordmark text.primary; hover link memakai brand.primary tanpa mengubah ukuran.
- Placeholder logo adalah aset internal sementara. Jangan menyalin logo merek pada referensi secara literal dan jangan menggambar ulang dengan karakter teks/emoji.
- Saat logo final tersedia, aset dapat diganti tanpa mengubah ukuran slot atau layout.
- Render satu HavenCare brand lockup per auth viewport; jangan mengulang wordmark sebagai dekorasi di panel visual. Nama badan hukum hanya muncul pada legal/footer bila sudah diverifikasi.

### 6.3 Struktur AuthWebShell desktop

Komposisi mengikuti split-screen pada referensi dan disesuaikan untuk website:

~~~text
┌────────────────────────── 46–50% ──────────────────────────┬────────────────────────── 50–54% ──────────────────────────┐
│ [default logo] HavenCare                                   │                                                              │
│                                                            │       ambient turquoise/sage glow                            │
│      ┌──────── glass auth card, max 520 px ────────┐       │                                                              │
│      │ Selamat datang kembali / Mulai bersama kami │       │             [HavenCare AI chatbot AI visual]                         │
│      │ supporting copy                             │       │          [halo card]  [privacy card]                        │
│      │ [ Masuk          Daftar ]                   │       │                                                              │
│      │ fields + contextual validation              │       │       “Ruang tenang untuk mulai bercerita.”                  │
│      │ primary CTA                                 │       │       batas HavenCare AI + link privasi                               │
│      │ forgot / terms / supported OAuth only       │       │                                                              │
│      └─────────────────────────────────────────────┘       │                                                              │
│ legal links + bantuan                                      │                                                              │
└────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────┘
~~~

Layout desktop:

- Minimum tinggi 100dvh; lebar content maksimal 1600 px dan terpusat pada layar ultra-wide.
- Split default 48% form : 52% visual. Rentang yang diizinkan 46/54 sampai 50/50.
- Left pane minimum 560 px pada desktop dan memakai surface.muted dengan ambient tint sangat halus.
- Form card lebar min(520 px, calc(100% - 64 px)), padding 32–40 px, radius.xl 32 px, glass.surface, glass.border, dan shadow lembut.
- Brand lockup berada 40–56 px dari tepi atas/kiri container; bukan di dalam input card pada layar lebar.
- Right pane memakai radius.xl 32 px pada sisi yang bertemu outer container, overflow hidden, dan tidak memakai bentuk bingkai ponsel.
- Divider antarpanel berupa perubahan surface yang lembut, bukan garis hitam.
- Legal/help links tetap tersedia di dasar left pane tanpa menjadi paragraf promosi panjang seperti referensi.

### 6.4 Form login

Heading dan copy:

- Heading: `Selamat datang kembali`.
- Supporting copy: `Masuk untuk melanjutkan ruang ceritamu bersama HavenCare.`
- CTA: `Masuk`.
- Link mode: `Belum punya akun? Daftar`.

Field minimum:

1. Email.
2. Password dengan tombol Tampilkan/Sembunyikan.
3. Checkbox `Ingat saya` hanya bila persistence benar-benar didukung.
4. Link `Lupa password?` menuju flow yang tersedia.

Aturan:

- Input tinggi 56 px, radius.md 16 px, label selalu terlihat, icon opsional 20 px, dan jarak field 16 px.
- Validasi format dilakukan setelah blur atau submit; jangan menampilkan error saat pengguna baru mengetik karakter pertama.
- Status valid boleh memakai status.success + icon centang; jangan hanya mengandalkan warna.
- Error spesifik ditempatkan di bawah field; error auth umum ditempatkan di atas CTA dan diumumkan melalui aria-live.
- Submit button tinggi 56 px dan selebar form; loading mempertahankan lebar label agar layout tidak bergeser.
- Enter melakukan tepat satu submit. Button di-disable hanya selama request aktif dan tetap menjelaskan state `Sedang masuk…`.
- Pesan credential gagal bersifat aman, misalnya `Email atau password belum tepat`, tanpa membocorkan apakah email terdaftar.
- Setelah sukses, redirect mengikuti role/onboarding matrix pada Bab 3 dan returnUrl yang sudah divalidasi.

### 6.5 Form register

Heading dan copy:

- Heading: `Buat ruang amanmu`.
- Supporting copy: `Daftar untuk check-in, berbicara dengan HavenCare AI, dan terhubung dengan dukungan yang sesuai.`
- CTA: `Buat akun`.
- Link mode: `Sudah punya akun? Masuk`.

Field minimum:

1. Nama panggilan.
2. Email.
3. Password.
4. Konfirmasi password bila backend membutuhkannya.
5. Persetujuan Syarat dan Kebijakan Privasi sebagai checkbox wajib.
6. Persetujuan marketing dipisahkan, opsional, dan default tidak tercentang.

Aturan:

- Strength hint password bersifat instruktif dan tidak memakai skor menakutkan.
- Persyaratan password ditampilkan sebelum error dan diperbarui dengan icon + teks.
- Nama panggilan digunakan untuk personalisasi setelah disanitasi; jangan menampilkan nama legal sebagai kewajiban jika tidak diperlukan.
- CTA baru aktif ketika field wajib valid dan consent wajib disetujui; alasan disabled harus tetap dapat diketahui screen reader.
- Submit gagal mempertahankan nama dan email, tetapi password tidak disimpan ke localStorage/sessionStorage.
- Setelah sukses, arahkan ke verifikasi email bila tersedia, kemudian onboarding; jangan langsung membuat asumsi role selesai.

### 6.6 Segmented switch Masuk/Daftar

- Control dua pilihan berada di atas fields, tinggi 52 px, radius.md 16 px, background glass.surfaceStrong.
- Active segment memakai surface.canvas, text.primary, font semibold, border/subtle shadow; inactive memakai text.muted.
- Switch mengubah route /login ↔ /register melalui client navigation dan memperbarui document title.
- Email yang sudah diketik boleh diteruskan dalam memory saat switch; password, consent, dan error tidak ikut dipindahkan.
- State active harus memakai aria-current atau semantics tab/link yang benar; jangan membuat div clickable.
- Motion active indicator 180–220 ms ease-out dan dimatikan saat prefers-reduced-motion.
- Browser Back/Forward harus menyinkronkan active segment tanpa flash mode yang salah.

### 6.7 Right visual panel: HavenCare AI attraction panel

Panel kanan mengganti gambar brankas pada referensi dengan visual chatbot AI HavenCare AI yang hangat dan relevan dengan kesehatan mental.

Isi visual:

- HavenCare AI 3D/soft-clay atau ilustrasi high-quality sebagai focal point, bukan foto robot humanoid yang menyeramkan.
- Bentuk HavenCare AI mempertahankan karakter yang sama dengan Chat HavenCare AI; gunakan turquoise sebagai warna utama, sage sebagai secondary glow, dan warm yellow hanya sebagai aksen kecil.
- Dua atau tiga floating glass cards berisi pesan pendek yang aman, misalnya `Hai, aku HavenCare AI`, `Kamu bisa mulai dengan satu emoji`, dan `Percakapanmu bersifat pribadi sesuai kebijakan kami`.
- Headline maksimal dua baris: `Ruang tenang untuk mulai bercerita.`
- Supporting copy: `HavenCare AI membantumu melakukan refleksi awal—bukan menggantikan psikolog, dokter, atau layanan darurat.`
- Aksi ringan `Kenali HavenCare AI` boleh membuka dialog penjelasan tanpa meninggalkan draft form.

Aturan aset:

- Siapkan asset final teroptimasi, misalnya `/images/auth/omi-auth-hero.webp`, beserta fallback AVIF/WebP bila pipeline mendukung.
- Area aman visual 640 × 720 px; focal point tetap terlihat pada crop 4:5 sampai 1:1.
- Ukuran file target maksimal 300 KB desktop dan gunakan responsive source; jangan menjadikan screenshot referensi sebagai background.
- Jika visual informatif, alt: `HavenCare AI, asisten refleksi HavenCare, menyambut pengguna baru`. Jika pesan yang sama sudah ditulis sebagai HTML, gunakan alt kosong agar tidak dibaca dua kali.
- Copy dan CTA dirender sebagai HTML, bukan dibakar ke dalam bitmap.
- Tidak boleh ada skor kesehatan, percakapan krisis, testimonial, angka pengguna, diagnosis, dokter fiktif, atau klaim keamanan absolut pada panel.

### 6.8 Interaksi agar auth tidak kaku

- Ambient orb bergerak sangat lambat maksimal 8–12 px dalam 6–10 detik; hanya satu ambient animation aktif.
- HavenCare AI boleh melakukan idle float 4–6 px dan blink halus; berhenti saat tab tidak aktif, user mengetik, atau reduced motion aktif.
- Focus field menaikkan border ke brand.primary dan glow maksimal 3 px tanpa menggeser layout.
- Success check muncul dengan scale/fade 140–180 ms; error menggunakan fade tanpa shake agresif.
- Hover CTA menaikkan elevasi 2 px; pressed kembali ke posisi awal. Keyboard focus selalu terlihat.
- Floating message card tidak menerima pointer event kecuali `Kenali HavenCare AI`; dekorasi tidak boleh menangkap klik form.
- Setelah submit sukses, gunakan progress feedback singkat lalu route transition; jangan memainkan confetti pada konteks kesehatan mental.

### 6.9 Responsive web auth

| Viewport | Layout |
|---|---|
| ≥ 1200 px | Split 48/52, form card maksimal 520 px, visual HavenCare AI penuh |
| 900–1199 px | Split 52/48, visual disederhanakan dan floating card maksimal dua |
| 640–899 px | Satu kolom; visual menjadi banner 220–280 px di atas form atau disembunyikan bila tinggi viewport terbatas |
| 320–639 px | Satu kolom web, padding 20–24 px, form tanpa glass transparan berat, visual dekoratif disembunyikan |

- Ini adalah responsive website, bukan tampilan aplikasi; jangan memakai device frame, status bar ponsel, atau bottom navigation.
- Pada height < 700 px, brand lockup dan form mengikuti normal page scroll; jangan mengecilkan field di bawah 52 px.
- Keyboard virtual tidak boleh menutupi active field atau CTA; gunakan scrollIntoView yang tidak memaksa motion saat reduced motion.
- Pada mobile, semua fungsi auth tetap ada walaupun panel HavenCare AI disembunyikan.
- Tidak boleh ada horizontal scroll pada zoom 200% atau viewport 320 px.

### 6.10 OAuth, legal, dan bantuan

- Tombol `Lanjutkan dengan Google/Apple/...` hanya dirender untuk provider yang benar-benar dikonfigurasi dan berhasil diuji.
- Jangan menampilkan icon sosial mati hanya untuk menyerupai referensi.
- Provider button memakai label teks; icon saja tidak cukup.
- Privacy, Terms, dan Bantuan harus dapat dibuka dengan keyboard dan tidak menghapus input form ketika kembali.
- Link `Butuh bantuan sekarang?` membuka Crisis Support Panel tanpa memaksa pengguna login.
- Analytics auth hanya merekam event teknis yang diizinkan; jangan merekam password, isi field, atau pesan error yang mengandung data pengguna.

### 6.11 Onboarding pasien

Urutan:

1. Pilih peran.
2. Isi nama panggilan.
3. Pilih preferensi komunikasi dan waktu pendampingan.
4. Baca ringkasan batas HavenCare AI serta privasi.
5. Setujui consent yang diperlukan.
6. Masuk ke /dashboard.

Consent klinis, privacy policy, dan marketing consent tidak boleh digabung menjadi satu checkbox.

---

## 7. Flow Dashboard Pasien

### 7.1 Hierarki layar

~~~text
Sapaan personal + tanggal lokal
  ↓
Check-in emosi harian
  ↓
Jadwal konsultasi terdekat atau empty state
  ↓
Quick actions: HavenCare AI · Self Check-in · Komunitas
  ↓
Ringkasan aktivitas terakhir
  ↓
Jaminan privasi + batas layanan
~~~

### 7.2 Aturan konten dashboard

- Nama dan waktu berasal dari profil serta timezone pengguna, bukan hardcoded.
- Jadwal berasal dari API. Jika kosong, tampilkan Belum ada sesi terjadwal dan CTA Cari bantuan profesional.
- Link pertemuan hanya muncul jika status dikonfirmasi dan URL valid.
- Badge privasi memakai bahasa pengguna: Sesi ini dilindungi HavenCare; detail L0–L3 dipindahkan ke halaman penjelasan.
- Dashboard tidak boleh menampilkan nilai klinis sebagai persentase wellbeing.

### 7.3 Check-in emosi

Pilihan awal:

- Tenang
- Cukup baik
- Cemas
- Lelah
- Sangat tertekan / Butuh bantuan sekarang

Respons pilihan:

| Pilihan | Respons berikutnya |
|---|---|
| Tenang | Tawarkan refleksi singkat atau catat check-in |
| Cukup baik | Tawarkan jurnal syukur atau lanjutkan hari |
| Cemas | Tawarkan bicara dengan HavenCare AI atau grounding |
| Lelah | Tawarkan jeda, refleksi beban, atau chat |
| Sangat tertekan | Jalankan Crisis Override tanpa menunggu submit lain |

Check-in bersifat self-report, bukan diagnosis dan bukan pengganti assessment.

### 7.4 Layout SaaS dashboard

Desktop ≥ 1200 px memakai grid 12 kolom di dalam PatientWorkspaceShell:

~~~text
┌──────────────────────────────────────────────────────────────────────────┐
│ Sapaan + tanggal lokal                         [Bantuan] [Profil]         │
├───────────────────────────────────────┬──────────────────────────────────┤
│ Check-in emosi — 7 kolom              │ Jadwal/empty state — 5 kolom    │
├───────────────────────────────────────┴──────────────────────────────────┤
│ Quick actions: Chat HavenCare AI · Assessment · Community               │
├───────────────────────────────────────┬──────────────────────────────────┤
│ Aktivitas terakhir — 7 kolom          │ Privasi & batas AI — 5 kolom    │
└───────────────────────────────────────┴──────────────────────────────────┘
~~~

- Page background memakai gradient HavenCare Glass; setiap module memakai glass.surface, glass.border, radius.lg, dan padding 24–32 px.
- Check-in adalah module primer dan muncul sebelum jadwal dalam DOM serta urutan keyboard.
- Quick-action Chat HavenCare AI memiliki emphasis primer; Assessment dan Community memakai secondary/neutral style.
- Card tidak memakai angka, badge, progress, atau chart jika backend tidak memberikan data nyata.
- Empty state tidak dibiarkan menjadi card kosong; selalu berisi penjelasan dan maksimal satu tindakan relevan.

### 7.5 Interaksi, data state, dan responsivitas

- Memilih emosi memperbarui preview tindakan tanpa auto-submit; pengguna mengonfirmasi `Simpan check-in` atau memilih tindakan lanjutan.
- Submit memakai clientRequestId/idempotency key. Rapid click tidak boleh membuat dua check-in pada tanggal yang sama kecuali model data memang mendukung beberapa entri.
- Mutation gagal mempertahankan pilihan dan menampilkan Coba lagi/Hapus; jangan menampilkan success palsu.
- Aktivitas terakhir menampilkan skeleton → content/empty/error; data parsial tidak diisi dengan angka contoh.
- Jadwal stale menampilkan waktu pembaruan; link meeting divalidasi protocol/host dan tidak dirender bila invalid.
- ≥1200 px memakai layout 7/5; 768–1199 px menjadi 6/6 atau satu kolom sesuai ruang setelah rail; <768 px satu kolom dengan urutan check-in, quick actions, schedule, activity, privacy.
- Container query digunakan untuk card dashboard agar rail 72/248 px tidak menyebabkan breakpoint salah.
- Text besar, locale panjang, dan zoom 200% boleh menambah tinggi card; card dilarang memakai fixed height.

### 7.6 Komponen dan acceptance Dashboard

Komponen minimum:

- DashboardHeader
- DailyEmotionCheckIn
- UpcomingAppointmentCard
- DashboardQuickActions
- RecentActivityList
- PrivacyBoundaryCard

Acceptance:

- [ ] /dashboard ada sebelum ROLE_HOME.patient diarahkan ke route tersebut.
- [ ] Nama, tanggal, timezone, appointment, dan activity tidak hardcoded.
- [ ] Check-in normal, loading, success, duplicate, offline, dan failure dapat dipulihkan.
- [ ] Sangat tertekan membuka Crisis Override sebelum save normal dilanjutkan.
- [ ] Quick actions menuju route tepat satu kali dan mengikuti role/auth guard.
- [ ] Rail expand/collapse tidak menghapus pilihan check-in atau menggeser content keluar viewport.
- [ ] Glass fallback, Teks besar, keyboard, screen reader, reduced motion, serta viewport target lulus.

---

## 8. Chat HavenCare AI Web — Personalized, Quick Emotion, dan Wellbeing Overview

### 8.1 Tujuan dan batas adaptasi referensi

Chat HavenCare AI harus memberi kesan hangat, ringan, personal, dan mudah dimulai saat pengguna sedang cemas atau tidak sanggup mengetik panjang.

Elemen referensi yang diadopsi:

- sapaan personal dengan nama pengguna;
- perkenalan karakter AI melalui visual HavenCare AI yang ekspresif;
- dialog pembuka yang sederhana;
- background ambient lembut;
- composer berbentuk rounded bar dengan beberapa quick action;
- suggestion chips;
- overview card yang dapat dibuka cepat;
- bubble percakapan yang ringan dan mudah dipindai.

Elemen yang tidak diadopsi:

- frame ponsel, status bar, home indicator, dan bottom navigation aplikasi;
- dominasi warna ungu/biru yang mengganti base color HavenCare;
- nama Noaii atau AI Agent;
- diagnosis penyakit fisik;
- rekomendasi vitamin, tablet, obat, atau card produk;
- skor Energy 82/100, heart rate, stress score, atau data kesehatan lain yang tidak memiliki sumber nyata;
- jumlah prompt tersisa atau Powered by model tertentu pada UI pasien.

Identitas final tetap HavenCare dan HavenCare AI. HavenCare AI adalah teman refleksi, bukan dokter.

### 8.2 Layout web desktop

Chat memakai layout web workspace, bukan replika aplikasi mobile.

~~~text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Patient Header / HavenCare                                      Bantuan · Profil          │
├───────┬──────────────────────┬─────────────────────────────────────┬───────────────────┤
│ NAV   │ SESSION LIST         │ CONVERSATION                        │ CONTEXT OPTIONAL  │
│       │                      │                                     │                   │
│       │ [+ Sesi baru]        │ HavenCare AI · Teman refleksi HavenCare          │ Insight /         │
│       │ [Cari sesi]          │ ─────────────────────────────────── │ Overview pinned   │
│       │                      │                                     │                   │
│       │ Hari ini             │ [Pesan dan inline widget]           │ Bantuan krisis    │
│       │ • Refleksi pagi      │ [Pesan dan inline widget]           │                   │
│       │ • Sulit tidur        │                                     │                   │
│       │                      │ [Quick chips bila relevan]          │                   │
│       │                      │ ┌─────────────────────────────────┐ │                   │
│       │                      │ │🙂 ♡ Ringkasan  Tulis…  🎙  ➤   │ │                   │
│       │                      │ └─────────────────────────────────┘ │                   │
└───────┴──────────────────────┴─────────────────────────────────────┴───────────────────┘
~~~

Spesifikasi responsive:

| Viewport | Layout |
|---|---|
| ≥ 1280 px | 72/248 px patient rail + 280 px sessions + fluid conversation + context 300–340 px opsional |
| 1024–1279 px | Patient nav + collapsible sessions + conversation; context menjadi popover/drawer |
| 768–1023 px | Conversation utama; sessions dan overview dibuka sebagai side drawer |
| 320–767 px | Satu kolom responsive web dengan patient header; composer sticky-safe, tanpa chrome aplikasi |

- Lebar baca bubble maksimum 680 px agar baris tidak terlalu panjang.
- Conversation menggunakan document/section scroll tunggal; header dan composer boleh sticky di dalam area chat.
- Context panel hanya tampil jika dipin pengguna atau ruang mencukupi.
- Background memakai surface.muted dengan ambient blob sangat lembut dari brand.primary, brand.secondary, dan brand.warm pada opacity rendah.
- DILARANG membuat full-screen gradient ungu seperti referensi.

### 8.3 Flow membuat sesi baru

~~~mermaid
flowchart TD
    A[Klik Sesi baru] --> B[Create session]
    B -->|Berhasil| C[Welcome dialog HavenCare AI]
    B -->|Gagal| D[Inline error + retry]
    C --> E{Pilihan pengguna}
    E -->|Mulai bercerita| F[Fokus ke composer]
    E -->|Pilih quick prompt| G[Kirim pesan terpilih]
    E -->|Pilih quick emoji| H[Auto-send pesan emosi]
    E -->|Lewati| F
    G --> I[Guardrail + respons HavenCare AI]
    H --> I
~~~

Aturan:

- Welcome dialog muncul setelah sesi baru berhasil dibuat, bukan sebelum sessionId tersedia.
- Dialog muncul sekali per sesi baru dan tidak muncul ketika membuka sesi lama.
- State welcome disimpan per session sebagai welcomeSeenAt atau flag setara.
- Jika pembuatan sesi gagal, dialog tidak boleh tampil seolah sesi telah tersimpan.
- Menutup dialog membawa fokus ke composer dan tidak menghapus sesi.

### 8.4 Welcome dialog HavenCare AI yang personal

Dialog mengambil preferredName dari profil akun yang sedang login. Gunakan nama panggilan yang telah disanitasi; fallback aman adalah Sahabat. DILARANG mengambil nama dari teks chat atau menebak identitas pengguna.

Copy utama:

> Halo, {preferredName}. Aku HavenCare AI.

Copy pendamping:

> Aku bisa menemanimu mengenali perasaan, melakukan refleksi singkat, atau mencari langkah bantuan yang sesuai. Aku bukan dokter dan tidak memberikan diagnosis.

~~~text
┌──────────────────────────────────────────────────────────────┐
│                                                       [Tutup]│
│                         [HavenCare AI visual]                         │
│                                                              │
│                 Halo, Rani. Aku HavenCare AI.                         │
│        Bagaimana aku bisa menemanimu hari ini?               │
│                                                              │
│ [😟 Aku cemas] [😔 Aku sedih] [😴 Aku lelah] [🫂 Temani aku] │
│                                                              │
│ [Lewati]                              [Mulai bercerita →]    │
└──────────────────────────────────────────────────────────────┘
~~~

Visual dan perilaku:

- Desktop dialog maksimum 640 px, berada di tengah conversation canvas; bukan menutup seluruh browser.
- HavenCare AI berupa ilustrasi/3D clay icon dengan glow turquoise–sage, bukan robot biru/ungu dari referensi.
- Backdrop surface.muted/70 dengan blur ringan.
- Dialog menggunakan role dialog, aria-modal, focus trap, Escape, dan pengembalian fokus ke tombol Sesi baru/composer.
- Nama pengguna tidak dianimasikan seperti typewriter agar screen reader dan pengguna cemas tidak menunggu.
- HavenCare AI boleh melakukan satu animasi masuk 220–320 ms; tidak floating terus-menerus.
- Tombol quick emotion di dialog memakai mapping yang sama dengan Quick Emoji Bar pada Bab 8.8.
- Nama tidak ditampilkan pada analytics atau log visual sebagai event property.

### 8.5 Header conversation

Header chat memuat:

- avatar HavenCare AI;
- nama HavenCare AI;
- label Teman refleksi HavenCare;
- status koneksi nyata: Online, Menghubungkan, atau Offline;
- tombol Sesi baru;
- menu session: rename, export bila diizinkan, hapus;
- link Bantuan sekarang yang selalu dapat ditemukan.

Status Terverifikasi tidak digunakan pada HavenCare AI karena dapat disalahartikan sebagai dokter. Jika dokter manusia masuk ke sesi, tampilkan identitas dan lisensinya sebagai participant berbeda.

### 8.6 Conversation canvas dan message anatomy

#### Pesan pengguna

- Rata kanan.
- Bubble memakai brand.primary dengan teks putih.
- Menampilkan waktu dan state sending/sent/failed.
- Failed bubble menyediakan Retry dan Edit.
- Quick-emoji message tetap menampilkan teks lengkap, bukan emoji saja.

#### Pesan HavenCare AI

- Rata kiri bersama avatar HavenCare AI.
- Bubble memakai surface.canvas, border.subtle, text.primary.
- Header kecil menampilkan HavenCare AI dan label Teman refleksi, bukan Doctor.
- Footer action: Dengarkan, Salin, Membantu/Tidak membantu, Report.
- Streaming memperbarui area yang sama dan menyediakan Stop generating.
- Thinking state: HavenCare AI sedang menyiapkan respons… dengan loader HavenCare yang tidak berkedip cepat.

#### Inline widget yang diizinkan

- latihan grounding;
- breathing timer;
- appointment/rujukan dokter;
- summary check-in dengan persetujuan;
- CTA assessment;
- Crisis Support Panel.

DILARANG menampilkan card obat, product recommendation, diagnosis, skor kesehatan palsu, atau data wearable tanpa integrasi dan consent yang sah.

### 8.7 Composer web terpadu

~~~text
┌──────────────────────────────────────────────────────────────────────────┐
│ [＋] [🙂 Cepat] [♡ Ringkasan]  Ceritakan apa yang kamu rasakan… [🎙] [➤] │
└──────────────────────────────────────────────────────────────────────────┘
~~~

Penempatan:

- Composer berada di bawah conversation canvas dan sticky terhadap area chat, bukan viewport seluruh website.
- Quick action berada di kiri input; mic dan send berada di kanan.
- Textarea auto-grow 1–6 baris dan tetap dapat dikirim dengan tombol.
- Enter mengirim; Shift+Enter membuat baris baru. Pengaturan ini dijelaskan dan dapat diubah untuk accessibility.
- Attachment menu hanya menampilkan jenis file yang benar-benar didukung.
- Tombol Ringkasan adalah satu-satunya entry utama Wellbeing Overview dari composer.
- Pada viewport sempit, label boleh disederhanakan menjadi icon dengan accessible name; tombol tetap minimum 48 × 48 px.

State composer:

- no-session;
- idle;
- focused;
- typing;
- quick-emoji-open;
- overview-open;
- recording-permission;
- recording;
- transcribing;
- sending;
- streaming-disabled;
- offline;
- failed/retry;
- crisis-interrupted.

Quick Emoji Bar dan Wellbeing Overview bersifat mutually exclusive: membuka satu menutup yang lain agar composer tidak tertutup dua popover.

### 8.8 Quick Emoji Bar — auto-type dan auto-send

Tujuan Quick Emoji Bar adalah membantu Gen Z, lansia, pengguna cemas, atau pengguna yang tidak mampu mengetik panjang untuk menyampaikan kondisi dalam satu tindakan.

Popover dibuka dari tombol 🙂 Cepat di composer dan muncul tepat di atas tombol tersebut.

~~~text
┌────────────────────────────────────────────────────────────────────┐
│ Bagaimana perasaanmu?                                              │
│ [😊 Cukup baik] [😐 Datar] [😟 Cemas] [😔 Sedih]                  │
│ [😫 Kewalahan] [😴 Lelah] [🫂 Temani aku] [🆘 Bantuan sekarang]  │
│ Klik akan langsung mengirim kalimat yang tertulis.                 │
└────────────────────────────────────────────────────────────────────┘
~~~

Mapping normatif:

| Emoji | Label | Pesan yang otomatis diketik dan dikirim |
|---|---|---|
| 😊 | Cukup baik | Aku merasa cukup baik hari ini dan ingin melakukan refleksi singkat. |
| 😐 | Datar | Aku merasa datar dan sulit menjelaskan apa yang sedang kurasakan. |
| 😟 | Cemas | Aku sedang cemas. Tolong bantu aku menenangkan diri dengan langkah yang sederhana. |
| 😔 | Sedih | Aku merasa sedih dan ingin ditemani untuk memahami perasaanku. |
| 😫 | Kewalahan | Aku merasa kewalahan. Bantu aku memilih satu langkah kecil yang bisa kulakukan sekarang. |
| 😴 | Lelah | Aku lelah dan kurang tidur. Bantu aku melakukan check-in singkat. |
| 🫂 | Temani aku | Aku belum siap menjelaskan semuanya. Tolong temani aku pelan-pelan. |
| 🆘 | Bantuan sekarang | Aku merasa tidak aman dan membutuhkan bantuan sekarang. |

Aturan auto-send:

- Setiap item menampilkan emoji, label pendek, dan preview pesan melalui tooltip/description; pengguna mengetahui apa yang akan dikirim.
- Satu klik/tap langsung membuat user message dengan source quick-emoji dan menjalankan chat.send.
- Tidak ada tahap konfirmasi kedua agar tetap cepat, sesuai tujuan fitur.
- Setelah dipilih, popover menutup, message muncul, focus kembali ke composer, dan aria-live mengumumkan Pesan Cemas dikirim.
- Jika sesi belum aktif, sistem membuat sesi, menampilkan welcome secara ringkas, lalu mengirim setelah sessionId tersedia.
- Jika HavenCare AI sedang streaming, button disabled dengan label Tunggu HavenCare AI selesai; jangan membuat queue tersembunyi.
- Jika offline/gagal, bubble tetap menampilkan teks dengan state Gagal dikirim dan tombol Coba lagi/Hapus.
- 🆘 Bantuan sekarang langsung memunculkan Crisis Override secara lokal sambil mengirim pesan ke pipeline; bantuan tidak menunggu respons model.
- Mapping disimpan pada constants/config terpusat, bukan tersebar dalam JSX.
- Admin boleh memperbarui copy setelah review klinis, tetapi analytics tidak merekam teks pesan.
- Pengguna dapat menonaktifkan Kirim cepat satu ketuk di profil. Jika nonaktif, klik hanya mengisi composer dan memerlukan tombol Kirim.

Accessibility:

- Popover dapat dibuka melalui keyboard dan tidak bergantung pada hover.
- Item menggunakan grid/listbox dengan label teks; emoji bukan satu-satunya informasi.
- Arrow key berpindah antaritem, Enter/Space memilih, Escape menutup.
- Untuk lansia, preferensi text besar mengubah grid menjadi daftar satu kolom dengan kalimat preview terlihat.

### 8.9 Wellbeing Overview popover dari chat bar

Nama UI: Ringkasan Kesejahteraan.

Tombol ♡ Ringkasan berada di composer. Popover di-anchor tepat di atas tombol pada desktop. Pada tablet menjadi side panel dan pada viewport kecil menjadi bottom sheet web yang dapat ditutup, bukan halaman aplikasi baru.

~~~text
┌──────────────────────────────────────────┐
│ Ringkasan Kesejahteraan        [Pin] [×]│
│ Diperbarui hari ini, 09.40               │
├──────────────────────────────────────────┤
│        ╭──────── Mood Arc ────────╮       │
│        │        😟 Cemas          │       │
│        ╰──────────────────────────╯       │
│ [Mood terakhir] [Tidur 3–4 jam]          │
│ [Refleksi hari ini] [Belum ada jadwal]   │
├──────────────────────────────────────────┤
│ [Perbarui check-in] [Gunakan di sesi]    │
└──────────────────────────────────────────┘
~~~

Mood Arc mengadaptasi gauge setengah lingkaran pada referensi, tetapi hanya memvisualisasikan pilihan mood 1–5 terbaru secara kualitatif. Arc menampilkan emoji dan label, bukan Energy Score, persentase, atau skor kesehatan gabungan. Segmen memakai warna ekspresi assessment; container dan action tetap memakai base color HavenCare.

Sumber data:

| Data | Sumber |
|---|---|
| Mood terakhir | Wellness Assessment langkah 1 atau dashboard mood check-in |
| Kualitas tidur | Wellness Assessment langkah 2 |
| Tema refleksi | Ringkasan yang diizinkan dari langkah 3; tidak menampilkan raw text |
| Jadwal konsultasi | Appointment API |
| Update time | Timestamp sumber paling baru |

Aturan integritas:

- Jangan menampilkan Energy Score, heart rate, stress number, persentase wellbeing, atau data device bila sumbernya tidak tersedia.
- Nilai parsial ditampilkan sebagai Belum diisi, bukan angka fallback.
- Data stale menampilkan label Perlu diperbarui.
- Tombol Gunakan di sesi meminta persetujuan eksplisit sebelum menambahkan ringkasan ke context HavenCare AI.
- Membuka overview tidak otomatis membagikan data ke model.
- Raw expression text tidak ditampilkan di popover.
- Pin hanya tersedia desktop dan memindahkan card ke Context Optional; unpin mengembalikan akses melalui composer.
- Popover menutup dengan Escape, click outside, atau tombol close dan mengembalikan fokus ke trigger.

State:

- loading skeleton;
- no-data dengan CTA Mulai check-in;
- partial data;
- complete;
- stale;
- error/retry;
- consent-to-use;
- pinned/unpinned.

### 8.10 Starter prompts dan respons cepat

Setelah welcome dialog ditutup tanpa memilih emoji, conversation empty state menampilkan maksimal empat prompt:

- Aku sedang cemas dan banyak pikiran.
- Aku lelah mental setelah menjalani hari ini.
- Bantu aku melakukan latihan grounding.
- Aku ingin mencari bantuan profesional.

Prompt chip mengisi composer terlebih dahulu sehingga pengguna dapat mengedit, berbeda dari Quick Emoji yang auto-send. Label perilaku ini harus terlihat: chip menggunakan Isi pesan, Quick Emoji menggunakan Kirim cepat.

### 8.11 Voice input dan text-to-speech

Voice input:

1. Permission request menjelaskan alasan microphone.
2. Recording menampilkan timer, waveform sederhana, pause, selesai, dan batal.
3. Preview memungkinkan dengarkan/rekam ulang.
4. Transcribing memasukkan teks ke composer untuk ditinjau sebelum dikirim.
5. Audio mentah tidak disimpan permanen tanpa consent.

TTS:

- Pesan HavenCare AI menyediakan Dengarkan, Pause, dan Stop.
- Audio tidak auto-play.
- Hanya satu pesan diputar pada satu waktu.
- Speed selector opsional 0.75×, 1×, 1.25× untuk accessibility.
- Jika speech service gagal, teks tetap tersedia tanpa mengganggu percakapan.

### 8.12 Guardrail dan respons krisis

~~~mermaid
flowchart TD
    I[Typed / voice / quick emoji] --> M[User message]
    M --> L0[Sanitasi]
    L0 --> G[Guardrail dan konteks]
    G -->|Normal| O[Respons HavenCare AI]
    G -->|Pola keamanan| B[Respons aman dan pembatasan]
    G -->|Sinyal krisis| C[Crisis Override]
    O --> W[Widget atau next action bila relevan]
    B --> R[Arahkan kembali ke dukungan]
    C --> H[Hotline / IGD / orang tepercaya]
~~~

- Semua sumber input melalui pipeline yang sama.
- Quick Emoji tidak melewati guardrail.
- Bantuan sekarang memicu Crisis Override segera sebelum network round-trip.
- HavenCare AI tetap hangat saat membatasi permintaan dan tidak memusatkan copy pada istilah L0–L3.
- Referensi produk obat pada gambar tidak boleh diimplementasikan.

### 8.13 Session drawer dan history

- Sesi diurutkan berdasarkan aktivitas terbaru.
- Session card menampilkan judul aman, timestamp, dan status; bukan preview plaintext sensitif.
- New session button tersedia di bagian atas.
- Search history hanya mencari metadata yang diizinkan kebijakan.
- Rename memakai judul netral dan divalidasi.
- Hapus sesi meminta konfirmasi dan menjelaskan apakah dapat dipulihkan.
- Jika zero-plaintext membatasi history, UI menjelaskan data apa yang tersedia dan masa simpannya.
- Opening existing session tidak memunculkan welcome dialog lagi.

### 8.14 Micro-interaction dan motion

| Interaksi | Motion |
|---|---|
| Welcome dialog | Fade + scale 0.98→1 selama 220–280 ms |
| HavenCare AI visual | Satu kali soft glow saat masuk; tanpa loop |
| New message | Fade/translate maksimum 6 px selama 160–220 ms |
| Quick Emoji popover | Fade + lift 4 px selama 140–180 ms |
| Emoji hover/focus | Scale maksimum 1.06; tidak bouncing terus |
| Overview popover | Fade + scale 0.98→1 selama 160–200 ms |
| Overview pin | Crossfade ke context panel 180–240 ms |
| Thinking | Rotasi/pulse lambat dan dihentikan oleh reduced motion |

Layout tidak boleh bergeser saat popover dibuka. Popover menggunakan portal/layer yang memiliki collision handling agar tidak keluar viewport.

### 8.15 Data contract minimum

~~~text
ChatSessionUI
  sessionId, welcomeSeenAt, overviewPinned, createdAt

QuickEmotion
  id, emoji, label, message, safetyAction, enabled

WellbeingOverview
  mood, sleepQuality, reflectionTheme, nextAppointment
  sourceTimestamps, freshness, consentedForSession

ChatMessageUI
  id, role, content, inputSource
  deliveryStatus, audioStatus, createdAt
~~~

inputSource bernilai typed, voice, starter-prompt, atau quick-emoji. Field ini boleh dipakai untuk UX analytics tanpa menyimpan content.

Hook/domain minimum:

- useChatSession untuk create/open/rename/delete;
- useChatMessages untuk pagination, send, stream, retry, stop;
- useChatWelcome untuk welcomeSeen state dan preferredName;
- useQuickEmotion untuk mapping serta auto-send;
- useWellbeingOverview untuk load, freshness, consent, pin/unpin;
- useVoiceInput untuk permission, recording, preview, transcript;
- useCrisisSupport untuk immediate local override dan escalation.

### 8.16 Komponen Chat

- ChatWebWorkspace
- ChatHeader
- SessionSidebar
- NewSessionWelcomeDialog
- HavenCareAIIdentityCard
- ConversationCanvas
- UserMessageBubble
- HavenCareAIMessageBubble
- MessageActionBar
- ChatComposer
- ComposerActionBar
- QuickEmotionTrigger
- QuickEmotionPopover
- WellbeingOverviewTrigger
- WellbeingOverviewPopover
- WellbeingOverviewCard
- StarterPromptChips
- VoiceRecorder
- ListenControl
- ChatCrisisPanel

Presentation components tidak melakukan fetch langsung. Welcome, overview, quick emotion, dan composer memakai state domain yang sama agar tidak mengirim pesan ganda.

### 8.17 Accessibility dan acceptance Chat

- [ ] Sesi baru menampilkan welcome dialog sekali dan menyapa preferredName akun yang login.
- [ ] Fallback nama Sahabat bekerja bila preferredName kosong.
- [ ] Dialog dapat ditutup dengan keyboard dan fokus kembali dengan benar.
- [ ] Chat desktop, tablet, dan mobile tetap berupa responsive web tanpa chrome aplikasi.
- [ ] Quick Emoji menampilkan exact message, auto-send sekali, dan memiliki failed/retry state.
- [ ] Emoji Bantuan sekarang membuka Crisis Override tanpa menunggu AI.
- [ ] Lansia dapat memakai quick action dalam mode text besar tanpa icon-only control.
- [ ] Wellbeing Overview hanya menampilkan data bersumber, timestamp, empty/partial/stale/error state.
- [ ] Data overview tidak masuk context HavenCare AI tanpa consent.
- [ ] Popover emoji dan overview tidak terbuka bersamaan.
- [ ] Voice/TTS mempunyai state izin, loading, pause, cancel, error, dan fallback teks.
- [ ] Tidak ada diagnosis, obat, produk, skor kesehatan palsu, atau model branding pada UI.
- [ ] Keyboard, screen reader, zoom 200%, high contrast, dan reduced motion lulus pengujian.
- [ ] Semua send source melewati guardrail dan tidak merekam plaintext pada analytics.

---

## 9. Crisis Override Global

Crisis Override dapat dipicu dari chat, assessment, mood check-in, atau komunitas. Ini adalah layer pengalaman global, bukan card dekoratif.

### 9.1 Perilaku

1. Hentikan alur normal yang dapat menambah beban kognitif.
2. Tampilkan pengakuan singkat dan tidak menghakimi.
3. Tanyakan apakah pengguna berada dalam bahaya langsung hanya jika sesuai protokol yang telah divalidasi klinisi.
4. Tampilkan kontak darurat resmi, opsi menuju IGD, dan ajakan menghubungi orang tepercaya.
5. Sediakan tindakan sekali tekan untuk menelepon pada perangkat yang mendukung.
6. Pertahankan konteks dan jangan mengunci pengguna dari bantuan.
7. Catat event keselamatan tanpa menyimpan plaintext yang dilarang.

### 9.2 Copy minimum

> Keselamatanmu yang utama. Jika kamu mungkin menyakiti diri atau sedang dalam bahaya, segera hubungi layanan darurat atau datang ke IGD terdekat. Jika memungkinkan, hubungi seseorang yang kamu percaya dan jangan hadapi ini sendirian.

Nomor hotline, ekstensi, dan ketersediaannya wajib diverifikasi sebelum rilis dan disimpan dalam konfigurasi konten, bukan disebar sebagai string hardcoded. Jika nomor belum terverifikasi, prioritaskan 112/119 sesuai konfigurasi resmi yang berlaku dan instruksi menuju IGD terdekat.

### 9.3 Larangan

- Jangan mengandalkan modal yang mudah tertutup sebagai satu-satunya bantuan.
- Jangan menggunakan animasi, confetti, atau gamification.
- Jangan memberi diagnosis atau jaminan bahwa semuanya akan baik-baik saja.
- Jangan mengalihkan ke komunitas sebagai respons utama krisis.

---

## 10. Flow Wellness Assessment Interaktif — Tepat 3 Halaman

### 10.1 Nama, tujuan, dan batas

Nama UI: Wellness Assessment.

Subcopy:

> Luangkan waktu sejenak untuk mengenali suasana hati, kualitas tidur, dan hal yang sedang memenuhi pikiranmu.

Assessment ini tepat terdiri dari tiga halaman:

1. Mood Wheel — memilih kondisi emosi melalui roda ekspresi.
2. Sleep Quality — menentukan kualitas dan durasi tidur melalui slider.
3. Expression Analysis — menulis atau menyuarakan hal yang sedang dirasakan.

Assessment ini adalah wellness check-in, bukan PHQ-9, GAD-7, alat diagnosis, atau pengganti pemeriksaan klinis. Istilah skor klinis, severity PHQ/GAD, atau persentase kesehatan mental DILARANG muncul pada flow ini. Jika skrining klinis baku dibutuhkan di masa depan, tempatkan pada flow dan kontrak data terpisah.

### 10.2 Prinsip adaptasi dari referensi

Elemen yang diambil dari gambar:

- satu pertanyaan utama per halaman;
- progress yang sangat jelas;
- ekspresi berukuran besar sebagai feedback pilihan;
- Mood Wheel berbentuk setengah lingkaran;
- slider kualitas tidur dengan label dan emoji;
- area menulis besar, counter karakter, serta opsi suara;
- whitespace luas dan distraksi minimum.

Elemen yang tidak diambil:

- frame dan chrome ponsel;
- status bar, dynamic island, home indicator, dan rasio layar aplikasi;
- warna cokelat/cream sebagai base UI;
- nama atau identitas Freud;
- contoh kalimat self-harm sebagai placeholder/dekorasi;
- tombol bawah yang menempel seperti native mobile jika menghalangi viewport web.

### 10.3 Web assessment shell

Semua halaman assessment memakai shell yang sama agar pengguna tidak merasa berpindah produk.

~~~text
┌──────────────────────────────────────────────────────────────────────────┐
│ HavenCare / Wellness Assessment                  Langkah 1 dari 3   Simpan │
│ [Kembali]  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                     WEB CONTENT CONTAINER                                │
│                     max-width: 1180 px                                   │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ Keluar dan lanjutkan nanti                [Sebelumnya] [Lanjutkan →]     │
└──────────────────────────────────────────────────────────────────────────┘
~~~

Aturan shell desktop:

- Area assessment berada di dalam AppShell web, bukan full-screen native app.
- Container maksimum 1180 px dan terpusat.
- Tinggi konten minimum mengikuti viewport setelah header, tetapi halaman tetap dapat scroll secara normal.
- Header assessment memuat breadcrumb/nama, progress Langkah X dari 3, dan aksi Simpan & keluar bila persistence tersedia.
- Progress bar memakai brand.primary; state selesai memakai brand.secondary.
- Footer action berada di akhir content flow. Sticky footer hanya boleh digunakan jika tidak menutup input atau bantuan krisis.
- Tombol Kembali browser harus mengembalikan halaman sebelumnya tanpa menghilangkan jawaban yang telah diisi.

Aturan responsive web:

| Viewport | Layout |
|---|---|
| ≥ 1024 px | Dua kolom kontekstual atau komposisi lebar; wheel/slider tidak dipaksa sebesar layar |
| 768–1023 px | Satu kolom lebar dengan kontrol utama terpusat |
| 320–767 px | Satu kolom responsive web; bukan replika aplikasi, tetap memakai header website |

### 10.4 State machine tiga halaman

~~~mermaid
flowchart LR
    A[Masuk /assessments] --> P1[1/3 Mood Wheel]
    P1 -->|Mood dipilih| P2[2/3 Sleep Quality]
    P2 -->|Level dipilih| P3[3/3 Expression Analysis]
    P3 -->|Teks atau voice valid| S[Analyzing pada halaman 3]
    S -->|Aman| R[Ringkasan inline pada halaman 3]
    S -->|Sinyal krisis| C[Crisis Override]
    R --> D[Dashboard atau Bicara dengan HavenCare AI]
    P2 -->|Kembali| P1
    P3 -->|Kembali| P2
~~~

Tidak ada halaman hasil keempat. State analyzing dan ringkasan akhir menggantikan panel konten di halaman 3/3 sehingga progress tetap tepat tiga halaman.

### 10.5 Halaman 1/3 — Interactive Mood Wheel

Pertanyaan utama:

> Bagaimana kamu menggambarkan suasana hatimu saat ini?

#### Layout desktop Mood Wheel

~~~text
┌───────────────────────────────┬──────────────────────────────────────────┐
│ LANGKAH 1 DARI 3             │ PILIH SUASANA HATIMU                     │
│                               │                                          │
│ Bagaimana suasana hatimu?     │               🙂                         │
│                               │          Saya merasa baik                │
│ Geser roda, klik warna,       │                                          │
│ atau gunakan tombol panah.    │        [Mood Wheel setengah lingkaran]   │
│                               │    😣       🙁       😐       🙂       😄 │
│ Pilihan: Baik                 │                  ▲ marker                │
└───────────────────────────────┴──────────────────────────────────────────┘
~~~

- Grid desktop: 4/12 kolom untuk judul/instruksi dan 8/12 kolom untuk interaksi.
- Ekspresi terpilih tampil besar di atas wheel; label teks wajib selalu terlihat.
- Wheel berbentuk setengah lingkaran dan memiliki marker tetap. Wheel bergerak menuju marker, bukan marker yang bergerak acak.
- Wheel bukan permainan keberuntungan. DILARANG memilih mood secara random atau menggunakan momentum spin yang membuat hasil tidak dapat dikontrol.

#### Pilihan mood

| Nilai | Label UI | Warna ekspresi | Emoji |
|---:|---|---|---|
| 1 | Sangat berat | assessment.emotion.intense | 😣 |
| 2 | Sedih atau cemas | assessment.emotion.low | 🙁 |
| 3 | Netral | assessment.emotion.neutral | 😐 |
| 4 | Baik | assessment.emotion.positive | 🙂 |
| 5 | Sangat baik | assessment.emotion.positive | 😄 |

#### Interaksi Mood Wheel

- Drag horizontal pada wheel mengubah pilihan per satu step.
- Klik segmen atau emoji memilih nilai secara langsung.
- Arrow Left/Right mengubah pilihan.
- Home memilih nilai pertama; End memilih nilai terakhir.
- Setiap perubahan mengumumkan label melalui live region yang tidak mengganggu.
- Wheel wajib dibangun dari elemen DOM/radio yang dapat diakses; visual SVG boleh menjadi presentasi. Jangan memakai canvas tanpa fallback semantik.
- Animasi snap 180–260 ms; pada reduced motion pilihan berpindah tanpa rotasi.
- Tombol Lanjutkan disabled sampai pilihan eksplisit dibuat. Jangan memberi default palsu yang tersimpan tanpa interaksi.

### 10.6 Halaman 2/3 — Sleep Quality Slider

Pertanyaan utama:

> Bagaimana kualitas tidurmu belakangan ini?

Helper:

> Pilih kondisi yang paling mendekati pengalaman tidurmu, bukan hanya satu malam terbaik atau terburuk.

#### Layout desktop Sleep Quality

~~~text
┌───────────────────────────────┬──────────────────────────────────────────┐
│ LANGKAH 2 DARI 3             │ KUALITAS TIDUR                           │
│                               │                                          │
│ Bagaimana kualitas tidurmu?   │ Excellent · 7–9 jam                 😄   │
│                               │ Good      · 6–7 jam                 🙂   │
│ Pilihan saat ini:             │ Fair      · sekitar 5 jam           😐   │
│ Poor · 3–4 jam                │           │ slider │               🙁   │
│                               │ Worst     · kurang dari 3 jam        😣   │
└───────────────────────────────┴──────────────────────────────────────────┘
~~~

- Grid desktop: 5/12 kolom untuk pertanyaan/ringkasan dan 7/12 kolom untuk slider card.
- Slider utama tetap vertikal seperti referensi karena level kualitas dibaca dari atas ke bawah.
- Tinggi rail 360–420 px pada desktop dan maksimum 60vh pada viewport pendek.
- Track tidak aktif memakai border.subtle; bagian aktif memakai brand.primary atau warna ekspresi terpilih secara terbatas.
- Thumb minimum 48 × 48 px dan memuat icon drag/refresh sederhana; bukan tombol randomize.

#### Level sleep quality

| Nilai | Label UI | Acuan durasi | Emoji | Warna |
|---:|---|---|---|---|
| 5 | Excellent | 7–9 jam | 😄 | assessment.emotion.positive |
| 4 | Good | 6–7 jam | 🙂 | assessment.emotion.neutral |
| 3 | Fair | sekitar 5 jam | 😐 | assessment.emotion.fair |
| 2 | Poor | 3–4 jam | 🙁 | assessment.emotion.intense |
| 1 | Worst | kurang dari 3 jam | 😣 | assessment.emotion.exhausted |

Durasi hanya membantu pengguna menginterpretasi pilihan dan bukan diagnosis kualitas tidur. Jika kualitas subjektif berbeda dari jumlah jam, pengguna memilih pengalaman subjektif; data durasi boleh disimpan sebagai band terpisah.

#### Interaksi Sleep Quality

- Drag thumb, klik pada tick, klik label, atau gunakan Arrow Up/Down.
- Setiap tick memiliki label, rentang jam, emoji, dan nilai programatik.
- Nilai terpilih diberi bold, background soft mint, serta icon check; bukan warna saja.
- Pada mobile web, slider boleh berubah menjadi daftar kartu vertikal lima opsi jika vertical range tidak nyaman disentuh. Makna dan data harus tetap sama.
- Tombol Lanjutkan disabled sampai pengguna memilih level.

### 10.7 Halaman 3/3 — Expression Analysis

Judul:

> Ceritakan apa yang sedang memenuhi pikiranmu.

Subcopy:

> Kamu dapat menulis atau menggunakan suara. HavenCare AI akan membantu merangkum pola yang kamu ungkapkan tanpa memberikan diagnosis.

Expression Analysis pada flow ini berarti analisis narasi teks atau transkrip suara. Fitur ini bukan analisis wajah, kamera, mikro-ekspresi, emosi biometrik, atau pendeteksian kondisi mental dari wajah.

#### Layout desktop — state editing

~~~text
┌──────────────────────────────────────┬───────────────────────────────────┐
│ LANGKAH 3 DARI 3                    │ SEBELUM MELANJUTKAN               │
│                                      │                                   │
│ Ceritakan isi pikiranmu              │ • HavenCare AI bukan dokter                │
│ ┌──────────────────────────────────┐ │ • Jangan tulis identitas sensitif │
│ │ Mulai menulis di sini…           │ │ • Bantuan krisis selalu tersedia │
│ │                                  │ │                                   │
│ │                                  │ │ [Bicara dengan seseorang sekarang]│
│ └─────────────────────────────0/250┘ │                                   │
│ [🎙 Gunakan suara] [Hapus]            │                                   │
└──────────────────────────────────────┴───────────────────────────────────┘
~~~

- Grid desktop: 8/12 kolom untuk composer dan 4/12 kolom untuk privacy/safety context.
- Textarea minimum 240 px tinggi, maksimum 250 karakter untuk versi pertama, dan dapat diperbesar oleh pengguna.
- Placeholder harus netral. DILARANG menampilkan contoh self-harm, ancaman, diagnosis, atau makian seperti pada gambar referensi.
- Counter karakter selalu terlihat dan diumumkan secara wajar menjelang batas.
- Gunakan suara adalah aksi secondary memakai brand.secondary; CTA Analisis Refleksi memakai brand.primary.
- Jika voice belum didukung backend/browser, sembunyikan tombol; jangan tampilkan kontrol dekoratif.

#### Voice input state

1. Permission request menjelaskan alasan akses microphone.
2. Recording menampilkan timer, waveform sederhana, Pause, Selesai, dan Batal.
3. Preview memungkinkan putar ulang atau rekam ulang.
4. Transcribing menampilkan progress dan menjaga audio sampai proses selesai/dibatalkan.
5. Hasil transkrip masuk ke textarea dan dapat diedit sebelum analisis.
6. Audio mentah tidak disimpan secara permanen tanpa consent terpisah.

#### State analyzing dan result tetap pada halaman 3/3

~~~text
Editing → Checking safety → Analyzing → Reflection summary
                    └───────────────→ Crisis Override bila dibutuhkan
~~~

Ringkasan akhir menampilkan:

- Mood yang dipilih.
- Sleep quality yang dipilih.
- Tema refleksi dari narasi dalam bahasa tentatif, misalnya tampaknya kamu banyak memikirkan pekerjaan.
- Maksimum tiga next actions: Bicara dengan HavenCare AI, lakukan grounding, atau cari bantuan profesional.
- Disclaimer bahwa hasil bukan diagnosis.
- CTA utama kembali ke dashboard atau lanjut bicara dengan HavenCare AI.

Jangan menampilkan confidence palsu, diagnosis, skor kesehatan mental, persentase, atau istilah patologis yang tidak divalidasi klinisi.

### 10.8 Crisis safety pada Expression Analysis

Text dan transkrip menjalani pemeriksaan keselamatan saat input selesai dan saat submit. Jika terdeteksi sinyal self-harm atau bahaya langsung:

- Crisis Override muncul di area utama, bukan toast.
- Draft pengguna tetap aman dan tidak hilang.
- CTA bantuan tampil sebelum ringkasan biasa.
- Sistem tidak menyensor kata sehingga pengguna kehilangan konteksnya sendiri; highlight seperti pada gambar referensi hanya boleh digunakan untuk menjelaskan alasan keselamatan secara hati-hati dan tidak menampilkan ulang teks sensitif lebih dari yang diperlukan.
- Pengguna tetap dapat mengakses hotline/IGD/orang tepercaya tanpa harus menyelesaikan assessment.

### 10.9 Data contract minimum

~~~text
assessmentVersion: wellness-v1
status: draft | analyzing | completed | crisis-interrupted
currentStep: 1 | 2 | 3
mood: value + label + selectedAt
sleep: value + qualityLabel + durationBand + selectedAt
expression: inputMode + textOrTranscript + characterCount
safety: decision + evaluatedAt + escalationShown
createdAt / updatedAt / completedAt
~~~

- Draft disimpan per langkah hanya setelah pilihan eksplisit.
- currentStep dipakai untuk melanjutkan sesi tanpa menambah halaman baru.
- expression.textOrTranscript mengikuti kebijakan zero-plaintext. Bila backend tidak mengizinkan penyimpanan plaintext, teks hanya diproses sementara dan record persisten menyimpan ringkasan/fitur yang diizinkan.
- Analytics hanya mencatat step viewed, option selected, continue, back, abandon, voice permission, dan completion tanpa merekam isi narasi.

### 10.10 Accessibility dan interaction acceptance

- Mood Wheel mempunyai radiogroup semantik dan dapat diselesaikan tanpa drag.
- Sleep slider mempunyai input range/listbox semantik dan alternatif klik.
- Emoji selalu disertai label teks.
- Warna bukan satu-satunya penanda.
- Progress dibaca sebagai Langkah X dari 3.
- Fokus berpindah ke heading utama setiap navigasi langkah.
- Error ditempatkan di dekat kontrol dan diumumkan.
- Back/refresh mempertahankan draft yang diizinkan.
- Enter tidak boleh mengirim textarea tanpa sengaja; submit dilakukan lewat CTA atau shortcut yang dijelaskan.
- Layout tetap usable pada zoom 200% dan viewport tinggi pendek.
- Semua animasi menghormati prefers-reduced-motion.

### 10.11 Komponen assessment

- AssessmentWebShell
- AssessmentProgress — selalu 1/3, 2/3, atau 3/3
- MoodWheel
- MoodExpressionPreview
- SleepQualitySlider
- SleepQualityOption
- ExpressionComposer
- VoiceReflectionRecorder
- ReflectionAnalysisState
- ReflectionSummary
- AssessmentCrisisPanel

Komponen visual menerima value dan event dari useWellnessAssessment. Hook menangani draft, navigasi, submit, retry, dan response API. Safety decision tidak ditentukan hanya oleh komponen UI.

---

## 11. Community Web — Social Micro-Support ala X/Tweet

### 11.1 Tujuan dan batas halaman

Rute /community adalah satu-satunya cakupan revisi ini. Tampilan Home pada sisi kiri gambar referensi tidak dibuat sebagai halaman Home baru. Anatomi feed ala X/Tweet dari layar tersebut hanya diadaptasi menjadi timeline di dalam halaman Community.

Tujuan Community:

- membantu pengguna berbagi pengalaman psikologis secara aman;
- mempertemukan pengguna dengan komunitas berdasarkan kebutuhan, fase hidup, atau minat pemulihan;
- mendukung percakapan singkat melalui post, komentar, reply, dan reaction suportif;
- menyediakan pengalaman yang mudah dipahami Gen Z sekaligus nyaman bagi pengguna lansia;
- mengarahkan situasi klinis atau krisis ke bantuan privat, bukan mengandalkan jawaban publik.

Community bukan pengganti terapi, layanan gawat darurat, atau tempat diagnosis crowdsourcing. Dokter/psikolog yang terverifikasi boleh berbagi edukasi, tetapi tidak boleh memberikan diagnosis individual di thread publik.

### 11.2 Prinsip adaptasi visual dari referensi

Elemen yang WAJIB diadopsi sedekat mungkin:

- header kuat dengan avatar, judul Community, search, dan aksi buat/join;
- tab timeline berbentuk segmented control;
- post card putih dengan avatar, nama/alias, waktu, menu tiga titik, teks, media, reaction, comment count, share/save;
- reaction popover berisi emoji berwarna;
- bagian Komunitasku dengan card visual;
- daftar Recommended Community dengan jumlah anggota dan tombol Join;
- rounded card, shadow lembut, spacing lega, serta feedback interaksi cepat;
- pagination/infinite loading yang terasa ringan.

Elemen yang DILARANG disalin:

- frame ponsel, status bar, home indicator, dan floating bottom navigation aplikasi;
- tombol Home baru atau duplikasi rute /dashboard;
- warna biru referensi sebagai brand utama;
- metrik engagement palsu;
- feed umum di luar konteks kesehatan mental dan dukungan psikologis;
- pola addictive seperti autoplay, endless motion, streak, atau ranking popularitas pengguna.

Base color tetap memakai HavenCare Glass. Warna biru active tab dan floating plus pada referensi diganti brand.primary Calm Turquoise. Warna reaction/emoji tetap memakai palet domain community pada Bab 4.

### 11.3 Fokus pengguna

#### Gen Z

- Scannable: copy ringkas, hashtag/topik, media opsional, dan reaction cepat.
- Transparan: status moderation, alasan konten ditahan, dan kendali privasi terlihat.
- Ekspresif: emoji/reaction bervariasi tanpa mengubah tone menjadi permainan.
- Cepat: optimistic UI, draft autosave, search responsif, dan skeleton yang stabil.
- Aman: pseudonym, block/mute, content warning, report, serta batas kontak privat.

#### Pengguna lansia

- Font default minimum 16 px pada feed dan kontrol peningkatan ukuran teks.
- Target sentuh minimum 48 × 48 px untuk aksi utama.
- Label teks menyertai icon; tidak ada fitur yang hanya muncul lewat hover.
- Kalimat dan nama tab menggunakan Bahasa Indonesia sederhana.
- Contrast tinggi, divider jelas, serta jarak antaraksi mencegah salah tekan.
- Mode Fokus menyembunyikan metrik nonesensial dan menampilkan satu kolom lebih tenang.
- Proses Join, Post, dan Report selalu memberi konfirmasi yang mudah dibatalkan.

Keduanya memperoleh fitur yang sama. Sistem tidak membuat UI terpisah berdasarkan asumsi usia; preferensi kenyamanan diatur melalui profil/accessibility.

### 11.4 Layout web desktop

Pada viewport besar, halaman memakai satu shell web dengan tiga kolom. Ini menggabungkan timeline pada layar kiri referensi dan discovery community pada layar kanan referensi tanpa membuat dua aplikasi terpisah.

~~~text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Patient Header / HavenCare                                              Bantuan · Profil   │
├───────────────────┬──────────────────────────────────────────┬─────────────────────────┤
│ COMMUNITY NAV     │ COMMUNITY TIMELINE                       │ DISCOVERY               │
│                   │                                          │                         │
│ Komunitas         │ Komunitas                     [Search]   │ Komunitasku      Lihat  │
│ Untukmu           │ [Terbaik] [Hangat] [Terbaru] [Populer]  │ [Card] [Card]           │
│ Tersimpan         │                                          │                         │
│                   │ [Composer: Bagikan ceritamu…]            │ Rekomendasi             │
│ KOMUNITASKU       │                                          │ [Group + Join]          │
│ • Ruang Gen Z     │ [Post card ala tweet]                    │ [Group + Join]          │
│ • Teman Senja     │ [Post card ala tweet]                    │                         │
│ • Tidur Lebih Baik│ [Post card ala tweet]                    │ Dukungan & aturan       │
│                   │                                          │ [Safety card]           │
│ [Buat komunitas]  │ [Load more / next cursor]                │                         │
└───────────────────┴──────────────────────────────────────────┴─────────────────────────┘
~~~

Spesifikasi grid:

| Viewport | Struktur |
|---|---|
| ≥ 1280 px | 240 px navigation + minmax(560 px, 680 px) timeline + 320 px discovery |
| 1024–1279 px | 72 px icon rail + fluid timeline + 300 px discovery |
| 768–1023 px | Timeline utama + discovery drawer; community nav menjadi dropdown/drawer |
| 320–767 px | Satu kolom responsive web; search/filter menjadi sheet, discovery berada setelah feed |

- Max-width keseluruhan 1440 px dan terpusat.
- Timeline memiliki border kiri/kanan halus, bukan kartu raksasa mengambang.
- Kolom navigation dan discovery boleh sticky di bawah patient header.
- Timeline tetap scroll document normal; hindari tiga scroll container vertikal yang bersaing.
- Pada mobile web, gunakan patient navigation yang sudah ditetapkan. Jangan menambahkan bottom bar dengan Home/Community/Plus/Message seperti referensi.

### 11.5 Header Community

Header timeline memuat:

- avatar/pseudonym pengguna;
- heading Komunitas;
- search field desktop atau search button pada viewport kecil;
- tombol Buat post;
- tombol Bantuan/Aturan dalam overflow jika ruang terbatas.

Perilaku:

- Header sticky hanya di area timeline dan tidak menutupi focus target.
- Search memiliki label Cari komunitas, topik, atau post.
- Tombol Buat post membuka composer modal pada viewport kecil dan fokus ke inline composer pada desktop.
- Icon memiliki label; avatar tidak menjadi satu-satunya entry profil.

### 11.6 Community navigation panel

Urutan menu:

1. Untukmu — feed personal berdasarkan community yang diikuti dan topik pilihan.
2. Terbaru — urutan waktu, tanpa ranking tersembunyi.
3. Tersimpan — post yang dibookmark pengguna.
4. Komunitasku — daftar community yang telah diikuti.
5. Jelajahi — semua community dan rekomendasi.

Community aktif memakai background surface.mint, text.primary, left indicator brand.primary, dan font semibold. State tidak aktif tetap kontras. Panel menyediakan Buat komunitas hanya jika permission/fitur backend tersedia; jika tidak, aksi tersebut disembunyikan.

### 11.7 Tabs timeline

Tab mengikuti bentuk segmented control pada gambar:

| Tab | Urutan data |
|---|---|
| Terbaik | Konten relevan dan aman berdasarkan kualitas, bukan sekadar reaction count |
| Hangat | Diskusi dengan aktivitas naik dalam waktu terbatas |
| Terbaru | Waktu terbaru tanpa ranking |
| Populer | Engagement terverifikasi dengan decay waktu |

- Tab aktif menggunakan brand.primary, text putih, dan shadow halus.
- Tab dapat dioperasikan dengan arrow key mengikuti pola ARIA tabs.
- Pergantian tab mempertahankan posisi dan cache per tab.
- Loading tab menggunakan skeleton feed; tab tidak dikunci selama request lain gagal.
- Penjelasan ranking tersedia melalui info tooltip/dialog dengan bahasa sederhana.

### 11.8 Composer post

Composer desktop berada di atas timeline seperti compose box pada X/Tweet.

~~~text
┌───────────────────────────────────────────────────────────────┐
│ [Avatar] Bagikan cerita, pengalaman, atau dukunganmu…         │
│                                                               │
│ [Topik] [Foto] [Content warning] [Anonim ✓]        0/500     │
│                                              [Posting]         │
└───────────────────────────────────────────────────────────────┘
~~~

Field dan kontrol:

- Textarea auto-grow, 1–8 baris, maksimum 500 karakter pada MVP.
- Pilih community tujuan sebelum publish.
- Pilih topik maksimal dua.
- Lampiran satu gambar pada MVP dengan preview, alt text, replace, dan remove.
- Toggle Posting sebagai nama samaran menggunakan alias platform; bukan anonim terhadap moderator.
- Content warning opsional dengan kategori duka, panic attack, self-harm mention, atau topik sensitif lain.
- Reminder Jangan bagikan nama lengkap, alamat, nomor telepon, atau data medis pribadi.
- Tombol Posting disabled bila kosong, sedang upload, atau moderation precheck belum selesai.
- Draft autosave lokal harus dienkripsi/diisolasi sesuai kebijakan dan dihapus setelah publish/discard.

State composer:

- collapsed;
- focused;
- editing;
- image compressing/uploading;
- precheck;
- needs revision;
- publishing;
- success;
- failed/retry;
- draft recovered.

### 11.9 Anatomi post ala X/Tweet

Urutan setiap post:

1. Avatar atau avatar alias.
2. Display name/pseudonym.
3. Badge Psikolog Terverifikasi atau Moderator hanya jika data valid.
4. Handle/alias opsional dan timestamp relatif.
5. Overflow menu tiga titik.
6. Nama community dan topik.
7. Isi post dengan expand/collapse jika panjang.
8. Content warning gate bila diperlukan.
9. Media 16:9/4:3 dengan alt text bila ada.
10. Reaction summary.
11. Action row: Balas, Beri dukungan, Simpan, Bagikan.
12. Preview maksimal dua komentar; Lihat semua membuka thread.

~~~text
┌───────────────────────────────────────────────────────────────┐
│ [Avatar] Sahabat Senja  @temansenja · 1 jam             […]  │
│          Teman Senja · #Kesepian                              │
│                                                               │
│ Hari ini saya mencoba berjalan pagi lagi. Langkahnya kecil,   │
│ tetapi membuat saya merasa sedikit lebih ringan.              │
│                                                               │
│ [Media opsional + alt text]                                   │
│                                                               │
│ [reaction avatars] 28 dukungan · 12 balasan                   │
│ [Balas] [Peduli ▾] [Simpan] [Bagikan]                         │
└───────────────────────────────────────────────────────────────┘
~~~

Visual:

- Surface glass.surface, border glass.innerBorder, radius.lg 24 px, shadow sangat halus.
- Antarpost dipisahkan 12–16 px pada desktop dan 8–12 px pada viewport kecil.
- Body text minimum 16 px dan line-height 1.55.
- Link/topik menggunakan brand.primary; jangan mewarnai seluruh teks.
- Media tidak autoplay dan tidak memperlihatkan informasi EXIF.
- Count disingkat hanya setelah 1.000 dan selalu memiliki accessible full value.

### 11.10 Reaction yang suportif

Popover reaction meniru pola emoji mengambang pada referensi, tetapi label disesuaikan dengan konteks psikologis.

| Reaction | Icon | Makna | Warna domain |
|---|---|---|---|
| Dukungan | 👍 | Saya mendengar dan mendukung | community.reaction.support |
| Peduli | 💗 | Saya peduli | community.reaction.care |
| Ikut senang | 😊 | Saya ikut senang | community.reaction.joy |
| Tersentuh | 😮 | Ceritamu menyentuh saya | community.reaction.surprised |
| Pelukan | 🫂 | Pelukan virtual | community.reaction.empathy |
| Ikut prihatin | 😟 | Saya ikut prihatin | community.reaction.concern |

Interaksi:

- Klik tombol Beri dukungan memakai reaction default Dukungan.
- Hover/focus lama atau klik chevron membuka reaction popover.
- Pada touch, popover dibuka melalui tap; fitur tidak boleh bergantung pada long-press.
- Reaction aktif dapat diganti atau dibatalkan.
- Update menggunakan optimistic UI dan rollback bila API gagal.
- Popover melakukan scale/fade 140–180 ms dan menutup dengan Escape/click outside.
- Emoji dapat sedikit naik saat hover, tetapi tidak melakukan loop/bounce terus-menerus.
- Reaction tidak memengaruhi ranking secara langsung tanpa moderation dan time decay.
- DILARANG menyediakan downvote atau reaction yang menyerang penulis.

### 11.11 Thread komentar dan reply

- Klik Balas atau area comment count membuka thread pada panel timeline, modal lebar, atau route state /community?post=id; tidak membuat halaman aplikasi baru.
- Post induk tetap terlihat di atas.
- Komentar memakai avatar, alias, waktu, teks, reaction, Reply, Report, dan menu pemilik.
- MVP mendukung satu tingkat nested reply. Reply lebih dalam diratakan dengan label Membalas @alias agar tidak menyempitkan web layout.
- Urutan default Paling membantu; pengguna dapat memilih Terbaru.
- Psikolog terverifikasi dapat menandai Edukasi umum; copy wajib menegaskan bukan konsultasi pribadi.
- Pengguna dapat edit/hapus komentar miliknya. Deleted state mempertahankan struktur thread tanpa menampilkan isi.
- Mention hanya dapat memilih alias di thread dan tidak membuka data profil sensitif.

### 11.12 Panel Komunitasku

Mengadaptasi My Communities pada gambar menjadi card horizontal/compact web.

Card memuat:

- cover image 16:9 dengan alt text;
- nama community;
- ringkasan satu baris;
- avatar stack maksimum tiga;
- jumlah anggota nyata;
- jumlah post baru sejak kunjungan terakhir;
- status Joined;
- menu mute/leave.

Pada desktop, dua card dapat tampil berdampingan di panel discovery atau sebagai carousel non-autoplay. Carousel memiliki previous/next button dan dapat di-scroll; tidak bergerak sendiri.

### 11.13 Recommended communities

Setiap item rekomendasi memuat thumbnail 64–72 px, nama, deskripsi singkat, jumlah anggota, alasan rekomendasi, dan tombol Join.

Contoh taxonomy:

| Fokus | Community |
|---|---|
| Gen Z | Ruang Aman Gen Z, Overthinking & Kuliah, Burnout Awal Karier, Digital Detox |
| Lansia | Teman Senja, Tidur Nyenyak Lansia, Tetap Aktif & Terhubung, Ruang Duka |
| Lintas generasi | Latihan Tenang, Dukungan Caregiver, Mengelola Kesepian, Relaksasi Kerja |

Rekomendasi tidak boleh dibuat berdasarkan diagnosis tersirat. Gunakan pilihan topik, community yang diikuti, bahasa, serta interaksi eksplisit. Pengguna dapat memilih Jangan rekomendasikan ini.

### 11.14 Join, leave, mute, dan create community

~~~mermaid
flowchart LR
    A[Lihat rekomendasi] --> B[Preview aturan dan deskripsi]
    B --> C{Join policy}
    C -->|Terbuka| D[Joined]
    C -->|Perlu persetujuan| E[Request sent]
    D --> F[Feed community aktif]
    D --> G[Mute notifications]
    D --> H[Leave]
    H --> I[Konfirmasi + Undo singkat]
~~~

- Join harus memperbarui button, member count, navigation, dan Komunitasku.
- Request-only community menampilkan status Menunggu persetujuan.
- Leave meminta konfirmasi bila ada draft atau peran moderator.
- Mute mengatur notifikasi tanpa keluar.
- Create Community hanya tersedia bagi role/permission yang disetujui dan selalu membutuhkan nama, tujuan, audience, rules, discoverability, join policy, serta moderator.

### 11.15 Search dan discovery

Search mencakup community, topik, dan post yang diizinkan tampil.

State:

- initial/recent searches;
- typing dengan debounce 250–350 ms;
- loading;
- grouped results;
- no result dengan saran topik;
- error/retry;
- safe-search filtered.

Filter web:

- Topik;
- Untuk Gen Z / Lansia / Semua usia;
- Bahasa;
- Community yang diikuti;
- Post dengan media;
- Terbaru / Paling relevan.

Filter usia adalah konteks konten, bukan verifikasi umur atau diagnosis. Semua hasil tetap dapat diakses bila sesuai aturan community.

### 11.16 Moderation dan psychological safety

~~~mermaid
flowchart TD
    A[Post atau komentar disubmit] --> B[Sanitasi dan privacy precheck]
    B --> C[Guardrail L0-L1 + moderation rules]
    C -->|Aman| D[Publikasikan]
    C -->|Perlu revisi| E[Tahan sebagai draft + jelaskan bagian]
    C -->|Melanggar| F[Tolak + appeal/report path]
    C -->|Sinyal krisis| G[Crisis Override privat]
    D --> H[Reaction / reply / report]
    H --> I{Report diterima?}
    I -->|Ya| J[Moderation queue + status ke reporter]
    I -->|Tidak| K[Tetap tampil]
~~~

Moderation wajib menangani:

- doxxing dan data pribadi;
- perundungan, pelecehan, ujaran kebencian, dan eksploitasi lansia;
- instruksi self-harm atau bunuh diri;
- glorifikasi gangguan atau kompetisi penderitaan;
- diagnosis terhadap pengguna lain;
- resep, penjualan, atau rekomendasi obat;
- penipuan, permintaan uang, spam, dan impersonation tenaga profesional;
- media pemicu tanpa content warning.

Aturan respons:

- Sinyal krisis memunculkan bantuan privat dan tidak memberi badge publik pada pengguna.
- Post tidak otomatis dihapus hanya karena pengguna menceritakan pengalaman sulit; bedakan disclosure, dukungan, dan instruksi berbahaya.
- Report mempunyai kategori, detail opsional, block/mute author, confirmation, dan status Ditinjau/Selesai.
- Block mencegah dua akun saling melihat/interaksi sesuai policy.
- Guardrail tidak menggantikan moderator manusia untuk kasus ambigu, laporan berulang, atau akun terverifikasi.

### 11.17 Animasi dan micro-interaction

| Interaksi | Motion |
|---|---|
| Tab berubah | Background/indicator slide 160–200 ms |
| Reaction popover | Scale 0.96→1 dan fade 140–180 ms |
| Reaction dipilih | Icon lift maksimum 4 px, satu kali |
| Join | Label Join→Joined + check 180–220 ms |
| Post baru | Fade/translate maksimum 8 px, 180–240 ms |
| Bookmark | Fill transition 140–180 ms |
| Skeleton | Pulse lembut; dimatikan pada reduced motion |

- Tidak ada autoplay carousel.
- Tidak ada confetti, infinite bounce, atau parallax pada feed.
- Layout tidak boleh meloncat saat count berubah.
- Semua hasil akhir harus langsung terlihat tanpa menunggu animasi selesai.

### 11.18 State fungsional yang wajib

| Fitur | State minimum |
|---|---|
| Feed | loading, loaded, empty, filtered-empty, pagination, error, retry |
| Post | normal, own-post, edited, deleted, content-warning, under-review, failed |
| Image | selecting, compressing, uploading, preview, failed, removed |
| Reaction | idle, optimistic, saved, rollback |
| Comment | collapsed, loading, open, composing, sending, failed |
| Join | join, joining, joined, requested, muted, leaving, failed |
| Search | idle, typing, results, empty, filtered, error |
| Report | form, submitting, confirmed, status update |
| Moderation | precheck, needs-revision, blocked, appealed, restored |

Setiap aksi yang memengaruhi server wajib menunjukkan hasil nyata. Timeout atau error tidak boleh berubah menjadi success palsu.

### 11.19 Accessibility dan age-inclusive acceptance

- Heading dan landmark membedakan navigation, timeline, complementary discovery, dan composer.
- Feed memakai daftar/article semantik; jangan mengubah seluruh card menjadi satu button.
- Action row dapat dinavigasi keyboard dengan urutan konsisten.
- Reaction popover memakai menu/listbox semantics yang sesuai dan mengembalikan fokus ke trigger.
- Search results diumumkan tanpa memindahkan fokus secara mendadak.
- Media memiliki alt text; user mendapat bantuan menulis alt text sebelum publish.
- Relative time memiliki datetime absolut untuk screen reader/tooltip.
- Font scaling 200% tidak memotong post action.
- Mode text besar tidak menyembunyikan label menjadi icon-only.
- Contrast memenuhi WCAG 2.2 AA.
- Color/reaction selalu disertai icon dan label.
- Tombol Report, Block, dan Bantuan tidak disembunyikan di balik gesture saja.
- Infinite feed menyediakan tombol Muat lebih banyak sebagai fallback dan landmark kembali ke atas.

### 11.20 Data contract minimum

~~~text
Community
  id, name, slug, description, coverUrl, audienceTags
  memberCount, newPostCount, joinPolicy, moderationPolicy

Membership
  communityId, userId, role, status, notificationLevel, joinedAt

CommunityPost
  id, communityId, authorAlias, authorBadge, body, topics
  attachment, contentWarning, reactionSummary, commentCount
  moderationStatus, createdAt, editedAt

Reaction
  postId, userId, type, createdAt

Comment
  id, postId, parentId, authorAlias, body
  reactionSummary, moderationStatus, createdAt, editedAt

Report
  id, targetType, targetId, category, note, status, createdAt
~~~

Kontrak attachment memuat URL aman, MIME, width, height, alt text, blur placeholder, dan moderation state. Data profil pribadi tidak disalin ke post; post memakai snapshot alias yang aman.

Endpoint/hook minimum:

- listCommunities, listMyCommunities, listRecommendedCommunities;
- joinCommunity, leaveCommunity, muteCommunity;
- listCommunityFeed dengan cursor dan sort;
- createPost, editPost, deletePost;
- addReaction, changeReaction, removeReaction;
- listComments, createComment, editComment, deleteComment;
- searchCommunity;
- reportContent dan getReportStatus.

### 11.21 Komponen Community

- CommunityWebShell
- CommunityHeader
- CommunityNavigation
- CommunitySearch
- CommunityTabs
- CommunityComposer
- CommunityFeed
- CommunityPostCard
- PostMedia
- PostActionBar
- ReactionPicker
- CommentThread
- CommentComposer
- MyCommunityCard
- RecommendedCommunityItem
- JoinCommunityButton
- CommunityRulesPanel
- ContentWarningGate
- ModerationNotice
- ReportContentDialog
- CommunitySafetyPanel

Komponen bersifat presentational. Fetching, pagination, optimistic update, rollback, membership, dan moderation berada pada hook/domain layer seperti useCommunityFeed, useCommunityMembership, useCommunityComposer, dan useCommunityModeration.

### 11.22 Acceptance khusus Community

- [ ] Hanya /community yang berubah; tidak ada halaman Home baru dari gambar referensi.
- [ ] Desktop memakai layout tiga kolom dan tablet/mobile mempunyai fallback web yang jelas.
- [ ] Base color tetap HavenCare Glass; warna emoji hanya digunakan pada reaction.
- [ ] User dapat mencari, memfilter, join, leave, mute, post, edit, delete, react, comment, reply, save, share, report, dan block sesuai permission.
- [ ] Semua mutation memiliki loading, success, failure, dan rollback.
- [ ] Member/reaction/comment count berasal dari API atau diberi label demo.
- [ ] Gen Z dan lansia dapat menggunakan fitur yang sama tanpa gesture tersembunyi.
- [ ] Konten krisis membuka bantuan privat dan tidak mengekspos label publik.
- [ ] Tampilan diuji pada 320 px, 768 px, 1024 px, 1280 px, dan 1440 px.
- [ ] Keyboard, screen reader, zoom 200%, text besar, dan reduced motion lulus pengujian.

---

## 12. Navigation dan Patient Workspace Shell

### 12.1 Overlay dua kolom

Desktop:

| Kolom kiri | Kolom kanan |
|---|---|
| Rute utama dengan active state | Bantuan krisis |
| Label jelas dan urutan stabil | Ringkasan privasi |
| CTA kembali ke dashboard | Disclaimer HavenCare AI |

Mobile menjadi satu kolom dengan Bantuan Darurat tetap terlihat tanpa scroll panjang.

Hapus:

- logo dan teks freud.ai;
- tagline revolusi AI generik;
- tombol Apple Store dan Google Play jika aplikasi native tidak tersedia;
- link sosial placeholder;
- current route yang hardcoded.

### 12.2 Cakupan expandable patient rail

Expandable navigation rail hanya dirender pada workspace pasien yang sudah login:

- /dashboard;
- /chat dan substate sesi;
- /assessments;
- /community;
- /profile.

Komponen ini DILARANG dirender pada:

- landing page /;
- /login;
- /register;
- /onboarding;
- halaman publik lain;
- konsol /admin yang mempunyai navigasi SOC sendiri;
- workspace dokter yang mempunyai kebutuhan navigasi klinis sendiri.

Rail adalah bagian PatientWorkspaceShell, bukan komponen yang dipasang manual di setiap halaman. Dengan demikian, state, ukuran, route highlight, dan responsive behavior tetap konsisten.

### 12.3 Anatomi visual collapsed dan expanded

Visual mengadaptasi rail rounded pada gambar: satu bar vertikal sempit untuk icon-only state dan satu bar lebih lebar untuk icon + label state.

~~~text
COLLAPSED — 72 px             EXPANDED — 248 px
┌────────────────┐             ┌────────────────────────────────┐
│   [HavenCare]  │             │ [HavenCare]                 [‹]      │
│                │             │                                │
│   [⌂]          │             │ [⌂  Beranda]                   │
│   [◌]          │   click →   │ [◌  Chat HavenCare AI]                  │
│   [◫]          │             │ [◫  Assessment]                │
│  ╭────╮        │             │╭──────────────────────────────╮│
│  │ 👥 │ active │             ││ 👥  Komunitas                ││ active
│  ╰────╯        │             │╰──────────────────────────────╯│
│   [○]          │             │ [○  Profil]                    │
│                │             │                                │
│   [🆘]         │             │ [🆘 Bantuan sekarang]         │
└────────────────┘             └────────────────────────────────┘
~~~

Active item:

- Collapsed: capsule/circle 48 × 48 px dengan navigation.activeSurface.
- Expanded: capsule 216 × 52 px dengan padding horizontal 14–16 px.
- Icon dan label aktif memakai navigation.activeText.
- Active capsule boleh memanjang 8–10 px ke arah content sehingga terlihat menyatu dengan canvas seperti referensi.
- Active capsule memakai radius.pill; container rail memakai radius.xl 32 px.
- Efek lekuk di tepi content hanya dekoratif. Boleh dibuat dengan pseudo-element yang pointer-events:none, tetapi core active state harus tetap berupa capsule biasa jika efek tersebut tidak didukung.
- DILARANG memakai clip-path/mask kompleks sebagai satu-satunya pembentuk active item karena rawan berbeda antarbrowser.

Inactive item:

- Icon/label memakai navigation.inactiveText.
- Hover/focus memakai navigation.shellHover.
- Pressed memakai navigation.shellPressed.
- Item tetap memiliki icon dan label semantik; warna bukan satu-satunya penanda active state.

### 12.4 Ukuran dan spacing normatif

| Elemen | Desktop expanded | Desktop collapsed |
|---|---:|---:|
| Rail width | 248 px | 72 px |
| Rail outer radius | radius.xl / 32 px | radius.xl / 32 px |
| Rail inset dari viewport | 16 px | 16 px |
| Logo/avatar | 48 × 48 px | 48 × 48 px |
| Nav item | 216 × 52 px | 48 × 48 px |
| Icon | 22 × 22 px | 22 × 22 px |
| Gap item | 8 px | 8 px |
| Label | type.body 16/24 px, semibold | Disembunyikan secara visual |
| Focus ring | 3 px | 3 px |
| Badge | 18–22 px | 8 px dot atau 18 px count |

- Rail tinggi: calc(100dvh - 32 px).
- Header/logo dan footer/help tidak ikut scroll; daftar item tengah boleh scroll bila viewport pendek.
- Minimum target click/touch 48 × 48 px.
- Label satu baris dan ellipsis bila terjemahan melebihi ruang. Full label tersedia melalui title/tooltip yang accessible.
- Rail tidak boleh menutupi browser zoom controls, keyboard focus, atau content utama.

### 12.5 Daftar route dan icon

| Urutan | Label | Route | Icon semantik | Match active |
|---:|---|---|---|---|
| 1 | Beranda | /dashboard | Home | exact |
| 2 | Chat HavenCare AI | /chat | MessageCircle | /chat dan session state |
| 3 | Assessment | /assessments | ClipboardHeart atau Activity | /assessments |
| 4 | Komunitas | /community | Users | /community dan query/detail state |
| 5 | Profil | /profile | UserRound | /profile |
| footer | Bantuan sekarang | Crisis action | LifeBuoy/HeartPulse | action, bukan route biasa |

- Icon berasal dari satu library yang sudah digunakan proyek agar stroke konsisten.
- Icon size dan stroke width seragam.
- DILARANG memakai label Home, Measure, Analyze, Reduce, Report dari gambar secara literal.
- Badge hanya muncul dari data nyata, misalnya unread reply. Badge dekoratif/fiktif dilarang.
- Bantuan sekarang membuka Crisis Support Panel dan tidak mengubah active route.

### 12.6 Perilaku klik dan state machine

Aturan klik desktop:

1. Rail collapsed + klik item inactive: route berubah dan rail melebar.
2. Rail collapsed + klik item yang sudah active: tidak reload; rail hanya melebar.
3. Rail expanded + klik item: route berubah dan rail tetap expanded.
4. Rail expanded + klik item active: tidak reload dan tidak collapse.
5. Hanya tombol chevron/collapse yang meringkas rail.
6. Hover tidak boleh otomatis expand agar pengguna lansia tidak kehilangan posisi.
7. Browser Back/Forward memperbarui active item dari pathname tanpa mengubah expanded preference secara acak.

~~~mermaid
stateDiagram-v2
    [*] --> Collapsed
    Collapsed --> Expanding: click nav icon
    Expanding --> Expanded: transition complete
    Expanded --> RoutePending: click another item
    RoutePending --> Expanded: route resolved
    Expanded --> Collapsing: click collapse button
    Collapsing --> Collapsed: transition complete
    RoutePending --> Expanded: route failed + show error
~~~

State minimum:

- collapsed;
- expanding;
- expanded;
- collapsing;
- route-pending;
- route-error;
- mobile-drawer-open;
- mobile-drawer-closed.

Navigasi tidak boleh disabled hanya karena width transition sedang berjalan. Klik selama animasi tetap hanya menghasilkan satu navigation event.

### 12.7 Layout integration tanpa bug

PatientWorkspaceShell menggunakan CSS Grid:

~~~text
grid-template-columns: var(--patient-rail-width) minmax(0, 1fr)
--patient-rail-width: 72px | 248px
~~~

Aturan teknis layout:

- Content utama wajib min-width:0 untuk mencegah horizontal overflow.
- Width rail dikendalikan oleh CSS variable/data-state, bukan hasil pengukuran JavaScript per frame.
- Transisi hanya menganimasikan grid column/width dan opacity/transform label; jangan menganimasikan left seluruh page.
- Chat dan Community menghitung breakpoint berdasarkan ruang container yang tersisa, bukan hanya window width.
- Saat rail expanded mengurangi area, Community boleh menutup discovery panel dan Chat boleh memindahkan context menjadi popover.
- Page tidak boleh di-unmount saat rail expand/collapse; draft, scroll, chat stream, dan form state tetap hidup.
- Tooltip collapsed dirender melalui portal agar tidak terpotong overflow rail.
- Z-index rail berada di bawah modal/Crisis Override dan di atas content biasa.
- Decorative pseudo-element active shape memakai pointer-events:none.
- Jangan meletakkan Link di dalam button atau button di dalam Link.
- Satu click handler tidak boleh sekaligus memanggil router.push dan event navigation kedua dari elemen anak.

Expanded preference:

- Desktop boleh menyimpan preference pada localStorage/cookie dengan key stabil, misalnya siaga.patient-nav.expanded.
- Active item tidak pernah disimpan; selalu dihitung dari pathname.
- Render server/default menggunakan state deterministik agar tidak terjadi hydration mismatch.
- Jika preference baru dibaca setelah mount, transisi awal dimatikan sampai hydration selesai untuk mencegah rail berkedip dari 72 ke 248 px.

### 12.8 Responsive web behavior

| Viewport | Perilaku |
|---|---|
| ≥ 1200 px | Collapsed/expanded mendorong content melalui grid dan preference boleh disimpan |
| 768–1199 px | Default collapsed 72 px; expanded tampil sebagai overlay rail 248 px agar content tidak terlalu sempit |
| < 768 px | Rail tidak berada dalam grid; patient header membuka side drawer web maksimal min(320 px, calc(100vw - 32 px)) |

Tablet overlay:

- Backdrop transparan ringan.
- Klik luar atau Escape collapse ke rail 72 px.
- Route click menavigasi lalu kembali ke collapsed setelah transition route berhasil.

Mobile web drawer:

- Dibuka dari tombol Menu pada patient header.
- Menggunakan daftar expanded dengan active capsule yang sama.
- Route click menutup drawer setelah navigation.
- Focus trapped saat drawer terbuka dan dikembalikan ke tombol Menu saat ditutup.
- Body scroll dikunci hanya selama drawer terbuka.
- DILARANG menyalin bottom navigation aplikasi dari referensi.

### 12.9 Motion dan interaction detail

| Interaksi | Durasi | Easing |
|---|---:|---|
| Rail width | 220–260 ms | cubic-bezier(0.2, 0.8, 0.2, 1) |
| Label reveal | 140–180 ms, delay maksimal 40 ms | ease-out |
| Active capsule move | 180–220 ms | ease-out |
| Hover background | 120–160 ms | ease-out |
| Tooltip | 120–160 ms | ease-out |

- Label reveal memakai opacity dan translateX maksimum 6 px.
- Icon tidak berubah posisi lebih dari 4 px antara state agar tidak terasa melompat.
- Tidak ada ambient particle/star animation dari background referensi.
- prefers-reduced-motion menghilangkan transisi width/position; state berubah instan.

### 12.10 Accessibility

- Gunakan nav dengan aria-label Navigasi pasien.
- Active route memakai aria-current=page.
- Toggle memakai aria-expanded dan aria-controls.
- Collapsed item tetap mempunyai accessible name dan tooltip.
- Tooltip bukan satu-satunya sumber nama; aria-label tetap ada.
- Focus ring memakai navigation.focus dan kontras terhadap shell gelap.
- Keyboard order: logo/profile shortcut, item dari atas ke bawah, Bantuan sekarang, collapse toggle sesuai posisi visual.
- Enter/Space mengaktifkan item/toggle; Escape menutup overlay/drawer.
- Badge count diumumkan sebagai contoh 3 balasan baru, bukan hanya angka 3.
- Screen reader tidak membaca label ganda ketika label visual tersembunyi pada collapsed state.
- Zoom 200% tidak menimpa content; bila ruang tidak cukup, gunakan tablet overlay behavior.

### 12.11 Kontrak komponen

Komponen:

- PatientWorkspaceShell
- ExpandablePatientRail
- PatientRailHeader
- PatientRailNavList
- PatientRailNavItem
- PatientRailToggle
- PatientRailTooltip
- PatientMobileNavDrawer
- PatientCrisisAction

Konfigurasi route tunggal:

~~~text
PATIENT_NAV_ITEMS
  id
  label
  href
  icon
  activeMatcher
  badgeSelector optional
  requiredRole = patient
~~~

Komponen menerima isExpanded, pathname, pendingHref, badge values, onNavigate, dan onExpandedChange. Route definition tidak boleh digandakan pada rail, mobile drawer, dan halaman masing-masing.

### 12.12 Acceptance dan pengujian

- [ ] Rail hanya muncul setelah login pada route pasien yang diizinkan.
- [ ] Landing, login, register, dan onboarding tidak merender rail atau menyisakan ruang kosong 72 px.
- [ ] Klik setiap icon membuka route yang benar sekaligus memperluas rail dari collapsed state.
- [ ] Klik active icon tidak reload page atau menggandakan request.
- [ ] Chevron collapse bekerja tanpa navigation.
- [ ] Active state mengikuti pathname termasuk Back/Forward.
- [ ] Rail expanded tidak menghapus draft assessment, composer community, atau streaming chat.
- [ ] Chat dan Community reflow tanpa horizontal overflow ketika width berubah.
- [ ] Tablet overlay dan mobile drawer tidak tertinggal setelah route change.
- [ ] Active capsule tetap rounded dan terbaca bila pseudo-element dekoratif gagal.
- [ ] Preference tidak menyebabkan hydration mismatch atau first-paint flicker.
- [ ] Semua item dapat digunakan dengan keyboard, screen reader, touch, zoom 200%, dan reduced motion.
- [ ] Test pada 320, 768, 1024, 1200, 1280, dan 1440 px.
- [ ] Test rapid click, resize saat transition, route error, slow navigation, refresh, dan logout.

### 12.13 Profile dan preferences

/profile tetap berada di PatientWorkspaceShell dan memakai pattern SaaS settings, bukan satu form panjang tanpa grouping.

Group minimum:

1. Akun — nama panggilan, email read-only/verified state, dan aksi keamanan akun.
2. Tampilan — Teks standar/besar, reduced motion, mode Ringkas/Terpandu, dan reset preference.
3. Chat & audio — autoplay TTS off by default, voice permission status, notification preview privacy.
4. Privasi — history preference yang benar-benar didukung, export/delete request, serta link kebijakan yang valid.
5. Bantuan — emergency contact opsional, Crisis Support, dan bantuan profesional.
6. Session — logout semua perangkat bila backend mendukung; logout perangkat ini selalu tersedia.

Layout:

- Desktop memakai setting navigation 280 px + content minmax(0, 720 px); tablet/mobile menjadi accordion/list satu kolom.
- Setiap group memakai glass.surface, radius.lg, heading h2/h3 semantik, helper copy, dan action yang jelas.
- Destructive action dipisahkan dalam Danger Zone; status.danger tidak digunakan untuk setting normal.

Perilaku:

- Preference visual diterapkan sebagai preview langsung tetapi baru dianggap tersimpan setelah respons sukses atau local preference write terkonfirmasi.
- Server preference memakai version/updatedAt untuk mencegah silent overwrite antar-tab/perangkat.
- Conflict menawarkan Muat versi terbaru atau Terapkan perubahan saya; jangan diam-diam menimpa.
- Permission microphone/notification dibaca dari browser jika tersedia; UI tidak boleh mengklaim izin aktif tanpa status nyata.
- Logout membersihkan query cache dan data sensitif sebelum redirect; Back tidak boleh menampilkan page privat dari cache.
- Delete/export account tidak dibuat seolah instan bila backend menjalankan proses asynchronous; tampilkan status request yang benar.

Acceptance:

- [ ] Save, retry, conflict, offline, validation, permission denied, dan success state tersedia.
- [ ] Teks besar/reduced motion berlaku ke semua page tanpa reload loop atau flash preference.
- [ ] Emergency contact tidak ditampilkan di tempat publik dan tidak direkam analytics.
- [ ] Semua control memiliki label, description, current value, keyboard focus, dan touch target minimum 48 px.
- [ ] Mobile, zoom 200%, dan string panjang tidak menabrakkan label dengan switch/button.

---

## 13. State UI Wajib

Setiap layar berbasis data harus mendesain dan menguji state berikut:

| State | Aturan |
|---|---|
| Loading awal | Skeleton mengikuti layout, tidak menggeser halaman ekstrem |
| Loading aksi | Tombol tetap memiliki label, disabled, dan progress |
| Empty | Menjelaskan kondisi dan menyediakan satu aksi relevan |
| Error validasi | Dekat field, jelas, tidak hanya merah |
| Error jaringan | Jelaskan bahwa data belum tersimpan; sediakan retry |
| Offline | Pertahankan draft lokal bila aman; jangan mengklaim terkirim |
| Unauthorized | Arahkan login tanpa membocorkan keberadaan data |
| Forbidden | Jelaskan bahwa role tidak memiliki akses |
| Success | Konfirmasi singkat dan arah lanjutan |
| Partial data | Jangan membuat nilai fallback yang terlihat nyata |
| Crisis | Crisis Override mengalahkan state normal |

Modal, toast, dan banner harus memiliki peran berbeda:

- Toast: konfirmasi nonkritis.
- Inline alert: error yang perlu diperbaiki pada konteks yang sama.
- Banner: status sistem yang bertahan.
- Modal: keputusan yang harus diselesaikan sebelum kembali.
- Crisis panel/page: bukan toast dan bukan modal sementara.

---

## 14. Accessibility dan Bahasa

### 14.1 Accessibility acceptance

- WCAG 2.2 AA untuk kontras, keyboard, focus, label, dan target sentuh.
- Setiap icon-only button memiliki accessible name dalam Bahasa Indonesia.
- Focus visible tidak boleh dihapus.
- Heading tersusun tanpa melompati hierarki.
- Form field memiliki label permanen; placeholder bukan label.
- Error dihubungkan menggunakan aria-describedby dan diumumkan pada screen reader.
- Chart memiliki ringkasan teks.
- Emoji informatif memiliki label; emoji dekoratif disembunyikan dari screen reader.
- Motion dapat dikurangi.
- Zoom 200% tetap dapat digunakan tanpa kehilangan fungsi.

### 14.2 Voice and tone

Gunakan:

- `kamu` sebagai default yang hangat dan ringkas; pengguna boleh memilih sapaan `Anda` melalui preferensi, bukan ditebak berdasarkan usia;
- kalimat pendek;
- bahasa menerima dan tidak menghakimi;
- pilihan tindakan yang konkret.

Aturan lintas generasi:

- Gen Z tidak harus diberi slang; gunakan bahasa natural, langsung, dan tidak dibuat-buat.
- Lansia tidak diberi bahasa kekanak-kanakan; gunakan instruksi jelas, tempo tenang, serta konteks sebelum tindakan.
- Helper copy mode Ringkas maksimal satu kalimat; mode Terpandu boleh 2–3 kalimat tetapi menghasilkan tindakan yang sama.
- Label action selalu berupa kata kerja konkret: `Mulai chat`, `Simpan`, `Coba lagi`, `Kembali`, bukan `Lanjut` tanpa konteks.

Hindari:

- istilah revolusioner, sempurna, mutlak, dan 100% aman;
- bahasa mesin seperti momentum, vector, L0–L3 pada alur pasien;
- label penderita atau gagal;
- copy yang membuat pengguna merasa sedang diuji.

Bahasa teknis boleh muncul pada halaman Keamanan & Privasi dan SOC dengan penjelasan awam lebih dulu.

### 14.3 Interaksi untuk Gen Z dan lansia

- Satu screen mempunyai satu primary action yang jelas; secondary actions tidak dibuat menyerupai CTA primer.
- Icon penting selalu disertai label atau tooltip accessible; fitur tidak boleh bergantung pada interpretasi icon semata.
- Tidak ada fungsi yang hanya muncul melalui hover, swipe, drag presisi, long-press, atau gesture tersembunyi.
- Quick Emoji dan starter prompt mempercepat Gen Z/pengguna cemas, tetapi input teks, voice, dan navigasi keyboard tetap setara.
- Lansia mendapatkan touch target minimum 48 px, helper copy Terpandu, text besar, dan waktu baca tanpa auto-dismiss untuk pesan penting.
- Timer/session timeout memberi peringatan serta opsi lanjut; draft aman tidak hilang tanpa konfirmasi.
- Destructive action membutuhkan confirmation yang menyebut objek; aksi yang dapat dipulihkan menyediakan Undo.
- Jangan mendeteksi atau mengubah mode berdasarkan perkiraan usia. Pengguna memilih preferensi dan dapat meresetnya.
- Output interaksi selalu menjelaskan apa yang terjadi, apa yang tersimpan, dan tindakan berikutnya; jangan berhenti pada animasi sukses tanpa informasi.
- Error menggunakan bahasa netral, mempertahankan input yang aman, serta memberi Coba lagi atau alternatif yang nyata.

---

## 15. Kontrak Komponen

### 15.1 Komponen dasar

Komponen baru atau migrasi harus mempunyai API berbasis semantik, bukan warna. Contoh variant yang diizinkan:

- primary
- secondary
- neutral
- danger
- ghost

Variant seperti espresso, orange, atau freud dinyatakan deprecated.

Kontrak primitive:

- size hanya sm/md/lg dan memakai height/spacing/type token;
- radius hanya sm/md/lg/xl/pill sesuai kategori komponen;
- loading mempertahankan dimensi, memberi accessible status, dan mencegah duplicate action;
- disabled tidak menghapus tooltip/description alasan;
- focus-visible berasal dari satu token dan tidak tertutup overflow;
- komponen interactive meneruskan ref, id, aria, name, value, disabled, dan event standar;
- controlled/uncontrolled behavior tidak dicampur dalam satu lifecycle;
- className extension tidak boleh mengubah color/radius contract tanpa variant resmi.

### 15.2 Komponen domain minimum

- HavenCareLogo
- HavenCareAIAvatar
- PublicHeader
- LandingWebShell
- LandingHero
- LandingEmotionEntry
- AuthAwareChatEntry
- HavenCareAIHeroVisual
- LandingFeatureEntryGrid
- AccessibilityPreferenceControl
- PublicFooter
- AuthWebShell
- HavenCareBrandLockup
- AuthFormCard
- AuthSegmentedSwitch
- AuthHavenCareAIVisualPanel
- PatientWorkspaceShell
- ExpandablePatientRail
- PatientRailNavItem
- PatientMobileNavDrawer
- DoctorWorkspaceShell
- SocWorkspaceShell
- MoodCheckIn
- AppointmentCard
- QuickActionCard
- HavenCareAIMessage
- UserMessage
- ChatComposer
- NewSessionWelcomeDialog
- QuickEmotionPopover
- WellbeingOverviewPopover
- WellbeingOverviewCard
- VoiceRecorder
- ListenControl
- CrisisSupportPanel
- AssessmentWebShell
- MoodWheel
- SleepQualitySlider
- ExpressionComposer
- ReflectionSummary
- CommunityWebShell
- CommunityHeader
- CommunityNavigation
- CommunitySearch
- CommunityTabs
- CommunityComposer
- CommunityFeed
- CommunityPostCard
- ReactionPicker
- CommentThread
- CommunityDiscoveryPanel
- ModerationNotice
- SettingsNavigation
- PreferenceControl
- BrowserPermissionStatus
- AccountDangerZone

Komponen domain tidak boleh melakukan fetch sendiri jika dapat dihindari. Data fetching dan side effect berada pada hook/domain layer; komponen menerima data, event, dan state eksplisit.

---

## 16. Pemetaan Implementasi terhadap Kode Saat Ini

| File/area | Perubahan wajib |
|---|---|
| package.json dan lockfile | Ubah package name menjadi `havencare-frontend`; jangan mengubah dependency/version tanpa kebutuhan migrasi |
| src/theme/colors.ts | Tambah HAVENCARE_GLASS global, Deep Turquoise Glass navigation, domain emotion/reaction, dan dark-glass SOC; hapus dua sumber warna aktif |
| tailwind.config.ts | Petakan warna, radius, shadow, typography, spacing, dan z-index ke token HavenCare; alias legacy hanya sementara |
| src/app/globals.css | Terapkan root gradient glass biru-turquoise, fallback backdrop, font Urbanist, focus ring, reduced-motion/transparency, dan overflow guard |
| src/app/layout.tsx | Tanamkan metadata/title HavenCare, font sekali di root, color-scheme, viewport, serta preference bootstrap yang hydration-safe |
| src/components/ui/* | Standardisasi Button, Input, Card, Dialog, Drawer, Popover, Tabs, Tooltip, Toast, Skeleton, EmptyState, dan ErrorState |
| src/lib/constants.ts | Jadikan PATIENT_NAV_ITEMS dan feature route config satu sumber; tambah pilihan mood/sleep; pertahankan PHQ/GAD hanya untuk flow klinis terpisah |
| src/components/layout/AppShell.tsx | Terapkan PatientWorkspaceShell grid dengan rail width variable, minmax(0,1fr), scope route pasien, serta responsive overlay/drawer |
| src/components/layout/LeftRailNav.tsx | Migrasikan menjadi ExpandablePatientRail 72/248 px dengan click-to-expand, rounded active capsule, pathname matching, tooltip, focus, dan crisis action |
| src/app/page.tsx | Terapkan LandingWebShell Bab 5: header publik, hero 5/7, Emotion Entry, AuthAwareChatEntry, jalur fitur nyata, cara kerja, safety, personalisasi akses, CTA akhir, dan footer |
| src/components/landing/* | Tambah LandingHero, LandingEmotionEntry, AuthAwareChatEntry, HavenCareAIHeroVisual, LandingFeatureEntryGrid, AccessibilityPreferenceControl, dan PublicFooter dengan state eksplisit |
| src/components/ui/FreudFloatingActions.tsx | Retire dari semua render; hapus setelah tidak ada import |
| src/components/layout/FreudMenuOverlay.tsx | Migrasikan menjadi menu HavenCare dua kolom dan pathname-aware; rename setelah aman |
| src/components/auth/AuthShowcasePanel.tsx | Migrasikan menjadi AuthHavenCareAIVisualPanel; hapus Rian, dokter/testimoni fiktif, benefit cards, metrik, Freud copy, dan gambar finansial |
| src/components/auth/* | Tambah AuthWebShell, HavenCareBrandLockup, AuthFormCard, AuthSegmentedSwitch, dan visual HavenCare AI teroptimasi sesuai Bab 6 |
| src/app/login/page.tsx | Terapkan split web + glass, HavenCare wordmark, login state lengkap, route-synced switch, validasi aman, dan role redirect |
| src/app/register/page.tsx | Gunakan shell yang sama, fields/consent terstruktur, password guidance, failure preservation yang aman, dan onboarding redirect |
| src/app/dashboard/page.tsx | Buat hub pasien baru sesuai Bab 7 |
| src/app/**/loading.tsx dan error.tsx | Tambahkan loading/error boundary per route penting dengan ukuran skeleton stabil dan recovery action |
| src/features/** | Deduplicate mutation, cancel stale request, gunakan stable query key, rollback optimistic update, dan pisahkan domain side effect dari view |
| src/app/chat/page.tsx | Bangun Chat HavenCare AI Web sesuai Bab 8: welcome dialog dengan preferredName, workspace responsive, Quick Emoji auto-send, Wellbeing Overview dari composer, starter prompts, voice/TTS, message state, dan Crisis Override |
| src/components/layout/SessionDrawer.tsx | Audit metadata sensitif, state empty/error, dan responsive behavior |
| src/components/layout/ClinicalInsightPanel.tsx | Ubah Freud Score menjadi wellbeing trend berbasis data; pertahankan bantuan krisis dan disclaimer |
| src/components/chat/InlineFreudScoreCard.tsx | Ganti nama/konsep; jangan hardcode skor 88.2 atau persentase kesehatan |
| src/components/charts/FreudScoreChart.tsx | Migrasikan ke nama netral; trend hanya memakai data mood/sleep terstruktur dan tidak memplot plaintext expression |
| src/app/assessments/page.tsx | Hapus custom Yes/No dan klaim PHQ-9; implementasikan tepat 3 halaman web: Mood Wheel, Sleep Quality Slider, Expression Analysis |
| src/app/community/page.tsx | Bangun ulang khusus rute Community menjadi layout web tiga kolom ala X/Tweet: navigation, timeline, discovery; hubungkan search, tabs, join, composer, post, reaction, comment, reply, save, share, report, block, dan moderation ke domain/API |
| src/components/ui/FreudButton.tsx | Migrasikan ke Button semantik; jangan mempertahankan variant berbasis brand lama |
| src/components/ui/FreudFlowerLoader.tsx | Boleh dipakai sementara sebagai loader; rename dan pastikan identitasnya HavenCare AI/HavenCare |
| src/app/profile/page.tsx | Tambah preferensi audio, accessibility, privacy, dan emergency info |
| src/app/admin/** | Pertahankan SOC visual; hanya harmonisasi penamaan HavenCare dan akses role |
| src/app/doctor/** | Pertahankan kebutuhan klinis; hindari palet SOC untuk pengalaman dokter jika tidak diperlukan |
| src/lib/mock/* dan kontrak guardrail | Migrasikan namespace visible ke HavenCare; perubahan namespace protocol internal harus disepakati backend atau dipetakan di adapter kompatibilitas |

### 16.1 Aturan migrasi

- Jangan melakukan global search-and-replace warna tanpa menguji makna komponen.
- Rename komponen dilakukan setelah semua import terpetakan.
- Alias token lama hanya bersifat transisi dan harus mempunyai issue penghapusan.
- Tidak boleh ada dua sumber token aktif untuk pengalaman pasien.
- Refactor visual tidak boleh memutus kontrak API, role guard, atau state sesi.
- `/dashboard` dibuat dan lolos route test sebelum `ROLE_HOME.patient` diarahkan ke sana.
- Perubahan brand mencakup metadata, manifest, document title, alt, aria-label, notification, analytics label, dan empty/error copy; bukan hanya heading terlihat.
- Setiap migrasi page menyertakan visual regression serta keyboard test agar glass/radius/font tidak merusak layout.

### 16.2 Solusi /dashboard dan redirect tanpa 404

Masalah aktual:

- `src/app/dashboard/page.tsx` belum ada;
- `ROLE_HOME.patient` masih /chat;
- fallback `?? "/chat"` tersebar pada landing, login, dan role guard;
- onboarding langsung membaca ROLE_HOME sehingga perubahan terlalu dini dapat mengarahkan pengguna ke route yang belum siap.

Solusi dilakukan dua fase atomik.

#### Fase A — bangun dan validasi dashboard

Tambahkan:

~~~text
src/app/dashboard/page.tsx
src/app/dashboard/loading.tsx
src/app/dashboard/error.tsx
src/components/dashboard/*
~~~

Syarat sebelum redirect diubah:

1. Page dibungkus Guard patient dan PatientWorkspaceShell.
2. Loading/error/empty/partial/offline state Bab 7 tersedia.
3. Deep link /dashboard untuk guest menuju login, onboarding-incomplete menuju onboarding, dan wrong-role menuju role home yang benar.
4. Refresh, Back/Forward, expired session, serta logout tidak membocorkan dashboard dari cache.
5. Route smoke test dan accessibility test lulus.

Selama Fase A, ROLE_HOME.patient tetap /chat. Dashboard boleh diuji melalui direct URL/feature flag internal tanpa menjadi redirect produksi.

#### Fase B — pindahkan home pasien secara terpusat

Buat satu resolver, misalnya `resolveRoleHome(role)`, sebagai satu-satunya sumber home route. Resolver digunakan oleh:

- src/lib/constants.ts;
- src/features/auth/role-guard.tsx;
- src/app/login/page.tsx;
- src/app/onboarding/page.tsx;
- src/app/page.tsx;
- logout/session-expiry redirect yang relevan.

Aturan resolver:

| Input | Output |
|---|---|
| patient | /dashboard |
| doctor | /doctor/dashboard |
| admin | /admin/telemetry |
| null/unknown | /onboarding |

- Hapus fallback tersebar `?? "/chat"`; unknown role selalu /onboarding.
- `next` hanya digunakan bila route internal berada pada allowlist dan role mempunyai izin.
- Intent `start-chat` dari landing disimpan sebagai navigation intent non-sensitif; setelah onboarding pasien masuk dashboard dan mendapat CTA `Lanjut ke Chat HavenCare AI`, atau langsung ke /chat hanya jika keputusan produk mengubah aturan home secara eksplisit.
- Ubah ROLE_HOME, resolver consumer, PATIENT_NAV_ITEMS, dan test dalam satu pull request/commit deployable.
- Jika dashboard gagal health check setelah deploy, rollback resolver ke /chat tanpa menghapus page/dashboard atau data pengguna.

Acceptance remediation:

- [ ] Tidak ada fallback role ke /chat selain explicit user intent yang valid.
- [ ] Login/onboarding/landing tidak menghasilkan redirect loop.
- [ ] /dashboard tidak pernah menjadi 404 pada environment tempat ROLE_HOME.patient=/dashboard.
- [ ] Patient, doctor, admin, guest, unknown role, dan incomplete onboarding mempunyai test masing-masing.

### 16.3 Solusi package name, metadata, dan font root

#### Package identity

- Ubah `package.json.name` dari `siaga-frontend` menjadi `havencare-frontend`.
- Sinkronkan `package-lock.json` pada root package entry; jangan mengedit dependency transitive secara manual.
- Jalankan clean install yang sesuai lockfile, typecheck, lint, test, dan production build setelah perubahan.
- Package rename tidak boleh mengubah package version, script, dependency, atau deployment command tanpa alasan terpisah.

#### Root metadata

`src/app/layout.tsx` memakai metadata berikut sebagai baseline:

~~~text
default title: HavenCare — Ruang refleksi dan dukungan kesehatan mental
title template: %s | HavenCare
description: Ruang digital untuk check-in emosi, refleksi bersama HavenCare AI,
             komunitas suportif, dan akses bantuan manusia saat dibutuhkan.
html lang: id
~~~

- Tambahkan metadata per page: Beranda, Masuk, Daftar, Dashboard, Chat HavenCare AI, Assessment, Community, Profile, Doctor, dan SOC.
- `metadataBase`, canonical, Open Graph image, manifest, dan icon hanya ditambahkan dengan origin/asset nyata dari environment; jangan mengarang domain produksi.
- Metadata dan notification preview tidak memuat isi chat, hasil assessment, email, nama pasien, atau data sensitif.
- Hapus ONNX, Stateful Intent Momentum, latency, dan klaim teknis dari description publik.

#### Font root

- Root layout hanya memuat Urbanist Variable untuk public/patient/doctor UI.
- Hapus Montserrat dari root import dan body class.
- JetBrains Mono dipindahkan ke admin/SOC layout atau diterapkan hanya melalui scoped variable pada surface teknis.
- Sediakan system fallback, display swap, dan subset Latin; verifikasi tidak ada CLS berlebih saat font selesai dimuat.
- Pastikan `font-sans` menunjuk Urbanist dan `font-mono` hanya menunjuk JetBrains Mono pada konteks teknis.

Acceptance remediation:

- [ ] Browser title/description seluruh route memakai HavenCare.
- [ ] View source/metadata tidak mempunyai SIAGA/Freud.
- [ ] Public/patient tidak mengunduh Montserrat.
- [ ] SOC tetap mempunyai monospace tanpa memengaruhi page lain.
- [ ] Font gagal dimuat tetap menghasilkan layout yang terbaca dan tidak bertabrakan.

### 16.4 Solusi migrasi identity dan komponen legacy

Migrasi dilakukan per batch dan setiap batch harus typecheck/build sebelum batch berikutnya. DILARANG melakukan global replace source tanpa memeriksa kontrak komponen, import, mock, dan backend.

| Batch | Target utama | Solusi |
|---|---|---|
| A — visible shell | app/layout, landing, login, register, onboarding, ScreenStates, ConsoleShell | Ganti title/copy/alt/aria/footer/loader menjadi HavenCare; hapus claim legacy |
| B — patient features | chat, assessment, community, profile | Ganti Doctor Freud/Freud Score dengan HavenCare AI atau konsep wellbeing yang benar; hapus nilai fiktif |
| C — shared components | FreudButton, FreudFlowerLoader, FreudMenuOverlay, InlineFreudScoreCard, FreudScoreChart | Buat komponen baru semantik; sediakan alias re-export sementara; migrasikan consumer; lalu hapus alias |
| D — navigation | LeftRailNav, AppShell, SessionDrawer, ClinicalInsightPanel | Gunakan PatientWorkspaceShell, PATIENT_NAV_ITEMS, Glass tokens, dan label HavenCare |
| E — mock/protocol | lib/mock, guardrail, API facade | Pisahkan namespace internal dari copy UI; map `SIAGA_*` lama ke `HAVENCARE_*` hanya melalui compatibility adapter yang disepakati backend |

Target rename komponen:

| Legacy | Target |
|---|---|
| FreudButton | Button |
| FreudFlowerLoader | HavenCareLoader atau Loader |
| FreudMenuOverlay | PublicNavigationMenu |
| InlineFreudScoreCard | WellbeingOverviewCard |
| FreudScoreChart | WellbeingTrendChart |
| FreudProfileWorkspace | ProfileSettingsWorkspace |
| FreudAssessmentFlow | WellnessAssessmentFlow |

Aturan compatibility:

- Alias sementara hanya re-export dan tidak merender copy/style legacy.
- Tambahkan komentar deprecation + issue/tanggal penghapusan.
- Hapus alias setelah import graph menunjukkan nol consumer.
- Jangan mengubah API/backend namespace bersamaan dengan UI rename tanpa contract test.
- Demo email `@demo.siaga` diganti `@demo.havencare` hanya bila auth repository/fixture/test diperbarui dalam perubahan yang sama.

Brand scan dibagi dua:

1. Visible scan wajib nol untuk SIAGA, Doctor Freud, Freud Score, SmartSave, dan SmartMave.
2. Internal scan boleh sementara menemukan nama file/type legacy yang tercatat pada migration allowlist; allowlist harus menyusut tiap batch dan nol sebelum release final.

### 16.5 Solusi legal dan help route yang belum tersedia

Tambahkan route nyata sebelum footer/header mengaktifkan link:

~~~text
src/app/privacy/page.tsx
src/app/terms/page.tsx
src/app/help/page.tsx
~~~

Konten minimum:

| Route | Konten wajib |
|---|---|
| /privacy | data yang diproses, tujuan, penyimpanan, hak pengguna, kontak, tanggal versi, dan klaim yang sudah diverifikasi |
| /terms | batas layanan, eligibility, penggunaan yang dilarang, AI disclaimer, liability yang ditinjau legal, dan versi |
| /help | cara menggunakan fitur, aksesibilitas, account recovery, bantuan profesional, Crisis Support, dan kontak aktif |

- Legal copy wajib mendapat owner legal/privacy; placeholder tidak boleh terlihat seperti kebijakan final.
- /help bukan pengganti layanan darurat dan menampilkan Bantuan sekarang secara jelas.
- Ketiga page memakai PublicShell/HavenCare Glass, Urbanist, reading width 720–800 px, table of contents, focus target, serta print style yang terbaca.
- Jika konten belum disetujui, link tetap nonaktif/tersembunyi dan landing memakai section ringkas yang jujur; jangan route ke halaman kosong.
- Footer/header config membaca availability route dari satu feature configuration.

Acceptance remediation:

- [ ] Link tidak 404 dan dapat dibuka dengan keyboard/new tab.
- [ ] Back kembali tanpa menghapus draft auth yang aman dipertahankan.
- [ ] Heading/landmark/table of contents dapat dinavigasi screen reader.
- [ ] Versi dan tanggal dokumen terlihat; semua kontak benar-benar aktif.
- [ ] Help/Crisis action bekerja tanpa login.

### 16.6 Solusi migrasi HavenCare Glass tanpa visual regression

Urutan implementasi:

1. Tambahkan token HavenCare Glass, radius, type, spacing, shadow, dan z-index tanpa menghapus token lama.
2. Bangun primitive Button/Input/Card/Dialog/Drawer/Popover/Tabs/Tooltip/Skeleton/ErrorState berbasis token baru.
3. Migrasikan PublicShell dan AuthWebShell; lakukan screenshot diff.
4. Migrasikan PatientWorkspaceShell, Dashboard, Chat, Assessment, Community, dan Profile satu per satu.
5. Migrasikan DoctorWorkspaceShell dan dark-glass SocWorkspaceShell.
6. Setelah seluruh consumer berpindah, hapus alias espresso/cream/orange dan token legacy.

Guardrail visual:

- Satu page tidak boleh mencampur shadow/radius/token lama dan baru setelah dinyatakan migrated.
- Gunakan visual regression pada normal, hover, focus, open overlay, loading, empty, error, long text, Teks besar, dan no-backdrop fallback.
- Periksa 320/768/1024/1440/1920 px, zoom 100/200%, Safari/Firefox/Chrome/Edge.
- CSS fallback memakai opaque glass.surfaceStrong; jangan membuat text transparan ketika blur gagal.
- Setiap PR migrasi harus menyertakan before/after screenshot dan daftar interaction yang diuji.

### 16.7 Definition of resolved untuk temuan audit

Temuan implementasi hanya boleh ditandai selesai jika:

- /dashboard tersedia dan redirect matrix lulus tanpa 404/loop;
- package/lockfile, metadata, wordmark, visible copy, alt, aria, loader, notification, dan analytics namespace menggunakan HavenCare/HavenCare AI;
- Urbanist menjadi font UI global dan monospace terisolasi pada SOC;
- visible brand scan nol legacy; internal allowlist nol sebelum release final;
- /privacy, /terms, dan /help tersedia atau link belum dirender;
- semua page memakai HavenCare Glass/radius/type token tanpa raw legacy styling;
- typecheck, lint, build, unit/component/E2E, accessibility, visual regression, browser smoke test, dan console scan lulus;
- tidak ada hydration mismatch, duplicate request, lost draft, unhandled promise rejection, atau role/security regression.

---

## 17. Urutan Eksekusi

### P0 — Safety dan arah pengguna

- Tetapkan dokumen ini sebagai aturan.
- Verifikasi konfigurasi hotline dan copy krisis.
- Hapus alur/teks penebusan obat jika ditemukan.
- Hapus klaim dan data klinis fiktif yang terlihat seperti fakta.
- Ubah seluruh identitas visible, metadata, alt, aria-label, notification title, dan document title dari Freud/legacy menjadi HavenCare atau HavenCare AI sesuai konteks.
- Buat brand inventory + allowlist internal sementara; hentikan release bila legacy terlihat pengguna.
- Verifikasi owner hotline, consent, legal copy, privacy claim, serta namespace guardrail sebelum mengganti kontrak eksternal.

### P1 — Fondasi dan alur utama

- Migrasi token HavenCare Glass, radius, typography, spacing, shadow, z-index, dan dark-glass SOC.
- Bangun primitive SaaS bersama serta error/loading boundaries.
- Ubah package/lockfile, root metadata, title template, dan font scoping sesuai Bab 16.3.
- Tanamkan HavenCare dan HavenCare AI pada seluruh visible/accessibility copy melalui batch migration Bab 16.4.
- Buat /dashboard sebagai Fase A; setelah route/guard/test lulus, pindahkan resolver ROLE_HOME sebagai Fase B dalam perubahan deployable yang sama.
- Buat /privacy, /terms, dan /help atau sembunyikan link sampai legal content tervalidasi.
- Bangun ulang landing menjadi jalur interaktif menuju Chat HavenCare AI: Emotion Entry, feature routing nyata, visual lintas generasi, batas AI, personalisasi akses, responsive web, dan tanpa kontrol anonim/ambigu.
- Bangun AuthWebShell: wordmark HavenCare, form glass di kiri, panel HavenCare AI di kanan, interaksi form, serta responsive web.
- Hapus floating dock dan rapikan navigasi.
- Implementasikan Expandable Patient Rail hanya pada workspace pasien setelah login, termasuk tablet overlay dan mobile web drawer.
- Migrasikan Chat HavenCare AI: header, welcome dialog personal, Quick Emoji auto-send, Wellbeing Overview popover/pin, composer, voice/TTS, serta crisis flow.

### P2 — Wellness Assessment UX

- Bangun assessment web tepat 3 halaman sesuai Bab 10.
- Implementasikan Mood Wheel, Sleep Quality Slider, dan Expression Analysis beserta draft state.
- Pastikan hasil tetap berada pada state halaman 3/3 dan tidak membuat halaman keempat.
- Pastikan response krisis konsisten lintas chat/dashboard/assessment.
- Validasi copy dengan tenaga klinis.

### P3 — Community dan penyempurnaan

- Bangun Community web tiga kolom tanpa membuat halaman Home baru.
- Implementasikan Komunitasku, rekomendasi, search/filter, dan join/leave/mute.
- Implementasikan composer, feed ala tweet, media, reaction picker, comments/replies, save/share, report/block, serta moderation.
- Tambahkan mode Fokus dan dukungan text besar untuk lansia tanpa mengurangi fitur Gen Z.
- Tambah voice/TTS hanya bila backend benar-benar tersedia.
- Tambah aset HavenCare AI 3D dan scribble dengan anggaran performa.
- Lakukan accessibility dan responsive audit.

### Tidak dikerjakan

- Penebusan atau pembayaran obat.
- Aplikasi mobile native.
- Statistik dampak palsu.
- Gamification krisis.
- Duplikasi tampilan SOC ke area pasien.

---

## 18. Definition of Done

Sebuah halaman dinyatakan selesai hanya jika:

- [ ] Mengikuti rute dan tujuan pada dokumen ini.
- [ ] Tidak memiliki tombol, card, audio, badge, menu, atau control dekoratif yang terlihat interaktif tetapi tidak bekerja.
- [ ] Menggunakan HavenCare sebagai nama project/product dan HavenCare AI sebagai nama asisten pada seluruh page, metadata, accessibility label, dan pesan sistem tanpa identitas legacy.
- [ ] Menggunakan HavenCare Glass biru-turquoise, token radius, typography, spacing, shadow, dan z-index; tidak ada hex/radius/shadow baru tersebar pada JSX.
- [ ] Font Urbanist dimuat sekali, fallback tidak menyebabkan CLS, dan teks tidak bertabrakan pada Bahasa Indonesia, mode Teks besar, atau zoom 200%.
- [ ] Glass mempunyai fallback tanpa backdrop-filter dan tetap memenuhi kontras WCAG 2.2 AA.
- [ ] Card, input, dialog, rail, image clipping, skeleton, hover, dan focus memakai radius token yang selaras.
- [ ] Memiliki loading, empty, error, success, dan unauthorized state yang relevan.
- [ ] Dapat digunakan pada 320, 768, 1024, 1440, dan 1920 px tanpa horizontal overflow, overlap, clipping, atau layout jump.
- [ ] Dapat digunakan dengan keyboard saja.
- [ ] Focus, label, error announcement, dan kontras memenuhi WCAG 2.2 AA.
- [ ] Tidak memiliki metrik, dokter, testimoni, skor, atau status verifikasi fiktif tanpa label demo.
- [ ] Tidak memberi diagnosis, resep, atau penjualan obat.
- [ ] Crisis Override tersedia bila halaman menerima input kesehatan mental.
- [ ] Analytics tidak merekam isi pesan, jawaban assessment mentah, atau data sensitif yang dilarang.
- [ ] Event dan copy telah ditinjau dari sisi privasi.
- [ ] Unit/component test mencakup interaksi utama.
- [ ] E2E test mencakup happy path dan failure path.
- [ ] Visual regression mencakup viewport utama, zoom 100/200%, theme fallback, reduced motion, dan teks panjang.
- [ ] Chrome, Safari, Firefox, dan Edge target lulus smoke test untuk glass fallback, dialog, audio, dan responsive shell.
- [ ] Rapid click, slow API, stale response, offline, route change, resize saat animasi, refresh, dan expired session tidak menggandakan aksi atau menghilangkan draft secara tidak aman.
- [ ] Tidak ada regresi role guard atau redirect.

---

## 19. Skenario Uji Penerimaan Utama

### 19.1 Landing menuju Chat HavenCare AI

1. Pengunjung membuka / dan melihat headline, fungsi HavenCare AI, batas AI, Emotion Entry, serta CTA chat tanpa skor/testimoni/data palsu.
2. Header hanya memuat anchor dan route publik yang nyata; tidak ada Careers salah arah, admin telemetry, Download App, atau dropdown kosong.
3. Pengunjung memilih `Cemas`; chip memperoleh selected state dan preview HavenCare AI berubah tanpa mengirim atau menyimpan data sensitif.
4. Pengunjung mengganti pilihan menjadi `Senang`; preview berubah tepat satu kali dan state sebelumnya tidak tertinggal pada screen reader.
5. Pengunjung yang belum login menekan `Mulai chat dengan HavenCare AI` dan diarahkan ke /register dengan next/intent internal yang valid.
6. Pengguna login tetapi belum onboarding diarahkan ke onboarding; pengguna yang sudah lengkap membuka sesi baru Chat HavenCare AI.
7. Rapid click pada CTA tidak menghasilkan request/navigation ganda, sedangkan auth loading dan offline mempunyai feedback yang jelas.
8. Chat, Assessment, dan Community hanya tampil sebagai feature card bila benar-benar tersedia dan seluruh CTA menuju destination yang benar.
9. Bantuan sekarang dapat dibuka tanpa login dan tidak dicatat sebagai marketing conversion.
10. Toggle Teks besar, Kurangi gerakan, dan Terpandu memperbarui preview serta tetap bekerja setelah refresh sesuai aturan penyimpanan non-sensitif.
11. Gen Z dan lansia dapat menyelesaikan flow menggunakan mouse, touch, keyboard, screen reader, teks besar, dan reduced motion.
12. Pada 320 px, tablet, desktop, zoom 200%, JavaScript gagal, serta gambar gagal dimuat, CTA dan informasi keselamatan tetap dapat digunakan.
13. Tidak ada anonymous badge, fake avatar/member count, mock audio, app-store button, self-harm marketing copy, floating dock, atau link SOC pada landing.
14. Setelah registrasi dan onboarding berhasil, pengguna masuk ke /dashboard lalu dapat membuka Chat HavenCare AI tanpa kehilangan intent memulai chat.

### 19.2 Login dan register HavenCare

1. /login dan /register menampilkan wordmark HavenCare dengan placeholder logo yang mempunyai slot ukuran tetap; SmartSave/SmartMave tidak muncul.
2. Desktop menampilkan form glass di kiri dan HavenCare AI attraction panel di kanan tanpa device frame atau elemen aplikasi mobile.
3. Login dan register memakai AuthWebShell yang sama; segmented switch memperbarui route, title, dan active state tanpa layout jump.
4. Switching mode boleh mempertahankan email di memory tetapi tidak pernah memindahkan password, consent, atau error.
5. Field mendukung label, autocomplete, password manager, show/hide password, Enter submit, contextual validation, dan visible keyboard focus.
6. Satu aksi submit menghasilkan tepat satu request; loading, credential error, offline, retry, success, onboarding, dan role redirect mempunyai state yang jelas.
7. OAuth hanya muncul untuk provider aktif; seluruh provider dapat digunakan dengan keyboard dan mempunyai label teks.
8. Visual HavenCare AI memakai asset responsive yang teroptimasi, copy batas layanan, serta tanpa skor, diagnosis, testimoni, atau statistik palsu.
9. Pada tablet/mobile, form tetap lengkap ketika visual disederhanakan atau disembunyikan; tidak ada horizontal overflow pada 320 px dan zoom 200%.
10. Reduced motion menghentikan ambient/idle animation tanpa menghilangkan feedback focus, loading, atau error.
11. Landing, login, register, dan onboarding tidak merender PatientWorkspaceShell atau menyisakan gap rail.
12. Privacy, Terms, lupa password, dan bantuan krisis dapat dibuka tanpa kehilangan input yang aman dipertahankan.

### 19.3 Expandable Patient Rail

1. Patient login membuka /dashboard dan rail muncul dalam state default tanpa first-paint flicker.
2. Landing, login, register, dan onboarding tidak merender rail atau ruang kosong penggantinya.
3. Dalam state collapsed, pasien mengklik icon Chat HavenCare AI; /chat terbuka dan rail melebar tepat satu kali.
4. Item Chat HavenCare AI memiliki rounded active capsule, icon, label, dan aria-current=page.
5. Pasien mengklik Komunitas saat expanded; route berpindah tanpa rail collapse atau double navigation.
6. Pasien mengklik item yang sudah aktif; halaman tidak reload dan request tidak digandakan.
7. Chevron meringkas rail tanpa mengubah route.
8. Browser Back/Forward dan refresh selalu menyinkronkan active item dari pathname.
9. Draft assessment, post community, dan streaming chat tidak hilang saat rail expand/collapse.
10. Tablet menggunakan overlay dan mobile web menggunakan drawer; keduanya menutup dengan Escape/route change.
11. Rapid click, resize selama transition, route error, logout, zoom 200%, dan reduced motion tidak meninggalkan state macet.

### 19.4 Chat sesi baru

1. Pasien login membuka /chat lalu memilih Sesi baru.
2. Backend berhasil membuat sessionId sebelum welcome dialog tampil.
3. Dialog memperkenalkan HavenCare AI dan menyapa preferredName akun; fallback Sahabat bekerja bila nama kosong.
4. Pasien dapat menutup dialog, memilih starter prompt, atau memakai Quick Emoji.
5. Memilih 😟 Cemas langsung membuat dan mengirim pesan mapping tepat satu kali.
6. Saat offline atau gagal, teks tetap terlihat dengan Coba lagi/Hapus dan tidak menampilkan success palsu.
7. Memilih 🆘 Bantuan sekarang langsung membuka Crisis Override sebelum respons AI.
8. Tombol Ringkasan pada composer membuka Wellbeing Overview dengan sumber dan waktu pembaruan.
9. Overview kosong/parsial/stale/error tidak membuat angka kesehatan fallback.
10. Gunakan di sesi meminta consent sebelum data overview masuk context HavenCare AI.
11. Existing session tidak menampilkan welcome dialog lagi.
12. Voice, TTS, keyboard, screen reader, text besar, dan reduced motion tetap berfungsi.

### 19.5 Assessment

1. Pasien membuka Self Check-in.
2. Halaman 1/3 menampilkan Mood Wheel dan baru dapat dilanjutkan setelah mood dipilih.
3. Halaman 2/3 menampilkan Sleep Quality Slider dengan lima label, rentang jam, dan emoji.
4. Halaman 3/3 menerima tulisan atau transkrip suara maksimal 250 karakter.
5. State analyzing dan ringkasan tetap berada pada halaman 3/3; tidak ada halaman keempat.
6. Back, refresh, atau keluar tidak mengubah draft menjadi completed.
7. Hasil menampilkan refleksi tentatif, disclaimer, dan next action tanpa diagnosis atau skor kesehatan palsu.
8. Narasi berisiko tinggi memicu Crisis Override tanpa menunggu alur selesai.

### 19.6 Komunitas

1. Pasien membuka /community dan melihat layout web timeline, Komunitasku, serta rekomendasi tanpa halaman Home baru.
2. Pasien mencari community dan memfilter hasil untuk Gen Z, lansia, atau semua usia.
3. Pasien membuka aturan community lalu melakukan Join; navigation, count, dan Komunitasku ikut diperbarui.
4. Pasien membuat post dengan alias, topik, gambar/alt text opsional, serta content warning.
5. Precheck aman mempublikasikan post; precheck bermasalah menjaga draft dan memberi kesempatan revisi.
6. Pasien memilih reaction melalui picker berwarna, membalas, membuat satu tingkat reply, menyimpan, atau membagikan post.
7. Mutation gagal melakukan rollback dan menampilkan retry; tidak ada count sukses palsu.
8. Pasien dapat report dan block; report masuk moderation queue serta menampilkan status.
9. Konten krisis membuka Crisis Override privat tanpa memberi label publik pada penulis.
10. Mode text besar, keyboard, screen reader, dan reduced motion tetap mempertahankan seluruh fungsi.

### 19.7 Krisis

1. Sinyal krisis terdeteksi dari salah satu input.
2. Crisis Override muncul pada viewport aktif.
3. Kontak bantuan dapat diakses dengan keyboard dan layar kecil.
4. Pengguna dapat menelepon, membaca opsi IGD, atau menghubungi orang tepercaya.
5. Tidak ada diagnosis, resep, atau copy menyalahkan.

### 19.8 Role dan keamanan

1. Patient tidak dapat membuka rute doctor/admin.
2. Doctor tidak dapat membuka admin telemetry tanpa role admin.
3. Admin tidak diarahkan ke dashboard pasien.
4. Pengguna logout tidak dapat melihat data dari cache halaman sebelumnya.
5. UI tidak menampilkan plaintext sensitif pada title, notification preview, atau log analytics.

### 19.9 Konsistensi SaaS lintas halaman

1. Landing, auth, dashboard, chat, assessment, community, profile, dan doctor workspace memakai root gradient, glass surface, Urbanist, radius, focus ring, serta CTA token yang sama.
2. Admin/SOC memakai dark-glass HavenCare dan accent turquoise tanpa mengubah makna warna ALLOW/WATCH/PROBE/BLOCK.
3. Navigasi antarpage tidak menghasilkan flash theme, font swap berlebihan, gap rail, stale active item, atau scroll horizontal.
4. Page title, metadata, logo alt, aria-label, empty/error copy, notification, dan AI identity hanya memakai HavenCare atau HavenCare AI sesuai konteks.
5. Tidak ditemukan string Freud, SmartSave, SmartMave, identitas project lama, token espresso, atau component variant legacy pada UI produksi.
6. Card/shell memakai radius token; tidak ada sudut image/skeleton/focus yang keluar dari rounded clipping.
7. Teks panjang, mode Teks besar, Bahasa Indonesia, dan zoom 200% melakukan reflow tanpa overlap dengan icon, badge, button, atau panel.
8. Setiap route mempunyai loading/error recovery dan tidak menampilkan blank white screen ketika chunk/API gagal.
9. Setiap mutation diuji pada rapid click, slow response, timeout, retry, stale response, dan route change tanpa duplicate effect.
10. Modal, drawer, popover, tooltip, toast, dan Crisis Override mengikuti layer token; Crisis Override selalu paling tinggi.
11. Draft chat, assessment, dan community tidak hilang akibat rail expand, resize, panel collapse, atau transient network error kecuali pengguna menghapusnya.
12. Semua flow utama dapat diselesaikan dengan keyboard, touch, mouse, screen reader, reduced motion, dan high-contrast/fallback glass.

### 19.10 Remediation temuan implementasi

1. package.json dan root package entry pada lockfile memakai `havencare-frontend` tanpa perubahan dependency tidak disengaja.
2. Root metadata dan seluruh page title memakai HavenCare; metadata publik tidak memuat klaim teknis/klinis atau data sensitif.
3. Urbanist dimuat pada root; Montserrat tidak diunduh public/patient; JetBrains Mono hanya aktif pada SOC/teks teknis.
4. /dashboard dapat dibuka langsung oleh patient, ditolak untuk role lain, dan mempunyai loading/error recovery.
5. ROLE_HOME.patient baru berubah ke /dashboard setelah test poin 4 lulus; tidak ada fallback `?? "/chat"` yang tersisa pada resolver role.
6. Login, onboarding, landing, expired session, dan wrong-role redirect memakai resolver yang sama serta tidak membentuk loop.
7. /privacy, /terms, dan /help mempunyai konten tervalidasi serta link hidup, atau link tidak dirender sama sekali.
8. Visible brand scan bernilai nol untuk identity legacy; alias internal hanya sesuai allowlist sementara.
9. Rename shared component tidak menghasilkan missing import, duplicate CSS, perubahan event, atau perbedaan accessibility contract.
10. Namespace guardrail lama, bila masih dibutuhkan backend, hanya muncul dalam adapter/log internal dan tidak bocor ke UI pasien.
11. Migrasi theme page-by-page lulus screenshot diff untuk state normal/loading/error/modal dan fallback tanpa blur.
12. Rollback resolver/theme alias dapat dilakukan tanpa menghapus data, draft, route page, atau kontrak backend.

---

## 20. Keputusan yang Membutuhkan Validasi Sebelum Produksi

Poin berikut tidak boleh dianggap benar hanya karena ada di mockup atau dokumen revisi:

- nomor hotline dan ekstensi aktif;
- identitas, foto, spesialisasi, dan SIP dokter;
- klaim zero-plaintext dan TTL yang benar-benar diterapkan backend;
- kebijakan penyimpanan history chat;
- wording consent dan disclaimer;
- thresholds dan escalation protocol untuk krisis;
- validasi klinis copy serta pemisahan tegas jika modul PHQ-9/GAD-7 dibuat di luar wellness assessment;
- mekanisme moderation serta response time manusia;
- dukungan voice recording/TTS pada browser target;
- asset final placeholder logo dan HavenCare AI auth hero beserta hak penggunaan, ukuran, serta crop yang disetujui.

Semua poin tersebut membutuhkan pemilik keputusan, bukti verifikasi, dan tanggal review.

---

## 21. Gate Verifikasi SaaS Lintas Halaman

| Page/area | Shell dan tema | Flow primer yang wajib lulus | Failure state minimum |
|---|---|---|---|
| Landing | PublicShell, glass turquoise | Emotion Entry → auth-aware Chat HavenCare AI | JS/image/auth check gagal |
| Login/Register | AuthWebShell | validate → submit → role/onboarding redirect | invalid, offline, duplicate submit, expired response |
| Onboarding | Public/Auth continuation | role → preference → consent → dashboard | refresh tengah flow, consent error |
| Dashboard | PatientWorkspaceShell | check-in → quick action → destination | empty appointment, partial data, stale data |
| Chat | PatientWorkspaceShell + Chat shell | new session → welcome → send/emoji/voice → response | create/send/stream/TTS gagal, crisis override |
| Assessment | AssessmentWebShell | page 1 → 2 → 3 → result pada 3/3 | draft restore, analyze gagal, crisis override |
| Community | CommunityWebShell | search/join/post/react/reply/report | optimistic rollback, moderation, offline draft |
| Profile | PatientWorkspaceShell | edit preference → save → apply root | conflict, invalid value, save retry |
| Doctor | DoctorWorkspaceShell | patient list/detail/license sesuai permission | forbidden, missing patient, verification error |
| Admin/SOC | SocWorkspaceShell dark glass | telemetry review sesuai role | forbidden, degraded stream, stale signal |

Traceability revisi:

| Permintaan desain | Bab aturan | Status dokumen |
|---|---|---|
| Brand project HavenCare dan AI bernama HavenCare AI | 0.2, 2.2, 18, 19.9 | Sudah dinormalkan global |
| Glass biru-turquoise, rounded, font, dan tema terhubung | 4.1–4.6 | Token dan fallback normatif tersedia |
| Landing interaktif menuju fitur chat utama | 5 | Flow, route, state, responsive, dan analytics tersedia |
| Login/Register clean glass split web | 6 | Form, identity, visual AI, motion, dan failure state tersedia |
| Dashboard sebagai patient home | 7 | Layout, state, komponen, dan acceptance tersedia; route masih harus dibuat di kode |
| Chat personal, welcome, emoji, overview, voice/TTS | 8 | Flow dan kontrak lengkap |
| Crisis support global | 9 | Override lintas input tersedia |
| Assessment tepat 3 halaman | 10 | Mood Wheel, Sleep Slider, Expression Analysis tersedia |
| Community ala X/Tweet untuk Gen Z/lansia | 11 | Layout, fitur, moderation, dan data contract tersedia |
| Expandable rounded navigation | 12.1–12.12 | Desktop/tablet/mobile dan anti-bug tersedia |
| Profile/preferences lintas page | 12.13 | Group, persistence, conflict, dan acceptance tersedia |
| State, accessibility, bahasa lintas generasi | 13–14 | Loading/error/offline/a11y/cross-gen tersedia |
| SaaS component dan implementation mapping | 15–17 | Contract, ownership, dan urutan migrasi tersedia |
| Solusi gap package/metadata/font/dashboard/legacy/legal/theme | 16.2–16.7 dan 19.10 | Remediation, urutan aman, rollback, dan acceptance tersedia |

Status `Sudah` pada tabel ini berarti aturan Markdown telah diverifikasi; bukan berarti source code frontend sudah mengimplementasikannya.

Release gate wajib:

1. Brand scan menghasilkan nol identity legacy yang terlihat pengguna.
2. Token scan menghasilkan nol hex/radius/shadow baru di JSX kecuali daftar pengecualian domain yang disetujui.
3. Route smoke test memastikan setiap CTA/link mempunyai destination valid dan tidak menghasilkan 404/open redirect.
4. Component test mencakup keyboard, focus, accessible name, loading, disabled, error, dan rapid interaction.
5. E2E mencakup landing→register→onboarding→dashboard→chat, login existing user, assessment 3 halaman, community mutation/rollback, crisis flow, dan role denial.
6. Visual regression dijalankan pada 320/768/1024/1440/1920 px, zoom 100/200%, teks panjang, reduced motion, serta tanpa backdrop-filter.
7. Accessibility scan otomatis dilengkapi pemeriksaan manual keyboard dan screen reader pada flow utama.
8. Performance budget memverifikasi LCP, CLS, INP, ukuran hero/font, serta tidak ada animation loop berlebih.
9. Tidak ada console error, unhandled promise rejection, hydration mismatch, duplicate key, missing accessible label, atau request ganda pada skenario uji.
10. Keputusan klinis, hotline, consent, privacy claim, voice/TTS, moderation SLA, dan asset rights telah divalidasi pemilik terkait.

---

## 22. Ringkasan Aturan Final

1. HavenCare adalah platform; HavenCare AI adalah asisten refleksi.
2. Pasien masuk ke dashboard, bukan langsung ke chat.
3. Seluruh website memakai HavenCare Glass SaaS: glass biru-turquoise, Calm Turquoise, Sage, Sunrise, Clean Canvas, token radius, dan Urbanist yang konsisten.
4. SOC memakai dark-glass HavenCare dengan accent turquoise serta mempertahankan warna status operasional.
5. Landing adalah responsive web interaktif berpusat pada Emotion Entry dan jalur nyata menuju Chat HavenCare AI; kontrol anonim, ambiguitas, serta fitur dekoratif yang tidak bekerja dilarang.
6. Login/register memakai wordmark HavenCare, glass AuthWebShell responsive, form di kiri, serta HavenCare AI attraction panel di kanan; SmartSave/SmartMave dan copy finansial dilarang.
7. Workspace pasien memakai expandable rail rounded Deep Turquoise Glass; komponen tidak muncul pada landing/login/register/onboarding dan tidak menggantikan navigasi dokter/SOC.
8. Tidak ada Freud, skor wellbeing fiktif, statistik palsu, atau testimoni tanpa bukti.
9. Chat HavenCare AI berupa responsive web dengan welcome dialog personal, Quick Emoji auto-send, Wellbeing Overview dari composer, starter prompts, voice/TTS yang nyata, serta Crisis Override langsung.
10. Assessment adalah responsive web tepat 3 halaman: Mood Wheel, Sleep Quality Slider, dan Expression Analysis; tidak diklaim sebagai PHQ-9/GAD-7.
11. Community hanya berada pada /community dan memakai responsive web tiga kolom ala X/Tweet dengan Komunitasku, discovery, search, join, post, reaction, thread, report, moderation, serta akses setara bagi Gen Z dan lansia.
12. Tidak ada resep, tebus obat, pembayaran obat, atau klaim diagnosis.
13. Crisis Override mengalahkan alur normal di semua permukaan input kesehatan mental.
14. Setiap implementasi selesai hanya setelah lulus acceptance, accessibility, privacy, dan role-security checks pada dokumen ini.
15. Temuan package, metadata, font, dashboard, redirect, identity legacy, legal route, dan theme migration diselesaikan mengikuti remediation Bab 16.2–16.7; tidak boleh ditutup hanya dengan perubahan copy visual.
