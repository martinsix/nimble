import { Character, CreateCharacterData } from '../types/character';
import { ICharacterRepository, LocalStorageCharacterRepository } from '../storage/character-repository';
import { createCharacterSchema, characterSchema } from '../schemas/character';
import { createDefaultCharacterConfiguration, createDefaultHitPoints, createDefaultHitDice, createDefaultProficiencies } from '../utils/character-defaults';
import { getClassDefinition } from '../data/classes/index';

export class CharacterStorageService {
  private readonly characterListStorageKey = 'nimble-navigator-character-list';
  
  constructor(private repository: ICharacterRepository = new LocalStorageCharacterRepository()) {}

  async createCharacter(data: CreateCharacterData, id?: string): Promise<Character> {
    const validated = createCharacterSchema.parse(data);
    return this.repository.create(validated, id);
  }

  async getCharacter(id: string): Promise<Character | null> {
    try {
      const character = await this.repository.load(id);
      if (!character) return null;
      
      return characterSchema.parse(character);
    } catch (error) {
      console.error(`Failed to load character ${id}:`, error);
      // Return null so the caller can handle the missing character
      return null;
    }
  }

  async getAllCharacters(): Promise<Character[]> {
    try {
      const characters = await this.repository.list();
      // Filter out any characters that fail validation instead of throwing
      const validCharacters: Character[] = [];
      
      for (const char of characters) {
        try {
          const validatedChar = characterSchema.parse(char);
          validCharacters.push(validatedChar);
        } catch (error) {
          console.error(`Failed to validate character ${char.id || 'unknown'}:`, error);
          // Skip invalid characters instead of failing entirely
        }
      }
      
      return validCharacters;
    } catch (error) {
      console.error('Failed to load character list:', error);
      return [];
    }
  }

  async updateCharacter(character: Character): Promise<void> {
    const validated = characterSchema.parse(character);
    await this.repository.save(validated);
  }

  async deleteCharacter(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async updateLastPlayed(characterId: string): Promise<void> {
    const character = await this.getCharacter(characterId);
    if (character) {
      character.updatedAt = new Date();
      await this.updateCharacter(character);
    }
  }

  async createCharacterWithDefaults(name: string, classId: string = 'fighter'): Promise<Character> {
    const characterId = `character-${Date.now()}`;
    const config = createDefaultCharacterConfiguration();
    const classDefinition = getClassDefinition(classId);
    
    if (!classDefinition) {
      throw new Error(`Class not found: ${classId}`);
    }

    const hitPoints = createDefaultHitPoints(classDefinition.startingHP);
    const hitDice = createDefaultHitDice(1, classDefinition.hitDieSize);
    const proficiencies = createDefaultProficiencies(classDefinition);
    
    const character = await this.createCharacter({
      name,
      level: 1,
      classId,
      grantedFeatures: [], // No features granted yet
      proficiencies,
      attributes: { strength: 0, dexterity: 0, intelligence: 0, will: 0 },
      hitPoints,
      hitDice,
      wounds: { current: 0, max: config.maxWounds },
      config,
      initiative: { name: 'Initiative', associatedAttribute: 'dexterity', modifier: 0 },
      actionTracker: { current: 3, base: 3, bonus: 0 },
      inEncounter: false,
      skills: {
        arcana: { name: 'Arcana', associatedAttribute: 'intelligence', modifier: 0 },
        examination: { name: 'Examination', associatedAttribute: 'intelligence', modifier: 0 },
        finesse: { name: 'Finesse', associatedAttribute: 'dexterity', modifier: 0 },
        influence: { name: 'Influence', associatedAttribute: 'will', modifier: 0 },
        insight: { name: 'Insight', associatedAttribute: 'will', modifier: 0 },
        might: { name: 'Might', associatedAttribute: 'strength', modifier: 0 },
        lore: { name: 'Lore', associatedAttribute: 'intelligence', modifier: 0 },
        naturecraft: { name: 'Naturecraft', associatedAttribute: 'will', modifier: 0 },
        perception: { name: 'Perception', associatedAttribute: 'will', modifier: 0 },
        stealth: { name: 'Stealth', associatedAttribute: 'will', modifier: 0 },
      },
      inventory: { maxSize: config.maxInventorySize + 0, items: [] }, // config.maxInventorySize + strength (0 for new characters)
      abilities: { abilities: [] },
    }, characterId);

    return character;
  }

}

export const characterStorageService = new CharacterStorageService();