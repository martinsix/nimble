import { useUIState } from "./use-ui-state";

/**
 * Custom hook that provides direct access to UI state with automatic re-rendering.
 * This is a wrapper around useUIState for backward compatibility.
 */
export function useUIStateService() {
  const {
    uiState,
    updateCollapsibleState,
    updateAdvantageLevel,
    updateActiveTab,
  } = useUIState();

  return {
    // State
    uiState,

    // Methods
    updateCollapsibleState,
    updateAdvantageLevel,
    updateActiveTab,
  };
}
