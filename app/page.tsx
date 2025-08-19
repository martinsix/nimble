"use client";

import { useState, useEffect, useCallback } from "react";
import { CharacterSheet } from "@/components/character-sheet";
import { ActivityLog } from "@/components/activity-log";
import { Character, AttributeName, SkillName, ActionTracker } from "@/lib/types/character";
import { LogEntry, DiceRollEntry, AbilityUsageEntry } from "@/lib/types/log-entries";
import { Abilities } from "@/lib/types/abilities";
import { characterStorageService } from "@/lib/services/character-storage-service";
import { characterService } from "@/lib/services/character-service";
import { diceService } from "@/lib/services/dice-service";
import { activityLogService } from "@/lib/services/activity-log-service";
import { abilityService } from "@/lib/services/ability-service";
import { settingsService, AppSettings } from "@/lib/services/settings-service";
import { AppMenu } from "@/components/app-menu";
import { createDefaultSkills, createDefaultInventory, createDefaultHitPoints, createDefaultInitiative, createDefaultActionTracker, createDefaultAbilities, createDefaultHitDice, createDefaultWounds } from "@/lib/utils/character-defaults";

const sampleCharacter: Character = {
  id: "default-character",
  name: "Sample Character",
  level: 1,
  attributes: {
    strength: 2,
    dexterity: 1,
    intelligence: 3,
    will: 0,
  },
  hitPoints: createDefaultHitPoints(),
  hitDice: createDefaultHitDice(1),
  wounds: createDefaultWounds(),
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
        const characterList = await characterStorageService.getAllCharacters();
        setCharacters(characterList);

        // Load active character through CharacterService
        let activeCharacter = await characterService.loadCharacter(loadedSettings.activeCharacterId);
        if (!activeCharacter) {
          // Create default character if none exists
          const newCharacter = await characterStorageService.createCharacter({
            name: sampleCharacter.name,
            level: sampleCharacter.level,
            attributes: sampleCharacter.attributes,
            hitPoints: sampleCharacter.hitPoints,
            hitDice: sampleCharacter.hitDice,
            wounds: sampleCharacter.wounds,
            initiative: sampleCharacter.initiative,
            actionTracker: sampleCharacter.actionTracker,
            inEncounter: sampleCharacter.inEncounter,
            skills: sampleCharacter.skills,
            inventory: sampleCharacter.inventory,
            abilities: sampleCharacter.abilities,
          }, loadedSettings.activeCharacterId);
          
          // Load the new character through the service
          activeCharacter = await characterService.loadCharacter(newCharacter.id);
          
          // Character list will be updated automatically when we reload
          const updatedCharacterList = await characterStorageService.getAllCharacters();
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

  // Subscribe to character updates from the service
  useEffect(() => {
    const unsubscribe = characterService.subscribeToCharacter((updatedCharacter) => {
      setCharacter(updatedCharacter);
    });

    return unsubscribe;
  }, []);

  // Subscribe to activity log updates
  useEffect(() => {
    const refreshLogs = async () => {
      try {
        const entries = await activityLogService.getLogEntries();
        setLogEntries(entries);
      } catch (error) {
        console.error("Failed to refresh log entries:", error);
      }
    };

    // Initial load and periodic refresh (simple polling)
    refreshLogs();
    const interval = setInterval(refreshLogs, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCharacterUpdate = async (updatedCharacter: Character) => {
    // Update through the service, which will trigger the subscription
    await characterService.updateCharacter(updatedCharacter);
    
    try {
      // Refresh the character list to reflect name changes
      const updatedCharacterList = await characterStorageService.getAllCharacters();
      setCharacters(updatedCharacterList);
    } catch (error) {
      console.error("Failed to refresh character list:", error);
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
      await characterStorageService.updateCharacter(updatedCharacter);
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


  const handleUpdateActions = async (actionTracker: ActionTracker) => {
    const updatedCharacter = { ...character, actionTracker };
    setCharacter(updatedCharacter);
    try {
      await characterStorageService.updateCharacter(updatedCharacter);
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
      await characterStorageService.updateCharacter(updatedCharacter);
    } catch (error) {
      console.error("Failed to end encounter:", error);
    }
  };

  const handleUpdateAbilities = async (abilities: Abilities) => {
    const updatedCharacter = { ...character, abilities };
    setCharacter(updatedCharacter);
    try {
      await characterStorageService.updateCharacter(updatedCharacter);
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
      await characterStorageService.updateCharacter(updatedCharacter);
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
      await characterStorageService.updateCharacter(updatedCharacter);

      // Log the ability usage
      const logEntry = activityLogService.createAbilityUsageEntry(
        result.usedAbility.name,
        result.usedAbility.frequency,
        result.usedAbility.currentUses || 0,
        result.usedAbility.maxUses || 0
      );
      await activityLogService.addLogEntry(logEntry);
      setLogEntries(prevEntries => [logEntry, ...prevEntries.slice(0, 99)]);

      // Handle ability roll if it has one
      if (result.usedAbility.roll) {
        const roll = result.usedAbility.roll;
        const totalModifier = abilityService.calculateAbilityRollModifier(roll, character);
        
        // Use the dice service to perform the roll
        const rollResult = diceService.rollAttack(roll.dice, totalModifier, 0);
        const rollLogEntry = activityLogService.createDiceRollEntry(
          rollResult.dice,
          rollResult.droppedDice,
          totalModifier,
          rollResult.total,
          `${result.usedAbility.name} ability roll`,
          0 // No advantage for ability rolls by default
        );
        await activityLogService.addLogEntry(rollLogEntry);
        setLogEntries(prevEntries => [rollLogEntry, ...prevEntries.slice(0, 99)]);
      }
    } catch (error) {
      console.error("Failed to use ability:", error);
    }
  };

  const handleCatchBreath = async () => {
    try {
      if (character.hitDice.current <= 0) {
        console.error("No hit dice available");
        return;
      }

      // Roll the hit die
      const hitDieRoll = diceService.rollAttack(`1d${character.hitDice.size}`, 0, 0);
      
      // Log the hit die roll
      const rollLogEntry = activityLogService.createDiceRollEntry(
        hitDieRoll.dice,
        hitDieRoll.droppedDice,
        0,
        hitDieRoll.total,
        `Catching Breath - Hit Die (d${character.hitDice.size})`,
        0
      );
      await activityLogService.addLogEntry(rollLogEntry);
      setLogEntries(prevEntries => [rollLogEntry, ...prevEntries.slice(0, 99)]);

      // Calculate healing (hit die roll + strength modifier, minimum 1)
      const strengthModifier = character.attributes.strength;
      const healingAmount = Math.max(1, hitDieRoll.total + strengthModifier);
      
      // Apply healing
      const newCurrentHp = Math.min(character.hitPoints.max, character.hitPoints.current + healingAmount);
      
      // Consume the hit die and update character
      const updatedCharacter = {
        ...character,
        hitPoints: {
          ...character.hitPoints,
          current: newCurrentHp,
        },
        hitDice: {
          ...character.hitDice,
          current: character.hitDice.current - 1,
        },
      };
      
      setCharacter(updatedCharacter);
      await characterStorageService.updateCharacter(updatedCharacter);

      // Log the healing
      if (healingAmount > 0) {
        const healingLogEntry = activityLogService.createHealingEntry(healingAmount);
        await activityLogService.addLogEntry(healingLogEntry);
        setLogEntries(prevEntries => [healingLogEntry, ...prevEntries.slice(0, 99)]);
      }
    } catch (error) {
      console.error("Failed to catch breath:", error);
    }
  };

  const handleMakeCamp = async () => {
    try {
      if (character.hitDice.current <= 0) {
        console.error("No hit dice available");
        return;
      }

      // Use maximum value of hit die (no roll)
      const maxHitDieValue = character.hitDice.size;
      
      // Log the field rest activity
      const restLogEntry = activityLogService.createDiceRollEntry(
        [], // No dice rolled
        undefined,
        0,
        maxHitDieValue,
        `Making Camp - Max Hit Die (d${character.hitDice.size})`,
        0
      );
      await activityLogService.addLogEntry(restLogEntry);
      setLogEntries(prevEntries => [restLogEntry, ...prevEntries.slice(0, 99)]);

      // Calculate healing (max hit die value + strength modifier, minimum 1)
      const strengthModifier = character.attributes.strength;
      const healingAmount = Math.max(1, maxHitDieValue + strengthModifier);
      
      // Apply healing
      const newCurrentHp = Math.min(character.hitPoints.max, character.hitPoints.current + healingAmount);
      
      // Consume the hit die and update character
      const updatedCharacter = {
        ...character,
        hitPoints: {
          ...character.hitPoints,
          current: newCurrentHp,
        },
        hitDice: {
          ...character.hitDice,
          current: character.hitDice.current - 1,
        },
      };
      
      setCharacter(updatedCharacter);
      await characterStorageService.updateCharacter(updatedCharacter);

      // Log the healing
      if (healingAmount > 0) {
        const healingLogEntry = activityLogService.createHealingEntry(healingAmount);
        await activityLogService.addLogEntry(healingLogEntry);
        setLogEntries(prevEntries => [healingLogEntry, ...prevEntries.slice(0, 99)]);
      }
    } catch (error) {
      console.error("Failed to make camp:", error);
    }
  };

  const handleSafeRest = async () => {
    try {
      // Reset all abilities (safe rest resets everything)
      let resetAbilities = abilityService.resetAbilities(character.abilities, 'per_turn');
      resetAbilities = abilityService.resetAbilities(resetAbilities, 'per_encounter');
      resetAbilities = abilityService.resetAbilities(resetAbilities, 'per_safe_rest');
      // Note: At-will abilities don't need resetting as they have unlimited uses

      // Create updated character with full restoration
      const updatedCharacter = {
        ...character,
        hitPoints: {
          ...character.hitPoints,
          current: character.hitPoints.max, // Full HP restoration
          temporary: 0, // Clear temporary HP
        },
        hitDice: {
          ...character.hitDice,
          current: character.hitDice.max, // Restore all hit dice
        },
        wounds: {
          ...character.wounds,
          current: Math.max(0, character.wounds.current - 1), // Remove one wound
        },
        abilities: resetAbilities,
        inEncounter: false, // Safe rest ends any encounter
        actionTracker: {
          ...character.actionTracker,
          current: character.actionTracker.base,
          bonus: 0,
        },
      };

      setCharacter(updatedCharacter);
      await characterStorageService.updateCharacter(updatedCharacter);

      // Calculate what was restored for logging
      const healingAmount = character.hitPoints.max - character.hitPoints.current;
      const hitDiceRestored = character.hitDice.max - character.hitDice.current;
      const woundsRemoved = character.wounds.current > 0 ? 1 : 0;
      const abilitiesReset = character.abilities.abilities.filter(ability => 
        ability.type === 'action' && 
        ability.frequency !== 'at_will' && 
        ability.currentUses !== ability.maxUses
      ).length;

      // Log the safe rest with proper entry type
      const restLogEntry = activityLogService.createSafeRestEntry(
        healingAmount,
        hitDiceRestored,
        woundsRemoved,
        abilitiesReset
      );
      await activityLogService.addLogEntry(restLogEntry);
      setLogEntries(prevEntries => [restLogEntry, ...prevEntries.slice(0, 99)]);
    } catch (error) {
      console.error("Failed to perform safe rest:", error);
    }
  };

  const handleSettingsChange = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await settingsService.saveSettings(newSettings);
  };

  const handleCharacterSwitch = useCallback(async (characterId: string) => {
    try {
      const newCharacter = await characterService.loadCharacter(characterId);
      if (newCharacter) {
        
        // Update settings with new active character
        const newSettings = { ...settings, activeCharacterId: characterId };
        setSettings(newSettings);
        await settingsService.saveSettings(newSettings);
        
        // Update last played timestamp
        await characterStorageService.updateLastPlayed(characterId);
        const updatedCharacterList = await characterStorageService.getAllCharacters();
        setCharacters(updatedCharacterList);
        
        // Load log entries for new character (if we want per-character logs)
        const existingEntries = await activityLogService.getLogEntries();
        setLogEntries(existingEntries);
      }
    } catch (error) {
      console.error("Failed to switch character:", error);
    }
  }, [settings]);

  const handleCharacterDelete = async (characterId: string) => {
    try {
      await characterStorageService.deleteCharacter(characterId);
      
      const updatedCharacterList = await characterStorageService.getAllCharacters();
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
        const newCharacter = await characterStorageService.createCharacterWithDefaults(characterName);
        
        const updatedCharacterList = await characterStorageService.getAllCharacters();
        setCharacters(updatedCharacterList);
        
        // Switch to the new character
        await handleCharacterSwitch(newCharacter.id);
      } catch (error) {
        console.error("Failed to create character:", error);
      }
    };

    window.addEventListener('createCharacter', handleCreateCharacter as unknown as EventListener);
    return () => {
      window.removeEventListener('createCharacter', handleCreateCharacter as unknown as EventListener);
    };
  }, [settings, handleCharacterSwitch]);

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
          onUpdateActions={handleUpdateActions}
          onEndEncounter={handleEndEncounter}
          onUpdateAbilities={handleUpdateAbilities}
          onEndTurn={handleEndTurn}
          onUseAbility={handleUseAbility}
          onCatchBreath={handleCatchBreath}
          onMakeCamp={handleMakeCamp}
          onSafeRest={handleSafeRest}
        />
        <ActivityLog entries={logEntries} onClearRolls={handleClearRolls} />
      </div>
    </main>
  );
}