'use client';

import React, { useState, useEffect } from 'react';

// Typewriter component for terminal-like text animation
export const TypewriterText: React.FC<{ text: string; speed?: number }> = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayText}</span>;
};