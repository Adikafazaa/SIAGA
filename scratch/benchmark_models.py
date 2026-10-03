import time
import json
import httpx
import subprocess

OLLAMA_API = "http://127.0.0.1:11434/api/generate"

PROMPT = (
    "Anda adalah PsychoBot, asisten AI konseling psikologi dan klinis yang ramah, "
    "empatik, dan profesional. Jawablah dalam Bahasa Indonesia.\n\n"
    "Pasien: 'Halo, akhir-akhir ini saya sering merasa cemas berlebihan dan sulit tidur "
    "karena tekanan tugas akhir. Pikiran saya terus berputar di malam hari. "
    "Apa yang bisa saya lakukan untuk meredakan kecemasan ini?'"
)

def get_vram_usage():
    try:
        out = subprocess.check_output(
            ["nvidia-smi", "--query-gpu=memory.used,memory.total", "--format=csv,nounits,noheader"],
            text=True
        )
        used, total = out.strip().split(",")
        return int(used.strip()), int(total.strip())
    except Exception:
        return 0, 0

def benchmark_model(model_name: str):
    print(f"\n=======================================================")
    print(f"BENCHMARKING MODEL: {model_name}")
    print(f"=======================================================")
    vram_before, vram_total = get_vram_usage()
    print(f"VRAM Awal: {vram_before} MiB / {vram_total} MiB")

    payload = {
        "model": model_name,
        "prompt": PROMPT,
        "stream": True,
        "options": {
            "temperature": 0.7,
            "num_predict": 250,
            "num_ctx": 2048,
        }
    }

    t_start = time.perf_counter()
    first_token_time = None
    response_tokens = []
    
    with httpx.Client(timeout=120.0) as client:
        with client.stream("POST", OLLAMA_API, json=payload) as response:
            if response.status_code != 200:
                print(f"Error: {response.status_code} - {response.read()}")
                return None
            for line in response.iter_lines():
                if not line:
                    continue
                chunk = json.loads(line)
                token = chunk.get("response", "")
                if token and first_token_time is None:
                    first_token_time = time.perf_counter()
                response_tokens.append(token)
                if chunk.get("done"):
                    done_data = chunk
                    break

    t_end = time.perf_counter()
    vram_during, _ = get_vram_usage()

    total_time = t_end - t_start
    ttft = (first_token_time - t_start) if first_token_time else 0.0
    eval_count = done_data.get("eval_count", len(response_tokens))
    eval_duration = done_data.get("eval_duration", 0) / 1e9
    prompt_eval_count = done_data.get("prompt_eval_count", 0)
    prompt_eval_duration = done_data.get("prompt_eval_duration", 0) / 1e9

    tok_per_sec = eval_count / eval_duration if eval_duration > 0 else (eval_count / total_time)
    prompt_tok_per_sec = prompt_eval_count / prompt_eval_duration if prompt_eval_duration > 0 else 0.0

    full_reply = "".join(response_tokens).strip()

    result = {
        "model": model_name,
        "total_time_s": round(total_time, 2),
        "ttft_s": round(ttft, 2),
        "eval_count": eval_count,
        "tokens_per_sec": round(tok_per_sec, 2),
        "prompt_eval_tok_per_sec": round(prompt_tok_per_sec, 2),
        "vram_before_mib": vram_before,
        "vram_during_mib": vram_during,
        "vram_delta_mib": vram_during - vram_before,
        "reply_preview": full_reply[:300] + "...",
        "full_reply": full_reply,
    }

    print(f"Hasil {model_name}:")
    print(f"- Time to First Token: {result['ttft_s']} detik")
    print(f"- Total Waktu: {result['total_time_s']} detik")
    print(f"- Total Tokens: {result['eval_count']} tokens")
    print(f"- Kecepatan Generasi: {result['tokens_per_sec']} tokens/detik")
    print(f"- Prompt Eval Speed: {result['prompt_eval_tok_per_sec']} tokens/detik")
    print(f"- VRAM Digunakan: {result['vram_during_mib']} MiB (Naik +{result['vram_delta_mib']} MiB)")
    print(f"- Preview Respon: {result['reply_preview']}")
    return result

if __name__ == "__main__":
    res_17b = benchmark_model("qwen3:1.7b")
    time.sleep(2)
    res_4b = benchmark_model("qwen3:4b")

    with open("scratch/benchmark_results.json", "w", encoding="utf-8") as f:
        json.dump({"qwen3_1.7b": res_17b, "qwen3_4b": res_4b}, f, indent=2, ensure_ascii=False)
    print("\nBenchmark selesai! Hasil disimpan ke scratch/benchmark_results.json")
