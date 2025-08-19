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

  applyAdvantageDisadvantage(dice: SingleDie[], advantageLevel: number): { finalDice: SingleDie[], droppedDice: SingleDie[] } {
    if (advantageLevel === 0) {
      return { finalDice: dice, droppedDice: [] };
    }

    const sortedDice = [...dice].sort((a, b) => a.result - b.result);
    
    if (advantageLevel > 0) {
      // Advantage: drop lowest dice
      const numToDrop = Math.min(advantageLevel, dice.length - 1);
      const droppedDice = sortedDice.slice(0, numToDrop);
      const finalDice = sortedDice.slice(numToDrop);
      return { finalDice, droppedDice };
    } else {
      // Disadvantage: drop highest dice
      const numToDrop = Math.min(Math.abs(advantageLevel), dice.length - 1);
      const droppedDice = sortedDice.slice(-numToDrop);
      const finalDice = sortedDice.slice(0, -numToDrop);
      return { finalDice, droppedDice };
    }
  }

  rollDiceWithCriticals(count: number, sides: DiceType, advantageLevel: number = 0): { dice: SingleDie[], droppedDice: SingleDie[], criticalHits: number } {
    // Calculate total dice to roll (base count + advantage/disadvantage dice)
    const totalDiceToRoll = count + Math.abs(advantageLevel);
    const initialDice: SingleDie[] = [];
    
    // Roll initial dice (including advantage/disadvantage extra dice)
    for (let i = 0; i < totalDiceToRoll; i++) {
      initialDice.push({
        type: sides,
        result: this.rollSingleDie(sides),
      });
    }
    
    // Apply advantage/disadvantage to get final dice and dropped dice
    const { finalDice, droppedDice } = this.applyAdvantageDisadvantage(initialDice, advantageLevel);
    
    // Check if the first die (primary damage die) rolled its maximum for critical hits
    let criticalHits = 0;
    if (finalDice.length > 0 && finalDice[0].result === sides) {
      finalDice[0].isCritical = true;
      criticalHits++;
      
      // Keep rolling additional dice while they also roll maximum (no advantage/disadvantage on critical dice)
      let consecutiveCrits = 0;
      while (consecutiveCrits < gameConfig.dice.maxCriticalHitsInRow) {
        const additionalDie: SingleDie = {
          type: sides,
          result: this.rollSingleDie(sides),
        };
        finalDice.push(additionalDie);
        
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
    
    return { dice: finalDice, droppedDice, criticalHits };
  }

  parseDiceExpression(expression: string): DiceExpression | null {
    const match = expression.match(/^(\d+)?d(\d+)$/i);
    if (!match) return null;
    
    const count = match[1] ? parseInt(match[1]) : 1;
    const sides = parseInt(match[2]) as DiceType;
    
    if (![4, 6, 8, 10, 12, 20, 100].includes(sides)) return null;
    
    return { count, sides };
  }

  rollBasicDice(count: number, sides: DiceType, advantageLevel: number = 0): { dice: SingleDie[], droppedDice: SingleDie[] } {
    // Calculate total dice to roll (base count + advantage/disadvantage dice)
    const totalDiceToRoll = count + Math.abs(advantageLevel);
    const initialDice: SingleDie[] = [];
    
    // Roll initial dice (including advantage/disadvantage extra dice)
    for (let i = 0; i < totalDiceToRoll; i++) {
      initialDice.push({
        type: sides,
        result: this.rollSingleDie(sides),
      });
    }
    
    // Apply advantage/disadvantage to get final dice and dropped dice
    const { finalDice, droppedDice } = this.applyAdvantageDisadvantage(initialDice, advantageLevel);
    
    return { dice: finalDice, droppedDice };
  }

  async addRoll(diceType: DiceType, modifier: number, description: string, advantageLevel: number = 0): Promise<DiceRoll> {
    const { dice, droppedDice } = this.rollBasicDice(1, diceType, advantageLevel);
    const diceTotal = dice.reduce((sum, die) => sum + die.result, 0);
    const total = diceTotal + modifier;
    
    const roll: DiceRoll = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      dice,
      droppedDice: droppedDice.length > 0 ? droppedDice : undefined,
      modifier,
      total,
      description,
      advantageLevel: advantageLevel !== 0 ? advantageLevel : undefined,
    };

    await this.saveRoll(roll);
    return roll;
  }

  async addAttackRoll(diceExpression: string, modifier: number, description: string, advantageLevel: number = 0): Promise<DiceRoll> {
    const parsed = this.parseDiceExpression(diceExpression);
    if (!parsed) {
      throw new Error(`Invalid dice expression: ${diceExpression}`);
    }

    const { dice, droppedDice, criticalHits } = this.rollDiceWithCriticals(parsed.count, parsed.sides, advantageLevel);
    const diceTotal = dice.reduce((sum, die) => sum + die.result, 0);
    const total = diceTotal + modifier;
    
    // Check for miss - only if first die is 1 (and using miss rule) - check AFTER advantage/disadvantage
    const isMiss = gameConfig.combat.missOnFirstDieOne && dice.length > 0 && dice[0].result === 1;
    
    const roll: DiceRoll = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      dice,
      droppedDice: droppedDice.length > 0 ? droppedDice : undefined,
      modifier,
      total: isMiss ? 0 : total, // Miss = 0 damage
      description,
      isMiss,
      criticalHits: criticalHits > 0 ? criticalHits : undefined,
      advantageLevel: advantageLevel !== 0 ? advantageLevel : undefined,
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