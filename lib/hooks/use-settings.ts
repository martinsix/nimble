import { useLocalStorage } from "./use-local-storage";

export type AppMode = "basic" | "full";

export interface AppSettings {
  mode: AppMode;
  showTooltips: boolean;
  enableAnimations: boolean;
  defaultDiceNotation: string;
  theme: "light" | "dark" | "system";
}

const DEFAULT_SETTINGS: AppSettings = {
  mode: "full",
  showTooltips: true,
  enableAnimations: true,
  defaultDiceNotation: "1d20",
  theme: "system",
};

const SETTINGS_STORAGE_KEY = "nimble-navigator-settings";

/**
 * Custom hook for managing app settings with localStorage persistence
 */
export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    SETTINGS_STORAGE_KEY,
    DEFAULT_SETTINGS
  );

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = {
      ...settings,
      ...newSettings,
    };
    setSettings(updatedSettings);
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}
