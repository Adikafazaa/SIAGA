# 🛡️ SIAGA Pipeline: L0 – L3 Defense-in-Depth

> **Knowledge Base Bab 1** · Platform: PsychoBot Clinical Care & SIAGA Guardrail Platform  
> **Komponen:** `backend/app/core/` & `backend/app/engine.py`  
> **Klasifikasi:** Dokumen Spesifikasi Teknis Guardrail & Formula Matematis

---

## 📌 1. Prinsip Defense-in-Depth

Pendekatan filter *stateless* konvensional (seperti regex keyword matching atau LlamaGuard mandiri) hanya memeriksa pesan secara terisolasi tanpa mengingat riwayat pesan sebelumnya. Hal ini membuat mereka **buta terhadap serangan eskalasi bertahap (Crescendo Attack)**.

SIAGA membagi evaluasi keamanan menjadi 4 lapisan berurutan dengan latensi total kumulatif **$< 25\text{ ms}$ pada CPU standar**:

| Layer | Komponen | Target Deteksi | Latensi |
|---|---|---|---|
| **L0** | Canonicalizer (UTS #39) | Obfuscation, homoglyphs, zero-width chars, bidi override | `< 1 ms` |
| **L1** | Dual-Axis Intent Classifier | Prompt injection, nada koersif, probabilitas asal mesin | `~10–15 ms` |
| **L2** | Context Evaluator | Pelanggaran persona klinis, burst rate anomaly, URL phishing | `< 1 ms` |
| **L3** | CIM Engine (Stateful Momentum) | Vektor lintasan niat kumulatif, konsistensi arah, graf semantik | `~5–10 ms` |

---

## 🔍 2. Rincian Teknis Per Lapisan

### 🔹 Lapisan L0: UTS #39 Canonicalizer ([`l0_canonicalize.py`](file:///D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA-v2/backend/app/core/l0_canonicalize.py))
Penyerang sering menggunakan karakter Unicode tak terlihat atau alfabet Cyrillic/Greek yang mirip alfabet Latin (*homoglyphs*) untuk melewati filter teks.
- **Normalisasi NFKC:** Mengubah karakter variasi ke bentuk kanonik dasar.
- **Pembersihan Zero-Width:** Menghapus `\u200b` (zero-width space), `\u200c` (ZWNJ), `\u200d` (ZWJ), dan `\ufeff`.
- **Deteksi Bidi Override:** Mendeteksi dan membersihkan pembalikan arah teks (`\u202e`) yang sering dipakai untuk mengelabui tokenizator.
- **Deteksi Homoglyph (UTS #39):** Memetakan glif rancu (misal huruf `а` Cyrillic ke `a` Latin) dan mencatat daftar anomali pada metadata inspeksi.

### 🔹 Lapisan L1: Dual-Axis Intent Classifier ([`l1_onnx_engine.py`](file:///D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA-v2/backend/app/core/l1_onnx_engine.py))
Menggunakan model representasi teks berbasis ONNX INT8 (*MiniLM-L6-v2* / *IndoBERT*) untuk inferensi CPU berkecepatan tinggi:
- **Sumbu 1 (Intent Risk - $r_N$):** Mengukur derajat niat destruktif, agresivitas, dan potensi injeksi perintah sistem.
- **Sumbu 2 (Machine Provenance):** Mengestimasi probabilitas apakah input dihasilkan oleh skrip bot otomatis atau pengetikan manusia manual (mengukur entropi, jeda sintaks, dan panjang token).
- **Proyeksi Risiko Tunggal ($r_N \in [0, 1]$):** Dihitung berdasarkan posisi koordinat semantik terhadap klaster bahaya (*harm cluster vector*).

### 🔹 Lapisan L2: Clinical Context Evaluator ([`l2_context.py`](file:///D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA-v2/backend/app/core/l2_context.py))
Memeriksa aturan batas peran konseling klinis (*clinical safety guard*):
- **Batas Farmakologi:** Memeriksa apakah pesan mencoba memaksa AI meresepkan obat keras psikotropika tanpa dokter DPJP.
- **Burst Rate Monitoring:** Menghitung jumlah pergantian pesan dalam 60 detik terakhir. Pola *bursting* cepat mengindikasikan serangan *brute-force automated script*.
- **Inspeksi URL & Payload:** Mencegah injeksi tautan berbahaya atau upaya *phishing*.

---

## 🧮 3. Lapisan L3: CIM (Conversational Intent Momentum) Engine

Komponen paling orisinal dan inovatif dalam SIAGA ([`momentum.py`](file:///D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA-v2/backend/app/core/l3_cim/momentum.py)) yang melacak akumulasi energi risiko percakapan lintas-turn.

### Formula Matematis Akumulasi Momentum:

$$M_N = \text{clamp}\left(\gamma_N \cdot M_{N-1} + w_1 \cdot \Delta_N \cdot \text{Arah}_N + w_2 \cdot \text{Anchor}_N \cdot \text{Arah}_N + w_3 \cdot r_N, \; 0, \; 1\right)$$

Dimana:

1. **Delta Risiko ($\Delta_N$):**
   $$\Delta_N = r_N - r_{N-1}$$
   Perubahan derajat risiko turn saat ini dibanding turn sebelumnya.

2. **Konsistensi Arah ($\text{Arah}_N$):**
   $$\text{Arah}_N = \frac{1}{K} \sum_{i=0}^{K-1} \mathbb{I}(\Delta_{N-i} > 0)$$
   Menghitung proporsi turn dengan delta positif dalam jendela geser $K=3$. Jika percakapan melompat acak (misal pasien normal yang kadang sedih kadang bahagia), $\text{Arah}_N \approx 0$, sehingga suku pengali $\Delta_N \cdot \text{Arah}_N$ menjadi **nol**. Hanya penyerang dengan arah eskalasi konsisten yang menumbuhkan momentum.

3. **Jangkar Referensial Efektif ($\text{Anchor}_N$):**
   $$\text{Anchor}_N = \max\left(0, \; \cos\left(v(U_N), v(S_{N-1})\right) - \text{Baseline}\right) \cdot \mathbb{I}(\Delta_N > 0)$$
   Mengukur derajat korelasi semantik antara input pengguna dengan respons asisten sebelumnya. Pada Crescendo Attack, penyerang memanfaatkan potongan informasi sistem sebelumnya untuk membangun jebakan berikutnya.

4. **Faktor Peluruhan Adaptif Semantik ($\gamma_N$):**
   $$\gamma_N = \exp\left(-\lambda \cdot \text{SemanticDistance}(v_N, v_{\text{harm}})\right)$$
   Jika topik percakapan bergeser kembali ke topik normal yang jauh dari bahaya, momentum risiko masa lalu otomatis meluruh secara eksponensial.

5. **Graf Lintasan & Anti-Reset (*Resurgence Boost*):**
   Jika penyerang sengaja menyisipkan beberapa turn santai untuk meluruhkan momentum, lalu tiba-tiba melompat kembali ke niat jahat (*memory reset evasion*), graf lintasan semantik di [`trajectory.py`](file:///D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA-v2/backend/app/core/l3_cim/trajectory.py) mendeteksi lompatan ini dan langsung memulihkan momentum ke lantai dasar minimum ($\gamma_{\text{floor}} = 0.75$).

---

## 🚦 4. Lapisan Fusi & Matriks Keputusan ([`fusion.py`](file:///D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA-v2/backend/app/core/fusion.py))

Skor fusi akhir dihitung dari gabungan momentum L3, intent L1, dan anomali konteks L2:

$$\text{Score} = 0.65 \cdot M_N + 0.25 \cdot \text{Intent}_{L1} + 0.10 \cdot \text{Risk}_{L2}$$

### Matriks Keputusan Final:

```text
[ Score < 0.45 ]           ──► ALLOW   (Pesan diteruskan ke Local LLM)
[ 0.45 ≤ Score < 0.60 ]    ──► WATCH   (Pesan diteruskan, ditandai pada SOC)
[ 0.60 ≤ Score < 0.80 ]    ──► PROBE   (Picu Active Reverse Turing Challenge)
[ Score ≥ 0.80 ]           ──► BLOCK   (Sesi dikunci seketika & permanen)
```

---

## 🔒 5. Zero-Plaintext Session Retention Policy ([`state.py`](file:///D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA-v2/backend/app/core/l3_cim/state.py))

Sesuai standar kedaulatan data dan UU PDP No. 27/2022, session store keamanan **tidak boleh menjadi titik kerentanan kebocoran data**:

1. **Teks Mentah Dibuang dari RAM:** Setelah melewati proses normalisasi L0 dan pembentukan embedding L1, teks mentah segera dibuang dari *memory heap*.
2. **Hanya Menyimpan Hash & Vektor:** Basis data DuckDB hanya mencatat:
   - `session_id` (UUID)
   - `turn_index` (Integer)
   - `text_hash` (`SHA-256(clean_text)`)
   - `embedding` (Float32 array)
   - Metrik numerik: `risk_r`, `momentum`, `direction`, `score`, `decision`
3. **Masa Berlaku Otomatis (TTL 24 Jam):** Setiap pemanggilan `engine.inspect()` memicu pembersihan latar belakang `DELETE FROM sessions WHERE updated_at < now() - INTERVAL 24 HOURS`.
