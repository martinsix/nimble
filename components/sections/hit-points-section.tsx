"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Heart, Minus, Plus, Settings, ChevronDown, ChevronRight } from "lucide-react";

import { characterService } from "@/lib/services/character-service";

interface HitPointsSectionProps {
  currentHp: number;
  maxHp: number;
  temporaryHp: number;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export function HitPointsSection({ currentHp, maxHp, temporaryHp, isOpen, onToggle }: HitPointsSectionProps) {
  const [damageAmount, setDamageAmount] = useState<string>("1");
  const [healAmount, setHealAmount] = useState<string>("1");
  const [tempHpAmount, setTempHpAmount] = useState<string>("1");
  const [newMaxHp, setNewMaxHp] = useState<string>(maxHp.toString());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const applyDamage = async (amount: number, resetInput: boolean = false) => {
    await characterService.applyDamage(amount);
    
    if (resetInput) {
      setDamageAmount("1");
    }
  };

  const handleDamage = () => {
    const damage = parseInt(damageAmount) || 0;
    applyDamage(damage, true);
  };

  const applyHealing = async (amount: number, resetInput: boolean = false) => {
    await characterService.applyHealing(amount);
    
    if (resetInput) {
      setHealAmount("1");
    }
  };

  const handleHeal = () => {
    const heal = parseInt(healAmount) || 0;
    applyHealing(heal, true);
  };

  const handleTempHp = async () => {
    const tempAmount = parseInt(tempHpAmount) || 0;
    await characterService.applyTemporaryHP(tempAmount);
    setTempHpAmount("1");
  };

  const handleMaxHpChange = async () => {
    const newMax = parseInt(newMaxHp) || 1;
    const adjustedCurrent = Math.min(currentHp, newMax);
    await characterService.updateHitPoints(adjustedCurrent, newMax, temporaryHp);
    setIsSettingsOpen(false);
  };



  const getHealthBarColor = () => {
    const percentage = (currentHp / maxHp) * 100;
    if (percentage <= 25) return "bg-red-500";
    if (percentage <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const healthPercentage = (currentHp / maxHp) * 100;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Hit Points
          </h2>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-end">
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hit Points Settings</DialogTitle>
                <DialogDescription>
                  Change your character&rsquo;s maximum hit points.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="max-hp">Maximum Hit Points</Label>
                  <Input
                    id="max-hp"
                    type="number"
                    min="1"
                    value={newMaxHp}
                    onChange={(e) => setNewMaxHp(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleMaxHpChange}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="damage-amount" className="text-sm">Custom Damage</Label>
            <div className="flex gap-2">
              <Input
                id="damage-amount"
                type="number"
                min="1"
                value={damageAmount}
                onChange={(e) => setDamageAmount(e.target.value)}
                className="flex-1"
                placeholder="Amount"
              />
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDamage}
                disabled={currentHp <= 0}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="heal-amount" className="text-sm">Custom Heal</Label>
            <div className="flex gap-2">
              <Input
                id="heal-amount"
                type="number"
                min="1"
                value={healAmount}
                onChange={(e) => setHealAmount(e.target.value)}
                className="flex-1"
                placeholder="Amount"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleHeal}
                disabled={currentHp >= maxHp}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temp-hp-amount" className="text-sm">Temporary HP</Label>
            <div className="flex gap-2">
              <Input
                id="temp-hp-amount"
                type="number"
                min="0"
                value={tempHpAmount}
                onChange={(e) => setTempHpAmount(e.target.value)}
                className="flex-1"
                placeholder="Amount"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleTempHp}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        </CardContent>
      </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}