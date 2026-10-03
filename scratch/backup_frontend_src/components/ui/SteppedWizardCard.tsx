"use client";

import React, { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FreudButton } from "./FreudButton";

export interface WizardOption {
  label: string;
  score: number;
  description?: string;
}

export interface SteppedWizardCardProps {
  /** Nomor langkah saat ini (1-indexed) */
  currentStep: number;
  /** Total seluruh pertanyaan / langkah */
  totalSteps: number;
  /** Judul kategori asesmen (contoh: "PHQ-9 Skrining Depresi" atau "GAD-7 Kecemasan") */
  categoryTitle?: string;
  /** Teks pertanyaan */
  question: string;
  /** Daftar opsi jawaban */
  options: WizardOption[];
  /** Indeks opsi yang sedang terpilih */
  selectedScore?: number | null;
  /** Callback saat opsi dipilih */
  onSelectOption: (score: number, optionIndex: number) => void;
  /** Callback saat tombol 'Sebelumnya' ditekan */
  onPrev?: () => void;
  /** Callback saat tombol 'Selanjutnya' ditekan */
  onNext?: () => void;
  /** Status apakah tombol 'Selanjutnya' aktif */
  canProceed?: boolean;
  /** Kelas CSS container tambahan */
  className?: string;
}

/**
 * SteppedWizardCard — Kartu Asesmen Bertahap Freud Web UI (Dribbble 23734329)
 * Dilengkapi dengan bar progress kapsul horizontal tersegmentasi,
 * pilihan kartu jawaban bersensasi taktil elastis (scale-[1.01] & latar peach),
 * dan navigasi langkah ramah sentuhan jempol.
 */
export const SteppedWizardCard: React.FC<SteppedWizardCardProps> = ({
  currentStep,
  totalSteps,
  categoryTitle = "Asesmen Klinis Mandiri",
  question,
  options,
  selectedScore = null,
  onSelectOption,
  onPrev,
  onNext,
  canProceed = false,
  className,
}) => {
  const [internalSelected, setInternalSelected] = useState<number | null>(
    selectedScore
  );

  const activeScore = selectedScore !== null ? selectedScore : internalSelected;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((currentStep / totalSteps) * 100))
  );

  const handleSelect = (score: number, idx: number) => {
    setInternalSelected(score);
    onSelectOption(score, idx);
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl sm:rounded-[28px] p-5 sm:p-7",
        "border border-sand/70 shadow-sm max-w-xl mx-auto w-full",
        "transition-all duration-200",
        className
      )}
    >
      {/* Header Langkah & Kategori */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold tracking-wide uppercase text-warm-muted">
          {categoryTitle}
        </span>
        <div className="flex items-center gap-1.5 text-xs font-bold text-espresso">
          <span>
            {currentStep}/{totalSteps}
          </span>
          <span className="text-sage font-mono">({progressPercent}%)</span>
        </div>
      </div>

      {/* Segmen Progress Bar Kapsul Horizontal */}
      <div className="flex items-center gap-1.5 w-full mb-6" aria-hidden="true">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepIndex = i + 1;
          const isDone = stepIndex < currentStep;
          const isCurrent = stepIndex === currentStep;

          return (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full flex-1 transition-all duration-300",
                isDone
                  ? "bg-sage"
                  : isCurrent
                  ? "bg-orange ring-2 ring-orange/30"
                  : "bg-sand/40"
              )}
            />
          );
        })}
      </div>

      {/* Teks Pertanyaan Utama */}
      <h3 className="text-base sm:text-lg font-bold text-espresso leading-snug mb-5">
        {question}
      </h3>

      {/* Daftar Kartu Opsi Pilihan */}
      <div className="space-y-2.5 mb-6" role="radiogroup">
        {options.map((opt, idx) => {
          const isSelected = activeScore === opt.score;

          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(opt.score, idx)}
              className={cn(
                "w-full text-left px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl border text-sm font-medium",
                "flex items-center justify-between gap-3 select-none",
                "transition-all duration-150 ease-out active:scale-[0.99]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/40",
                isSelected
                  ? "border-orange bg-peach text-espresso scale-[1.01] shadow-sm font-semibold"
                  : "border-sand bg-white text-espresso/80 hover:border-espresso/30 hover:bg-cream/50"
              )}
            >
              <div className="flex flex-col">
                <span>{opt.label}</span>
                {opt.description && (
                  <span className="text-xs text-warm-muted font-normal mt-0.5">
                    {opt.description}
                  </span>
                )}
              </div>

              {/* Indikator Checkmark Bulat Kapsul */}
              <span
                className={cn(
                  "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                  isSelected
                    ? "border-orange bg-orange text-white"
                    : "border-sand bg-white"
                )}
              >
                {isSelected && <Check size={12} strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tombol Navigasi Bawah */}
      <div className="flex items-center justify-between pt-2 border-t border-sand/40">
        {onPrev ? (
          <FreudButton
            variant="creamGhost"
            size="sm"
            onClick={onPrev}
            disabled={currentStep <= 1}
            leftIcon={<ChevronLeft size={16} />}
          >
            Kembali
          </FreudButton>
        ) : (
          <div />
        )}

        {onNext && (
          <FreudButton
            variant={canProceed || activeScore !== null ? "espresso" : "creamGhost"}
            size="sm"
            onClick={onNext}
            disabled={!canProceed && activeScore === null}
            rightIcon={<ChevronRight size={16} />}
          >
            {currentStep === totalSteps ? "Selesai" : "Lanjut"}
          </FreudButton>
        )}
      </div>
    </div>
  );
};

export default SteppedWizardCard;
