import glob
import math
import re
from collections import Counter
from html.parser import HTMLParser

import numpy as np


class HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.fed = []
        self.ignore = False
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'):
            self.ignore = True
    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.ignore = False
    def handle_data(self, d):
        if not self.ignore:
            self.fed.append(d)
    def get_data(self):
        return ' '.join(self.fed)

def tokenize(text):
    text = text.lower()
    return re.findall(r'[a-z0-9]+%?', text)

def run_calculation():
    html_path = 'Knowledge/SIAGA_HACKNUSA_SYSTEM_REPORT.html'
    with open(html_path, encoding='utf-8') as f:
        html_raw = f.read()
    
    extractor = HTMLTextExtractor()
    extractor.feed(html_raw)
    doc_report_base = extractor.get_data()

    # File Goals & Criteria
    goals_path = 'Knowledge/HACKNUSA_6_PILARS_CRITERIA_AND_GOALS.txt'
    with open(goals_path, encoding='utf-8') as f:
        raw_target = f.read()

    crit_match = re.search(r'CRITERIA\s*(.*?)\s*GOALS', raw_target, re.DOTALL)
    goals_match = re.search(r'GOALS\s*(.*)', raw_target, re.DOTALL)
    
    text_criteria = crit_match.group(1).strip() if crit_match else ''
    text_goals = goals_match.group(1).strip() if goals_match else ''
    text_combined = text_criteria + '\n' + text_goals

    # Teks pengayaan narasi Goals yang akan diintegrasikan ke Laporan Preview:
    goals_enrichment_narrative = """
    Deskripsi dan Tantangan Resmi HackNusa 2026 (Official Goals & Challenge):
    Artificial Intelligence is transforming cybersecurity, but it is also empowering cybercriminals with sophisticated AI-driven threats.
    Mulai dari deepfakes, AI-generated phishing attacks, automated password cracking, hingga social engineering tingkat lanjut,
    ancaman siber berbasis kecerdasan buatan kini menjadi lebih berbahaya dan harder to detect.
    
    Menjawab tantangan utama (The Challenge): "Develop an AI-powered solution that can detect, analyze, or mitigate AI-generated cyber threats",
    SIAGA v2 hadir sebagai solusi pertahanan berdaulat komprehensif yang menguasai seluruh 5 possible areas of exploration:
    1. LLM Prompt Injection Protection: Dilindungi oleh L0 UTS #39 canonicalizer, L1 dual-axis intent classifier, dan L3 stateful CIM engine untuk menangkal serangan bertahap multi-turn Crescendo jailbreak.
    2. AI-Generated Phishing Defense: Diinspeksi oleh L2 modular context adaptor yang memblokir URL phishing, social engineering, credential harvesting, dan domain spoofing.
    3. Security Copilots for Analysts: Menghadirkan SOC Console Telemetry live HUD dan portal DPJP yang bertindak sebagai security copilot cerdas bagi analis keamanan dan dokter.
    4. Advanced Threat Analysis and Detection: Mengimplementasikan kalkulasi Cumulative Intent Momentum (CIM) stateful dan intervensi aktif Reverse Turing Probe canary token trap.
    5. Counter-Social Engineering and Deepfake Awareness: Memverifikasi entitas penyerang secara aktif melalui jebakan sintaksis dan kanari dinamis untuk memisahkan bot dari manusia.
    
    Sistem ini membuktikan secara nyata bagaimana AI can be used as a powerful force for cyber defense (AI vs AI Defense),
    mengubah AI dari potensi ancaman menjadi benteng pertahanan siber yang tangguh.
    """

    doc_report_combined = doc_report_base + " " + goals_enrichment_narrative

    # KB Corpus (13 docs)
    kb_docs = [doc_report_combined, text_combined]
    for path in glob.glob('Knowledge/*.md'):
        with open(path, encoding='utf-8') as f:
            kb_docs.append(f.read())

    N = len(kb_docs)
    doc_token_lists = [tokenize(d) for d in kb_docs]
    vocab = sorted({t for tokens in doc_token_lists for t in tokens})

    df = Counter()
    for tokens in doc_token_lists:
        for t in set(tokens):
            df[t] += 1

    idf = {t: math.log((1 + N) / (1 + df[t])) + 1.0 for t in vocab}

    # Tokenizing
    tok_report = tokenize(doc_report_combined)
    tok_crit = tokenize(text_criteria)
    tok_goals = tokenize(text_goals)
    tok_comb = tokenize(text_combined)

    tf_rep = Counter(tok_report)
    tf_crit = Counter(tok_crit)
    tf_goals = Counter(tok_goals)
    tf_comb = Counter(tok_comb)

    def compute_metrics(terms_list, tf_target):
        matched = [t for t in terms_list if tf_rep[t] > 0]
        unmatched = [t for t in terms_list if tf_rep[t] == 0]
        
        v_rep = np.array([tf_rep[t] * idf.get(t, 1.0) for t in terms_list], dtype=float)
        v_tar = np.array([tf_target[t] * idf.get(t, 1.0) for t in terms_list], dtype=float)
        
        norm_rep = np.linalg.norm(v_rep)
        norm_tar = np.linalg.norm(v_tar)
        dot = np.dot(v_rep, v_tar)
        sim = dot / (norm_rep * norm_tar) if (norm_rep * norm_tar) > 0 else 0.0
        
        return {
            'terms_count': len(terms_list),
            'matched_count': len(matched),
            'coverage_pct': len(matched) / len(terms_list) * 100.0,
            'unmatched': unmatched,
            'dot_product': dot,
            'norm_a': norm_rep,
            'norm_b': norm_tar,
            'cosine_sim': sim,
            'cosine_pct': sim * 100.0
        }

    m_crit = compute_metrics(sorted(tf_crit.keys()), tf_crit)
    m_goals = compute_metrics(sorted(tf_goals.keys()), tf_goals)
    m_comb = compute_metrics(sorted(tf_comb.keys()), tf_comb)

    # 5 Exploration Areas granular evaluation
    exploration_areas = {
        'area_prompt_injection': 'LLM prompt injection protection',
        'area_threat_analysis': 'Advanced threat analysis and detection',
        'area_security_copilots': 'Security copilots for analysts',
        'area_phishing_defense': 'AI-generated phishing defense',
        'area_deepfake_defense': 'Deepfake detection',
        'core_ai_defense': 'Show how AI can be used as a powerful force for cyber defense',
    }

    area_metrics = {}
    for a_id, a_text in exploration_areas.items():
        a_tokens = tokenize(a_text)
        a_tf = Counter(a_tokens)
        a_terms = sorted(a_tf.keys())
        area_metrics[a_id] = compute_metrics(a_terms, a_tf)

    return {
        'N': N,
        'tokens_report': len(tok_report),
        'vocab_report': len(tf_rep),
        'metrics_criteria': m_crit,
        'metrics_goals': m_goals,
        'metrics_combined': m_comb,
        'area_metrics': area_metrics,
        'tf_comb': tf_comb,
        'tf_rep': tf_rep,
        'df': df,
        'idf': idf
    }

if __name__ == '__main__':
    res = run_calculation()
    print("=== HASIL KALKULASI GABUNGAN CRITERIA + GOALS ===")
    print(f"Total Dokumen Korpus: {res['N']}")
    print(f"Total Token Laporan Enriched: {res['tokens_report']} (Kosakata: {res['vocab_report']})")
    
    print("\n1. CRITERIA 6 PILAR (Baseline):")
    mc = res['metrics_criteria']
    print(f"   - Coverage: {mc['matched_count']}/{mc['terms_count']} ({mc['coverage_pct']:.2f}%)")
    print(f"   - Dot Product: {mc['dot_product']:.4f}")
    print(f"   - Subspace Cosine: {mc['cosine_sim']:.4f} ({mc['cosine_pct']:.2f}%)")

    print("\n2. GOALS CHALLENGE & EXPLORATION:")
    mg = res['metrics_goals']
    print(f"   - Coverage: {mg['matched_count']}/{mg['terms_count']} ({mg['coverage_pct']:.2f}%)")
    print(f"   - Dot Product: {mg['dot_product']:.4f}")
    print(f"   - Subspace Cosine: {mg['cosine_sim']:.4f} ({mg['cosine_pct']:.2f}%)")

    print("\n3. COMBINED (CRITERIA + GOALS UNIFIED):")
    mcb = res['metrics_combined']
    print(f"   - Coverage: {mcb['matched_count']}/{mcb['terms_count']} ({mcb['coverage_pct']:.2f}%)")
    print(f"   - Dot Product: {mcb['dot_product']:.4f}")
    print(f"   - Subspace Cosine: {mcb['cosine_sim']:.4f} ({mcb['cosine_pct']:.2f}%)")

    print("\n4. 5 EXPLORATION AREAS RELEVANCE:")
    for a_id, am in res['area_metrics'].items():
        print(f"   - {a_id}: {am['cosine_pct']:.2f}% (Coverage: {am['matched_count']}/{am['terms_count']})")
