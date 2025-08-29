"use client";

import { LogEntry, DiceRollEntry, DamageEntry, HealingEntry, TempHPEntry, InitiativeEntry, AbilityUsageEntry, SafeRestEntry, CatchBreathEntry, MakeCampEntry, ResourceUsageEntry } from "@/lib/types/log-entries";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface ActivityLogProps {
  entries: LogEntry[];
  onClearRolls: () => void;
}

export function ActivityLog({ entries, onClearRolls }: ActivityLogProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Character Log</CardTitle>
            {entries.length > 0 && (
              <Button variant="outline" size="sm" onClick={onClearRolls}>
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No activity yet. Roll dice or take damage to see logs!</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex justify-between items-center p-2 bg-muted/50 rounded text-sm"
                >
                  {entry.type === 'roll' ? (
                    <RollEntryDisplay roll={entry} formatTime={formatTime} />
                  ) : (
                    <NonRollEntryDisplay entry={entry} formatTime={formatTime} />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

// Component for displaying roll entries
function RollEntryDisplay({ roll, formatTime }: { roll: DiceRollEntry, formatTime: (date: Date) => string }) {
  const formatRoll = (roll: DiceRollEntry) => {
    const diceStr = roll.dice.length === 1 
      ? `d${roll.dice[0].type}`
      : `${roll.dice.length}d${roll.dice[0].type}`;
    const modifierStr = roll.modifier >= 0 ? `+${roll.modifier}` : `${roll.modifier}`;
    return `${diceStr}${modifierStr}`;
  };
  return (
    <>
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
    </>
  );
}

// Component for displaying non-roll entries
function NonRollEntryDisplay({ entry, formatTime }: { entry: DamageEntry | HealingEntry | TempHPEntry | InitiativeEntry | AbilityUsageEntry | SafeRestEntry | CatchBreathEntry | MakeCampEntry | ResourceUsageEntry, formatTime: (date: Date) => string }) {
  const getEntryIcon = () => {
    switch (entry.type) {
      case 'damage':
        return '⚔️';
      case 'healing':
        return '❤️';
      case 'temp_hp':
        return '🛡️';
      case 'initiative':
        return '⚡';
      case 'ability_usage':
        return '✨';
      case 'safe_rest':
        return '🏠';
      case 'catch_breath':
        return '💨';
      case 'make_camp':
        return '🏕️';
      case 'resource':
        return '💎';
      default:
        return '📝';
    }
  };

  const getEntryColor = () => {
    switch (entry.type) {
      case 'damage':
        return 'text-red-600';
      case 'healing':
        return 'text-green-600';
      case 'temp_hp':
        return 'text-blue-600';
      case 'initiative':
        return 'text-yellow-600';
      case 'ability_usage':
        return 'text-purple-600';
      case 'safe_rest':
        return 'text-green-700';
      case 'catch_breath':
        return 'text-blue-600';
      case 'make_camp':
        return 'text-orange-600';
      case 'resource':
        return 'text-purple-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <span className="text-lg">{getEntryIcon()}</span>
        <span className="font-medium">{entry.description}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-muted-foreground">{formatTime(entry.timestamp)}</span>
        <span className={`font-bold text-lg min-w-[2rem] text-right ${getEntryColor()}`}>
          {entry.type === 'damage' ? `-${entry.amount}` : 
           entry.type === 'healing' ? `+${entry.amount}` :
           entry.type === 'temp_hp' ? `+${entry.amount}` :
           entry.type === 'initiative' ? `${(entry as InitiativeEntry).actionsGranted} acts` :
           entry.type === 'ability_usage' ? `${(entry as AbilityUsageEntry).usesRemaining}/${(entry as AbilityUsageEntry).maxUses}` :
           entry.type === 'safe_rest' ? 'REST' :
           entry.type === 'catch_breath' ? `+${(entry as CatchBreathEntry).healingAmount}` :
           entry.type === 'make_camp' ? `+${(entry as MakeCampEntry).healingAmount}` :
           entry.type === 'resource' ? (entry as ResourceUsageEntry).action === 'spent' ? `-${entry.amount}` : `+${entry.amount}` :
           ''}
        </span>
      </div>
    </>
  );
}