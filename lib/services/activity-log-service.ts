import { LogEntry, DiceRoll, DamageEntry, HealingEntry, TempHPEntry, InitiativeEntry, AbilityUsageEntry } from '../types/dice';
import { gameConfig } from '../config/game-config';

export class ActivityLogService {
  private readonly storageKey = 'nimble-navigator-activity-log';
  private readonly maxEntries = gameConfig.storage.maxRollHistory;

  async getLogEntries(): Promise<LogEntry[]> {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return [];
    
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));
    } catch {
      return [];
    }
  }

  async addLogEntry(newEntry: LogEntry): Promise<void> {
    const existingEntries = await this.getLogEntries();
    const updatedEntries = [newEntry, ...existingEntries].slice(0, this.maxEntries);
    localStorage.setItem(this.storageKey, JSON.stringify(updatedEntries));
  }

  async clearLogEntries(): Promise<void> {
    localStorage.removeItem(this.storageKey);
  }

  // Helper methods to create specific log entries
  createDiceRollEntry(
    dice: any[],
    droppedDice: any[] | undefined,
    modifier: number,
    total: number,
    description: string,
    advantageLevel?: number,
    isMiss?: boolean,
    criticalHits?: number
  ): DiceRoll {
    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type: 'roll',
      dice,
      droppedDice: droppedDice?.length ? droppedDice : undefined,
      modifier,
      total,
      description,
      advantageLevel: advantageLevel !== 0 ? advantageLevel : undefined,
      isMiss,
      criticalHits: criticalHits && criticalHits > 0 ? criticalHits : undefined,
    };
  }

  createDamageEntry(amount: number, targetType: 'hp' | 'temp_hp' = 'hp'): DamageEntry {
    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type: 'damage',
      description: `Took ${amount} damage${targetType === 'temp_hp' ? ' (temporary HP)' : ''}`,
      amount,
      targetType,
    };
  }

  createHealingEntry(amount: number): HealingEntry {
    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type: 'healing',
      description: `Healed ${amount} HP`,
      amount,
    };
  }

  createTempHPEntry(amount: number, previous?: number): TempHPEntry {
    const description = previous !== undefined 
      ? `Gained ${amount} temporary HP (replaced ${previous})` 
      : `Gained ${amount} temporary HP`;
      
    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type: 'temp_hp',
      description,
      amount,
      previous,
    };
  }

  createInitiativeEntry(total: number, actionsGranted: number): InitiativeEntry {
    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type: 'initiative',
      description: `Initiative ${total} - Combat started with ${actionsGranted} actions`,
      total,
      actionsGranted,
    };
  }

  createAbilityUsageEntry(
    abilityName: string, 
    frequency: 'per_turn' | 'per_encounter', 
    usesRemaining: number, 
    maxUses: number
  ): AbilityUsageEntry {
    const frequencyText = frequency === 'per_turn' ? 'per turn' : 'per encounter';
    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type: 'ability_usage',
      description: `Used ${abilityName} (${frequencyText}) - ${usesRemaining}/${maxUses} remaining`,
      abilityName,
      frequency,
      usesRemaining,
      maxUses,
    };
  }
}

export const activityLogService = new ActivityLogService();