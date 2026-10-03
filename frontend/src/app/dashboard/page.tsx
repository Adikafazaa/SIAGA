"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, ClipboardList, HeartPulse, MessageCircle, Sparkles, UsersRound } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Guard } from "@/features/auth/role-guard";
import { useAuth } from "@/features/auth/auth-provider";
import { useCrisis } from "@/components/crisis/CrisisProvider";

const MOODS = [{ icon: "😊", name: "Senang" }, { icon: "😌", name: "Tenang" }, { icon: "😐", name: "Biasa" }, { icon: "😟", name: "Cemas" }, { icon: "😢", name: "Sedih" }];

export default function DashboardPage() {
  return <Guard roles={["patient"]}><AppShell><DashboardContent /></AppShell></Guard>;
}

function DashboardContent() {
  const { user } = useAuth();
  const { openCrisis } = useCrisis();
  const [mood, setMood] = useState<string | null>(null);
  const moodKey = `havencare-mood:${user?.uid ?? "guest"}`;
  useEffect(() => { try { setMood(localStorage.getItem(moodKey)); } catch {} }, [moodKey]);
  const saveMood = (value: string) => { setMood(value); try { localStorage.setItem(moodKey, value); } catch {} };
  const firstName = user?.displayName?.split(" ")[0] || "Sahabat";
  return <div className="space-y-6">
    <section className="flex flex-wrap items-end justify-between gap-4"><div><span className="hc-label">Wellness hub</span><h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Halo {firstName}, mari luangkan sejenak untuk dirimu 🌿</h1><p className="hc-muted mt-2">Setiap langkah kecil untuk memahami perasaanmu berarti.</p></div><span className="hc-glass rounded-full px-4 py-2 text-sm font-bold text-[#0b5963]">✨ Hari ini adalah awal yang baik</span></section>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(270px,.8fr)]">
      <div className="space-y-5">
        <section className="hc-glass-strong hc-card overflow-hidden p-6 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="hc-label">Status kesejahteraan</p><h2 className="hc-section-title mt-2">Mulai dengan mendengarkan diri</h2><p className="hc-muted mt-2 max-w-xl text-sm leading-relaxed">Check-in singkat membantumu melihat bagaimana perasaanmu hari ini. Tidak ada jawaban yang salah.</p></div><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#1a7f8e]/10 text-[#1a7f8e]"><HeartPulse size={27}/></div></div><div className="mt-7 flex flex-wrap gap-3"><Link href="/assessments" className="hc-btn hc-btn-primary">Mulai self check-in <ArrowRight size={17}/></Link><Link href="/chat" className="hc-btn hc-btn-ghost">Bicara dengan AI</Link></div><div className="mt-7 flex items-center gap-3 rounded-2xl bg-[#eaf7f8]/80 p-4"><span className="text-2xl">🌿</span><p className="text-sm font-semibold text-[#49636a]">Pelan-pelan pun tetap maju. Kamu boleh mulai dari satu kata tentang hari ini.</p></div></section>
        <section className="hc-glass hc-card p-6"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="hc-label">Refleksi harian</p><h2 className="mt-1 text-xl font-extrabold">Check-in suasana hati</h2></div><span className="text-xs font-bold text-[#1a7f8e]">{mood ? `Terpilih: ${mood}` : "Bagaimana kabarmu?"}</span></div><div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">{MOODS.map(item=><button key={item.name} onClick={()=>saveMood(item.name)} aria-pressed={mood===item.name} className="hc-chip !flex-col !rounded-2xl py-3"><span className="text-2xl" aria-hidden>{item.icon}</span><span className="text-xs">{item.name}</span></button>)}</div><p className="hc-muted mt-4 text-xs" aria-live="polite">{mood ? `Terima kasih sudah berbagi. Perasaan ${mood.toLowerCase()} telah dicatat di perangkat ini.` : "Pilihanmu tersimpan di perangkat ini agar mudah kamu lihat kembali."}</p></section>
        <div className="grid gap-5 md:grid-cols-2"><Link href="/chat" className="hc-glass hc-card group p-6 transition-transform hover:-translate-y-1"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1a7f8e]/10 text-[#1a7f8e]"><MessageCircle size={23}/></span><h2 className="mt-4 text-xl font-extrabold">HavenCare AI</h2><p className="hc-muted mt-2 text-sm">Ruang ngobrol untuk mengurai pikiran tanpa perlu terburu-buru.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#1a7f8e]">Mulai refleksi <ArrowRight size={16}/></span></Link><Link href="/community" className="hc-glass hc-card group p-6 transition-transform hover:-translate-y-1"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7ea172]/20 text-[#4f8a65]"><UsersRound size={23}/></span><h2 className="mt-4 text-xl font-extrabold">Komunitas berbagi</h2><p className="hc-muted mt-2 text-sm">Temukan dukungan sebaya lewat percakapan yang hangat.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#1a7f8e]">Jelajahi komunitas <ArrowRight size={16}/></span></Link></div>
      </div>
      <div className="space-y-5"><section className="hc-glass hc-card p-6"><div className="flex items-center gap-3"><CalendarDays className="text-[#1a7f8e]"/><h2 className="text-lg font-extrabold">Langkah selanjutnya</h2></div><div className="mt-5 space-y-3"><Link href="/assessments" className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 hover:bg-white"><ClipboardList size={20} className="mt-0.5 text-[#1a7f8e]"/><span><strong className="block text-sm">Skrining mandiri</strong><small className="hc-muted">Kenali pola suasana hati dan tidur</small></span></Link><Link href="/chat" className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 hover:bg-white"><Sparkles size={20} className="mt-0.5 text-[#1a7f8e]"/><span><strong className="block text-sm">Refleksi terpandu</strong><small className="hc-muted">Ceritakan yang sedang kamu alami</small></span></Link></div><p className="hc-muted mt-4 text-xs">Jadwal pendampingan profesional tersedia sesuai layanan yang terhubung dengan akunmu.</p></section><section className="rounded-[24px] border border-[#e06d6d]/30 bg-[#fff8f8] p-6"><div className="flex items-center gap-3 text-[#c9575d]"><HeartPulse size={25}/><h2 className="text-lg font-extrabold">Pusat bantuan krisis</h2></div><p className="mt-3 text-sm leading-relaxed text-[#6f6264]">Jika kamu merasa tidak aman atau membutuhkan bantuan segera, lihat kontak layanan darurat.</p><button onClick={openCrisis} className="hc-btn hc-btn-danger mt-5 w-full text-sm">Buka bantuan segera <ArrowRight size={16}/></button></section></div>
    </div>
  </div>;
}
