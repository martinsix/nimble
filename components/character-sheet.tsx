"use client";

import { useState } from "react";
import { Character, CharacterConfiguration } from "@/lib/types/character";
import { CharacterResource } from "@/lib/types/resources";
import { AppMode } from "@/lib/services/settings-service";
import { CharacterConfigDialog } from "./character-config-dialog";
import { useCharacterActions } from "@/lib/contexts/character-actions-context";
import { useCharacterUpdates } from "@/lib/hooks/use-character-updates";
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

  // Get context values
  const {
    onCharacterUpdate,
    onUpdateCharacterConfiguration,
  } = useCharacterActions();

  // Extract character update logic to custom hook
  const {
    updateName,
  } = useCharacterUpdates({ character, onCharacterUpdate });

  const handleOpenConfig = () => {
    setIsConfigDialogOpen(true);
  };

  const handleConfigSave = async (config: CharacterConfiguration, resources: CharacterResource[], maxHP: number) => {
    // Update character configuration
    await onUpdateCharacterConfiguration(config);
    
    // Update character's resources and max HP directly
    const updatedCharacter: Character = {
      ...character,
      config,
      resources,
      hitPoints: {
        ...character.hitPoints,
        max: maxHP,
        // Ensure current HP doesn't exceed new max
        current: Math.min(character.hitPoints.current, maxHP)
      }
    };
    
    await onCharacterUpdate(updatedCharacter);
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