"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Character } from "@/lib/types/character";
import { getEquippedArmor } from "@/lib/utils/equipment";
import { Shield, ChevronDown, ChevronRight } from "lucide-react";

interface ArmorSectionProps {
  character: Character;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export function ArmorSection({ character, isOpen, onToggle }: ArmorSectionProps) {
  const equippedArmor = getEquippedArmor(character.inventory.items);
  const totalArmorValue = equippedArmor.reduce((total, armor) => total + (armor.armor || 0), 0);

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Armor
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{totalArmorValue}</span>
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
          <CardContent className="space-y-3">
            {equippedArmor.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No armor equipped. Equip armor in your inventory to see protection.
              </div>
            ) : (
              <div className="space-y-2">
                {equippedArmor.map((armor) => (
                  <div key={armor.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">{armor.name}</span>
                      {armor.properties && armor.properties.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({armor.properties.join(', ')})
                        </span>
                      )}
                    </div>
                    <span className="font-bold">{armor.armor || 0}</span>
                  </div>
                ))}
                {equippedArmor.length > 1 && (
                  <div className="border-t pt-2 mt-2">
                    <div className="flex items-center justify-between font-bold">
                      <span>Total Armor Value:</span>
                      <span>{totalArmorValue}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}