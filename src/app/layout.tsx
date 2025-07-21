import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TokenGate from "@/components/TokenGate";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🌟 まいにちほめる - 横浜DeNAベイスターズ応援ブログ",
  description: "横浜DeNAベイスターズ選手を毎日ポジティブに応援するブログ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <TokenGate>
            {children}
          </TokenGate>
        </Suspense>
      </body>
    </html>
  );
}
