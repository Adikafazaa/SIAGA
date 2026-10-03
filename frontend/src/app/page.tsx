"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, HeartPulse, LockKeyhole, MessageCircleHeart, Sparkles, UsersRound } from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import { useCrisis } from "@/components/crisis/CrisisProvider";
import { ROLE_HOME } from "@/lib/constants";
import { BrandMark } from "@/components/brand/BrandMark";

const MOODS = [
  { name: "Cemas", icon: "🌧️", message: "Tak apa merasa cemas. Mari urai satu hal kecil yang sedang mengganggumu." },
  { name: "Lelah", icon: "🔋", message: "Kamu boleh beristirahat. Kita mulai perlahan, sesuai ritmemu." },
  { name: "Sedih", icon: "💧", message: "Perasaanmu valid. Ada ruang untuk menceritakannya di sini." },
  { name: "Tenang", icon: "🌿", message: "Senang mendengar kamu merasa tenang. Mari jaga momen ini." },
  { name: "Semangat", icon: "✨", message: "Energi yang baik! Kamu bisa mencatat apa yang membuat hari ini berarti." },
];

export default function LandingPage() {
  const [mood, setMood] = useState<string | null>(null);
  const [info, setInfo] = useState<"cara" | "privasi" | "akses" | null>(null);
  const { user, loading } = useAuth();
  const { openCrisis } = useCrisis();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    router.replace(!user.role || !user.onboardingCompleted ? "/onboarding" : ROLE_HOME[user.role] ?? "/dashboard");
  }, [user, loading, router]);

  const selected = MOODS.find((item) => item.name === mood);
  const chatHref = user ? "/chat" : "/register";

  return <div className="hc-canvas min-h-dvh">
    <header className="sticky top-0 z-20 border-b border-[#1a7f8e]/10 bg-white/65 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 lg:px-14">
        <Link href="/" className="hc-brand"><BrandMark />HavenCare</Link>
        <nav className="hidden items-center gap-2 md:flex" aria-label="Navigasi utama"><button onClick={() => setInfo("cara")} className="rounded-full px-4 py-2 text-sm font-bold text-[#5d7077] hover:bg-white">Cara kerja</button><button onClick={() => setInfo("privasi")} className="rounded-full px-4 py-2 text-sm font-bold text-[#5d7077] hover:bg-white">Keamanan & privasi</button><button onClick={() => setInfo("akses")} className="rounded-full px-4 py-2 text-sm font-bold text-[#5d7077] hover:bg-white">Aksesibilitas</button></nav>
        <div className="flex items-center gap-2"><Link href="/login" className="hc-btn hc-btn-ghost !min-h-10 !px-4 text-sm">Masuk</Link><Link href={chatHref} className="hc-btn hc-btn-primary hidden !min-h-10 !px-5 text-sm sm:inline-flex">Mulai chat <ArrowRight size={16} /></Link></div>
      </div>
    </header>

    <main className="mx-auto max-w-[1440px] px-5 lg:px-14">
      <div className="grid items-center gap-10 pb-9 pt-12 lg:grid-cols-[1.12fr_.88fr] lg:gap-14 lg:pt-20">
        <div><span className="inline-flex items-center gap-2 rounded-full border border-[#1a7f8e]/15 bg-[#1a7f8e]/10 px-4 py-2 text-sm font-extrabold text-[#0b5963]"><Sparkles size={16} /> Ruang Refleksi & Pendampingan Psikologis</span>
          <h1 className="mt-6 text-[clamp(2.8rem,5vw,5.3rem)] font-extrabold leading-[1.08] tracking-[-.045em]">A Journey to<br /><span className="bg-gradient-to-r from-[#1a7f8e] to-[#0b5963] bg-clip-text text-transparent">Mental Wellness</span></h1>
          <p className="hc-muted mt-5 max-w-2xl text-lg leading-relaxed">Ruang refleksi dan pendampingan kesehatan mental yang tenang, aman, dan manusiawi. Hadir untuk membantumu memahami perasaan, satu langkah kecil setiap hari.</p>
          <section className="hc-glass-strong hc-card mt-8 max-w-2xl p-5 sm:p-6" aria-label="Pilih suasana hati"><div className="mb-4 flex flex-wrap items-center justify-between gap-1"><h2 className="font-extrabold">Bagaimana perasaanmu saat ini?</h2><span className="text-xs font-bold text-[#1a7f8e]">Pilih satu yang paling dekat</span></div>
            <div className="flex flex-wrap gap-2">{MOODS.map((item) => <button key={item.name} type="button" aria-pressed={mood === item.name} onClick={() => setMood(item.name)} className="hc-chip flex-1 text-sm"><span aria-hidden>{item.icon}</span>{item.name}</button>)}</div>
            <p className="mt-4 rounded-xl border-l-[3px] border-[#1a7f8e] bg-[#1a7f8e]/[.07] px-4 py-3 text-sm text-[#334b52]" aria-live="polite">{selected ? `${selected.icon} ${selected.message}` : "💬 Pilih suasana hati untuk memulai refleksi, atau langsung bicara dengan HavenCare AI."}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row"><Link href={chatHref} className="hc-btn hc-btn-primary flex-1 text-sm">Mulai bicara dengan HavenCare AI <ArrowRight size={17} /></Link><Link href={user ? "/assessments" : "/register"} className="hc-btn hc-btn-ghost text-sm">Skrining mandiri</Link></div>
          </section>
          <div className="hc-muted mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold"><span>🔒 Privasi terkelola</span><span>🩺 Pendamping nonklinis</span><span>⚡ Bantuan awal psikologis</span></div>
        </div>
        <div className="relative min-h-[440px]"><div className="hc-glass-strong relative flex h-full min-h-[440px] flex-col justify-between overflow-hidden rounded-[32px] p-6 sm:p-8" style={{background:"radial-gradient(circle at 72% 27%, rgba(243,201,105,.35), transparent 35%), linear-gradient(#d9f2f5,#eef9fa 75%)"}}>
          <div className="absolute inset-x-0 bottom-0 h-48 rounded-[45%_55%_0_0] bg-[#7ea172]/20"/><div className="absolute inset-x-[-10%] bottom-[-30px] h-36 rounded-[50%_50%_0_0] bg-[#1a7f8e]/20"/>
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-2"><span className="hc-glass rounded-full px-4 py-2 text-xs font-extrabold">🟢 HavenCare AI • Siap mendampingi</span><span className="hc-glass rounded-full px-3 py-2 text-xs font-bold text-[#1a7f8e]">🛡️ Ruang refleksi aman</span></div>
          <div className="relative z-10 text-center"><div className="mx-auto grid h-44 w-44 place-items-center rounded-[48px] bg-gradient-to-br from-[#48b4be] to-[#0b5963] shadow-[0_24px_45px_rgba(26,127,142,.28)]"><div className="relative h-28 w-32 rounded-[32px] border-[7px] border-white/75 bg-[#d9f8f7] shadow-inner"><div className="absolute inset-x-4 top-7 flex justify-between"><span className="h-4 w-4 rounded-full bg-[#0b5963]"/><span className="h-4 w-4 rounded-full bg-[#0b5963]"/></div><div className="absolute bottom-5 left-1/2 h-4 w-10 -translate-x-1/2 rounded-b-full border-b-4 border-[#0b5963]"/></div></div><h2 className="mt-5 text-xl font-extrabold">HavenCare AI</h2><p className="hc-muted text-sm">Teman refleksi & pertolongan pertama psikologis</p></div>
          <div className="hc-glass-strong relative z-10 flex items-center gap-3 rounded-2xl p-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eaf7f8] text-xl">🧘</span><div><p className="text-sm font-extrabold">Refleksi harian terpandu</p><p className="hc-muted text-xs">Ruang aman untuk mengurai perasaan secara bertahap</p></div></div>
        </div></div>
      </div>
      <section className="grid gap-4 pb-12 md:grid-cols-3">{[{icon:LockKeyhole,title:"Kerahasiaan penuh",text:"Kendalikan percakapan dan refleksi emosimu melalui akunmu."},{icon:HeartPulse,title:"Akses yang nyaman",text:"Tipografi jelas, navigasi sederhana, dan tombol yang mudah disentuh."},{icon:UsersRound,title:"Dukungan sebaya",text:"Temukan ruang komunitas untuk berbagi cerita dan saling menguatkan."}].map(({icon:Icon,title,text})=><div className="hc-glass hc-card flex gap-4 p-5" key={title}><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#1a7f8e]/10 text-[#1a7f8e]"><Icon size={22}/></span><div><h3 className="font-extrabold">{title}</h3><p className="hc-muted mt-1 text-sm leading-relaxed">{text}</p></div></div>)}</section>
    </main>
    <footer className="border-t border-[#1a7f8e]/10 bg-white/60 px-5 py-5 text-center text-xs text-[#5d7077] lg:px-14"><div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3"><span>HavenCare AI adalah teman refleksi, bukan pengganti dokter atau diagnosis klinis.</span><button onClick={openCrisis} className="font-extrabold text-[#c85f64] hover:underline">Butuh bantuan segera? Buka pusat bantuan</button></div></footer>
    {info && <div className="fixed inset-0 z-50 grid place-items-center bg-[#0d191f]/50 p-4" role="dialog" aria-modal="true"><div className="hc-glass-strong max-w-xl rounded-3xl p-7"><div className="flex items-center gap-3"><MessageCircleHeart className="text-[#1a7f8e]"/><h2 className="text-xl font-extrabold">{info === "cara" ? "Cara kerja HavenCare" : info === "privasi" ? "Keamanan & privasi" : "Aksesibilitas"}</h2></div><p className="hc-muted mt-4 leading-relaxed">{info === "cara" ? "Mulai dari check-in perasaan, lanjutkan percakapan reflektif, lalu gunakan asesmen atau layanan profesional jika diperlukan." : info === "privasi" ? "Akses percakapan melalui akunmu. Proyek ini mengikuti mode API yang tersedia pada aplikasi acuan; periksa pengaturan layanan sebelum memasukkan informasi sensitif." : "HavenCare memakai teks kontras, tombol besar, navigasi keyboard, dan dukungan pengurangan animasi."}</p><button onClick={()=>setInfo(null)} className="hc-btn hc-btn-primary mt-6">Mengerti</button></div></div>}
  </div>;
}
