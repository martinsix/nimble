"use client";

import { useState, useEffect } from "react";
import { CharacterSheet } from "@/components/character-sheet";
import { RollLog } from "@/components/roll-log";
import { Character, AttributeName, SkillName } from "@/lib/types/character";
import { DiceRoll } from "@/lib/types/dice";
import { characterService } from "@/lib/services/character-service";
import { diceService } from "@/lib/services/dice-service";
import { createDefaultSkills, createDefaultInventory, createDefaultHitPoints, createDefaultInitiative } from "@/lib/utils/character-defaults";

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
  skills: createDefaultSkills(),
  inventory: createDefaultInventory(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function Home() {
  const [character, setCharacter] = useState<Character>(sampleCharacter);
  const [rolls, setRolls] = useState<DiceRoll[]>([]);
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
            skills: sampleCharacter.skills,
            inventory: sampleCharacter.inventory,
          }, "default-character");
          setCharacter(newCharacter);
        }

        // Load rolls
        const existingRolls = await diceService.getRolls();
        setRolls(existingRolls);
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
      setRolls(prevRolls => [roll, ...prevRolls.slice(0, 99)]); // Keep only 100 rolls
    } catch (error) {
      console.error("Failed to roll dice:", error);
    }
  };

  const handleRollSkill = async (skillName: SkillName, attributeValue: number, skillModifier: number, advantageLevel: number) => {
    try {
      const skill = character.skills[skillName];
      const totalModifier = attributeValue + skillModifier;
      const roll = await diceService.addRoll(20, totalModifier, skill.name, advantageLevel);
      setRolls(prevRolls => [roll, ...prevRolls.slice(0, 99)]); // Keep only 100 rolls
    } catch (error) {
      console.error("Failed to roll skill:", error);
    }
  };

  const handleAttack = async (weaponName: string, damage: string, attributeModifier: number, advantageLevel: number) => {
    try {
      const roll = await diceService.addAttackRoll(damage, attributeModifier, `${weaponName} attack`, advantageLevel);
      setRolls(prevRolls => [roll, ...prevRolls.slice(0, 99)]); // Keep only 100 rolls
    } catch (error) {
      console.error("Failed to roll attack:", error);
    }
  };

  const handleRollInitiative = async (totalModifier: number, advantageLevel: number) => {
    try {
      const roll = await diceService.addRoll(20, totalModifier, "Initiative", advantageLevel);
      setRolls(prevRolls => [roll, ...prevRolls.slice(0, 99)]); // Keep only 100 rolls
    } catch (error) {
      console.error("Failed to roll initiative:", error);
    }
  };

  const handleClearRolls = async () => {
    try {
      await diceService.clearRolls();
      setRolls([]);
    } catch (error) {
      console.error("Failed to clear rolls:", error);
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
        <h1 className="text-3xl font-bold text-center">Nimble Character Sheet</h1>
        <CharacterSheet 
          character={character} 
          onUpdate={handleCharacterUpdate} 
          onRollAttribute={handleRollAttribute}
          onRollSkill={handleRollSkill}
          onRollInitiative={handleRollInitiative}
          onAttack={handleAttack}
        />
        <RollLog rolls={rolls} onClearRolls={handleClearRolls} />
      </div>
    </main>
  );
}