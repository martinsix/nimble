import { useMemo } from 'react';
import { Character, AttributeName, SkillName, ActionTracker } from '@/lib/types/character';
import { Abilities } from '@/lib/types/abilities';
import { LogEntry } from '@/lib/types/log-entries';
import { getDiceService, getActivityLog, getAbilityService, getCharacterStorage } from '@/lib/services/service-factory';

export interface UseDiceActionsReturn {
  handleRollAttribute: (attributeName: AttributeName, value: number, advantageLevel: number) => Promise<void>;
  handleRollSave: (attributeName: AttributeName, value: number, advantageLevel: number) => Promise<void>;
  handleRollSkill: (character: Character, skillName: SkillName, attributeValue: number, skillModifier: number, advantageLevel: number) => Promise<void>;
  handleAttack: (weaponName: string, damage: string, attributeModifier: number, advantageLevel: number) => Promise<void>;
  handleRollInitiative: (character: Character, totalModifier: number, advantageLevel: number, onCharacterUpdate: (character: Character) => void) => Promise<void>;
}

export function useDiceActions(addLogEntry: (entry: LogEntry) => void): UseDiceActionsReturn {
  // Get services from factory (memoized)
  const diceService = useMemo(() => getDiceService(), []);
  const activityLogService = useMemo(() => getActivityLog(), []);
  const abilityService = useMemo(() => getAbilityService(), []);
  const characterStorage = useMemo(() => getCharacterStorage(), []);
  const handleRollAttribute = async (attributeName: AttributeName, value: number, advantageLevel: number) => {
    try {
      const attributeLabel = attributeName.charAt(0).toUpperCase() + attributeName.slice(1);
      const rollResult = diceService.rollAttributeCheck(value, advantageLevel);
      const logEntry = activityLogService.createDiceRollEntry(
        rollResult.dice,
        rollResult.droppedDice,
        value,
        rollResult.total,
        `${attributeLabel} check`,
        advantageLevel
      );
      await activityLogService.addLogEntry(logEntry);
      addLogEntry(logEntry);
    } catch (error) {
      console.error("Failed to roll dice:", error);
    }
  };

  const handleRollSave = async (attributeName: AttributeName, value: number, advantageLevel: number) => {
    try {
      const attributeLabel = attributeName.charAt(0).toUpperCase() + attributeName.slice(1);
      const rollResult = diceService.rollAttributeCheck(value, advantageLevel);
      const logEntry = activityLogService.createDiceRollEntry(
        rollResult.dice,
        rollResult.droppedDice,
        value,
        rollResult.total,
        `${attributeLabel} save`,
        advantageLevel
      );
      await activityLogService.addLogEntry(logEntry);
      addLogEntry(logEntry);
    } catch (error) {
      console.error("Failed to roll save:", error);
    }
  };

  const handleRollSkill = async (character: Character, skillName: SkillName, attributeValue: number, skillModifier: number, advantageLevel: number) => {
    if (!character) return;
    try {
      const skill = character.skills[skillName];
      const totalModifier = attributeValue + skillModifier;
      const rollResult = diceService.rollAttributeCheck(totalModifier, advantageLevel);
      const logEntry = activityLogService.createDiceRollEntry(
        rollResult.dice,
        rollResult.droppedDice,
        totalModifier,
        rollResult.total,
        skill.name,
        advantageLevel
      );
      await activityLogService.addLogEntry(logEntry);
      addLogEntry(logEntry);
    } catch (error) {
      console.error("Failed to roll skill:", error);
    }
  };

  const handleAttack = async (weaponName: string, damage: string, attributeModifier: number, advantageLevel: number) => {
    try {
      const rollResult = diceService.rollAttack(damage, attributeModifier, advantageLevel);
      const logEntry = activityLogService.createDiceRollEntry(
        rollResult.dice,
        rollResult.droppedDice,
        attributeModifier,
        rollResult.total,
        `${weaponName} attack`,
        advantageLevel,
        rollResult.isMiss,
        rollResult.criticalHits
      );
      await activityLogService.addLogEntry(logEntry);
      addLogEntry(logEntry);
    } catch (error) {
      console.error("Failed to roll attack:", error);
    }
  };

  const handleRollInitiative = async (character: Character, totalModifier: number, advantageLevel: number, onCharacterUpdate: (character: Character) => void) => {
    if (!character) return;
    try {
      // Roll initiative
      const rollResult = diceService.rollAttributeCheck(totalModifier, advantageLevel);
      const rollLogEntry = activityLogService.createDiceRollEntry(
        rollResult.dice,
        rollResult.droppedDice,
        totalModifier,
        rollResult.total,
        "Initiative",
        advantageLevel
      );
      await activityLogService.addLogEntry(rollLogEntry);
      addLogEntry(rollLogEntry);

      // Calculate actions granted and create initiative entry
      const actionsGranted = abilityService.calculateInitiativeActions(rollResult.total, character.actionTracker.bonus);
      const initiativeLogEntry = activityLogService.createInitiativeEntry(rollResult.total, actionsGranted);
      await activityLogService.addLogEntry(initiativeLogEntry);
      addLogEntry(initiativeLogEntry);
      
      // Update character's action tracker and start encounter
      const updatedCharacter = {
        ...character,
        actionTracker: {
          ...character.actionTracker,
          current: actionsGranted,
        },
        inEncounter: true
      };
      onCharacterUpdate(updatedCharacter);
      await characterStorage.updateCharacter(updatedCharacter);
    } catch (error) {
      console.error("Failed to roll initiative:", error);
    }
  };

  return {
    handleRollAttribute,
    handleRollSave,
    handleRollSkill,
    handleAttack,
    handleRollInitiative,
  };
}