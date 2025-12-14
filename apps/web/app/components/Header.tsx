'use client';

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getLandingContent } from "@/lib/i18n/landing";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { shortenAddress } from "@/lib/solana";
import { useWalletStore } from "@/lib/stores/walletStore";
import { useEffect } from "react";

export function Header() {
  const { language } = useLanguage();
  const content = getLandingContent(language);
  const { publicKey, connected } = useWallet();
  const { setWallet, drapBalance } = useWalletStore();

  // 同步钱包状态到 store
  useEffect(() => {
    setWallet(publicKey);
  }, [publicKey, setWallet]);

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
        
        {/* DRAP 积分显示 */}
        {connected && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full border border-white/20 text-white/80">
            <span className="text-accent font-semibold">{drapBalance.toFixed(2)}</span>
            <span>DRAP</span>
          </div>
        )}
        
        <button className="hidden sm:block px-4 py-2 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition">
          {content.header.protocol}
        </button>
        
        {/* Solana 钱包连接按钮 */}
        <WalletMultiButton 
          style={{
            backgroundColor: connected ? 'transparent' : '#e50914',
            border: connected ? '1px solid rgba(255,255,255,0.2)' : 'none',
            borderRadius: '9999px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 600,
            height: 'auto',
          }}
        />
      </div>
    </header>
  );
}
