import { Character, CreateCharacterData } from '../types/character';
import { ICharacterRepository, LocalStorageCharacterRepository } from '../storage/character-repository';
import { createCharacterSchema, characterSchema } from '../schemas/character';

export class CharacterService {
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
}

export const characterService = new CharacterService();