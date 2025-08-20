"use client";

import { useState, useEffect, useMemo } from "react";
import { Character, AttributeName, SkillName, ActionTracker, CharacterConfiguration } from "@/lib/types/character";
import { Inventory as InventoryType } from "@/lib/types/inventory";
import { Abilities } from "@/lib/types/abilities";
import { AbilityUsageEntry } from "@/lib/types/log-entries";
import { AppMode } from "@/lib/services/settings-service";
import { CharacterNameSection } from "./sections/character-name-section";
import { AdvantageToggle } from "./advantage-toggle";
import { ClassInfoSection } from "./sections/class-info-section";
import { ClassFeaturesSection } from "./sections/class-features-section";
import { HitPointsSection } from "./sections/hit-points-section";
import { HitDiceSection } from "./sections/hit-dice-section";
import { WoundsSection } from "./sections/wounds-section";
import { ManaSection } from "./sections/mana-section";
import { InitiativeSection } from "./sections/initiative-section";
import { ActionTrackerSection } from "./sections/action-tracker-section";
import { AttributesSection } from "./sections/attributes-section";
import { SkillsSection } from "./sections/skills-section";
import { ActionsSection } from "./sections/actions-section";
import { ArmorSection } from "./sections/armor-section";
import { AbilitySection } from "./sections/ability-section";
import { InventorySection } from "./sections/inventory-section";
import { CharacterConfigDialog } from "./character-config-dialog";
import { getCharacterService } from "@/lib/services/service-factory";
import { useCharacterActions } from "@/lib/contexts/character-actions-context";
import { useUIState } from "@/lib/contexts/ui-state-context";

interface CharacterSheetProps {
  character: Character;
  mode: AppMode;
}

export function CharacterSheet({ character, mode }: CharacterSheetProps) {
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  // Get character service from factory
  const characterService = useMemo(() => getCharacterService(), []);

  // Get context values
  const {
    onCharacterUpdate,
    onRollAttribute,
    onRollSave,
    onRollSkill,
    onRollInitiative,
    onAttack,
    onUpdateActions,
    onEndEncounter,
    onUpdateAbilities,
    onEndTurn,
    onUseAbility,
    onCatchBreath,
    onMakeCamp,
    onSafeRest,
  } = useCharacterActions();

  const { uiState, updateCollapsibleState, updateAdvantageLevel } = useUIState();


  const updateName = (name: string) => {
    const updated = { ...character, name };
    onCharacterUpdate(updated);
  };

  const updateCharacter = (updated: Character) => {
    onCharacterUpdate(updated);
  };

  const updateAttribute = (attributeName: AttributeName, value: number) => {
    const updated = {
      ...character,
      attributes: {
        ...character.attributes,
        [attributeName]: value,
      },
    };
    onCharacterUpdate(updated);
  };

  const handleAttributeChange = (attributeName: AttributeName, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= -2 && numValue <= 10) {
      updateAttribute(attributeName, numValue);
    }
  };

  const updateSkill = (skillName: SkillName, modifier: number) => {
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
  };

  const handleSkillChange = (skillName: SkillName, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 20) {
      updateSkill(skillName, numValue);
    }
  };

  const updateInventory = (inventory: InventoryType) => {
    const updated = {
      ...character,
      inventory,
    };
    onCharacterUpdate(updated);
  };


  const updateInitiative = (modifier: number) => {
    const updated = {
      ...character,
      initiative: {
        ...character.initiative,
        modifier,
      },
    };
    onCharacterUpdate(updated);
  };

  const handleOpenConfig = () => {
    setIsConfigDialogOpen(true);
  };

  const handleConfigSave = async (config: CharacterConfiguration) => {
    await characterService.updateCharacterConfiguration(config);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Character Name */}
      <CharacterNameSection 
        name={character.name}
        onNameChange={updateName}
        onOpenConfig={handleOpenConfig}
      />

      {/* Advantage/Disadvantage Toggle */}
      <AdvantageToggle 
        advantageLevel={uiState.advantageLevel} 
        onAdvantageChange={updateAdvantageLevel} 
      />

      {/* Class Info Section */}
      <ClassInfoSection
        character={character}
        isOpen={uiState.collapsibleSections.classInfo}
        onToggle={(isOpen) => updateCollapsibleState('classInfo', isOpen)}
      />

      {/* Class Features Section */}
      <ClassFeaturesSection
        character={character}
        isOpen={uiState.collapsibleSections.classFeatures}
        onToggle={(isOpen) => updateCollapsibleState('classFeatures', isOpen)}
      />

      {/* Hit Points Section */}
      <HitPointsSection 
        currentHp={character.hitPoints.current}
        maxHp={character.hitPoints.max}
        temporaryHp={character.hitPoints.temporary}
        isOpen={uiState.collapsibleSections.hitPoints}
        onToggle={(isOpen) => updateCollapsibleState('hitPoints', isOpen)}
      />

      {/* Hit Dice Section */}
      <HitDiceSection
        character={character}
        isOpen={uiState.collapsibleSections.hitDice}
        onToggle={(isOpen) => updateCollapsibleState('hitDice', isOpen)}
        onUpdate={updateCharacter}
        onCatchBreath={onCatchBreath}
        onMakeCamp={onMakeCamp}
        onSafeRest={onSafeRest}
      />

      {/* Wounds Section */}
      <WoundsSection
        character={character}
        isOpen={uiState.collapsibleSections.wounds}
        onToggle={(isOpen) => updateCollapsibleState('wounds', isOpen)}
        onUpdate={updateCharacter}
      />

      {/* Mana Section - Only show if mana is enabled */}
      {character.config?.mana?.enabled && character.mana && (
        <ManaSection
          currentMana={character.mana.current}
          maxMana={character.mana.max}
          manaAttribute={character.config.mana.attribute}
          isOpen={uiState.collapsibleSections.mana}
          onToggle={(isOpen) => updateCollapsibleState('mana', isOpen)}
        />
      )}

      {/* Initiative Section */}
      <InitiativeSection 
        initiative={character.initiative}
        dexterityValue={character.attributes.dexterity}
        isOpen={uiState.collapsibleSections.initiative}
        inEncounter={character.inEncounter}
        onToggle={(isOpen) => updateCollapsibleState('initiative', isOpen)}
        onInitiativeChange={updateInitiative}
        onRollInitiative={onRollInitiative}
        onEndEncounter={onEndEncounter}
        advantageLevel={uiState.advantageLevel}
      />

      {/* Action Tracker Section - Only show during encounters */}
      {character.inEncounter && (
        <ActionTrackerSection 
          actionTracker={character.actionTracker}
          abilities={character.abilities}
          isOpen={uiState.collapsibleSections.actionTracker}
          onToggle={(isOpen) => updateCollapsibleState('actionTracker', isOpen)}
          onUpdateActions={onUpdateActions}
          onUpdateAbilities={onUpdateAbilities}
          onEndTurn={onEndTurn}
        />
      )}

      {/* Attributes Section */}
      <AttributesSection 
        character={character}
        isOpen={uiState.collapsibleSections.attributes}
        onToggle={(isOpen) => updateCollapsibleState('attributes', isOpen)}
        onAttributeChange={handleAttributeChange}
        onRollAttribute={onRollAttribute}
        onRollSave={onRollSave}
        advantageLevel={uiState.advantageLevel}
      />

      {/* Skills Section */}
      <SkillsSection 
        character={character}
        isOpen={uiState.collapsibleSections.skills}
        onToggle={(isOpen) => updateCollapsibleState('skills', isOpen)}
        onSkillChange={handleSkillChange}
        onRollSkill={onRollSkill}
        advantageLevel={uiState.advantageLevel}
      />

      {/* Full Mode Only Sections */}
      {mode === 'full' && (
        <>
          {/* Armor Section */}
          <ArmorSection 
            character={character}
            isOpen={uiState.collapsibleSections.armor}
            onToggle={(isOpen: boolean) => updateCollapsibleState('armor', isOpen)}
          />

          {/* Actions Section */}
          <ActionsSection 
            character={character}
            isOpen={uiState.collapsibleSections.actions}
            onToggle={(isOpen) => updateCollapsibleState('actions', isOpen)}
            onAttack={onAttack}
            onUseAbility={onUseAbility}
            advantageLevel={uiState.advantageLevel}
          />

          {/* Ability Section */}
          <AbilitySection 
            abilities={character.abilities}
            character={character}
            isOpen={uiState.collapsibleSections.abilities}
            onToggle={(isOpen) => updateCollapsibleState('abilities', isOpen)}
            onUpdateAbilities={onUpdateAbilities}
            onUseAbility={onUseAbility}
          />

          {/* Inventory Section */}
          <InventorySection 
            inventory={character.inventory}
            characterDexterity={character.attributes.dexterity}
            isOpen={uiState.collapsibleSections.inventory}
            onToggle={(isOpen) => updateCollapsibleState('inventory', isOpen)}
            onUpdateInventory={updateInventory}
          />
        </>
      )}

      {/* Character Configuration Dialog */}
      <CharacterConfigDialog
        character={character}
        isOpen={isConfigDialogOpen}
        onClose={() => setIsConfigDialogOpen(false)}
        onSave={handleConfigSave}
      />
    </div>
  );
}