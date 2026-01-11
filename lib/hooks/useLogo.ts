'use client';

import { useState, useEffect } from 'react';

const LOGO_STORAGE_KEY = 'site-logo';
const AI_LOGO_STORAGE_KEY = 'ai-logo';

export interface LogoSettings {
  siteLogo: string | null;
  aiLogo: string | null;
}

export function useLogo() {
  const [logos, setLogos] = useState<LogoSettings>({
    siteLogo: null,
    aiLogo: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load logos from localStorage
    const siteLogo = localStorage.getItem(LOGO_STORAGE_KEY);
    const aiLogo = localStorage.getItem(AI_LOGO_STORAGE_KEY);
    setLogos({
      siteLogo,
      aiLogo,
    });
    setIsLoaded(true);
  }, []);

  const setSiteLogo = (logoData: string | null) => {
    if (logoData) {
      localStorage.setItem(LOGO_STORAGE_KEY, logoData);
    } else {
      localStorage.removeItem(LOGO_STORAGE_KEY);
    }
    setLogos(prev => ({ ...prev, siteLogo: logoData }));
  };

  const setAiLogo = (logoData: string | null) => {
    if (logoData) {
      localStorage.setItem(AI_LOGO_STORAGE_KEY, logoData);
    } else {
      localStorage.removeItem(AI_LOGO_STORAGE_KEY);
    }
    setLogos(prev => ({ ...prev, aiLogo: logoData }));
  };

  return {
    ...logos,
    isLoaded,
    setSiteLogo,
    setAiLogo,
  };
}

// Utility to convert file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
