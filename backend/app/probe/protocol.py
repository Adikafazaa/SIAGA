"""Protokol Reverse Turing Probe - gerbang etis & tangga eskalasi (Bab 4 §3).

Empat aturan pembatas yang semua disengaja:
  1. Maksimal 2 probe per sesi.
  2. Berhenti pada tingkat pertama yang memberi jawaban jelas.
  3. Ambigu -> kembali ke WATCH, bukan BLOCK (ketidakpastian bukan bukti).
  4. Prasyarat etis diperiksa SEBELUM tingkat 1:
     saluran kami sendiri (channel_owned) + skor di zona abu-abu.
"""
from __future__ import annotations

from ..config import PROBE_MAX_PER_SESSION, THRESHOLD_BLOCK, THRESHOLD_PROBE


def escalation_level(score: float) -> int:
    """Peta skor zona abu-abu ke tingkat tangga (PRD §5.4)."""
    if score < 0.68:
        return 1
    if score < 0.75:
        return 2
    return 3


def should_probe(
    score: float,
    channel_owned: bool,
    probe_count: int,
    consecutive_elevated: int = 1,
    intent_risk: float = 0.0,
) -> tuple[bool, str]:
    """Prasyarat etis & Adaptive Probe Thresholding (Solusi HackNusa Pilar 1).

    Mencegah false probe pada manusia cemas:
      - Probe hanya aktif jika momentum/risiko bertahan konsisten pada turn eskalatif
        (consecutive_elevated >= 2) ATAU intent koersif L1 terkonfirmasi tinggi (>= 0.60).
    """
    if not (THRESHOLD_PROBE <= score < THRESHOLD_BLOCK):
        return False, f"skor {score:.2f} di luar zona abu-abu"
    if not channel_owned:
        return False, "prasyarat etis: probe hanya pada kanal yang kami kendalikan (channel_owned=false)"
    if probe_count >= PROBE_MAX_PER_SESSION:
        return False, f"batas {PROBE_MAX_PER_SESSION} probe per sesi tercapai"
    if consecutive_elevated < 2 and intent_risk < 0.60:
        return False, "adaptive probe: momentum belum konsisten bertahan (meniadakan false probe pada manusia)"
    return True, "prasyarat etis & adaptive probe terpenuhi"

