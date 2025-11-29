'use client';

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getLandingContent } from "@/lib/i18n/landing";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { language } = useLanguage();
  const content = getLandingContent(language);

  return (
    <header className="px-4 sm:px-6 py-4 flex items-center justify-between glass border border-white/10 bg-white/5 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-accent to-red-500 shadow-[0_10px_40px_rgba(229,9,20,0.35)] grid place-items-center text-black font-bold tracking-widest">
          DF
        </div>
        <div className="hidden sm:block">
          <p className="text-sm uppercase tracking-[0.28em] text-white">
            DramaForge
          </p>
          <p className="text-xs text-white/70">
            AIGC short drama · on-chain collectibles
          </p>
        </div>
      </Link>
      <div className="flex items-center gap-2 sm:gap-3 text-xs">
        <LanguageSwitcher />
        <button className="hidden sm:block px-4 py-2 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition">
          {content.header.protocol}
        </button>
        <Link 
          href="/signin"
          className="px-3 sm:px-4 py-2 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition"
        >
          {content.header.signIn}
        </Link>
        <button className="px-3 sm:px-4 py-2 rounded-full bg-accent text-white font-semibold shadow-[0_10px_40px_rgba(229,9,20,0.35)] hover:scale-[1.02] transition">
          {content.header.launchApp}
        </button>
      </div>
    </header>
  );
}

