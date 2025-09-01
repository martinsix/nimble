import { useState, useEffect, useCallback } from 'react';
import { Character } from '@/lib/types/character';
import { AppSettings } from '@/lib/services/settings-service';
import { 
  getCharacterStorage, 
  getCharacterService, 
  getCharacterCreation, 
  getSettingsService 
} from '@/lib/services/service-factory';
import { useToastService } from './use-toast-service';
import { useCharacterEvents } from './use-character-events';

export interface UseCharacterManagementReturn {
  character: Character | null;
  characters: Character[];
  settings: AppSettings;
  isLoaded: boolean;
  loadError: string | null;
  showCharacterSelection: boolean;
  handleCharacterUpdate: (character: Character) => Promise<void>;
  handleSettingsChange: (settings: AppSettings) => Promise<void>;
}

export function useCharacterManagement(): UseCharacterManagementReturn {
  const [character, setCharacter] = useState<Character | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ mode: 'full', activeCharacterId: 'default-character' });
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showCharacterSelection, setShowCharacterSelection] = useState(false);

  // Get services from the factory (services are singletons, safe to call directly)
  const characterStorage = getCharacterStorage();
  const characterCreation = getCharacterCreation();
  const settingsService = getSettingsService();
  
  // Get toast notifications and character events
  const { showError, showSuccess } = useToastService();
  const { subscribeToEvent } = useCharacterEvents();

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load settings
        const loadedSettings = await settingsService.getSettings();
        setSettings(loadedSettings);

        // Load character list
        const characterList = await characterStorage.getAllCharacters();
        setCharacters(characterList);

        // Load active character through CharacterService
        let activeCharacter = await characterCreation.initializeCharacter(loadedSettings.activeCharacterId);
        if (!activeCharacter) {
          // If no characters exist, show character selection
          if (characterList.length === 0) {
            setShowCharacterSelection(true);
            setLoadError("No characters found. Please create your first character.");
          } else {
            // Use the first available character instead of creating a default
            try {
              const firstCharacter = characterList[0];
              activeCharacter = await characterCreation.initializeCharacter(firstCharacter.id);
              
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
        showError("Failed to load application", "Unable to load character data. Please try again or create a new character.");
        setShowCharacterSelection(true);
        setLoadError("Failed to load application data. Please try selecting or creating a character.");
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Services are singletons, safe to omit from dependencies

  // Subscribe to character updates from the service
  useEffect(() => {
    // Get service instance inside effect to avoid dependency issues
    const service = getCharacterService();
    const unsubscribe = service.subscribeToCharacter((updatedCharacter) => {
      setCharacter(updatedCharacter);
    });

    return unsubscribe;
  }, []); // Empty dependencies - service is singleton

  // Subscribe to character events to update local state
  useEffect(() => {
    const unsubscribeCreated = subscribeToEvent('created', async (event) => {
      // Refresh character list and update settings
      const updatedCharacters = await characterStorage.getAllCharacters();
      setCharacters(updatedCharacters);
      
      const newSettings = await settingsService.getSettings();
      setSettings(newSettings);
      
      // Hide character selection if it was showing
      setShowCharacterSelection(false);
      setLoadError(null);
    });

    const unsubscribeSwitched = subscribeToEvent('switched', async (event) => {
      // Refresh character list (for last played timestamps) and update settings
      const updatedCharacters = await characterStorage.getAllCharacters();
      setCharacters(updatedCharacters);
      
      const newSettings = await settingsService.getSettings();
      setSettings(newSettings);
      
      // Hide character selection if it was showing
      setShowCharacterSelection(false);
      setLoadError(null);
    });

    const unsubscribeDeleted = subscribeToEvent('deleted', async (event) => {
      // Refresh character list and settings
      const updatedCharacters = await characterStorage.getAllCharacters();
      setCharacters(updatedCharacters);
      
      const newSettings = await settingsService.getSettings();
      setSettings(newSettings);
      
      // Show character selection if no characters left
      if (updatedCharacters.length === 0) {
        setCharacter(null);
        setShowCharacterSelection(true);
        setLoadError("No characters remaining. Please create a new character.");
      }
    });

    return () => {
      unsubscribeCreated();
      unsubscribeSwitched();
      unsubscribeDeleted();
    };
  }, [subscribeToEvent, characterStorage, settingsService]);


  const handleCharacterUpdate = async (updatedCharacter: Character) => {
    // Update through the service, which will trigger the subscription
    const characterService = getCharacterService();
    await characterService.updateCharacter(updatedCharacter);
    
    try {
      // Refresh the character list to reflect name changes
      const updatedCharacterList = await characterStorage.getAllCharacters();
      setCharacters(updatedCharacterList);
    } catch (error) {
      console.error("Failed to refresh character list:", error);
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
    handleSettingsChange,
  };
}