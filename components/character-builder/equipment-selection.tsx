"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ItemBrowser } from "../item-browser";
import { getCharacterService, getItemService, getContentRepository } from "@/lib/services/service-factory";
import { Package, Search, Plus, Trash2 } from "lucide-react";
import { Item } from "@/lib/types/inventory";

interface EquipmentSelectionProps {
  onEquipmentReady?: () => void;
}

export function EquipmentSelection({ onEquipmentReady }: EquipmentSelectionProps) {
  const [isItemBrowserOpen, setIsItemBrowserOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [equipmentLoaded, setEquipmentLoaded] = useState(false);

  const characterService = getCharacterService();
  const itemService = getItemService();
  const contentRepository = getContentRepository();

  const character = characterService.getCurrentCharacter();

  useEffect(() => {
    const loadStartingEquipment = async () => {
      if (!character?.id || !character.classId || equipmentLoaded) return;

      try {
        setIsLoading(true);
        
        // Get starting equipment for the class
        const classDefinition = contentRepository.getClassDefinition(character.classId);
        if (classDefinition?.startingEquipment) {
          // Convert repository items to inventory items and add to character
          const equipmentItems = classDefinition.startingEquipment.map(repositoryId => {
            const inventoryItem = itemService.createInventoryItem(repositoryId);
            return inventoryItem;
          }).filter(item => item !== null);

          // Add items directly to character's inventory
          const updatedInventory = {
            ...character.inventory,
            items: [...character.inventory.items, ...equipmentItems]
          };

          await characterService.updateCharacterFields({
            inventory: updatedInventory
          });
        }
        
        setEquipmentLoaded(true);
        onEquipmentReady?.();
      } catch (error) {
        console.error('Failed to load starting equipment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStartingEquipment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character?.id, character?.classId, equipmentLoaded, contentRepository, itemService, characterService, onEquipmentReady]);

  const handleAddItem = (repositoryId: string) => {
    if (!character) return;

    const inventoryItem = itemService.createInventoryItem(repositoryId);
    if (!inventoryItem) {
      console.error("Failed to create inventory item");
      return;
    }

    characterService.addItemToInventory(inventoryItem);
  };

  const handleRemoveItem = (itemId: string) => {
    if (!character) return;

    const updatedInventory = {
      ...character.inventory,
      items: character.inventory.items.filter(item => item.id !== itemId)
    };

    characterService.updateCharacterFields({
      inventory: updatedInventory
    });
  };

  const getItemIcon = (item: Item) => {
    // Use same logic as inventory component
    switch (item.type) {
      case 'weapon': 
        return '🗡️';
      case 'armor': 
        return '🛡️';
      case 'consumable': 
        return '🧪';
      case 'ammunition': 
        return '🏹';
      default: 
        return '📦';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Loading starting equipment...</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No character selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Starting Equipment</h2>
        <p className="text-muted-foreground">
          Your character starts with class equipment. Add or remove items as needed.
        </p>
      </div>

      {/* Add Item Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Inventory</h3>
        <Button size="sm" onClick={() => setIsItemBrowserOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {character.inventory.items.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No items in inventory. Click &ldquo;Add Item&rdquo; to get started.
            </CardContent>
          </Card>
        ) : (
          character.inventory.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">{getItemIcon(item)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded capitalize">
                          {item.type}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>Size: {item.size}</span>
                        {item.type === 'weapon' && (item as any).damage && (
                          <span>Damage: {(item as any).damage}</span>
                        )}
                        {item.type === 'armor' && (item as any).armor && (
                          <span>AC: {(item as any).armor}</span>
                        )}
                        {(item.type === 'consumable' || item.type === 'ammunition') && (item as any).count && (
                          <span>Count: {(item as any).count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Item Browser */}
      <ItemBrowser
        isOpen={isItemBrowserOpen}
        onClose={() => setIsItemBrowserOpen(false)}
        onItemAdd={handleAddItem}
      />
    </div>
  );
}