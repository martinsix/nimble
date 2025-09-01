import { useState, useEffect } from "react";
import { useLocalStorage } from "./use-local-storage";

type TabType =
  | "combat"
  | "skills"
  | "character"
  | "equipment"
  | "spells"
  | "log";

export interface UIState {
  collapsibleSections: {
    classInfo: boolean;
    classFeatures: boolean;
    hitPoints: boolean;
    hitDice: boolean;
    wounds: boolean;
    resources: boolean;
    initiative: boolean;
    actionTracker: boolean;
    attributes: boolean;
    skills: boolean;
    actions: boolean;
    armor: boolean;
    abilities: boolean;
    inventory: boolean;
  };
  advantageLevel: number;
  activeTab: TabType;
}

const DEFAULT_UI_STATE: UIState = {
  collapsibleSections: {
    classInfo: true,
    classFeatures: true,
    hitPoints: true,
    hitDice: true,
    wounds: true,
    resources: true,
    initiative: true,
    actionTracker: true,
    attributes: true,
    skills: true,
    actions: true,
    armor: true,
    abilities: true,
    inventory: true,
  },
  advantageLevel: 0,
  activeTab: "combat",
};

const UI_STATE_STORAGE_KEY = "nimble-navigator-ui-state";

/**
 * Custom hook for managing UI state with localStorage persistence
 */
export function useUIState() {
  const [uiState, setUIState] = useLocalStorage<UIState>(
    UI_STATE_STORAGE_KEY,
    DEFAULT_UI_STATE
  );
  const [listeners, setListeners] = useState<((state: UIState) => void)[]>([]);

  // Notify all listeners when state changes
  const notifyListeners = (state: UIState) => {
    listeners.forEach((listener) => listener(state));
  };

  // Subscribe to UI state changes
  const subscribeToUIState = (listener: (state: UIState) => void) => {
    setListeners((prev) => [...prev, listener]);

    // Return unsubscribe function
    return () => {
      setListeners((prev) => prev.filter((l) => l !== listener));
    };
  };

  // Update a specific collapsible section state
  const updateCollapsibleState = (
    section: keyof UIState["collapsibleSections"],
    isOpen: boolean
  ) => {
    const newState = {
      ...uiState,
      collapsibleSections: {
        ...uiState.collapsibleSections,
        [section]: isOpen,
      },
    };
    setUIState(newState);
    notifyListeners(newState);
  };

  // Update advantage level
  const updateAdvantageLevel = (level: number) => {
    const newState = {
      ...uiState,
      advantageLevel: level,
    };
    setUIState(newState);
    notifyListeners(newState);
  };

  // Update active tab
  const updateActiveTab = (tab: TabType) => {
    const newState = {
      ...uiState,
      activeTab: tab,
    };
    setUIState(newState);
    notifyListeners(newState);
  };

  return {
    uiState,
    subscribeToUIState,
    updateCollapsibleState,
    updateAdvantageLevel,
    updateActiveTab,
  };
}
