"use client";

import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Character, AttributeName } from "@/lib/types/character";
import { ChevronDown, ChevronRight, Dice6, Shield } from "lucide-react";

interface AttributesSectionProps {
  character: Character;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onAttributeChange: (attributeName: AttributeName, value: string) => void;
  onRollAttribute: (attributeName: AttributeName, value: number, advantageLevel: number) => void;
  onRollSave: (attributeName: AttributeName, value: number, advantageLevel: number) => void;
  advantageLevel: number;
}

export function AttributesSection({ 
  character, 
  isOpen, 
  onToggle, 
  onAttributeChange, 
  onRollAttribute, 
  onRollSave,
  advantageLevel 
}: AttributesSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <h2 className="text-xl font-semibold">Attributes</h2>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
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
                value={character.attributes.strength}
                onChange={(e) => onAttributeChange("strength", e.target.value)}
                className="text-center text-xl font-bold"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRollAttribute("strength", character.attributes.strength, advantageLevel)}
                className="w-full"
              >
                <Dice6 className="w-4 h-4 mr-2" />
                Roll
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onRollSave("strength", character.attributes.strength, advantageLevel)}
                className="w-full"
              >
                <Shield className="w-4 h-4 mr-2" />
                Save
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
                value={character.attributes.dexterity}
                onChange={(e) => onAttributeChange("dexterity", e.target.value)}
                className="text-center text-xl font-bold"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRollAttribute("dexterity", character.attributes.dexterity, advantageLevel)}
                className="w-full"
              >
                <Dice6 className="w-4 h-4 mr-2" />
                Roll
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onRollSave("dexterity", character.attributes.dexterity, advantageLevel)}
                className="w-full"
              >
                <Shield className="w-4 h-4 mr-2" />
                Save
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
                value={character.attributes.intelligence}
                onChange={(e) => onAttributeChange("intelligence", e.target.value)}
                className="text-center text-xl font-bold"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRollAttribute("intelligence", character.attributes.intelligence, advantageLevel)}
                className="w-full"
              >
                <Dice6 className="w-4 h-4 mr-2" />
                Roll
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onRollSave("intelligence", character.attributes.intelligence, advantageLevel)}
                className="w-full"
              >
                <Shield className="w-4 h-4 mr-2" />
                Save
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
                value={character.attributes.will}
                onChange={(e) => onAttributeChange("will", e.target.value)}
                className="text-center text-xl font-bold"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRollAttribute("will", character.attributes.will, advantageLevel)}
                className="w-full"
              >
                <Dice6 className="w-4 h-4 mr-2" />
                Roll
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onRollSave("will", character.attributes.will, advantageLevel)}
                className="w-full"
              >
                <Shield className="w-4 h-4 mr-2" />
                Save
              </Button>
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}