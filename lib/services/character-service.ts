import { Character, CreateCharacterData } from '../types/character';
import { ICharacterRepository, LocalStorageCharacterRepository } from '../storage/character-repository';
import { createCharacterSchema, characterSchema } from '../schemas/character';

export class CharacterService {
  private readonly characterListStorageKey = 'nimble-navigator-character-list';
  
  constructor(private repository: ICharacterRepository = new LocalStorageCharacterRepository()) {}

  async createCharacter(data: CreateCharacterData, id?: string): Promise<Character> {
    const validated = createCharacterSchema.parse(data);
    return this.repository.create(validated, id);
  }

  async getCharacter(id: string): Promise<Character | null> {
    const character = await this.repository.load(id);
    if (!character) return null;
    
    return characterSchema.parse(character);
  }

  async getAllCharacters(): Promise<Character[]> {
    const characters = await this.repository.list();
    return characters.map(char => characterSchema.parse(char));
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

  async createCharacterWithDefaults(name: string): Promise<Character> {
    const characterId = `character-${Date.now()}`;
    const character = await this.createCharacter({
      name,
      level: 1,
      attributes: { strength: 0, dexterity: 0, intelligence: 0, will: 0 },
      hitPoints: { current: 10, max: 10, temporary: 0 },
      hitDice: { size: 8, current: 1, max: 1 },
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
      inventory: { maxSize: 10, items: [] },
      abilities: { abilities: [] },
    }, characterId);

    return character;
  }
}

export const characterService = new CharacterService();