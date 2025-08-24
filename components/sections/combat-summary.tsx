"use client";

import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Heart, Minus, Plus, Zap, Swords, Dice6, Square, ChevronDown, ChevronUp, Bandage, Skull } from "lucide-react";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { useDiceActions } from "@/lib/hooks/use-dice-actions";
import { useUIStateService } from "@/lib/hooks/use-ui-state-service";

export function CombatSummary() {
  const { character, endEncounter, startEncounter, applyDamage, applyHealing, applyTemporaryHP } = useCharacterService();
  const { rollInitiative } = useDiceActions();
  const { uiState } = useUIStateService();
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!character) return null;

  const { hitPoints, wounds, initiative, attributes, inEncounter, actionTracker } = character;
  const currentHp = hitPoints.current;
  const maxHp = hitPoints.max;
  const temporaryHp = hitPoints.temporary;
  const totalModifier = attributes.dexterity + initiative.modifier;
  
  // Calculate health percentage and status
  const healthPercentage = (currentHp / maxHp) * 100;
  const getHealthBarColor = () => {
    if (healthPercentage <= 25) return "bg-red-500";
    if (healthPercentage <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Combat status
  const getCombatStatus = () => {
    if (!inEncounter) return { text: "Ready", color: "text-green-600" };
    return { text: "In Combat", color: "text-red-600" };
  };

  // Wound display logic
  const shouldUseIcons = wounds.max <= 7;
  const woundIcons = [];
  
  if (shouldUseIcons) {
    for (let i = 0; i < wounds.max; i++) {
      const isLastWound = i === wounds.max - 1;
      const isWounded = i < wounds.current;
      const IconComponent = isLastWound ? Skull : Bandage;
      
      woundIcons.push(
        <IconComponent
          key={i} 
          className={`w-3 h-3 ${isWounded ? 'text-red-500' : 'text-gray-300'}`} 
        />
      );
    }
  }

  const handleInitiativeRoll = async () => {
    if (!character) return;
    const result = await rollInitiative(totalModifier, uiState.advantageLevel);
    await startEncounter(result.rollTotal);
  };

  const handleQuickDamage = (amount: number) => {
    applyDamage(amount);
  };

  const handleQuickHeal = (amount: number) => {
    applyHealing(amount);
  };

  const status = getCombatStatus();

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {/* Combat Status Bar */}
        <Card className="border-2 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">Combat Summary</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${status.color}`}>
                  {status.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Health Bar */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {currentHp}/{maxHp} HP
                  {temporaryHp > 0 && <span className="text-blue-600 ml-1">(+{temporaryHp})</span>}
                </span>
                <span className="text-xs text-gray-500">{Math.round(healthPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                {(() => {
                  const totalEffectiveHP = maxHp + temporaryHp;
                  const currentHpPercentage = totalEffectiveHP > 0 ? (currentHp / totalEffectiveHP) * 100 : 0;
                  const tempHpPercentage = totalEffectiveHP > 0 ? (temporaryHp / totalEffectiveHP) * 100 : 0;
                  
                  return (
                    <>
                      {/* Current HP bar */}
                      <div 
                        className={`h-3 transition-all duration-300 ${getHealthBarColor()} absolute left-0 top-0 ${
                          temporaryHp > 0 ? 'rounded-l-full' : 'rounded-full'
                        }`}
                        style={{ width: `${currentHpPercentage}%` }}
                      />
                      {/* Temporary HP bar */}
                      {temporaryHp > 0 && (
                        <div 
                          className="h-3 bg-blue-500 transition-all duration-300 absolute top-0 rounded-r-full"
                          style={{ 
                            left: `${currentHpPercentage}%`,
                            width: `${tempHpPercentage}%` 
                          }}
                        />
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Action Economy & Initiative */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Action Trackers */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <div className="bg-blue-500 text-white rounded px-2 py-1 text-sm font-bold min-w-[2rem]">
                      {actionTracker.current}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Base</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-500 text-white rounded px-2 py-1 text-sm font-bold min-w-[2rem]">
                      {actionTracker.bonus}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Bonus</div>
                  </div>
                </div>
              </div>

              {/* Initiative & Combat Controls */}
              <div className="flex items-center justify-end gap-2">
                {!inEncounter ? (
                  <>
                    <span className="text-sm text-gray-600">Init: {totalModifier > 0 ? '+' : ''}{totalModifier}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleInitiativeRoll}
                          className="h-8 w-8 p-0"
                        >
                          <Dice6 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Roll Initiative: d20{totalModifier > 0 ? '+' + totalModifier : totalModifier}</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={endEncounter}
                    className="text-xs"
                  >
                    <Square className="w-3 h-3 mr-1" />
                    End Combat
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Bar */}
        <Card className="border border-gray-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 mr-2">Quick Actions:</span>
              
              {/* Damage Buttons */}
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleQuickDamage(1)}
                disabled={currentHp <= 0}
                className="text-xs h-7"
              >
                -1
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleQuickDamage(5)}
                disabled={currentHp <= 0}
                className="text-xs h-7"
              >
                -5
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleQuickDamage(10)}
                disabled={currentHp <= 0}
                className="text-xs h-7"
              >
                -10
              </Button>

              <div className="w-px h-6 bg-gray-300 mx-1" />

              {/* Heal Buttons */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickHeal(1)}
                disabled={currentHp >= maxHp}
                className="text-green-600 border-green-600 hover:bg-green-50 text-xs h-7"
              >
                +1
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickHeal(5)}
                disabled={currentHp >= maxHp}
                className="text-green-600 border-green-600 hover:bg-green-50 text-xs h-7"
              >
                +5
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickHeal(10)}
                disabled={currentHp >= maxHp}
                className="text-green-600 border-green-600 hover:bg-green-50 text-xs h-7"
              >
                +10
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wound Status Strip */}
        <Card className="border border-gray-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Wounds:</span>
                {shouldUseIcons ? (
                  <div className="flex items-center gap-0.5">
                    {woundIcons}
                  </div>
                ) : (
                  <span className="text-sm font-medium">
                    {wounds.current}/{wounds.max}
                  </span>
                )}
              </div>
              {wounds.current > 0 && (
                <span className="text-xs text-red-600 font-medium">
                  {wounds.current === wounds.max ? "Critical!" : "Wounded"}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expandable Details Section */}
        {isExpanded && (
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Advanced HP Management</h3>
                
                {/* HP Display with larger text */}
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold">
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
                  {temporaryHp > 0 && (
                    <div className="text-sm text-blue-600 font-medium">
                      Total Effective HP: {currentHp + temporaryHp}
                    </div>
                  )}
                </div>

                {/* Custom Amount Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Custom Amount</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      defaultValue="1"
                      className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Amount"
                      id="custom-hp-amount"
                    />
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => {
                        const input = document.getElementById('custom-hp-amount') as HTMLInputElement;
                        const amount = parseInt(input.value) || 0;
                        handleQuickDamage(amount);
                      }}
                      disabled={currentHp <= 0}
                      title="Apply Damage"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const input = document.getElementById('custom-hp-amount') as HTMLInputElement;
                        const amount = parseInt(input.value) || 0;
                        handleQuickHeal(amount);
                      }}
                      disabled={currentHp >= maxHp}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      title="Apply Healing"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const input = document.getElementById('custom-hp-amount') as HTMLInputElement;
                        const amount = parseInt(input.value) || 0;
                        applyTemporaryHP(amount);
                      }}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      title="Add Temporary HP"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}