"use client";

import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Inventory as InventoryType } from "@/lib/types/inventory";
import { Inventory } from "../inventory";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCharacterActions } from "@/lib/contexts/character-actions-context";
import { useUIState } from "@/lib/contexts/ui-state-context";
import { getCharacterService } from "@/lib/services/service-factory";
import { useCallback } from "react";

export function InventorySection() {
  // Get everything we need from context - complete independence!
  const { character } = useCharacterActions();
  const { uiState, updateCollapsibleState } = useUIState();
  
  const onUpdateInventory = useCallback(async (inventory: InventoryType) => {
    if (!character) return;
    const characterService = getCharacterService();
    const updated = {
      ...character,
      inventory,
    };
    await characterService.updateCharacter(updated);
  }, [character]);
  
  // Early return if no character (shouldn't happen in normal usage)
  if (!character) return null;
  
  const isOpen = uiState.collapsibleSections.inventory;
  const onToggle = (isOpen: boolean) => updateCollapsibleState('inventory', isOpen);
  const inventory = character.inventory;
  const characterDexterity = character.attributes.dexterity;
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <h2 className="text-xl font-semibold">Inventory</h2>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-4">
          <Inventory inventory={inventory} characterDexterity={characterDexterity} onUpdateInventory={onUpdateInventory} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}