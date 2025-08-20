"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Sparkles, Minus, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { useCharacterActions } from "@/lib/contexts/character-actions-context";

interface ManaSectionProps {
  currentMana: number;
  maxMana: number;
  manaAttribute: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export function ManaSection({ currentMana, maxMana, manaAttribute, isOpen, onToggle }: ManaSectionProps) {
  const [spendAmount, setSpendAmount] = useState<string>("1");
  const [restoreAmount, setRestoreAmount] = useState<string>("1");

  // Get actions from context
  const { onSpendMana, onRestoreMana } = useCharacterActions();

  const applyManaSpend = async (amount: number, resetInput: boolean = false) => {
    if (onSpendMana) {
      await onSpendMana(amount);
    }
    
    if (resetInput) {
      setSpendAmount("1");
    }
  };

  const applyManaRestore = async (amount: number, resetInput: boolean = false) => {
    if (onRestoreMana) {
      await onRestoreMana(amount);
    }
    
    if (resetInput) {
      setRestoreAmount("1");
    }
  };

  const handleSpendMana = () => {
    const spend = parseInt(spendAmount) || 0;
    applyManaSpend(spend, true);
  };

  const handleRestoreMana = () => {
    const restore = parseInt(restoreAmount) || 0;
    applyManaRestore(restore, true);
  };

  const getManaBarColor = () => {
    const percentage = (currentMana / maxMana) * 100;
    if (percentage <= 25) return "bg-red-500";
    if (percentage <= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const manaPercentage = (currentMana / maxMana) * 100;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Mana
          </h2>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="w-full">
          <CardContent className="space-y-4 pt-6">
            {/* Mana Display and Bar */}
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold">
                {currentMana} / {maxMana}
                {currentMana === 0 && (
                  <span className="text-lg text-blue-600 ml-2 font-semibold">
                    (Exhausted)
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${getManaBarColor()}`}
                  style={{ width: `${manaPercentage}%` }}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Mana Pool ({manaAttribute} based)
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-destructive">Spend Mana</Label>
                <div className="flex gap-1">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => applyManaSpend(1)}
                    disabled={currentMana <= 0}
                  >
                    -1
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => applyManaSpend(3)}
                    disabled={currentMana <= 0}
                  >
                    -3
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => applyManaSpend(5)}
                    disabled={currentMana <= 0}
                  >
                    -5
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-blue-600">Restore</Label>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyManaRestore(1)}
                    disabled={currentMana >= maxMana}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    +1
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyManaRestore(3)}
                    disabled={currentMana >= maxMana}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    +3
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyManaRestore(5)}
                    disabled={currentMana >= maxMana}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    +5
                  </Button>
                </div>
              </div>
            </div>

            {/* Custom Amount Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spend-amount" className="text-sm">Custom Spend</Label>
                <div className="flex gap-2">
                  <Input
                    id="spend-amount"
                    type="number"
                    min="1"
                    value={spendAmount}
                    onChange={(e) => setSpendAmount(e.target.value)}
                    className="flex-1"
                    placeholder="Amount"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleSpendMana}
                    disabled={currentMana <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="restore-amount" className="text-sm">Custom Restore</Label>
                <div className="flex gap-2">
                  <Input
                    id="restore-amount"
                    type="number"
                    min="1"
                    value={restoreAmount}
                    onChange={(e) => setRestoreAmount(e.target.value)}
                    className="flex-1"
                    placeholder="Amount"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRestoreMana}
                    disabled={currentMana >= maxMana}
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