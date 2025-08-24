"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Heart, Minus, Plus, ChevronUp } from "lucide-react";
import { Character } from "@/lib/types/character";
import { useCharacterService } from "@/lib/hooks/use-character-service";

interface HitPointsSectionProps {
  onTitleClick?: () => void;
}

export function HitPointsSection({ onTitleClick }: HitPointsSectionProps = {}) {
  // Get everything we need from service hooks
  const { character, applyDamage: serviceDamage, applyHealing: serviceHealing, applyTemporaryHP: serviceTempHP } = useCharacterService();
  
  const [customAmount, setCustomAmount] = useState<string>("1");
  
  // Early return if no character (shouldn't happen in normal usage)
  if (!character) return null;
  
  const currentHp = character.hitPoints.current;
  const maxHp = character.hitPoints.max;
  const temporaryHp = character.hitPoints.temporary;
  const applyDamage = async (amount: number, resetInput: boolean = false) => {
    await serviceDamage(amount);
    
    if (resetInput) {
      setDamageAmount("1");
    }
  };

  const handleCustomDamage = () => {
    const damage = parseInt(customAmount) || 0;
    applyDamage(damage, false);
  };

  const applyHealing = async (amount: number, resetInput: boolean = false) => {
    await serviceHealing(amount);
  };

  const handleCustomHeal = () => {
    const heal = parseInt(customAmount) || 0;
    applyHealing(heal, false);
  };

  const handleCustomTempHp = async () => {
    const tempAmount = parseInt(customAmount) || 0;
    await serviceTempHP(tempAmount);
  };

  const getHealthBarColor = () => {
    const percentage = (currentHp / maxHp) * 100;
    if (percentage <= 25) return "bg-red-500";
    if (percentage <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const healthPercentage = (currentHp / maxHp) * 100;

  return (
    <>
      {/* HP Display and Bar */}
      <div className="text-center space-y-2">
        <div className="text-3xl font-bold">
          {currentHp} / {maxHp}
          {currentHp === 0 && (
            <span className="text-lg text-red-600 ml-2 font-semibold">
              (Dying)
            </span>
          )}
          {temporaryHp > 0 && (
            <span className="text-lg text-blue-600 ml-2">
              (+{temporaryHp} temp)
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getHealthBarColor()}`}
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
        {temporaryHp > 0 && (
          <div className="text-sm text-blue-600 font-medium">
            Total Effective HP: {currentHp + temporaryHp}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-destructive">Take Damage</Label>
          <div className="flex gap-1">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => applyDamage(1)}
              disabled={currentHp <= 0}
            >
              -1
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => applyDamage(5)}
              disabled={currentHp <= 0}
            >
              -5
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => applyDamage(10)}
              disabled={currentHp <= 0}
            >
              -10
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-green-600">Heal</Label>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => applyHealing(1)}
              disabled={currentHp >= maxHp}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              +1
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => applyHealing(5)}
              disabled={currentHp >= maxHp}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              +5
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => applyHealing(10)}
              disabled={currentHp >= maxHp}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              +10
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Amount Actions */}
      <div className="space-y-2">
        <Label htmlFor="custom-amount" className="text-sm">Custom Amount</Label>
        <div className="flex gap-2">
          <Input
            id="custom-amount"
            type="number"
            min="1"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1"
            placeholder="Amount"
          />
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleCustomDamage}
            disabled={currentHp <= 0}
            title="Apply Damage"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCustomHeal}
            disabled={currentHp >= maxHp}
            className="text-green-600 border-green-600 hover:bg-green-50"
            title="Apply Healing"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCustomTempHp}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
            title="Add Temporary HP"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}