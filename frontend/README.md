# HavenCare Frontend

Implementasi tujuh layar dari `havencare_blueprint_canvas.html` sebagai aplikasi Next.js 14, React 18, TypeScript, dan Tailwind CSS. Struktur `src/app`, `src/components`, `src/features`, `src/lib`, serta mekanisme autentikasi dan API mengikuti proyek `frontend` acuan.

## Jalankan

```bash
npm ci
npm run dev
```

Buka `http://localhost:3000`. Untuk memeriksa build produksi, jalankan `npm run build`.

## Layar

| Rancangan | Rute | Fungsi |
| --- | --- | --- |
| Landing publik | `/` | Pilih suasana hati, akses masuk/daftar, dan bantuan |
| Autentikasi | `/login`, `/register` | Akun email, Google jika dikonfigurasi, dan akun demo |
| Wellness hub | `/dashboard` | Check-in suasana hati dan navigasi pasien |
| Chat refleksi | `/chat` | Sesi chat melalui API atau mode demo yang sudah ada |
| Asesmen | `/assessments` | Check-in tiga langkah serta PHQ-9/GAD-7 dari proyek acuan |
| Komunitas | `/community` | Contoh linimasa dan posting lokal di perangkat |
| Bantuan krisis | Tombol SOS pada halaman | Kontak bantuan dan IGD terdekat |

Rute dokter, admin, onboarding, dan profil dari proyek acuan tetap tersedia. Pasien diarahkan ke `/dashboard` setelah masuk.

## Batas versi demo

Tanpa konfigurasi backend, aplikasi memakai mode demo dari proyek acuan. Postingan komunitas dan check-in disimpan di browser saja; postingan tidak dibagikan ke akun lain dan tidak dimoderasi server. Percakapan demo memakai data simulasi dalam memori aplikasi. HavenCare AI bukan layanan gawat darurat atau pengganti diagnosis.
