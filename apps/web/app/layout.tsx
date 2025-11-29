import type { Metadata } from "next";
import { Barlow, Orbitron } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Footer } from "./components/Footer";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Header } from "./components/Header";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "DramaForge | Web3 AIGC Shorts",
  description:
    "Generate, publish, and collect AI-generated short dramas on-chain with wallet-native UX."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${barlow.variable}`}>
      <body className="font-body min-h-screen bg-gradient-to-b from-carbon via-[#0d0f17] to-black text-ash">
        <Providers>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
