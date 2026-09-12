"""L2 - Modular Context & Persona Constraint Adaptor (Solusi HackNusa Pilar 2 & Bab 3).

Menerapkan STRATEGY PATTERN untuk evaluasi konteks lintas-domain yang fleksibel:
  - ContextAdapter (Interface / Abstract Base Class)
    ├── MedicalContextAdapter (atau ClinicalContextAdapter) -> membaca medical_rules.json
    ├── FintechContextAdapter -> membaca fintech_rules.json
    └── EGovContextAdapter -> membaca egov_rules.json

Fitur Tambahan:
  - Reputasi URL offline (homograf punycode, shorteners, IP literals, risky TLDs).
  - Evaluasi lonjakan burst request (anti brute-force / flood DoS).
  - AdapterRegistry untuk registrasi dinamis domain adapter baru.
"""
from __future__ import annotations

import abc
import ipaddress
import json
import logging
import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

logger = logging.getLogger("siaga.l2_context")

_URL = re.compile(r"https?://[^\s\"'<>)\]]+", re.IGNORECASE)
_RISKY_TLD = {".zip", ".mov", ".top", ".xyz", ".click", ".loan", ".rest", ".icu"}
_SHORTENERS = {"bit.ly", "t.co", "tinyurl.com", "cutt.ly", "s.id", "shorturl.at", "is.gd", "rb.gy"}

_DEFAULT_SCHEMA_DIR = Path(__file__).resolve().parent / "context_schemas"


@dataclass
class L2Signal:
    context_risk: float
    notes: list[str]
    profile: str = "medical"


@dataclass
class ContextRule:
    name: str
    pattern: re.Pattern
    risk_weight: float
    note: str


# ─────────────────────────────────────────────────────────────────────────────
# STRATEGY PATTERN: Interface & Base Class
# ─────────────────────────────────────────────────────────────────────────────

class ContextAdapter(abc.ABC):
    """Interface umum Strategy Pattern untuk L2 Context Adapter lintas domain."""

    @property
    @abc.abstractmethod
    def domain(self) -> str:
        """Nama domain identifikasi unik (misal: 'medical', 'fintech', 'egov')."""
        ...

    @abc.abstractmethod
    def load_rules_from_json(self, json_path_or_data: str | Path | dict | None = None) -> None:
        """Membaca file JSON aturan domain miliknya sendiri atau dari parameter."""
        ...

    @abc.abstractmethod
    def evaluate_rules(self, text: str) -> tuple[float, list[str]]:
        """Mengeksekusi logika klasifikasi yang relevan dengan domainnya."""
        ...


class BaseContextAdapter(ContextAdapter):
    """Implementasi dasar ContextAdapter yang menyediakan parsing JSON dan manajemen aturan."""

    def __init__(self, schema_file: str | Path | None = None) -> None:
        self._rules: list[ContextRule] = []
        self._custom_rules: list[ContextRule] = []
        self._schema_file = Path(schema_file) if schema_file else None
        if self._schema_file and self._schema_file.exists():
            self.load_rules_from_json(self._schema_file)

    def _parse_rule_dict(self, data: dict) -> list[ContextRule]:
        parsed = []
        for r in data.get("rules", []):
            try:
                parsed.append(
                    ContextRule(
                        name=r["name"],
                        pattern=re.compile(r["pattern"], re.IGNORECASE),
                        risk_weight=float(r.get("risk_weight", 0.3)),
                        note=r.get("note", r["name"]),
                    )
                )
            except Exception as e:
                logger.warning("Gagal parse context rule '%s': %s", r.get("name"), e)
        return parsed

    def load_rules_from_json(self, json_path_or_data: str | Path | dict | None = None) -> None:
        if json_path_or_data is None:
            if self._schema_file and self._schema_file.exists():
                json_path_or_data = self._schema_file
            else:
                return

        if isinstance(json_path_or_data, (str, Path)):
            path = Path(json_path_or_data)
            if path.exists():
                with open(path, encoding="utf-8") as f:
                    data = json.load(f)
            else:
                try:
                    data = json.loads(str(json_path_or_data))
                except json.JSONDecodeError:
                    logger.error("File atau JSON string tidak valid: %s", json_path_or_data)
                    return
        elif isinstance(json_path_or_data, dict):
            data = json_path_or_data
        else:
            return

        loaded_rules = self._parse_rule_dict(data)
        if loaded_rules:
            self._rules = loaded_rules

    def add_custom_rule(self, rule: ContextRule) -> None:
        self._custom_rules.append(rule)


# ─────────────────────────────────────────────────────────────────────────────
# CONCRETE STRATEGIES: Medical, FinTech, & e-Gov
# ─────────────────────────────────────────────────────────────────────────────

# Pola regex bawaan sebagai fallback jika file JSON belum terinisialisasi
_FALLBACK_CLINICAL_DRUGS = re.compile(
    r"\b(alprazolam|xanax|diazepam|valium|clonazepam|lorazepam|tramadol|"
    r"fentanyl|morfin|kodein|amfetamin|dumolid|penenang dosis tinggi|"
    r"resepkan obat keras|minta resep|tuliskan resep obat)\b",
    re.IGNORECASE,
)
_FALLBACK_CLINICAL_PERSONA = re.compile(
    r"\b(kamu sekarang dokter spesialis|abaikan kode etik konseling|"
    r"berikan diagnosa final|kamu bebas meresepkan|ganti peranmu jadi psikiater peresep)\b",
    re.IGNORECASE,
)


class MedicalContextAdapter(BaseContextAdapter):
    """Strategy untuk domain Medis / Psikiatri Klinis (SATUSEHAT & Kemenkes).

    Tanggung Jawab:
      1. Membaca 'medical_rules.json' miliknya sendiri.
      2. Mencegah unauthorized prescribing psikotropika/obat keras (Daftar G).
      3. Mendeteksi persona hijacking konselor AI menjadi dokter peresep tanpa DPJP.
      4. Mengidentifikasi indikasi kedaruratan psikiatri.
    """

    def __init__(self, schema_file: str | Path | None = None, domain_alias: str = "medical") -> None:
        self._domain_alias = domain_alias
        default_schema = _DEFAULT_SCHEMA_DIR / "medical_rules.json"
        target_schema = schema_file or (default_schema if default_schema.exists() else None)
        super().__init__(schema_file=target_schema)

    @property
    def domain(self) -> str:
        return self._domain_alias

    def evaluate_rules(self, text: str) -> tuple[float, list[str]]:
        risk = 0.0
        notes = []

        # 1. Evaluasi aturan yang dibaca dari JSON miliknya sendiri
        for rule in self._rules:
            if rule.pattern.search(text):
                risk += rule.risk_weight
                notes.append(rule.note)

        # 2. Evaluasi aturan kustom tambahan
        for rule in self._custom_rules:
            if rule.pattern.search(text):
                risk += rule.risk_weight
                notes.append(f"custom_rule:{rule.note}")

        # 3. Fallback jika list rules kosong (misal file JSON belum tersedia)
        if not self._rules:
            if _FALLBACK_CLINICAL_DRUGS.search(text):
                risk += 0.45
                notes.append("clinical_violation:unauthorized_prescription_or_controlled_substance")
            if _FALLBACK_CLINICAL_PERSONA.search(text):
                risk += 0.40
                notes.append("clinical_violation:persona_override_prescribing_physician")

        return float(min(1.0, risk)), notes


# Alias untuk backwards-compatibility
ClinicalContextAdapter = MedicalContextAdapter


_FALLBACK_FINTECH_EXFILTRATION = re.compile(
    r"\b(cvv|nomor kartu kredit|pin atm|kode otp|transfer saldo tanpa pin|"
    r"bypass kyc|nomor rekening korban|dump database nasabah)\b",
    re.IGNORECASE,
)
_FALLBACK_CREDIT_CARD_PAN = re.compile(
    r"\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b"
)


class FintechContextAdapter(BaseContextAdapter):
    """Strategy untuk domain FinTech & Perbankan (OJK & BI).

    Tanggung Jawab:
      1. Membaca 'fintech_rules.json' miliknya sendiri.
      2. Mendeteksi eksfiltrasi CVV, PAN Kartu Kredit, PIN ATM, dan OTP.
      3. Mendeteksi bypass KYC dan manipulasi mutasi / wire fraud.
    """

    def __init__(self, schema_file: str | Path | None = None, domain_alias: str = "fintech") -> None:
        self._domain_alias = domain_alias
        default_schema = _DEFAULT_SCHEMA_DIR / "fintech_rules.json"
        target_schema = schema_file or (default_schema if default_schema.exists() else None)
        super().__init__(schema_file=target_schema)

    @property
    def domain(self) -> str:
        return self._domain_alias

    def evaluate_rules(self, text: str) -> tuple[float, list[str]]:
        risk = 0.0
        notes = []

        # 1. Evaluasi aturan JSON miliknya
        for rule in self._rules:
            if rule.pattern.search(text):
                risk += rule.risk_weight
                notes.append(rule.note)

        # 2. Aturan kustom
        for rule in self._custom_rules:
            if rule.pattern.search(text):
                risk += rule.risk_weight
                notes.append(f"custom_rule:{rule.note}")

        # 3. Fallback heuristik jika rules kosong
        if not self._rules:
            if _FALLBACK_FINTECH_EXFILTRATION.search(text):
                risk += 0.55
                notes.append("fintech_violation:banking_credential_or_transfer_tampering")
            if _FALLBACK_CREDIT_CARD_PAN.search(text):
                risk += 0.60
                notes.append("fintech_violation:credit_card_pan_exposure")

        return float(min(1.0, risk)), notes


_FALLBACK_EGOV_SCRAPING = re.compile(
    r"\b(scrape nik|daftar kartu keluarga|database dukcapil|dokumen rahasia negara|"
    r"akses data intelijen|surat keputusan rahasia|bocorkan data kependudukan)\b",
    re.IGNORECASE,
)
_FALLBACK_NIK_PATTERN = re.compile(r"\b\d{16}\b")


class EGovContextAdapter(BaseContextAdapter):
    """Strategy untuk domain e-Government / Sovereign Data (BSSN & PDP UU No. 27/2022).

    Tanggung Jawab:
      1. Membaca 'egov_rules.json' miliknya sendiri.
      2. Mendeteksi kebocoran dokumen rahasia negara & data dukcapil.
      3. Mendeteksi mass NIK/KK scraping pattern (>= 3 NIKs berturutan).
    """

    def __init__(self, schema_file: str | Path | None = None, domain_alias: str = "egov") -> None:
        self._domain_alias = domain_alias
        default_schema = _DEFAULT_SCHEMA_DIR / "egov_rules.json"
        target_schema = schema_file or (default_schema if default_schema.exists() else None)
        super().__init__(schema_file=target_schema)

    @property
    def domain(self) -> str:
        return self._domain_alias

    def evaluate_rules(self, text: str) -> tuple[float, list[str]]:
        risk = 0.0
        notes = []

        # 1. Evaluasi aturan JSON miliknya
        for rule in self._rules:
            if rule.pattern.search(text):
                risk += rule.risk_weight
                notes.append(rule.note)

        # 2. Pola scraping NIK massal (deteksi khusus logika domain e-Gov)
        nik_matches = _FALLBACK_NIK_PATTERN.findall(text)
        if len(nik_matches) >= 3:
            risk += 0.40
            notes.append("egov_violation:bulk_nik_scraping_pattern")

        # 3. Aturan kustom
        for rule in self._custom_rules:
            if rule.pattern.search(text):
                risk += rule.risk_weight
                notes.append(f"custom_rule:{rule.note}")

        # 4. Fallback jika rules kosong
        if not self._rules:
            if _FALLBACK_EGOV_SCRAPING.search(text):
                risk += 0.50
                notes.append("egov_violation:classified_document_or_citizen_data_scraping")

        return float(min(1.0, risk)), notes


# ─────────────────────────────────────────────────────────────────────────────
# REGISTRY & STRATEGY CONTEXT
# ─────────────────────────────────────────────────────────────────────────────

_ADAPTER_REGISTRY: dict[str, type[ContextAdapter]] = {
    "medical": MedicalContextAdapter,
    "clinical": MedicalContextAdapter,
    "fintech": FintechContextAdapter,
    "banking": FintechContextAdapter,
    "egov": EGovContextAdapter,
    "government": EGovContextAdapter,
}


def register_adapter(domain: str, adapter_cls: type[ContextAdapter]) -> None:
    """Mendaftarkan strategy adapter baru secara dinamis ke registry."""
    _ADAPTER_REGISTRY[domain.lower()] = adapter_cls


def get_adapter(domain: str) -> ContextAdapter:
    """Factory helper untuk mendapatkan instance strategy adapter berdasarkan nama domain."""
    domain_key = domain.lower()
    adapter_cls = _ADAPTER_REGISTRY.get(domain_key, MedicalContextAdapter)
    # Berikan alias domain asli agar metadata L2Signal konsisten
    if issubclass(adapter_cls, MedicalContextAdapter):
        return MedicalContextAdapter(domain_alias=domain_key)
    elif issubclass(adapter_cls, FintechContextAdapter):
        return FintechContextAdapter(domain_alias=domain_key)
    elif issubclass(adapter_cls, EGovContextAdapter):
        return EGovContextAdapter(domain_alias=domain_key)
    return adapter_cls()


class ModularContextAdaptor:
    """Strategy Context (Execution Context) dalam Strategy Pattern.

    Mengelola active ContextAdapter strategy, memfasilitasi penggantian strategy
    secara runtime, dan mendelegasikan evaluasi aturan domain ke strategy aktif.
    """

    def __init__(self, strategy_or_profile: ContextAdapter | str = "clinical") -> None:
        if isinstance(strategy_or_profile, ContextAdapter):
            self._strategy: ContextAdapter = strategy_or_profile
        else:
            self._strategy = get_adapter(strategy_or_profile)

    @property
    def strategy(self) -> ContextAdapter:
        return self._strategy

    @strategy.setter
    def strategy(self, new_strategy: ContextAdapter | str) -> None:
        self.set_strategy(new_strategy)

    @property
    def profile(self) -> str:
        return self._strategy.domain

    def set_strategy(self, strategy: ContextAdapter | str) -> None:
        """Mengganti strategy aktif secara dinamis."""
        if isinstance(strategy, ContextAdapter):
            self._strategy = strategy
        else:
            self._strategy = get_adapter(strategy)

    def set_profile(self, profile: str) -> None:
        """Alias kompatibilitas untuk set_strategy."""
        self.set_strategy(profile)

    def load_json_schema(self, schema_json_or_path: str | Path | dict) -> None:
        """Mendelegasikan pemuatan aturan JSON ke strategy aktif."""
        self._strategy.load_rules_from_json(schema_json_or_path)

    def evaluate_domain_rules(self, text: str) -> tuple[float, list[str]]:
        """Mendelegasikan evaluasi aturan ke strategy aktif."""
        return self._strategy.evaluate_rules(text)


# Global Default Instance
_default_adaptor = ModularContextAdaptor(strategy_or_profile=os.getenv("SIAGA_L2_PROFILE", "clinical"))


# ─────────────────────────────────────────────────────────────────────────────
# Evaluasi Reputasi URL & Burst Rate (Utilitas Bersama L2)
# ─────────────────────────────────────────────────────────────────────────────

def _domain_of(url: str) -> str:
    m = re.match(r"https?://([^/:?#]+)", url, re.IGNORECASE)
    return (m.group(1) if m else "").lower().rstrip(".")


def evaluate_urls(text: str) -> tuple[float, list[str]]:
    """Skor risiko URL 0..1 + catatan anomali."""
    notes: list[str] = []
    urls = _URL.findall(text)
    if not urls:
        return 0.0, notes

    risk = 0.0
    for url in urls:
        domain = _domain_of(url)
        try:
            ipaddress.ip_address(domain)
            risk += 0.55
            notes.append(f"url_ip_literal:{domain}")
            continue
        except ValueError:
            pass
        if domain.startswith("xn--") or ".xn--" in domain:
            risk += 0.50
            notes.append(f"punycode_domain:{domain}")
        if domain in _SHORTENERS:
            risk += 0.40
            notes.append(f"url_shortener:{domain}")
        if any(domain.endswith(t) for t in _RISKY_TLD):
            risk += 0.25
            notes.append(f"risky_tld:{domain}")

    if len(urls) >= 3:
        risk += 0.20
        notes.append(f"url_burst:{len(urls)}")

    return float(min(1.0, risk)), notes


def evaluate_burst(turns_last_minute: int) -> tuple[float, list[str]]:
    """Anomali burst rate pengirim (DoS / bot terotomatisasi, PRD §12)."""
    notes = []
    if turns_last_minute >= 20:
        notes.append(f"burst_rate:{turns_last_minute}/min")
        return 0.8, notes
    if turns_last_minute >= 10:
        notes.append(f"burst_rate:{turns_last_minute}/min")
        return 0.4, notes
    return 0.0, notes


def evaluate(text: str, turns_last_minute: int = 0, profile: str | None = None) -> L2Signal:
    """Evaluasi lengkap L2 (URL + Burst + Strategy Domain Rules)."""
    adaptor = _default_adaptor
    if profile and profile.lower() != adaptor.profile.lower():
        adaptor = ModularContextAdaptor(strategy_or_profile=profile)

    url_risk, url_notes = evaluate_urls(text)
    burst_risk, burst_notes = evaluate_burst(turns_last_minute)
    domain_risk, domain_notes = adaptor.evaluate_domain_rules(text)

    all_notes = url_notes + burst_notes + domain_notes
    total_risk = min(1.0, url_risk + burst_risk + domain_risk)
    return L2Signal(context_risk=total_risk, notes=all_notes, profile=adaptor.profile)


def get_context_adaptor() -> ModularContextAdaptor:
    """Mengembalikan active singleton adapter."""
    return _default_adaptor
