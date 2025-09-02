"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { RotateCcw } from "lucide-react";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { gameConfig } from "@/lib/config/game-config";
import { SkillsList } from "../shared/skills-list";

export function SkillsSelection() {
  const { character, updateCharacter } = useCharacterService();
  const [skillAllocations, setSkillAllocations] = useState<Record<string, number>>({});
  
  const maxSkillPoints = gameConfig.character.initialSkillPoints;
  
  // Initialize skill allocations from character data
  useEffect(() => {
    if (character?.skills) {
      const allocations: Record<string, number> = {};
      gameConfig.skills.forEach(skill => {
        const characterSkill = character.skills[skill.name as keyof typeof character.skills];
        allocations[skill.name] = characterSkill?.modifier || 0;
      });
      setSkillAllocations(allocations);
    }
  }, [character]);

  const getTotalAllocatedPoints = () => {
    return Object.values(skillAllocations).reduce((sum, points) => sum + points, 0);
  };

  const getRemainingPoints = () => {
    return maxSkillPoints - getTotalAllocatedPoints();
  };

  const handleSkillChange = async (skillName: string, newValue: number) => {
    const newAllocations = {
      ...skillAllocations,
      [skillName]: newValue
    };
    setSkillAllocations(newAllocations);

    // Update character with new skill modifiers
    if (character) {
      const updatedSkills = { ...character.skills };
      gameConfig.skills.forEach(skill => {
        const skillPoints = newAllocations[skill.name] || 0;
        const skillKey = skill.name as keyof typeof updatedSkills;
        updatedSkills[skillKey] = {
          ...updatedSkills[skillKey],
          modifier: skillPoints
        };
      });

      const updatedCharacter = {
        ...character,
        skills: updatedSkills
      };
      
      await updateCharacter(updatedCharacter);
    }
  };

  const handleReset = async () => {
    const resetAllocations: Record<string, number> = {};
    gameConfig.skills.forEach(skill => {
      resetAllocations[skill.name] = 0;
    });
    setSkillAllocations(resetAllocations);

    // Update character with reset skills
    if (character) {
      const updatedSkills = { ...character.skills };
      gameConfig.skills.forEach(skill => {
        const skillKey = skill.name as keyof typeof updatedSkills;
        updatedSkills[skillKey] = {
          ...updatedSkills[skillKey],
          modifier: 0
        };
      });

      const updatedCharacter = {
        ...character,
        skills: updatedSkills
      };
      
      await updateCharacter(updatedCharacter);
    }
  };

  const getAttributeValues = (): Record<string, number> => {
    if (!character?.attributes) {
      return {
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        will: 0,
      };
    }
    return {
      strength: character.attributes.strength || 0,
      dexterity: character.attributes.dexterity || 0,
      intelligence: character.attributes.intelligence || 0,
      will: character.attributes.will || 0,
    };
  };

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-1">Assign Skill Points</h2>
        <p className="text-sm text-muted-foreground">
          Distribute {maxSkillPoints} points across your skills to customize your character&apos;s capabilities
        </p>
      </div>

      {/* Points Summary - Compact */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <span className="font-medium">Points:</span>
                <Badge variant={getRemainingPoints() === 0 ? "default" : "secondary"} className="ml-1 text-xs">
                  {getRemainingPoints()} / {maxSkillPoints}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground hidden sm:block">
                Attribute + Points = Total
              </div>
            </div>
            <Button variant="outline" onClick={handleReset} size="sm" className="h-7 px-2 text-xs">
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Skills List - Using shared component */}
      <SkillsList
        skillAllocations={skillAllocations}
        attributeValues={getAttributeValues()}
        onSkillChange={handleSkillChange}
        availablePoints={getRemainingPoints()}
      />
    </div>
  );
}