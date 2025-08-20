"use client";

import { CharacterSheet } from "@/components/character-sheet";
import { ActivityLog } from "@/components/activity-log";
import { AttributeName, SkillName, ActionTracker } from "@/lib/types/character";
import { Abilities } from "@/lib/types/abilities";
import { AppMenu } from "@/components/app-menu";
import { CharacterSelector } from "@/components/character-selector";
import { useCharacterManagement } from "@/lib/hooks/use-character-management";
import { useDiceActions } from "@/lib/hooks/use-dice-actions";
import { useCombatActions } from "@/lib/hooks/use-combat-actions";
import { useActivityLog } from "@/lib/hooks/use-activity-log";

export default function Home() {
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

  // Activity log management
  const { logEntries, addLogEntry, handleClearRolls } = useActivityLog();

  // Dice rolling actions
  const { handleRollAttribute, handleRollSave, handleRollSkill, handleAttack, handleRollInitiative } = useDiceActions(addLogEntry);

  // Combat and encounter actions
  const {
    handleUpdateActions,
    handleEndEncounter,
    handleUpdateAbilities,
    handleEndTurn,
    handleUseAbility,
    handleCatchBreath,
    handleMakeCamp,
    handleSafeRest,
  } = useCombatActions();



  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading character...</div>
      </main>
    );
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </main>
    );
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
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Nimble Navigator</h1>
          <AppMenu 
            settings={settings}
            characters={characters}
            onSettingsChange={handleSettingsChange}
            onCharacterSwitch={handleCharacterSwitch}
            onCharacterDelete={handleCharacterDelete}
          />
        </div>
        <CharacterSheet 
          character={character}
          mode={settings.mode}
          onUpdate={handleCharacterUpdate} 
          onRollAttribute={handleRollAttribute}
          onRollSave={handleRollSave}
          onRollSkill={(skillName, attributeValue, skillModifier, advantageLevel) => 
            handleRollSkill(character!, skillName, attributeValue, skillModifier, advantageLevel)}
          onRollInitiative={(totalModifier, advantageLevel) => 
            handleRollInitiative(character!, totalModifier, advantageLevel, handleCharacterUpdate)}
          onAttack={handleAttack}
          onUpdateActions={(actionTracker) => 
            handleUpdateActions(character!, actionTracker)}
          onEndEncounter={() => 
            handleEndEncounter(character!, handleCharacterUpdate)}
          onUpdateAbilities={(abilities) => 
            handleUpdateAbilities(character!, abilities)}
          onEndTurn={(actionTracker, abilities) => 
            handleEndTurn(character!, actionTracker, abilities, handleCharacterUpdate)}
          onUseAbility={(abilityId) => 
            handleUseAbility(character!, abilityId, handleCharacterUpdate, addLogEntry)}
          onCatchBreath={() => 
            handleCatchBreath(character!, handleCharacterUpdate, addLogEntry)}
          onMakeCamp={() => 
            handleMakeCamp(character!, handleCharacterUpdate, addLogEntry)}
          onSafeRest={() => 
            handleSafeRest(character!, handleCharacterUpdate, addLogEntry)}
        />
        <ActivityLog entries={logEntries} onClearRolls={handleClearRolls} />
      </div>
    </main>
  );
}