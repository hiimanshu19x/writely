'use client';

import { useEffect } from 'react';

export default function PWARegistration() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === 'production' &&
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Writely Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('Writely Service Worker registration failed:', error);
          });
      });
    }

    // Save beforeinstallprompt event for deferred prompt button
    const handleBeforeInstallPrompt = (e: Event) => {
      (window as any).deferredInstallPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return null;
}
