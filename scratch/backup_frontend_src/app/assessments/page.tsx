"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Heart,
  MessageSquare,
  Mic,
  Moon,
  RotateCcw,
  ShieldCheck,
  Smile,
  Sparkles,
  Volume2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FreudButton } from "@/components/ui/FreudButton";
import { Guard } from "@/features/auth/role-guard";
import { useAuth } from "@/features/auth/auth-provider";
import { useChatContext } from "@/features/chat/chat-context";
import { saveAssessment } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function AssessmentsPage() {
  return (
    <Guard roles={["patient"]}>
      <AppShell>
        <WellnessAssessmentWorkspace />
      </AppShell>
    </Guard>
  );
}

// 5 Arcs pada Roda Emosi (Mood Wheel) sesuai Referensi Gambar WhatsApp 5
const MOOD_LEVELS = [
  { id: 1, label: "Sangat Berat / Tertekan", shortText: "Intense", emoji: "😫", color: "#F36F43", angle: -65 },
  { id: 2, label: "Rendah / Kurang Semangat", shortText: "Low", emoji: "😔", color: "#F58A55", angle: -30 },
  { id: 3, label: "Cukup / Fair", shortText: "Fair", emoji: "😐", color: "#B49682", angle: 0 },
  { id: 4, label: "Netral / Tenang", shortText: "Neutral", emoji: "🙂", color: "#F5C652", angle: 30 },
  { id: 5, label: "Positif / Berenergi", shortText: "Positive", emoji: "😊", color: "#93AD5D", angle: 65 },
];

// 5 Tingkatan Kualitas Tidur (Sleep Quality) sesuai Referensi Gambar WhatsApp 5
const SLEEP_LEVELS = [
  { id: 5, label: "Excellent", hours: "7–9 HOURS", emoji: "😃", color: "#93AD5D" },
  { id: 4, label: "Good", hours: "6–7 HOURS", emoji: "😊", color: "#F5C652" },
  { id: 3, label: "Fair", hours: "5 HOURS", emoji: "😐", color: "#B49682" },
  { id: 2, label: "Poor", hours: "3–4 HOURS", emoji: "😟", color: "#F58A55" },
  { id: 1, label: "Worst", hours: "<3 HOURS", emoji: "😵", color: "#8064E8" },
];

/**
 * WellnessAssessmentWorkspace — Alur Wellness Assessment Tepat 3 Halaman
 *
 * Sesuai Dokumen HAVENCARE_FE_UIUX_FLOW_DESIGN.md Bab 10 & Referensi Gambar 5:
 * - Halaman 1 (1/3): Mood Wheel (Semicircular dial gauge emosi interaktif)
 * - Halaman 2 (2/3): Sleep Quality Slider (Slider kualitas & durasi tidur vertikal)
 * - Halaman 3 (3/3): Expression Analysis (Textarea bebas + voice button + refleksi)
 */
function WellnessAssessmentWorkspace() {
  const router = useRouter();
  const { user } = useAuth();
  const chat = useChatContext();

  // Step Navigasi (1, 2, atau 3)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Nilai Asesmen
  const [selectedMoodId, setSelectedMoodId] = useState<number>(4); // Default: Neutral
  const [selectedSleepId, setSelectedSleepId] = useState<number>(4); // Default: Good
  const [expressionText, setExpressionText] = useState<string>("");
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);

  // Status Selesai
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const currentMood = MOOD_LEVELS.find((m) => m.id === selectedMoodId) || MOOD_LEVELS[3];
  const currentSleep = SLEEP_LEVELS.find((s) => s.id === selectedSleepId) || SLEEP_LEVELS[1];

  const handleNextStep = () => {
    if (step < 3) {
      setStep((step + 1) as 2 | 3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (user?.uid) {
      try {
        await saveAssessment(
          user.uid,
          "PHQ-9",
          {
            mood: selectedMoodId,
            sleep: selectedSleepId,
            expression: expressionText ? 1 : 0,
          },
          selectedMoodId * 2 + selectedSleepId * 2,
          selectedMoodId >= 4 ? "Minimal" : selectedMoodId >= 2 ? "Sedang" : "Berat"
        );
      } catch (err) {
        console.warn("Gagal menyimpan asesmen ke cloud, tetap menggunakan state lokal:", err);
      }
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleDiscussWithAI = async () => {
    const summaryPrompt = `Halo HavenCare AI, aku baru saja menyelesaikan check-in wellness. Suasana hatiku: ${currentMood.label}, Kualitas tidur: ${currentSleep.label} (${currentSleep.hours}). Hal yang sedang kupikirkan: "${expressionText || "Ingin berdiskusi mengenai ritme aktivitasku."}". Bisakah kamu membantuku merefleksikannya?`;

    await chat.createNewSession();
    await chat.send(summaryPrompt);
    router.push("/chat");
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF6EE] text-[#2C1D11] p-4 sm:p-6 lg:p-8 flex flex-col justify-between max-w-4xl mx-auto select-none font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & STEP INDICATOR (Langkah X dari 3)                          */}
      {/* ========================================================================= */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => (step > 1 ? handlePrevStep() : router.push("/dashboard"))}
            className="w-10 h-10 rounded-full bg-white border border-[#DCD7CE] flex items-center justify-center text-[#2C1D11] hover:border-[#1A7F8E] transition-all shadow-2xs active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="text-center">
            <span className="text-[11px] font-bold text-[#786A5E] uppercase tracking-wider">
              Wellness Assessment
            </span>
            <p className="text-xs font-extrabold text-[#2C1D11]">
              Langkah {step} dari 3
            </p>
          </div>

          <Link
            href="/dashboard"
            className="text-xs font-bold text-[#786A5E] hover:text-[#2C1D11] px-3 py-1.5 rounded-full bg-white border border-[#DCD7CE] shadow-2xs"
          >
            Batal
          </Link>
        </div>

        {/* Progress Bar 3 Segmen */}
        <div className="w-full grid grid-cols-3 gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                s <= step ? "bg-[#1A7F8E]" : "bg-[#DCD7CE]/60"
              )}
            />
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BODY CONTENT BERDASARKAN LANGKAH                                       */}
      {/* ========================================================================= */}
      <main className="my-8 flex-1 flex flex-col items-center justify-center">
        {/* ================================================================= */}
        {/* LANGKAH 1: MOOD WHEEL (SEMI-CIRCULAR DIAL EMOJI)                   */}
        {/* ================================================================= */}
        {step === 1 && (
          <div className="w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 border border-[#DCD7CE] shadow-sm text-center space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#8DA85E] bg-[#8DA85E]/15 px-3 py-1 rounded-full uppercase tracking-wider">
                1 OF 3 • EMOTION
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#2C1D11] tracking-tight mt-3">
                How would you describe your mood?
              </h1>
              <p className="text-xs text-[#786A5E] mt-1">
                Pilih segmen pada roda untuk mengekspresikan kondisimu saat ini.
              </p>
            </div>

            {/* Selected Big Emoji Feedback */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-[#786A5E] mb-1">
                I Feel {currentMood.shortText}.
              </span>
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-md border-4 transition-all duration-200 scale-105"
                style={{ borderColor: currentMood.color, backgroundColor: `${currentMood.color}15` }}
              >
                {currentMood.emoji}
              </div>
            </div>

            {/* Semicircular Mood Wheel Component */}
            <div className="relative w-64 h-32 mx-auto mt-4 overflow-hidden flex items-end justify-center">
              {/* Semicircular background arc */}
              <div className="absolute inset-0 rounded-t-full border-[28px] border-t-[#93AD5D] border-r-[#F5C652] border-l-[#F36F43] border-b-0 opacity-80" />

              {/* Interactive Clickable Arc Buttons */}
              <div className="absolute inset-0 flex items-center justify-between px-2 pt-6">
                {MOOD_LEVELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMoodId(m.id)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-transform",
                      "hover:scale-125 active:scale-95",
                      selectedMoodId === m.id ? "scale-125 ring-2 ring-white shadow-md" : "opacity-80"
                    )}
                    style={{ backgroundColor: m.color }}
                    title={m.label}
                  >
                    <span>{m.emoji}</span>
                  </button>
                ))}
              </div>

              {/* Needle Indicator */}
              <div
                className="absolute bottom-0 w-3 h-16 bg-[#2C1D11] rounded-t-full origin-bottom transition-transform duration-300 shadow-md"
                style={{ transform: `rotate(${currentMood.angle}deg)` }}
              />
              <div className="absolute bottom-0 w-6 h-6 rounded-full bg-[#2C1D11] ring-4 ring-white" />
            </div>

            {/* Label Aktif di Bawah Roda */}
            <div className="p-3 bg-[#FAF6EE] rounded-2xl border border-[#DCD7CE]/70">
              <p className="text-xs font-bold text-[#2C1D11]">
                {currentMood.label}
              </p>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* LANGKAH 2: SLEEP QUALITY SLIDER (VERTIKAL SLIDER 5 LEVEL)          */}
        {/* ================================================================= */}
        {step === 2 && (
          <div className="w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 border border-[#DCD7CE] shadow-sm text-center space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#E87934] bg-[#E87934]/15 px-3 py-1 rounded-full uppercase tracking-wider">
                2 OF 3 • SLEEP
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#2C1D11] tracking-tight mt-3">
                How would you rate your sleep quality?
              </h1>
              <p className="text-xs text-[#786A5E] mt-1">
                Pilih durasi dan kenyamanan istirahat tidurmu semalam.
              </p>
            </div>

            {/* Vertical Pill List with Draggable Track Effect */}
            <div className="space-y-3 max-w-sm mx-auto text-left">
              {SLEEP_LEVELS.map((s) => {
                const isSelected = selectedSleepId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSleepId(s.id)}
                    className={cn(
                      "w-full p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between",
                      "hover:border-[#1A7F8E] active:scale-98",
                      isSelected
                        ? "bg-[#FAF6EE] border-[#1A7F8E] shadow-sm ring-2 ring-[#1A7F8E]/20"
                        : "bg-white border-[#DCD7CE]/80 hover:bg-[#FAF6EE]/40"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-2xs"
                        style={{ backgroundColor: `${s.color}20`, color: s.color }}
                      >
                        {s.emoji}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-[#2C1D11]">
                          {s.label}
                        </p>
                        <p className="text-[10px] font-semibold text-[#786A5E]">
                          {s.hours}
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                        isSelected
                          ? "border-[#1A7F8E] bg-[#1A7F8E] text-white"
                          : "border-[#DCD7CE]"
                      )}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* LANGKAH 3: EXPRESSION ANALYSIS (TEXTAREA BEBAS + VOICE BUTTON)     */}
        {/* ================================================================= */}
        {step === 3 && !isSubmitted && (
          <div className="w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 border border-[#DCD7CE] shadow-sm text-center space-y-5 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#9D8DF1] bg-[#9D8DF1]/15 px-3 py-1 rounded-full uppercase tracking-wider">
                3 OF 3 • EXPRESSION
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#2C1D11] tracking-tight mt-3">
                Expression Analysis
              </h1>
              <p className="text-xs text-[#786A5E] mt-1 max-w-xs mx-auto">
                Tuliskan apa pun yang sedang memenuhi pikiranmu. HavenCare AI siap mendengarkan tanpa menghakimi.
              </p>
            </div>

            {/* Textarea Input Bebas */}
            <div className="space-y-2 text-left">
              <div className="relative">
                <textarea
                  rows={4}
                  maxLength={250}
                  value={expressionText}
                  onChange={(e) => setExpressionText(e.target.value)}
                  placeholder="Ceritakan apa yang sedang kamu rasakan hari ini..."
                  className="w-full p-4 rounded-[22px] bg-[#FAF6EE] border border-[#DCD7CE] text-xs sm:text-sm text-[#2C1D11] placeholder:text-[#786A5E]/60 focus:outline-none focus:border-[#1A7F8E] focus:ring-2 focus:ring-[#1A7F8E]/20 transition-all font-sans resize-none"
                />
                <span className="absolute bottom-3 right-3 text-[11px] font-semibold text-[#786A5E]">
                  {expressionText.length} / 250
                </span>
              </div>

              {/* Tombol Gunakan Suara (Voice Input) */}
              <button
                type="button"
                onClick={() => {
                  setIsVoiceActive(!isVoiceActive);
                  if (!isVoiceActive && !expressionText) {
                    setExpressionText("Aku merasa sedikit cemas dengan tumpukan pekerjaanku, tetapi aku berusaha bernapas teratur.");
                  }
                }}
                className={cn(
                  "w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2",
                  isVoiceActive
                    ? "bg-[#8DA85E]/15 border-[#8DA85E] text-[#5F7836]"
                    : "bg-[#FAF6EE] border-[#DCD7CE] text-[#786A5E] hover:border-[#1A7F8E]"
                )}
              >
                <Mic size={14} className={isVoiceActive ? "animate-pulse text-[#8DA85E]" : ""} />
                <span>{isVoiceActive ? "Mode Suara Aktif (Dengar...)" : "Gunakan Suara (Voice Reflection)"}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* HASIL KONSULTASI & REFLEKSI (SETELAH SUBMIT LANGKAH 3)             */}
        {/* ================================================================= */}
        {step === 3 && isSubmitted && (
          <div className="w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 border border-[#8DA85E]/40 shadow-sm text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[#8DA85E]/15 text-[#8DA85E] flex items-center justify-center mx-auto text-2xl shadow-xs">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <span className="text-xs font-bold text-[#8DA85E] bg-[#8DA85E]/15 px-3 py-1 rounded-full uppercase tracking-wider">
                Refleksi Selesai
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#2C1D11] tracking-tight mt-2">
                Terima kasih telah check-in hari ini
              </h2>
              <p className="text-xs text-[#786A5E] mt-1 max-w-sm mx-auto">
                Mengenali perasaan adalah langkah penting dalam menjaga kesehatan mentalmu.
              </p>
            </div>

            {/* Ringkasan Parameter */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#DCD7CE]/60">
                <span className="text-[10px] font-bold text-[#786A5E] uppercase">Suasana Hati</span>
                <p className="text-xs font-extrabold text-[#2C1D11] mt-0.5 flex items-center gap-1.5">
                  <span>{currentMood.emoji}</span>
                  <span>{currentMood.label}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#DCD7CE]/60">
                <span className="text-[10px] font-bold text-[#786A5E] uppercase">Kualitas Tidur</span>
                <p className="text-xs font-extrabold text-[#2C1D11] mt-0.5 flex items-center gap-1.5">
                  <span>{currentSleep.emoji}</span>
                  <span>{currentSleep.label} ({currentSleep.hours})</span>
                </p>
              </div>
            </div>

            {/* Catatan Privasi & Non-Diagnosis */}
            <p className="text-[11px] text-[#786A5E] bg-[#FAF6EE] p-3 rounded-xl border border-[#DCD7CE]/60 leading-relaxed">
              Catatan: Hasil wellness check-in ini adalah refleksi kesadaran mandiri, bukan diagnosis klinis atau pengganti psikiater resmi.
            </p>

            {/* Tombol Aksi Lanjut */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => void handleDiscussWithAI()}
                className="w-full py-3.5 rounded-full bg-[#1A7F8E] text-white hover:bg-[#146875] text-xs font-extrabold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageSquare size={15} />
                <span>Diskusikan dengan HavenCare AI</span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 rounded-full border border-[#DCD7CE] text-xs font-bold text-[#2C1D11] hover:bg-[#FAF6EE] transition-all"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. FOOTER TOMBOL KENDALI (SEBELUMNYA / LANJUTKAN)                         */}
      {/* ========================================================================= */}
      {!isSubmitted && (
        <div className="flex items-center justify-between pt-4 border-t border-[#DCD7CE]/60">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={step === 1}
            className={cn(
              "px-5 py-2.5 rounded-full border border-[#DCD7CE] text-xs font-bold transition-all",
              step === 1
                ? "opacity-30 cursor-not-allowed bg-transparent text-[#786A5E]"
                : "bg-white text-[#2C1D11] hover:bg-[#FAF6EE]"
            )}
          >
            ← Sebelumnya
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-full bg-[#2C1D11] text-white hover:bg-[#3D2A1C] text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <span>Lanjutkan</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-[#1A7F8E] text-white hover:bg-[#146875] text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <span>{isSubmitting ? "Menyimpan..." : "Selesaikan Asesmen →"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
