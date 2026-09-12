"""Unit test untuk Dual-Plan Scalability Architecture:
Plan A (SGLang RadixAttention) dan Plan B (vLLM PagedAttention) via WSL2 + Hyper-V + Tailscale.
"""
import pytest
from backend.app import llm_client
from backend.app import config


def test_sglang_plan_a_payload_and_metadata(monkeypatch):
    monkeypatch.setattr(config, "LLM_PROVIDER", "sglang")
    monkeypatch.setattr(config, "LLM_BASE_URL", "http://100.64.0.15:30000/v1")
    monkeypatch.setattr(config, "TAILSCALE_PEER_IP", "100.64.0.15")
    monkeypatch.setattr(config, "DEPLOYMENT_RUNTIME", "wsl2_hyperv")
    monkeypatch.setattr(llm_client, "LLM_PROVIDER", "sglang")
    monkeypatch.setattr(llm_client, "LLM_BASE_URL", "http://100.64.0.15:30000/v1")
    monkeypatch.setattr(llm_client, "TAILSCALE_PEER_IP", "100.64.0.15")
    monkeypatch.setattr(llm_client, "DEPLOYMENT_RUNTIME", "wsl2_hyperv")

    # Test URL generation
    url = llm_client._chat_url()
    assert url == "http://100.64.0.15:30000/v1/chat/completions"

    # Test Payload structure
    msgs = [{"role": "user", "content": "Halo PsychoBot"}]
    payload = llm_client._payload(msgs, stream=True)
    assert payload["stream"] is True
    assert payload["max_tokens"] == 512
    assert "messages" in payload

    # Test Info metadata
    info = llm_client.get_provider_info()
    assert info["provider"] == "sglang"
    assert info["radix_attention_supported"] == "true"
    assert info["paged_attention_supported"] == "true"
    assert "Plan A" in info["scalability_plan"]
    assert info["deployment_runtime"] == "wsl2_hyperv"
    assert info["tailscale_peer_ip"] == "100.64.0.15"


def test_vllm_plan_b_payload_and_metadata(monkeypatch):
    monkeypatch.setattr(config, "LLM_PROVIDER", "vllm")
    monkeypatch.setattr(config, "LLM_BASE_URL", "http://100.64.0.22:8000/v1")
    monkeypatch.setattr(config, "TAILSCALE_PEER_IP", "100.64.0.22")
    monkeypatch.setattr(config, "DEPLOYMENT_RUNTIME", "wsl2_hyperv")
    monkeypatch.setattr(llm_client, "LLM_PROVIDER", "vllm")
    monkeypatch.setattr(llm_client, "LLM_BASE_URL", "http://100.64.0.22:8000/v1")
    monkeypatch.setattr(llm_client, "TAILSCALE_PEER_IP", "100.64.0.22")
    monkeypatch.setattr(llm_client, "DEPLOYMENT_RUNTIME", "wsl2_hyperv")

    # Test URL generation
    url = llm_client._chat_url()
    assert url == "http://100.64.0.22:8000/v1/chat/completions"

    # Test Info metadata
    info = llm_client.get_provider_info()
    assert info["provider"] == "vllm"
    assert info["radix_attention_supported"] == "false"
    assert info["paged_attention_supported"] == "true"
    assert "Plan B" in info["scalability_plan"]
    assert info["deployment_runtime"] == "wsl2_hyperv"
    assert info["tailscale_peer_ip"] == "100.64.0.22"


def test_ollama_edge_baseline_fallback(monkeypatch):
    monkeypatch.setattr(config, "LLM_PROVIDER", "ollama")
    monkeypatch.setattr(config, "LLM_BASE_URL", "http://localhost:11434")
    monkeypatch.setattr(config, "TAILSCALE_PEER_IP", "")
    monkeypatch.setattr(config, "DEPLOYMENT_RUNTIME", "native_host")
    monkeypatch.setattr(llm_client, "LLM_PROVIDER", "ollama")
    monkeypatch.setattr(llm_client, "LLM_BASE_URL", "http://localhost:11434")
    monkeypatch.setattr(llm_client, "TAILSCALE_PEER_IP", "")
    monkeypatch.setattr(llm_client, "DEPLOYMENT_RUNTIME", "native_host")

    info = llm_client.get_provider_info()
    assert info["provider"] == "ollama"
    assert info["radix_attention_supported"] == "false"
    assert info["paged_attention_supported"] == "false"
    assert "Baseline" in info["scalability_plan"]
