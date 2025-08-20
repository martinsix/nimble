"use client";

import { useState, useEffect } from "react";
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
import { uiStateService, UIState } from "@/lib/services/ui-state-service";
import { characterService } from "@/lib/services/character-service";

interface CharacterSheetProps {
  character: Character;
  mode: AppMode;
  onUpdate: (character: Character) => void;
  onRollAttribute: (attributeName: AttributeName, value: number, advantageLevel: number) => void;
  onRollSave: (attributeName: AttributeName, value: number, advantageLevel: number) => void;
  onRollSkill: (skillName: SkillName, attributeValue: number, skillModifier: number, advantageLevel: number) => void;
  onRollInitiative: (totalModifier: number, advantageLevel: number) => void;
  onAttack: (weaponName: string, damage: string, attributeModifier: number, advantageLevel: number) => void;
  onUpdateActions?: (actionTracker: ActionTracker) => void;
  onEndEncounter?: () => void;
  onUpdateAbilities?: (abilities: Abilities) => void;
  onEndTurn?: (actionTracker: ActionTracker, abilities: Abilities) => void;
  onUseAbility?: (abilityId: string) => void;
  onCatchBreath?: () => void;
  onMakeCamp?: () => void;
  onSafeRest?: () => void;
}

export function CharacterSheet({ character, mode, onUpdate, onRollAttribute, onRollSave, onRollSkill, onRollInitiative, onAttack, onUpdateActions, onEndEncounter, onUpdateAbilities, onEndTurn, onUseAbility, onCatchBreath, onMakeCamp, onSafeRest }: CharacterSheetProps) {
  const [localCharacter, setLocalCharacter] = useState(character);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [uiState, setUIState] = useState<UIState>({
    collapsibleSections: {
      classInfo: true,
      classFeatures: true,
      hitPoints: true,
      hitDice: true,
      wounds: true,
      mana: true,
      initiative: true,
      actionTracker: true,
      attributes: true,
      skills: true,
      actions: true,
      armor: true,
      abilities: true,
      inventory: true,
    },
    advantageLevel: 0,
  });

  useEffect(() => {
    const loadUIState = async () => {
      const state = await uiStateService.getUIState();
      setUIState(state);
    };
    loadUIState();
  }, []);

  useEffect(() => {
    setLocalCharacter(character);
  }, [character]);

  const updateCollapsibleState = async (section: keyof UIState['collapsibleSections'], isOpen: boolean) => {
    const newUIState = {
      ...uiState,
      collapsibleSections: {
        ...uiState.collapsibleSections,
        [section]: isOpen,
      },
    };
    setUIState(newUIState);
    await uiStateService.saveUIState(newUIState);
  };

  const updateAdvantageLevel = async (advantageLevel: number) => {
    const newUIState = {
      ...uiState,
      advantageLevel,
    };
    setUIState(newUIState);
    await uiStateService.saveUIState(newUIState);
  };

  const updateName = (name: string) => {
    const updated = { ...localCharacter, name };
    setLocalCharacter(updated);
    onUpdate(updated);
  };

  const updateCharacter = (updated: Character) => {
    setLocalCharacter(updated);
    onUpdate(updated);
  };

  const updateAttribute = (attributeName: AttributeName, value: number) => {
    const updated = {
      ...localCharacter,
      attributes: {
        ...localCharacter.attributes,
        [attributeName]: value,
      },
    };
    setLocalCharacter(updated);
    onUpdate(updated);
  };

  const handleAttributeChange = (attributeName: AttributeName, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= -2 && numValue <= 10) {
      updateAttribute(attributeName, numValue);
    }
  };

  const updateSkill = (skillName: SkillName, modifier: number) => {
    const updated = {
      ...localCharacter,
      skills: {
        ...localCharacter.skills,
        [skillName]: {
          ...localCharacter.skills[skillName],
          modifier,
        },
      },
    };
    setLocalCharacter(updated);
    onUpdate(updated);
  };

  const handleSkillChange = (skillName: SkillName, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 20) {
      updateSkill(skillName, numValue);
    }
  };

  const updateInventory = (inventory: InventoryType) => {
    const updated = {
      ...localCharacter,
      inventory,
    };
    setLocalCharacter(updated);
    onUpdate(updated);
  };


  const updateInitiative = (modifier: number) => {
    const updated = {
      ...localCharacter,
      initiative: {
        ...localCharacter.initiative,
        modifier,
      },
    };
    setLocalCharacter(updated);
    onUpdate(updated);
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
        name={localCharacter.name}
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
        character={localCharacter}
        isOpen={uiState.collapsibleSections.classInfo}
        onToggle={(isOpen) => updateCollapsibleState('classInfo', isOpen)}
      />

      {/* Class Features Section */}
      <ClassFeaturesSection
        character={localCharacter}
        isOpen={uiState.collapsibleSections.classFeatures}
        onToggle={(isOpen) => updateCollapsibleState('classFeatures', isOpen)}
      />

      {/* Hit Points Section */}
      <HitPointsSection 
        currentHp={localCharacter.hitPoints.current}
        maxHp={localCharacter.hitPoints.max}
        temporaryHp={localCharacter.hitPoints.temporary}
        isOpen={uiState.collapsibleSections.hitPoints}
        onToggle={(isOpen) => updateCollapsibleState('hitPoints', isOpen)}
      />

      {/* Hit Dice Section */}
      <HitDiceSection
        character={localCharacter}
        isOpen={uiState.collapsibleSections.hitDice}
        onToggle={(isOpen) => updateCollapsibleState('hitDice', isOpen)}
        onUpdate={updateCharacter}
        onCatchBreath={onCatchBreath}
        onMakeCamp={onMakeCamp}
        onSafeRest={onSafeRest}
      />

      {/* Wounds Section */}
      <WoundsSection
        character={localCharacter}
        isOpen={uiState.collapsibleSections.wounds}
        onToggle={(isOpen) => updateCollapsibleState('wounds', isOpen)}
        onUpdate={updateCharacter}
      />

      {/* Mana Section - Only show if mana is enabled */}
      {localCharacter.config?.mana?.enabled && localCharacter.mana && (
        <ManaSection
          currentMana={localCharacter.mana.current}
          maxMana={localCharacter.mana.max}
          manaAttribute={localCharacter.config.mana.attribute}
          isOpen={uiState.collapsibleSections.mana}
          onToggle={(isOpen) => updateCollapsibleState('mana', isOpen)}
        />
      )}

      {/* Initiative Section */}
      <InitiativeSection 
        initiative={localCharacter.initiative}
        dexterityValue={localCharacter.attributes.dexterity}
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
          onUpdateActions={onUpdateActions || (() => {})}
          onUpdateAbilities={onUpdateAbilities || (() => {})}
          onEndTurn={onEndTurn}
        />
      )}

      {/* Attributes Section */}
      <AttributesSection 
        character={localCharacter}
        isOpen={uiState.collapsibleSections.attributes}
        onToggle={(isOpen) => updateCollapsibleState('attributes', isOpen)}
        onAttributeChange={handleAttributeChange}
        onRollAttribute={onRollAttribute}
        onRollSave={onRollSave}
        advantageLevel={uiState.advantageLevel}
      />

      {/* Skills Section */}
      <SkillsSection 
        character={localCharacter}
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
            character={localCharacter}
            isOpen={uiState.collapsibleSections.armor}
            onToggle={(isOpen: boolean) => updateCollapsibleState('armor', isOpen)}
          />

          {/* Actions Section */}
          <ActionsSection 
            character={localCharacter}
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
            onUpdateAbilities={onUpdateAbilities || (() => {})}
            onUseAbility={onUseAbility}
          />

          {/* Inventory Section */}
          <InventorySection 
            inventory={localCharacter.inventory}
            characterDexterity={localCharacter.attributes.dexterity}
            isOpen={uiState.collapsibleSections.inventory}
            onToggle={(isOpen) => updateCollapsibleState('inventory', isOpen)}
            onUpdateInventory={updateInventory}
          />
        </>
      )}

      {/* Character Configuration Dialog */}
      <CharacterConfigDialog
        character={localCharacter}
        isOpen={isConfigDialogOpen}
        onClose={() => setIsConfigDialogOpen(false)}
        onSave={handleConfigSave}
      />
    </div>
  );
}