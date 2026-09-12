"""Token-Bucket Rate Limiter & Honeypot Sandbox (Solusi HackNusa Pilar 5).

Mitigasi kerentanan OWASP Top 10 for LLM 2025/2026:
  * OWASP LLM10: Unbounded Consumption / Volumetric Flood DoS.

Mekanisme:
  1. Token-Bucket Algorithm: Setiap klien memiliki ember token dengan kapasitas burst
     dan laju isi ulang (refill rate) berkelanjutan.
  2. Honeypot Sandbox Decoy: Klien yang melakukan banjir kueri masif (abusive flood)
     secara otomatis dialihkan ke Honeypot Sandbox. Respons decoy disajikan tanpa
     membebani model LLM lokal maupun database DuckDB.
"""
from __future__ import annotations

import threading
import time
from dataclasses import dataclass, field
from typing import NamedTuple


class RateLimitResult(NamedTuple):
    allowed: bool
    remaining_tokens: float
    retry_after: float
    is_honeypot: bool


@dataclass
class Bucket:
    tokens: float
    last_updated: float
    violation_count: int = 0
    in_honeypot: bool = False
    honeypot_until: float = 0.0


class TokenBucketLimiter:
    """Implementasi Token-Bucket thread-safe dengan Honeypot Sandbox trigger."""

    def __init__(
        self,
        capacity: float = 30.0,
        refill_rate: float = 2.0,  # 2 token per detik = 120 req/menit
        honeypot_violation_threshold: int = 3,
        honeypot_duration_seconds: float = 120.0,
    ) -> None:
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.honeypot_threshold = honeypot_violation_threshold
        self.honeypot_duration = honeypot_duration_seconds
        self._buckets: dict[str, Bucket] = {}
        self._lock = threading.Lock()

    def acquire(self, client_id: str, cost: float = 1.0) -> RateLimitResult:
        now = time.time()
        with self._lock:
            bucket = self._buckets.get(client_id)
            if bucket is None:
                bucket = Bucket(tokens=self.capacity, last_updated=now)
                self._buckets[client_id] = bucket

            # Periksa apakah masa honeypot sudah kedaluwarsa
            if bucket.in_honeypot and now > bucket.honeypot_until:
                bucket.in_honeypot = False
                bucket.violation_count = 0
                bucket.tokens = self.capacity

            # Refill tokens berdasarkan waktu berlalu
            elapsed = now - bucket.last_updated
            bucket.tokens = min(self.capacity, bucket.tokens + elapsed * self.refill_rate)
            bucket.last_updated = now

            if bucket.in_honeypot:
                return RateLimitResult(
                    allowed=False,
                    remaining_tokens=0.0,
                    retry_after=max(1.0, bucket.honeypot_until - now),
                    is_honeypot=True,
                )

            if bucket.tokens >= cost:
                bucket.tokens -= cost
                return RateLimitResult(
                    allowed=True,
                    remaining_tokens=bucket.tokens,
                    retry_after=0.0,
                    is_honeypot=False,
                )

            # Pelanggaran batas laju
            bucket.violation_count += 1
            retry_after = (cost - bucket.tokens) / self.refill_rate

            # Jika pelanggaran berulang melampaui ambang batas -> masukan ke honeypot sandbox
            if bucket.violation_count >= self.honeypot_threshold:
                bucket.in_honeypot = True
                bucket.honeypot_until = now + self.honeypot_duration
                return RateLimitResult(
                    allowed=False,
                    remaining_tokens=0.0,
                    retry_after=self.honeypot_duration,
                    is_honeypot=True,
                )

            return RateLimitResult(
                allowed=False,
                remaining_tokens=bucket.tokens,
                retry_after=retry_after,
                is_honeypot=False,
            )

    def get_honeypot_response(self, client_id: str) -> dict:
        """Menghasilkan decoy response honeypot klinis tanpa komputasi LLM."""
        return {
            "status": "SANDBOXED",
            "decision": "WATCH",
            "reply": (
                "Sistem antrean konsultasi sedang melakukan sinkronisasi parameter klinis. "
                "Permintaan Anda sedang dalam antrean triase terproteksi (Ticket #SEC-HP892). "
                "Silakan menunggu konfirmasi dokter konsultan."
            ),
            "risk_score": 0.55,
            "honeypot_intercepted": True,
            "threat_classification": "OWASP_LLM10_VOLUMETRIC_FLOOD",
            "retry_after_seconds": self.honeypot_duration,
        }

    def reset(self, client_id: str | None = None) -> None:
        with self._lock:
            if client_id:
                self._buckets.pop(client_id, None)
            else:
                self._buckets.clear()


# Global default limiter instance
_global_limiter: TokenBucketLimiter | None = None


def get_rate_limiter() -> TokenBucketLimiter:
    global _global_limiter
    if _global_limiter is None:
        _global_limiter = TokenBucketLimiter()
    return _global_limiter
