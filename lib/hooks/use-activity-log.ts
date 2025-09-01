import { useLocalStorage } from "./use-local-storage";
import { toast } from "sonner";
import {
  LogEntry,
  DiceRollEntry,
  DamageEntry,
  HealingEntry,
  TempHPEntry,
  InitiativeEntry,
  AbilityUsageEntry,
  SafeRestEntry,
  CatchBreathEntry,
  MakeCampEntry,
  ResourceUsageEntry,
  SpellCastEntry,
  ItemConsumptionEntry,
} from "@/lib/types/log-entries";

const ACTIVITY_LOG_STORAGE_KEY = "nimble-navigator-activity-log";
const MAX_LOG_ENTRIES = 100;

/**
 * Custom hook for managing activity logs with localStorage persistence
 */
export function useActivityLog() {
  const [logEntries, setLogEntries] = useLocalStorage<LogEntry[]>(
    ACTIVITY_LOG_STORAGE_KEY,
    []
  );

  const addLogEntry = (entry: LogEntry) => {
    // Add id and timestamp if not provided
    const newEntry: LogEntry = {
      ...entry,
      id: entry.id || Date.now().toString(),
      timestamp: entry.timestamp || new Date(),
    };

    setLogEntries((prev) => {
      const updatedEntries = [newEntry, ...prev].slice(0, MAX_LOG_ENTRIES);
      return updatedEntries;
    });

    // Show toast notification
    showToastForLogEntry(newEntry);
  };

  const showToastForLogEntry = (entry: LogEntry): void => {
    const { description } = entry;

    switch (entry.type) {
      case "roll":
        const rollEntry = entry as DiceRollEntry;
        const resultText = `${description}: ${rollEntry.total}`;
        if (rollEntry.isMiss) {
          toast.error(resultText, { description: "Critical miss!" });
        } else if (rollEntry.criticalHits && rollEntry.criticalHits > 0) {
          toast.success(resultText, {
            description: `${rollEntry.criticalHits} critical hit${
              rollEntry.criticalHits > 1 ? "s" : ""
            }!`,
          });
        } else {
          toast.info(resultText);
        }
        break;

      case "damage":
        toast.error(description);
        break;

      case "healing":
        toast.success(description);
        break;

      case "temp_hp":
        toast.info(description);
        break;

      case "initiative":
        toast.info(description);
        break;

      case "ability_usage":
        toast.info(description);
        break;

      case "safe_rest":
        toast.success(description);
        break;

      case "resource":
        const resourceEntry = entry as ResourceUsageEntry;
        if (resourceEntry.action === "spent") {
          toast.warning(description);
        } else {
          toast.success(description);
        }
        break;

      case "spell_cast":
        toast.info(description);
        break;

      default:
        toast(description);
    }
  };

  const handleClearRolls = () => {
    setLogEntries([]);
  };

  const getLogEntries = () => {
    return logEntries;
  };

  // Helper methods to create specific log entries
  const createDiceRollEntry = (
    dice: any[],
    droppedDice: any[] | undefined,
    modifier: number,
    total: number,
    description: string,
    advantageLevel?: number,
    isMiss?: boolean,
    criticalHits?: number
  ): DiceRollEntry => {
    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: "roll",
      dice,
      droppedDice: droppedDice?.length ? droppedDice : undefined,
      modifier,
      total,
      description,
      advantageLevel: advantageLevel !== 0 ? advantageLevel : undefined,
      isMiss,
      criticalHits: criticalHits && criticalHits > 0 ? criticalHits : undefined,
    };
  };

  const createDamageEntry = (
    amount: number,
    targetType: "hp" | "temp_hp" = "hp"
  ): DamageEntry => {
    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: "damage",
      description: `Took ${amount} damage${
        targetType === "temp_hp" ? " (temporary HP)" : ""
      }`,
      amount,
      targetType,
    };
  };

  const createHealingEntry = (amount: number): HealingEntry => {
    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: "healing",
      description: `Healed ${amount} HP`,
      amount,
    };
  };

  const createTempHPEntry = (
    amount: number,
    previous?: number
  ): TempHPEntry => {
    const description =
      previous !== undefined
        ? `Gained ${amount} temporary HP (replaced ${previous})`
        : `Gained ${amount} temporary HP`;

    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: "temp_hp",
      description,
      amount,
      previous,
    };
  };

  const createInitiativeEntry = (
    total: number,
    actionsGranted: number
  ): InitiativeEntry => {
    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: "initiative",
      description: `Initiative ${total} - Combat started with ${actionsGranted} actions`,
      total,
      actionsGranted,
    };
  };

  const createAbilityUsageEntry = (
    abilityName: string,
    frequency: "per_turn" | "per_encounter" | "per_safe_rest" | "at_will",
    usesRemaining: number,
    maxUses: number
  ): AbilityUsageEntry => {
    const frequencyText =
      frequency === "per_turn"
        ? "per turn"
        : frequency === "per_encounter"
        ? "per encounter"
        : frequency === "per_safe_rest"
        ? "per safe rest"
        : "at will";
    const usageText =
      frequency === "at_will"
        ? `Used ${abilityName} (${frequencyText})`
        : `Used ${abilityName} (${frequencyText}) - ${usesRemaining}/${maxUses} remaining`;

    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: "ability_usage",
      description: usageText,
      abilityName,
      frequency,
      usesRemaining,
      maxUses,
    };
  };

  const createSafeRestEntry = (
    healingAmount: number,
    hitDiceRestored: number,
    woundsRemoved: number,
    abilitiesReset: number
  ): SafeRestEntry => {
    const parts: string[] = [];
    if (healingAmount > 0) parts.push(`restored ${healingAmount} HP`);
    if (hitDiceRestored > 0) parts.push(`restored ${hitDiceRestored} hit dice`);
    if (woundsRemoved > 0)
      parts.push(
        `removed ${woundsRemoved} wound${woundsRemoved !== 1 ? "s" : ""}`
      );
    if (abilitiesReset > 0) parts.push(`reset ${abilitiesReset} abilities`);

    const description =
      parts.length > 0
        ? `Safe Rest completed - ${parts.join(", ")}`
        : "Safe Rest completed";

    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: "safe_rest",
      description,
      healingAmount,
      hitDiceRestored,
      woundsRemoved,
      abilitiesReset,
    };
  };

  const createCatchBreathEntry = (
    hitDiceSpent: number,
    healingAmount: number,
    abilitiesReset: number
  ): CatchBreathEntry => {
    const parts: string[] = [];
    if (hitDiceSpent > 0) parts.push(`spent ${hitDiceSpent} hit dice`);
    if (healingAmount > 0) parts.push(`restored ${healingAmount} HP`);
    if (abilitiesReset > 0) parts.push(`reset ${abilitiesReset} abilities`);

    const description =
      parts.length > 0
        ? `Catch Breath completed - ${parts.join(", ")}`
        : "Catch Breath completed";

    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: "catch_breath",
      description,
      hitDiceSpent,
      healingAmount,
      abilitiesReset,
    };
  };

  const createMakeCampEntry = (
    healingAmount: number,
    hitDiceRestored: number,
    abilitiesReset: number
  ): MakeCampEntry => {
    const parts: string[] = [];
    if (healingAmount > 0) parts.push(`restored ${healingAmount} HP`);
    if (hitDiceRestored > 0) parts.push(`restored ${hitDiceRestored} hit dice`);
    if (abilitiesReset > 0) parts.push(`reset ${abilitiesReset} abilities`);

    const description =
      parts.length > 0
        ? `Make Camp completed - ${parts.join(", ")}`
        : "Make Camp completed";

    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: "make_camp",
      description,
      healingAmount,
      hitDiceRestored,
      abilitiesReset,
    };
  };

  const createResourceEntry = (
    resourceId: string,
    amount: number,
    action: "spent" | "restored",
    currentAmount: number,
    maxAmount: number
  ): ResourceUsageEntry => {
    const description =
      action === "spent"
        ? `Spent ${amount} ${resourceId} (${currentAmount}/${maxAmount} remaining)`
        : `Restored ${amount} ${resourceId} (${currentAmount}/${maxAmount} current)`;

    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: "resource",
      description,
      resourceId,
      resourceName: resourceId, // Will be updated by caller if needed
      amount,
      action,
      currentAmount,
      maxAmount,
    };
  };

  const createSpellCastEntry = (
    spellName: string,
    school: string,
    tier: number,
    actionCost: number,
    resourceCost?: {
      resourceId: string;
      resourceName: string;
      amount: number;
    }
  ): SpellCastEntry => {
    const resourceText = resourceCost
      ? ` (cost: ${resourceCost.amount} ${resourceCost.resourceName})`
      : "";
    const actionText =
      actionCost === 0
        ? "bonus action"
        : `${actionCost} action${actionCost > 1 ? "s" : ""}`;
    const description = `Cast ${spellName} (${school}, tier ${tier}, ${actionText})${resourceText}`;

    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: "spell_cast",
      description,
      spellName,
      school,
      tier,
      resourceCost,
      actionCost,
    };
  };

  return {
    logEntries,
    addLogEntry,
    handleClearRolls,
    getLogEntries,
    createDiceRollEntry,
    createDamageEntry,
    createHealingEntry,
    createTempHPEntry,
    createInitiativeEntry,
    createAbilityUsageEntry,
    createSafeRestEntry,
    createCatchBreathEntry,
    createMakeCampEntry,
    createResourceEntry,
    createSpellCastEntry,
    showToastForLogEntry,
  };
}
