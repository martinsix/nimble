import { Abilities, Ability, ActionAbility } from '../types/abilities';

export class AbilityService {
  
  /**
   * Use an ability and return the updated abilities object
   */
  useAbility(abilities: Abilities, abilityId: string): { 
    updatedAbilities: Abilities; 
    usedAbility: ActionAbility | null;
    success: boolean;
  } {
    const ability = abilities.abilities.find(a => a.id === abilityId);
    
    if (!ability || ability.type !== 'action') {
      return { updatedAbilities: abilities, usedAbility: null, success: false };
    }

    if (ability.currentUses <= 0) {
      return { updatedAbilities: abilities, usedAbility: null, success: false };
    }

    const updatedAbilities: Abilities = {
      abilities: abilities.abilities.map(a => 
        a.id === abilityId && a.type === 'action'
          ? { ...a, currentUses: a.currentUses - 1 }
          : a
      )
    };

    const usedAbility = { ...ability, currentUses: ability.currentUses - 1 };

    return { updatedAbilities, usedAbility, success: true };
  }

  /**
   * Reset abilities based on frequency
   */
  resetAbilities(abilities: Abilities, frequency: 'per_turn' | 'per_encounter'): Abilities {
    return {
      abilities: abilities.abilities.map(ability => {
        if (ability.type === 'action' && ability.frequency === frequency) {
          return { ...ability, currentUses: ability.maxUses };
        }
        return ability;
      })
    };
  }

  /**
   * Add a new ability to the abilities collection
   */
  addAbility(abilities: Abilities, newAbility: Ability): Abilities {
    return {
      abilities: [...abilities.abilities, newAbility]
    };
  }

  /**
   * Remove an ability from the abilities collection
   */
  removeAbility(abilities: Abilities, abilityId: string): Abilities {
    return {
      abilities: abilities.abilities.filter(ability => ability.id !== abilityId)
    };
  }

  /**
   * Update an existing ability
   */
  updateAbility(abilities: Abilities, updatedAbility: Ability): Abilities {
    return {
      abilities: abilities.abilities.map(ability => 
        ability.id === updatedAbility.id ? updatedAbility : ability
      )
    };
  }

  /**
   * Get all action abilities (filtered from freeform)
   */
  getActionAbilities(abilities: Abilities): ActionAbility[] {
    return abilities.abilities.filter(
      (ability): ability is ActionAbility => ability.type === 'action'
    );
  }

  /**
   * Calculate initiative actions based on roll total
   */
  calculateInitiativeActions(initiativeTotal: number, bonusActions: number = 0): number {
    let baseActions: number;
    
    if (initiativeTotal < 10) {
      baseActions = 1;
    } else if (initiativeTotal < 20) {
      baseActions = 2;
    } else {
      baseActions = 3;
    }

    return baseActions + bonusActions;
  }
}

export const abilityService = new AbilityService();