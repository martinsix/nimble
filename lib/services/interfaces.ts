import { Character, ActionTracker, CharacterConfiguration } from '../types/character';
import { Abilities, ActionAbility, AbilityRoll } from '../types/abilities';
import { LogEntry, SingleDie } from '../types/log-entries';
import { ClassFeatureGrant, ClassFeature } from '../types/class';
import { ResourceInstance } from '../types/resources';

/**
 * Character Storage Interface
 * Handles persistence and retrieval of character data
 */
export interface ICharacterStorage {
  getCharacter(id: string): Promise<Character | null>;
  getAllCharacters(): Promise<Character[]>;
  createCharacter(characterData: Partial<Character>, id?: string): Promise<Character>;
  updateCharacter(character: Character): Promise<void>;
  deleteCharacter(id: string): Promise<void>;
  updateLastPlayed(id: string): Promise<void>;
}

/**
 * Activity Log Interface
 * Handles logging of character actions and dice rolls
 */
export interface IActivityLog {
  getLogEntries(): Promise<LogEntry[]>;
  addLogEntry(entry: LogEntry): Promise<void>;
  clearLogEntries(): Promise<void>;
  createDiceRollEntry(
    dice: SingleDie[],
    droppedDice: SingleDie[] | undefined,
    modifier: number,
    total: number,
    description: string,
    advantageLevel?: number,
    isMiss?: boolean,
    criticalHits?: number
  ): LogEntry;
  createHealingEntry(amount: number): LogEntry;
  createDamageEntry(amount: number, targetType: 'hp' | 'temp_hp'): LogEntry;
  createTempHPEntry(amount: number, previousAmount?: number): LogEntry;
  createResourceEntry(resourceId: string, amount: number, type: 'spent' | 'restored', currentAmount: number, maxAmount: number): LogEntry;
  createAbilityUsageEntry(abilityName: string, frequency: string, currentUses: number, maxUses: number): LogEntry;
  createInitiativeEntry(rollTotal: number, actionsGranted: number): LogEntry;
  createSafeRestEntry(healingAmount: number, hitDiceRestored: number, woundsRemoved: number, abilitiesReset: number): LogEntry;
  createCatchBreathEntry(hitDiceSpent: number, healingAmount: number, abilitiesReset: number): LogEntry;
  createMakeCampEntry(healingAmount: number, hitDiceRestored: number, abilitiesReset: number): LogEntry;
}

/**
 * Ability Service Interface
 * Handles ability management and usage
 */
export interface IAbilityService {
  resetAbilities(abilities: Abilities, frequency: 'per_turn' | 'per_encounter' | 'per_safe_rest'): Abilities;
  useAbility(abilities: Abilities, abilityId: string, availableActions?: number, inEncounter?: boolean, availableResources?: ResourceInstance[], variableResourceAmount?: number): { success: boolean; updatedAbilities: Abilities; usedAbility: ActionAbility | null; actionsRequired?: number; resourceCost?: { resourceId: string; amount: number }; insufficientResource?: string };
  calculateAbilityRollModifier(roll: AbilityRoll, character: Character): number;
}

/**
 * Character Service Interface
 * Manages character state and business logic
 */
export interface ICharacterService {
  character: Character | null;
  subscribeToCharacter(listener: (character: Character) => void): () => void;
  getCurrentCharacter(): Character | null;
  loadCharacter(characterId: string): Promise<Character | null>;
  updateCharacter(character: Character): Promise<void>;
  applyDamage(amount: number, targetType?: 'hp' | 'temp_hp'): Promise<void>;
  applyHealing(amount: number): Promise<void>;
  applyTemporaryHP(amount: number): Promise<void>;
  updateHitPoints(current: number, max: number, temporary: number): Promise<void>;
  updateWounds(current: number, max: number): Promise<void>;
  updateActionTracker(actionTracker: ActionTracker): Promise<void>;
  updateAbilities(abilities: Abilities): Promise<void>;
  startEncounter(initiativeRoll: number): Promise<void>;
  performSafeRest(): Promise<void>;
  performCatchBreath(): Promise<void>;
  performMakeCamp(): Promise<void>;
  endEncounter(): Promise<void>;
  endTurn(): Promise<void>;
  performAttack(weaponName: string, damage: string, attributeModifier: number, advantageLevel: number): Promise<void>;
  performUseAbility(abilityId: string, variableResourceAmount?: number): Promise<void>;
  updateCharacterFields(updates: Partial<Character>): Promise<void>;
  updateCharacterConfiguration(config: CharacterConfiguration): Promise<void>;
}

/**
 * Class Service Interface
 * Handles class features and progression
 */
export interface IClassService {
  getExpectedFeaturesForCharacter(character: Character): ClassFeature[];
  getMissingFeatures(character: Character): ClassFeature[];
  syncCharacterFeatures(): Promise<ClassFeatureGrant[]>;
  levelUpCharacter(targetLevel: number): Promise<ClassFeatureGrant[]>;
  selectSubclass(characterId: string, subclassId: string): Promise<Character>;
  canChooseSubclass(character: Character): boolean;
}

/**
 * Character Creation Service Interface
 * Handles character creation and initialization
 */
export interface ICharacterCreation {
  createCharacterWithClass(options: CreateCharacterOptions): Promise<Character>;
  createSampleCharacter(name: string, classId: string): Promise<Character>;
  initializeCharacter(characterId: string): Promise<Character | null>;
}

export interface CreateCharacterOptions {
  name: string;
  ancestry?: string;
  classId: string;
  level?: number;
  attributes?: Record<string, number>;
}