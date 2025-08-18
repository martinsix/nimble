export interface UIState {
  collapsibleSections: {
    attributes: boolean;
    skills: boolean;
    actions: boolean;
    inventory: boolean;
  };
}

export class UIStateService {
  private readonly storageKey = 'nimble-ui-state';

  async getUIState(): Promise<UIState> {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return this.getDefaultUIState();
    }
    
    try {
      return JSON.parse(stored);
    } catch {
      return this.getDefaultUIState();
    }
  }

  async saveUIState(state: UIState): Promise<void> {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  private getDefaultUIState(): UIState {
    return {
      collapsibleSections: {
        attributes: true,
        skills: true,
        actions: true,
        inventory: true,
      },
    };
  }
}

export const uiStateService = new UIStateService();