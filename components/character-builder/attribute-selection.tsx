"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Attributes, AttributeName } from "@/lib/types/character";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { gameConfig } from '../../lib/config/game-config';

interface AttributeSelectionProps {
  characterId: string;
  onBack: () => void;
  onNext: () => void;
}

const STANDARD_ARRAYS = {
  standard: { name: "Standard", values: [2, 2, 0, -1] },
  balanced: { name: "Balanced", values: [2, 1, 1, 0] },
  minMax: { name: "Min-Max", values: [3, 1, -1, -1] }
} as const;

const ATTRIBUTE_NAMES: AttributeName[] = ['strength', 'dexterity', 'intelligence', 'will'];
const ATTRIBUTE_LABELS = {
  strength: 'Strength',
  dexterity: 'Dexterity', 
  intelligence: 'Intelligence',
  will: 'Will'
} as const;

export function AttributeSelection({
  onBack,
  onNext
}: AttributeSelectionProps) {
  const [selectedArray, setSelectedArray] = useState<keyof typeof STANDARD_ARRAYS>('standard');
  const { character, updateCharacter } = useCharacterService();

  // Get attributes from the hook's character state, with fallback
  const attributes = character?.attributes || {
    strength: 0,
    dexterity: 0, 
    intelligence: 0,
    will: 0
  };

  const assignedValues = [attributes.strength, attributes.dexterity, attributes.intelligence, attributes.will];

  const onAttributeChange = async (attribute: AttributeName, value: number) => {
    try {
      if (character) {
        const updatedCharacter = {
          ...character,
          attributes: {
            ...character.attributes,
            [attribute]: value
          }
        };
        
        await updateCharacter(updatedCharacter);
      }
    } catch (error) {
      console.error('Failed to update character attributes:', error);
    }
  };

  const handleReset = async () => {
    if (character) {
      const attributes = {
        strength: 0,
        dexterity: 0, 
        intelligence: 0,
        will: 0
      };
      const updatedCharacter = {
        ...character,
        attributes: {
          ...attributes
        }
      };
      await updateCharacter(updatedCharacter);
    }
  };

  const handleManualChange = (attribute: AttributeName, value: string) => {
    const numValue = parseInt(value) || 0;
    // Clamp attributes to game config range
    const clampedValue = Math.max(gameConfig.character.attributeRange.min, Math.min(gameConfig.character.attributeRange.max, numValue));
    
    onAttributeChange(attribute, clampedValue);
  };

  const getAvailableValues = (forAttribute: AttributeName) => {
    const arrayValues = [...STANDARD_ARRAYS[selectedArray].values] as number[];
    const currentAttributeValue = attributes[forAttribute];
    
    // Get remaining values by removing assigned ones
    const remainingValues = [...arrayValues];
    assignedValues.forEach(usedValue => {
      const index = remainingValues.indexOf(usedValue);
      if (index > -1) {
        remainingValues.splice(index, 1);
      }
    });
    
    // If current attribute has a value from this array, add it back as available
    if (arrayValues.includes(currentAttributeValue)) {
      remainingValues.push(currentAttributeValue);
    }
    
    // Return unique values only
    return Array.from(new Set(remainingValues)).sort((a, b) => b - a);;
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-1">Assign Attributes</h2>
        <p className="text-sm text-muted-foreground">Choose how to distribute your character&apos;s attributes</p>
      </div>

      {/* Array Selection */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Standard Array</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label htmlFor="array-select" className="text-sm font-medium">
              Select Array:
            </label>
            <Select value={selectedArray} onValueChange={(value: keyof typeof STANDARD_ARRAYS) => setSelectedArray(value)}>
              <SelectTrigger className="w-full sm:flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STANDARD_ARRAYS).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.name} ({config.values.join(', ')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Click the value buttons below each attribute to assign values from the selected array.
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={handleReset} size="sm">
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Individual Attribute Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ATTRIBUTE_NAMES.map((attributeName) => {
          const availableValues = getAvailableValues(attributeName);
          
          return (
            <Card key={attributeName} className="h-fit">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-sm text-center">{ATTRIBUTE_LABELS[attributeName]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="flex justify-center">
                  <Input
                    type="number"
                    value={attributes[attributeName]}
                    onChange={(e) => handleManualChange(attributeName, e.target.value)}
                    className="w-16 h-8 text-center text-sm font-medium"
                    min="-5"
                    max="10"
                  />
                </div>
                
                <div className="flex flex-wrap justify-center gap-1">
                  {availableValues.map((value) => (
                    <Button
                      key={value}
                      variant={attributes[attributeName] === value ? "default" : "outline"}
                      size="sm"
                      onClick={() => onAttributeChange(attributeName, value)}
                      className="px-2 py-1 h-7 text-xs min-w-[2rem]"
                    >
                      {value >= 0 ? `+${value}` : value}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} size="sm">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Heritage
        </Button>
        <Button onClick={onNext} size="sm">
          Create Character
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}