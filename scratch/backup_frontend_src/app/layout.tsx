import type { Metadata } from "next";
import { JetBrains_Mono, Urbanist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HavenCare — Ruang Refleksi dan Dukungan Kesehatan Mental",
    template: "%s | HavenCare",
  },
  description:
    "Ruang aman dan tenang untuk refleksi pikiran, check-in suasana hati, dan pendampingan Psychological First Aid bersama HavenCare AI dengan privasi zero-plaintext.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body
        className={`${urbanist.variable} ${jetbrains.variable} font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
