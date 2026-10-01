"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type PlaybackSpeed = "1x" | "1.25x" | "1.5x";

export interface AudioWaveformPlayerProps {
  /** Sumber file audio (opsional: jika kosong, menggunakan simulasi playback interaktif) */
  audioSrc?: string;
  /** Label durasi total (contoh: '02:45') */
  duration?: string;
  /** Keterangan waktu pengiriman / status (contoh: '12:22 PM • Read') */
  timestamp?: string;
  /** Kelas CSS tambahan */
  className?: string;
  /** Callback saat status playback berubah */
  onPlayChange?: (isPlaying: boolean) => void;
}

// Pola tinggi gelombang audio (persentase tinggi 25% - 100%)
const DEFAULT_WAVE_HEIGHTS = [
  35, 65, 40, 85, 55, 95, 45, 75, 90, 60, 100, 70, 45, 80, 50, 90, 65, 40, 85,
  60, 75, 45, 95, 70, 50, 80, 60, 40,
];

/**
 * AudioWaveformPlayer — Widget Pemutar Pesan Suara Kapsul Oranye Freud Web UI
 * Berlatar Terracotta Orange (#E87934) dengan waveform dinamis yang dapat di-scrub langsung,
 * selector kecepatan (1x, 1.25x, 1.5x), dan feedback pegas taktil.
 */
export const AudioWaveformPlayer: React.FC<AudioWaveformPlayerProps> = ({
  audioSrc,
  duration = "02:45",
  timestamp = "12:22 PM • Read",
  className,
  onPlayChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>("1x");
  const [progress, setProgress] = useState(30); // 0 - 100%
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Simulasi progress otomatis bila tidak ada elemen audio eksternal
  useEffect(() => {
    if (audioSrc || !isPlaying) return;

    const speedMultiplier = speed === "1x" ? 1 : speed === "1.25x" ? 1.25 : 1.5;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          onPlayChange?.(false);
          return 0;
        }
        return Math.min(100, prev + 0.8 * speedMultiplier);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, speed, audioSrc, onPlayChange]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    onPlayChange?.(nextState);

    if (audioRef.current) {
      if (nextState) {
        void audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const cycleSpeed = () => {
    const nextSpeed: PlaybackSpeed =
      speed === "1x" ? "1.25x" : speed === "1.25x" ? "1.5x" : "1x";
    setSpeed(nextSpeed);

    if (audioRef.current) {
      audioRef.current.playbackRate =
        nextSpeed === "1x" ? 1 : nextSpeed === "1.25x" ? 1.25 : 1.5;
    }
  };

  const handleScrub = useCallback((clientX: number) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setProgress(Math.round(pos));

    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (pos / 100) * audioRef.current.duration;
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    handleScrub(e.clientX);
  };

  useEffect(() => {
    if (!isScrubbing) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleScrub(e.clientX);
    };

    const handleMouseUp = () => {
      setIsScrubbing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isScrubbing, handleScrub]);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3.5 bg-orange text-white px-4 py-3 sm:px-5 sm:py-3.5",
        "rounded-[24px] rounded-br-[6px] shadow-clay select-none",
        "transition-all duration-200",
        isScrubbing && "ring-2 ring-white/50 shadow-[0_0_20px_rgba(232,121,52,0.6)]",
        className
      )}
    >
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onEnded={() => {
            setIsPlaying(false);
            setProgress(0);
            onPlayChange?.(false);
          }}
          onTimeUpdate={() => {
            if (audioRef.current && audioRef.current.duration) {
              setProgress(
                (audioRef.current.currentTime / audioRef.current.duration) * 100
              );
            }
          }}
        />
      )}

      {/* Tombol Play/Pause Bulat Putih */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Jeda pesan suara" : "Putar pesan suara"}
        className={cn(
          "w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-orange",
          "flex items-center justify-center shrink-0 shadow-clay-pill",
          "transition-all duration-150 ease-out active:scale-90 hover:scale-110",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        )}
      >
        {isPlaying ? (
          <Pause size={17} className="fill-orange" />
        ) : (
          <Play size={17} className="fill-orange ml-0.5" />
        )}
      </button>

      {/* SVG Waveform Batang Scrubbable */}
      <div
        ref={waveformRef}
        onMouseDown={handleMouseDown}
        role="slider"
        aria-label="Progres pemutaran suara"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            setProgress((p) => Math.max(0, p - 5));
          } else if (e.key === "ArrowRight") {
            setProgress((p) => Math.min(100, p + 5));
          }
        }}
        className={cn(
          "flex items-center gap-[3px] h-7 px-1 cursor-pointer touch-none",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded"
        )}
      >
        {DEFAULT_WAVE_HEIGHTS.map((height, idx) => {
          const barPercent = (idx / (DEFAULT_WAVE_HEIGHTS.length - 1)) * 100;
          const isPassed = barPercent <= progress;

          return (
            <span
              key={idx}
              className={cn(
                "w-[3px] sm:w-1 rounded-full transition-all duration-150 origin-bottom",
                "hover:scale-y-125 hover:bg-white cursor-pointer",
                isPassed
                  ? isScrubbing
                    ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]"
                    : "bg-white shadow-[0_0_5px_rgba(255,255,255,0.7)]"
                  : "bg-white/40",
                isPlaying && isPassed && idx % 3 === 0 && "animate-pulse"
              )}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>

      {/* Pil Kecepatan Pemutaran (1x, 1.25x, 1.5x) */}
      <button
        type="button"
        onClick={cycleSpeed}
        aria-label={`Kecepatan putar saat ini ${speed}, klik untuk ganti`}
        className={cn(
          "bg-white/20 hover:bg-white/30 active:scale-95 text-[11px] font-bold",
          "px-2.5 py-1 rounded-full transition-all shrink-0 select-none",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/80"
        )}
      >
        {speed}
      </button>

      {/* Indikator Durasi & Timestamp Pengiriman */}
      <div className="text-right leading-tight shrink-0 pl-0.5">
        <div className="font-bold text-xs tabular-nums text-white">
          {duration}
        </div>
        {timestamp && (
          <div className="text-[10px] text-white/80 whitespace-nowrap">
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioWaveformPlayer;
