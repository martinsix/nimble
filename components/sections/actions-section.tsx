"use client";

import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Character } from "@/lib/types/character";
import { Abilities } from "@/lib/types/abilities";
import { AbilityUsageEntry } from "@/lib/types/dice";
import { Actions } from "../actions";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ActionsSectionProps {
  character: Character;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onAttack: (weaponName: string, damage: string, attributeModifier: number, advantageLevel: number) => void;
  onUseAbility?: (abilityId: string) => void;
  advantageLevel: number;
}

export function ActionsSection({ 
  character, 
  isOpen, 
  onToggle, 
  onAttack, 
  onUseAbility,
  advantageLevel 
}: ActionsSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <h2 className="text-xl font-semibold">Actions</h2>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-4">
          <Actions 
            character={character} 
            onAttack={onAttack} 
            onUseAbility={onUseAbility}
            advantageLevel={advantageLevel} 
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}