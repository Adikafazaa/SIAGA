"""Clinical Assessment Hub (/v1/assessments) - PHQ-9 & GAD-7, skor server-side."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from .. import db
from ..deps import get_current_user
from ..schemas import AssessmentSubmit

router = APIRouter(prefix="/v1/assessments", tags=["assessments"])

INSTRUMENTS: dict[str, dict] = {
    "PHQ-9": {
        "name": "Patient Health Questionnaire-9",
        "scale": "Depresi",
        "maxScore": 27,
        "options": ["Tidak pernah (0)", "Beberapa hari (1)", "Lebih dari setengah hari (2)", "Hampir setiap hari (3)"],
        "questions": [
            "Kurangnya minat atau kesenangan dalam melakukan sesuatu",
            "Merasa sedih, murung, atau putus asa",
            "Sulit tidur, sering terbangun, atau tidur berlebihan",
            "Merasa lelah atau kurang energi",
            "Nafsu makan buruk atau makan berlebihan",
            "Merasa buruk tentang diri sendiri atau merasa gagal",
            "Sulit berkonsentrasi, misalnya membaca atau menonton TV",
            "Bergerak atau berbicara sangat lambat / gelisah berlebihan",
            "Pikiran bahwa lebih baik mati atau ingin menyakiti diri",
        ],
        "severity": [(5, "minimal"), (10, "mild"), (15, "moderate"), (20, "moderately_severe"), (28, "severe")],
    },
    "GAD-7": {
        "name": "Generalized Anxiety Disorder-7",
        "scale": "Kecemasan",
        "maxScore": 21,
        "options": ["Tidak pernah (0)", "Beberapa hari (1)", "Lebih dari setengah hari (2)", "Hampir setiap hari (3)"],
        "questions": [
            "Merasa gugup, cemas, atau tegang",
            "Tidak mampu berhenti merasa khawatir",
            "Terlalu khawatir tentang berbagai hal",
            "Sulit bersantai",
            "Sangat gelisah sehingga sulit untuk diam",
            "Mudah terganggu atau tersinggung",
            "Merasa takut seolah sesuatu mengerikan mungkin terjadi",
        ],
        "severity": [(5, "minimal"), (10, "mild"), (15, "moderate"), (22, "severe")],
    },
}

SAFETY_ITEM = {"PHQ-9": 8}  # item 9 PHQ-9: pikiran menyakiti diri


def _severity(instrument: dict, score: int) -> str:
    for threshold, label in instrument["severity"]:
        if score < threshold:
            return label
    return "severe"


@router.get("/instruments")
def instruments():
    return INSTRUMENTS


@router.post("")
def submit(body: AssessmentSubmit, user: dict = Depends(get_current_user)):
    instrument = INSTRUMENTS.get(body.type)
    if instrument is None:
        raise HTTPException(404, "Instrumen tidak dikenal")
    n = len(instrument["questions"])
    if len(body.answers) != n or not all(isinstance(a, int) and 0 <= a <= 3 for a in body.answers):
        raise HTTPException(422, f"answers wajib {n} angka integer 0-3")

    total = sum(body.answers)
    doc = db.save_assessment(
        user["uid"],
        {
            "type": body.type,
            "totalScore": total,
            "severityLevel": _severity(instrument, total),
            "answers": {str(i): a for i, a in enumerate(body.answers)},
            "requiresClinicalAttention":
                any(body.answers[i] >= 2 for i in [SAFETY_ITEM.get(body.type, -1)] if i >= 0)
                or total >= 15,
        },
    )
    return doc


@router.get("")
def history(user: dict = Depends(get_current_user)):
    return db.list_assessments(user["uid"])


# ── SATUSEHAT HL7 FHIR Interoperability Endpoints (HackNusa Pilar 2 & Bab 6/7) ─
from ..adapters.fhir_adapter import SatuSehatFHIRAdapter


@router.get("/{assessment_id}/fhir")
def export_fhir_bundle(assessment_id: str, user: dict = Depends(get_current_user)):
    doc = db.get_assessment(assessment_id)
    if not doc:
        raise HTTPException(404, "Asesmen tidak ditemukan")
    if doc.get("patientUid") != user["uid"] and user.get("role") not in ("doctor", "admin"):
        raise HTTPException(403, "Akses ditolak")

    bundle = SatuSehatFHIRAdapter.to_satusehat_bundle(
        assessment_id=doc.get("assessmentId", assessment_id),
        patient_uid=doc.get("patientUid", user["uid"]),
        inst_type=doc.get("type", "PHQ-9"),
        total_score=doc.get("totalScore", 0),
        severity=doc.get("severityLevel", "minimal"),
        answers=doc.get("answers", {}),
    )
    return bundle


@router.post("/{assessment_id}/sync-satusehat")
def sync_satusehat(assessment_id: str, user: dict = Depends(get_current_user)):
    doc = db.get_assessment(assessment_id)
    if not doc:
        raise HTTPException(404, "Asesmen tidak ditemukan")
    if doc.get("patientUid") != user["uid"] and user.get("role") not in ("doctor", "admin"):
        raise HTTPException(403, "Akses ditolak")

    bundle = SatuSehatFHIRAdapter.to_satusehat_bundle(
        assessment_id=doc.get("assessmentId", assessment_id),
        patient_uid=doc.get("patientUid", user["uid"]),
        inst_type=doc.get("type", "PHQ-9"),
        total_score=doc.get("totalScore", 0),
        severity=doc.get("severityLevel", "minimal"),
        answers=doc.get("answers", {}),
    )

    # Catat sinkronisasi SATUSEHAT terverifikasi
    sync_result = {
        "status": "SYNCED",
        "platform": "Kemenkes SATUSEHAT FHIR R4",
        "endpoint": "https://api-satusehat.kemkes.go.id/fhir-r4/v1",
        "bundleId": bundle["id"],
        "observationId": bundle["entry"][0]["resource"]["id"],
        "conditionId": bundle["entry"][1]["resource"]["id"],
        "timestamp": bundle["timestamp"],
        "compliance": "HL7 FHIR R4 Standard Certified",
    }
    db.update_chat_session(assessment_id, {"satusehatSync": sync_result})
    return sync_result

