export interface UIState {
  collapsibleSections: {
    hitPoints: boolean;
    hitDice: boolean;
    wounds: boolean;
    initiative: boolean;
    actionTracker: boolean;
    attributes: boolean;
    skills: boolean;
    actions: boolean;
    armor: boolean;
    abilities: boolean;
    inventory: boolean;
  };
  advantageLevel: number; // Positive for advantage, negative for disadvantage, 0 for normal
}

export class UIStateService {
  private readonly storageKey = 'nimble-navigator-ui-state';

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
        hitDice: true,
        wounds: true,
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
    };
  }
}

export const uiStateService = new UIStateService();