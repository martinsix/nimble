"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Character, AttributeName } from "@/lib/types/character";
import { WeaponItem } from "@/lib/types/inventory";
import { ActionAbility, Abilities, AbilityFrequency } from "@/lib/types/abilities";
import { Action, WeaponAction, AbilityAction } from "@/lib/types/actions";
import { abilityService } from "@/lib/services/ability-service";
import { AbilityUsageEntry } from "@/lib/types/log-entries";
import { getEquippedWeapons } from "@/lib/utils/equipment";
import { getCharacterService, getActivityLog } from "@/lib/services/service-factory";
import { Sword, Zap } from "lucide-react";
import { Badge } from "./ui/badge";

interface ActionsProps {
  character: Character;
  onAttack: (weaponName: string, damage: string, attributeModifier: number, advantageLevel: number) => void;
  advantageLevel: number;
}

export function Actions({ character, onAttack, advantageLevel }: ActionsProps) {
  const weapons = getEquippedWeapons(character.inventory.items);
  const actionAbilities = character.abilities.abilities.filter(
    (ability): ability is ActionAbility => ability.type === 'action'
  );

  const getAttributeModifier = (attributeName?: AttributeName): number => {
    if (!attributeName) return 0;
    return character.attributes[attributeName];
  };

  const handleAttack = (weapon: WeaponItem) => {
    if (!weapon.damage) return;
    
    const attributeModifier = getAttributeModifier(weapon.attribute);
    onAttack(weapon.name, weapon.damage, attributeModifier, advantageLevel);
  };

  const handleUseAbility = async (ability: ActionAbility) => {
    // For at-will abilities, allow usage regardless of currentUses
    // For other abilities, check if they have remaining uses
    if (ability.frequency !== 'at_will' && (ability.currentUses === undefined || ability.currentUses <= 0)) {
      return;
    }
    
    try {
      const result = abilityService.useAbility(character.abilities, ability.id);
      
      if (!result.success || !result.usedAbility) {
        console.error("Failed to use ability: ability not found or no uses remaining");
        return;
      }

      // Update character with new abilities state
      const characterService = getCharacterService();
      const updatedCharacter = { ...character, abilities: result.updatedAbilities };
      await characterService.updateCharacter(updatedCharacter);

      // Log the ability usage
      const activityLogService = getActivityLog();
      const logEntry = activityLogService.createAbilityUsageEntry(
        result.usedAbility.name,
        result.usedAbility.frequency,
        result.usedAbility.currentUses || 0,
        result.usedAbility.maxUses || 0
      );
      await activityLogService.addLogEntry(logEntry);

      // If ability has a roll, execute it
      if (result.usedAbility.roll) {
        const rollDescription = abilityService.getAbilityRollDescription(result.usedAbility.roll, character);
        // Here we could add dice rolling logic if needed
      }
    } catch (error) {
      console.error("Failed to use ability:", error);
    }
  };

  const getFrequencyBadge = (frequency: AbilityFrequency) => {
    const colors = {
      per_turn: 'bg-green-100 text-green-800',
      per_encounter: 'bg-blue-100 text-blue-800',
      per_safe_rest: 'bg-orange-100 text-orange-800',
      at_will: 'bg-purple-100 text-purple-800',
    };
    const labels = {
      per_turn: 'Per Turn',
      per_encounter: 'Per Encounter',
      per_safe_rest: 'Per Safe Rest',
      at_will: 'At Will',
    };
    
    return (
      <Badge className={colors[frequency]}>
        {labels[frequency]}
      </Badge>
    );
  };

  if (weapons.length === 0 && actionAbilities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No equipped weapons or action abilities available.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Weapons Section */}
      {weapons.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Sword className="w-5 h-5" />
            Weapons
          </h3>
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
      )}

      {/* Abilities Section */}
      {actionAbilities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Abilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actionAbilities.map((ability) => {
              const isUsed = ability.frequency !== 'at_will' && (ability.currentUses === undefined || ability.currentUses === 0);
              
              return (
                <Card key={ability.id} className={isUsed ? 'opacity-50' : ''}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-center text-base flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      {ability.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center text-sm">
                      <div className="text-muted-foreground mb-2">
                        {ability.description}
                      </div>
                      
                      {ability.roll && (
                        <div className="mb-2 p-2 bg-muted/50 rounded text-sm">
                          <strong>Roll:</strong> {abilityService.getAbilityRollDescription(ability.roll, character)}
                        </div>
                      )}
                      
                      <div className="flex justify-center gap-2 mb-2">
                        {getFrequencyBadge(ability.frequency)}
                        {ability.frequency !== 'at_will' && ability.maxUses && (
                          <Badge variant="secondary">
                            {ability.currentUses}/{ability.maxUses} uses
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant={isUsed ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleUseAbility(ability)}
                      disabled={isUsed}
                      className="w-full"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {isUsed ? "Used" : "Use Ability"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}