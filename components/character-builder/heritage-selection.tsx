"use client";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { AncestryDefinition } from "@/lib/types/ancestry";
import { BackgroundDefinition } from "@/lib/types/background";

interface HeritageSelectionProps {
  availableAncestries: AncestryDefinition[];
  availableBackgrounds: BackgroundDefinition[];
  selectedAncestryId?: string;
  selectedBackgroundId?: string;
  characterName: string;
  onAncestrySelect: (ancestryId: string) => void;
  onBackgroundSelect: (backgroundId: string) => void;
  onNameChange: (name: string) => void;
  onSuggestName: () => void;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}

export function HeritageSelection({
  availableAncestries,
  availableBackgrounds,
  selectedAncestryId,
  selectedBackgroundId,
  characterName,
  onAncestrySelect,
  onBackgroundSelect,
  onNameChange,
  onSuggestName,
  onBack,
  onNext,
  canProceed
}: HeritageSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Character Heritage</h2>
        <p className="text-muted-foreground">Choose your ancestry, background, and name</p>
      </div>

      {/* Character Name */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Character Name</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={characterName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Enter character name"
                className="text-lg"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={onSuggestName}
              disabled={!selectedAncestryId}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Suggest
            </Button>
          </div>
          {selectedAncestryId && (
            <p className="text-sm text-muted-foreground mt-2">
              Click &quot;Suggest&quot; for {availableAncestries.find(a => a.id === selectedAncestryId)?.name} names
            </p>
          )}
        </CardContent>
      </Card>

      {/* Ancestry Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Ancestry</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableAncestries.map((ancestry: AncestryDefinition) => (
            <Card 
              key={ancestry.id}
              className={`cursor-pointer transition-all ${
                selectedAncestryId === ancestry.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
              }`}
              onClick={() => onAncestrySelect(ancestry.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{ancestry.name}</CardTitle>
                  {selectedAncestryId === ancestry.id && (
                    <Badge className="ml-2">Selected</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {ancestry.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs capitalize">
                    {ancestry.size}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Speed {ancestry.baseSpeed}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Background Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Background</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableBackgrounds.map((background: BackgroundDefinition) => (
            <Card 
              key={background.id}
              className={`cursor-pointer transition-all ${
                selectedBackgroundId === background.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
              }`}
              onClick={() => onBackgroundSelect(background.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{background.name}</CardTitle>
                  {selectedBackgroundId === background.id && (
                    <Badge className="ml-2">Selected</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {background.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Class
        </Button>
        <Button 
          onClick={onNext}
          disabled={!canProceed}
        >
          Create Character
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}