import { useState, useEffect, useCallback } from 'react';
import { Character } from '@/lib/types/character';
import { AppSettings } from '@/lib/services/settings-service';
import { characterStorageService } from '@/lib/services/character-storage-service';
import { characterService } from '@/lib/services/character-service';
import { characterCreationService } from '@/lib/services/character-creation-service';
import { settingsService } from '@/lib/services/settings-service';

export interface UseCharacterManagementReturn {
  character: Character | null;
  characters: Character[];
  settings: AppSettings;
  isLoaded: boolean;
  loadError: string | null;
  showCharacterSelection: boolean;
  handleCharacterUpdate: (character: Character) => Promise<void>;
  handleCharacterSwitch: (characterId: string) => Promise<void>;
  handleCharacterDelete: (characterId: string) => Promise<void>;
  handleCharacterSelectionCreate: (name: string, classId: string) => Promise<void>;
  handleCharacterSelectionSwitch: (characterId: string) => Promise<void>;
  handleSettingsChange: (settings: AppSettings) => Promise<void>;
}

export function useCharacterManagement(): UseCharacterManagementReturn {
  const [character, setCharacter] = useState<Character | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ mode: 'full', activeCharacterId: 'default-character' });
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showCharacterSelection, setShowCharacterSelection] = useState(false);

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load settings
        const loadedSettings = await settingsService.getSettings();
        setSettings(loadedSettings);

        // Load character list
        const characterList = await characterStorageService.getAllCharacters();
        setCharacters(characterList);

        // Load active character through CharacterService
        let activeCharacter = await characterCreationService.initializeCharacter(loadedSettings.activeCharacterId);
        if (!activeCharacter) {
          // If no characters exist, show character selection
          if (characterList.length === 0) {
            setShowCharacterSelection(true);
            setLoadError("No characters found. Please create your first character.");
          } else {
            // Use the first available character instead of creating a default
            try {
              const firstCharacter = characterList[0];
              activeCharacter = await characterCreationService.initializeCharacter(firstCharacter.id);
              
              if (activeCharacter) {
                // Update settings to reflect the new active character
                const newSettings = { ...loadedSettings, activeCharacterId: firstCharacter.id };
                await settingsService.saveSettings(newSettings);
                setSettings(newSettings);
              } else {
                throw new Error("Failed to initialize first available character");
              }
            } catch (initError) {
              console.error("Failed to initialize first character:", initError);
              setShowCharacterSelection(true);
              setLoadError("Failed to load character. Please select or create a character.");
            }
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setShowCharacterSelection(true);
        setLoadError("Failed to load application data. Please try selecting or creating a character.");
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // Subscribe to character updates from the service
  useEffect(() => {
    const unsubscribe = characterService.subscribeToCharacter((updatedCharacter) => {
      setCharacter(updatedCharacter);
    });

    return unsubscribe;
  }, []);

  // Listen for character creation events from the character selector
  useEffect(() => {
    const handleCreateCharacter = async (event: CustomEvent<string>) => {
      try {
        const characterName = event.detail;
        // Use the new character creation service with default fighter class
        const newCharacter = await characterCreationService.createSampleCharacter(characterName, 'fighter');
        
        const updatedCharacterList = await characterStorageService.getAllCharacters();
        setCharacters(updatedCharacterList);
        
        // Switch to the new character (it's already initialized)
        setCharacter(newCharacter);
        
        // Update settings
        const newSettings = { ...settings, activeCharacterId: newCharacter.id };
        await settingsService.saveSettings(newSettings);
        setSettings(newSettings);
      } catch (error) {
        console.error("Failed to create character:", error);
      }
    };

    window.addEventListener('createCharacter', handleCreateCharacter as unknown as EventListener);
    return () => {
      window.removeEventListener('createCharacter', handleCreateCharacter as unknown as EventListener);
    };
  }, [settings]);

  const handleCharacterUpdate = async (updatedCharacter: Character) => {
    // Update through the service, which will trigger the subscription
    await characterService.updateCharacter(updatedCharacter);
    
    try {
      // Refresh the character list to reflect name changes
      const updatedCharacterList = await characterStorageService.getAllCharacters();
      setCharacters(updatedCharacterList);
    } catch (error) {
      console.error("Failed to refresh character list:", error);
    }
  };

  const handleCharacterSwitch = useCallback(async (characterId: string) => {
    try {
      const newCharacter = await characterService.loadCharacter(characterId);
      if (newCharacter) {
        // Update settings with new active character
        const newSettings = { ...settings, activeCharacterId: characterId };
        setSettings(newSettings);
        await settingsService.saveSettings(newSettings);
        
        // Update last played timestamp
        await characterStorageService.updateLastPlayed(characterId);
        const updatedCharacterList = await characterStorageService.getAllCharacters();
        setCharacters(updatedCharacterList);
      }
    } catch (error) {
      console.error("Failed to switch character:", error);
    }
  }, [settings]);

  const handleCharacterDelete = async (characterId: string) => {
    try {
      await characterStorageService.deleteCharacter(characterId);
      
      const updatedCharacterList = await characterStorageService.getAllCharacters();
      setCharacters(updatedCharacterList);
      
      // If we deleted the active character, switch to another one
      if (characterId === settings.activeCharacterId && updatedCharacterList.length > 0) {
        const newActiveCharacter = updatedCharacterList[0];
        await handleCharacterSwitch(newActiveCharacter.id);
      } else if (updatedCharacterList.length === 0) {
        // If no characters left, show character selection
        setCharacter(null);
        setShowCharacterSelection(true);
        setLoadError("No characters remaining. Please create a new character.");
      }
    } catch (error) {
      console.error("Failed to delete character:", error);
    }
  };

  const handleCharacterSelectionCreate = async (name: string, classId: string) => {
    try {
      const newCharacter = await characterCreationService.createSampleCharacter(name, classId);
      
      // Update character list
      const updatedCharacters = await characterStorageService.getAllCharacters();
      setCharacters(updatedCharacters);
      
      // Switch to the new character (it's already initialized)
      setCharacter(newCharacter);
      
      // Update settings
      const newSettings = { ...settings, activeCharacterId: newCharacter.id };
      await settingsService.saveSettings(newSettings);
      setSettings(newSettings);
      
      // Hide character selection
      setShowCharacterSelection(false);
      setLoadError(null);
    } catch (error) {
      console.error("Failed to create character:", error);
      setLoadError("Failed to create character. Please try again.");
    }
  };

  const handleCharacterSelectionSwitch = async (characterId: string) => {
    try {
      // Use the character creation service to properly initialize the character
      const initializedCharacter = await characterCreationService.initializeCharacter(characterId);
      if (!initializedCharacter) {
        throw new Error("Failed to initialize character");
      }
      
      // Update state and settings
      setCharacter(initializedCharacter);
      const newSettings = { ...settings, activeCharacterId: characterId };
      await settingsService.saveSettings(newSettings);
      setSettings(newSettings);
      
      setShowCharacterSelection(false);
      setLoadError(null);
    } catch (error) {
      console.error("Failed to switch character:", error);
      setLoadError("Failed to load selected character. Please try another.");
    }
  };

  const handleSettingsChange = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await settingsService.saveSettings(newSettings);
  };

  return {
    character,
    characters,
    settings,
    isLoaded,
    loadError,
    showCharacterSelection,
    handleCharacterUpdate,
    handleCharacterSwitch,
    handleCharacterDelete,
    handleCharacterSelectionCreate,
    handleCharacterSelectionSwitch,
    handleSettingsChange,
  };
}