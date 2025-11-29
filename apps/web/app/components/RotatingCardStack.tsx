"use client";

import Image from "next/image";
import { useState } from "react";

interface Card {
  id: string;
  badge: string;
  title: string;
  mood: string;
  stats: string[];
  cta: string;
  image: string;
  className?: string;
}

interface RotatingCardStackProps {
  cards: Card[];
}

export function RotatingCardStack({ cards }: RotatingCardStackProps) {
  const [pinnedCard, setPinnedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const activeCard = pinnedCard ?? hoveredCard;

  return (
    <div className="relative group card-stack-3d">
      <div className="absolute -inset-8 bg-gradient-to-br from-accent/30 via-transparent to-white/10 blur-3xl rounded-[40px] animate-pulse" />
      <div className="absolute inset-0 rounded-[32px] border border-white/5 pointer-events-none" />
      
      <div className="relative aspect-[10/16] max-w-[520px] mx-auto">
        {cards.map((card, index) => {
          const isActive = activeCard === card.id;
          const isDimmed = Boolean(activeCard && !isActive);
          const imageOverlay = isActive
            ? "bg-gradient-to-b from-black/0 via-black/20 to-black/60"
            : "bg-gradient-to-b from-black/10 via-black/40 to-black/80";

          return (
          <div
            key={card.id}
            className={`card-3d absolute inset-0 origin-center transition-all duration-700 ease-out card-shine cursor-pointer ${card.className || ""} ${
              isActive ? "opacity-100 saturate-150" : ""
            } ${isDimmed ? "opacity-60 saturate-75" : "opacity-100"}`}
            style={{
              zIndex: isActive ? 50 : 30 - index * 10,
              transform: isActive
                ? "translateZ(110px) scale(1.06)"
                : undefined
            }}
            onClick={() =>
              setPinnedCard((current) => (current === card.id ? null : card.id))
            }
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute -inset-[1px] rounded-[32px] bg-gradient-to-b from-white/10 via-white/0 to-accent/40 opacity-70 blur-lg" />
            
            <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-[#111317] via-[#0b0c12] to-black shadow-[0_30px_90px_rgba(0,0,0,0.45)] floating-card">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 520px"
                priority={index === 0}
              />
              
              <div className={`absolute inset-0 ${imageOverlay}`} />
              
              {/* Scan line effect */}
              <div className="scan-line absolute inset-0" />
              
              {/* Red glow at bottom */}
              <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-accent/60 blur-[90px]" />
              
              {/* Badge */}
              <div className="absolute top-5 left-5">
                <span className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] tracking-[0.2em] uppercase border border-white/10">
                  {card.badge}
                </span>
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 inset-x-0 p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-white/10 border border-white/20 grid place-items-center text-white text-sm hover:bg-accent/80 transition-all duration-300">
                    ▶
                  </span>
                  <div>
                    <p className="text-white text-lg font-semibold">{card.title}</p>
                    <p className="text-white/70 text-sm">{card.mood}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-white/70 text-xs">
                  {card.stats.map((stat) => (
                    <span
                      key={stat}
                      className="px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm"
                    >
                      {stat}
                    </span>
                  ))}
                </div>
                
                <button className="mt-1 w-full rounded-full bg-gradient-to-r from-accent to-red-500 text-white font-semibold py-3 shadow-[0_16px_50px_rgba(229,9,20,0.35)] hover:shadow-[0_20px_60px_rgba(229,9,20,0.5)] hover:scale-[1.02] transition-all duration-300">
                  {card.cta}
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
