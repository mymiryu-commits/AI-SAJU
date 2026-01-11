'use client';

import { useState, useEffect } from 'react';

const TOOL_LOGOS_STORAGE_KEY = 'ai-tool-logos';

export interface ToolLogoSettings {
  [toolName: string]: string; // toolName -> base64 image data
}

export function useToolLogos() {
  const [toolLogos, setToolLogos] = useState<ToolLogoSettings>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load tool logos from localStorage
    const stored = localStorage.getItem(TOOL_LOGOS_STORAGE_KEY);
    if (stored) {
      try {
        setToolLogos(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse tool logos:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const setToolLogo = (toolName: string, logoData: string | null) => {
    setToolLogos(prev => {
      const updated = { ...prev };
      if (logoData) {
        updated[toolName] = logoData;
      } else {
        delete updated[toolName];
      }
      localStorage.setItem(TOOL_LOGOS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const getToolLogo = (toolName: string): string | null => {
    return toolLogos[toolName] || null;
  };

  const clearAllToolLogos = () => {
    localStorage.removeItem(TOOL_LOGOS_STORAGE_KEY);
    setToolLogos({});
  };

  return {
    toolLogos,
    isLoaded,
    setToolLogo,
    getToolLogo,
    clearAllToolLogos,
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
