"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  History,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FreudButton } from "@/components/ui/FreudButton";
import { FreudScoreChart } from "@/components/charts/FreudScoreChart";
import { Guard } from "@/features/auth/role-guard";
import { useAuth } from "@/features/auth/auth-provider";
import { listAssessments, saveAssessment } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function AssessmentsPage() {
  return (
    <Guard roles={["patient"]}>
      <AppShell>
        <FreudAssessmentFlow />
      </AppShell>
    </Guard>
  );
}

/**
 * FreudAssessmentFlow — Formulir Asesmen Klinis Freud Web UI (100% Identik Foto 1)
 *
 * Mengikuti Foto 1 Target Asli:
 * - Judul Tengah: "Mental Health Assessment" (Urbanist Tebal #2C1D11)
 * - Card 01: Rating skala 1 s.d. 10 (angka 5 aktif hijau Sage #8DA85E)
 * - Card 02: Perubahan mood (Yes / No)
 * - Card 03: Rasa cemas berlebih (Yes / No)
 * - Card 04: Nyeri fisik berulang (Yes / No)
 * - Tombol Submit Rata Kanan Bawah: Kapsul putih dengan lingkaran Terracotta Orange panah "→"
 */
function FreudAssessmentFlow() {
  const router = useRouter();
  const { user } = useAuth();

  // State Pilihan Jawaban Asesmen (Default sesuai Foto 1)
  const [rating, setRating] = useState<number>(5);
  const [moodChanges, setMoodChanges] = useState<"Yes" | "No">("No");
  const [excessiveWorry, setExcessiveWorry] = useState<"Yes" | "No">("Yes");
  const [physicalPain, setPhysicalPain] = useState<"Yes" | "No">("No");

  // State Alur Submisi & Tampilan
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [finalScore, setFinalScore] = useState(88.2);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Perhitungan skor berbasis jawaban
    // Rating 1-10: 10 = kondisi terbaik (skor 40), 1 = berat (skor 4)
    const baseScore = rating * 4;
    const moodPenalty = moodChanges === "Yes" ? 6 : 0;
    const worryPenalty = excessiveWorry === "Yes" ? 8 : 0;
    const painPenalty = physicalPain === "Yes" ? 4 : 0;

    const rawScore = Math.max(10, 100 - (100 - baseScore * 2.5) - moodPenalty - worryPenalty - painPenalty);
    const normalizedScore = Number(rawScore.toFixed(1));
    setFinalScore(normalizedScore);

    // Simpan data asesmen ke backend jika user terautentikasi
    if (user?.uid) {
      try {
        await saveAssessment(
          user.uid,
          "PHQ-9",
          {
            1: rating,
            2: moodChanges === "Yes" ? 1 : 0,
            3: excessiveWorry === "Yes" ? 1 : 0,
            4: physicalPain === "Yes" ? 1 : 0,
          },
          Math.round(normalizedScore / 10),
          normalizedScore >= 80 ? "Minimal" : normalizedScore >= 60 ? "Ringan" : "Sedang"
        );
      } catch (err) {
        console.error("Gagal menyimpan asesmen:", err);
      }
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-14 px-4 sm:px-6 select-none">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Tombol Tab Navigasi Antara Formulir & Riwayat */}
        <div className="flex items-center justify-between pb-2 border-b border-sand/40">
          <button
            type="button"
            onClick={() => {
              setShowHistory(false);
              setIsSubmitted(false);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-warm-muted hover:text-espresso transition-colors"
          >
            <ArrowLeft size={14} /> Kembali ke Formulir
          </button>

          <button
            type="button"
            onClick={() => setShowHistory((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-sand/70 text-espresso hover:bg-oatmeal transition-colors shadow-2xs"
          >
            <History size={13} className="text-orange" />
            {showHistory ? "Tutup Riwayat" : "Lihat Riwayat Asesmen"}
          </button>
        </div>

        {/* TAMPILAN 1: RIWAYAT ASESMEN SEBELUMNYA */}
        {showHistory ? (
          <AssessmentHistoryList onBack={() => setShowHistory(false)} />
        ) : isSubmitted ? (
          /* TAMPILAN 2: HASIL SKOR FREUD KELUAR SETELAH SUBMIT */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-sage px-3 py-1 rounded-full bg-sage/15 border border-sage/30">
                Asesmen Selesai
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-espresso tracking-tight">
                Hasil Evaluasi Kesejahteraan Mental
              </h2>
              <p className="text-xs text-warm-muted max-w-md mx-auto">
                Indeks kesehatan mental Anda dihitung berdasarkan skala psikometrik standar Freud AI.
              </p>
            </div>

            {/* Visualisasi Kurva Recharts Freud Score Chart */}
            <FreudScoreChart
              height={240}
              timeframe="Hasil Terkini"
              data={[
                { day: "Baseline", score: 72 },
                { day: "Pekan 1", score: 76 },
                { day: "Pekan 2", score: 81 },
                { day: "Pekan 3", score: 84 },
                { day: "Hari Ini", score: finalScore },
              ]}
            />

            {/* Kartu Rekomendasi Klinis */}
            <div className="bg-white rounded-2xl p-6 border border-sand/70 shadow-sm space-y-3 text-left">
              <div className="flex items-center gap-2 text-sage font-bold text-sm">
                <CheckCircle2 size={18} />
                <span>Kondisi Emosional: Stabil (Skor {finalScore}/100)</span>
              </div>
              <p className="text-xs text-warm-muted leading-relaxed">
                Tingkat ketahanan mental Anda berada dalam kategori sehat dan adaptif. Gejala kecemasan atau fluktuasi suasana hati berada dalam rentang normal yang dapat dikelola dengan refleksi mandiri.
              </p>
            </div>

            {/* Tombol Tindak Lanjut */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <FreudButton
                variant="espresso"
                size="md"
                onClick={() => router.push("/chat")}
                rightIcon={<ArrowRight size={16} />}
              >
                Lanjut Konsultasi di Chat
              </FreudButton>
              <FreudButton
                variant="creamGhost"
                size="md"
                onClick={handleReset}
                leftIcon={<RotateCcw size={15} />}
              >
                Ulangi Asesmen
              </FreudButton>
            </div>
          </div>
        ) : (
          /* TAMPILAN 3: FORMULIR ASESMEN ASLI FREUD (100% Sesuai Foto 1) */
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* JUDUL UTAMA (Center, Font Urbanist Tebal #2C1D11) */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-espresso font-sans">
                Mental Health <br />
                Assessment
              </h1>
            </div>

            {/* ======================================================= */}
            {/* CARD 01: Rating Skala 1 - 10                            */}
            {/* ======================================================= */}
            <div className="bg-white rounded-2xl sm:rounded-[24px] p-6 shadow-sm border border-sand/70 space-y-5">
              {/* Header Kartu: Lingkaran Nomor 01 + Pertanyaan */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#2C1D11] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  01
                </div>
                <p className="text-xs sm:text-sm font-bold text-espresso pt-2 leading-snug">
                  How would you rate your current mental health on a scale of 1-10?
                </p>
              </div>

              {/* Baris Deretan Tombol Skala Angka 1 s.d. 10 */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isSelected = rating === num;

                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={cn(
                        "h-11 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150",
                        "flex items-center justify-center active:scale-95",
                        isSelected
                          ? "bg-sage text-white shadow-sm ring-2 ring-sage/30 scale-105"
                          : "bg-[#FAF6EE] text-espresso/80 hover:bg-[#EFECE6] border border-sand/40"
                      )}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ======================================================= */}
            {/* CARD 02: Pilihan Yes / No (Perubahan Suasana Hati)        */}
            {/* ======================================================= */}
            <div className="bg-white rounded-2xl sm:rounded-[24px] p-6 shadow-sm border border-sand/70 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#2C1D11] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  02
                </div>
                <p className="text-xs sm:text-sm font-bold text-espresso pt-2 leading-snug">
                  Have you noticed any changes in your mood or emotions recently?
                </p>
              </div>

              {/* Dua Tombol Pil Lebar Yes / No */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {(["Yes", "No"] as const).map((opt) => {
                  const isSelected = moodChanges === opt;

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setMoodChanges(opt)}
                      className={cn(
                        "py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-150",
                        "text-center active:scale-98",
                        isSelected
                          ? "bg-sage text-white shadow-sm"
                          : "bg-[#FAF6EE] text-espresso/80 hover:bg-[#EFECE6] border border-sand/40"
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ======================================================= */}
            {/* CARD 03: Pilihan Yes / No (Kecemasan Berlebih)           */}
            {/* ======================================================= */}
            <div className="bg-white rounded-2xl sm:rounded-[24px] p-6 shadow-sm border border-sand/70 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#2C1D11] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  03
                </div>
                <p className="text-xs sm:text-sm font-bold text-espresso pt-2 leading-snug">
                  Do you experience excessive worry or anxiety on a regular basis?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {(["Yes", "No"] as const).map((opt) => {
                  const isSelected = excessiveWorry === opt;

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setExcessiveWorry(opt)}
                      className={cn(
                        "py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-150",
                        "text-center active:scale-98",
                        isSelected
                          ? "bg-sage text-white shadow-sm"
                          : "bg-[#FAF6EE] text-espresso/80 hover:bg-[#EFECE6] border border-sand/40"
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ======================================================= */}
            {/* CARD 04: Pilihan Yes / No (Nyeri Fisik Terkait Stres)    */}
            {/* ======================================================= */}
            <div className="bg-white rounded-2xl sm:rounded-[24px] p-6 shadow-sm border border-sand/70 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#2C1D11] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  04
                </div>
                <p className="text-xs sm:text-sm font-bold text-espresso pt-2 leading-snug">
                  Do you experience physical pain on a regular basis?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {(["Yes", "No"] as const).map((opt) => {
                  const isSelected = physicalPain === opt;

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPhysicalPain(opt)}
                      className={cn(
                        "py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-150",
                        "text-center active:scale-98",
                        isSelected
                          ? "bg-sage text-white shadow-sm"
                          : "bg-[#FAF6EE] text-espresso/80 hover:bg-[#EFECE6] border border-sand/40"
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ======================================================= */}
            {/* TOMBOL SUBMIT DI KANAN BAWAH (Kapsul Putih + Bulatan Oranye) */}
            {/* ======================================================= */}
            <div className="flex justify-end pt-3 pb-12">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={cn(
                  "rounded-full bg-white border border-[#DCD7CE] pl-6 pr-2 py-2 shadow-md",
                  "inline-flex items-center gap-3.5 hover:shadow-lg active:scale-95 transition-all",
                  "select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/30"
                )}
              >
                <span className="text-sm font-bold text-espresso">
                  {isSubmitting ? "Menganalisis…" : "Submit Assessment"}
                </span>
                {/* Bulatan Terracotta Orange #E87934 Berisi Panah Putih → */}
                <div className="w-9 h-9 rounded-full bg-orange text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ArrowRight size={17} strokeWidth={2.5} />
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * AssessmentHistoryList — Tabel Riwayat Asesmen Masa Lalu
 */
function AssessmentHistoryList({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const uid = user?.uid ?? "anon";

  const { data, isLoading } = useQuery({
    queryKey: ["assessments", uid],
    queryFn: () => listAssessments(uid),
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-sand/70 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-sand/40 pb-3">
        <h3 className="text-base font-bold text-espresso">
          Riwayat Asesmen Mandiri
        </h3>
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-orange hover:underline"
        >
          Isi Asesmen Baru
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-xs text-warm-muted animate-pulse">
          Memuat data riwayat…
        </div>
      ) : !data || data.length === 0 ? (
        <div className="py-10 text-center text-xs text-warm-muted">
          Belum ada riwayat asesmen tersimpan.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-sand/40 text-[10px] uppercase font-bold text-warm-muted">
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Jenis</th>
                <th className="py-2.5 px-3">Skor</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/30">
              {data.map((a) => (
                <tr key={a.assessmentId} className="hover:bg-cream/40">
                  <td className="py-2.5 px-3 font-mono">{formatDate(a.completedAt)}</td>
                  <td className="py-2.5 px-3 font-semibold">{a.type}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-espresso">
                    {a.totalScore}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sage/20 text-sage">
                      {a.severityLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
