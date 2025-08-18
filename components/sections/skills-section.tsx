"use client";

import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Character, SkillName } from "@/lib/types/character";
import { ChevronDown, ChevronRight, Dice6 } from "lucide-react";

interface SkillsSectionProps {
  character: Character;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onSkillChange: (skillName: SkillName, value: string) => void;
  onRollSkill: (skillName: SkillName, attributeValue: number, skillModifier: number, advantageLevel: number) => void;
  advantageLevel: number;
}

export function SkillsSection({ 
  character, 
  isOpen, 
  onToggle, 
  onSkillChange, 
  onRollSkill, 
  advantageLevel 
}: SkillsSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <h2 className="text-xl font-semibold">Skills</h2>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {Object.entries(character.skills).map(([skillKey, skill]) => {
            const skillName = skillKey as SkillName;
            const attributeValue = character.attributes[skill.associatedAttribute];
            const totalModifier = attributeValue + skill.modifier;
            
            return (
              <Card key={skillKey}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-center text-base">
                    {skill.name} ({skill.associatedAttribute.slice(0, 3).toUpperCase()})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-center text-sm text-muted-foreground">
                    Base: {attributeValue > 0 ? '+' : ''}{attributeValue} | 
                    Skill: +{skill.modifier} | 
                    Total: {totalModifier > 0 ? '+' : ''}{totalModifier}
                  </div>
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    value={skill.modifier}
                    onChange={(e) => onSkillChange(skillName, e.target.value)}
                    className="text-center font-semibold"
                    placeholder="Skill modifier"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRollSkill(skillName, attributeValue, skill.modifier, advantageLevel)}
                    className="w-full"
                  >
                    <Dice6 className="w-4 h-4 mr-2" />
                    Roll
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}