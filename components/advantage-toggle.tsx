"use client";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ChevronUp, ChevronDown, Equal } from "lucide-react";

interface AdvantageToggleProps {
  advantageLevel: number;
  onAdvantageChange: (level: number) => void;
}

export function AdvantageToggle({ advantageLevel, onAdvantageChange }: AdvantageToggleProps) {
  const getDisplayText = () => {
    if (advantageLevel > 0) {
      return `Advantage ${advantageLevel}`;
    } else if (advantageLevel < 0) {
      return `Disadvantage ${Math.abs(advantageLevel)}`;
    } else {
      return "Normal";
    }
  };

  const getDisplayColor = () => {
    if (advantageLevel > 0) {
      return "text-green-600";
    } else if (advantageLevel < 0) {
      return "text-red-600";
    } else {
      return "text-muted-foreground";
    }
  };

  const incrementAdvantage = () => {
    onAdvantageChange(advantageLevel + 1);
  };

  const decrementAdvantage = () => {
    onAdvantageChange(advantageLevel - 1);
  };

  const resetAdvantage = () => {
    onAdvantageChange(0);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Dice Modifier:</span>
            <span className={`font-semibold ${getDisplayColor()}`}>
              {getDisplayText()}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={decrementAdvantage}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAdvantage}
              className="h-8 w-8 p-0"
              disabled={advantageLevel === 0}
            >
              <Equal className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={incrementAdvantage}
              className="h-8 w-8 p-0"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {advantageLevel !== 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            {advantageLevel > 0 
              ? `Roll ${Math.abs(advantageLevel)} extra dice, drop ${Math.abs(advantageLevel)} lowest`
              : `Roll ${Math.abs(advantageLevel)} extra dice, drop ${Math.abs(advantageLevel)} highest`
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
}