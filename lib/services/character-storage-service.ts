import { Character, CreateCharacterData } from '../types/character';
import { ICharacterRepository, LocalStorageCharacterRepository } from '../storage/character-repository';
import { createCharacterSchema, characterSchema } from '../schemas/character';

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


}

export const characterStorageService = new CharacterStorageService();