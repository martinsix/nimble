"use client";

import { useState } from "react";
import { Character, CharacterConfiguration } from "@/lib/types/character";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface CharacterConfigDialogProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: CharacterConfiguration) => void;
}

export function CharacterConfigDialog({ character, isOpen, onClose, onSave }: CharacterConfigDialogProps) {
  const [config, setConfig] = useState<CharacterConfiguration>(character.config);

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const handleCancel = () => {
    // Reset to original config
    setConfig(character.config);
    onClose();
  };

  const updateMaxWounds = (value: string) => {
    const numValue = parseInt(value) || 1;
    setConfig(prev => ({
      ...prev,
      maxWounds: Math.max(1, numValue), // Minimum of 1 wound
    }));
  };

  const updateMaxHP = (value: string) => {
    const numValue = parseInt(value) || 1;
    setConfig(prev => ({
      ...prev,
      maxHP: Math.max(1, numValue), // Minimum of 1 HP
    }));
  };

  const updateMaxInventorySize = (value: string) => {
    const numValue = parseInt(value) || 1;
    setConfig(prev => ({
      ...prev,
      maxInventorySize: Math.max(1, numValue), // Minimum of 1 inventory slot
    }));
  };

  // No mana configuration needed - resources are now managed directly on the character

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Character Configuration</DialogTitle>
          <DialogDescription>
            Configure advanced settings for {character.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Wounds Configuration */}
          <div className="space-y-2">
            <Label htmlFor="max-wounds" className="text-sm font-medium">
              Maximum Wounds
            </Label>
            <div className="space-y-1">
              <Input
                id="max-wounds"
                type="number"
                min="1"
                max="20"
                value={config.maxWounds}
                onChange={(e) => updateMaxWounds(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Number of wounds the character can sustain before death.
              </p>
            </div>
          </div>

          {/* Max HP Configuration */}
          <div className="space-y-2">
            <Label htmlFor="max-hp" className="text-sm font-medium">
              Maximum Hit Points
            </Label>
            <div className="space-y-1">
              <Input
                id="max-hp"
                type="number"
                min="1"
                max="1000"
                value={config.maxHP}
                onChange={(e) => updateMaxHP(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Base maximum hit points for the character.
              </p>
            </div>
          </div>

          {/* Max Inventory Size Configuration */}
          <div className="space-y-2">
            <Label htmlFor="max-inventory" className="text-sm font-medium">
              Base Inventory Size
            </Label>
            <div className="space-y-1">
              <Input
                id="max-inventory"
                type="number"
                min="1"
                max="100"
                value={config.maxInventorySize}
                onChange={(e) => updateMaxInventorySize(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Base inventory slots (before strength bonus). Final size = {config.maxInventorySize} + {character.attributes.strength} (strength) = {config.maxInventorySize + character.attributes.strength}.
              </p>
            </div>
          </div>

          {/* Resources are now managed directly on the character - no configuration needed */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}