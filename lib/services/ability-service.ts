import { Abilities, Ability, ActionAbility, AbilityRoll } from '../types/abilities';
import { Character } from '../types/character';

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

    // At-will abilities can always be used
    if (ability.frequency === 'at_will') {
      return { updatedAbilities: abilities, usedAbility: ability, success: true };
    }

    // For limited-use abilities, check uses remaining
    if (!ability.currentUses || ability.currentUses <= 0) {
      return { updatedAbilities: abilities, usedAbility: null, success: false };
    }

    const updatedAbilities: Abilities = {
      abilities: abilities.abilities.map(a => 
        a.id === abilityId && a.type === 'action'
          ? { ...a, currentUses: (a.currentUses || 1) - 1 }
          : a
      )
    };

    const usedAbility = { ...ability, currentUses: (ability.currentUses || 1) - 1 };

    return { updatedAbilities, usedAbility, success: true };
  }

  /**
   * Reset abilities based on frequency
   */
  resetAbilities(abilities: Abilities, frequency: 'per_turn' | 'per_encounter'): Abilities {
    return {
      abilities: abilities.abilities.map(ability => {
        if (ability.type === 'action' && ability.frequency === frequency && ability.maxUses) {
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
   * Calculate the total modifier for an ability roll
   */
  calculateAbilityRollModifier(abilityRoll: AbilityRoll, character: Character): number {
    let totalModifier = abilityRoll.modifier || 0;
    
    if (abilityRoll.attribute) {
      totalModifier += character.attributes[abilityRoll.attribute];
    }
    
    return totalModifier;
  }

  /**
   * Get ability roll description for display
   */
  getAbilityRollDescription(abilityRoll: AbilityRoll, character: Character): string {
    const parts: string[] = [abilityRoll.dice];
    
    if (abilityRoll.modifier) {
      parts.push(abilityRoll.modifier > 0 ? `+${abilityRoll.modifier}` : `${abilityRoll.modifier}`);
    }
    
    if (abilityRoll.attribute) {
      const attributeValue = character.attributes[abilityRoll.attribute];
      const attributeName = abilityRoll.attribute.charAt(0).toUpperCase() + abilityRoll.attribute.slice(1, 3);
      parts.push(attributeValue >= 0 ? `+${attributeValue} ${attributeName}` : `${attributeValue} ${attributeName}`);
    }
    
    return parts.join(' ');
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