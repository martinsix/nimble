import { useLocalStorage } from "./use-local-storage";
import { Character } from "@/lib/types/character";

const CHARACTERS_STORAGE_KEY = "nimble-navigator-characters";

/**
 * Custom hook for managing character storage with localStorage persistence
 */
export function useCharacterStorage() {
  const [characters, setCharacters] = useLocalStorage<Character[]>(
    CHARACTERS_STORAGE_KEY,
    []
  );

  const saveCharacter = (character: Character) => {
    setCharacters((prev) => {
      const index = prev.findIndex((c) => c.id === character.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = character;
        return updated;
      } else {
        return [...prev, character];
      }
    });
  };

  const getCharacter = (id: string) => {
    return characters.find((c) => c.id === id) || null;
  };

  const deleteCharacter = (id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  const getAllCharacters = () => {
    return characters;
  };

  const clearAllCharacters = () => {
    setCharacters([]);
  };

  return {
    characters,
    saveCharacter,
    getCharacter,
    deleteCharacter,
    getAllCharacters,
    clearAllCharacters,
  };
}
