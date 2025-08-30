import { Abilities, Ability, ActionAbility, SpellAbility, AbilityRoll, ResourceCost } from '../types/abilities';
import { Character } from '../types/character';
import { ResourceInstance } from '../types/resources';

export class AbilityService {
  
  /**
   * Use an ability and return the updated abilities object
   */
  useAbility(
    abilities: Abilities, 
    abilityId: string, 
    availableActions?: number, 
    inEncounter?: boolean,
    availableResources?: ResourceInstance[],
    variableResourceAmount?: number
  ): { 
    updatedAbilities: Abilities; 
    usedAbility: ActionAbility | SpellAbility | null;
    success: boolean;
    actionsRequired?: number;
    resourceCost?: { resourceId: string; amount: number };
    insufficientResource?: string;
  } {
    const ability = abilities.abilities.find(a => a.id === abilityId);
    
    if (!ability || (ability.type !== 'action' && ability.type !== 'spell')) {
      return { updatedAbilities: abilities, usedAbility: null, success: false };
    }

    const actionCost = ability.actionCost || 0;

    // Check if we have enough actions during encounters
    if (inEncounter && actionCost > 0 && (availableActions || 0) < actionCost) {
      return { 
        updatedAbilities: abilities, 
        usedAbility: null, 
        success: false, 
        actionsRequired: actionCost 
      };
    }

    // Check resource requirements
    if (ability.resourceCost && availableResources) {
      const resourceCost = ability.resourceCost;
      const targetResource = availableResources.find(r => r.definition.id === resourceCost.resourceId);
      
      if (!targetResource) {
        return {
          updatedAbilities: abilities,
          usedAbility: null,
          success: false,
          insufficientResource: resourceCost.resourceId
        };
      }

      let requiredAmount: number;
      if (resourceCost.type === 'fixed') {
        requiredAmount = resourceCost.amount;
      } else {
        // Variable cost - use provided amount or default to minimum
        requiredAmount = variableResourceAmount || resourceCost.minAmount;
        
        // Validate variable amount is within bounds
        if (requiredAmount < resourceCost.minAmount || requiredAmount > resourceCost.maxAmount) {
          return {
            updatedAbilities: abilities,
            usedAbility: null,
            success: false,
            insufficientResource: `Invalid amount: ${requiredAmount} (must be ${resourceCost.minAmount}-${resourceCost.maxAmount})`
          };
        }
      }

      // Check if we have enough of the resource
      if (targetResource.current < requiredAmount) {
        return {
          updatedAbilities: abilities,
          usedAbility: null,
          success: false,
          insufficientResource: targetResource.definition.name
        };
      }
    }

    // Calculate resource cost if present
    let resourceCostInfo: { resourceId: string; amount: number } | undefined;
    if (ability.resourceCost) {
      const resourceCost = ability.resourceCost;
      let requiredAmount: number;
      
      if (resourceCost.type === 'fixed') {
        requiredAmount = resourceCost.amount;
      } else {
        requiredAmount = variableResourceAmount || resourceCost.minAmount;
      }
      
      resourceCostInfo = { resourceId: resourceCost.resourceId, amount: requiredAmount };
    }

    // Spells are always available (like at-will abilities)
    if (ability.type === 'spell') {
      return { 
        updatedAbilities: abilities, 
        usedAbility: ability, 
        success: true, 
        actionsRequired: actionCost,
        resourceCost: resourceCostInfo
      };
    }

    // At-will action abilities can be used if action cost is satisfied
    if (ability.type === 'action' && ability.frequency === 'at_will') {
      return { 
        updatedAbilities: abilities, 
        usedAbility: ability, 
        success: true, 
        actionsRequired: actionCost,
        resourceCost: resourceCostInfo
      };
    }

    // For limited-use action abilities, check uses remaining
    if (ability.type === 'action' && (!ability.currentUses || ability.currentUses <= 0)) {
      return { updatedAbilities: abilities, usedAbility: null, success: false };
    }

    // Update uses for limited-use action abilities
    const updatedAbilities: Abilities = {
      abilities: abilities.abilities.map(a => 
        a.id === abilityId && a.type === 'action'
          ? { ...a, currentUses: (a.currentUses || 1) - 1 }
          : a
      )
    };

    const usedAbility = ability.type === 'action' 
      ? { ...ability, currentUses: (ability.currentUses || 1) - 1 }
      : ability;

    return { 
      updatedAbilities, 
      usedAbility, 
      success: true, 
      actionsRequired: actionCost,
      resourceCost: resourceCostInfo
    };
  }

  /**
   * Reset abilities based on frequency
   */
  resetAbilities(abilities: Abilities, frequency: 'per_turn' | 'per_encounter' | 'per_safe_rest'): Abilities {
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
   * Get all spell abilities
   */
  getSpellAbilities(abilities: Abilities): SpellAbility[] {
    return abilities.abilities.filter(
      (ability): ability is SpellAbility => ability.type === 'spell'
    );
  }

  /**
   * Get all usable abilities (action and spell types)
   */
  getUsableAbilities(abilities: Abilities): (ActionAbility | SpellAbility)[] {
    return abilities.abilities.filter(
      (ability): ability is ActionAbility | SpellAbility => 
        ability.type === 'action' || ability.type === 'spell'
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
    const diceString = `${abilityRoll.dice.count}d${abilityRoll.dice.sides}`;
    const parts: string[] = [diceString];
    
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

}

export const abilityService = new AbilityService();