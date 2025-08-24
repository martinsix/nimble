"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Heart, Shield, Zap, Skull, AlertTriangle, X, Dices, Swords, Dice6, Square, ChevronUp, Bandage } from "lucide-react";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { useDiceActions } from "@/lib/hooks/use-dice-actions";
import { useUIStateService } from "@/lib/hooks/use-ui-state-service";
import { HitPointsSection } from "./hit-points-section";

export function CombatSummary() {
  const { character, endEncounter, startEncounter } = useCharacterService();
  const { rollInitiative } = useDiceActions();
  const { uiState } = useUIStateService();
  const [isHPExpanded, setIsHPExpanded] = useState(false);
  
  if (!character) return null;

  const { hitPoints, wounds, initiative, attributes, inEncounter } = character;
  const currentHp = hitPoints.current;
  const maxHp = hitPoints.max;
  const temporaryHp = hitPoints.temporary;
  const totalModifier = attributes.dexterity + initiative.modifier;
  const advantageLevel = uiState.advantageLevel;

  const getHealthBarColor = () => {
    const percentage = (currentHp / maxHp) * 100;
    if (percentage <= 25) return "bg-red-500";
    if (percentage <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getHPStatus = () => {
    if (currentHp === 0) {
      return {
        borderColor: "border-red-400",
        bgColor: "bg-red-50/50"
      };
    } else if ((currentHp / maxHp) * 100 < 50) {
      return {
        borderColor: "border-orange-300",
        bgColor: "bg-orange-50/30"
      };
    }
    return {
      borderColor: "border-gray-200",
      bgColor: "bg-transparent"
    };
  };

  const getWoundStatus = () => {
    if (wounds.current >= wounds.max) {
      return { 
        color: "text-red-600", 
        bgColor: "bg-red-50/50", 
        borderColor: "border-red-400",
        icon: Skull 
      };
    } else if (wounds.current >= wounds.max - 2) {
      return { 
        color: "text-orange-600", 
        bgColor: "bg-orange-50/30", 
        borderColor: "border-orange-300",
        icon: AlertTriangle 
      };
    }
    return { 
      color: "text-green-600", 
      bgColor: "bg-transparent", 
      borderColor: "border-gray-200",
      icon: Bandage 
    };
  };

  const healthPercentage = (currentHp / maxHp) * 100;
  const hpStatus = getHPStatus();
  const woundStatus = getWoundStatus();
  const StatusIcon = woundStatus.icon;


  // Create wound display - icons for 7 or fewer, text for more
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
          className={`w-3 h-3 sm:w-4 sm:h-4 ${isWounded ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} 
        />
      );
    }
  }

  const handleInitiativeRoll = async () => {
    if (!character) return;
    
    const result = await rollInitiative(totalModifier, advantageLevel);
    await startEncounter(result.rollTotal);
  };

  const handleHPExpand = () => {
    setIsHPExpanded(true);
  };

  const handleHPCollapse = () => {
    setIsHPExpanded(false);
  };

  return (
    <TooltipProvider>
      <div className="flex gap-2 sm:gap-3 md:gap-4 mb-4">
        {/* Hit Points Card - Expandable */}
        <div className={`transition-all duration-700 ease-in-out ${isHPExpanded ? 'flex-[3]' : 'flex-1'}`}>
          <Card className={`border-2 ${hpStatus.borderColor} ${hpStatus.bgColor} transition-all duration-700 ease-in-out transform ${!isHPExpanded ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] h-full' : 'shadow-lg scale-100'} overflow-hidden`}
                onClick={!isHPExpanded ? handleHPExpand : undefined}>
            <CardHeader 
              className={`p-2 sm:p-3 ${isHPExpanded ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}`}
              onClick={isHPExpanded ? handleHPCollapse : undefined}
            >
              <CardTitle className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  Hit Points
                </div>
                {isHPExpanded && (
                  <ChevronUp className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
            {!isHPExpanded ? (
              // Compact HP content
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="space-y-1 text-center">
                  <div className="text-[4vw] sm:text-[2.5vw] md:text-xl font-bold tabular-nums">
                    {currentHp} / {maxHp} {temporaryHp > 0 && (<span className="text-blue-600">+{temporaryHp}</span>)}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getHealthBarColor()}`}
                      style={{ width: `${healthPercentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            ) : (
              // Expanded HP content
              <CardContent className="p-3 sm:p-4 pt-0">
                <HitPointsSection />
              </CardContent>
            )}
          </Card>
        </div>

        {/* Wounds Card */}
        <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isHPExpanded ? 'flex-[0] opacity-0 w-0' : 'flex-1 opacity-100'}`}>
          <Card className={`border-2 ${woundStatus.borderColor} ${woundStatus.bgColor} transition-all duration-700 ease-in-out transform scale-100 h-full`}>
            <CardHeader className="p-2 sm:p-3">
              <CardTitle className="flex items-center gap-2 text-xs sm:text-sm">
                <StatusIcon className={`w-4 h-4 ${woundStatus.color}`} />
                Wounds
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="flex items-center justify-center min-h-[2.5rem]">
                {shouldUseIcons ? (
                  <div className="flex items-center justify-center gap-0.5">
                    {woundIcons}
                  </div>
                ) : (
                  <div className="text-xl sm:text-2xl font-bold tabular-nums">
                    {wounds.current} / {wounds.max}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Initiative Card */}
        <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isHPExpanded ? 'flex-[0] opacity-0 w-0' : 'flex-1 opacity-100'}`}>
          <Card className="border border-gray-200 transition-all duration-700 ease-in-out transform scale-100 h-full">
            <CardHeader className="p-2 sm:p-3">
              <CardTitle className="flex items-center gap-2 text-xs sm:text-sm">
                {inEncounter ? (
                  <Swords className="w-4 h-4 text-red-500" />
                ) : (
                  <Zap className="w-4 h-4 text-yellow-500" />
                )}
                {inEncounter ? "Combat" : "Initiative"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="space-y-1 text-center">
                {!inEncounter ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-bold tabular-nums">
                      {totalModifier > 0 ? '+' : ''}{totalModifier}
                    </span>
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
                        <p>({attributes.dexterity > 0 ? '+' + attributes.dexterity + ' DEX' : ''}{initiative.modifier > 0 ? ' + ' + initiative.modifier + ' MOD' : ''})</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-bold">End</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={endEncounter}
                      className="h-8 w-8 p-0"
                    >
                      <Square className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}