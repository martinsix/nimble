"use client";

import { DiceRoll } from "@/lib/types/dice";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface RollLogProps {
  rolls: DiceRoll[];
  onClearRolls: () => void;
}

export function RollLog({ rolls, onClearRolls }: RollLogProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatRoll = (roll: DiceRoll) => {
    const diceStr = roll.dice.length === 1 
      ? `d${roll.dice[0].type}`
      : `${roll.dice.length}d${roll.dice[0].type}`;
    const modifierStr = roll.modifier >= 0 ? `+${roll.modifier}` : `${roll.modifier}`;
    return `${diceStr}${modifierStr}`;
  };

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Roll Log</CardTitle>
            {rolls.length > 0 && (
              <Button variant="outline" size="sm" onClick={onClearRolls}>
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {rolls.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No rolls yet. Click on an attribute to roll!</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {rolls.map((roll) => (
                <div
                  key={roll.id}
                  className="flex justify-between items-center p-2 bg-muted/50 rounded text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{roll.description}</span>
                    <span className="text-muted-foreground">
                      ({formatRoll(roll)})
                    </span>
                    {roll.criticalHits && roll.criticalHits > 0 && (
                      <span className="text-yellow-600 font-semibold text-xs bg-yellow-100 px-2 py-1 rounded">
                        CRIT x{roll.criticalHits}
                      </span>
                    )}
                    {roll.advantageLevel && roll.advantageLevel > 0 && (
                      <span className="text-green-600 font-semibold text-xs bg-green-100 px-2 py-1 rounded">
                        ADV {roll.advantageLevel}
                      </span>
                    )}
                    {roll.advantageLevel && roll.advantageLevel < 0 && (
                      <span className="text-red-600 font-semibold text-xs bg-red-100 px-2 py-1 rounded">
                        DIS {Math.abs(roll.advantageLevel)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">{formatTime(roll.timestamp)}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className={`font-bold text-lg min-w-[2rem] text-right cursor-help ${
                          roll.isMiss ? 'text-destructive' : ''
                        }`}>
                          {roll.isMiss ? 'MISS' : roll.total}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <div className="font-semibold">Roll Breakdown</div>
                          {roll.isMiss && (
                            <div className="text-destructive font-semibold">MISS!</div>
                          )}
                          {roll.criticalHits && roll.criticalHits > 0 && (
                            <div className="text-yellow-600 font-semibold">
                              CRITICAL HIT! ({roll.criticalHits} crits)
                            </div>
                          )}
                          {roll.advantageLevel && roll.advantageLevel !== 0 && (
                            <div className={roll.advantageLevel > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                              {roll.advantageLevel > 0 ? `Advantage ${roll.advantageLevel}` : `Disadvantage ${Math.abs(roll.advantageLevel)}`}
                            </div>
                          )}
                          <div className="text-sm mt-1">
                            {roll.dice.map((die, index) => (
                              <div key={index} className={die.isCritical ? "text-yellow-600 font-semibold" : ""}>
                                d{die.type}: {die.result} {die.isCritical ? "(CRIT!)" : ""}
                              </div>
                            ))}
                            {roll.droppedDice && roll.droppedDice.length > 0 && (
                              <div className="text-muted-foreground mt-1 pt-1 border-t">
                                <div className="text-xs font-semibold">Dropped dice:</div>
                                {roll.droppedDice.map((die, index) => (
                                  <div key={index} className="text-xs line-through">
                                    d{die.type}: {die.result}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {roll.modifier !== 0 && (
                            <div className="text-sm">
                              Modifier: {roll.modifier >= 0 ? '+' : ''}{roll.modifier}
                            </div>
                          )}
                          <div className="text-sm border-t pt-1 mt-1">
                            Total: {roll.total}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}