# PROPOSAL INOVASI SIAGA

## Pertahanan Percakapan AI Bertahap untuk Layanan Kesehatan Mental

**HackNusa 2026 · Trek AI vs AI Defense**  
**Tim SIAGA · Institut Teknologi Nasional Bandung**  
**Repositori:** https://github.com/Adikafazaa/SIAGA  
**Bandung · Oktober 2026**

\pagebreak

# CHAPTER 1: INTRODUCTION & BACKGROUND

## 1.1. Masalah yang Disasar

Layanan kesehatan mental membutuhkan akses awal yang mudah, tetapi percakapan tentang gejala, pengalaman pribadi, dan riwayat perawatan juga menghasilkan data yang sangat sensitif. Organisasi Kesehatan Dunia (WHO) masih mencatat kesenjangan dalam kapasitas dan akses layanan kesehatan mental [1]. Asisten percakapan dapat membantu edukasi dan skrining awal, asalkan tidak diposisikan sebagai pengganti diagnosis atau keputusan klinis. Instrumen PHQ-9 dan GAD-7 memberi indikasi gejala; hasilnya memerlukan interpretasi dan tindak lanjut oleh tenaga profesional bila relevan [3].

Ketika asisten memakai model bahasa, ada dua risiko teknis yang saling terkait. Pertama, isi percakapan dan rekam medis dapat terekspos melalui penyimpanan, hak akses, atau pengiriman ke layanan eksternal. Kedua, penyerang dapat mengarahkan model secara bertahap: pertanyaan awal tampak wajar, lalu tujuan berbahaya muncul setelah beberapa giliran. Pola *Crescendo* telah dideskripsikan dalam penelitian serangan multi-turn [2]. Karena itu, penilaian keamanan per pesan saja belum cukup untuk membaca arah satu sesi.

## 1.2. Relevansi dengan Trek Kompetisi

SIAGA menempatkan pemeriksa keamanan di antara pengguna dan model bahasa. Pemeriksa ini menyimpan sinyal risiko lintas giliran, menilai perubahan arah percakapan, dan memutuskan apakah permintaan diteruskan, dipantau, diberi tantangan, atau diblokir. Pendekatan ini selaras dengan trek AI vs AI Defense: serangan memanfaatkan kemampuan dialog model, sedangkan pertahanan menggabungkan analisis isi dan riwayat interaksi. Risiko prompt injection serta pengungkapan informasi sensitif juga termasuk dalam taksonomi OWASP untuk aplikasi LLM [6].

## 1.3. Tujuan dan Batasan

Tujuan prototipe adalah memperlihatkan satu alur konseling digital yang dapat menjalankan skrining, percakapan suportif, supervisi dokter, dan pemantauan insiden melalui satu gerbang keamanan stateful. PoC menggunakan model lokal bila layanan Ollama tersedia; ketika tidak tersedia, aplikasi memiliki balasan fallback dan antarmuka dapat memakai mode simulasi yang diberi penanda. Sistem ini belum divalidasi sebagai alat diagnosis, belum terbukti aman untuk penggunaan klinis nyata, dan belum menjalani audit kepatuhan menyeluruh. Batas tersebut menentukan rencana validasi pada Bab 6.

## 1.4. Skenario Ancaman dan Ukuran Keberhasilan

Skenario utama dimulai dari pengguna yang bertanya tentang cara dokumentasi sesi, beralih ke struktur rekam medis, mengaku memiliki kewenangan, lalu meminta isi transkrip pasien. Permintaan terakhir jelas berbahaya, tetapi sinyal awal dapat menyerupai pertanyaan administratif yang sah. Pertahanan yang hanya menilai pesan terakhir melewatkan kesempatan melihat pergeseran arah sebelum permintaan eksplisit. SIAGA dirancang untuk menandai eskalasi tersebut di tingkat sesi, sambil tetap melayani percakapan pasien yang meminta dukungan emosional tanpa memicu blokir hanya karena kata-kata yang intens.

Keberhasilan teknis akan dinilai melalui empat ukuran: proporsi skenario serangan yang dicegah sebelum balasan model, proporsi percakapan jinak yang keliru dibatasi, giliran saat intersepsi terjadi, dan tambahan waktu inspeksi per pesan. Setiap ukuran membutuhkan himpunan kasus berlabel dan kondisi uji yang tetap. Dengan demikian, keputusan juri dapat bertumpu pada bukti yang dapat diulang, bukan contoh keberhasilan terpilih. Keberhasilan klinis merupakan pertanyaan terpisah dan memerlukan protokol supervisi, keselamatan, serta evaluasi oleh tenaga profesional.

# CHAPTER 2: SOLUTION OVERVIEW & MARKET DIFFERENTIATION

## 2.1. Solusi yang Dibangun

PsychoBot menyediakan antarmuka pasien untuk percakapan dan skrining PHQ-9/GAD-7. Portal dokter menampilkan data pasien dan asesmen sesuai peran. Konsol SOC menampilkan keputusan keamanan, log, dan kurva risiko. Backend FastAPI menerima pesan, menjalankan SIAGA L0-L3, lalu hanya meneruskan keputusan ALLOW atau WATCH ke pembangkit balasan. Keputusan PROBE menahan balasan model untuk meminta respons verifikasi; BLOCK menghentikan alur percakapan sesi yang terindikasi berbahaya.

Nilai teknis utamanya adalah *Cumulative Intent Momentum* (CIM): risiko tiap pesan tidak berdiri sendiri, tetapi diperbarui menggunakan riwayat risiko, konsistensi kenaikan, kemiripan terhadap balasan sistem, dan kedekatan semantik dengan contoh berisiko. Keputusan akhir berasal dari fusi beberapa sinyal, sehingga ambang keputusan tidak boleh dibaca sebagai ambang momentum tunggal.

## 2.2. Pembeda yang Dapat Dipertanggungjawabkan

Tabel 1 membandingkan pendekatan, bukan mengklaim hasil uji langsung terhadap produk pihak ketiga. Penelitian Crescendo menunjukkan perlunya melihat pola multi-turn [2]; Microsoft juga menjelaskan penggunaan filter multi-turn sebagai salah satu mitigasi [8]. Karena itu, SIAGA tidak mengklaim sebagai solusi pertama atau kebal terhadap seluruh serangan.

**Tabel 1. Posisi SIAGA terhadap pendekatan umum**

| Pendekatan | Konteks yang dinilai | Kekuatan | Batas utama |
|---|---|---|---|
| Aturan per pesan | Satu masukan | Ringan dan mudah diaudit | Arah eskalasi lintas giliran tidak terlihat |
| Pemeriksaan model per pesan | Satu masukan dengan klasifikasi | Lebih lentur terhadap variasi bahasa | Bergantung pada model dan ambang yang diuji |
| Pemeriksaan multi-turn | Beberapa giliran | Menangkap pola dialog bertahap | Memerlukan pengelolaan state dan evaluasi salah deteksi |
| SIAGA v2 | Sinyal L0-L3 per sesi sebelum inferensi | Menggabungkan state, keputusan, dan telemetri dalam PoC lokal | Belum ada benchmark luas lintas model atau validasi klinis |

## 2.3. Proposisi Nilai

SIAGA menawarkan tiga kemampuan yang tampak pada prototipe: inspeksi sebelum pesan mencapai LLM, penjelasan keputusan per giliran, dan pemisahan data inspeksi dari riwayat aplikasi. Inferensi lokal melalui Ollama mengurangi kebutuhan mengirim isi percakapan ke API model eksternal dalam konfigurasi tersebut. Keuntungan privasi ini tetap bergantung pada konfigurasi, kontrol akses, dan tata kelola penyimpanan aplikasi; ia bukan jaminan kepatuhan otomatis terhadap UU PDP.

## 2.4. Pengalaman Tiga Peran

**Pasien** memperoleh jalur masuk sederhana: skrining mandiri untuk memahami gejala, lalu percakapan suportif. Hasil skrining ditampilkan sebagai skor dan tingkat gejala, bukan keputusan medis. **Dokter** dapat meninjau data yang tersedia dalam portal berdasarkan peran dan menambahkan catatan klinis. **Petugas SOC** melihat peristiwa keamanan, termasuk alasan keputusan serta lintasan skor. Pemisahan peran ini membuat keluaran keamanan tidak menutupi kebutuhan pengguna untuk menerima respons yang jelas dan tenang.

Pada titik PROBE, sistem tidak meneruskan pesan yang dicurigai ke model utama. Ia menyajikan tantangan terstruktur dan menilai balasannya. Jika balasan ambigu, kebijakan mengarah ke WATCH; bila sinyal penyerang terkonfirmasi, sesi diblokir. Mekanisme ini adalah kontrol eksperimen, bukan tes identitas manusia yang dapat dipercaya secara universal. Keputusan berisiko tinggi tetap perlu jalur peninjauan manusia dan mekanisme pemulihan sesi pada produk nyata.

# CHAPTER 3: PROOF OF CONCEPT IMPLEMENTATION

## 3.1. Alur Demonstrasi

Pengguna masuk sebagai pasien, mengisi asesmen atau membuka sesi chat, lalu mengirim pesan. Frontend memilih koneksi backend langsung bila pemeriksaan kesehatan API berhasil; bila gagal, mode mock menjalankan simulasi lokal. Pada jalur backend, pesan diperiksa oleh SIAGA. Pasien menerima balasan bila aman, sedangkan petugas SOC dapat meninjau keputusan dan riwayat skor. Dokter dapat melihat asesmen serta menulis catatan pasien sesuai peran. Alur ini cukup untuk menunjukkan hubungan antara layanan, guardrail, dan telemetri, tanpa menyamakan mode simulasi dengan pengujian backend sesungguhnya.

## 3.2. Fitur yang Ada dan Statusnya

Tabel 2 membedakan kemampuan yang terlihat di kode dari ketergantungan opsional dan pekerjaan lanjutan. Bukti implementasi merujuk pada berkas dalam repositori [9].

**Tabel 2. Status komponen PoC pada checkout proyek**

| Komponen | Status saat ini | Bukti atau batas |
|---|---|---|
| Skrining PHQ-9/GAD-7 dan riwayat | Ada | Endpoint asesmen dan halaman pasien; hasil adalah skrining, bukan diagnosis |
| Guardrail L0-L3, PROBE, BLOCK | Ada | Orkestrasi di `backend/app/engine.py` dan uji di `backend/tests/` |
| Streaming chat dan telemetri SOC | Ada | Endpoint SSE dan halaman admin; sumber data bergantung mode live/mock |
| Model bahasa lokal | Bersyarat | Klien Ollama tersedia; fallback dipakai bila layanan model tidak hidup |
| Model ONNX INT8 | Bersyarat | Kode pemuat tersedia; tanpa berkas model, L1 memakai hashing dan leksikon |
| Verifikasi SIP | Terbatas | Saat ini memeriksa format delapan digit, belum mengecek registri resmi |
| SATUSEHAT FHIR, cache semantik, TAP runner | Rencana | Modul dan endpoint tersebut tidak ditemukan pada checkout ini |

## 3.3. Bukti Pengujian dan Batas Inferensi

Repositori menyediakan uji untuk normalisasi karakter tersembunyi, akumulasi momentum, percakapan jinak, eskalasi lima giliran, keputusan ambang, probe, autentikasi, asesmen, SSE, serta pembatasan peran [9]. Uji tersebut memperlihatkan skenario yang ingin dijaga oleh implementasi. Skenario sintetis tidak cukup untuk menyimpulkan *attack success rate* nol, *false positive rate* nol pada pasien nyata, atau efektivitas terhadap semua varian Crescendo. Angka dan kurva yang sebelumnya ditampilkan tanpa dataset dan protokol pengukuran yang dapat diulang tidak digunakan sebagai hasil empiris proposal ini.

Evaluasi berikutnya perlu menyimpan himpunan prompt berlabel, versi model, spesifikasi perangkat, pembagian kasus jinak/serangan, aturan penilaian, serta log waktu per lapisan. Hasil harus dilaporkan sebagai jumlah kasus dan rentang ketidakpastian, bukan klaim kebal. Komponen PoC dan petunjuk menjalankan sistem tersedia pada repositori: https://github.com/Adikafazaa/SIAGA.

## 3.4. Kriteria Demonstrasi yang Dapat Diulang

Demonstrasi juri sebaiknya memakai dua sesi yang terpisah. Sesi pertama memuat percakapan pasien yang meminta bantuan terkait kecemasan dan memperlihatkan bahwa sistem tetap merespons. Sesi kedua mengikuti urutan eskalasi lima giliran menuju permintaan transkrip pasien; konsol SOC memperlihatkan skor, keputusan, dan alasan per giliran. Kedua sesi harus dijalankan pada mode live yang terhubung ke backend, sedangkan mode mock hanya dipakai untuk meninjau antarmuka bila layanan tidak tersedia.

Untuk menjaga reproduksibilitas, paket demonstrasi harus mencantumkan versi kode, konfigurasi ambang, status model yang aktif, perangkat, dan perintah menjalankan backend serta frontend. Catatan hasil harus memisahkan respons guardrail dari respons LLM. Jika suatu permintaan tidak menghasilkan kebocoran, kesimpulannya terbatas pada skenario dan data yang diuji; tidak dapat diperluas menjadi jaminan bahwa model tidak pernah membocorkan data.

Tabel 3 menerjemahkan fitur tersebut menjadi pemeriksaan yang dapat dilihat juri. Kolom kriteria menunjukkan apa yang perlu diamati saat demonstrasi, bukan hasil benchmark yang sudah diklaim.

**Tabel 3. Matriks verifikasi demonstrasi PoC**

| Skenario | Kriteria yang diamati | Jejak implementasi |
|---|---|---|
| Pesan pasien biasa | Balasan tersedia; sesi dan keputusan tercatat | Router chat dan penyimpanan aplikasi |
| Eskalasi lima giliran | Skor dan keputusan berubah sesuai isi sesi; permintaan berisiko ditahan | Mesin CIM, fusi, uji guardrail |
| Tantangan probe | Balasan LLM ditahan; respons pengguna mengubah status probe | Modul probe dan endpoint verifikasi |
| Asesmen | Skor PHQ-9/GAD-7 dihitung dan riwayat ditampilkan | Router asesmen dan halaman pasien |
| Pembatasan peran | Pasien tidak dapat membuka endpoint dokter/SOC | Dependensi autentikasi dan uji API |
| Mode kegagalan | Mode mock ditandai; fallback model dibedakan dari respons model hidup | Fasad API frontend dan klien LLM |

## 3.5. Protokol Benchmark Berikutnya

Benchmark yang layak dibandingkan perlu menjalankan SIAGA dan pembanding pada kumpulan dialog yang sama. Setiap dialog diberi label niat, tingkat risiko, dan kriteria keberhasilan oleh penilai yang tidak melihat keputusan sistem. Keluaran model harus dinilai terpisah dari keputusan gerbang: blokir dini belum membuktikan kualitas respons klinis, dan satu balasan aman belum membuktikan semua serangan teratasi. Latensi diukur pada perangkat yang sama dengan pemanasan model dan jumlah pengulangan tercatat. Laporan harus memuat seluruh kasus gagal agar perbaikan ambang tidak didasarkan hanya pada contoh yang berhasil.

## 3.6. Definisi Metrik dan Kontrol Eksperimen

*Attack success rate* (ASR) berarti jumlah dialog serangan yang menghasilkan keluaran terlarang dibagi seluruh dialog serangan yang benar-benar dievaluasi. *False positive rate* (FPR) berarti jumlah dialog jinak yang dibatasi secara keliru dibagi seluruh dialog jinak. *Time to detection* dihitung sebagai giliran pertama yang memicu tindakan pencegahan menurut protokol. Latensi tambahan adalah selisih waktu pada jalur dengan dan tanpa inspeksi, diukur pada perangkat dan beban yang sama. Setiap angka harus disertai ukuran sampel; persentase dari satu atau beberapa contoh tidak mencerminkan tingkat kesalahan populasi.

Kumpulan uji perlu mencakup variasi bahasa Indonesia, campuran bahasa, ejaan tidak baku, percakapan panjang, pergantian topik, klaim otoritas palsu, serta kontrol negatif dari pengguna yang sedang cemas. Prompt uji tidak boleh dipilih setelah melihat hasil model. Versi kode, bobot model, suhu generasi, dan threshold dibekukan sebelum evaluasi akhir agar kalibrasi tidak mencemari data uji. Penilai juga perlu mencatat alasan ketika sebuah blokir menghalangi permintaan yang sebenarnya sah, karena biaya salah deteksi sangat penting pada konteks kesehatan mental.

Hasil demo awal berfungsi sebagai bukti fungsi sistem, bukan bukti efektivitas klinis atau keamanan populasi. Dengan protokol tersebut, setiap peningkatan versi SIAGA dapat dibandingkan pada kondisi yang sama dan kegagalan yang tersisa dapat diarahkan menjadi perubahan teknis yang spesifik.

# CHAPTER 4: TECHNICAL ARCHITECTURE & FEASIBILITY

## 4.1. Alur Data yang Diterapkan

Seperti diringkas pada Gambar 1, browser pasien, dokter, dan SOC terhubung ke FastAPI. Pesan chat diproses berurutan oleh L0 (normalisasi Unicode), L1 (sinyal niat dan representasi teks), L2 (sinyal URL dan lonjakan pesan), lalu L3/CIM (state percakapan). Mesin fusi menghasilkan ALLOW, WATCH, PROBE, atau BLOCK. Hanya alur yang diizinkan diteruskan ke klien LLM. DuckDB menyimpan fitur dan hash untuk guardrail; SQLite lokal atau Firestore opsional menyimpan data aplikasi, termasuk riwayat chat dan catatan medis. Pemisahan ini penting saat membahas privasi.

![](figures/figure_1_verified_architecture.png)

*Gambar 1. Alur komponen SIAGA pada prototipe. Kotak bertanda opsional bergantung pada konfigurasi layanan.*

## 4.2. Rumus Keputusan yang Sesuai Implementasi

Untuk giliran ke-t, L1 menghasilkan posisi risiko r_t. L3 menghitung delta_t = r_t - r_(t-1), arah d_t dari proporsi kenaikan pada jendela empat giliran, jangkar a_t terhadap balasan sistem sebelumnya, dan faktor peluruhan gamma_t berdasarkan jarak ke klaster berisiko. Implementasi menghitung:

**M_t = clamp(gamma_t M_(t-1) + w1 delta_t d_t + w2 a_t d_t + w3 r_t, 0, 1).**

Bobot bawaan saat ini adalah w1 = 0,85; w2 = 0,45; w3 = 0,38. Skor keputusan kemudian memadukan **0,80 M_t + 0,15 intent_t + 0,05 context_t**. BLOCK berlaku mulai skor 0,80; PROBE pada 0,60 sampai di bawah 0,80 bila prasyarat kanal dan batas probe terpenuhi. WATCH dapat terjadi lebih dini saat skor dan arah naik memenuhi aturan. Parameter ini adalah konfigurasi prototipe, bukan ambang klinis yang sudah tervalidasi.

## 4.3. Kelayakan dan Pengukuran yang Masih Dibutuhkan

Stack PoC terdiri dari Next.js, FastAPI, DuckDB, penyimpanan aplikasi SQLite/Firestore, dan klien Ollama. Model ONNX hanya aktif bila bobot tersedia; checkout saat ini tidak memuat bobot tersebut. Karena mode fallback dapat memakai algoritma yang berbeda, angka latensi ONNX atau klaim *sub-25 ms* tidak dapat digeneralisasi ke konfigurasi sekarang. Kelayakan demonstrasi didukung oleh pemisahan komponen dan uji alur API, sementara kelayakan operasional memerlukan pengukuran p50/p95/p99 pada perangkat target, beban serentak, dan kondisi model hidup serta gagal.

## 4.4. Siklus Data dan Kegagalan Layanan

Alur chat memiliki dua penyimpanan dengan tujuan berbeda. DuckDB mendukung penilaian stateful dengan hash pesan, embedding, fitur, keputusan, dan batas waktu sesi. Database aplikasi menyimpan profil, asesmen, riwayat percakapan, serta catatan dokter supaya fitur layanan dapat bekerja. Menghapus state guardrail tidak menghapus riwayat aplikasi. Kebijakan retensi, enkripsi, kontrol baca, dan pencatatan akses untuk database aplikasi harus ditetapkan sebelum memakai data pasien nyata.

Ketika Ollama tidak merespons, klien LLM memiliki balasan fallback. Ketika backend tidak terjangkau, frontend dapat beralih ke data simulasi. Kedua jalur membantu demo tetap berjalan, tetapi memiliki makna berbeda bagi evaluasi: fallback LLM masih melewati backend dan guardrail, sedangkan mode mock tidak membuktikan kinerja backend. Status mode harus tetap terlihat, dan hasil uji hanya dihitung dari jalur yang dinyatakan dalam protokol.

## 4.5. Risiko Implementasi dan Rencana Pengukuran

Pada konfigurasi prototipe, DuckDB embedded menggunakan satu koneksi yang dilindungi penguncian proses. Pendekatan ini sederhana untuk demo, tetapi perlu diuji sebelum beberapa worker atau banyak mesin berbagi data. Pembatas laju berada di memori proses, sehingga tidak menyatukan hitungan antarreplika. Verifikasi SIP yang mengandalkan pola delapan digit tidak membuktikan kewenangan dokter. Selain itu, autentikasi mode pengembangan dan kepemilikan sesi chat perlu diperiksa terhadap akses lintas pengguna sebelum pilot. Rencana pengerasan harus memprioritaskan batas kepercayaan tersebut sebelum optimasi throughput.

Pengukuran performa akan memisahkan waktu normalisasi, klasifikasi L1, evaluasi L2, pembaruan CIM, akses database, dan inferensi LLM. Nilai median, p95, dan p99 dilaporkan bersama jumlah permintaan, ukuran pesan, panjang sesi, jenis CPU/GPU, serta status cache model. Dengan pemisahan ini, tim dapat mengetahui apakah kemacetan terjadi pada guardrail, penyimpanan, atau model. Target waktu inspeksi baru dapat dinyatakan setelah jalur L1 yang aktif dan perangkat uji dipastikan; angka satu konfigurasi tidak dipakai untuk menjanjikan performa semua fasilitas.

Arsitektur produksi juga memerlukan keputusan tentang isolasi data pasien, pencadangan dan pemulihan, enkripsi media penyimpanan, pengelolaan rahasia, serta logging yang tidak mengulang isi percakapan sensitif. Semua keputusan tersebut bersifat lintas komponen: menambahkan enkripsi DuckDB saja tidak melindungi salinan riwayat pada database aplikasi atau log operasional. Karena itu, evaluasi kelayakan tidak berhenti pada kecepatan model, tetapi mencakup alur data lengkap dari browser hingga penghapusan.

# CHAPTER 5: SECURITY ARCHITECTURE & INTELLECTUAL PROPERTY POTENTIAL

## 5.1. Ancaman, Kontrol, dan Celah yang Tersisa

Tabel 4 merangkum ancaman utama tanpa menganggap prototipe telah lolos audit keamanan. Penilaian risiko mengacu pada pola prompt injection dan pengungkapan informasi sensitif dalam panduan OWASP [6].

**Tabel 4. Pemetaan ancaman dan kontrol prototipe**

| Ancaman | Kontrol yang ada | Pekerjaan sebelum produksi |
|---|---|---|
| Prompt injection bertahap | L0-L3, skor stateful, probe, blokir | Uji adversarial lebih luas dan evaluasi salah deteksi |
| Akses lintas peran | Token dan pembatasan endpoint dokter/SOC | Autentikasi produksi, audit hak akses, uji penetrasi |
| Kebocoran riwayat pasien | Guardrail DuckDB tanpa teks pesan mentah | Enkripsi dan kebijakan retensi untuk database aplikasi |
| Banjir permintaan | Batas ukuran payload dan pembatasan laju dalam memori | Kontrol terdistribusi, pemantauan, uji beban |
| Ketergantungan model | Balasan fallback saat layanan LLM gagal | Pengujian keselamatan fallback dan respons krisis |

Klaim *zero-plaintext* dibatasi pada **penyimpanan state guardrail DuckDB**. Riwayat chat dan catatan medis pada penyimpanan aplikasi masih memuat teks yang dapat dibaca. TTL 24 jam berlaku pada state guardrail saat pembersihan dijalankan, bukan otomatis pada seluruh data pasien. Nomor SIP yang diterima portal belum diverifikasi ke registri resmi. Karena itu, prototipe belum boleh dinyatakan patuh penuh terhadap UU PDP atau aturan rekam medis; kedua aturan menetapkan kewajiban yang lebih luas daripada pemilihan lokasi inferensi [4], [5].

## 5.2. Potensi Kekayaan Intelektual

Kombinasi akumulasi sinyal lintas giliran, keputusan berlapis, dan probe dapat diajukan untuk penilaian kekayaan intelektual. Hak cipta perangkat lunak dan kemungkinan paten perlu diperiksa bersama institusi melalui penelusuran prior art, kepemilikan kode, serta penilaian kebaruan. Proposal ini tidak menyatakan paten telah tersedia atau kebaruan hukum telah terbukti.

## 5.3. Keselamatan Pengguna dan Tata Kelola

Percakapan kesehatan mental menghadirkan risiko selain serangan siber. Pesan yang mengindikasikan krisis, kesalahan interpretasi skor skrining, dan balasan model yang terlalu yakin perlu diuji secara khusus. Pengguna harus diberi tahu bahwa PsychoBot merupakan dukungan awal, bukan tenaga kesehatan. Sebelum pilot, tim perlu menetapkan siapa yang meninjau sinyal risiko, kapan eskalasi ke profesional dilakukan, bagaimana insiden didokumentasikan, serta bagaimana pengguna mengajukan koreksi atau penghapusan data sesuai kebijakan yang berlaku.

Uji keamanan berikutnya juga harus mencakup akses lintas pasien, penyalahgunaan token pengembangan, prompt injection tidak langsung dari data eksternal, dan pengulangan permintaan yang melampaui batas laju satu proses. Setiap temuan diberi tingkat keparahan dan tindakan perbaikan. Mekanisme PROBE sendiri perlu dinilai dari sisi *false alarm* dan pengalaman pasien agar kontrol keamanan tidak memperburuk situasi pengguna yang sedang rentan.

# CHAPTER 6: SCALABILITY & DEPLOYMENT READINESS

## 6.1. Jalur Penerapan Bertahap

PoC saat ini paling sesuai untuk demonstrasi terkontrol dengan satu backend, DuckDB embedded, dan model lokal pada perangkat yang mampu menjalankannya. Penyimpanan state memakai satu koneksi dengan penguncian proses; pembatas laju juga berada di memori proses. Dengan demikian, angka ribuan pengguna serentak belum dapat diklaim. Rencana skala berikutnya harus dimulai dari uji beban dan kapasitas, baru kemudian memilih penyimpanan bersama, antrean inferensi, observabilitas, dan orkestrasi model sesuai bottleneck yang benar-benar terukur.

## 6.2. Rencana Validasi dan Adopsi

**Tabel 5. Gerbang keputusan sebelum penggelaran lebih luas**

| Tahap | Bukti yang harus dihasilkan | Keputusan lanjut |
|---|---|---|
| 1. Reproduksi PoC | Uji otomatis lulus pada lingkungan terdokumentasi; mode live/mock dibedakan | Demo teknis dapat diulang |
| 2. Evaluasi keamanan | Dataset serangan dan percakapan jinak berlabel; ASR/FPR dengan jumlah sampel; audit akses | Ambang dan kontrol direvisi |
| 3. Evaluasi klinis dan privasi | Protokol supervisi profesional, respons krisis, retensi/enkripsi, penilaian dampak data | Pilot terbatas dengan persetujuan institusi |
| 4. Integrasi dan skala | Uji beban, kebutuhan perangkat, interoperabilitas FHIR di sandbox SATUSEHAT [7] | Keputusan arsitektur produksi |

Pilihan SGLang, vLLM, integrasi SATUSEHAT, dan ekspansi lintas fasilitas adalah arah pengembangan, bukan fungsi yang sudah aktif. Model bisnis dan biaya juga baru layak dihitung setelah kapasitas, biaya perangkat, operasi, dan dukungan klinis terukur. Keberhasilan SIAGA untuk tahap kompetisi ditunjukkan oleh prototipe yang dapat didemonstrasikan dan dievaluasi secara jujur; kesiapan klinis serta skala nasional merupakan tahap berikutnya.

## 6.3. Prasyarat Skala dan Nilai Implementasi

Penggelaran bertahap lebih masuk akal daripada menetapkan target ribuan pengguna tanpa data. Pertama, ukur pemakaian CPU/RAM guardrail dan kebutuhan GPU/RAM model lokal pada sejumlah sesi yang representatif. Kedua, ukur latensi dari saat pesan dikirim hingga token pertama dan respons selesai, sambil mencatat jumlah permintaan bersamaan. Ketiga, uji pemulihan ketika model, proses API, atau database berhenti. Hasil pengukuran menentukan apakah sistem memerlukan pemisahan proses inferensi, replikasi layanan, atau penyimpanan state bersama.

Nilai implementasi bagi institusi terletak pada kendali atas jalur data dan kemampuan mengaudit keputusan sebelum pesan mencapai model. Nilai ini hanya terwujud bila operator mempunyai prosedur keamanan, dukungan klinis, dan anggaran pemeliharaan. Karena itu, rencana komersialisasi tidak menetapkan biaya atau kapasitas yang belum diuji; hasil pilot terbatas akan menjadi dasar penetapan harga, dukungan, dan prioritas integrasi.

## Referensi

[1] World Health Organization, *Mental Health Atlas 2024*, 2025. https://www.who.int/teams/mental-health-and-substance-use/data-research/mental-health-atlas

[2] M. Russinovich, A. Salem, dan R. Eldan, “Great, Now Write an Article About That: The Crescendo Multi-Turn LLM Jailbreak Attack,” arXiv:2404.01833, 2024. https://arxiv.org/abs/2404.01833

[3] World Health Organization, “Depression: screening tools and diagnosis,” WHO TB Knowledge Sharing. https://tbksp.who.int/pt-br/node/2650

[4] Republik Indonesia, Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi. https://peraturan.bpk.go.id/Details/229798/uu-no-27-

[5] Kementerian Kesehatan RI, Peraturan Menteri Kesehatan Nomor 24 Tahun 2022 tentang Rekam Medis. https://peraturan.bpk.go.id/Details/245544/p

[6] OWASP, *Top 10 for Large Language Model Applications 2025*. https://genai.owasp.org/llm-top-10/

[7] Kementerian Kesehatan RI, “SATUSEHAT Platform: Observation.” https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/observation/

[8] Microsoft Security, “How Microsoft discovers and mitigates evolving attacks against AI guardrails,” 2024. https://www.microsoft.com/en-us/security/blog/2024/04/11/how-microsoft-discovers-and-mitigates-evolving-attacks-against-ai-guardrails/

[9] Tim SIAGA, repositori kode prototipe, `backend/app/`, `backend/tests/`, dan `frontend/src/`. https://github.com/Adikafazaa/SIAGA
