'use client';

import { useState, useEffect, useCallback } from 'react';

export interface AIShortcut {
  key: string;
  label: string;
  url: string;
  referralUrl: string;
}

const DEFAULT_SHORTCUTS: AIShortcut[] = [
  { key: 'chatgpt', label: 'ChatGPT', url: 'https://chat.openai.com', referralUrl: '' },
  { key: 'claude', label: 'Claude', url: 'https://claude.ai', referralUrl: '' },
  { key: 'midjourney', label: 'Midjourney', url: 'https://midjourney.com', referralUrl: '' },
  { key: 'runway', label: 'Runway', url: 'https://runway.ml', referralUrl: '' },
];

const STORAGE_KEY = 'ai-shortcuts';

export function useAIShortcuts() {
  const [shortcuts, setShortcuts] = useState<AIShortcut[]>(DEFAULT_SHORTCUTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load shortcuts from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setShortcuts(parsed);
      }
    } catch (error) {
      console.error('Error loading shortcuts:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save shortcuts to localStorage
  const saveShortcuts = useCallback((newShortcuts: AIShortcut[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newShortcuts));
      setShortcuts(newShortcuts);
      return true;
    } catch (error) {
      console.error('Error saving shortcuts:', error);
      return false;
    }
  }, []);

  // Update a single shortcut
  const updateShortcut = useCallback((key: string, updates: Partial<AIShortcut>) => {
    const newShortcuts = shortcuts.map(s =>
      s.key === key ? { ...s, ...updates } : s
    );
    return saveShortcuts(newShortcuts);
  }, [shortcuts, saveShortcuts]);

  // Add a new shortcut
  const addShortcut = useCallback((shortcut: AIShortcut) => {
    const newShortcuts = [...shortcuts, shortcut];
    return saveShortcuts(newShortcuts);
  }, [shortcuts, saveShortcuts]);

  // Remove a shortcut
  const removeShortcut = useCallback((key: string) => {
    const newShortcuts = shortcuts.filter(s => s.key !== key);
    return saveShortcuts(newShortcuts);
  }, [shortcuts, saveShortcuts]);

  // Reset to default
  const resetToDefault = useCallback(() => {
    return saveShortcuts(DEFAULT_SHORTCUTS);
  }, [saveShortcuts]);

  return {
    shortcuts,
    isLoaded,
    saveShortcuts,
    updateShortcut,
    addShortcut,
    removeShortcut,
    resetToDefault,
  };
}

// Export default shortcuts for static use
export { DEFAULT_SHORTCUTS };
