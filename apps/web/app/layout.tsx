import type { Metadata } from "next";
import { Barlow, Orbitron } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Footer } from "./components/Footer";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

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
              <header className="px-6 py-4 flex items-center justify-between glass border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-accent to-red-500 shadow-[0_10px_40px_rgba(229,9,20,0.35)] grid place-items-center text-black font-bold tracking-widest">
                    DF
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-white">
                      DramaForge
                    </p>
                    <p className="text-xs text-white/70">
                      AIGC short drama · on-chain collectibles
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <LanguageSwitcher />
                  <button className="px-4 py-2 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition">
                    Protocol
                  </button>
                  <button className="px-4 py-2 rounded-full bg-accent text-white font-semibold shadow-[0_10px_40px_rgba(229,9,20,0.35)] hover:scale-[1.02] transition">
                    Launch App
                  </button>
                </div>
              </header>
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
