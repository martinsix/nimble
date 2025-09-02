"use client";

import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Actions } from "../actions";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { useDiceActions } from "@/lib/hooks/use-dice-actions";
import { useUIStateService } from "@/lib/hooks/use-ui-state-service";

export function ActionsSection() {
  // Get everything we need from service hooks
  const { character } = useCharacterService();
  const { attack } = useDiceActions();
  const { uiState, updateCollapsibleState } = useUIStateService();

  // Early return if no character (shouldn't happen in normal usage)
  if (!character) return null;

  const isOpen = uiState.collapsibleSections.actions;
  const advantageLevel = uiState.advantageLevel;
  const onToggle = (isOpen: boolean) =>
    updateCollapsibleState("actions", isOpen);
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <h2 className="text-xl font-semibold">Actions</h2>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-4 mb-24">
          <Actions
            character={character}
            onAttack={attack}
            advantageLevel={advantageLevel}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
