import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "HavenCare — Ruang Refleksi & Pendampingan",
  description:
    "Ruang refleksi dan pendampingan kesehatan mental yang tenang, aman, dan manusiawi.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
