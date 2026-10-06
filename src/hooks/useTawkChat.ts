import { useCallback, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

export function useTawkChat() {
  const { settings } = useApp();
  const isLoadingRef = useRef(false);
  const isLoadedRef = useRef(false);

  // Use dynamic ID from WP API, fallback to default
  const TAWK_PROPERTY_ID = settings?.api?.tawkto_id || '6ac209a442308034c24f8c64';
  const TAWK_WIDGET_ID = '1k42vbbms';

  const openChat = useCallback(() => {
    const w = window as any;

    if (isLoadedRef.current && w.Tawk_API?.toggle) {
      w.Tawk_API.toggle();
      return;
    }

    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    w.Tawk_API = w.Tawk_API || {};
    w.Tawk_LoadStart = new Date();

    w.Tawk_API.onLoad = () => {
      isLoadedRef.current = true;
      isLoadingRef.current = false;
      if (w.Tawk_API?.maximize) {
        w.Tawk_API.maximize();
      }
    };

    const script = document.createElement('script');
    script.async = true;
    
    let src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    if (TAWK_PROPERTY_ID.includes('embed.tawk.to')) {
        src = TAWK_PROPERTY_ID;
    } else if (TAWK_PROPERTY_ID.includes('/')) {
        src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}`;
    }
    
    script.src = src;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    script.onerror = () => {
      isLoadingRef.current = false;
      console.warn('[Tawk.to] Failed to load chat widget.');
    };

    document.head.appendChild(script);
  }, [TAWK_PROPERTY_ID]);

  return { openChat, toggleChat: openChat };
}
