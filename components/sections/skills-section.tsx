"use client";

import { useCallback } from "react";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Character, SkillName } from "@/lib/types/character";
import { ChevronDown, ChevronRight, Dice6, Plus, Minus, Sparkles, Search, Target, MessageCircle, Brain, Dumbbell, BookOpen, Leaf, Radar, EyeOff } from "lucide-react";
import { getCharacterService } from "@/lib/services/service-factory";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { useDiceActions } from "@/lib/hooks/use-dice-actions";
import { useUIStateService } from "@/lib/hooks/use-ui-state-service";

function getSkillIcon(skillName: SkillName) {
  const iconMap = {
    arcana: Sparkles,
    examination: Search,
    finesse: Target,
    influence: MessageCircle,
    insight: Brain,
    might: Dumbbell,
    lore: BookOpen,
    naturecraft: Leaf,
    perception: Radar,
    stealth: EyeOff,
  };
  
  return iconMap[skillName as keyof typeof iconMap] || Dice6;
}

export function SkillsSection() {
  // Get everything we need from service hooks
  const { character } = useCharacterService();
  const { rollSkill } = useDiceActions();
  const { uiState, updateCollapsibleState } = useUIStateService();
  
  const isOpen = uiState.collapsibleSections.skills;
  const advantageLevel = uiState.advantageLevel;
  const onToggle = (isOpen: boolean) => updateCollapsibleState('skills', isOpen);
  
  const onSkillChange = useCallback(async (skillName: SkillName, delta: number) => {
    if (!character) return;
    
    const currentValue = character.skills[skillName].modifier;
    const newValue = Math.max(0, Math.min(20, currentValue + delta));
    
    if (newValue !== currentValue) {
      const characterService = getCharacterService();
      const updated = {
        ...character,
        skills: {
          ...character.skills,
          [skillName]: {
            ...character.skills[skillName],
            modifier: newValue,
          },
        },
      };
      await characterService.updateCharacter(updated);
    }
  }, [character]);
  
  // Early return if no character (shouldn't happen in normal usage)
  if (!character) return null;
  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Skills</CardTitle>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t" />
          <CardContent className="p-0">
            <div className="divide-y">
              {Object.entries(character.skills).map(([skillKey, skill], index) => {
                const skillName = skillKey as SkillName;
                const attributeValue = character.attributes[skill.associatedAttribute];
                const totalModifier = attributeValue + skill.modifier;
                
                return (
                  <div key={skillKey} className="p-3 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const IconComponent = getSkillIcon(skillName);
                          return <IconComponent className="w-6 h-6 text-muted-foreground shrink-0" />;
                        })()}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm">
                            {skill.name} ({skill.associatedAttribute.slice(0, 3).toUpperCase()})
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {attributeValue > 0 ? '+' : ''}{attributeValue} ({skill.associatedAttribute.slice(0, 3).toUpperCase()}) + {skill.modifier} (Skill) = {totalModifier > 0 ? '+' : ''}{totalModifier}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border rounded">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onSkillChange(skillName, -1)}
                              disabled={skill.modifier <= 0}
                              className="h-8 w-8 p-0 rounded-none border-r"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 h-8 flex items-center justify-center text-sm font-medium bg-background">
                              {skill.modifier}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onSkillChange(skillName, 1)}
                              disabled={skill.modifier >= 20}
                              className="h-8 w-8 p-0 rounded-none border-l"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => rollSkill(skillName, attributeValue, skill.modifier, advantageLevel)}
                            className="h-8 px-3"
                          >
                            <Dice6 className="w-3 h-3 mr-1" />
                            Roll
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}