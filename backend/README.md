# SIAGA-v2 Backend — PsychoBot Clinical Care & SIAGA Guardrail Platform

FastAPI backend powering the digital clinical counseling platform protected by the stateful SIAGA guardrail architecture (L0 UTS #39 → L1 Dual-Axis ONNX → L2 Context Adapter → L3 CIM Engine) in front of an on-premise Local AI LLM.

## Running the Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt      # Linux: .venv/bin/pip
copy .env.example .env                              # Adjust LLM_BASE_URL, etc.
.venv\Scripts\uvicorn app.main:app --port 8000 --reload
```

- Interactive OpenAPI/Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: `GET /health`
- Automated Tests: `.venv\Scripts\python -m pytest tests -q`

## Operating Modes

| Condition | Behavior |
|---|---|
| `LLM_PROVIDER=ollama` / `openai_compatible` + server active | Chat flows directly to Local LLM (Server-Sent Events / SSE streaming supported) |
| Local LLM server offline | Automatic fallback to empathetic clinical PsychoBot persona (zero-downtime) |
| `FIREBASE_CREDENTIALS_PATH` set + `firebase-admin` installed | Cloud Firestore + Firebase ID token verification |
| Without Firebase credentials (default dev mode) | Local SQLite store (`data/psycho_local.db`) + dev bearer tokens |

**Development Bearer Tokens (Active when Firebase is not configured):**
`Authorization: Bearer dev-<uid>` — e.g. `Bearer dev-patient-1`.
User roles are extracted from user profiles; doctor provisioning requires an 8-digit medical license number (SIP) via `POST /v1/users/onboarding`.

## API Contracts (Frontend Summary)

All endpoints (except `/health`) require the `Authorization: Bearer <token>` header.

### Chat (`/v1/chat`)
| Endpoint | Functionality |
|---|---|
| `POST /message` | Sends user message → L0–L3 guardrail evaluation → forwarded to Local LLM (if ALLOW/WATCH). Returns synchronous JSON reply. |
| `POST /stream` | Streaming endpoint via **Server-Sent Events (SSE)**: `event: guardrail` (decision + risk metrics) → `event: token` (streamed text tokens) → `event: done`. |
| `POST /probe/verify` | Verifies the response to an active Reverse Turing Probe `{session_id, reply}`. |
| `GET /sessions` / `POST /sessions` | List or create chat counseling sessions. |
| `GET /sessions/{id}/messages` | Retrieve conversation turn history for a session. |
| `GET /sessions/{id}/metrics` | Returns stateful CIM metrics (momentum curve, turn-by-turn decisions) for the Live Guard Monitor. |

Sample Response for `POST /message`:

```json
{
  "session_id": "sess_99812",
  "status": "ALLOWED",            // ALLOWED | BLOCKED | REFUSED
  "decision": "ALLOW",            // ALLOW | WATCH | PROBE | BLOCK
  "reply": "...",
  "risk_score": 0.08,
  "reason": null,
  "stateful_metrics": { "momentum": 0.08, "direction_consistency": 0.25, "anchor_score": 0.0, "turns_to_detection": null },
  "latency_ms": { "l0": 0.8, "l1": 12.5, "l2": 0.3, "cim": 8.9, "total": 22.2 },
  "explanation": [ { "turn": 1, "reason": "Signal below threshold; ALLOW" } ]
}
```

- When `decision=PROBE`, `reply` contains a challenge (e.g. DPJP physician verification); submit user response to `POST /probe/verify`.
- When `decision=BLOCK`, the session is locked and `reply` provides a safe crisis de-escalation message.

### Users (`/v1/users`)
- `GET /me`: Returns profile of the authenticated user.
- `POST /onboarding`: `{role: "patient"|"doctor", displayName?, doctorLicenseId?, preferences?}`; doctors require an 8-digit SIP.

### Assessments (`/v1/assessments`)
- `GET /instruments`: Returns standardized screening question sets for PHQ-9 (9 items) & GAD-7 (7 items) with 0–3 scoring scales.
- `POST /`: Submits assessment `{type: "PHQ-9"|"GAD-7", answers: number[]}` → returns severity score and clinical attention flags.
- `GET /`: Returns assessment history.

### Psychiatrist Portal / DPJP (`/v1/doctor`, Role: `doctor` or `admin`)
- `GET /patients`: Patient list with latest assessment summaries.
- `GET /patients/{uid}`: Detailed clinical profile, assessments, records, and session histories.
- `POST /records`: `{patientUid, notes}` adds an encrypted clinical record.

### SOC Admin Telemetry (`/v1/admin`, Role: `admin` or `doctor`)
- `GET /telemetry`: SOC summary: decision distribution, block rates, p50/p95 latency metrics, and recent events.
- `GET /security-logs?limit=`: Detailed forensic audit logs for security events.
- `GET /llm-status`: Local AI health check and latency status.

## Privacy (Zero-Plaintext Session Retention)

The guardrail state store (DuckDB, `data/siaga_sessions.duckdb`) **strictly** stores message SHA-256 hashes, compressed embeddings, and risk trajectory states with a 24-hour TTL expiration. Raw user conversation text is never persisted in the guardrail store.

## Architecture & Code Structure

```
backend/app/
├── main.py            # FastAPI entrypoint: CORS, token bucket rate limiter, payload cap, routers
├── config.py          # Central Pydantic settings & .env configuration
├── schemas.py         # Pydantic data contracts
├── engine.py          # Guardrail orchestrator (L0–L3) & multi-signal decision fusion
├── db.py              # Data repository: Cloud Firestore (production) / SQLite (development)
├── deps.py            # Authentication dependencies: Firebase ID tokens / dev tokens
├── llm_client.py      # Streaming Local AI client (Ollama / SGLang / OpenAI-compatible)
├── adapters/          # HL7 FHIR Interoperability adapters
├── core/              # L0 canonicalization, L1 dual-axis ONNX classifiers, L2 context adapter
│   └── l3_cim/        # ★ CIM Engine: momentum formula, vector trajectory, session store
├── probe/             # Reverse Turing Protocol & clinical canary evaluation
└── routers/           # chat, users, assessments, doctor, admin
```
