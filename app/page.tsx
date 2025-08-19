"use client";

import { useState, useEffect } from "react";
import { CharacterSheet } from "@/components/character-sheet";
import { ActivityLog } from "@/components/activity-log";
import { Character, AttributeName, SkillName, ActionTracker } from "@/lib/types/character";
import { LogEntry, DiceRoll, AbilityUsageEntry } from "@/lib/types/dice";
import { Abilities } from "@/lib/types/abilities";
import { characterService } from "@/lib/services/character-service";
import { diceService } from "@/lib/services/dice-service-clean";
import { activityLogService } from "@/lib/services/activity-log-service";
import { abilityService } from "@/lib/services/ability-service";
import { settingsService, AppSettings } from "@/lib/services/settings-service";
import { AppMenu } from "@/components/app-menu";
import { createDefaultSkills, createDefaultInventory, createDefaultHitPoints, createDefaultInitiative, createDefaultActionTracker, createDefaultAbilities } from "@/lib/utils/character-defaults";

const sampleCharacter: Character = {
  id: "default-character",
  name: "Sample Character",
  attributes: {
    strength: 2,
    dexterity: 1,
    intelligence: 3,
    will: 0,
  },
  hitPoints: createDefaultHitPoints(),
  initiative: createDefaultInitiative(),
  actionTracker: createDefaultActionTracker(),
  inEncounter: false,
  skills: createDefaultSkills(),
  inventory: createDefaultInventory(),
  abilities: createDefaultAbilities(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function Home() {
  const [character, setCharacter] = useState<Character>(sampleCharacter);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ mode: 'full', activeCharacterId: 'default-character' });
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load settings
        const loadedSettings = await settingsService.getSettings();
        setSettings(loadedSettings);

        // Load character list
        const characterList = await characterService.getAllCharacters();
        setCharacters(characterList);

        // Load active character
        const existingCharacter = await characterService.getCharacter(loadedSettings.activeCharacterId);
        if (existingCharacter) {
          setCharacter(existingCharacter);
        } else {
          // Create default character if none exists
          const newCharacter = await characterService.createCharacter({
            name: sampleCharacter.name,
            attributes: sampleCharacter.attributes,
            hitPoints: sampleCharacter.hitPoints,
            initiative: sampleCharacter.initiative,
            actionTracker: sampleCharacter.actionTracker,
            inEncounter: sampleCharacter.inEncounter,
            skills: sampleCharacter.skills,
            inventory: sampleCharacter.inventory,
            abilities: sampleCharacter.abilities,
          }, loadedSettings.activeCharacterId);
          setCharacter(newCharacter);
          
          // Character list will be updated automatically when we reload
          const updatedCharacterList = await characterService.getAllCharacters();
          setCharacters(updatedCharacterList);
        }

        // Load log entries
        const existingEntries = await activityLogService.getLogEntries();
        setLogEntries(existingEntries);
      } catch (error) {
        console.error("Failed to load data:", error);
        setCharacter(sampleCharacter);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  const handleCharacterUpdate = async (updatedCharacter: Character) => {
    setCharacter(updatedCharacter);
    try {
      await characterService.updateCharacter(updatedCharacter);
      
      // Refresh the character list to reflect name changes
      const updatedCharacterList = await characterService.getAllCharacters();
      setCharacters(updatedCharacterList);
    } catch (error) {
      console.error("Failed to save character:", error);
    }
  };

  const handleRollAttribute = async (attributeName: AttributeName, value: number, advantageLevel: number) => {
    try {
      const attributeLabel = attributeName.charAt(0).toUpperCase() + attributeName.slice(1);
      const rollResult = diceService.rollAttributeCheck(value, advantageLevel);
      const logEntry = activityLogService.createDiceRollEntry(
        rollResult.dice,
        rollResult.droppedDice,
        value,
        rollResult.total,
        `${attributeLabel} check`,
        advantageLevel
      );
      await activityLogService.addLogEntry(logEntry);
      setLogEntries(prevEntries => [logEntry, ...prevEntries.slice(0, 99)]); // Keep only 100 entries
    } catch (error) {
      console.error("Failed to roll dice:", error);
    }
  };

  const handleRollSave = async (attributeName: AttributeName, value: number, advantageLevel: number) => {
    try {
      const attributeLabel = attributeName.charAt(0).toUpperCase() + attributeName.slice(1);
      const rollResult = diceService.rollAttributeCheck(value, advantageLevel);
      const logEntry = activityLogService.createDiceRollEntry(
        rollResult.dice,
        rollResult.droppedDice,
        value,
        rollResult.total,
        `${attributeLabel} save`,
        advantageLevel
      );
      await activityLogService.addLogEntry(logEntry);
      setLogEntries(prevEntries => [logEntry, ...prevEntries.slice(0, 99)]); // Keep only 100 entries
    } catch (error) {
      console.error("Failed to roll save:", error);
    }
  };

  const handleRollSkill = async (skillName: SkillName, attributeValue: number, skillModifier: number, advantageLevel: number) => {
    try {
      const skill = character.skills[skillName];
      const totalModifier = attributeValue + skillModifier;
      const rollResult = diceService.rollAttributeCheck(totalModifier, advantageLevel);
      const logEntry = activityLogService.createDiceRollEntry(
        rollResult.dice,
        rollResult.droppedDice,
        totalModifier,
        rollResult.total,
        skill.name,
        advantageLevel
      );
      await activityLogService.addLogEntry(logEntry);
      setLogEntries(prevEntries => [logEntry, ...prevEntries.slice(0, 99)]); // Keep only 100 entries
    } catch (error) {
      console.error("Failed to roll skill:", error);
    }
  };

  const handleAttack = async (weaponName: string, damage: string, attributeModifier: number, advantageLevel: number) => {
    try {
      const rollResult = diceService.rollAttack(damage, attributeModifier, advantageLevel);
      const logEntry = activityLogService.createDiceRollEntry(
        rollResult.dice,
        rollResult.droppedDice,
        attributeModifier,
        rollResult.total,
        `${weaponName} attack`,
        advantageLevel,
        rollResult.isMiss,
        rollResult.criticalHits
      );
      await activityLogService.addLogEntry(logEntry);
      setLogEntries(prevEntries => [logEntry, ...prevEntries.slice(0, 99)]); // Keep only 100 entries
    } catch (error) {
      console.error("Failed to roll attack:", error);
    }
  };

  const handleRollInitiative = async (totalModifier: number, advantageLevel: number) => {
    try {
      // Roll initiative
      const rollResult = diceService.rollAttributeCheck(totalModifier, advantageLevel);
      const rollLogEntry = activityLogService.createDiceRollEntry(
        rollResult.dice,
        rollResult.droppedDice,
        totalModifier,
        rollResult.total,
        "Initiative",
        advantageLevel
      );
      await activityLogService.addLogEntry(rollLogEntry);
      setLogEntries(prevEntries => [rollLogEntry, ...prevEntries.slice(0, 99)]);

      // Calculate actions granted and create initiative entry
      const actionsGranted = abilityService.calculateInitiativeActions(rollResult.total, character.actionTracker.bonus);
      const initiativeLogEntry = activityLogService.createInitiativeEntry(rollResult.total, actionsGranted);
      await activityLogService.addLogEntry(initiativeLogEntry);
      setLogEntries(prevEntries => [initiativeLogEntry, ...prevEntries.slice(0, 99)]);
      
      // Update character's action tracker and start encounter
      const updatedCharacter = {
        ...character,
        actionTracker: {
          ...character.actionTracker,
          current: actionsGranted,
        },
        inEncounter: true
      };
      setCharacter(updatedCharacter);
      await characterService.updateCharacter(updatedCharacter);
    } catch (error) {
      console.error("Failed to roll initiative:", error);
    }
  };

  const handleClearRolls = async () => {
    try {
      await activityLogService.clearLogEntries();
      setLogEntries([]);
    } catch (error) {
      console.error("Failed to clear log entries:", error);
    }
  };

  const handleLogDamage = async (amount: number, targetType: 'hp' | 'temp_hp') => {
    try {
      const entry = activityLogService.createDamageEntry(amount, targetType);
      await activityLogService.addLogEntry(entry);
      setLogEntries(prevEntries => [entry, ...prevEntries.slice(0, 99)]);
    } catch (error) {
      console.error("Failed to log damage:", error);
    }
  };

  const handleLogHealing = async (amount: number) => {
    try {
      const entry = activityLogService.createHealingEntry(amount);
      await activityLogService.addLogEntry(entry);
      setLogEntries(prevEntries => [entry, ...prevEntries.slice(0, 99)]);
    } catch (error) {
      console.error("Failed to log healing:", error);
    }
  };

  const handleLogTempHP = async (amount: number, previous?: number) => {
    try {
      const entry = activityLogService.createTempHPEntry(amount, previous);
      await activityLogService.addLogEntry(entry);
      setLogEntries(prevEntries => [entry, ...prevEntries.slice(0, 99)]);
    } catch (error) {
      console.error("Failed to log temp HP:", error);
    }
  };

  const handleUpdateActions = async (actionTracker: ActionTracker) => {
    const updatedCharacter = { ...character, actionTracker };
    setCharacter(updatedCharacter);
    try {
      await characterService.updateCharacter(updatedCharacter);
    } catch (error) {
      console.error("Failed to update action tracker:", error);
    }
  };

  const handleEndEncounter = async () => {
    // Reset both per-encounter and per-turn abilities when encounter ends
    let resetAbilities = abilityService.resetAbilities(character.abilities, 'per_encounter');
    resetAbilities = abilityService.resetAbilities(resetAbilities, 'per_turn');

    const updatedCharacter = {
      ...character,
      inEncounter: false,
      actionTracker: {
        ...character.actionTracker,
        current: character.actionTracker.base,
        bonus: 0
      },
      abilities: resetAbilities
    };
    setCharacter(updatedCharacter);
    try {
      await characterService.updateCharacter(updatedCharacter);
    } catch (error) {
      console.error("Failed to end encounter:", error);
    }
  };

  const handleUpdateAbilities = async (abilities: Abilities) => {
    const updatedCharacter = { ...character, abilities };
    setCharacter(updatedCharacter);
    try {
      await characterService.updateCharacter(updatedCharacter);
    } catch (error) {
      console.error("Failed to update abilities:", error);
    }
  };

  const handleEndTurn = async (actionTracker: ActionTracker, abilities: Abilities) => {
    // Reset per-turn abilities using ability service
    const resetAbilities = abilityService.resetAbilities(abilities, 'per_turn');
    
    const updatedCharacter = { 
      ...character, 
      actionTracker: {
        ...actionTracker,
        current: actionTracker.base,
        bonus: 0
      }, 
      abilities: resetAbilities 
    };
    setCharacter(updatedCharacter);
    try {
      await characterService.updateCharacter(updatedCharacter);
    } catch (error) {
      console.error("Failed to end turn:", error);
    }
  };

  const handleUseAbility = async (abilityId: string) => {
    try {
      const result = abilityService.useAbility(character.abilities, abilityId);
      
      if (!result.success || !result.usedAbility) {
        console.error("Failed to use ability: ability not found or no uses remaining");
        return;
      }

      // Update character with new abilities state
      const updatedCharacter = { ...character, abilities: result.updatedAbilities };
      setCharacter(updatedCharacter);
      await characterService.updateCharacter(updatedCharacter);

      // Log the ability usage
      const logEntry = activityLogService.createAbilityUsageEntry(
        result.usedAbility.name,
        result.usedAbility.frequency,
        result.usedAbility.currentUses,
        result.usedAbility.maxUses
      );
      await activityLogService.addLogEntry(logEntry);
      setLogEntries(prevEntries => [logEntry, ...prevEntries.slice(0, 99)]);
    } catch (error) {
      console.error("Failed to use ability:", error);
    }
  };

  const handleSettingsChange = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await settingsService.saveSettings(newSettings);
  };

  const handleCharacterSwitch = async (characterId: string) => {
    try {
      const newCharacter = await characterService.getCharacter(characterId);
      if (newCharacter) {
        setCharacter(newCharacter);
        
        // Update settings with new active character
        const newSettings = { ...settings, activeCharacterId: characterId };
        setSettings(newSettings);
        await settingsService.saveSettings(newSettings);
        
        // Update last played timestamp
        await characterService.updateLastPlayed(characterId);
        const updatedCharacterList = await characterService.getAllCharacters();
        setCharacters(updatedCharacterList);
        
        // Load log entries for new character (if we want per-character logs)
        const existingEntries = await activityLogService.getLogEntries();
        setLogEntries(existingEntries);
      }
    } catch (error) {
      console.error("Failed to switch character:", error);
    }
  };

  const handleCharacterDelete = async (characterId: string) => {
    try {
      await characterService.deleteCharacter(characterId);
      
      const updatedCharacterList = await characterService.getAllCharacters();
      setCharacters(updatedCharacterList);
      
      // If we deleted the active character, switch to another one
      if (characterId === settings.activeCharacterId && updatedCharacterList.length > 0) {
        const newActiveCharacter = updatedCharacterList[0];
        await handleCharacterSwitch(newActiveCharacter.id);
      }
    } catch (error) {
      console.error("Failed to delete character:", error);
    }
  };

  // Listen for character creation events from the character selector
  useEffect(() => {
    const handleCreateCharacter = async (event: CustomEvent<string>) => {
      try {
        const characterName = event.detail;
        const newCharacter = await characterService.createCharacterWithDefaults(characterName);
        
        const updatedCharacterList = await characterService.getAllCharacters();
        setCharacters(updatedCharacterList);
        
        // Switch to the new character
        await handleCharacterSwitch(newCharacter.id);
      } catch (error) {
        console.error("Failed to create character:", error);
      }
    };

    window.addEventListener('createCharacter', handleCreateCharacter as EventListener);
    return () => {
      window.removeEventListener('createCharacter', handleCreateCharacter as EventListener);
    };
  }, [settings, sampleCharacter]);

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading character...</div>
      </main>
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
          onRollSkill={handleRollSkill}
          onRollInitiative={handleRollInitiative}
          onAttack={handleAttack}
          onLogDamage={handleLogDamage}
          onLogHealing={handleLogHealing}
          onLogTempHP={handleLogTempHP}
          onUpdateActions={handleUpdateActions}
          onEndEncounter={handleEndEncounter}
          onUpdateAbilities={handleUpdateAbilities}
          onEndTurn={handleEndTurn}
          onUseAbility={handleUseAbility}
        />
        <ActivityLog entries={logEntries} onClearRolls={handleClearRolls} />
      </div>
    </main>
  );
}