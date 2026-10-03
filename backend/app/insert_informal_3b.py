
import re


def insert_informal_3b():
    file_path = 'Knowledge/SIAGA_HACKNUSA_SYSTEM_REPORT_PREVIEW.html'
    with open(file_path, encoding='utf-8') as f:
        html = f.read()

    informal_3b_html = '''
                <!-- Penjelasan Non-Formal Khusus 3.B -->
                <div class="p-5 sm:p-6 rounded-xl bg-warmbg/90 border-2 border-indigo-200/80 space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slateborder/80 pb-3">
                        <div class="flex items-center space-x-2">
                            <span class="text-base">☕</span>
                            <h4 class="font-bold text-sm sm:text-base text-brand-slate">Penjelasan Santai 3.B: "Kenapa Harus Pakai BM25 &amp; Dense Vector Kalau Sudah Ada TF-IDF?"</h4>
                        </div>
                        <span class="text-[11px] font-mono font-bold bg-indigo-100 text-brand-indigo px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                            Analogi Anti-Kamus Kaku
                        </span>
                    </div>
                    
                    <p class="text-xs text-brand-subtle leading-relaxed">
                        Kalau TF-IDF klasik ibarat <strong>"Pemeriksa Kamus Huruf yang Kaku"</strong>, maka kombinasi <strong>Okapi BM25</strong> dan <strong>Dense Semantic Vector</strong> hadir sebagai pelengkap cerdas untuk menjawab dua keraguan juri:
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <!-- Card BM25 -->
                        <div class="p-4 bg-white rounded-xl border border-slateborder space-y-2.5 shadow-2xs">
                            <div class="flex items-center justify-between">
                                <strong class="text-brand-indigo font-mono text-[11px] uppercase">1. Analogi BM25: "Makan Bakso &amp; Tebal Halaman"</strong>
                                <span class="text-[10px] font-mono text-brand-emerald bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">Anti-Spam Kata</span>
                            </div>
                            <p class="text-brand-slate leading-relaxed">
                                • <strong>Kekenyangan (Term Saturation):</strong> Kalau di TF-IDF biasa, siapa yang ngulang kata <em>"keamanan"</em> 1.000 kali bakal menang skor (bisa dicurangi pakai spam kata). BM25 ibarat makan bakso: mangkok ke-1 dan ke-2 enak banget, tapi mangkok ke-10 udah kenyang, poin kepuasannya direm. Skor <strong>88.09% Saturation</strong> membuktikan laporan kita relevan murni karena kualitas topik, bukan karena spamming kata kunci!
                            </p>
                            <p class="text-brand-slate leading-relaxed">
                                • <strong>Keadilan Tebal Halaman:</strong> Laporan kita tebal (6.300+ kata) sedangkan kisi-kisi juri cuma 117 kata. BM25 membagi tebal laporan kita dengan rata-rata dokumen lain, jadi nilai kita tidak menang curang hanya karena dokumen kita tebal.
                            </p>
                        </div>

                        <!-- Card Dense Vector -->
                        <div class="p-4 bg-white rounded-xl border border-slateborder space-y-2.5 shadow-2xs">
                            <div class="flex items-center justify-between">
                                <strong class="text-brand-emerald font-mono text-[11px] uppercase">2. Analogi Dense Vector: "AI Paham Konsep vs Kamus Huruf"</strong>
                                <span class="text-[10px] font-mono text-brand-indigo bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-bold">Sinonim Cerdas</span>
                            </div>
                            <p class="text-brand-slate leading-relaxed">
                                • <strong>Kelemahan Cocok Huruf:</strong> TF-IDF dan BM25 cuma bisa nyocokin kata yang ejaannya persis sama. Kalau juri nulis <em>"cybercriminals"</em>, tapi di kode dan laporan kita nyebut <em>"adversarial agent / attacker bot"</em>, kamus kaku menganggap itu poin 0 (gak kenal)!
                            </p>
                            <p class="text-brand-slate leading-relaxed">
                                • <strong>AI Pembaca Makna (MiniLM):</strong> Model AI Transformer kita membaca konsep maknanya, bukan cuma hurufnya. Dia tahu kalau <em>"adversarial agent"</em> itu ya maksudnya <em>"cybercriminals"</em>.
                            </p>
                            <p class="text-brand-emerald leading-relaxed font-semibold">
                                • <strong>Arti Skor 92.40%:</strong> Secara isi otak dan frekuensi pemikiran, apa yang dipikirkan juri HackNusa dan apa yang kita bangun di SIAGA v2 itu <strong>sefrekuensi 92.4%</strong>!
                            </p>
                        </div>
                    </div>
                </div>
    '''

    # Let's locate the end of section 3.B container
    old_block_end = 'Memvalidasi keselarasan konsep konseptual tingkat tinggi antara arsitektur SIAGA v2 dan visi HackNusa.</span>\n                        </div>\n                    </div>\n                </div>\n            </div>'
    new_block_end = 'Memvalidasi keselarasan konsep konseptual tingkat tinggi antara arsitektur SIAGA v2 dan visi HackNusa.</span>\n                        </div>\n                    </div>\n                </div>\n\n' + informal_3b_html + '\n            </div>'

    if old_block_end in html:
        html = html.replace(old_block_end, new_block_end)
        print("Inserted informal explanation for 3.B successfully using block end match.")
    else:
        # Try alternate match
        print("Searching alternative pattern...")
        pattern = r'(Memvalidasi keselarasan konsep konseptual tingkat tinggi antara arsitektur SIAGA v2 dan visi HackNusa\.</span>\s*</div>\s*</div>\s*</div>\s*)</div>'
        if re.search(pattern, html):
            html = re.sub(pattern, r'\1\n' + informal_3b_html + r'\n            </div>', html, count=1)
            print("Inserted using regex.")
        else:
            print("Failed to find insertion point.")
            return

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"File updated. New size: {len(html)} bytes.")

if __name__ == '__main__':
    insert_informal_3b()
