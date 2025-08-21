import { useCallback } from "react";
import { Character, AttributeName, SkillName } from "@/lib/types/character";
import { Inventory as InventoryType } from "@/lib/types/inventory";

interface UseCharacterUpdatesProps {
  character: Character;
  onCharacterUpdate: (character: Character) => void;
}

export function useCharacterUpdates({ character, onCharacterUpdate }: UseCharacterUpdatesProps) {
  const updateName = useCallback((name: string) => {
    const updated = { ...character, name };
    onCharacterUpdate(updated);
  }, [character, onCharacterUpdate]);

  const updateCharacter = useCallback((updated: Character) => {
    onCharacterUpdate(updated);
  }, [onCharacterUpdate]);

  const updateAttribute = useCallback((attributeName: AttributeName, value: number) => {
    const updated = {
      ...character,
      attributes: {
        ...character.attributes,
        [attributeName]: value,
      },
    };
    onCharacterUpdate(updated);
  }, [character, onCharacterUpdate]);

  const handleAttributeChange = useCallback((attributeName: AttributeName, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= -2 && numValue <= 10) {
      updateAttribute(attributeName, numValue);
    }
  }, [updateAttribute]);

  const updateSkill = useCallback((skillName: SkillName, modifier: number) => {
    const updated = {
      ...character,
      skills: {
        ...character.skills,
        [skillName]: {
          ...character.skills[skillName],
          modifier,
        },
      },
    };
    onCharacterUpdate(updated);
  }, [character, onCharacterUpdate]);

  const handleSkillChange = useCallback((skillName: SkillName, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 20) {
      updateSkill(skillName, numValue);
    }
  }, [updateSkill]);

  const updateInventory = useCallback((inventory: InventoryType) => {
    const updated = {
      ...character,
      inventory,
    };
    onCharacterUpdate(updated);
  }, [character, onCharacterUpdate]);

  const updateInitiative = useCallback((modifier: number) => {
    const updated = {
      ...character,
      initiative: {
        ...character.initiative,
        modifier,
      },
    };
    onCharacterUpdate(updated);
  }, [character, onCharacterUpdate]);

  return {
    updateName,
    updateCharacter,
    updateAttribute,
    handleAttributeChange,
    updateSkill,
    handleSkillChange,
    updateInventory,
    updateInitiative,
  };
}