"""SATUSEHAT HL7 FHIR & Interoperability Adapter (Solusi HackNusa Pilar 2 & Bab 6/7).

Menerjemahkan instrumen klinis (PHQ-9 / GAD-7) dan log keamanan SIAGA v2
menjadi sumber daya standar HL7 FHIR Release 4 Kemenkes RI (SATUSEHAT Platform)
serta format interoperabilitas B2B FinTech.

Sumber Daya FHIR yang Dihasilkan:
  1. Observation (LOINC 44249-1 untuk PHQ-9, 70274-6 untuk GAD-7)
  2. Condition (ICD-10 F32 untuk Episode Depresif, F41 untuk Gangguan Cemas)
  3. AuditEvent (Pencatatan insiden keamanan pertahanan AI)
  4. Bundle (Paket transaksi SATUSEHAT)
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# Pemetaan LOINC & ICD-10 Resmi
LOINC_CODES = {
    "PHQ-9": {
        "code": "44249-1",
        "display": "PHQ-9 quick depression assessment panel [Reported.PHQ]",
        "system": "http://loinc.org",
        "icd10": "F32.9",
        "condition_display": "Depressive episode, unspecified",
    },
    "GAD-7": {
        "code": "70274-6",
        "display": "Generalized anxiety disorder 7 item (GAD-7) total score [Reported.PHQ]",
        "system": "http://loinc.org",
        "icd10": "F41.1",
        "condition_display": "Generalized anxiety disorder",
    },
}

SNOMED_SEVERITY = {
    "minimal": {"code": "255604002", "display": "Mild"},
    "mild": {"code": "255604002", "display": "Mild"},
    "moderate": {"code": "6736007", "display": "Moderate"},
    "moderately_severe": {"code": "24484000", "display": "Severe"},
    "severe": {"code": "24484000", "display": "Severe"},
}


class SatuSehatFHIRAdapter:
    """Adapter untuk menghasilkan resource FHIR R4 sesuai profil Kemenkes SATUSEHAT."""

    @staticmethod
    def create_observation(
        assessment_id: str,
        patient_uid: str,
        inst_type: str,
        total_score: int,
        severity: str,
        answers: dict[str, int] | None = None,
        timestamp: str | None = None,
    ) -> dict[str, Any]:
        info = LOINC_CODES.get(inst_type, LOINC_CODES["PHQ-9"])
        ts = timestamp or _utcnow_iso()
        obs_id = f"obs-{assessment_id or uuid.uuid4().hex[:12]}"

        components = []
        if answers:
            for q_idx, score in sorted(answers.items(), key=lambda x: int(x[0])):
                components.append({
                    "code": {
                        "coding": [{
                            "system": "http://loinc.org",
                            "code": f"{info['code']}.{int(q_idx)+1}",
                            "display": f"{inst_type} Pertanyaan #{int(q_idx)+1}",
                        }]
                    },
                    "valueInteger": int(score),
                })

        return {
            "resourceType": "Observation",
            "id": obs_id,
            "identifier": [{
                "system": "https://fhir.kemkes.go.id/id/observation",
                "value": obs_id,
            }],
            "status": "final",
            "category": [{
                "coding": [{
                    "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                    "code": "survey",
                    "display": "Survey",
                }]
            }],
            "code": {
                "coding": [{
                    "system": info["system"],
                    "code": info["code"],
                    "display": info["display"],
                }]
            },
            "subject": {
                "reference": f"Patient/{patient_uid}",
                "display": f"Pasien-{patient_uid[:8]}",
            },
            "effectiveDateTime": ts,
            "valueInteger": total_score,
            "interpretation": [{
                "coding": [{
                    "system": "http://snomed.info/sct",
                    "code": SNOMED_SEVERITY.get(severity, {}).get("code", "255604002"),
                    "display": severity.capitalize(),
                }],
                "text": f"Kategori keparahan: {severity}",
            }],
            "component": components,
        }

    @staticmethod
    def create_condition(
        assessment_id: str,
        patient_uid: str,
        inst_type: str,
        severity: str,
        timestamp: str | None = None,
    ) -> dict[str, Any]:
        info = LOINC_CODES.get(inst_type, LOINC_CODES["PHQ-9"])
        ts = timestamp or _utcnow_iso()
        cond_id = f"cond-{assessment_id or uuid.uuid4().hex[:12]}"

        return {
            "resourceType": "Condition",
            "id": cond_id,
            "identifier": [{
                "system": "https://fhir.kemkes.go.id/id/condition",
                "value": cond_id,
            }],
            "clinicalStatus": {
                "coding": [{
                    "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                    "code": "active",
                    "display": "Active",
                }]
            },
            "verificationStatus": {
                "coding": [{
                    "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                    "code": "provisional",
                    "display": "Provisional",
                }]
            },
            "category": [{
                "coding": [{
                    "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                    "code": "encounter-diagnosis",
                    "display": "Encounter Diagnosis",
                }]
            }],
            "severity": {
                "coding": [{
                    "system": "http://snomed.info/sct",
                    "code": SNOMED_SEVERITY.get(severity, {}).get("code", "255604002"),
                    "display": severity.capitalize(),
                }]
            },
            "code": {
                "coding": [{
                    "system": "http://hl7.org/fhir/sid/icd-10",
                    "code": info["icd10"],
                    "display": info["condition_display"],
                }]
            },
            "subject": {
                "reference": f"Patient/{patient_uid}",
            },
            "recordedDate": ts,
        }

    @classmethod
    def to_satusehat_bundle(
        cls,
        assessment_id: str,
        patient_uid: str,
        inst_type: str,
        total_score: int,
        severity: str,
        answers: dict[str, int] | None = None,
    ) -> dict[str, Any]:
        """Menghasilkan FHIR Transaction Bundle untuk sinkronisasi Kemenkes SATUSEHAT."""
        obs = cls.create_observation(assessment_id, patient_uid, inst_type, total_score, severity, answers)
        cond = cls.create_condition(assessment_id, patient_uid, inst_type, severity)

        bundle_id = f"bundle-{uuid.uuid4().hex[:12]}"
        return {
            "resourceType": "Bundle",
            "id": bundle_id,
            "type": "transaction",
            "timestamp": _utcnow_iso(),
            "meta": {
                "profile": ["https://fhir.kemkes.go.id/r4/StructureDefinition/SATUSEHAT-Bundle"]
            },
            "entry": [
                {
                    "fullUrl": f"urn:uuid:{obs['id']}",
                    "resource": obs,
                    "request": {"method": "POST", "url": "Observation"},
                },
                {
                    "fullUrl": f"urn:uuid:{cond['id']}",
                    "resource": cond,
                    "request": {"method": "POST", "url": "Condition"},
                },
            ],
        }

    @staticmethod
    def to_fintech_audit_schema(security_log: dict[str, Any]) -> dict[str, Any]:
        """Menerjemahkan log audit keamanan SIAGA ke format standar FinTech / Banking G2B."""
        return {
            "complianceStandard": "OJK-SE-07-2023-CyberResilience",
            "incidentId": security_log.get("log_id") or str(uuid.uuid4()),
            "timestamp": security_log.get("timestamp", _utcnow_iso()),
            "eventType": "AI_INFERENCE_SECURITY_INSPECTION",
            "sessionIdentifier": security_log.get("session_id"),
            "riskScoreNormalized": security_log.get("risk_score", 0.0),
            "guardrailDecision": security_log.get("decision", "ALLOW"),
            "securityRationale": security_log.get("explanation", "Normal baseline"),
            "inspectionLatencyMs": security_log.get("latency_ms", 0.0),
            "dataClassification": "HIGHLY_CONFIDENTIAL",
        }
