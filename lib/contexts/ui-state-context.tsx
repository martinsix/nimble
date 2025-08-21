"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { uiStateService, UIState } from '../services/ui-state-service';

export interface UIStateContextValue {
  uiState: UIState;
  updateCollapsibleState: (section: keyof UIState['collapsibleSections'], isOpen: boolean) => Promise<void>;
  updateAdvantageLevel: (advantageLevel: number) => Promise<void>;
}

const UIStateContext = createContext<UIStateContextValue | undefined>(undefined);

export interface UIStateProviderProps {
  children: ReactNode;
}

export function UIStateProvider({ children }: UIStateProviderProps) {
  const [uiState, setUIState] = useState<UIState>({
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
  });

  useEffect(() => {
    const loadUIState = async () => {
      const state = await uiStateService.getUIState();
      setUIState(state);
    };
    loadUIState();
  }, []);

  const updateCollapsibleState = async (section: keyof UIState['collapsibleSections'], isOpen: boolean) => {
    const newUIState = {
      ...uiState,
      collapsibleSections: {
        ...uiState.collapsibleSections,
        [section]: isOpen,
      },
    };
    setUIState(newUIState);
    await uiStateService.saveUIState(newUIState);
  };

  const updateAdvantageLevel = async (advantageLevel: number) => {
    const newUIState = {
      ...uiState,
      advantageLevel,
    };
    setUIState(newUIState);
    await uiStateService.saveUIState(newUIState);
  };

  const value: UIStateContextValue = {
    uiState,
    updateCollapsibleState,
    updateAdvantageLevel,
  };

  return (
    <UIStateContext.Provider value={value}>
      {children}
    </UIStateContext.Provider>
  );
}

export function useUIState(): UIStateContextValue {
  const context = useContext(UIStateContext);
  if (context === undefined) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
}