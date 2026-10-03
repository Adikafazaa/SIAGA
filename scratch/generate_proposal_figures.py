import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

output_dir = r"D:\KULIAH-1\ITENAS\HackNusa\Prototype\SIAGA\Knowledge\Docs\proposal\figures"
os.makedirs(output_dir, exist_ok=True)

plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#cbd5e1'
plt.rcParams['axes.linewidth'] = 0.8

# -------------------------------------------------------------
# Figure 1: High-Level Modular Flat Design System Architecture
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 5.5), dpi=300)
ax.set_facecolor('#f8fafc')
fig.patch.set_facecolor('#ffffff')

# Draw layers
def draw_card(ax, xy, w, h, bg_color, border_color, title, subtitle="", radius=0.03):
    box = patches.FancyBboxPatch(xy, w, h, boxstyle=f"round,pad={radius},rounding_size=0.03", 
                                 facecolor=bg_color, edgecolor=border_color, linewidth=1.5, zorder=2)
    ax.add_patch(box)
    ax.text(xy[0] + w/2, xy[1] + h - 0.12, title, ha='center', va='top', fontsize=10, fontweight='bold', color='#0f172a', zorder=3)
    if subtitle:
        ax.text(xy[0] + w/2, xy[1] + h/2 - 0.05, subtitle, ha='center', va='center', fontsize=8, color='#475569', zorder=3)

# 1. UI Layer
draw_card(ax, (0.05, 0.72), 0.26, 0.22, '#eff6ff', '#3b82f6', "Patient Care Console", "• PHQ-9 & GAD-7 Screening\n• Empathetic Streaming (SSE)\n• Emergency Crisis Prompt")
draw_card(ax, (0.37, 0.72), 0.26, 0.22, '#f0fdf4', '#22c55e', "DPJP Clinical Portal", "• 8-Digit SIP Verification\n• Electronic Health Record (EHR)\n• Doctor Takeover Override")
draw_card(ax, (0.69, 0.72), 0.26, 0.22, '#faf5ff', '#a855f7', "SOC Security Telemetry", "• Live CIM Momentum Graph\n• Token-Bucket Limiter Monitor\n• Cryptographic Audit Trail")

# Arrows UI -> Gateway
for x_c in [0.18, 0.50, 0.82]:
    ax.annotate("", xy=(x_c, 0.58), xytext=(x_c, 0.72),
                arrowprops=dict(arrowstyle="->", color="#64748b", lw=1.5, ls="--"))

# 2. Security Gateway
gateway_box = patches.FancyBboxPatch((0.05, 0.25), 0.90, 0.32, boxstyle="round,pad=0.02,rounding_size=0.03",
                                    facecolor='#f1f5f9', edgecolor='#0284c7', linewidth=2.0, zorder=1)
ax.add_patch(gateway_box)
ax.text(0.50, 0.54, "SIAGA STATEFUL SECURITY GATEWAY (Sub-25ms CPU Engine)", ha='center', va='center', fontsize=11, fontweight='bold', color='#0369a1')

# Pipeline pills inside Gateway
draw_card(ax, (0.07, 0.28), 0.19, 0.20, '#ffffff', '#94a3b8', "L0 Canonicalizer", "Unicode UTS #39\nZero-width / Leet\nLatency: 0.8ms")
draw_card(ax, (0.29, 0.28), 0.19, 0.20, '#ffffff', '#94a3b8', "L1 Intent Classifier", "Dual-Axis ONNX INT8\nCoercive & Injection\nLatency: 14.2ms")
draw_card(ax, (0.51, 0.28), 0.19, 0.20, '#ffffff', '#94a3b8', "L2 Clinical Context", "Domain Rule Enforcer\nSATUSEHAT HL7 FHIR\nLatency: 3.1ms")
draw_card(ax, (0.73, 0.28), 0.20, 0.20, '#ffffff', '#94a3b8', "L3 CIM Engine", "Cumulative Momentum\nTrajectory Tracker\nLatency: 4.2ms")

# Internal arrows in gateway
for x_a in [0.26, 0.48, 0.70]:
    ax.annotate("", xy=(x_a + 0.03, 0.38), xytext=(x_a, 0.38),
                arrowprops=dict(arrowstyle="->", color="#0284c7", lw=1.5))

# 3. Bottom Layer: Local LLM & Database
draw_card(ax, (0.12, 0.03), 0.35, 0.16, '#fefce8', '#eab308', "Sovereign Local LLM", "Ollama / vLLM (Qwen 1.7B / Llama 3 8B)\nZero-Data-Retention | CUDA Accelerated")
draw_card(ax, (0.53, 0.03), 0.35, 0.16, '#ecfdf5', '#10b981', "Stateful Session Store", "DuckDB Zero-Plaintext Engine\nSHA-256 Vector Trajectory | 24h Auto-Purge")

ax.annotate("", xy=(0.29, 0.19), xytext=(0.29, 0.25), arrowprops=dict(arrowstyle="->", color="#ca8a04", lw=1.5))
ax.annotate("", xy=(0.71, 0.19), xytext=(0.71, 0.25), arrowprops=dict(arrowstyle="->", color="#059669", lw=1.5))

ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.axis('off')
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "figure_1_system_architecture.png"), dpi=300)
plt.close()
print("Saved figure_1_system_architecture.png")

# -------------------------------------------------------------
# Figure 3: Momentum Escalation Curves (Dataset Sintetis)
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(9, 4.5), dpi=300)
ax.set_facecolor('#ffffff')
fig.patch.set_facecolor('#ffffff')

turns = np.array([1, 2, 3, 4, 5])
scen1 = np.array([0.08, 0.35, 0.58, 0.72, 0.86])
scen2 = np.array([0.05, 0.25, 0.48, 0.75, 0.88])
scen3 = np.array([0.10, 0.38, 0.55, 0.72, 0.89])
scen4 = np.array([0.04, 0.12, 0.18, 0.09, 0.05])

# Threshold zones
ax.axhspan(0.00, 0.45, color='#dcfce7', alpha=0.5, label='Zone: ALLOW (Normal Safe Zone)')
ax.axhspan(0.45, 0.60, color='#fef9c3', alpha=0.6, label='Zone: WATCH (Elevated Telemetry)')
ax.axhspan(0.60, 0.80, color='#ffedd5', alpha=0.6, label='Zone: PROBE (Reverse Turing Canary)')
ax.axhspan(0.80, 1.00, color='#fee2e2', alpha=0.6, label='Zone: BLOCK (Session Lockout)')

ax.plot(turns, scen1, marker='o', color='#dc2626', lw=2.2, label='Scenario 1: Medical Record Exfiltration (Authority Spoofing)')
ax.plot(turns, scen2, marker='s', color='#ea580c', lw=2.2, label='Scenario 2: Prescription Coercion (Fake Emergency)')
ax.plot(turns, scen3, marker='^', color='#9333ea', lw=2.2, label='Scenario 3: Persona Subversion (Roleplay Inversion)')
ax.plot(turns, scen4, marker='D', color='#16a34a', lw=2.5, ls='--', label='Scenario 4: Real Distressed Patient (Negative Control - 0% FPR)')

ax.set_title("Trajectory of Cumulative Intent Momentum ($M_t$) Across Multi-Turn Dialogue", fontsize=11, fontweight='bold', pad=12, color='#0f172a')
ax.set_xlabel("Conversation Turn ($t$)", fontsize=10, fontweight='bold', color='#1e293b')
ax.set_ylabel("Cumulative Momentum Score ($M_t$)", fontsize=10, fontweight='bold', color='#1e293b')
ax.set_xticks(turns)
ax.set_xticklabels(['Turn 1\n(Intro)', 'Turn 2\n(Inquiry)', 'Turn 3\n(Escalation)', 'Turn 4\n(Coercion/Probe)', 'Turn 5\n(Block)'])
ax.set_ylim(-0.02, 1.02)
ax.grid(True, linestyle=':', alpha=0.6, color='#94a3b8')
ax.legend(loc='upper left', fontsize=8, framealpha=0.9)

plt.tight_layout()
plt.savefig(os.path.join(output_dir, "figure_3_momentum_curves.png"), dpi=300)
plt.close()
print("Saved figure_3_momentum_curves.png")

# -------------------------------------------------------------
# Figure 4: Pipeline Flow Detailed Diagram
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(9.5, 4.2), dpi=300)
ax.set_facecolor('#ffffff')
fig.patch.set_facecolor('#ffffff')

pipeline_steps = [
    ("User Input\nPayload", "#e2e8f0", "#475569"),
    ("L0 Canonicalizer\n(UTS #39 Normalization)", "#e0f2fe", "#0284c7"),
    ("L1 Intent Classifier\n(Dual-Axis ONNX INT8)", "#f0fdf4", "#16a34a"),
    ("L2 Clinical Context\n(Boundary & FHIR)", "#fefce8", "#ca8a04"),
    ("L3 CIM Engine\n(Momentum Tracking)", "#fae8ff", "#9333ea"),
    ("Decision Matrix\n(Allow/Watch/Probe/Block)", "#fee2e2", "#dc2626")
]

for idx, (title, bg, border) in enumerate(pipeline_steps):
    x = 0.03 + idx * 0.16
    box = patches.FancyBboxPatch((x, 0.35), 0.14, 0.40, boxstyle="round,pad=0.015,rounding_size=0.02",
                                 facecolor=bg, edgecolor=border, linewidth=1.8)
    ax.add_patch(box)
    ax.text(x + 0.07, 0.55, title, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#0f172a')
    if idx < len(pipeline_steps) - 1:
        ax.annotate("", xy=(x + 0.16, 0.55), xytext=(x + 0.14, 0.55),
                    arrowprops=dict(arrowstyle="->", color="#64748b", lw=2.0))

# Decision branches from step 5
ax.annotate("ALLOW (M < 0.45)\n--> Sovereign Local LLM", xy=(0.85, 0.88), xytext=(0.85, 0.75),
            arrowprops=dict(arrowstyle="->", color="#16a34a", lw=1.5), fontsize=7.5, color="#16a34a", fontweight='bold')
ax.annotate("PROBE (0.60 <= M < 0.80)\n--> Reverse Turing Canary", xy=(0.85, 0.12), xytext=(0.85, 0.35),
            arrowprops=dict(arrowstyle="->", color="#ea580c", lw=1.5), fontsize=7.5, color="#ea580c", fontweight='bold')

ax.set_xlim(0, 1.05)
ax.set_ylim(0, 1)
ax.axis('off')
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "figure_4_pipeline_flow.png"), dpi=300)
plt.close()
print("Saved figure_4_pipeline_flow.png")

# -------------------------------------------------------------
# Figure 5: Enterprise Scaling & Tailscale ZTNA Mesh
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(9.5, 4.2), dpi=300)
ax.set_facecolor('#ffffff')
fig.patch.set_facecolor('#ffffff')

# Clinic nodes
draw_card(ax, (0.05, 0.65), 0.24, 0.28, '#f0fdf4', '#16a34a', "Puskesmas / Clinic A", "Local Edge Appliance\nGTX 1650 / RTX 3060\nCare Console Client")
draw_card(ax, (0.05, 0.10), 0.24, 0.28, '#f0fdf4', '#16a34a', "Hospital Clinic B", "Local Edge Appliance\nIntel Core i5 / 16GB\nDPJP Doctor Station")

# Central Mesh Cloud
mesh_box = patches.FancyBboxPatch((0.36, 0.22), 0.26, 0.58, boxstyle="round,pad=0.02,rounding_size=0.03",
                                  facecolor='#eff6ff', edgecolor='#2563eb', linewidth=2.0)
ax.add_patch(mesh_box)
ax.text(0.49, 0.68, "TAILSCALE ZTNA MESH", ha='center', va='center', fontsize=9.5, fontweight='bold', color='#1d4ed8')
ax.text(0.49, 0.48, "• WireGuard Point-to-Point\n• Mutual TLS End-to-End\n• Zero Public Ports Open\n• Full Sub-Net Isolation", 
        ha='center', va='center', fontsize=8, color='#334155')

# Central Datacenter Node
draw_card(ax, (0.69, 0.22), 0.26, 0.58, '#faf5ff', '#9333ea', "Central RSUP Datacenter", 
          "SGLang / vLLM Engine\n2x NVIDIA A10G / L40S\n\n• RadixAttention KV-Cache\n• SATUSEHAT HL7 Gateway\n• Central Audit DuckDB")

# Connectors
ax.annotate("", xy=(0.36, 0.70), xytext=(0.29, 0.75), arrowprops=dict(arrowstyle="<->", color="#2563eb", lw=1.8, ls="--"))
ax.annotate("", xy=(0.36, 0.35), xytext=(0.29, 0.25), arrowprops=dict(arrowstyle="<->", color="#2563eb", lw=1.8, ls="--"))
ax.annotate("", xy=(0.69, 0.50), xytext=(0.62, 0.50), arrowprops=dict(arrowstyle="<->", color="#2563eb", lw=2.0))

ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.axis('off')
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "figure_5_scaling_mesh.png"), dpi=300)
plt.close()
print("Saved figure_5_scaling_mesh.png")

# -------------------------------------------------------------
# Figure 6: Strategic Roadmap Infographic
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(9.5, 3.8), dpi=300)
ax.set_facecolor('#ffffff')
fig.patch.set_facecolor('#ffffff')

# 3 phase boxes
phases = [
    ("Phase 1: Q4 2026\nCampus Clinical Pilot", "#eff6ff", "#3b82f6", 
     "• Pilot at ITENAS Health Center\n• 5,000 session calibration\n• Copyright & Patent DJKI Filing\n• Zero False Positive Validation"),
    ("Phase 2: Q1-Q2 2027\nRegulator & Regional Hospitals", "#f0fdf4", "#22c55e", 
     "• SATUSEHAT Sandbox Certification\n• B2B Rollout to 3 RSUD & 10 Puskesmas\n• On-Premise Appliance Licensing\n• Disaster Recovery Resilience"),
    ("Phase 3: Q3-Q4 2027\nNational Enterprise & BSSN", "#faf5ff", "#a855f7", 
     "• Private Hospital Chains & BUMN\n• Modular L2 for FinTech & e-Gov\n• Joint Framework with BSSN\n• National Cyber Immunity Standard")
]

for i, (title, bg, border, content) in enumerate(phases):
    x = 0.04 + i * 0.32
    box = patches.FancyBboxPatch((x, 0.15), 0.28, 0.72, boxstyle="round,pad=0.02,rounding_size=0.03",
                                 facecolor=bg, edgecolor=border, linewidth=2.0)
    ax.add_patch(box)
    ax.text(x + 0.14, 0.76, title, ha='center', va='top', fontsize=9, fontweight='bold', color='#0f172a')
    ax.text(x + 0.02, 0.44, content, ha='left', va='center', fontsize=7.5, color='#334155', linespacing=1.4)
    if i < 2:
        ax.annotate("", xy=(x + 0.32, 0.50), xytext=(x + 0.28, 0.50),
                    arrowprops=dict(arrowstyle="->", color="#94a3b8", lw=2.5))

ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.axis('off')
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "figure_6_roadmap.png"), dpi=300)
plt.close()
print("Saved figure_6_roadmap.png")

# -------------------------------------------------------------
# Figure 2: UI Showcase Mockup Panel
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 4.8), dpi=300)
ax.set_facecolor('#f8fafc')
fig.patch.set_facecolor('#ffffff')

# Panel A: Patient Console
draw_card(ax, (0.03, 0.10), 0.30, 0.80, '#ffffff', '#0284c7', "(a) Patient Care Console", 
          "PHQ-9 / GAD-7 Assessment\nInteractive Choice Chips\n\nStreaming Empathetic Chat\n'Halo, ceritakan apa yang\nkamu rasakan saat ini...'\n\nEmergency 119 Ext 8 Banner")

# Panel B: DPJP Clinical Portal
draw_card(ax, (0.35, 0.10), 0.30, 0.80, '#ffffff', '#16a34a', "(b) DPJP Clinical Portal", 
          "SIP 8-Digit Verification\nStatus: Dr. Sp.KJ Verified\n\nPatient Risk Matrix:\n• Patient #psy-7710\n• Severity: Moderate\n• Status: Protected\n\n[Emergency Takeover]")

# Panel C: SOC Telemetry
draw_card(ax, (0.67, 0.10), 0.30, 0.80, '#ffffff', '#9333ea', "(c) SOC Security Telemetry", 
          "Live Momentum Telemetry:\n• Turn 1: 0.08 (ALLOW)\n• Turn 2: 0.35 (WATCH)\n• Turn 3: 0.58 (WATCH)\n• Turn 4: 0.72 (PROBE)\n• Turn 5: 0.86 (BLOCKED)\n\nToken-Bucket: 100% Normal\nPlaintext Leak: 0.0%")

ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.axis('off')
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "figure_2_ui_showcase.png"), dpi=300)
plt.close()
print("Saved figure_2_ui_showcase.png")
