"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Attributes, AttributeName } from "@/lib/types/character";
import { getCharacterService } from "@/lib/services/service-factory";

interface AttributeSelectionProps {
  characterId: string;
  onBack: () => void;
  onNext: () => void;
}

const STANDARD_ARRAYS = {
  standard: [2, 2, 0, -1],
  balanced: [2, 1, 1, 0],
  minMax: [3, 1, -1, -1]
} as const;

const ATTRIBUTE_NAMES: AttributeName[] = ['strength', 'dexterity', 'intelligence', 'will'];
const ATTRIBUTE_LABELS = {
  strength: 'Strength',
  dexterity: 'Dexterity', 
  intelligence: 'Intelligence',
  will: 'Will'
} as const;

export function AttributeSelection({
  characterId,
  onBack,
  onNext
}: AttributeSelectionProps) {
  const [attributes, setAttributes] = useState<Attributes>({
    strength: 0,
    dexterity: 0, 
    intelligence: 0,
    will: 0
  });
  const characterService = getCharacterService();

  useEffect(() => {
    // Get the current character from the service (already loaded)
    const character = characterService.getCurrentCharacter();
    if (character) {
      setAttributes(character.attributes);
    }

    // Subscribe to character update events
    const unsubscribe = characterService.subscribeToEvent('updated', (event) => {
      if (event.character) {
        setAttributes(event.character.attributes);
      }
    });

    return unsubscribe;
  }, [characterService]);

  const onAttributeChange = async (attribute: AttributeName, value: number) => {
    try {
      const character = characterService.getCurrentCharacter();
      if (character) {
        const updatedCharacter = {
          ...character,
          attributes: {
            ...character.attributes,
            [attribute]: value
          }
        };
        
        await characterService.updateCharacter(updatedCharacter);
      }
    } catch (error) {
      console.error('Failed to update character attributes:', error);
    }
  };
  const handleArrayAssignment = (arrayName: keyof typeof STANDARD_ARRAYS, attributeName: AttributeName) => {
    const arrayValues = STANDARD_ARRAYS[arrayName];
    const attributeIndex = ATTRIBUTE_NAMES.indexOf(attributeName);
    if (attributeIndex !== -1) {
      onAttributeChange(attributeName, arrayValues[attributeIndex]);
    }
  };

  const handleReset = () => {
    ATTRIBUTE_NAMES.forEach(attr => {
      onAttributeChange(attr, 0);
    });
  };

  const handleManualChange = (attribute: AttributeName, value: string) => {
    const numValue = parseInt(value) || 0;
    // Clamp between -5 and 10 (reasonable attribute range)
    const clampedValue = Math.max(-5, Math.min(10, numValue));
    onAttributeChange(attribute, clampedValue);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Assign Attributes</h2>
        <p className="text-muted-foreground">Choose how to distribute your character&apos;s attributes</p>
      </div>

      {/* Standard Arrays */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Standard Arrays</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground mb-3">
            Click the buttons next to each attribute to assign values from these arrays:
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="font-medium mb-1">Standard</div>
              <div className="text-sm text-muted-foreground">{STANDARD_ARRAYS.standard.join(', ')}</div>
            </div>
            <div className="text-center">
              <div className="font-medium mb-1">Balanced</div>
              <div className="text-sm text-muted-foreground">{STANDARD_ARRAYS.balanced.join(', ')}</div>
            </div>
            <div className="text-center">
              <div className="font-medium mb-1">Min-Max</div>
              <div className="text-sm text-muted-foreground">{STANDARD_ARRAYS.minMax.join(', ')}</div>
            </div>
          </div>

          <div className="space-y-3">
            {ATTRIBUTE_NAMES.map((attributeName) => (
              <div key={attributeName} className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium">
                  {ATTRIBUTE_LABELS[attributeName]}:
                </div>
                <div className="w-16">
                  <Input
                    type="number"
                    value={attributes[attributeName]}
                    onChange={(e) => handleManualChange(attributeName, e.target.value)}
                    className="text-center"
                    min="-5"
                    max="10"
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArrayAssignment('standard', attributeName)}
                    className="px-2 py-1 text-xs"
                  >
                    {STANDARD_ARRAYS.standard[ATTRIBUTE_NAMES.indexOf(attributeName)]}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArrayAssignment('balanced', attributeName)}
                    className="px-2 py-1 text-xs"
                  >
                    {STANDARD_ARRAYS.balanced[ATTRIBUTE_NAMES.indexOf(attributeName)]}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArrayAssignment('minMax', attributeName)}
                    className="px-2 py-1 text-xs"
                  >
                    {STANDARD_ARRAYS.minMax[ATTRIBUTE_NAMES.indexOf(attributeName)]}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Button variant="outline" onClick={handleReset} size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Heritage
        </Button>
        <Button onClick={onNext}>
          Create Character
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}