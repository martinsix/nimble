"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { DiceType } from "@/lib/types/dice";
import { diceService } from "@/lib/services/dice-service";
import { useActivityLog } from "@/lib/hooks/use-activity-log";
import { Dices, Plus, Minus } from "lucide-react";

interface DiceConfig {
  type: DiceType;
  count: number;
}

export function RollPanel() {
  const { addLogEntry } = useActivityLog();
  const [diceConfigs, setDiceConfigs] = useState<DiceConfig[]>([
    { type: 4, count: 0 },
    { type: 6, count: 0 },
    { type: 8, count: 0 },
    { type: 10, count: 0 },
    { type: 12, count: 0 },
    { type: 20, count: 1 },
    { type: 100, count: 0 },
  ]);

  const updateDiceCount = (diceType: DiceType, delta: number) => {
    setDiceConfigs(configs => 
      configs.map(config => 
        config.type === diceType 
          ? { ...config, count: Math.max(0, config.count + delta) }
          : config
      )
    );
  };

  const rollDice = () => {
    const activeDice = diceConfigs.filter(config => config.count > 0);
    
    if (activeDice.length === 0) {
      return;
    }

    const allDice = [];
    let totalSum = 0;

    for (const config of activeDice) {
      const { dice } = diceService.rollBasicDice(config.count, config.type);
      allDice.push(...dice);
      totalSum += dice.reduce((sum, die) => sum + die.result, 0);
    }

    addLogEntry({
      id: crypto.randomUUID(),
      type: 'roll',
      timestamp: new Date(),
      description: `Custom dice roll`,
      dice: allDice,
      droppedDice: [],
      total: totalSum,
      modifier: 0,
      criticalHits: 0,
      isMiss: false,
    });
  };

  const hasActiveDice = diceConfigs.some(config => config.count > 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Dices className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 p-3">
        <div className="space-y-3">
          <div className="text-sm font-medium">Roll Dice</div>
          {diceConfigs.map(config => (
            <div key={config.type} className="flex items-center justify-between">
              <span className="text-sm">d{config.type}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-6 h-6 p-0"
                  onClick={() => updateDiceCount(config.type, -1)}
                  disabled={config.count === 0}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-6 text-center text-sm">{config.count}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-6 h-6 p-0"
                  onClick={() => updateDiceCount(config.type, 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
          <Button 
            onClick={rollDice} 
            disabled={!hasActiveDice}
            className="w-full"
            size="sm"
          >
            Roll
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}