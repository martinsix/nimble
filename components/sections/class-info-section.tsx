"use client";

import { Character } from "@/lib/types/character";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Shield, ChevronDown, ChevronRight, TrendingUp } from "lucide-react";
import { getClassDefinition } from "@/lib/data/classes";

interface ClassInfoSectionProps {
  character: Character;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onLevelUp?: () => void;
}

export function ClassInfoSection({ character, isOpen, onToggle, onLevelUp }: ClassInfoSectionProps) {
  const classDefinition = getClassDefinition(character.classId);
  
  if (!classDefinition) {
    return null; // Handle missing class gracefully
  }

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Class & Level
          </h2>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="w-full">
          <CardContent className="space-y-4 pt-6">
            {/* Class and Level Display */}
            <div className="text-center space-y-3">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">
                  {classDefinition.name}
                </div>
                <div className="text-lg text-muted-foreground">
                  Level {character.level}
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground max-w-md mx-auto">
                {classDefinition.description}
              </div>
            </div>

            {/* Class Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold">d{classDefinition.hitDieSize}</div>
                <div className="text-xs text-muted-foreground">Hit Die</div>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold">{character.grantedFeatures.length}</div>
                <div className="text-xs text-muted-foreground">Features Unlocked</div>
              </div>
            </div>

            {/* Level Up Button */}
            {onLevelUp && character.level < 20 && (
              <div className="pt-2">
                <Button 
                  onClick={onLevelUp} 
                  className="w-full"
                  variant="outline"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Level Up to {character.level + 1}
                </Button>
              </div>
            )}

            {character.level >= 20 && (
              <div className="text-center text-sm text-muted-foreground pt-2">
                Maximum level reached
              </div>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}