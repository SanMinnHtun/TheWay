import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/profileService";
import type { AppLanguage } from "../types/profile";
import { translations, type TranslationKey } from "./translations";

const languageStorageKey = "theway.language";

interface I18nContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => Promise<void>;
  t: (key: TranslationKey, variables?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return "en";
  }

  return window.localStorage.getItem(languageStorageKey) === "my" ? "my" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [language, setLanguageState] = useState<AppLanguage>(readStoredLanguage);

  useEffect(() => {
    const profileLanguage = auth.profile?.language;

    if (!profileLanguage || profileLanguage === language) {
      return;
    }

    setLanguageState(profileLanguage);
    window.localStorage.setItem(languageStorageKey, profileLanguage);
  }, [auth.profile?.language, language]);

  const setLanguage = useCallback(
    async (nextLanguage: AppLanguage) => {
      setLanguageState(nextLanguage);
      window.localStorage.setItem(languageStorageKey, nextLanguage);

      if (auth.user && auth.profile && auth.profile.language !== nextLanguage) {
        await updateUserProfile(auth.user.uid, { language: nextLanguage });
        await auth.refreshProfile();
      }
    },
    [auth]
  );

  const t = useCallback(
    (key: TranslationKey, variables: Record<string, string> = {}) => {
      const template = translations[language][key] ?? translations.en[key] ?? key;

      return Object.entries(variables).reduce(
        (current, [name, value]) => current.split(`{${name}}`).join(value),
        template
      );
    },
    [language]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t
    }),
    [language, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
