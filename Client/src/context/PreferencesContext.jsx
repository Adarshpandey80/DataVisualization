import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "bc_settings";

const defaultSettings = {
  theme: "dark",
  compactMode: false,
  animations: true,
  landingPage: "/home",
  refreshInterval: 60,
};

const PreferencesContext = createContext({
  settings: defaultSettings,
  updateSetting: () => {},
  resetSettings: () => {},
});

const readStoredSettings = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
};

export function PreferencesProvider({ children }) {
  const [settings, setSettings] = useState(readStoredSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const isDark = settings.theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
  }, [settings.theme]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const value = useMemo(
    () => ({ settings, updateSetting, resetSettings }),
    [settings]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
