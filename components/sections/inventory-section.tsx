"use client";

import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Inventory as InventoryType } from "@/lib/types/inventory";
import { Inventory } from "../inventory";
import { ChevronDown, ChevronRight } from "lucide-react";

interface InventorySectionProps {
  inventory: InventoryType;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onUpdateInventory: (inventory: InventoryType) => void;
}

export function InventorySection({ 
  inventory, 
  isOpen, 
  onToggle, 
  onUpdateInventory 
}: InventorySectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <h2 className="text-xl font-semibold">Inventory</h2>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-4">
          <Inventory inventory={inventory} onUpdateInventory={onUpdateInventory} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}