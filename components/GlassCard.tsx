
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  noPadding?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  interactive = false,
  noPadding = false,
  onClick,
  style
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive || !cardRef.current) return;

    const card = cardRef.current;
    
    // GSAP context for cleanup
    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation based on mouse position relative to center
        // Limit max rotation to 5 degrees for subtlety
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 1000,
          transformStyle: 'preserve-3d',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)'
        });
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, cardRef);

    return () => ctx.revert();
  }, [interactive]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl
        bg-forge-glass backdrop-blur-xl
        border border-forge-border
        shadow-lg
        ${interactive ? 'cursor-pointer' : ''}
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        ...style
      }}
    >
      {/* Glossy sheen overlay */}
      {interactive && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-300 pointer-events-none hover:opacity-100" />
      )}
      {children}
    </div>
  );
};
