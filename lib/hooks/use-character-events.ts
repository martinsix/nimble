import { useEffect, useCallback } from 'react';
import { Character } from '@/lib/types/character';
import { 
  getCharacterStorage, 
  getCharacterService, 
  getCharacterCreation, 
  getSettingsService 
} from '@/lib/services/service-factory';
import { useToastService } from './use-toast-service';

type CharacterEventType = 'created' | 'switched' | 'deleted' | 'updated';

interface CharacterEvent {
  type: CharacterEventType;
  characterId: string;
  character?: Character;
}

class CharacterEventEmitter {
  private listeners: Map<string, ((event: CharacterEvent) => void)[]> = new Map();

  subscribe(eventType: CharacterEventType, listener: (event: CharacterEvent) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  emit(event: CharacterEvent) {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => listener(event));
    }
  }
}

// Singleton event emitter
const characterEventEmitter = new CharacterEventEmitter();

export function useCharacterEvents() {
  const { showError, showSuccess } = useToastService();
  const characterStorage = getCharacterStorage();
  const characterCreation = getCharacterCreation();
  const settingsService = getSettingsService();

  const createCharacter = useCallback(async (name: string, classId: string) => {
    try {
      const newCharacter = await characterCreation.createSampleCharacter(name, classId);
      
      // Switch to the new character (it's already initialized)
      const characterService = getCharacterService();
      await characterService.loadCharacter(newCharacter.id);
      
      // Update settings
      const settings = await settingsService.getSettings();
      const newSettings = { ...settings, activeCharacterId: newCharacter.id };
      await settingsService.saveSettings(newSettings);
      
      // Emit event
      characterEventEmitter.emit({
        type: 'created',
        characterId: newCharacter.id,
        character: newCharacter
      });

      showSuccess("Character created", `${name} has been created successfully!`);
    } catch (error) {
      console.error("Failed to create character:", error);
      showError("Failed to create character", "Unable to create the character. Please try again.");
      throw error;
    }
  }, [characterCreation, settingsService, showError, showSuccess]);

  const switchCharacter = useCallback(async (characterId: string) => {
    try {
      const characterService = getCharacterService();
      const newCharacter = await characterService.loadCharacter(characterId);
      
      if (newCharacter) {
        // Update settings with new active character
        const settings = await settingsService.getSettings();
        const newSettings = { ...settings, activeCharacterId: characterId };
        await settingsService.saveSettings(newSettings);
        
        // Update last played timestamp
        await characterStorage.updateLastPlayed(characterId);
        
        // Emit event
        characterEventEmitter.emit({
          type: 'switched',
          characterId,
          character: newCharacter
        });
      }
    } catch (error) {
      console.error("Failed to switch character:", error);
      showError("Failed to switch character", "Unable to load the selected character. Please try again.");
      throw error;
    }
  }, [characterStorage, settingsService, showError]);

  const deleteCharacter = useCallback(async (characterId: string) => {
    try {
      await characterStorage.deleteCharacter(characterId);
      
      const updatedCharacterList = await characterStorage.getAllCharacters();
      const settings = await settingsService.getSettings();
      
      // If we deleted the active character, switch to another one
      if (characterId === settings.activeCharacterId && updatedCharacterList.length > 0) {
        const newActiveCharacter = updatedCharacterList[0];
        await switchCharacter(newActiveCharacter.id);
      } else if (updatedCharacterList.length === 0) {
        // If no characters left, clear active character
        const newSettings = { ...settings, activeCharacterId: '' };
        await settingsService.saveSettings(newSettings);
      }
      
      // Emit event
      characterEventEmitter.emit({
        type: 'deleted',
        characterId
      });

      showSuccess("Character deleted", "Character has been deleted successfully.");
    } catch (error) {
      console.error("Failed to delete character:", error);
      showError("Failed to delete character", "Unable to delete the character. Please try again.");
      throw error;
    }
  }, [characterStorage, settingsService, switchCharacter, showError, showSuccess]);

  const subscribeToEvent = useCallback((eventType: CharacterEventType, listener: (event: CharacterEvent) => void) => {
    return characterEventEmitter.subscribe(eventType, listener);
  }, []);

  return {
    createCharacter,
    switchCharacter,
    deleteCharacter,
    subscribeToEvent
  };
}

// Hook for components that only need to listen to character events
export function useCharacterEventListener(eventType: CharacterEventType, listener: (event: CharacterEvent) => void) {
  useEffect(() => {
    const unsubscribe = characterEventEmitter.subscribe(eventType, listener);
    return unsubscribe;
  }, [eventType, listener]);
}