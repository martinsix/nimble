export interface GameConfig {
  dice: {
    maxCriticalHitsInRow: number;
  };
  combat: {
    criticalHitOnMaxRoll: boolean;
    missOnFirstDieOne: boolean;
  };
  character: {
    attributeRange: {
      min: number;
      max: number;
    };
    skillModifierRange: {
      min: number;
      max: number;
    };
  };
  storage: {
    maxRollHistory: number;
  };
}

export const gameConfig: GameConfig = {
  dice: {
    maxCriticalHitsInRow: 20,
  },
  combat: {
    criticalHitOnMaxRoll: true,
    missOnFirstDieOne: true,
  },
  character: {
    attributeRange: {
      min: -2,
      max: 10,
    },
    skillModifierRange: {
      min: 0,
      max: 20,
    },
  },
  storage: {
    maxRollHistory: 100,
  },
};