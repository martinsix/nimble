"use client";

import { TabbedCharacterSheet } from "@/components/tabbed-character-sheet";
import { CharacterHeader } from "@/components/character-sheet/character-header";
import { AttributeName, SkillName, ActionTracker, CharacterConfiguration } from "@/lib/types/character";
import { Abilities } from "@/lib/types/abilities";
import { CharacterSelector } from "@/components/character-selector";
import { TopBar } from "@/components/top-bar";
import { useCharacterManagement } from "@/lib/hooks/use-character-management";
import { useDiceActions } from "@/lib/hooks/use-dice-actions";
import { useCombatActions } from "@/lib/hooks/use-combat-actions";
import { CharacterActionsProvider } from "@/lib/contexts/character-actions-context";
import { UIStateProvider } from "@/lib/contexts/ui-state-context";
import { ToastProvider } from "@/lib/contexts/toast-context";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getCharacterService } from "@/lib/services/service-factory";
import { useMemo, useCallback } from "react";
import { LoadingScreen } from "@/components/loading-screen";

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

  // Activity log management (handled by individual components via hooks)

  // Dice rolling actions
  const { rollAttribute, rollSave, rollSkill, attack, rollInitiative } = useDiceActions();

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

  // All memoization hooks must be called before any conditional returns
  // Memoize service action handlers to prevent recreation on every render
  const onApplyDamage = useCallback(async (amount: number, targetType?: 'hp' | 'temp_hp') => {
    const characterService = getCharacterService();
    await characterService.applyDamage(amount, targetType);
  }, []);

  const onNameChange = useCallback(async (name: string) => {
    if (character) {
      const updatedCharacter = { ...character, name };
      await handleCharacterUpdate(updatedCharacter);
    }
  }, [character, handleCharacterUpdate]);

  const onApplyHealing = useCallback(async (amount: number) => {
    const characterService = getCharacterService();
    await characterService.applyHealing(amount);
  }, []);

  const onApplyTemporaryHP = useCallback(async (amount: number) => {
    const characterService = getCharacterService();
    await characterService.applyTemporaryHP(amount);
  }, []);


  const onUpdateCharacterConfiguration = useCallback(async (config: CharacterConfiguration) => {
    const characterService = getCharacterService();
    await characterService.updateCharacterConfiguration(config);
  }, []);

  // Memoize action handlers that depend on character or other handlers
  const onRollSkill = useCallback((skillName: SkillName, attributeValue: number, skillModifier: number, advantageLevel: number) => 
    rollSkill(skillName, attributeValue, skillModifier, advantageLevel),
    [rollSkill]
  );

  const onRollInitiative = useCallback(async (totalModifier: number, advantageLevel: number) => {
    const result = await rollInitiative(totalModifier, advantageLevel);
    // Update character with new action tracker based on initiative result
    if (character) {
      const updatedCharacter = {
        ...character,
        inEncounter: true,
        actionTracker: {
          ...character.actionTracker,
          current: result.actionsGranted,
          bonus: 0
        }
      };
      handleCharacterUpdate(updatedCharacter);
    }
  }, [rollInitiative, character, handleCharacterUpdate]);

  const onUpdateActions = useCallback((actionTracker: ActionTracker) => 
    handleUpdateActions(character!, actionTracker),
    [character, handleUpdateActions]
  );

  const onEndEncounter = useCallback(() => 
    handleEndEncounter(character!, handleCharacterUpdate),
    [character, handleEndEncounter, handleCharacterUpdate]
  );

  const onUpdateAbilities = useCallback((abilities: Abilities) => 
    handleUpdateAbilities(character!, abilities),
    [character, handleUpdateAbilities]
  );

  const onEndTurn = useCallback((actionTracker: ActionTracker, abilities: Abilities) => 
    handleEndTurn(character!, actionTracker, abilities, handleCharacterUpdate),
    [character, handleEndTurn, handleCharacterUpdate]
  );

  const onUseAbility = useCallback((abilityId: string) => 
    handleUseAbility(character!, abilityId, handleCharacterUpdate, () => {}),
    [character, handleUseAbility, handleCharacterUpdate]
  );

  const onCatchBreath = useCallback(() => 
    handleCatchBreath(character!, handleCharacterUpdate, () => {}),
    [character, handleCatchBreath, handleCharacterUpdate]
  );

  const onMakeCamp = useCallback(() => 
    handleMakeCamp(character!, handleCharacterUpdate, () => {}),
    [character, handleMakeCamp, handleCharacterUpdate]
  );

  const onSafeRest = useCallback(() => 
    handleSafeRest(character!, handleCharacterUpdate, () => {}),
    [character, handleSafeRest, handleCharacterUpdate]
  );

  // Memoize the complete character actions context value to prevent unnecessary re-renders
  const characterActionsValue = useMemo(() => ({
    character,
    onCharacterUpdate: handleCharacterUpdate,
    onApplyDamage,
    onApplyHealing,
    onApplyTemporaryHP,
    onUpdateCharacterConfiguration,
    onRollAttribute: rollAttribute,
    onRollSave: rollSave,
    onRollSkill,
    onRollInitiative,
    onAttack: attack,
    onUpdateActions,
    onEndEncounter,
    onUpdateAbilities,
    onEndTurn,
    onUseAbility,
    onCatchBreath,
    onMakeCamp,
    onSafeRest,
  }), [
    character,
    handleCharacterUpdate,
    onApplyDamage,
    onApplyHealing,
    onApplyTemporaryHP,
    onUpdateCharacterConfiguration,
    rollAttribute,
    rollSave,
    onRollSkill,
    onRollInitiative,
    attack,
    onUpdateActions,
    onEndEncounter,
    onUpdateAbilities,
    onEndTurn,
    onUseAbility,
    onCatchBreath,
    onMakeCamp,
    onSafeRest,
  ]);

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
    <CharacterActionsProvider value={characterActionsValue}>
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
    </CharacterActionsProvider>
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