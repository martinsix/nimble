"use client";

import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Character, AttributeName, SkillName } from "@/lib/types/character";
import { Inventory as InventoryType } from "@/lib/types/inventory";
import { Inventory } from "./inventory";
import { Actions } from "./actions";
import { uiStateService, UIState } from "@/lib/services/ui-state-service";
import { ChevronDown, ChevronRight, Dice6 } from "lucide-react";

interface CharacterSheetProps {
  character: Character;
  onUpdate: (character: Character) => void;
  onRollAttribute: (attributeName: AttributeName, value: number) => void;
  onRollSkill: (skillName: SkillName, attributeValue: number, skillModifier: number) => void;
  onAttack: (weaponName: string, damage: string, attributeModifier: number) => void;
}

export function CharacterSheet({ character, onUpdate, onRollAttribute, onRollSkill, onAttack }: CharacterSheetProps) {
  const [localCharacter, setLocalCharacter] = useState(character);
  const [uiState, setUIState] = useState<UIState>({
    collapsibleSections: {
      attributes: true,
      skills: true,
      actions: true,
      inventory: true,
    },
  });

  useEffect(() => {
    const loadUIState = async () => {
      const state = await uiStateService.getUIState();
      setUIState(state);
    };
    loadUIState();
  }, []);

  const updateCollapsibleState = async (section: keyof UIState['collapsibleSections'], isOpen: boolean) => {
    const newUIState = {
      ...uiState,
      collapsibleSections: {
        ...uiState.collapsibleSections,
        [section]: isOpen,
      },
    };
    setUIState(newUIState);
    await uiStateService.saveUIState(newUIState);
  };

  const updateName = (name: string) => {
    const updated = { ...localCharacter, name };
    setLocalCharacter(updated);
    onUpdate(updated);
  };

  const updateAttribute = (attributeName: AttributeName, value: number) => {
    const updated = {
      ...localCharacter,
      attributes: {
        ...localCharacter.attributes,
        [attributeName]: value,
      },
    };
    setLocalCharacter(updated);
    onUpdate(updated);
  };

  const handleAttributeChange = (attributeName: AttributeName, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= -2 && numValue <= 10) {
      updateAttribute(attributeName, numValue);
    }
  };

  const updateSkill = (skillName: SkillName, modifier: number) => {
    const updated = {
      ...localCharacter,
      skills: {
        ...localCharacter.skills,
        [skillName]: {
          ...localCharacter.skills[skillName],
          modifier,
        },
      },
    };
    setLocalCharacter(updated);
    onUpdate(updated);
  };

  const handleSkillChange = (skillName: SkillName, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 20) {
      updateSkill(skillName, numValue);
    }
  };

  const updateInventory = (inventory: InventoryType) => {
    const updated = {
      ...localCharacter,
      inventory,
    };
    setLocalCharacter(updated);
    onUpdate(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Character Name */}
      <div className="text-center">
        <Label htmlFor="character-name" className="text-lg font-semibold">
          Character Name
        </Label>
        <Input
          id="character-name"
          value={localCharacter.name}
          onChange={(e) => updateName(e.target.value)}
          className="text-xl font-bold text-center mt-2 max-w-md mx-auto"
          placeholder="Enter character name"
        />
      </div>

      {/* Attributes Section */}
      <Collapsible 
        open={uiState.collapsibleSections.attributes} 
        onOpenChange={(isOpen) => updateCollapsibleState('attributes', isOpen)}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <h2 className="text-xl font-semibold">Attributes</h2>
            {uiState.collapsibleSections.attributes ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-lg">Strength</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              type="number"
              min="-2"
              max="10"
              value={localCharacter.attributes.strength}
              onChange={(e) => handleAttributeChange("strength", e.target.value)}
              className="text-center text-xl font-bold"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRollAttribute("strength", localCharacter.attributes.strength)}
              className="w-full"
            >
              <Dice6 className="w-4 h-4 mr-2" />
              Roll
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-lg">Dexterity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              type="number"
              min="-2"
              max="10"
              value={localCharacter.attributes.dexterity}
              onChange={(e) => handleAttributeChange("dexterity", e.target.value)}
              className="text-center text-xl font-bold"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRollAttribute("dexterity", localCharacter.attributes.dexterity)}
              className="w-full"
            >
              <Dice6 className="w-4 h-4 mr-2" />
              Roll
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-lg">Intelligence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              type="number"
              min="-2"
              max="10"
              value={localCharacter.attributes.intelligence}
              onChange={(e) => handleAttributeChange("intelligence", e.target.value)}
              className="text-center text-xl font-bold"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRollAttribute("intelligence", localCharacter.attributes.intelligence)}
              className="w-full"
            >
              <Dice6 className="w-4 h-4 mr-2" />
              Roll
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-lg">Will</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              type="number"
              min="-2"
              max="10"
              value={localCharacter.attributes.will}
              onChange={(e) => handleAttributeChange("will", e.target.value)}
              className="text-center text-xl font-bold"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRollAttribute("will", localCharacter.attributes.will)}
              className="w-full"
            >
              <Dice6 className="w-4 h-4 mr-2" />
              Roll
            </Button>
          </CardContent>
        </Card>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Skills Section */}
      <Collapsible 
        open={uiState.collapsibleSections.skills} 
        onOpenChange={(isOpen) => updateCollapsibleState('skills', isOpen)}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <h2 className="text-xl font-semibold">Skills</h2>
            {uiState.collapsibleSections.skills ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {Object.entries(localCharacter.skills).map(([skillKey, skill]) => {
              const skillName = skillKey as SkillName;
              const attributeValue = localCharacter.attributes[skill.associatedAttribute];
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
                      onChange={(e) => handleSkillChange(skillName, e.target.value)}
                      className="text-center font-semibold"
                      placeholder="Skill modifier"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRollSkill(skillName, attributeValue, skill.modifier)}
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

      {/* Actions Section */}
      <Collapsible 
        open={uiState.collapsibleSections.actions} 
        onOpenChange={(isOpen) => updateCollapsibleState('actions', isOpen)}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <h2 className="text-xl font-semibold">Actions</h2>
            {uiState.collapsibleSections.actions ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-4">
            <Actions character={localCharacter} onAttack={onAttack} />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Inventory Section */}
      <Collapsible 
        open={uiState.collapsibleSections.inventory} 
        onOpenChange={(isOpen) => updateCollapsibleState('inventory', isOpen)}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <h2 className="text-xl font-semibold">Inventory</h2>
            {uiState.collapsibleSections.inventory ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-4">
            <Inventory inventory={localCharacter.inventory} onUpdateInventory={updateInventory} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}