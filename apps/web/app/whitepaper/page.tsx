'use client';

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getWhitepaperContent } from "@/lib/i18n/whitepaper";
import { ParticleBackground } from "../components/ParticleBackground";
import { ScrollReveal } from "../components/ScrollReveal";
import { TiltCard } from "../components/TiltCard";
import { MagneticElement } from "../components/MagneticElement";
import { CountUp } from "../components/CountUp";

export default function WhitepaperPage() {
  const { language } = useLanguage();
  const content = getWhitepaperContent(language);

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background layers */}
      <div className="absolute inset-0 opacity-70 bg-gradient-to-b from-black via-[#0b0c12] to-[#06060a] animate-gradient" />
      <ParticleBackground />
      <div className="absolute -left-44 top-0 h-[430px] w-[430px] rounded-full bg-accent/25 blur-3xl animate-pulse" />
      <div className="absolute right-[-18%] top-16 h-[340px] w-[340px] rounded-full bg-white/10 blur-[120px]" />
      <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[150px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="aurora -left-10 top-10 h-[520px] w-[520px]" />
      <div className="aurora right-0 top-44 h-[620px] w-[520px]" style={{ animationDelay: "0.8s" }} />
      <div className="orb left-[15%] top-[30%] h-40 w-40" />
      <div className="orb right-[12%] top-[18%] h-52 w-52" />
      <div className="absolute inset-0 holo-grid" />
      <div className="absolute inset-0 noise pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-16 lg:py-24 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/30">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] text-accent">{content.hero.badge}</span>
          </div>
          <MagneticElement strength={0.08}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight text-white drop-shadow-[0_20px_70px_rgba(229,9,20,0.4)]">
              {content.hero.title}
              <span className="block text-accent mt-3 glitch glow-pulse" data-text={content.hero.subtitle}>
                {content.hero.subtitle}
              </span>
            </h1>
          </MagneticElement>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            {content.hero.description}
          </p>
        </section>

        {/* Genesis Node Section */}
        <ScrollReveal>
          <section className="glass-veil rounded-3xl p-8 sm:p-10 border border-white/10 space-y-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(229,9,20,0.15),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_30%)] opacity-40 rounded-3xl" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">{content.genesis.tag}</p>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-white mb-6">
                {content.genesis.title}
              </h2>
              
              {/* Genesis Node Visualization */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-white/20 rounded-2xl blur-lg opacity-40" />
                  <div className="relative glass rounded-2xl p-6 border border-accent/40 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-accent to-red-600 grid place-items-center text-white text-2xl font-bold shadow-[0_10px_40px_rgba(229,9,20,0.5)] pulse-glow">
                        G₁
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">{content.genesis.node1.title}</p>
                        <p className="text-white/60 text-sm">{content.genesis.node1.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-white/80 leading-relaxed">{content.genesis.node1.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {content.genesis.node1.features.map((feature) => (
                        <span key={feature} className="px-3 py-1 rounded-full text-xs bg-accent/20 border border-accent/30 text-accent">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-accent/30 rounded-2xl blur-lg opacity-30" />
                  <div className="relative glass rounded-2xl p-6 border border-white/20 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-steel to-carbon grid place-items-center text-white text-2xl font-bold border border-white/20">
                        G₂
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">{content.genesis.node2.title}</p>
                        <p className="text-white/60 text-sm">{content.genesis.node2.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-white/80 leading-relaxed">{content.genesis.node2.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {content.genesis.node2.features.map((feature) => (
                        <span key={feature} className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/20 text-white/70">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Flow */}
              <div className="relative py-6">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-white/30 to-accent" />
                <div className="relative flex justify-center">
                  <div className="glass-veil rounded-2xl px-6 py-4 border border-accent/30 flex items-center gap-4">
                    <div className="text-accent text-2xl">⟳</div>
                    <div>
                      <p className="text-white font-semibold">{content.genesis.threshold.title}</p>
                      <p className="text-white/60 text-sm">{content.genesis.threshold.description}</p>
                    </div>
                    <div className="text-3xl font-display text-white font-bold">
                      <CountUp end={400} duration={2000} suffix="×" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Interactive Drama Evolution */}
        <ScrollReveal>
          <section className="space-y-8">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">{content.evolution.tag}</p>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-white">
                {content.evolution.title}
              </h2>
            </div>

            {/* 3-Choice Branching Visualization */}
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(229,9,20,0.1),transparent_50%)]" />
              <div className="relative glass rounded-3xl p-8 border border-white/10">
                <div className="grid gap-8">
                  {/* Central Node */}
                  <div className="flex justify-center">
                    <TiltCard tiltMaxAngle={8} className="glass-veil rounded-2xl p-6 border border-accent/40 max-w-sm text-center spotlight">
                      <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-red-600 grid place-items-center text-white text-xl font-bold shadow-[0_10px_40px_rgba(229,9,20,0.5)]">
                        ▶
                      </div>
                      <p className="text-white font-semibold text-lg">{content.evolution.currentFrame.title}</p>
                      <p className="text-white/60 text-sm mt-1">{content.evolution.currentFrame.description}</p>
                    </TiltCard>
                  </div>

                  {/* Branch Lines */}
                  <div className="flex justify-center gap-4 sm:gap-8">
                    <div className="h-12 w-px bg-gradient-to-b from-accent to-transparent" />
                    <div className="h-12 w-px bg-gradient-to-b from-accent to-transparent" />
                    <div className="h-12 w-px bg-gradient-to-b from-accent to-transparent" />
                  </div>

                  {/* 3 Choice Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {content.evolution.choices.map((choice, index) => (
                      <TiltCard
                        key={choice.id}
                        tiltMaxAngle={10}
                        glareEnable={true}
                        className="glass rounded-2xl p-5 border border-white/15 hover:border-accent/50 transition-all duration-300 cursor-pointer flowing-border spotlight group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`h-10 w-10 rounded-lg grid place-items-center text-white font-bold ${
                            index === 0 ? 'bg-gradient-to-br from-red-500 to-orange-600' :
                            index === 1 ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                            'bg-gradient-to-br from-blue-500 to-cyan-600'
                          }`}>
                            {choice.id}
                          </div>
                          <span className="text-xs uppercase tracking-wider text-white/50">{choice.label}</span>
                        </div>
                        <p className="text-white font-medium mb-2">{choice.title}</p>
                        <p className="text-white/60 text-sm leading-relaxed">{choice.description}</p>
                        <div className="mt-3 flex items-center gap-2 text-accent text-sm group-hover:translate-x-1 transition-transform">
                          <span>{choice.action}</span>
                          <span>→</span>
                        </div>
                      </TiltCard>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Loop Indicator */}
            <div className="flex justify-center">
              <div className="glass-veil rounded-full px-6 py-3 border border-white/20 flex items-center gap-4">
                <span className="text-2xl animate-spin" style={{ animationDuration: '3s' }}>⟳</span>
                <span className="text-white/80">{content.evolution.loopText}</span>
                <span className="text-accent font-semibold">{content.evolution.mintTrigger}</span>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Premium HD Section */}
        <ScrollReveal>
          <section className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-transparent to-accent/20 rounded-[40px] blur-2xl" />
            <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-accent/15 via-[#0a0b10] to-[#0a0b10] border border-accent/30 shadow-[0_30px_90px_rgba(229,9,20,0.2)]">
              <div className="scan-line absolute inset-0 rounded-3xl" />
              
              <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/40">
                    <span className="text-accent text-sm">✦</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-accent">{content.premium.badge}</span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-display font-semibold text-white">
                    {content.premium.title}
                  </h2>
                  
                  <p className="text-white/80 leading-relaxed">
                    {content.premium.description}
                  </p>

                  <div className="space-y-3">
                    {content.premium.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 group">
                        <span className="mt-1 h-2 w-2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(229,9,20,0.2)] group-hover:shadow-[0_0_0_6px_rgba(229,9,20,0.4)] transition-all" />
                        <p className="text-white/80 group-hover:text-white transition-colors">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-br from-accent/30 to-white/10 rounded-2xl blur-xl" />
                  <div className="relative glass rounded-2xl p-6 border border-white/20 space-y-6">
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">{content.premium.pricing.label}</p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl font-display font-bold text-white">10×</span>
                        <span className="text-white/50">~</span>
                        <span className="text-4xl font-display font-bold text-accent">100×</span>
                      </div>
                      <p className="text-white/60 text-sm mt-2">{content.premium.pricing.subtitle}</p>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                        <p className="text-2xl font-bold text-white">T+1</p>
                        <p className="text-white/60 text-xs uppercase tracking-wider mt-1">{content.premium.delivery.title}</p>
                      </div>
                      <div className="rounded-xl bg-accent/10 border border-accent/30 p-4 text-center">
                        <p className="text-2xl font-bold text-accent">4K</p>
                        <p className="text-white/60 text-xs uppercase tracking-wider mt-1">{content.premium.quality.title}</p>
                      </div>
                    </div>

                    <MagneticElement strength={0.15}>
                      <button className="w-full py-4 rounded-xl bg-gradient-to-r from-accent via-red-500 to-accent text-white font-semibold shadow-[0_20px_60px_rgba(229,9,20,0.4)] hover:scale-[1.02] transition glow-pulse">
                        {content.premium.cta}
                      </button>
                    </MagneticElement>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Economic Flow */}
        <ScrollReveal>
          <section className="glass rounded-3xl p-8 sm:p-10 border border-white/10 space-y-8">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">{content.economics.tag}</p>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-white">
                {content.economics.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {content.economics.steps.map((step, index) => (
                <TiltCard
                  key={step.id}
                  tiltMaxAngle={8}
                  className="relative glass-veil rounded-2xl p-5 border border-white/10 hover:border-accent/40 transition-all duration-300 spotlight"
                >
                  {index < content.economics.steps.length - 1 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-accent text-xl z-10">→</div>
                  )}
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/30 to-white/10 border border-white/20 grid place-items-center text-white font-bold mb-4">
                    {step.id}
                  </div>
                  <p className="text-white font-semibold mb-2">{step.title}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
                </TiltCard>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              {content.economics.stats.map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4 text-center border border-white/10 hover:border-accent/30 transition-all">
                  <p className="text-2xl font-display font-bold text-white">
                    <CountUp end={stat.value} duration={2000} suffix={stat.suffix} />
                  </p>
                  <p className="text-white/60 text-xs uppercase tracking-[0.15em] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Technical Architecture */}
        <ScrollReveal>
          <section className="space-y-8">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">{content.architecture.tag}</p>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-white">
                {content.architecture.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {content.architecture.layers.map((layer, index) => (
                <ScrollReveal key={layer.title} delay={index * 100}>
                  <TiltCard
                    tiltMaxAngle={10}
                    glareEnable={true}
                    className="glass rounded-2xl p-6 border border-white/10 hover:border-accent/50 transition-all duration-500 h-full flowing-border spotlight"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/40 to-white/10 border border-white/20 grid place-items-center text-xl mb-4">
                      {layer.icon}
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-accent mb-2">{layer.tag}</p>
                    <h3 className="text-xl font-semibold text-white mb-3">{layer.title}</h3>
                    <p className="text-white/70 leading-relaxed mb-4">{layer.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {layer.techs.map((tech) => (
                        <span key={tech} className="px-2 py-1 rounded text-xs bg-white/5 border border-white/10 text-white/60">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </TiltCard>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* CTA Section */}
        <ScrollReveal>
          <section className="relative rounded-3xl p-10 sm:p-14 bg-gradient-to-b from-accent/20 via-red-600/10 to-[#0a0b10] border border-accent/30 shadow-[0_30px_90px_rgba(229,9,20,0.28)] text-center">
            <div className="scan-line absolute inset-0 rounded-3xl" />
            <div className="relative space-y-6">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
                {content.cta.title}
              </h2>
              <p className="text-white/70 max-w-xl mx-auto leading-relaxed">
                {content.cta.description}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <MagneticElement strength={0.2}>
                  <button className="px-8 py-4 rounded-full bg-gradient-to-r from-accent via-red-500 to-white text-white font-semibold shadow-[0_20px_60px_rgba(229,9,20,0.5)] hover:scale-[1.05] transition glow-pulse">
                    {content.cta.primary}
                  </button>
                </MagneticElement>
                <MagneticElement strength={0.15}>
                  <button className="px-8 py-4 rounded-full border border-white/30 text-white hover:border-accent hover:bg-accent/10 transition">
                    {content.cta.secondary}
                  </button>
                </MagneticElement>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}



