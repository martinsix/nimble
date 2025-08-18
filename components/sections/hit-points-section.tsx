"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Heart, Minus, Plus, Settings, ChevronDown, ChevronRight } from "lucide-react";

interface HitPointsSectionProps {
  currentHp: number;
  maxHp: number;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onHpChange: (current: number, max: number) => void;
}

export function HitPointsSection({ currentHp, maxHp, isOpen, onToggle, onHpChange }: HitPointsSectionProps) {
  const [damageAmount, setDamageAmount] = useState<string>("1");
  const [healAmount, setHealAmount] = useState<string>("1");
  const [newMaxHp, setNewMaxHp] = useState<string>(maxHp.toString());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleDamage = () => {
    const damage = parseInt(damageAmount) || 0;
    const newCurrent = Math.max(0, currentHp - damage);
    onHpChange(newCurrent, maxHp);
    setDamageAmount("1");
  };

  const handleHeal = () => {
    const heal = parseInt(healAmount) || 0;
    const newCurrent = Math.min(maxHp, currentHp + heal);
    onHpChange(newCurrent, maxHp);
    setHealAmount("1");
  };

  const handleMaxHpChange = () => {
    const newMax = parseInt(newMaxHp) || 1;
    const adjustedCurrent = Math.min(currentHp, newMax);
    onHpChange(adjustedCurrent, newMax);
    setIsSettingsOpen(false);
  };

  const handleQuickDamage = (amount: number) => {
    const newCurrent = Math.max(0, currentHp - amount);
    onHpChange(newCurrent, maxHp);
  };

  const handleQuickHeal = (amount: number) => {
    const newCurrent = Math.min(maxHp, currentHp + amount);
    onHpChange(newCurrent, maxHp);
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
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${getHealthBarColor()}`}
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-destructive">Take Damage</Label>
            <div className="flex gap-1">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleQuickDamage(1)}
                disabled={currentHp <= 0}
              >
                -1
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleQuickDamage(5)}
                disabled={currentHp <= 0}
              >
                -5
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleQuickDamage(10)}
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
                onClick={() => handleQuickHeal(1)}
                disabled={currentHp >= maxHp}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                +1
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickHeal(5)}
                disabled={currentHp >= maxHp}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                +5
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickHeal(10)}
                disabled={currentHp >= maxHp}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                +10
              </Button>
            </div>
          </div>
        </div>

        {/* Custom Amount Actions */}
        <div className="grid grid-cols-2 gap-4">
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
        </div>
        </CardContent>
      </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}