"use client";

import { CharacterSheet } from "@/components/character-sheet";
import { ActivityLog } from "@/components/activity-log";
import { AttributeName, SkillName, ActionTracker, CharacterConfiguration } from "@/lib/types/character";
import { Abilities } from "@/lib/types/abilities";
import { AppMenu } from "@/components/app-menu";
import { CharacterSelector } from "@/components/character-selector";
import { useCharacterManagement } from "@/lib/hooks/use-character-management";
import { useDiceActions } from "@/lib/hooks/use-dice-actions";
import { useCombatActions } from "@/lib/hooks/use-combat-actions";
import { useActivityLog } from "@/lib/hooks/use-activity-log";
import { CharacterActionsProvider } from "@/lib/contexts/character-actions-context";
import { UIStateProvider } from "@/lib/contexts/ui-state-context";
import { ToastProvider } from "@/lib/contexts/toast-context";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getCharacterService } from "@/lib/services/service-factory";

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

  // Character actions context value
  const characterActionsValue = {
    character,
    onCharacterUpdate: handleCharacterUpdate,
    onApplyDamage: async (amount: number, targetType?: 'hp' | 'temp_hp') => {
      const characterService = getCharacterService();
      await characterService.applyDamage(amount, targetType);
    },
    onApplyHealing: async (amount: number) => {
      const characterService = getCharacterService();
      await characterService.applyHealing(amount);
    },
    onApplyTemporaryHP: async (amount: number) => {
      const characterService = getCharacterService();
      await characterService.applyTemporaryHP(amount);
    },
    onSpendMana: async (amount: number) => {
      const characterService = getCharacterService();
      await characterService.spendMana(amount);
    },
    onRestoreMana: async (amount: number) => {
      const characterService = getCharacterService();
      await characterService.restoreMana(amount);
    },
    onUpdateCharacterConfiguration: async (config: CharacterConfiguration) => {
      const characterService = getCharacterService();
      await characterService.updateCharacterConfiguration(config);
    },
    onRollAttribute: handleRollAttribute,
    onRollSave: handleRollSave,
    onRollSkill: (skillName: SkillName, attributeValue: number, skillModifier: number, advantageLevel: number) => 
      handleRollSkill(character!, skillName, attributeValue, skillModifier, advantageLevel),
    onRollInitiative: (totalModifier: number, advantageLevel: number) => 
      handleRollInitiative(character!, totalModifier, advantageLevel, handleCharacterUpdate),
    onAttack: handleAttack,
    onUpdateActions: (actionTracker: ActionTracker) => 
      handleUpdateActions(character!, actionTracker),
    onEndEncounter: () => 
      handleEndEncounter(character!, handleCharacterUpdate),
    onUpdateAbilities: (abilities: Abilities) => 
      handleUpdateAbilities(character!, abilities),
    onEndTurn: (actionTracker: ActionTracker, abilities: Abilities) => 
      handleEndTurn(character!, actionTracker, abilities, handleCharacterUpdate),
    onUseAbility: (abilityId: string) => 
      handleUseAbility(character!, abilityId, handleCharacterUpdate, addLogEntry),
    onCatchBreath: () => 
      handleCatchBreath(character!, handleCharacterUpdate, addLogEntry),
    onMakeCamp: () => 
      handleMakeCamp(character!, handleCharacterUpdate, addLogEntry),
    onSafeRest: () => 
      handleSafeRest(character!, handleCharacterUpdate, addLogEntry),
    addLogEntry,
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <CharacterActionsProvider value={characterActionsValue}>
          <UIStateProvider>
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
                />
                <ActivityLog entries={logEntries} onClearRolls={handleClearRolls} />
              </div>
            </main>
          </UIStateProvider>
        </CharacterActionsProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}