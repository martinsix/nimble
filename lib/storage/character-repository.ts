import { Character, CreateCharacterData } from '../types/character';
import { createDefaultCharacterConfiguration, createDefaultProficiencies } from '../utils/character-defaults';
import { getClassDefinition } from '../data/classes/index';

export interface ICharacterRepository {
  save(character: Character): Promise<void>;
  load(id: string): Promise<Character | null>;
  list(): Promise<Character[]>;
  delete(id: string): Promise<void>;
  create(data: CreateCharacterData, id?: string): Promise<Character>;
}

export class LocalStorageCharacterRepository implements ICharacterRepository {
  private readonly storageKey = 'nimble-navigator-characters';

  async save(character: Character): Promise<void> {
    const characters = await this.list();
    const index = characters.findIndex(c => c.id === character.id);
    
    character.updatedAt = new Date();
    
    if (index >= 0) {
      characters[index] = character;
    } else {
      characters.push(character);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(characters));
  }

  async load(id: string): Promise<Character | null> {
    const characters = await this.list();
    return characters.find(c => c.id === id) || null;
  }

  async list(): Promise<Character[]> {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return [];
    
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((char: any) => {
        const classId = char.classId || 'fighter'; // Default to fighter for existing characters
        const classDefinition = getClassDefinition(classId);
        
        return {
          ...char,
          createdAt: new Date(char.createdAt),
          updatedAt: new Date(char.updatedAt),
          // Migrate characters missing config field
          config: char.config || createDefaultCharacterConfiguration(),
          // Migrate characters missing class fields
          classId,
          grantedFeatures: char.grantedFeatures || [], // Start with no granted features
          // Migrate characters missing proficiencies field
          proficiencies: char.proficiencies || createDefaultProficiencies(classDefinition || undefined),
        };
      });
    } catch {
      return [];
    }
  }

  async delete(id: string): Promise<void> {
    const characters = await this.list();
    const filtered = characters.filter(c => c.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  async create(data: CreateCharacterData, id?: string): Promise<Character> {
    const character: Character = {
      id: id || crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await this.save(character);
    return character;
  }
}