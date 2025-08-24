"use client";

import { useCallback } from "react";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { AttributeName } from "@/lib/types/character";
import { ChevronDown, ChevronRight, Dice6, Shield } from "lucide-react";
import { getCharacterService } from "@/lib/services/service-factory";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { useUIStateService } from "@/lib/hooks/use-ui-state-service";
import { useDiceActions } from "@/lib/hooks/use-dice-actions";
import { getClassDefinition } from "@/lib/data/classes/index";

export function AttributesSection() {
  // Direct singleton access with automatic re-rendering - no context needed!
  const { character, updateCharacter } = useCharacterService();
  const { uiState, updateCollapsibleState } = useUIStateService();
  const { rollAttribute, rollSave } = useDiceActions();
  
  const isOpen = uiState.collapsibleSections.attributes;
  const advantageLevel = uiState.advantageLevel;
  const onToggle = (isOpen: boolean) => updateCollapsibleState('attributes', isOpen);
  
  // Get key attributes for the character's class
  const characterClass = character ? getClassDefinition(character.classId) : null;
  const keyAttributes = characterClass?.keyAttributes || [];
  
  const onAttributeChange = useCallback(async (attributeName: AttributeName, value: string) => {
    if (!character) return;
    
    const numValue = parseInt(value) || 0;
    if (numValue >= -2 && numValue <= 10) {
      const updated = {
        ...character,
        attributes: {
          ...character.attributes,
          [attributeName]: numValue,
        },
      };
      await updateCharacter(updated);
    }
  }, [character, updateCharacter]);

  // Helper function to render a single attribute
  const renderAttribute = (attributeName: AttributeName, displayName: string) => {
    if (!character) return null;
    
    const isKeyAttribute = keyAttributes.includes(attributeName);
    const value = character.attributes[attributeName];
    
    return (
      <Card key={attributeName} className={`${isKeyAttribute ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader className="pb-2">
          <CardTitle className={`text-center text-sm ${isKeyAttribute ? 'font-bold underline' : ''}`}>
            {displayName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Input
            type="number"
            min="-2"
            max="10"
            value={value}
            onChange={(e) => onAttributeChange(attributeName, e.target.value)}
            className="text-center text-lg font-bold h-8"
          />
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rollAttribute(attributeName, value, advantageLevel)}
                  className="flex-1 h-7 px-2"
                >
                  <Dice6 className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Roll {displayName}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => rollSave(attributeName, value, advantageLevel)}
                  className="flex-1 h-7 px-2"
                >
                  <Shield className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save {displayName}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Early return if no character (shouldn't happen in normal usage)
  if (!character) return null;
  return (
    <TooltipProvider>
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <h2 className="text-xl font-semibold">Attributes</h2>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {renderAttribute("strength", "Strength")}
            {renderAttribute("dexterity", "Dexterity")}
            {renderAttribute("intelligence", "Intelligence")}
            {renderAttribute("will", "Will")}
          </div>
          {keyAttributes.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Key attributes for {characterClass?.name}: <span className="font-semibold underline">{keyAttributes.join(", ")}</span>
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
}