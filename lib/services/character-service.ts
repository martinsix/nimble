import { Character, ActionTracker } from '../types/character';
import { Abilities } from '../types/abilities';
import { characterStorageService } from './character-storage-service';
import { activityLogService } from './activity-log-service';
import { abilityService } from './ability-service';

export class CharacterService {
  private character: Character | null = null;
  private characterListeners: ((character: Character) => void)[] = [];

  constructor(
    private storageService = characterStorageService,
    private logService = activityLogService
  ) {}

  // State Management
  subscribeToCharacter(listener: (character: Character) => void): () => void {
    this.characterListeners.push(listener);
    if (this.character) {
      listener(this.character);
    }
    
    // Return unsubscribe function
    return () => {
      this.characterListeners = this.characterListeners.filter(l => l !== listener);
    };
  }

  getCurrentCharacter(): Character | null {
    return this.character;
  }

  async loadCharacter(characterId: string): Promise<Character | null> {
    const character = await this.storageService.getCharacter(characterId);
    if (character) {
      this.character = character;
      this.notifyCharacterChanged();
    }
    return character;
  }

  private notifyCharacterChanged(): void {
    if (this.character) {
      this.characterListeners.forEach(listener => listener(this.character!));
    }
  }

  private async saveCharacter(): Promise<void> {
    if (this.character) {
      await this.storageService.updateCharacter(this.character);
    }
  }

  // Game Logic Methods

  /**
   * Apply damage to the character, handling temporary HP and wound logic
   */
  async applyDamage(amount: number, targetType?: 'hp' | 'temp_hp'): Promise<void> {
    if (!this.character) return;

    let remainingDamage = amount;
    let newTemporary = this.character.hitPoints.temporary;
    let newCurrent = this.character.hitPoints.current;
    let actualTargetType: 'hp' | 'temp_hp' = 'hp';

    // Temp HP absorbs damage first (unless specifically targeting regular HP)
    if (targetType !== 'hp' && this.character.hitPoints.temporary > 0) {
      if (remainingDamage >= this.character.hitPoints.temporary) {
        remainingDamage -= this.character.hitPoints.temporary;
        newTemporary = 0;
        actualTargetType = remainingDamage > 0 ? 'hp' : 'temp_hp';
      } else {
        newTemporary = this.character.hitPoints.temporary - remainingDamage;
        remainingDamage = 0;
        actualTargetType = 'temp_hp';
      }
    }

    // Apply remaining damage to regular HP
    if (remainingDamage > 0) {
      newCurrent = Math.max(0, this.character.hitPoints.current - remainingDamage);
      actualTargetType = 'hp';
    }

    // Check if character should gain a wound (dropped to 0 HP from above 0)
    const shouldGainWound = this.character.hitPoints.current > 0 && newCurrent === 0;

    // Update character state
    this.character = {
      ...this.character,
      hitPoints: {
        ...this.character.hitPoints,
        current: newCurrent,
        temporary: newTemporary,
      },
      wounds: shouldGainWound && this.character.wounds.current < this.character.wounds.max
        ? {
            ...this.character.wounds,
            current: this.character.wounds.current + 1,
          }
        : this.character.wounds,
    };

    // Save and notify
    await this.saveCharacter();
    this.notifyCharacterChanged();

    // Log the damage
    await this.logService.addLogEntry(
      this.logService.createDamageEntry(amount, actualTargetType)
    );
  }

  /**
   * Apply healing to the character
   */
  async applyHealing(amount: number): Promise<void> {
    if (!this.character) return;

    const newCurrent = Math.min(
      this.character.hitPoints.max, 
      this.character.hitPoints.current + amount
    );

    this.character = {
      ...this.character,
      hitPoints: {
        ...this.character.hitPoints,
        current: newCurrent,
      },
    };

    await this.saveCharacter();
    this.notifyCharacterChanged();

    // Log the healing
    await this.logService.addLogEntry(
      this.logService.createHealingEntry(amount)
    );
  }

  /**
   * Apply temporary HP to the character
   */
  async applyTemporaryHP(amount: number): Promise<void> {
    if (!this.character) return;

    const previousTempHp = this.character.hitPoints.temporary > 0 
      ? this.character.hitPoints.temporary 
      : undefined;
    
    // Temp HP doesn't stack - take the higher value
    const newTemporary = Math.max(this.character.hitPoints.temporary, amount);

    this.character = {
      ...this.character,
      hitPoints: {
        ...this.character.hitPoints,
        temporary: newTemporary,
      },
    };

    await this.saveCharacter();
    this.notifyCharacterChanged();

    // Log the temp HP gain
    await this.logService.addLogEntry(
      this.logService.createTempHPEntry(amount, previousTempHp)
    );
  }

  /**
   * Update character's hit points (for direct HP changes like max HP adjustments)
   */
  async updateHitPoints(current: number, max: number, temporary: number): Promise<void> {
    if (!this.character) return;

    this.character = {
      ...this.character,
      hitPoints: {
        current: Math.min(current, max), // Ensure current doesn't exceed max
        max,
        temporary,
      },
    };

    await this.saveCharacter();
    this.notifyCharacterChanged();
  }

  /**
   * Manually adjust wounds (for wound management UI)
   */
  async updateWounds(current: number, max: number): Promise<void> {
    if (!this.character) return;

    this.character = {
      ...this.character,
      wounds: {
        current: Math.max(0, Math.min(current, max)),
        max: Math.max(1, max),
      },
    };

    await this.saveCharacter();
    this.notifyCharacterChanged();
  }

  /**
   * Update action tracker
   */
  async updateActionTracker(actionTracker: ActionTracker): Promise<void> {
    if (!this.character) return;

    this.character = {
      ...this.character,
      actionTracker,
    };

    await this.saveCharacter();
    this.notifyCharacterChanged();
  }

  /**
   * Update abilities
   */
  async updateAbilities(abilities: Abilities): Promise<void> {
    if (!this.character) return;

    this.character = {
      ...this.character,
      abilities,
    };

    await this.saveCharacter();
    this.notifyCharacterChanged();
  }

  /**
   * Perform safe rest - restore HP, hit dice, remove wound, reset abilities
   */
  async performSafeRest(): Promise<void> {
    if (!this.character) return;

    // Reset all abilities (safe rest resets everything)
    let resetAbilities = abilityService.resetAbilities(this.character.abilities, 'per_turn');
    resetAbilities = abilityService.resetAbilities(resetAbilities, 'per_encounter');
    resetAbilities = abilityService.resetAbilities(resetAbilities, 'per_safe_rest');

    // Calculate what was restored for logging
    const healingAmount = this.character.hitPoints.max - this.character.hitPoints.current;
    const hitDiceRestored = this.character.hitDice.max - this.character.hitDice.current;
    const woundsRemoved = this.character.wounds.current > 0 ? 1 : 0;
    const abilitiesReset = this.character.abilities.abilities.filter(ability => 
      ability.type === 'action' && 
      ability.frequency !== 'at_will' && 
      ability.currentUses !== ability.maxUses
    ).length;

    // Update character with full restoration
    this.character = {
      ...this.character,
      hitPoints: {
        ...this.character.hitPoints,
        current: this.character.hitPoints.max, // Full HP restoration
        temporary: 0, // Clear temporary HP
      },
      hitDice: {
        ...this.character.hitDice,
        current: this.character.hitDice.max, // Restore all hit dice
      },
      wounds: {
        ...this.character.wounds,
        current: Math.max(0, this.character.wounds.current - 1), // Remove one wound
      },
      abilities: resetAbilities,
      inEncounter: false, // Safe rest ends any encounter
      actionTracker: {
        ...this.character.actionTracker,
        current: this.character.actionTracker.base,
        bonus: 0,
      },
    };

    await this.saveCharacter();
    this.notifyCharacterChanged();

    // Log the safe rest
    await this.logService.addLogEntry(
      this.logService.createSafeRestEntry(
        healingAmount,
        hitDiceRestored,
        woundsRemoved,
        abilitiesReset
      )
    );
  }

  /**
   * End encounter - reset per-encounter abilities and action tracker
   */
  async endEncounter(): Promise<void> {
    if (!this.character) return;

    // Reset both per-encounter and per-turn abilities when encounter ends
    let resetAbilities = abilityService.resetAbilities(this.character.abilities, 'per_encounter');
    resetAbilities = abilityService.resetAbilities(resetAbilities, 'per_turn');

    this.character = {
      ...this.character,
      inEncounter: false,
      actionTracker: {
        ...this.character.actionTracker,
        current: this.character.actionTracker.base,
        bonus: 0
      },
      abilities: resetAbilities
    };

    await this.saveCharacter();
    this.notifyCharacterChanged();
  }

  /**
   * End turn - reset per-turn abilities and action tracker
   */
  async endTurn(): Promise<void> {
    if (!this.character) return;

    // Reset per-turn abilities
    const resetAbilities = abilityService.resetAbilities(this.character.abilities, 'per_turn');
    
    this.character = {
      ...this.character,
      actionTracker: {
        ...this.character.actionTracker,
        current: this.character.actionTracker.base,
        bonus: 0
      },
      abilities: resetAbilities
    };

    await this.saveCharacter();
    this.notifyCharacterChanged();
  }

  /**
   * Generic character update method (for other properties)
   */
  async updateCharacter(updates: Partial<Character>): Promise<void> {
    if (!this.character) return;

    let updatedCharacter = {
      ...this.character,
      ...updates,
      updatedAt: new Date(),
    };

    // If attributes were updated, recalculate inventory max size based on strength
    if (updates.attributes) {
      const newStrength = updates.attributes.strength ?? this.character.attributes.strength;
      updatedCharacter = {
        ...updatedCharacter,
        inventory: {
          ...updatedCharacter.inventory,
          maxSize: 10 + newStrength,
        },
      };
    }

    this.character = updatedCharacter;

    await this.saveCharacter();
    this.notifyCharacterChanged();
  }
}

export const characterService = new CharacterService();