import { useState, useEffect } from 'react';
import { Character } from '../types/character';
import { getCharacterService } from '../services/service-factory';

/**
 * Custom hook that provides direct access to character service with automatic re-rendering.
 * Eliminates the need for React Context by subscribing to service changes directly.
 * 
 * This hook only provides character state and basic CRUD operations.
 * Use useDiceActions and useCombatActions for dice rolling and combat functionality.
 */
export function useCharacterService() {
  const [character, setCharacter] = useState<Character | null>(null);
  
  useEffect(() => {
    const characterService = getCharacterService();
    
    // Subscribe to character changes
    const unsubscribe = characterService.subscribeToCharacter((updatedCharacter) => {
      setCharacter(updatedCharacter);
    });
    
    // Initialize with current character
    setCharacter(characterService.getCurrentCharacter());
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);
  
  // Return both the character state and the service instance for method calls
  const characterService = getCharacterService();
  
  return {
    // State
    character,
    
    // Service methods - direct access to character operations
    updateCharacter: characterService.updateCharacter.bind(characterService),
    applyDamage: characterService.applyDamage.bind(characterService),
    applyHealing: characterService.applyHealing.bind(characterService),
    applyTemporaryHP: characterService.applyTemporaryHP.bind(characterService),
    updateActionTracker: characterService.updateActionTracker.bind(characterService),
    updateAbilities: characterService.updateAbilities.bind(characterService),
    startEncounter: characterService.startEncounter.bind(characterService),
    endEncounter: characterService.endEncounter.bind(characterService),
    endTurn: characterService.endTurn.bind(characterService),
    performSafeRest: characterService.performSafeRest.bind(characterService),
    updateCharacterConfiguration: characterService.updateCharacterConfiguration.bind(characterService),
  };
}