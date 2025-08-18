"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Skill } from "@/lib/types/character";
import { Zap, Dice6, ChevronDown, ChevronRight } from "lucide-react";

interface InitiativeSectionProps {
  initiative: Skill;
  dexterityValue: number;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onInitiativeChange: (modifier: number) => void;
  onRollInitiative: (totalModifier: number, advantageLevel: number) => void;
  advantageLevel: number;
}

export function InitiativeSection({ 
  initiative, 
  dexterityValue, 
  isOpen, 
  onToggle, 
  onInitiativeChange, 
  onRollInitiative, 
  advantageLevel 
}: InitiativeSectionProps) {
  const totalModifier = dexterityValue + initiative.modifier;

  const handleModifierChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 20) {
      onInitiativeChange(numValue);
    }
  };

  const handleRoll = () => {
    onRollInitiative(totalModifier, advantageLevel);
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

        {/* Roll Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={handleRoll}
          className="w-full"
        >
          <Dice6 className="w-5 h-5 mr-2" />
          Roll Initiative (d20{totalModifier > 0 ? '+' : ''}{totalModifier})
        </Button>
        </CardContent>
      </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}