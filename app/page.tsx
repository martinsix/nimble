"use client";

import { TabbedCharacterSheet } from "@/components/tabbed-character-sheet";
import { CharacterHeader } from "@/components/character-sheet/character-header";
import { CharacterSelector } from "@/components/character-selector";
import { TopBar } from "@/components/top-bar";
import { useCharacterManagement } from "@/lib/hooks/use-character-management";
import { UIStateProvider } from "@/lib/contexts/ui-state-context";
import { ToastProvider } from "@/lib/contexts/toast-context";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LoadingScreen } from "@/components/loading-screen";
import { useCallback } from "react";

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

  // Simple name change handler for character header
  const onNameChange = useCallback(async (name: string) => {
    if (character) {
      const updatedCharacter = { ...character, name };
      await handleCharacterUpdate(updatedCharacter);
    }
  }, [character, handleCharacterUpdate]);

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
    <UIStateProvider>
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
            onOpenConfig={() => {/* TODO: implement config modal */}}
          />
          <TabbedCharacterSheet />
        </div>
      </main>
    </UIStateProvider>
  );
}

export default function Home() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <HomeContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}