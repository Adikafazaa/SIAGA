"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Moon, Sparkles } from "lucide-react";
import { useCrisis } from "@/components/crisis/CrisisProvider";
import { useAuth } from "@/features/auth/auth-provider";

type Checkin = { mood: string; sleep: string; reflection: string; savedAt: string };
const moods = ["Sangat berat", "Cemas", "Sedih", "Biasa saja", "Tenang", "Bahagia"];
const icons = ["😣", "😟", "😢", "😐", "😌", "😊"];
const sleepOptions = ["Sangat kurang", "Kurang", "Cukup", "Nyenyak"];

export function WellnessCheckin() {
  const { openCrisis } = useCrisis();
  const { user } = useAuth();
  const storageKey = `havencare-checkin:${user?.uid ?? "guest"}`;
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState("");
  const [sleep, setSleep] = useState("");
  const [reflection, setReflection] = useState("");
  const [last, setLast] = useState<Checkin | null>(null);
  const [done, setDone] = useState(false);
  useEffect(() => { try { const raw = localStorage.getItem(storageKey); setLast(raw ? JSON.parse(raw) : null); } catch {} }, [storageKey]);
  const finish = () => { const item = { mood, sleep, reflection, savedAt: new Date().toISOString() }; try { localStorage.setItem(storageKey, JSON.stringify(item)); } catch {} setLast(item); setDone(true); if (/bunuh diri|menyakiti diri|melukai diri|ingin mati/i.test(reflection)) openCrisis(); };
  return <section className="hc-glass-strong hc-card overflow-hidden p-5 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><span className="hc-label">Tiga langkah untuk dirimu</span><h2 className="hc-section-title mt-1">Skrining kesejahteraan mandiri</h2><p className="hc-muted mt-1 text-sm">Kenali suasana hati, kualitas tidur, dan apa yang ada di pikiranmu.</p></div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1a7f8e]/10 text-[#1a7f8e]"><Sparkles size={23}/></span></div>
    <div className="mt-6 flex items-center gap-2" aria-label={`Langkah ${step+1} dari 3`}>{[0,1,2].map(i=><span key={i} className={`h-2 flex-1 rounded-full ${i<=step ? "bg-[#1a7f8e]" : "bg-[#d7e6e8]"}`}/>)}</div>
    {done ? <div className="py-9 text-center"><CheckCircle2 className="mx-auto text-[#4f8a65]" size={48}/><h3 className="mt-4 text-2xl font-extrabold">Terima kasih sudah check-in</h3><p className="hc-muted mx-auto mt-2 max-w-lg text-sm">Refleksimu tersimpan di perangkat ini. Kamu bisa kembali kapan pun untuk melihat bagaimana perasaanmu berubah.</p><button className="hc-btn hc-btn-primary mt-6" onClick={()=>{setDone(false);setStep(0);setMood("");setSleep("");setReflection("");}}>Mulai check-in baru</button></div> : <div className="py-7">
      {step===0 && <div><p className="hc-label">Langkah 1 · suasana hati</p><h3 className="mt-2 text-2xl font-extrabold">Bagaimana kamu menggambarkan suasana hatimu?</h3><p className="hc-muted mt-1 text-sm">Pilih perasaan yang paling dekat dengan kondisimu saat ini.</p><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{moods.map((item,i)=><button key={item} onClick={()=>setMood(item)} aria-pressed={mood===item} className="hc-chip !flex-col !rounded-2xl py-5"><span className="text-4xl" aria-hidden>{icons[i]}</span><span className="text-sm">{item}</span></button>)}</div></div>}
      {step===1 && <div><p className="hc-label">Langkah 2 · tidur</p><h3 className="mt-2 text-2xl font-extrabold">Bagaimana kualitas tidurmu?</h3><p className="hc-muted mt-1 text-sm">Pikirkan beberapa malam terakhir, lalu pilih jawaban yang paling sesuai.</p><div className="mt-6 grid gap-3 sm:grid-cols-4">{sleepOptions.map((item,i)=><button key={item} onClick={()=>setSleep(item)} aria-pressed={sleep===item} className="hc-chip !flex-col !rounded-2xl py-5"><Moon size={26} className={i>1 ? "text-[#7ea172]" : "text-[#1a7f8e]"}/><span>{item}</span></button>)}</div></div>}
      {step===2 && <div><p className="hc-label">Langkah 3 · ekspresi</p><h3 className="mt-2 text-2xl font-extrabold">Ekspresi pikiran bebas</h3><p className="hc-muted mt-1 text-sm">Apa yang ingin kamu catat tentang hari ini? Kamu boleh melewati bagian ini.</p><textarea className="hc-input mt-6 min-h-36 resize-y" maxLength={1000} value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="Tuliskan apa pun yang ada di pikiranmu..." aria-label="Ekspresi pikiran bebas"/><p className="hc-muted mt-2 text-right text-xs">{reflection.length}/1000 karakter</p></div>}
      <div className="mt-8 flex justify-between gap-3"><button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0} className="hc-btn hc-btn-ghost disabled:opacity-40"><ArrowLeft size={16}/> Sebelumnya</button>{step<2 ? <button onClick={()=>setStep(step+1)} disabled={step===0 ? !mood : !sleep} className="hc-btn hc-btn-primary disabled:opacity-40">Lanjut <ArrowRight size={16}/></button> : <button onClick={finish} className="hc-btn hc-btn-primary">Simpan refleksi <CheckCircle2 size={16}/></button>}</div>
    </div>}
    {last && !done && <p className="hc-muted border-t border-[#d5e9e9] pt-4 text-xs">Check-in terakhir: {new Date(last.savedAt).toLocaleDateString("id-ID")} · {last.mood} · Tidur {last.sleep.toLowerCase()}</p>}
  </section>;
}
