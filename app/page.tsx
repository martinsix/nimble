"use client";

import { useState, useEffect } from "react";
import { CharacterSheet } from "@/components/character-sheet";
import { ActivityLog } from "@/components/activity-log";
import { Character, AttributeName, SkillName, ActionTracker } from "@/lib/types/character";
import { LogEntry, DiceRoll } from "@/lib/types/dice";
import { characterService } from "@/lib/services/character-service";
import { diceService } from "@/lib/services/dice-service";
import { createDefaultSkills, createDefaultInventory, createDefaultHitPoints, createDefaultInitiative, createDefaultActionTracker } from "@/lib/utils/character-defaults";

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
  skills: createDefaultSkills(),
  inventory: createDefaultInventory(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function Home() {
  const [character, setCharacter] = useState<Character>(sampleCharacter);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load character
        const existingCharacter = await characterService.getCharacter("default-character");
        if (existingCharacter) {
          setCharacter(existingCharacter);
        } else {
          const newCharacter = await characterService.createCharacter({
            name: sampleCharacter.name,
            attributes: sampleCharacter.attributes,
            hitPoints: sampleCharacter.hitPoints,
            initiative: sampleCharacter.initiative,
            actionTracker: sampleCharacter.actionTracker,
            skills: sampleCharacter.skills,
            inventory: sampleCharacter.inventory,
          }, "default-character");
          setCharacter(newCharacter);
        }

        // Load log entries
        const existingEntries = await diceService.getLogEntries();
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
    } catch (error) {
      console.error("Failed to save character:", error);
    }
  };

  const handleRollAttribute = async (attributeName: AttributeName, value: number, advantageLevel: number) => {
    try {
      const attributeLabel = attributeName.charAt(0).toUpperCase() + attributeName.slice(1);
      const roll = await diceService.addRoll(20, value, `${attributeLabel} check`, advantageLevel);
      setLogEntries(prevEntries => [roll, ...prevEntries.slice(0, 99)]); // Keep only 100 entries
    } catch (error) {
      console.error("Failed to roll dice:", error);
    }
  };

  const handleRollSave = async (attributeName: AttributeName, value: number, advantageLevel: number) => {
    try {
      const attributeLabel = attributeName.charAt(0).toUpperCase() + attributeName.slice(1);
      const roll = await diceService.addRoll(20, value, `${attributeLabel} save`, advantageLevel);
      setLogEntries(prevEntries => [roll, ...prevEntries.slice(0, 99)]); // Keep only 100 entries
    } catch (error) {
      console.error("Failed to roll save:", error);
    }
  };

  const handleRollSkill = async (skillName: SkillName, attributeValue: number, skillModifier: number, advantageLevel: number) => {
    try {
      const skill = character.skills[skillName];
      const totalModifier = attributeValue + skillModifier;
      const roll = await diceService.addRoll(20, totalModifier, skill.name, advantageLevel);
      setLogEntries(prevEntries => [roll, ...prevEntries.slice(0, 99)]); // Keep only 100 entries
    } catch (error) {
      console.error("Failed to roll skill:", error);
    }
  };

  const handleAttack = async (weaponName: string, damage: string, attributeModifier: number, advantageLevel: number) => {
    try {
      const roll = await diceService.addAttackRoll(damage, attributeModifier, `${weaponName} attack`, advantageLevel);
      setLogEntries(prevEntries => [roll, ...prevEntries.slice(0, 99)]); // Keep only 100 entries
    } catch (error) {
      console.error("Failed to roll attack:", error);
    }
  };

  const handleRollInitiative = async (totalModifier: number, advantageLevel: number) => {
    try {
      const roll = await diceService.addRoll(20, totalModifier, "Initiative", advantageLevel);
      setLogEntries(prevEntries => [roll, ...prevEntries.slice(0, 99)]); // Keep only 100 entries

      // Handle action tracker initialization from initiative
      const initiativeEntry = await diceService.addInitiativeEntry(roll.total!, character.actionTracker.bonus);
      setLogEntries(prevEntries => [initiativeEntry, ...prevEntries.slice(0, 99)]);
      
      // Update character's action tracker
      const updatedCharacter = {
        ...character,
        actionTracker: {
          ...character.actionTracker,
          current: initiativeEntry.actionsGranted,
        }
      };
      setCharacter(updatedCharacter);
      await characterService.updateCharacter(updatedCharacter);
    } catch (error) {
      console.error("Failed to roll initiative:", error);
    }
  };

  const handleClearRolls = async () => {
    try {
      await diceService.clearLogEntries();
      setLogEntries([]);
    } catch (error) {
      console.error("Failed to clear log entries:", error);
    }
  };

  const handleLogDamage = async (amount: number, targetType: 'hp' | 'temp_hp') => {
    try {
      const entry = await diceService.addDamageEntry(amount, targetType);
      setLogEntries(prevEntries => [entry, ...prevEntries.slice(0, 99)]);
    } catch (error) {
      console.error("Failed to log damage:", error);
    }
  };

  const handleLogHealing = async (amount: number) => {
    try {
      const entry = await diceService.addHealingEntry(amount);
      setLogEntries(prevEntries => [entry, ...prevEntries.slice(0, 99)]);
    } catch (error) {
      console.error("Failed to log healing:", error);
    }
  };

  const handleLogTempHP = async (amount: number, previous?: number) => {
    try {
      const entry = await diceService.addTempHPEntry(amount, previous);
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
        <h1 className="text-3xl font-bold text-center">Nimble Navigator</h1>
        <CharacterSheet 
          character={character} 
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
        />
        <ActivityLog entries={logEntries} onClearRolls={handleClearRolls} />
      </div>
    </main>
  );
}