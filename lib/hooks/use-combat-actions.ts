import { useMemo } from 'react';
import { Character, ActionTracker } from '@/lib/types/character';
import { Abilities } from '@/lib/types/abilities';
import { LogEntry } from '@/lib/types/log-entries';
import { getDiceService, getActivityLog, getAbilityService, getCharacterStorage } from '@/lib/services/service-factory';

export interface UseCombatActionsReturn {
  handleUpdateActions: (character: Character, actionTracker: ActionTracker) => Promise<void>;
  handleEndEncounter: (character: Character, onCharacterUpdate: (character: Character) => void) => Promise<void>;
  handleUpdateAbilities: (character: Character, abilities: Abilities) => Promise<void>;
  handleEndTurn: (character: Character, actionTracker: ActionTracker, abilities: Abilities, onCharacterUpdate: (character: Character) => void) => Promise<void>;
  handleUseAbility: (character: Character, abilityId: string, onCharacterUpdate: (character: Character) => void, addLogEntry: (entry: LogEntry) => void) => Promise<void>;
  handleCatchBreath: (character: Character, onCharacterUpdate: (character: Character) => void, addLogEntry: (entry: LogEntry) => void) => Promise<void>;
  handleMakeCamp: (character: Character, onCharacterUpdate: (character: Character) => void, addLogEntry: (entry: LogEntry) => void) => Promise<void>;
  handleSafeRest: (character: Character, onCharacterUpdate: (character: Character) => void, addLogEntry: (entry: LogEntry) => void) => Promise<void>;
}

export function useCombatActions(): UseCombatActionsReturn {
  // Get services from factory (memoized)
  const diceService = useMemo(() => getDiceService(), []);
  const activityLogService = useMemo(() => getActivityLog(), []);
  const abilityService = useMemo(() => getAbilityService(), []);
  const characterStorage = useMemo(() => getCharacterStorage(), []);
  const handleUpdateActions = async (character: Character, actionTracker: ActionTracker) => {
    if (!character) return;
    const updatedCharacter = { ...character, actionTracker };
    try {
      await characterStorage.updateCharacter(updatedCharacter);
    } catch (error) {
      console.error("Failed to update action tracker:", error);
    }
  };

  const handleEndEncounter = async (character: Character, onCharacterUpdate: (character: Character) => void) => {
    if (!character) return;
    // Reset both per-encounter and per-turn abilities when encounter ends
    let resetAbilities = abilityService.resetAbilities(character.abilities, 'per_encounter');
    resetAbilities = abilityService.resetAbilities(resetAbilities, 'per_turn');

    const updatedCharacter = {
      ...character,
      inEncounter: false,
      actionTracker: {
        ...character.actionTracker,
        current: character.actionTracker.base,
        bonus: 0
      },
      abilities: resetAbilities
    };
    onCharacterUpdate(updatedCharacter);
    try {
      await characterStorage.updateCharacter(updatedCharacter);
    } catch (error) {
      console.error("Failed to end encounter:", error);
    }
  };

  const handleUpdateAbilities = async (character: Character, abilities: Abilities) => {
    if (!character) return;
    const updatedCharacter = { ...character, abilities };
    try {
      await characterStorage.updateCharacter(updatedCharacter);
    } catch (error) {
      console.error("Failed to update abilities:", error);
    }
  };

  const handleEndTurn = async (character: Character, actionTracker: ActionTracker, abilities: Abilities, onCharacterUpdate: (character: Character) => void) => {
    if (!character) return;
    // Reset per-turn abilities using ability service
    const resetAbilities = abilityService.resetAbilities(abilities, 'per_turn');
    
    const updatedCharacter = { 
      ...character, 
      actionTracker: {
        ...actionTracker,
        current: actionTracker.base,
        bonus: 0
      }, 
      abilities: resetAbilities 
    };
    onCharacterUpdate(updatedCharacter);
    try {
      await characterStorage.updateCharacter(updatedCharacter);
    } catch (error) {
      console.error("Failed to end turn:", error);
    }
  };

  const handleUseAbility = async (character: Character, abilityId: string, onCharacterUpdate: (character: Character) => void, addLogEntry: (entry: LogEntry) => void) => {
    if (!character) return;
    try {
      const result = abilityService.useAbility(character.abilities, abilityId);
      
      if (!result.success || !result.usedAbility) {
        console.error("Failed to use ability: ability not found or no uses remaining");
        return;
      }

      // Update character with new abilities state
      const updatedCharacter = { ...character, abilities: result.updatedAbilities };
      onCharacterUpdate(updatedCharacter);
      await characterStorage.updateCharacter(updatedCharacter);

      // Log the ability usage
      const logEntry = activityLogService.createAbilityUsageEntry(
        result.usedAbility.name,
        result.usedAbility.frequency,
        result.usedAbility.currentUses || 0,
        result.usedAbility.maxUses || 0
      );
      await addLogEntry(logEntry);

      // Handle ability roll if it has one
      if (result.usedAbility.roll) {
        const roll = result.usedAbility.roll;
        const totalModifier = abilityService.calculateAbilityRollModifier(roll, character);
        
        // Use the dice service to perform the roll
        const rollResult = diceService.rollAttack(roll.dice, totalModifier, 0);
        const rollLogEntry = activityLogService.createDiceRollEntry(
          rollResult.dice,
          rollResult.droppedDice,
          totalModifier,
          rollResult.total,
          `${result.usedAbility.name} ability roll`,
          0 // No advantage for ability rolls by default
        );
        await addLogEntry(rollLogEntry);
      }
    } catch (error) {
      console.error("Failed to use ability:", error);
    }
  };

  const handleCatchBreath = async (character: Character, onCharacterUpdate: (character: Character) => void, addLogEntry: (entry: LogEntry) => void) => {
    if (!character) return;
    try {
      if (character.hitDice.current <= 0) {
        console.error("No hit dice available");
        return;
      }

      // Roll the hit die
      const hitDieRoll = diceService.rollAttack(`1d${character.hitDice.size}`, 0, 0);
      
      // Log the hit die roll
      const rollLogEntry = activityLogService.createDiceRollEntry(
        hitDieRoll.dice,
        hitDieRoll.droppedDice,
        0,
        hitDieRoll.total,
        `Catching Breath - Hit Die (d${character.hitDice.size})`,
        0
      );
      await activityLogService.addLogEntry(rollLogEntry);
      addLogEntry(rollLogEntry);

      // Calculate healing (hit die roll + strength modifier, minimum 1)
      const strengthModifier = character.attributes.strength;
      const healingAmount = Math.max(1, hitDieRoll.total + strengthModifier);
      
      // Apply healing
      const newCurrentHp = Math.min(character.hitPoints.max, character.hitPoints.current + healingAmount);
      
      // Consume the hit die and update character
      const updatedCharacter = {
        ...character,
        hitPoints: {
          ...character.hitPoints,
          current: newCurrentHp,
        },
        hitDice: {
          ...character.hitDice,
          current: character.hitDice.current - 1,
        },
      };
      
      onCharacterUpdate(updatedCharacter);
      await characterStorage.updateCharacter(updatedCharacter);

      // Log the healing
      if (healingAmount > 0) {
        const healingLogEntry = activityLogService.createHealingEntry(healingAmount);
        await addLogEntry(healingLogEntry);
      }
    } catch (error) {
      console.error("Failed to catch breath:", error);
    }
  };

  const handleMakeCamp = async (character: Character, onCharacterUpdate: (character: Character) => void, addLogEntry: (entry: LogEntry) => void) => {
    if (!character) return;
    try {
      if (character.hitDice.current <= 0) {
        console.error("No hit dice available");
        return;
      }

      // Use maximum value of hit die (no roll)
      const maxHitDieValue = character.hitDice.size;
      
      // Log the field rest activity
      const restLogEntry = activityLogService.createDiceRollEntry(
        [], // No dice rolled
        undefined,
        0,
        maxHitDieValue,
        `Making Camp - Max Hit Die (d${character.hitDice.size})`,
        0
      );
      await addLogEntry(restLogEntry);

      // Calculate healing (max hit die value + strength modifier, minimum 1)
      const strengthModifier = character.attributes.strength;
      const healingAmount = Math.max(1, maxHitDieValue + strengthModifier);
      
      // Apply healing
      const newCurrentHp = Math.min(character.hitPoints.max, character.hitPoints.current + healingAmount);
      
      // Consume the hit die and update character
      const updatedCharacter = {
        ...character,
        hitPoints: {
          ...character.hitPoints,
          current: newCurrentHp,
        },
        hitDice: {
          ...character.hitDice,
          current: character.hitDice.current - 1,
        },
      };
      
      onCharacterUpdate(updatedCharacter);
      await characterStorage.updateCharacter(updatedCharacter);

      // Log the healing
      if (healingAmount > 0) {
        const healingLogEntry = activityLogService.createHealingEntry(healingAmount);
        await addLogEntry(healingLogEntry);
      }
    } catch (error) {
      console.error("Failed to make camp:", error);
    }
  };

  const handleSafeRest = async (character: Character, onCharacterUpdate: (character: Character) => void, addLogEntry: (entry: LogEntry) => void) => {
    if (!character) return;
    try {
      // Reset all abilities (safe rest resets everything)
      let resetAbilities = abilityService.resetAbilities(character.abilities, 'per_turn');
      resetAbilities = abilityService.resetAbilities(resetAbilities, 'per_encounter');
      resetAbilities = abilityService.resetAbilities(resetAbilities, 'per_safe_rest');
      // Note: At-will abilities don't need resetting as they have unlimited uses

      // Create updated character with full restoration
      const updatedCharacter = {
        ...character,
        hitPoints: {
          ...character.hitPoints,
          current: character.hitPoints.max, // Full HP restoration
          temporary: 0, // Clear temporary HP
        },
        hitDice: {
          ...character.hitDice,
          current: character.hitDice.max, // Restore all hit dice
        },
        wounds: {
          ...character.wounds,
          current: Math.max(0, character.wounds.current - 1), // Remove one wound
        },
        abilities: resetAbilities,
        inEncounter: false, // Safe rest ends any encounter
        actionTracker: {
          ...character.actionTracker,
          current: character.actionTracker.base,
          bonus: 0,
        },
      };

      onCharacterUpdate(updatedCharacter);
      await characterStorage.updateCharacter(updatedCharacter);

      // Calculate what was restored for logging
      const healingAmount = character.hitPoints.max - character.hitPoints.current;
      const hitDiceRestored = character.hitDice.max - character.hitDice.current;
      const woundsRemoved = character.wounds.current > 0 ? 1 : 0;
      const abilitiesReset = character.abilities.abilities.filter(ability => 
        ability.type === 'action' && 
        ability.frequency !== 'at_will' && 
        ability.currentUses !== ability.maxUses
      ).length;

      // Log the safe rest with proper entry type
      const restLogEntry = activityLogService.createSafeRestEntry(
        healingAmount,
        hitDiceRestored,
        woundsRemoved,
        abilitiesReset
      );
      await addLogEntry(restLogEntry);
    } catch (error) {
      console.error("Failed to perform safe rest:", error);
    }
  };

  return {
    handleUpdateActions,
    handleEndEncounter,
    handleUpdateAbilities,
    handleEndTurn,
    handleUseAbility,
    handleCatchBreath,
    handleMakeCamp,
    handleSafeRest,
  };
}