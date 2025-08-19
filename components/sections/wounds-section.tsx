"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Character, Wounds } from "@/lib/types/character";
import { ChevronDown, ChevronRight, Heart, Skull, AlertTriangle } from "lucide-react";

interface WoundsSectionProps {
  character: Character;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onUpdate: (character: Character) => void;
}

export function WoundsSection({ 
  character, 
  isOpen, 
  onToggle, 
  onUpdate 
}: WoundsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    currentWounds: character.wounds.current,
    maxWounds: character.wounds.max,
  });

  const handleSave = () => {
    const updatedCharacter = {
      ...character,
      wounds: {
        current: editValues.currentWounds,
        max: editValues.maxWounds,
      },
    };
    onUpdate(updatedCharacter);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      currentWounds: character.wounds.current,
      maxWounds: character.wounds.max,
    });
    setIsEditing(false);
  };

  const addWound = () => {
    if (character.wounds.current < character.wounds.max) {
      const updatedCharacter = {
        ...character,
        wounds: {
          ...character.wounds,
          current: character.wounds.current + 1,
        },
      };
      onUpdate(updatedCharacter);
    }
  };

  const removeWound = () => {
    if (character.wounds.current > 0) {
      const updatedCharacter = {
        ...character,
        wounds: {
          ...character.wounds,
          current: character.wounds.current - 1,
        },
      };
      onUpdate(updatedCharacter);
    }
  };

  const getWoundStatus = () => {
    if (character.wounds.current >= character.wounds.max) {
      return { 
        text: "DEAD", 
        color: "text-red-600", 
        bgColor: "bg-red-100", 
        icon: Skull 
      };
    } else if (character.wounds.current >= character.wounds.max - 1) {
      return { 
        text: "CRITICAL", 
        color: "text-orange-600", 
        bgColor: "bg-orange-100", 
        icon: AlertTriangle 
      };
    }
    return { 
      text: "STABLE", 
      color: "text-green-600", 
      bgColor: "bg-green-100", 
      icon: Heart 
    };
  };

  const woundStatus = getWoundStatus();
  const StatusIcon = woundStatus.icon;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon className={`w-5 h-5 ${woundStatus.color}`} />
                Wounds
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${woundStatus.bgColor} ${woundStatus.color}`}>
                  {woundStatus.text}
                </div>
                <div className="text-lg font-bold flex items-center gap-2">
                  <span className={character.wounds.current >= character.wounds.max ? "text-red-600" : ""}>
                    {character.wounds.current}/{character.wounds.max}
                  </span>
                </div>
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
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-wounds">Current Wounds</Label>
                    <Input
                      id="current-wounds"
                      type="number"
                      min="0"
                      max={editValues.maxWounds}
                      value={editValues.currentWounds}
                      onChange={(e) => setEditValues(prev => ({ 
                        ...prev, 
                        currentWounds: Math.max(0, Math.min(parseInt(e.target.value) || 0, editValues.maxWounds))
                      }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-wounds">Maximum Wounds</Label>
                    <Input
                      id="max-wounds"
                      type="number"
                      min="1"
                      max="20"
                      value={editValues.maxWounds}
                      onChange={(e) => setEditValues(prev => ({ 
                        ...prev, 
                        maxWounds: Math.max(1, Math.min(parseInt(e.target.value) || 6, 20))
                      }))}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className={`text-2xl font-bold ${character.wounds.current > 0 ? "text-red-600" : "text-green-600"}`}>
                      {character.wounds.current}
                    </div>
                    <div className="text-sm text-muted-foreground">Current</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{character.wounds.max}</div>
                    <div className="text-sm text-muted-foreground">Maximum</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-center text-sm text-muted-foreground">
                    {character.wounds.current >= character.wounds.max 
                      ? "Character has died from wounds" 
                      : character.wounds.current >= character.wounds.max - 1
                      ? "Character is critically wounded"
                      : "Wounds are gained when reaching 0 HP"}
                  </div>
                  
                  {character.wounds.current < character.wounds.max && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={addWound}
                        className="flex-1"
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Add Wound
                      </Button>
                      
                      {character.wounds.current > 0 && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={removeWound}
                          className="flex-1"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Remove Wound
                        </Button>
                      )}
                    </div>
                  )}
                  
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
                    Edit Wounds Configuration
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}