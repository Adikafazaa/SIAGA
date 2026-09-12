import os
import math
import re
import glob
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

def main():
    html_path = 'Knowledge/SIAGA_HACKNUSA_SYSTEM_REPORT.html'
    with open(html_path, encoding='utf-8') as f:
        html_raw = f.read()
    
    extractor = HTMLTextExtractor()
    extractor.feed(html_raw)
    doc_report = extractor.get_data()

    with open('Knowledge/HACKNUSA_6_PILARS_CRITERIA.txt', encoding='utf-8') as f:
        doc_criteria = f.read()

    pillar_names = {
        'p1': 'Accordance with the Track (5%)',
        'p2': 'Unique Selling Proposition (25%)',
        'p3': 'Technical Feasibility (25%)',
        'p4': 'Proof of Concept (25%)',
        'p5': 'Level of Security (10%)',
        'p6': 'Scalability & Deployment (10%)',
    }
    
    criteria_lines = {
        'p1': 'Accordance with the track 5%',
        'p2': 'Unique Selling Proposition 25%',
        'p3': 'Technical feasibility 25%',
        'p4': 'Proof of Concept 25%',
        'p5': 'Level of security 10%',
        'p6': 'Scalability and deployment readiness 10%',
    }
    
    pillar_sections = {}
    for pid in ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']:
        pattern = rf'id="content-{pid}"[^>]*>(.*?)</div>\s*</div>\s*</div>'
        m = re.search(pattern, html_raw, re.DOTALL)
        if m:
            sub_ext = HTMLTextExtractor()
            sub_ext.feed(m.group(1))
            pillar_sections[pid] = sub_ext.get_data()
        else:
            pillar_sections[pid] = ''

    # KB Corpus
    kb_docs = [doc_report, doc_criteria]
    for path in glob.glob('Knowledge/*.md'):
        with open(path, encoding='utf-8') as f:
            kb_docs.append(f.read())
    
    N = len(kb_docs)
    doc_token_lists = [tokenize(d) for d in kb_docs]
    vocab = sorted(list(set(t for tokens in doc_token_lists for t in tokens)))

    df = Counter()
    for tokens in doc_token_lists:
        for t in set(tokens):
            df[t] += 1

    # Standard smooth IDF: ln((1 + N) / (1 + df)) + 1
    idf = {t: math.log((1 + N) / (1 + df[t])) + 1.0 for t in vocab}

    tokens_a = tokenize(doc_report)
    tokens_b = tokenize(doc_criteria)

    tf_a = Counter(tokens_a)
    tf_b = Counter(tokens_b)

    criteria_terms = sorted(list(tf_b.keys()))
    ab_vocab = sorted(list(set(tokens_a).union(set(tokens_b))))

    # Vectors
    vec_a_raw = np.array([tf_a[t] * idf[t] for t in ab_vocab], dtype=float)
    vec_b_raw = np.array([tf_b[t] * idf[t] for t in ab_vocab], dtype=float)
    
    norm_a_raw = np.linalg.norm(vec_a_raw)
    norm_b_raw = np.linalg.norm(vec_b_raw)
    dot_raw = np.dot(vec_a_raw, vec_b_raw)
    cos_raw = dot_raw / (norm_a_raw * norm_b_raw)

    # Subspace vectors
    vec_a_sub = np.array([tf_a[t] * idf[t] for t in criteria_terms], dtype=float)
    vec_b_sub = np.array([tf_b[t] * idf[t] for t in criteria_terms], dtype=float)
    norm_a_sub = np.linalg.norm(vec_a_sub)
    norm_b_sub = np.linalg.norm(vec_b_sub)
    dot_sub = np.dot(vec_a_sub, vec_b_sub)
    cos_sub = dot_sub / (norm_a_sub * norm_b_sub)

    print("=== HASIL RELEVANSI TF-IDF & COSINE SIMILARITY ===")
    print(f"Total Token Laporan (A): {len(tokens_a)} (Unik: {len(tf_a)})")
    print(f"Total Token Kriteria (B): {len(tokens_b)} (Unik: {len(tf_b)})")
    print(f"Keyword Coverage: {len([t for t in criteria_terms if tf_a[t] > 0])}/{len(criteria_terms)} matched")
    print(f"Dot Product (A . B): {dot_sub:.4f}")
    print(f"Norm ||A_sub||: {norm_a_sub:.4f}")
    print(f"Norm ||B_sub||: {norm_b_sub:.4f}")
    print(f"Subspace Cosine Similarity: {cos_sub:.4f} ({cos_sub*100:.2f}%)")
    print(f"Global Cosine Similarity: {cos_raw:.4f} ({cos_raw*100:.2f}%)")
    print("\n--- DETAIL DISTRIBUSI 21 KATA KUNCI KRITERIA ---")
    print(f"{'Term':<25} {'TF_B':<6} {'TF_A':<6} {'DF':<4} {'IDF':<8} {'TFIDF_B':<10} {'TFIDF_A':<10} {'DotProduct':<12}")
    for t in criteria_terms:
        w_b = tf_b[t] * idf[t]
        w_a = tf_a[t] * idf[t]
        dp = w_b * w_a
        print(f"{t:<25} {tf_b[t]:<6} {tf_a[t]:<6} {df[t]:<4} {idf[t]:<8.4f} {w_b:<10.4f} {w_a:<10.4f} {dp:<12.4f}")

    print("\n--- GRANULAR PILLAR ANALYSIS DETAIL ---")
    weights = {'p1': 0.05, 'p2': 0.25, 'p3': 0.25, 'p4': 0.25, 'p5': 0.10, 'p6': 0.10}
    for pid in ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']:
        t_crit = tokenize(criteria_lines[pid])
        t_sec = tokenize(pillar_sections[pid])
        
        c_tf = Counter(t_crit)
        s_tf = Counter(t_sec)
        
        shared_terms = set(t_crit).intersection(set(t_sec))
        p_vocab = sorted(list(set(t_crit).union(set(t_sec))))
        
        v_crit = np.array([c_tf[t] * idf.get(t, 1.0) for t in p_vocab], dtype=float)
        v_sec = np.array([s_tf[t] * idf.get(t, 1.0) for t in p_vocab], dtype=float)
        
        n_crit = np.linalg.norm(v_crit)
        n_sec = np.linalg.norm(v_sec)
        dot_p = np.dot(v_crit, v_sec)
        c_sim = dot_p / (n_crit * n_sec) if (n_crit * n_sec) > 0 else 0.0
        
        # Subspace similarity per pillar (only over the criteria terms of that pillar)
        v_c_sub = np.array([c_tf[t] * idf.get(t, 1.0) for t in t_crit], dtype=float)
        v_s_sub = np.array([s_tf[t] * idf.get(t, 1.0) for t in t_crit], dtype=float)
        n_c_sub = np.linalg.norm(v_c_sub)
        n_s_sub = np.linalg.norm(v_s_sub)
        dot_sub_p = np.dot(v_c_sub, v_s_sub)
        sub_sim_p = dot_sub_p / (n_c_sub * n_s_sub) if (n_c_sub * n_s_sub) > 0 else 0.0
        
        print(f"[{pid}] {pillar_names[pid]}:")
        print(f"     Criteria terms: {t_crit}")
        print(f"     Section tokens count: {len(t_sec)} (Unik: {len(s_tf)})")
        print(f"     Shared terms: {len(shared_terms)}/{len(set(t_crit))} -> {shared_terms}")
        print(f"     A . B = {dot_p:.4f} | ||A|| = {n_sec:.4f} | ||B|| = {n_crit:.4f}")
        print(f"     Global Cosine Similarity: {c_sim:.4f} ({c_sim*100:.2f}%)")
        print(f"     Subspace Cosine Similarity: {sub_sim_p:.4f} ({sub_sim_p*100:.2f}%)\n")

if __name__ == '__main__':
    main()
