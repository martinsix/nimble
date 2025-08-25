"use client";

import { useState } from "react";
import { Character } from "@/lib/types/character";
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
  const { updateCharacter } = useCharacterService();

  // Simple name update function
  const updateName = (name: string) => {
    const updated = { ...character, name };
    updateCharacter(updated);
  };

  const handleOpenConfig = () => {
    setIsConfigDialogOpen(true);
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
      {isConfigDialogOpen && (
        <CharacterConfigDialog
          onClose={() => setIsConfigDialogOpen(false)}
        />
      )}
    </CharacterSheetLayout>
  );
}