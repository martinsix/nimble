"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Character } from "@/lib/types/character";
import { Swords, Plus, RotateCcw, Minus, ChevronDown, ChevronRight } from "lucide-react";
import { useCharacterActions } from "@/lib/contexts/character-actions-context";
import { useUIState } from "@/lib/contexts/ui-state-context";

export function ActionTrackerSection() {
  // Get everything we need from context - complete independence!
  const { character, onUpdateActions, onUpdateAbilities, onEndTurn } = useCharacterActions();
  const { uiState, updateCollapsibleState } = useUIState();
  
  // Early return if no character (shouldn't happen in normal usage)
  if (!character) return null;
  
  const isOpen = uiState.collapsibleSections.actionTracker;
  const onToggle = (isOpen: boolean) => updateCollapsibleState('actionTracker', isOpen);
  
  const actionTracker = character.actionTracker;
  const abilities = character.abilities;
  const totalActions = actionTracker.base + actionTracker.bonus;
  
  const useAction = () => {
    if (actionTracker.current > 0) {
      onUpdateActions({
        ...actionTracker,
        current: actionTracker.current - 1,
      });
    }
  };

  const addBonusAction = () => {
    onUpdateActions({
      ...actionTracker,
      bonus: actionTracker.bonus + 1,
      current: actionTracker.current + 1,
    });
  };

  const endTurn = () => {
    // Reset per-turn abilities
    const resetAbilities = {
      abilities: abilities.abilities.map(ability => {
        if (ability.type === 'action' && ability.frequency === 'per_turn') {
          return { ...ability, currentUses: ability.maxUses };
        }
        return ability;
      })
    };

    const resetActionTracker = {
      ...actionTracker,
      current: actionTracker.base, // Reset to base actions only
      bonus: 0, // Reset bonus actions to zero
    };

    if (onEndTurn) {
      // Use the combined handler if available
      onEndTurn(resetActionTracker, resetAbilities);
    } else {
      // Fallback to separate updates
      onUpdateActions(resetActionTracker);
      onUpdateAbilities(resetAbilities);
    }
  };


  const getActionDots = () => {
    const dots = [];
    for (let i = 0; i < totalActions; i++) {
      const isBonus = i >= actionTracker.base;
      const isAvailable = i < actionTracker.current;
      
      dots.push(
        <div
          key={i}
          className={`w-4 h-4 rounded-full border-2 ${
            isAvailable 
              ? isBonus 
                ? 'bg-blue-500 border-blue-500' // Bonus actions are blue
                : 'bg-green-500 border-green-500' // Regular actions are green
              : isBonus
                ? 'bg-gray-200 border-blue-300' // Used bonus actions
                : 'bg-gray-200 border-gray-300' // Used regular actions
          }`}
          title={isBonus ? 'Bonus Action' : 'Base Action'}
        />
      );
    }
    return dots;
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5" />
                Actions
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  {actionTracker.current} / {totalActions}
                </span>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Action Display */}
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center gap-1">
                {getActionDots()}
              </div>
              <div className="text-sm text-muted-foreground">
                {actionTracker.base} base
                {actionTracker.bonus > 0 && ` + ${actionTracker.bonus} bonus`}
              </div>
            </div>

            {/* Action Controls */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={useAction}
                disabled={actionTracker.current === 0}
                variant="destructive"
                size="sm"
              >
                <Minus className="w-4 h-4 mr-1" />
                Use Action
              </Button>
              <Button 
                onClick={endTurn}
                variant="default"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                End Turn
              </Button>
            </div>

            {/* Additional Controls */}
            <div className="flex justify-center">
              <Button 
                onClick={addBonusAction}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Bonus Action
              </Button>
            </div>

            {/* Usage Instructions */}
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              <strong>Initiative Rules:</strong> Actions available based on initiative roll:
              <br />• &lt;10: 1 action • 10-20: 2 actions • &gt;20: 3 actions
              <br />• <span className="text-blue-600">Blue dots</span> = bonus actions, <span className="text-green-600">green dots</span> = base actions
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}