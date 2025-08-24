"use client";

import { useCallback } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Character } from "@/lib/types/character";
import { Zap, Dice6, ChevronDown, ChevronRight, Swords } from "lucide-react";
import { getCharacterService } from "@/lib/services/service-factory";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { useDiceActions } from "@/lib/hooks/use-dice-actions";
import { useUIStateService } from "@/lib/hooks/use-ui-state-service";

export function InitiativeSection() {
  // Get everything we need from service hooks
  const { character, endEncounter, startEncounter } = useCharacterService();
  const { rollInitiative } = useDiceActions();
  const { uiState, updateCollapsibleState } = useUIStateService();
  
  const onInitiativeChange = useCallback(async (modifier: number) => {
    if (!character) return;
    const characterService = getCharacterService();
    const updated = {
      ...character,
      initiative: {
        ...character.initiative,
        modifier,
      },
    };
    await characterService.updateCharacter(updated);
  }, [character]);
  
  // Early return if no character (shouldn't happen in normal usage)
  if (!character) return null;
  
  const isOpen = uiState.collapsibleSections.initiative;
  const advantageLevel = uiState.advantageLevel;
  const onToggle = (isOpen: boolean) => updateCollapsibleState('initiative', isOpen);
  
  const initiative = character.initiative;
  const dexterityValue = character.attributes.dexterity;
  const inEncounter = character.inEncounter;
  const totalModifier = dexterityValue + initiative.modifier;

  const handleModifierChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 20) {
      onInitiativeChange(numValue);
    }
  };

  const handleRoll = async () => {
    if (!character) return;
    
    const result = await rollInitiative(totalModifier, advantageLevel);
    
    // Use the character service to handle encounter setup
    await startEncounter(result.rollTotal);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Initiative
          </h2>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="w-full">
          <CardContent className="space-y-4 pt-6">
        {/* Initiative Display */}
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold">
            {totalModifier > 0 ? '+' : ''}{totalModifier}
          </div>
          <div className="text-sm text-muted-foreground">
            Base: {dexterityValue > 0 ? '+' : ''}{dexterityValue} (DEX) | 
            Modifier: +{initiative.modifier} | 
            Total: {totalModifier > 0 ? '+' : ''}{totalModifier}
          </div>
        </div>

        {/* Modifier Input */}
        <div className="space-y-2">
          <Label htmlFor="initiative-modifier" className="text-sm font-medium">
            Initiative Modifier
          </Label>
          <Input
            id="initiative-modifier"
            type="number"
            min="0"
            max="20"
            value={initiative.modifier}
            onChange={(e) => handleModifierChange(e.target.value)}
            className="text-center font-semibold"
            placeholder="Initiative modifier"
          />
        </div>

        {/* Action Buttons */}
        {!inEncounter ? (
          <Button
            variant="outline"
            size="lg"
            onClick={handleRoll}
            className="w-full"
          >
            <Dice6 className="w-5 h-5 mr-2" />
            Roll Initiative (d20{totalModifier > 0 ? '+' + totalModifier : ''})
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="text-center text-sm text-muted-foreground bg-muted p-2 rounded">
              <Swords className="w-4 h-4 inline mr-1" />
              In Combat - Initiative cannot be rolled
            </div>
            <Button
              variant="destructive"
              size="lg"
              onClick={endEncounter}
              className="w-full"
            >
              <Swords className="w-5 h-5 mr-2" />
              End Combat
            </Button>
          </div>
        )}
        </CardContent>
      </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}