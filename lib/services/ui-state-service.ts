export interface UIState {
  collapsibleSections: {
    hitPoints: boolean;
    initiative: boolean;
    attributes: boolean;
    skills: boolean;
    actions: boolean;
    inventory: boolean;
    armor: boolean;
  };
  advantageLevel: number; // Positive for advantage, negative for disadvantage, 0 for normal
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
        hitPoints: true,
        initiative: true,
        attributes: true,
        skills: true,
        actions: true,
        inventory: true,
        armor: true,
      },
      advantageLevel: 0,
    };
  }
}

export const uiStateService = new UIStateService();