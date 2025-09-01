"use client";

import { CharacterHeader } from "@/components/character-sheet/character-header";
import { CharacterConfigDialog } from "@/components/character-config-dialog";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { useCallback, useEffect, useState } from "react";

export default function CharacterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { character, updateCharacter } = useCharacterService();
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  // Simple name change handler for character header
  const onNameChange = useCallback(
    async (name: string) => {
      if (character) {
        const updatedCharacter = { ...character, name };
        await updateCharacter(updatedCharacter);
      }
    },
    [character, updateCharacter]
  );

  // Character config handlers
  const onOpenConfig = useCallback(() => {
    setShowConfigDialog(true);
  }, []);

  const onCloseConfig = useCallback(() => {
    setShowConfigDialog(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 space-y-6">
        <CharacterHeader
          onNameChange={onNameChange}
          onOpenConfig={onOpenConfig}
        />
        {children}
      </div>

      {/* Character Config Dialog */}
      {showConfigDialog && <CharacterConfigDialog onClose={onCloseConfig} />}
    </div>
  );
}
