import { Character, ActionTracker, CharacterConfiguration } from '../types/character';
import { Abilities } from '../types/abilities';
import { ICharacterService, ICharacterStorage, IActivityLog, IAbilityService } from './interfaces';
import { resourceService } from './resource-service';

// Import for backward compatibility singleton
import { characterStorageService } from './character-storage-service';
import { activityLogService } from './activity-log-service';
import { abilityService } from './ability-service';

/**
 * Character Service with Dependency Injection
 * Manages character state without tight coupling to concrete implementations
 */
export class CharacterService implements ICharacterService {
  private _character: Character | null = null;
  private characterListeners: ((character: Character) => void)[] = [];

  constructor(
    private storageService: ICharacterStorage,
    private logService: IActivityLog,
    private abilityService: IAbilityService
  ) {}

  // Public getter for character
  get character(): Character | null {
    return this._character;
  }

  // State Management
  subscribeToCharacter(listener: (character: Character) => void): () => void {
    this.characterListeners.push(listener);
    if (this._character) {
      listener(this._character);
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
      this._character = character;
      
      // Migrate resources from old color field to colorScheme field
      const migrationNeeded = resourceService.migrateResourceColorSchemes(character);
      
      // Save migrated character only if migration occurred
      if (migrationNeeded) {
        await this.saveCharacter();
      }
      
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
    if (!this._character) return;

    let remainingDamage = amount;
    let newTemporary = this._character.hitPoints.temporary;
    let newCurrent = this._character.hitPoints.current;
    let actualTargetType: 'hp' | 'temp_hp' = 'hp';

    // Temp HP absorbs damage first (unless specifically targeting regular HP)
    if (targetType !== 'hp' && this._character.hitPoints.temporary > 0) {
      if (remainingDamage >= this._character.hitPoints.temporary) {
        remainingDamage -= this._character.hitPoints.temporary;
        newTemporary = 0;
        actualTargetType = remainingDamage > 0 ? 'hp' : 'temp_hp';
      } else {
        newTemporary = this._character.hitPoints.temporary - remainingDamage;
        remainingDamage = 0;
        actualTargetType = 'temp_hp';
      }
    }

    // Apply remaining damage to regular HP
    if (remainingDamage > 0) {
      newCurrent = Math.max(0, this._character.hitPoints.current - remainingDamage);
      actualTargetType = 'hp';
    }

    // Check if character should gain a wound (dropped to 0 HP from above 0)
    const shouldGainWound = this._character.hitPoints.current > 0 && newCurrent === 0;

    // Update character state
    this._character = {
      ...this._character,
      hitPoints: {
        ...this._character.hitPoints,
        current: newCurrent,
        temporary: newTemporary,
      },
      wounds: shouldGainWound && this._character.wounds.current < this._character.wounds.max
        ? {
            ...this._character.wounds,
            current: this._character.wounds.current + 1,
          }
        : this._character.wounds,
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
    if (!this._character) return;

    const newCurrent = Math.min(
      this._character.hitPoints.max, 
      this._character.hitPoints.current + amount
    );

    this._character = {
      ...this._character,
      hitPoints: {
        ...this._character.hitPoints,
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
    if (!this._character) return;

    const previousTempHp = this._character.hitPoints.temporary > 0 
      ? this._character.hitPoints.temporary 
      : undefined;
    
    // Temp HP doesn't stack - take the higher value
    const newTemporary = Math.max(this._character.hitPoints.temporary, amount);

    this._character = {
      ...this._character,
      hitPoints: {
        ...this._character.hitPoints,
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
    if (!this._character) return;

    this._character = {
      ...this._character,
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
    if (!this._character) return;

    this._character = {
      ...this._character,
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
    if (!this._character) return;

    this._character = {
      ...this._character,
      actionTracker,
    };

    await this.saveCharacter();
    this.notifyCharacterChanged();
  }

  /**
   * Update abilities
   */
  async updateAbilities(abilities: Abilities): Promise<void> {
    if (!this._character) return;

    this._character = {
      ...this._character,
      abilities,
    };

    await this.saveCharacter();
    this.notifyCharacterChanged();
  }


  /**
   * Perform safe rest - restore HP, hit dice, remove wound, reset abilities and resources
   */
  async performSafeRest(): Promise<void> {
    if (!this._character) return;

    // Reset all abilities (safe rest resets everything)
    let resetAbilities = this.abilityService.resetAbilities(this._character.abilities, 'per_turn');
    resetAbilities = this.abilityService.resetAbilities(resetAbilities, 'per_encounter');
    resetAbilities = this.abilityService.resetAbilities(resetAbilities, 'per_safe_rest');

    // Reset resources that reset on safe rest
    const resourceEntries = resourceService.resetResourcesByCondition(this._character, 'safe_rest');

    // Calculate what was restored for logging
    const healingAmount = this._character.hitPoints.max - this._character.hitPoints.current;
    const hitDiceRestored = this._character.hitDice.max - this._character.hitDice.current;
    const woundsRemoved = this._character.wounds.current > 0 ? 1 : 0;
    const abilitiesReset = this._character.abilities.abilities.filter(ability => 
      ability.type === 'action' && 
      ability.frequency !== 'at_will' && 
      ability.currentUses !== ability.maxUses
    ).length;

    // Update character with full restoration
    this._character = {
      ...this._character,
      hitPoints: {
        ...this._character.hitPoints,
        current: this._character.hitPoints.max, // Full HP restoration
        temporary: 0, // Clear temporary HP
      },
      hitDice: {
        ...this._character.hitDice,
        current: this._character.hitDice.max, // Restore all hit dice
      },
      wounds: {
        ...this._character.wounds,
        current: Math.max(0, this._character.wounds.current - 1), // Remove one wound
      },
      abilities: resetAbilities,
      inEncounter: false, // Safe rest ends any encounter
      actionTracker: {
        ...this._character.actionTracker,
        current: this._character.actionTracker.base,
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

    // Log resource resets
    for (const entry of resourceEntries) {
      const logEntry = resourceService.createResourceLogEntry(entry);
      await this.logService.addLogEntry(logEntry);
    }
  }

  /**
   * End encounter - reset per-encounter abilities, action tracker, and resources
   */
  async endEncounter(): Promise<void> {
    if (!this._character) return;

    // Reset both per-encounter and per-turn abilities when encounter ends
    let resetAbilities = this.abilityService.resetAbilities(this._character.abilities, 'per_encounter');
    resetAbilities = this.abilityService.resetAbilities(resetAbilities, 'per_turn');

    // Reset resources that reset on encounter end
    const resourceEntries = resourceService.resetResourcesByCondition(this._character, 'encounter_end');

    this._character = {
      ...this._character,
      inEncounter: false,
      actionTracker: {
        ...this._character.actionTracker,
        current: this._character.actionTracker.base,
        bonus: 0
      },
      abilities: resetAbilities
    };

    await this.saveCharacter();
    this.notifyCharacterChanged();

    // Log resource resets
    for (const entry of resourceEntries) {
      const logEntry = resourceService.createResourceLogEntry(entry);
      await this.logService.addLogEntry(logEntry);
    }
  }

  /**
   * Start encounter with initiative roll result
   */
  async startEncounter(initiativeRoll: number): Promise<void> {
    if (!this._character) return;

    // Calculate actions based on initiative roll total (game rules)
    let actionsGranted: number;
    if (initiativeRoll < 10) {
      actionsGranted = 1;
    } else if (initiativeRoll <= 20) {
      actionsGranted = 2;
    } else {
      actionsGranted = 3;
    }

    // Update character to enter encounter mode with proper action tracker
    this._character = {
      ...this._character,
      inEncounter: true,
      actionTracker: {
        ...this._character.actionTracker,
        current: actionsGranted,
        base: 3,
        bonus: 0,
      },
    };

    await this.saveCharacter();
    this.notifyCharacterChanged();
  }

  /**
   * End turn - reset per-turn abilities, action tracker, and resources
   */
  async endTurn(): Promise<void> {
    if (!this._character) return;

    // Reset per-turn abilities
    const resetAbilities = this.abilityService.resetAbilities(this._character.abilities, 'per_turn');
    
    // Reset resources that reset on turn end
    const resourceEntries = resourceService.resetResourcesByCondition(this._character, 'turn_end');
    
    this._character = {
      ...this._character,
      actionTracker: {
        ...this._character.actionTracker,
        current: this._character.actionTracker.base,
        bonus: 0
      },
      abilities: resetAbilities
    };

    await this.saveCharacter();
    this.notifyCharacterChanged();

    // Log resource resets
    for (const entry of resourceEntries) {
      const logEntry = resourceService.createResourceLogEntry(entry);
      await this.logService.addLogEntry(logEntry);
    }
  }

  /**
   * Generic character update method (for other properties)
   */
  async updateCharacterFields(updates: Partial<Character>): Promise<void> {
    if (!this._character) return;

    let updatedCharacter = {
      ...this._character,
      ...updates,
      updatedAt: new Date(),
    };

    // If attributes were updated, recalculate inventory max size based on strength
    if (updates.attributes) {
      const newStrength = updates.attributes.strength ?? this._character.attributes.strength;
      updatedCharacter = {
        ...updatedCharacter,
        inventory: {
          ...updatedCharacter.inventory,
          maxSize: 10 + newStrength,
        },
      };
    }

    this._character = updatedCharacter;

    await this.saveCharacter();
    this.notifyCharacterChanged();
  }

  /**
   * Update character configuration (wounds, max HP, etc.)
   */
  async updateCharacterConfiguration(config: CharacterConfiguration): Promise<void> {
    if (!this._character) return;

    let updatedCharacter = {
      ...this._character,
      config,
      wounds: {
        ...this._character.wounds,
        max: config.maxWounds, // Update wounds max based on config
      },
    };

    this._character = updatedCharacter;

    await this.saveCharacter();
    this.notifyCharacterChanged();
  }

  /**
   * Public method to update the character (used by class service)
   */
  async updateCharacter(character: Character): Promise<void> {
    this._character = character;
    await this.saveCharacter();
    this.notifyCharacterChanged();
  }
}

// Export a singleton instance for backward compatibility
// This is deprecated - use the service factory instead
export const characterService = new CharacterService(
  characterStorageService,
  activityLogService,
  abilityService
);