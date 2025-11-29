'use client';

import { useRef, useState, MouseEvent, ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  tiltMaxAngle?: number;
  glareEnable?: boolean;
  className?: string;
}

export function TiltCard({ 
  children, 
  tiltMaxAngle = 15,
  glareEnable = true,
  className = '' 
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = ((y - centerY) / centerY) * tiltMaxAngle;
    const tiltY = ((centerX - x) / centerX) * tiltMaxAngle;
    
    setTilt({ x: tiltX, y: tiltY });
    
    if (glareEnable) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlare({ x: glareX, y: glareY, opacity: 0.3 });
    }
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 ? 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
      {glareEnable && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 50%)`,
            transition: glare.opacity === 0 ? 'opacity 0.5s ease' : 'none',
          }}
        />
      )}
    </div>
  );
}

