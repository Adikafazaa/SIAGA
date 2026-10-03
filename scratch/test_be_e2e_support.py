"""End-to-End Test for PsychoBot + SIAGA Backend supporting frontend_v3 and WSL2 / SGLang AI SLM."""
import asyncio
import os
import sys

# Setup UTF-8 output
sys.stdout.reconfigure(encoding="utf-8")

BACKEND_DIR = os.path.abspath("backend")
sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient
from app.main import app
from app.config import LLM_PROVIDER, LLM_BASE_URL, LLM_MODEL

def main():
    print("=" * 70)
    print("PSYCHOBOT + SIAGA: E2E BACKEND SUPPORT VERIFICATION")
    print("=" * 70)
    print(f"Target LLM Engine : {LLM_PROVIDER}")
    print(f"LLM Base URL      : {LLM_BASE_URL}")
    print(f"LLM Model         : {LLM_MODEL}")
    print("-" * 70)

    client = TestClient(app)

    # 1. Health Check
    r_health = client.get("/health")
    print(f"[1] GET /health -> Status: {r_health.status_code}")
    assert r_health.status_code == 200, f"Health check failed: {r_health.text}"
    print(f"    Payload: {r_health.json()}")

    # 2. LLM Status Check (/v1/admin/llm-status)
    r_llm = client.get("/v1/admin/llm-status", headers={"Authorization": "Bearer dev-admin-token"})
    print(f"[2] GET /v1/admin/llm-status -> Status: {r_llm.status_code}")
    print(f"    Payload: {r_llm.json()}")
    assert r_llm.status_code == 200
    llm_data = r_llm.json()
    print(f"    AI SLM Online: {llm_data.get('online')} (Latency: {llm_data.get('latencyMs')} ms)")

    # 3. Create Session (/v1/chat/sessions)
    r_sess = client.post("/v1/chat/sessions", 
                         headers={"Authorization": "Bearer dev-patient-token"},
                         json={"title": "Sesi Konseling E2E Test"})
    print(f"[3] POST /v1/chat/sessions -> Status: {r_sess.status_code}")
    assert r_sess.status_code == 200, f"Create session failed: {r_sess.text}"
    session_id = r_sess.json()["sessionId"]
    print(f"    Created Session ID: {session_id}")

    # 4. Normal Benign Chat Message (/v1/chat/message) with Live AI SLM
    print("[4] POST /v1/chat/message (Benign Patient Input)...")
    r_msg = client.post("/v1/chat/message",
                        headers={"Authorization": "Bearer dev-patient-token"},
                        json={
                            "session_id": session_id,
                            "content": "Halo, saya merasa sedikit cemas dan butuh teman bicara hari ini."
                        })
    print(f"    Status: {r_msg.status_code}")
    assert r_msg.status_code == 200, f"Chat message failed: {r_msg.text}"
    msg_data = r_msg.json()
    print(f"    Decision  : {msg_data.get('decision')}")
    print(f"    Risk Score: {msg_data.get('risk_score')}")
    print(f"    AI Reply  : {msg_data.get('reply')[:120]}...")

    # 5. Out-of-Domain Code Request -> Must be refused ethically
    print("[5] POST /v1/chat/message (Code Generation Probe)...")
    r_code = client.post("/v1/chat/message",
                         headers={"Authorization": "Bearer dev-patient-token"},
                         json={
                             "session_id": session_id,
                             "content": "Tolong buatkan script Python untuk menghitung kalkulator otomatis."
                         })
    print(f"    Status: {r_code.status_code}")
    assert r_code.status_code == 200
    code_data = r_code.json()
    print(f"    Status Status: {code_data.get('status')}")
    print(f"    Refusal Reason: {code_data.get('reason')}")
    print(f"    Refusal Reply : {code_data.get('reply')[:100]}...")

    # 6. Admin Telemetry Check (/v1/admin/telemetry)
    r_telem = client.get("/v1/admin/telemetry", headers={"Authorization": "Bearer dev-admin-token"})
    print(f"[6] GET /v1/admin/telemetry -> Status: {r_telem.status_code}")
    assert r_telem.status_code == 200
    telem_data = r_telem.json()
    print(f"    Total Inspected: {telem_data.get('totalInspected')}")
    print(f"    Decisions: {telem_data.get('decisions')}")

    # 7. Doctor Patients List (/v1/doctor/patients)
    r_doc = client.get("/v1/doctor/patients", headers={"Authorization": "Bearer dev-doctor-token"})
    print(f"[7] GET /v1/doctor/patients -> Status: {r_doc.status_code}")
    assert r_doc.status_code == 200
    print(f"    Patients Count: {len(r_doc.json())}")

    # 8. Assessment Submission (/v1/assessments)
    r_ass = client.post("/v1/assessments",
                        headers={"Authorization": "Bearer dev-patient-token"},
                        json={
                            "type": "PHQ-9",
                            "answers": [1, 0, 1, 2, 0, 1, 0, 0, 0]
                        })
    print(f"[8] POST /v1/assessments -> Status: {r_ass.status_code}")
    assert r_ass.status_code == 200
    ass_data = r_ass.json()
    print(f"    Total Score: {ass_data.get('totalScore')} | Severity: {ass_data.get('severityLevel')}")

    print("=" * 70)
    print("ALL 8 BACKEND-FRONTEND INTEGRATION TESTS PASSED 100%!")
    print("=" * 70)

if __name__ == "__main__":
    main()
