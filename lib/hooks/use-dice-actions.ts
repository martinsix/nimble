import { useCallback } from "react";
import { AttributeName, SkillName } from "@/lib/types/character";
import { getDiceService } from "@/lib/services/service-factory";
import { useActivityLog } from "./use-activity-log";

export interface UseDiceActionsReturn {
  rollAttribute: (
    attributeName: AttributeName,
    value: number,
    advantageLevel: number
  ) => Promise<void>;
  rollSave: (
    attributeName: AttributeName,
    value: number,
    advantageLevel: number
  ) => Promise<void>;
  rollSkill: (
    skillName: SkillName,
    attributeValue: number,
    skillModifier: number,
    advantageLevel: number
  ) => Promise<void>;
  attack: (
    weaponName: string,
    damage: string,
    attributeModifier: number,
    advantageLevel: number
  ) => Promise<void>;
  rollInitiative: (
    totalModifier: number,
    advantageLevel: number
  ) => Promise<{ rollTotal: number; actionsGranted: number }>;
}

/**
 * Custom hook that provides direct access to dice rolling functionality.
 * Eliminates the need for React Context by using services directly.
 *
 * Updated to have a cleaner API - no external parameters needed.
 * Consolidated from duplicate implementation in use-dice-service.ts
 */
export function useDiceActions(): UseDiceActionsReturn {
  const diceService = getDiceService();
  const { addLogEntry, createDiceRollEntry, createInitiativeEntry } =
    useActivityLog();

  const rollAttribute = useCallback(
    async (
      attributeName: AttributeName,
      value: number,
      advantageLevel: number
    ) => {
      try {
        const attributeLabel =
          attributeName.charAt(0).toUpperCase() + attributeName.slice(1);
        const rollResult = diceService.rollAttributeCheck(
          value,
          advantageLevel
        );
        const logEntry = createDiceRollEntry(
          rollResult.dice,
          rollResult.droppedDice,
          value,
          rollResult.total,
          `${attributeLabel} check`,
          advantageLevel
        );
        await addLogEntry(logEntry);
      } catch (error) {
        console.error("Failed to roll dice:", error);
      }
    },
    [diceService, createDiceRollEntry, addLogEntry]
  );

  const rollSave = useCallback(
    async (
      attributeName: AttributeName,
      value: number,
      advantageLevel: number
    ) => {
      try {
        const attributeLabel =
          attributeName.charAt(0).toUpperCase() + attributeName.slice(1);
        const rollResult = diceService.rollAttributeCheck(
          value,
          advantageLevel
        );
        const logEntry = createDiceRollEntry(
          rollResult.dice,
          rollResult.droppedDice,
          value,
          rollResult.total,
          `${attributeLabel} save`,
          advantageLevel
        );
        await addLogEntry(logEntry);
      } catch (error) {
        console.error("Failed to roll dice:", error);
      }
    },
    [diceService, createDiceRollEntry, addLogEntry]
  );

  const rollSkill = useCallback(
    async (
      skillName: SkillName,
      attributeValue: number,
      skillModifier: number,
      advantageLevel: number
    ) => {
      try {
        const totalModifier = attributeValue + skillModifier;
        const rollResult = diceService.rollAttributeCheck(
          totalModifier,
          advantageLevel
        );
        const logEntry = createDiceRollEntry(
          rollResult.dice,
          rollResult.droppedDice,
          totalModifier,
          rollResult.total,
          `${skillName} skill check`,
          advantageLevel
        );
        await addLogEntry(logEntry);
      } catch (error) {
        console.error("Failed to roll dice:", error);
      }
    },
    [diceService, createDiceRollEntry, addLogEntry]
  );

  const rollInitiative = useCallback(
    async (totalModifier: number, advantageLevel: number) => {
      try {
        const rollResult = diceService.rollAttributeCheck(
          totalModifier,
          advantageLevel
        );
        const actionsGranted = Math.max(1, rollResult.total);

        const logEntry = createInitiativeEntry(
          rollResult.total,
          actionsGranted
        );
        await addLogEntry(logEntry);

        return { rollTotal: rollResult.total, actionsGranted };
      } catch (error) {
        console.error("Failed to roll initiative:", error);
        return { rollTotal: 1, actionsGranted: 1 };
      }
    },
    [diceService, createInitiativeEntry, addLogEntry]
  );

  const attack = useCallback(
    async (
      weaponName: string,
      damage: string,
      attributeModifier: number,
      advantageLevel: number
    ) => {
      try {
        const rollResult = diceService.rollAttack(
          damage,
          attributeModifier,
          advantageLevel
        );
        const logEntry = createDiceRollEntry(
          rollResult.dice,
          rollResult.droppedDice,
          attributeModifier,
          rollResult.total,
          `${weaponName} attack`,
          advantageLevel,
          rollResult.isMiss,
          rollResult.criticalHits
        );
        await addLogEntry(logEntry);
      } catch (error) {
        console.error("Failed to roll attack:", error);
      }
    },
    [diceService, createDiceRollEntry, addLogEntry]
  );

  return {
    rollAttribute,
    rollSave,
    rollSkill,
    rollInitiative,
    attack,
  };
}
