'use client';

import React, { useState, useEffect } from 'react';
import { ThemeId } from '@/types/note';

interface AppSplashScreenProps {
  currentTheme: ThemeId;
}

export default function AppSplashScreen({ currentTheme }: AppSplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if already launched in this session (optional, but keep it snappy)
    const hasLaunched = sessionStorage.getItem('writely_splash_shown');
    if (hasLaunched) {
      setIsVisible(false);
      return;
    }

    // Begin fade out after 850ms
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 850);

    // Completely unmount after 1250ms
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('writely_splash_shown', 'true');
    }, 1250);

    // Any keypress or click immediately dismisses the splash screen
    const handleQuickDismiss = () => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem('writely_splash_shown', 'true');
      }, 250);
    };

    window.addEventListener('keydown', handleQuickDismiss);
    window.addEventListener('mousedown', handleQuickDismiss);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      window.removeEventListener('keydown', handleQuickDismiss);
      window.removeEventListener('mousedown', handleQuickDismiss);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-app)] select-none transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105 blur-[1px]' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        {/* Glowing Ambient Halo */}
        <div className="relative mb-5 group">
          <div className="absolute -inset-4 rounded-3xl bg-[var(--accent-main)]/20 blur-xl animate-pulse-subtle" />
          
          {/* Signature App Logo Box */}
          <div className="relative w-20 h-20 rounded-3xl bg-[var(--accent-main)] flex items-center justify-center text-[var(--accent-contrast)] font-bold text-3xl shadow-xl shadow-[var(--accent-main)]/25 ring-1 ring-black/10 dark:ring-white/20 transform transition-transform duration-500 hover:scale-105">
            W
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] mb-1">
          Writely
        </h1>

        {/* Subtitle */}
        <p className="text-xs text-[var(--text-muted)] tracking-wide mb-6 font-medium">
          Distraction-free thoughts
        </p>

        {/* Calm breathing progress line */}
        <div className="w-24 h-0.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
          <div className="h-full bg-[var(--accent-main)] rounded-full animate-splash-progress" />
        </div>
      </div>
    </div>
  );
}
