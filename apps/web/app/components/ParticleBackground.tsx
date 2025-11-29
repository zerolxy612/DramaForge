"use client";

import { useEffect, useRef } from "react";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    window.addEventListener("pointermove", handlePointerMove);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
      drift: number;
      pulse: number;
    }> = [];

    // Create particles (增加数量以获得更丰富的效果)
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 2.5 + 1,
        opacity: Math.random() * 0.6 + 0.3,
        hue: 350 + Math.random() * 40,
        drift: (Math.random() - 0.5) * 0.3,
        pulse: Math.random() * Math.PI * 2
      });
    }

    const comets: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
    }> = [];

    let animationFrame: number;

    const animate = () => {
      ctx.fillStyle = "rgba(5, 6, 10, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.pulse += 0.01;
        const pulseScale = 0.6 + Math.sin(particle.pulse * Math.PI) * 0.3;
        const dxPointer = pointer.x - particle.x;
        const dyPointer = pointer.y - particle.y;
        const distPointer = Math.max(Math.hypot(dxPointer, dyPointer), 1);
        const attraction = Math.min(140 / distPointer, 0.9);

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx += (dxPointer / distPointer) * 0.02 * attraction;
        particle.vy += (dyPointer / distPointer) * 0.02 * attraction;
        particle.vx += particle.drift * 0.12;
        particle.vy -= particle.drift * 0.1;
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 90%, 56%, ${particle.opacity})`;
        ctx.fill();

        // Draw connections (增强连线效果)
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
            const opacity = 0.12 * (1 - distance / 180);
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);

            // 创建渐变连线
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y,
              otherParticle.x, otherParticle.y
            );
            gradient.addColorStop(0, `rgba(229, 9, 20, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(229, 9, 20, ${opacity})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });

        // 鼠标交互连线（增强效果）
        if (distPointer < 280) {
          const interactionOpacity = 0.08 + 0.25 * (1 - distPointer / 280);
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(pointer.x, pointer.y);

          const gradient = ctx.createLinearGradient(
            particle.x, particle.y,
            pointer.x, pointer.y
          );
          gradient.addColorStop(0, `rgba(229, 9, 20, ${interactionOpacity * 0.5})`);
          gradient.addColorStop(1, `rgba(229, 9, 20, ${interactionOpacity})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.stroke();

          // 在鼠标附近添加光晕效果
          if (distPointer < 100) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(229, 9, 20, ${0.15 * (1 - distPointer / 100)})`;
            ctx.fill();
          }
        }
      });

      if (comets.length < 6 && Math.random() < 0.05) {
        const angle = Math.random() * Math.PI * 2;
        comets.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.cos(angle) * (3 + Math.random() * 2),
          vy: Math.sin(angle) * (3 + Math.random() * 2),
          life: 1
        });
      }

      comets.forEach((comet, index) => {
        comet.x += comet.vx;
        comet.y += comet.vy;
        comet.life -= 0.01;

        const gradient = ctx.createLinearGradient(
          comet.x,
          comet.y,
          comet.x - comet.vx * 8,
          comet.y - comet.vy * 8
        );
        gradient.addColorStop(0, "rgba(255,255,255,0.4)");
        gradient.addColorStop(1, "rgba(229,9,20,0)");

        ctx.beginPath();
        ctx.moveTo(comet.x, comet.y);
        ctx.lineTo(comet.x - comet.vx * 12, comet.y - comet.vy * 12);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();

        if (comet.life <= 0) {
          comets.splice(index, 1);
        } else if (
          comet.x < -20 ||
          comet.x > canvas.width + 20 ||
          comet.y < -20 ||
          comet.y > canvas.height + 20
        ) {
          comets.splice(index, 1);
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-40"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
