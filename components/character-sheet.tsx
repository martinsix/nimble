"use client";

import { useState } from "react";
import { Character, CharacterConfiguration } from "@/lib/types/character";
import { CharacterResource } from "@/lib/types/resources";
import { AppMode } from "@/lib/services/settings-service";
import { CharacterConfigDialog } from "./character-config-dialog";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { CharacterSheetLayout } from "./character-sheet/character-sheet-layout";
import { CharacterHeader } from "./character-sheet/character-header";
import { BasicMode } from "./character-sheet/basic-mode";
import { FullMode } from "./character-sheet/full-mode";

interface CharacterSheetProps {
  character: Character;
  mode: AppMode;
}

export function CharacterSheet({ character, mode }: CharacterSheetProps) {
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  // Get service methods for character updates
  const { updateCharacter, updateCharacterConfiguration } = useCharacterService();

  // Simple name update function
  const updateName = (name: string) => {
    const updated = { ...character, name };
    updateCharacter(updated);
  };

  const handleOpenConfig = () => {
    setIsConfigDialogOpen(true);
  };

  const handleConfigSave = async (config: CharacterConfiguration, resources: CharacterResource[], maxHP: number, maxWounds: number) => {
    // Update character configuration
    await updateCharacterConfiguration(config);
    
    // Update character's resources, max HP, and max wounds directly
    const updatedCharacter: Character = {
      ...character,
      config,
      resources,
      hitPoints: {
        ...character.hitPoints,
        max: maxHP,
        // Ensure current HP doesn't exceed new max
        current: Math.min(character.hitPoints.current, maxHP)
      },
      wounds: {
        ...character.wounds,
        max: maxWounds,
        // Ensure current wounds don't exceed new max
        current: Math.min(character.wounds.current, maxWounds)
      }
    };
    
    await updateCharacter(updatedCharacter);
  };

  return (
    <CharacterSheetLayout>
      {/* Character Header - Name, Class Info, Advantage Toggle */}
      <CharacterHeader
        onNameChange={updateName}
        onOpenConfig={handleOpenConfig}
      />

      {/* Mode-based rendering - complete independence per mode */}
      {mode === 'basic' ? (
        <BasicMode />
      ) : (
        <FullMode />
      )}

      {/* Character Configuration Dialog */}
      <CharacterConfigDialog
        character={character}
        isOpen={isConfigDialogOpen}
        onClose={() => setIsConfigDialogOpen(false)}
        onSave={handleConfigSave}
      />
    </CharacterSheetLayout>
  );
}