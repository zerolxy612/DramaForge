'use client';

import Image from "next/image";
import Link from "next/link";
import { ParticleBackground } from "./components/ParticleBackground";
import { RotatingCardStack } from "./components/RotatingCardStack";
import { ScrollReveal } from "./components/ScrollReveal";
import { MagneticElement } from "./components/MagneticElement";
import { TiltCard } from "./components/TiltCard";
import { CountUp } from "./components/CountUp";
import { FilmReel, FilmReelContainer } from "./components/FilmReel";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getLandingContent } from "@/lib/i18n/landing";

const heroCards = [
  {
    id: "alpha",
    badge: "Last ending · Ultimate Sleep God",
    title: "Naruto Multiverse: Chuckle City",
    mood: "Adult · Chuckle · Silly",
    stats: ["10 chapters", "961 views", "20 favorites"],
    cta: "Play",
    image: "/images/Home%20Featured.png",
    className: "z-30 rotate-[-6deg] -translate-x-2 translate-y-3 scale-[0.99]"
  },
  {
    id: "beta",
    badge: "Live branch · Neon Alley",
    title: "Ramen Race Rumble",
    mood: "Agent remix",
    stats: ["Mint-ready", "Split revenue"],
    cta: "Mint episode",
    image: "/images/Image.png",
    className: "z-20 rotate-[9deg] translate-x-8 translate-y-10 scale-[0.9] opacity-90"
  },
  {
    id: "gamma",
    badge: "Vault drop",
    title: "Circuit Summons",
    mood: "Neo noir",
    stats: ["Collectors · 1,240", "24h floor · 0.18"],
    cta: "View vault",
    image: "/images/Image.png",
    className: "z-10 rotate-[-14deg] -translate-x-10 translate-y-16 scale-[0.85] opacity-80"
  }
];



const chapters = [
  { id: "01", title: "Signal of Iron Ink", tag: "Anemo comedy", image: "/images/Rectangle.png" },
  { id: "02", title: "Circuit Summons", tag: "Neo noir", image: "/images/card%202.png" },
  { id: "03", title: "Redline Ramen Rumble", tag: "Battle slapstick", image: "/images/card%203.png" },
  { id: "04", title: "Archive of Agents", tag: "Lore drop", image: "/images/Home%20Featured.png" }
];

export default function Home() {
  const { language } = useLanguage();
  const content = getLandingContent(language);
  return (
    <div className="relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 opacity-70 bg-gradient-to-b from-black via-[#0b0c12] to-[#06060a] animate-gradient" />
      <ParticleBackground />
      <div className="absolute -left-44 top-0 h-[430px] w-[430px] rounded-full bg-accent/25 blur-3xl animate-pulse" />
      <div className="absolute right-[-18%] top-16 h-[340px] w-[340px] rounded-full bg-white/10 blur-[120px]" />
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[150px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="aurora -left-10 top-10 h-[520px] w-[520px]" />
      <div className="aurora right-0 top-44 h-[620px] w-[520px]" style={{ animationDelay: "0.8s" }} />
      <div className="orb left-[15%] top-[30%] h-40 w-40" />
      <div className="orb right-[12%] top-[18%] h-52 w-52" />
      <div className="absolute inset-0 holo-grid" />
      <div className="absolute inset-0 noise pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-12 lg:py-16 space-y-14">
        <section className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center relative">
          <div className="space-y-7 relative">
            <div className="absolute -left-10 -top-12 h-28 w-28 rounded-full bg-gradient-to-br from-white/10 via-accent/30 to-transparent blur-2xl animate-pulse" />
            <p className="text-xs uppercase tracking-[0.3em] text-accent shimmer-text">
              {content.hero.tagline}
            </p>
            <MagneticElement strength={0.1}>
              <h1 className="font-display text-4xl sm:text-5xl leading-tight text-white drop-shadow-[0_20px_70px_rgba(229,9,20,0.4)]">
                {content.hero.title}
                <span className="block text-accent mt-3 glitch glow-pulse" data-text={content.hero.subtitle}>
                  {content.hero.subtitle}
                </span>
              </h1>
            </MagneticElement>
            <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
              {content.hero.description}
            </p>

            {/* AIGC 灵感输入框 (参考参考图1) */}
            <MagneticElement strength={0.1}>
              <div className="relative w-full max-w-xl group z-20">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-purple-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center bg-black/40 backdrop-blur-xl border border-white/15 rounded-2xl p-2 focus-within:border-accent/50 focus-within:bg-black/60 transition-all duration-300">
                  <div className="pl-4 pr-3 text-accent animate-pulse">✨</div>
                  <input 
                    type="text" 
                    placeholder="有什么新的故事灵感？AI 自动为你策划..."
                    className="flex-1 bg-transparent border-none text-white placeholder-white/30 focus:outline-none text-sm h-11"
                  />
                  <div className="flex items-center gap-2 pr-1">
                     <span className="hidden sm:inline-block px-2 py-1 rounded text-[10px] bg-white/5 text-white/30 border border-white/5">
                        ↵ Enter
                     </span>
                     <button className="h-9 w-9 rounded-xl bg-white/10 hover:bg-accent hover:text-white text-white/60 transition-all grid place-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                     </button>
                  </div>
                </div>
              </div>
            </MagneticElement>

            <div className="glass-veil rounded-2xl p-4 flex gap-3 items-start relative overflow-hidden">
              <div className="absolute inset-0 scan-line opacity-20" />
              <div className="h-11 w-11 rounded-full bg-black/60 border border-white/15 grid place-items-center text-white text-lg pulse-glow">
                ∞
              </div>
              <div className="space-y-1 relative z-10">
                <p className="text-sm text-white font-semibold">{content.hero.manifestoTitle}</p>
                <p className="text-white/70 text-sm leading-relaxed">
                  {content.hero.manifestoBody}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <MagneticElement strength={0.2}>
                <Link href="/theater/demo">
                  <button className="relative px-5 py-3 rounded-full bg-gradient-to-r from-accent via-red-500 to-white text-white font-semibold shadow-[0_20px_60px_rgba(229,9,20,0.4)] hover:scale-[1.05] transition overflow-hidden glow-pulse">
                    <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.3),transparent_35%)] opacity-60" />
                    <span className="relative shimmer-text">{content.hero.cta.play}</span>
                  </button>
                </Link>
              </MagneticElement>
              <MagneticElement strength={0.15}>
                <Link 
                  href="/whitepaper"
                  className="px-5 py-3 rounded-full border border-white/20 text-white/80 hover:border-accent hover:text-white hover:-translate-y-0.5 transition flowing-border inline-block"
                >
                  {content.hero.cta.whitepaper}
                </Link>
              </MagneticElement>
              <MagneticElement strength={0.15}>
                <button className="px-5 py-3 rounded-full bg-white/10 text-white/80 border border-white/15 hover:bg-white/20 hover:text-white transition flowing-border">
                  {content.hero.cta.agentNode}
                </button>
              </MagneticElement>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs uppercase tracking-[0.15em]">
              {content.hero.chips.map((chip) => (
                <span
                  key={chip}
                  className="px-3 py-2 glass rounded-full glow-ring text-white/80 text-[11px] hover:-translate-y-1 transition-transform"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              {[
                { label: content.hero.stats.chapters, value: 1284, suffix: "" },
                { label: content.hero.stats.collectors, value: 9712, suffix: "" },
                { label: content.hero.stats.agents, value: 86, suffix: "" },
                { label: content.hero.stats.split, value: 42, suffix: "% to fans" }
              ].map((item) => (
                <TiltCard
                  key={item.label}
                  tiltMaxAngle={8}
                  className="glass-veil rounded-2xl p-3 border border-white/10 flex flex-col gap-1 hover:border-accent/50 transition-all duration-300 spotlight"
                >
                  <p className="text-white text-lg font-semibold">
                    <CountUp
                      end={item.value}
                      duration={2500}
                      suffix={item.suffix}
                    />
                  </p>
                  <p className="text-white/60 text-[11px] uppercase tracking-[0.2em]">
                    {item.label}
                  </p>
                </TiltCard>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-white/10 via-transparent to-accent/30 blur-2xl animate-pulse" />
            <RotatingCardStack cards={heroCards} />
          </div>
        </section>

        <ScrollReveal>
          <section className="relative overflow-hidden glass-veil rounded-3xl p-6 sm:p-8 border border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(229,9,20,0.2),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_30%)] opacity-40" />
            <div className="absolute -right-16 -top-10 h-64 w-64 aurora" />
            <div className="absolute -left-16 bottom-0 h-52 w-52 orb" />
            <div className="relative grid md:grid-cols-[1.15fr_0.85fr] gap-8">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-accent">{content.manifesto.sectionTag}</p>
                <h2 className="text-2xl sm:text-3xl font-display font-semibold text-white">
                  {content.manifesto.title}
                </h2>
                <div className="space-y-3 text-white/80 leading-relaxed">
                  {content.manifesto.paragraphs.map((line) => (
                    <p key={line} className="hover:text-white transition-colors">
                      {line}
                    </p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em]">
                  {content.manifesto.chips.map((chip) => (
                    <span key={chip} className="px-3 py-2 rounded-full bg-white/10 border border-white/15 text-white/80 hover:text-white hover:border-accent transition">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative glass rounded-2xl p-5 border border-white/10 overflow-hidden">
                <div className="absolute inset-0 scan-line opacity-30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(229,9,20,0.35),transparent_35%)] opacity-50" />
                <div className="relative space-y-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/70">{content.manifesto.dashboard.title}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: content.manifesto.dashboard.stats.ubi, value: "0.024 ETH" },
                      { label: content.manifesto.dashboard.stats.split, value: "Fans 42%" },
                      { label: content.manifesto.dashboard.stats.agents, value: "126" },
                      { label: content.manifesto.dashboard.stats.cycles, value: "3.8k" }
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/10 bg-white/5 p-3 hover:border-accent/50 hover:-translate-y-1 transition"
                      >
                        <p className="text-white text-xl font-semibold">{stat.value}</p>
                        <p className="text-white/60 text-[11px] uppercase tracking-[0.2em]">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-[1.1fr_0.9fr] gap-3 text-sm">
                    <div className="rounded-xl border border-accent/40 bg-accent/10 p-4 hover:bg-accent/20 transition-all duration-300">
                      <p className="text-white font-semibold">{content.manifesto.dashboard.cards.interaction.title}</p>
                      <p className="text-white/70 mt-1 leading-relaxed text-sm">
                        {content.manifesto.dashboard.cards.interaction.body}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-white font-semibold">{content.manifesto.dashboard.cards.revenue.title}</p>
                      <p className="text-white/70 mt-1 leading-relaxed text-sm">
                        {content.manifesto.dashboard.cards.revenue.body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="grid md:grid-cols-3 gap-5">
            {[content.perks.dynamic, content.perks.revenue, content.perks.wallet].map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 100}>
                <TiltCard
                  tiltMaxAngle={10}
                  glareEnable={true}
                  className="glass rounded-2xl p-6 border border-white/10 hover:border-accent/60 hover:shadow-[0_20px_80px_rgba(229,9,20,0.3)] transition-all duration-500 shadow-[0_20px_80px_rgba(0,0,0,0.3)] group flowing-border spotlight"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-accent mb-3 group-hover:text-red-400 transition-colors">
                    {item.accent}
                  </p>
                  <h3 className="text-xl font-semibold text-white mb-3 shimmer-text">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.body}</p>
                </TiltCard>
              </ScrollReveal>
            ))}
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="glass rounded-3xl p-6 sm:p-8 space-y-6 border border-white/10 hover:border-white/20 transition-all duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-accent">{content.chapters.tag}</p>
                <h2 className="text-2xl font-display font-semibold tracking-wide text-white">
                  {content.chapters.title}
                </h2>
              </div>
              <button className="px-4 py-2 rounded-full border border-white/20 text-white/80 hover:border-accent hover:text-white hover:shadow-[0_0_20px_rgba(229,9,20,0.3)] transition-all duration-300">
                {content.chapters.browseAll}
              </button>
            </div>
            <FilmReelContainer startDelay={200} itemDelay={150}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {chapters.map((chapter, index) => (
                  <FilmReel key={chapter.id} delay={index * 150} index={index}>
                    <TiltCard
                      tiltMaxAngle={12}
                      glareEnable={true}
                      className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0f1116] to-[#0a0c12] hover:border-accent/50 hover:shadow-[0_20px_60px_rgba(229,9,20,0.3)] transition-all duration-500 card-shine group cursor-pointer flowing-border"
                    >
                      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(229,9,20,0.35),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_30%)]" />
                      <div className="relative aspect-[3/4]">
                        <Image
                          src={chapter.image}
                          alt={chapter.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 50vw, 240px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/70" />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] bg-black/60 text-white/80 border border-white/10 backdrop-blur-sm">
                          {chapter.tag}
                        </span>
                        <span className="absolute bottom-2 left-2 text-5xl font-display text-white drop-shadow-[0_10px_24px_rgba(229,9,20,0.45)] group-hover:text-accent transition-colors duration-300 shimmer-text">
                          {chapter.id}
                        </span>
                      </div>
                      <div className="relative p-4 space-y-1">
                        <p className="font-semibold text-white group-hover:text-accent transition-colors duration-300">{chapter.title}</p>
                        <p className="text-white/60 text-sm">Agent-rendered · 铸造即刻开放</p>
                      </div>
                    </TiltCard>
                  </FilmReel>
                ))}
              </div>
            </FilmReelContainer>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="grid lg:grid-cols-2 gap-8">
            <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all duration-500 flex flex-col gap-4 group">
              <p className="text-xs uppercase tracking-[0.28em] text-accent group-hover:text-red-400 transition-colors">{content.flow.tag}</p>
              <h3 className="text-2xl font-semibold font-display text-white">
                {content.flow.title}
              </h3>
              <div className="space-y-3">
                {content.flow.steps.map((flow, index) => (
                  <div key={flow} className="flex items-start gap-3 group/item">
                    <span className="mt-1 h-2 w-2 rounded-full bg-accent shadow-[0_0_0_6px_rgba(229,9,20,0.2)] group-hover/item:shadow-[0_0_0_8px_rgba(229,9,20,0.4)] transition-all duration-300" />
                    <p className="text-white/80 group-hover/item:text-white transition-colors">{flow}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                <div className="rounded-2xl border border-accent/40 bg-accent/10 p-3 hover:bg-accent/20 hover:border-accent/60 transition-all duration-300 cursor-pointer">
                  <p className="text-white text-lg font-semibold">zk-ready</p>
                  <p className="text-white/70 text-[11px] uppercase tracking-[0.2em]">
                    {content.flow.features.zk}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                  <p className="text-white text-lg font-semibold">Multi-chain</p>
                  <p className="text-white/70 text-[11px] uppercase tracking-[0.2em]">
                    {content.flow.features.multichain}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-accent/20 via-red-600/10 to-[#0a0b10] border border-accent/30 shadow-[0_30px_90px_rgba(229,9,20,0.28)] hover:shadow-[0_40px_100px_rgba(229,9,20,0.4)] transition-all duration-500 flex flex-col gap-5 group relative overflow-hidden">
              <div className="scan-line absolute inset-0" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="h-11 w-11 rounded-full bg-black/50 border border-white/20 grid place-items-center text-white group-hover:border-accent group-hover:bg-accent/20 transition-all duration-300">
                  ⧖
                </div>
                <div>
                  <p className="text-sm text-white/80 uppercase tracking-[0.2em]">
                    {content.launchpad.tag}
                  </p>
                  <p className="text-lg text-white font-semibold">{content.launchpad.title}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                {content.launchpad.steps.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/15 bg-black/30 p-3 text-white/80 text-sm hover:bg-black/50 hover:border-white/30 transition-all duration-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 relative z-10">
                <button className="px-5 py-3 rounded-full bg-black text-white font-semibold border border-white/20 hover:border-white/50 hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)] transition-all duration-300">
                  {content.launchpad.cta.connect}
                </button>
                <button className="px-5 py-3 rounded-full bg-white text-black font-semibold hover:bg-ash hover:shadow-[0_10px_40px_rgba(255,255,255,0.3)] transition-all duration-300">
                  {content.launchpad.cta.mint}
                </button>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
