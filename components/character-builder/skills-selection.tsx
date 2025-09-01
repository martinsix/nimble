"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Minus, Plus, RotateCcw, Star } from "lucide-react";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { gameConfig } from "@/lib/config/game-config";

// Skill definitions with their associated attributes (matching existing character skills)
const SKILLS = [
  { name: 'arcana', label: 'Arcana', attribute: 'intelligence' },
  { name: 'examination', label: 'Examination', attribute: 'intelligence' },
  { name: 'finesse', label: 'Finesse', attribute: 'dexterity' },
  { name: 'influence', label: 'Influence', attribute: 'will' },
  { name: 'insight', label: 'Insight', attribute: 'will' },
  { name: 'might', label: 'Might', attribute: 'strength' },
  { name: 'lore', label: 'Lore', attribute: 'intelligence' },
  { name: 'naturecraft', label: 'Naturecraft', attribute: 'will' },
  { name: 'perception', label: 'Perception', attribute: 'will' },
  { name: 'stealth', label: 'Stealth', attribute: 'will' },
] as const;

export function SkillsSelection() {
  const { character, updateCharacter } = useCharacterService();
  const [skillAllocations, setSkillAllocations] = useState<Record<string, number>>({});
  
  const maxSkillPoints = gameConfig.character.initialSkillPoints;
  
  // Initialize skill allocations from character data
  useEffect(() => {
    if (character?.skills) {
      const allocations: Record<string, number> = {};
      SKILLS.forEach(skill => {
        const characterSkill = character.skills[skill.name];
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

  const getAttributeModifier = (attributeName: string) => {
    if (!character?.attributes) return 0;
    return character.attributes[attributeName as keyof typeof character.attributes] || 0;
  };

  const getTotalSkillModifier = (skillName: string, attributeName: string) => {
    const attributeModifier = getAttributeModifier(attributeName);
    const skillPoints = skillAllocations[skillName] || 0;
    return attributeModifier + skillPoints;
  };

  const canIncreaseSkill = (skillName: string) => {
    const currentPoints = skillAllocations[skillName] || 0;
    return getRemainingPoints() > 0 && currentPoints < gameConfig.character.skillModifierRange.max;
  };

  const canDecreaseSkill = (skillName: string) => {
    const currentPoints = skillAllocations[skillName] || 0;
    return currentPoints > 0;
  };

  const handleSkillChange = async (skillName: string, change: number) => {
    const currentPoints = skillAllocations[skillName] || 0;
    const newPoints = Math.max(0, Math.min(gameConfig.character.skillModifierRange.max, currentPoints + change));
    
    if (change > 0 && !canIncreaseSkill(skillName)) return;
    if (change < 0 && !canDecreaseSkill(skillName)) return;

    const newAllocations = {
      ...skillAllocations,
      [skillName]: newPoints
    };
    setSkillAllocations(newAllocations);

    // Update character with new skill modifiers
    if (character) {
      const updatedSkills = { ...character.skills };
      SKILLS.forEach(skill => {
        const skillPoints = newAllocations[skill.name] || 0;
        updatedSkills[skill.name] = {
          ...updatedSkills[skill.name],
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
    SKILLS.forEach(skill => {
      resetAllocations[skill.name] = 0;
    });
    setSkillAllocations(resetAllocations);

    // Update character with reset skills
    if (character) {
      const updatedSkills = { ...character.skills };
      SKILLS.forEach(skill => {
        updatedSkills[skill.name] = {
          ...updatedSkills[skill.name],
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

  const formatModifier = (value: number) => {
    return value >= 0 ? `+${value}` : `${value}`;
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

      {/* Skills List - Compact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {SKILLS.map((skill) => {
          const attributeModifier = getAttributeModifier(skill.attribute);
          const skillPoints = skillAllocations[skill.name] || 0;
          const totalModifier = getTotalSkillModifier(skill.name, skill.attribute);
          
          return (
            <Card key={skill.name} className="h-fit">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{skill.label}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {formatModifier(attributeModifier)} {skill.attribute.slice(0, 3).toUpperCase()} + {skillPoints}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    {/* Star icons for skill points */}
                    <div className="flex items-center gap-0.5 mr-1">
                      {Array.from({ length: skillPoints }, (_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                      ))}
                      {skillPoints === 0 && (
                        <div className="w-2.5 h-2.5" />
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSkillChange(skill.name, -1)}
                      disabled={!canDecreaseSkill(skill.name)}
                      className="w-6 h-6 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Badge variant="outline" className="text-sm font-mono min-w-8 justify-center">
                      {formatModifier(totalModifier)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSkillChange(skill.name, 1)}
                      disabled={!canIncreaseSkill(skill.name)}
                      className="w-6 h-6 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}