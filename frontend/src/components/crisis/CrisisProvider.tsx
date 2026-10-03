"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Heart, Hospital, Phone, ShieldAlert, X } from "lucide-react";

const CrisisContext = createContext<{ openCrisis: () => void; closeCrisis: () => void }>({
  openCrisis: () => undefined,
  closeCrisis: () => undefined,
});

export const useCrisis = () => useContext(CrisisContext);

export function CrisisProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openCrisis = useCallback(() => setOpen(true), []);
  const closeCrisis = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const listener = () => setOpen(true);
    window.addEventListener("havencare:crisis", listener);
    return () => window.removeEventListener("havencare:crisis", listener);
  }, []);

  return (
    <CrisisContext.Provider value={{ openCrisis, closeCrisis }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0d191f]/90 px-4 py-6 backdrop-blur-sm sm:py-10" role="dialog" aria-modal="true" aria-labelledby="crisis-title">
          <div className="hc-glass-strong mx-auto max-w-5xl rounded-[32px] border-2 border-[#e06d6d]/40 p-6 text-center shadow-[0_32px_80px_rgba(224,109,109,.24)] sm:p-10">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border-2 border-[#e06d6d] bg-[#e06d6d]/15 text-[#d85d62]"><Heart size={30} fill="currentColor" /></div>
            <p className="hc-label mb-2 text-[#d85d62]">Bantuan segera</p>
            <h2 id="crisis-title" className="mx-auto max-w-3xl text-2xl font-extrabold leading-tight sm:text-4xl">Kamu tidak sendirian. Bantuan nyata siap mendampingimu.</h2>
            <p className="hc-muted mx-auto mt-3 max-w-2xl leading-relaxed">Jika kamu ingin menyakiti diri atau sedang dalam bahaya, hubungi layanan darurat atau pergi ke IGD terdekat sekarang. Ajak orang yang kamu percaya untuk menemanimu.</p>
            <div className="mt-7 grid gap-4 text-left sm:grid-cols-2">
              <CrisisCard icon={<Phone size={21} />} label="Dukungan kesehatan jiwa" title="Healing119 · 119 ekstensi 8" description="Layanan dukungan psikologis dari Kementerian Kesehatan." href="tel:119" action="Hubungi 119" featured />
              <CrisisCard icon={<ShieldAlert size={21} />} label="Darurat terpadu" title="112" description="Untuk keadaan darurat yang memerlukan pertolongan segera." href="tel:112" action="Hubungi 112" />
              <CrisisCard icon={<Hospital size={21} />} label="Pertolongan langsung" title="IGD rumah sakit terdekat" description="Datangi IGD terdekat bila ada bahaya fisik atau perlu bantuan tatap muka." href="https://www.google.com/maps/search/IGD+Rumah+Sakit+terdekat" action="Cari IGD terdekat" external />
              <CrisisCard icon={<Phone size={21} />} label="Keamanan" title="Polisi · 110" description="Hubungi polisi jika kamu terancam kekerasan atau membutuhkan bantuan keamanan." href="tel:110" action="Hubungi 110" />
            </div>
            <p className="hc-muted mx-auto mt-6 max-w-3xl rounded-xl bg-[#162831]/5 p-3 text-xs leading-relaxed">HavenCare adalah ruang refleksi, bukan layanan gawat darurat atau pengganti tenaga kesehatan. Nomor telepon tersambung melalui perangkat dan operator yang kamu gunakan.</p>
            <button onClick={closeCrisis} className="hc-btn hc-btn-ghost mt-5"><X size={17} /> Kembali jika situasi sudah aman</button>
            <Link href="/dashboard" onClick={closeCrisis} className="sr-only">Kembali ke dashboard</Link>
          </div>
        </div>
      )}
    </CrisisContext.Provider>
  );
}

function CrisisCard({ icon, label, title, description, href, action, featured, external }: { icon: ReactNode; label: string; title: string; description: string; href: string; action: string; featured?: boolean; external?: boolean }) {
  return <div className={`flex flex-col justify-between rounded-3xl border p-5 ${featured ? "border-[#e06d6d] bg-[#fffafa]" : "border-[#d9e7e8] bg-white/80"}`}>
    <div><div className="mb-2 flex items-center justify-between"><span className={`hc-label ${featured ? "text-[#d85d62]" : ""}`}>{label}</span><span className="text-[#1a7f8e]">{icon}</span></div><h3 className="text-xl font-extrabold">{title}</h3><p className="hc-muted mt-1 text-sm">{description}</p></div>
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={`hc-btn mt-5 ${featured ? "hc-btn-danger" : "hc-btn-primary"}`}>{action}</a>
  </div>;
}
