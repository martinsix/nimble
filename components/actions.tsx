"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Character, AttributeName } from "@/lib/types/character";
import { WeaponItem } from "@/lib/types/inventory";
import { Sword } from "lucide-react";

interface ActionsProps {
  character: Character;
  onAttack: (weaponName: string, damage: string, attributeModifier: number) => void;
}

export function Actions({ character, onAttack }: ActionsProps) {
  const weapons = character.inventory.items.filter(
    item => item.type === 'weapon'
  ) as WeaponItem[];

  const getAttributeModifier = (attributeName?: AttributeName): number => {
    if (!attributeName) return 0;
    return character.attributes[attributeName];
  };

  const handleAttack = (weapon: WeaponItem) => {
    if (!weapon.damage) return;
    
    const attributeModifier = getAttributeModifier(weapon.attribute);
    onAttack(weapon.name, weapon.damage, attributeModifier);
  };

  if (weapons.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No weapons in inventory. Add weapons to see attack actions.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weapons.map((weapon) => {
          const attributeModifier = getAttributeModifier(weapon.attribute);
          const hasValidDamage = weapon.damage && weapon.damage.trim() !== '';
          
          return (
            <Card key={weapon.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-base flex items-center justify-center gap-2">
                  <Sword className="w-4 h-4" />
                  {weapon.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center text-sm">
                  <div className="text-muted-foreground">
                    {weapon.damage || 'No damage set'} 
                    {weapon.attribute && (
                      <span> + {weapon.attribute.slice(0, 3).toUpperCase()} ({attributeModifier >= 0 ? '+' : ''}{attributeModifier})</span>
                    )}
                  </div>
                  {weapon.properties && weapon.properties.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {weapon.properties.join(', ')}
                    </div>
                  )}
                </div>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleAttack(weapon)}
                  disabled={!hasValidDamage}
                  className="w-full"
                >
                  <Sword className="w-4 h-4 mr-2" />
                  Attack
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}