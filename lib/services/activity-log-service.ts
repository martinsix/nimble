import { LogEntry, DiceRollEntry, DamageEntry, HealingEntry, TempHPEntry, InitiativeEntry, AbilityUsageEntry, SafeRestEntry, ManaEntry } from '../types/log-entries';
import { logEntrySchema } from '../schemas/dice';
import { gameConfig } from '../config/game-config';

export class ActivityLogService {
  private readonly storageKey = 'nimble-navigator-activity-log';
  private readonly maxEntries = gameConfig.storage.maxRollHistory;

  async getLogEntries(): Promise<LogEntry[]> {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return [];
    
    try {
      const parsed = JSON.parse(stored);
      const entries = parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));
      
      // Validate each entry and filter out invalid ones
      return entries.filter((entry: any) => {
        try {
          logEntrySchema.parse(entry);
          return true;
        } catch {
          console.warn('Invalid log entry found and removed:', entry);
          return false;
        }
      });
    } catch {
      return [];
    }
  }

  async addLogEntry(newEntry: LogEntry): Promise<void> {
    // Validate the new entry before adding
    try {
      logEntrySchema.parse(newEntry);
    } catch (error) {
      console.error('Invalid log entry provided:', newEntry, error);
      throw new Error('Invalid log entry format');
    }
    
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
  ): DiceRollEntry {
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
    frequency: 'per_turn' | 'per_encounter' | 'per_safe_rest' | 'at_will', 
    usesRemaining: number, 
    maxUses: number
  ): AbilityUsageEntry {
    const frequencyText = frequency === 'per_turn' ? 'per turn' : 
                         frequency === 'per_encounter' ? 'per encounter' : 
                         frequency === 'per_safe_rest' ? 'per safe rest' : 'at will';
    const usageText = frequency === 'at_will' ? 
      `Used ${abilityName} (${frequencyText})` :
      `Used ${abilityName} (${frequencyText}) - ${usesRemaining}/${maxUses} remaining`;
    
    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type: 'ability_usage',
      description: usageText,
      abilityName,
      frequency,
      usesRemaining,
      maxUses,
    };
  }

  createSafeRestEntry(
    healingAmount: number,
    hitDiceRestored: number,
    woundsRemoved: number,
    abilitiesReset: number
  ): SafeRestEntry {
    const parts: string[] = [];
    if (healingAmount > 0) parts.push(`restored ${healingAmount} HP`);
    if (hitDiceRestored > 0) parts.push(`restored ${hitDiceRestored} hit dice`);
    if (woundsRemoved > 0) parts.push(`removed ${woundsRemoved} wound${woundsRemoved !== 1 ? 's' : ''}`);
    if (abilitiesReset > 0) parts.push(`reset ${abilitiesReset} abilities`);
    
    const description = parts.length > 0 
      ? `Safe Rest completed - ${parts.join(', ')}`
      : 'Safe Rest completed';
    
    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type: 'safe_rest',
      description,
      healingAmount,
      hitDiceRestored,
      woundsRemoved,
      abilitiesReset,
    };
  }

  createManaEntry(
    amount: number,
    action: 'spent' | 'restored',
    currentMana: number,
    maxMana: number
  ): ManaEntry {
    const description = action === 'spent' 
      ? `Spent ${amount} mana (${currentMana}/${maxMana} remaining)`
      : `Restored ${amount} mana (${currentMana}/${maxMana} current)`;
    
    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type: 'mana',
      description,
      amount,
      action,
      currentMana,
      maxMana,
    };
  }
}

export const activityLogService = new ActivityLogService();