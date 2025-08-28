"use client";

import { TabbedCharacterSheet } from "@/components/tabbed-character-sheet";
import { CharacterHeader } from "@/components/character-sheet/character-header";
import { CharacterSelector } from "@/components/character-selector";
import { CharacterConfigDialog } from "@/components/character-config-dialog";
import { TopBar } from "@/components/top-bar";
import { useCharacterManagement } from "@/lib/hooks/use-character-management";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LoadingScreen } from "@/components/loading-screen";
import { ToastContainer } from "@/components/toast-container";
import { useCallback, useEffect, useState } from "react";

function HomeContent() {
  // Character and settings management
  const {
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
  } = useCharacterManagement();

  // Character config dialog state
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  // Simple name change handler for character header
  const onNameChange = useCallback(async (name: string) => {
    if (character) {
      const updatedCharacter = { ...character, name };
      await handleCharacterUpdate(updatedCharacter);
    }
  }, [character, handleCharacterUpdate]);

  // Character config handlers
  const onOpenConfig = useCallback(() => {
    setShowConfigDialog(true);
  }, []);

  const onCloseConfig = useCallback(() => {
    setShowConfigDialog(false);
  }, []);


  // Update page title based on character name
  useEffect(() => {
    if (character) {
      document.title = `Nimble Navigator - ${character.name}`;
    } else {
      document.title = "Nimble Navigator";
    }
  }, [character]);

  if (!isLoaded) {
    return <LoadingScreen message="Loading character data..." />;
  }

  if (showCharacterSelection || !character) {
    return (
      <CharacterSelector
        fullScreen={true}
        characters={characters}
        activeCharacterId={character?.id}
        onCharacterSwitch={handleCharacterSelectionSwitch}
        onCharacterDelete={handleCharacterDelete}
        onCharacterCreate={handleCharacterSelectionCreate}
        errorMessage={loadError || undefined}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <TopBar 
        settings={settings}
        characters={characters}
        onSettingsChange={handleSettingsChange}
        onCharacterSwitch={handleCharacterSwitch}
        onCharacterDelete={handleCharacterDelete}
      />
      <div className="container mx-auto py-6 px-4 space-y-6">
        <CharacterHeader 
          onNameChange={onNameChange}
          onOpenConfig={onOpenConfig}
        />
        <TabbedCharacterSheet />
      </div>
      
      {/* Character Config Dialog */}
      {showConfigDialog && (
        <CharacterConfigDialog
          onClose={onCloseConfig}
        />
      )}
    </main>
  );
}

export default function Home() {
  return (
    <ErrorBoundary>
      <HomeContent />
      <ToastContainer />
    </ErrorBoundary>
  );
}