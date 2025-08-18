import { DiceRoll, DiceType, DiceExpression, SingleDie } from '../types/dice';
import { gameConfig } from '../config/game-config';

export class DiceService {
  private readonly storageKey = 'nimble-dice-rolls';
  private readonly maxRolls = gameConfig.storage.maxRollHistory;

  rollSingleDie(sides: DiceType): number {
    return Math.floor(Math.random() * sides) + 1;
  }

  rollMultipleDice(count: number, sides: DiceType): SingleDie[] {
    const dice: SingleDie[] = [];
    for (let i = 0; i < count; i++) {
      dice.push({
        type: sides,
        result: this.rollSingleDie(sides),
      });
    }
    return dice;
  }

  rollDiceWithCriticals(count: number, sides: DiceType): { dice: SingleDie[], criticalHits: number } {
    const dice: SingleDie[] = [];
    let criticalHits = 0;
    
    // Roll initial dice
    for (let i = 0; i < count; i++) {
      dice.push({
        type: sides,
        result: this.rollSingleDie(sides),
      });
    }
    
    // Check if the first die (primary damage die) rolled its maximum for critical hits
    if (dice.length > 0 && dice[0].result === sides) {
      dice[0].isCritical = true;
      criticalHits++;
      
      // Keep rolling additional dice while they also roll maximum
      let consecutiveCrits = 0;
      while (consecutiveCrits < gameConfig.dice.maxCriticalHitsInRow) {
        const additionalDie: SingleDie = {
          type: sides,
          result: this.rollSingleDie(sides),
        };
        dice.push(additionalDie);
        
        // Check if this additional die also rolled maximum (another crit)
        if (additionalDie.result === sides) {
          additionalDie.isCritical = true;
          criticalHits++;
          consecutiveCrits++;
        } else {
          // This additional die didn't crit, stop rolling more
          break;
        }
      }
    }
    
    return { dice, criticalHits };
  }

  parseDiceExpression(expression: string): DiceExpression | null {
    const match = expression.match(/^(\d+)?d(\d+)$/i);
    if (!match) return null;
    
    const count = match[1] ? parseInt(match[1]) : 1;
    const sides = parseInt(match[2]) as DiceType;
    
    if (![4, 6, 8, 10, 12, 20, 100].includes(sides)) return null;
    
    return { count, sides };
  }

  async addRoll(diceType: DiceType, modifier: number, description: string): Promise<DiceRoll> {
    const dice = this.rollMultipleDice(1, diceType);
    const diceTotal = dice.reduce((sum, die) => sum + die.result, 0);
    const total = diceTotal + modifier;
    
    const roll: DiceRoll = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      dice,
      modifier,
      total,
      description,
    };

    await this.saveRoll(roll);
    return roll;
  }

  async addAttackRoll(diceExpression: string, modifier: number, description: string): Promise<DiceRoll> {
    const parsed = this.parseDiceExpression(diceExpression);
    if (!parsed) {
      throw new Error(`Invalid dice expression: ${diceExpression}`);
    }

    const { dice, criticalHits } = this.rollDiceWithCriticals(parsed.count, parsed.sides);
    const diceTotal = dice.reduce((sum, die) => sum + die.result, 0);
    const total = diceTotal + modifier;
    
    // Check for miss - only if first die is 1 (and using miss rule)
    const isMiss = gameConfig.combat.missOnFirstDieOne && dice.length > 0 && dice[0].result === 1;
    
    const roll: DiceRoll = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      dice,
      modifier,
      total: isMiss ? 0 : total, // Miss = 0 damage
      description,
      isMiss,
      criticalHits: criticalHits > 0 ? criticalHits : undefined,
    };

    await this.saveRoll(roll);
    return roll;
  }

  async getRolls(): Promise<DiceRoll[]> {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return [];
    
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((roll: any) => ({
        ...roll,
        timestamp: new Date(roll.timestamp),
      }));
    } catch {
      return [];
    }
  }

  private async saveRoll(newRoll: DiceRoll): Promise<void> {
    const existingRolls = await this.getRolls();
    const updatedRolls = [newRoll, ...existingRolls].slice(0, this.maxRolls);
    localStorage.setItem(this.storageKey, JSON.stringify(updatedRolls));
  }

  async clearRolls(): Promise<void> {
    localStorage.removeItem(this.storageKey);
  }
}

export const diceService = new DiceService();