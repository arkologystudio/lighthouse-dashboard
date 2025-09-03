import React, { useState, useRef } from 'react';

interface LighthouseCTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const LighthouseCTAButton: React.FC<LighthouseCTAButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 50, y: 50 });
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      className={`
        relative overflow-hidden
        px-8 py-4 text-lg font-semibold rounded-xl
        transition-all duration-500 ease-out
        transform hover:scale-105
        shadow-lg hover:shadow-2xl
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
      style={{
        background: `
          linear-gradient(135deg, 
            
            var(--color-navigation-blue) 50%,
            #8B5CF6 100%
          )
        `,
        color: 'white',
        border: 'none',
        boxShadow: isHovered ? 
          '0 20px 40px rgba(59, 130, 246, 0.3), 0 15px 30px rgba(139, 92, 246, 0.2)' : 
          '0 10px 20px rgba(59, 130, 246, 0.2)'
      }}
    >
      {/* Lighthouse beam effect */}
      <div
        className={`
          absolute inset-0 opacity-0 transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background: `radial-gradient(
            circle 120px at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.1) 40%,
            transparent 70%
          )`
        }}
      />
      
      {/* Shimmer effect on hover */}
      <div
        className={`
          absolute inset-0 opacity-0 transition-opacity duration-700
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background: `linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.2) 50%,
            transparent 70%
          )`,
          // transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 1.5s ease-in-out, opacity 0.3s'
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Bottom glow */}
      {/* <div
        className={`
          absolute -bottom-1 left-1/2 transform -translate-x-1/2
          w-3/4 h-1 rounded-full opacity-0 transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
        }}
      /> */}
    </button>
  );
};