"""PsychoBot Clinical Care & SIAGA Guardrail Platform - FastAPI entrypoint."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import CORS_ORIGINS, PAYLOAD_CAP_BYTES, RATE_LIMIT_PER_WINDOW, RATE_WINDOW_SECONDS
from .engine import get_engine_instance
from .routers import admin, assessments, chat, doctor, users

_rate: dict[str, list[float]] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    get_engine_instance().close()


app = FastAPI(
    title="PsychoBot + SIAGA Backend",
    version="2.1.0",
    description="Layanan konseling digital (Local AI LLM) dengan SIAGA Guardrail "
                "stateful (L0 UTS#39 / L1 ONNX dual-axis / L3 CIM) - zero-plaintext session store.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from .core.semantic_cache import get_semantic_cache
from .core.token_bucket import get_rate_limiter


@app.middleware("http")
async def gateway_checks(request: Request, call_next):
    # 1. Payload cap (≤32KB)
    cl = request.headers.get("content-length")
    if cl and int(cl) > PAYLOAD_CAP_BYTES:
        return JSONResponse({"detail": "Payload too large"}, status_code=413)

    # 2. Token-Bucket Rate Limiter & Honeypot Sandbox (HackNusa Pilar 5)
    # Abaikan pembatasan untuk endpoint sistem dasar/health
    if request.url.path in ("/health", "/v1/health", "/docs", "/openapi.json"):
        return await call_next(request)

    limiter = get_rate_limiter()
    key = request.client.host if request.client else "unknown"
    res = limiter.acquire(key)

    if res.is_honeypot:
        # Alihkan penyerang DoS/Flood ke Honeypot Sandbox decoy tanpa membebani LLM
        return JSONResponse(limiter.get_honeypot_response(key), status_code=200)

    if not res.allowed:
        return JSONResponse(
            {"detail": "Rate limit exceeded", "retry_after": round(res.retry_after, 2)},
            status_code=429,
            headers={"Retry-After": str(max(1, int(res.retry_after)))},
        )

    return await call_next(request)


from fastapi.responses import JSONResponse, RedirectResponse

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")


@app.get("/v1/health", tags=["system"], include_in_schema=False)
@app.get("/health", tags=["system"])
def health():
    engine = get_engine_instance()
    cache = get_semantic_cache()
    from .llm_client import get_provider_info
    return {
        "status": "ok",
        "engine": "siaga-cim-v2-calibrated",
        "store": str(engine.store.db_path),
        "semantic_cache_hits": cache.stats()["hit_ratio_pct"],
        "token_bucket_active": True,
        "scalability": get_provider_info(),
    }


@app.get("/v1/system/telemetry", tags=["system"])
def system_telemetry():
    cache = get_semantic_cache()
    limiter = get_rate_limiter()
    from .llm_client import get_provider_info
    import os
    return {
        "engine": "siaga-cim-v2-calibrated",
        "semantic_cache": cache.stats(),
        "rate_limiter": {
            "capacity": limiter.capacity,
            "refill_rate": limiter.refill_rate,
            "active_buckets": len(limiter._buckets),
        },
        "l2_profile": os.getenv("SIAGA_L2_PROFILE", "clinical"),
        "llm_provider": os.getenv("LLM_PROVIDER", "ollama"),
        "scalability": get_provider_info(),
    }


app.include_router(users.router)
app.include_router(chat.router)
app.include_router(assessments.router)
app.include_router(doctor.router)
app.include_router(admin.router)

