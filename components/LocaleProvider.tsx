"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Locale } from "@/types/data";
import { STRINGS, type StringKey, pickLocalized } from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: StringKey) => string;
  tr: <T>(en: T, vi?: T) => T;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);
const STORAGE_KEY = "bistro-sapa-locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as Locale | null;
    if (saved === "en" || saved === "vi") {
      setLocaleState(saved);
      return;
    }
    if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("vi")) {
      setLocaleState("vi");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((key: StringKey) => STRINGS[locale][key] ?? STRINGS.en[key], [locale]);
  const tr = useCallback(
    <T,>(en: T, vi?: T) => pickLocalized(en, vi, locale),
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, tr }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}
