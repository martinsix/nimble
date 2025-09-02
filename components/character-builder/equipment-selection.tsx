"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ItemBrowser } from "../item-browser";
import { getItemService, getContentRepository } from "@/lib/services/service-factory";
import { Package, Search, Plus, Trash2, Sword, Shield, Shirt, Beaker, Target } from "lucide-react";
import { Item } from "@/lib/types/inventory";
import { Badge } from "../ui/badge";

interface EquipmentSelectionProps {
  classId: string;
  selectedEquipment: string[];
  onEquipmentReady: (equipment: string[]) => void;
}

export function EquipmentSelection({ 
  classId,
  selectedEquipment,
  onEquipmentReady 
}: EquipmentSelectionProps) {
  const [isItemBrowserOpen, setIsItemBrowserOpen] = useState(false);
  const [equipment, setEquipment] = useState<Item[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const itemService = getItemService();
  const contentRepository = getContentRepository();

  useEffect(() => {
    if (!isInitialized && classId) {
      loadStartingEquipment();
      setIsInitialized(true);
    }
  }, [classId, isInitialized]);

  const loadStartingEquipment = () => {
    // Get starting equipment for the class
    const classDefinition = contentRepository.getClassDefinition(classId);
    if (classDefinition?.startingEquipment) {
      // Convert repository items to inventory items
      const equipmentItems = classDefinition.startingEquipment.map(repositoryId => {
        const inventoryItem = itemService.createInventoryItem(repositoryId);
        return inventoryItem;
      }).filter(item => item !== null) as Item[];

      setEquipment(equipmentItems);
      
      // Notify parent with equipment IDs
      const equipmentIds = equipmentItems.map(item => item.id);
      onEquipmentReady(equipmentIds);
    } else {
      // No starting equipment
      onEquipmentReady([]);
    }
  };

  const handleAddItem = (item: Item) => {
    const newEquipment = [...equipment, item];
    setEquipment(newEquipment);
    onEquipmentReady(newEquipment.map(item => item.id));
  };

  const handleRemoveItem = (itemId: string) => {
    const newEquipment = equipment.filter(item => item.id !== itemId);
    setEquipment(newEquipment);
    onEquipmentReady(newEquipment.map(item => item.id));
  };

  const getItemIcon = (item: Item) => {
    switch (item.type) {
      case 'weapon': return <Sword className="w-4 h-4" />;
      case 'armor': return item.isMainArmor ? <Shield className="w-4 h-4" /> : <Shirt className="w-4 h-4" />;
      case 'consumable': return <Beaker className="w-4 h-4" />;
      case 'ammunition': return <Target className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getItemDescription = (item: Item) => {
    switch (item.type) {
      case 'weapon':
        return item.damage ? `Damage: ${item.damage}` : '';
      case 'armor':
        return item.armor ? `AC: ${item.armor}` : '';
      case 'consumable':
      case 'ammunition':
        return `Count: ${item.count}`;
      default:
        return item.description || '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Select Starting Equipment</h3>
          <p className="text-sm text-muted-foreground">
            Choose your starting gear and equipment
          </p>
        </div>
        <Button
          onClick={() => setIsItemBrowserOpen(true)}
          variant="outline"
          size="sm"
        >
          <Search className="w-4 h-4 mr-2" />
          Browse Items
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Starting Equipment</span>
            <Badge variant="outline">
              {equipment.length} {equipment.length === 1 ? 'item' : 'items'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {equipment.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No equipment selected</p>
              <Button
                onClick={() => setIsItemBrowserOpen(true)}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Equipment
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {equipment.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getItemIcon(item)}
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {getItemDescription(item)}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemoveItem(item.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ItemBrowser
        isOpen={isItemBrowserOpen}
        onClose={() => setIsItemBrowserOpen(false)}
        onItemAdd={(repositoryId) => {
          const item = itemService.createInventoryItem(repositoryId);
          if (item) {
            handleAddItem(item);
          }
          setIsItemBrowserOpen(false);
        }}
      />
    </div>
  );
}