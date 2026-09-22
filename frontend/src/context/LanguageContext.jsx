import React, { createContext, useContext, useEffect, useState } from "react";
import { UI_TRANSLATIONS } from "../data/uiTranslation";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("bis-language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("bis-language", language);
  }, [language]);

  const translations =
    UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const changeLanguage = (newLanguage) => {
    if (!UI_TRANSLATIONS[newLanguage]) {
      console.warn(`Unsupported language: ${newLanguage}`);
      return;
    }

    setLanguage(newLanguage);
  };

  const t = (key) => {
    return translations[key] || UI_TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}