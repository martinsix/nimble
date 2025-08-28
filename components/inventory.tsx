"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Inventory as InventoryType, Item, ItemType, CreateItemData, WeaponItem, ArmorItem } from "@/lib/types/inventory";
import { canEquipWeapon, canEquipArmor, getEquipmentValidationMessage, equipMainArmorWithReplacement } from "@/lib/utils/equipment";
import { Plus, Trash2, Package, Sword, Shield, Shirt, Crown, Edit2 } from "lucide-react";

interface InventoryProps {
  inventory: InventoryType;
  characterDexterity: number;
  onUpdateInventory: (inventory: InventoryType) => void;
}

export function Inventory({ inventory, characterDexterity, onUpdateInventory }: InventoryProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<CreateItemData>({
    name: "",
    size: 1,
    type: "freeform",
  });
  const [editItem, setEditItem] = useState<CreateItemData>({
    name: "",
    size: 1,
    type: "freeform",
  });

  const currentSize = inventory.items.reduce((total, item) => {
    // Exclude equipped weapons and armor from inventory size calculation
    if ((item.type === 'weapon' || item.type === 'armor') && item.equipped) {
      return total;
    }
    return total + item.size;
  }, 0);
  const sizePercent = inventory.maxSize > 0 ? (currentSize / inventory.maxSize) * 100 : 0;

  const updateMaxSize = (maxSize: number) => {
    onUpdateInventory({
      ...inventory,
      maxSize,
    });
  };

  const addItem = () => {
    if (!newItem.name.trim()) return;

    const item: Item = {
      id: crypto.randomUUID(),
      name: newItem.name,
      size: newItem.size,
      type: newItem.type,
      ...(newItem.type === 'weapon' && { attribute: newItem.attribute, damage: newItem.damage, properties: newItem.properties }),
      ...(newItem.type === 'armor' && { armor: newItem.armor, maxDexBonus: newItem.maxDexBonus, isMainArmor: newItem.isMainArmor, properties: newItem.properties }),
      ...(newItem.type === 'freeform' && { description: newItem.description }),
    };

    onUpdateInventory({
      ...inventory,
      items: [...inventory.items, item],
    });

    setNewItem({ name: "", size: 1, type: "freeform" });
    setIsAddDialogOpen(false);
  };

  const removeItem = (itemId: string) => {
    onUpdateInventory({
      ...inventory,
      items: inventory.items.filter(item => item.id !== itemId),
    });
  };

  const startEditItem = (item: Item) => {
    setEditingItemId(item.id);
    
    // Convert item to edit format
    const editData: CreateItemData = {
      name: item.name,
      size: item.size,
      type: item.type,
    };

    if (item.type === 'weapon') {
      editData.attribute = item.attribute;
      editData.damage = item.damage;
      editData.properties = item.properties;
    } else if (item.type === 'armor') {
      const armor = item as ArmorItem;
      editData.armor = armor.armor;
      editData.maxDexBonus = armor.maxDexBonus;
      editData.isMainArmor = armor.isMainArmor;
      editData.properties = armor.properties;
    } else if (item.type === 'freeform') {
      editData.description = item.description;
    }

    setEditItem(editData);
    setIsEditDialogOpen(true);
  };

  const saveEditItem = () => {
    if (!editItem.name.trim() || !editingItemId) return;

    const updatedItem: Item = {
      id: editingItemId,
      name: editItem.name,
      size: editItem.size,
      type: editItem.type,
      ...(editItem.type === 'weapon' && { 
        attribute: editItem.attribute, 
        damage: editItem.damage, 
        properties: editItem.properties,
        equipped: (inventory.items.find(i => i.id === editingItemId) as WeaponItem)?.equipped || false
      }),
      ...(editItem.type === 'armor' && { 
        armor: editItem.armor, 
        maxDexBonus: editItem.maxDexBonus, 
        isMainArmor: editItem.isMainArmor, 
        properties: editItem.properties,
        equipped: (inventory.items.find(i => i.id === editingItemId) as ArmorItem)?.equipped || false
      }),
      ...(editItem.type === 'freeform' && { description: editItem.description }),
    };

    onUpdateInventory({
      ...inventory,
      items: inventory.items.map(item => 
        item.id === editingItemId ? updatedItem : item
      ),
    });

    setEditItem({ name: "", size: 1, type: "freeform" });
    setEditingItemId(null);
    setIsEditDialogOpen(false);
  };

  const toggleEquipped = (itemId: string) => {
    const item = inventory.items.find(item => item.id === itemId);
    if (!item || (item.type !== 'weapon' && item.type !== 'armor')) {
      return;
    }
    
    const newEquippedState = !item.equipped;
    
    // If trying to equip, check validation
    if (newEquippedState) {
      const validationMessage = getEquipmentValidationMessage(inventory.items, item);
      if (validationMessage) {
        // For main armor replacement, ask for confirmation
        if (item.type === 'armor' && (item as ArmorItem).isMainArmor) {
          if (!confirm(validationMessage + ". Continue?")) {
            return; // User cancelled
          }
        } else {
          alert(validationMessage);
          return; // Don't change the item
        }
      }
    }
    
    let updatedItems: Item[];
    
    // Handle main armor replacement
    if (newEquippedState && item.type === 'armor' && (item as ArmorItem).isMainArmor) {
      updatedItems = equipMainArmorWithReplacement(inventory.items, item as ArmorItem);
    } else {
      // Standard equip/unequip
      updatedItems = inventory.items.map(inventoryItem => {
        if (inventoryItem.id === itemId) {
          return { ...inventoryItem, equipped: newEquippedState };
        }
        return inventoryItem;
      });
    }
    
    onUpdateInventory({
      ...inventory,
      items: updatedItems,
    });
  };

  const getItemIcon = (item: Item) => {
    switch (item.type) {
      case 'weapon': return <Sword className="w-4 h-4" />;
      case 'armor': 
        const armor = item as ArmorItem;
        return armor.isMainArmor ? <Shirt className="w-4 h-4" /> : <Shield className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const renderItemDetails = (item: Item) => {
    switch (item.type) {
      case 'weapon':
        return (
          <div className="text-xs text-muted-foreground mt-1">
            {item.attribute && <div>Attribute: {item.attribute.slice(0, 3).toUpperCase()}</div>}
            {item.damage && <div>Damage: {item.damage}</div>}
            {item.properties && item.properties.length > 0 && (
              <div>Properties: {item.properties.join(', ')}</div>
            )}
          </div>
        );
      case 'armor':
        const armor = item as ArmorItem;
        const baseArmor = armor.armor || 0;
        const maxDexBonus = armor.maxDexBonus ?? Infinity;
        const actualDexBonus = Math.min(characterDexterity, maxDexBonus);
        const totalArmorValue = baseArmor + actualDexBonus;
        
        return (
          <div className="text-xs text-muted-foreground mt-1 space-y-1">
            {armor.isMainArmor && (
              <div className="flex items-center gap-1 text-primary">
                <Shirt className="w-3 h-3" />
                <span className="font-medium">Main Armor</span>
              </div>
            )}
            <div>
              Armor: {baseArmor}
              {characterDexterity > 0 && maxDexBonus > 0 && (
                <span className="text-green-600">
                  {" "}+ {actualDexBonus} dex = {totalArmorValue}
                </span>
              )}
              {maxDexBonus < Infinity && (
                <span className="text-blue-600 ml-1">(max dex: {maxDexBonus})</span>
              )}
            </div>
            {armor.properties && armor.properties.length > 0 && (
              <div>Properties: {armor.properties.join(', ')}</div>
            )}
          </div>
        );
      case 'freeform':
        return item.description ? (
          <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
        ) : null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Inventory Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="max-size">Max Size:</Label>
            <Input
              id="max-size"
              type="number"
              min="0"
              value={inventory.maxSize}
              onChange={(e) => updateMaxSize(parseInt(e.target.value) || 0)}
              className="w-20"
            />
          </div>
          <div className="text-sm">
            <span className={currentSize > inventory.maxSize ? "text-destructive" : "text-muted-foreground"}>
              {currentSize} / {inventory.maxSize}
            </span>
          </div>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="item-name">Name</Label>
                <Input
                  id="item-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Item name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="item-size">Size</Label>
                  <Input
                    id="item-size"
                    type="number"
                    min="0"
                    value={newItem.size}
                    onChange={(e) => setNewItem({ ...newItem, size: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label htmlFor="item-type">Type</Label>
                  <Select value={newItem.type} onValueChange={(value: ItemType) => setNewItem({ ...newItem, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freeform">Freeform</SelectItem>
                      <SelectItem value="weapon">Weapon</SelectItem>
                      <SelectItem value="armor">Armor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newItem.type === 'weapon' && (
                <>
                  <div>
                    <Label htmlFor="weapon-attribute">Attribute</Label>
                    <Select 
                      value={newItem.attribute || ""} 
                      onValueChange={(value) => setNewItem({ ...newItem, attribute: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select attribute" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strength">Strength</SelectItem>
                        <SelectItem value="dexterity">Dexterity</SelectItem>
                        <SelectItem value="intelligence">Intelligence</SelectItem>
                        <SelectItem value="will">Will</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="weapon-damage">Damage</Label>
                    <Input
                      id="weapon-damage"
                      value={newItem.damage || ""}
                      onChange={(e) => setNewItem({ ...newItem, damage: e.target.value })}
                      placeholder="e.g., 1d8"
                    />
                  </div>
                </>
              )}

              {newItem.type === 'armor' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="armor-value">Armor</Label>
                      <Input
                        id="armor-value"
                        type="number"
                        value={newItem.armor || ""}
                        onChange={(e) => setNewItem({ ...newItem, armor: parseInt(e.target.value) || undefined })}
                        placeholder="Armor value"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-dex-bonus">Max Dex Bonus</Label>
                      <Input
                        id="max-dex-bonus"
                        type="number"
                        value={newItem.maxDexBonus ?? ""}
                        onChange={(e) => setNewItem({ ...newItem, maxDexBonus: e.target.value === "" ? undefined : parseInt(e.target.value) || 0 })}
                        placeholder="No limit"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="is-main-armor"
                      type="checkbox"
                      checked={newItem.isMainArmor || false}
                      onChange={(e) => setNewItem({ ...newItem, isMainArmor: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="is-main-armor" className="text-sm">
                      Main Armor (suits of armor, not helmets or shields)
                    </Label>
                  </div>
                </>
              )}

              {newItem.type === 'freeform' && (
                <div>
                  <Label htmlFor="item-description">Description</Label>
                  <Input
                    id="item-description"
                    value={newItem.description || ""}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Item description"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addItem} disabled={!newItem.name.trim()}>
                  Add Item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Item Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-item-name">Name</Label>
                <Input
                  id="edit-item-name"
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  placeholder="Item name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-item-size">Size</Label>
                  <Input
                    id="edit-item-size"
                    type="number"
                    min="0"
                    value={editItem.size}
                    onChange={(e) => setEditItem({ ...editItem, size: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-item-type">Type</Label>
                  <Select value={editItem.type} onValueChange={(value: ItemType) => setEditItem({ ...editItem, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freeform">Freeform</SelectItem>
                      <SelectItem value="weapon">Weapon</SelectItem>
                      <SelectItem value="armor">Armor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {editItem.type === 'weapon' && (
                <>
                  <div>
                    <Label htmlFor="edit-weapon-attribute">Attribute</Label>
                    <Select 
                      value={editItem.attribute || ""} 
                      onValueChange={(value) => setEditItem({ ...editItem, attribute: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select attribute" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strength">Strength</SelectItem>
                        <SelectItem value="dexterity">Dexterity</SelectItem>
                        <SelectItem value="intelligence">Intelligence</SelectItem>
                        <SelectItem value="will">Will</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-weapon-damage">Damage</Label>
                    <Input
                      id="edit-weapon-damage"
                      value={editItem.damage || ""}
                      onChange={(e) => setEditItem({ ...editItem, damage: e.target.value })}
                      placeholder="e.g., 1d8"
                    />
                  </div>
                </>
              )}

              {editItem.type === 'armor' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-armor-value">Armor</Label>
                      <Input
                        id="edit-armor-value"
                        type="number"
                        value={editItem.armor || ""}
                        onChange={(e) => setEditItem({ ...editItem, armor: parseInt(e.target.value) || undefined })}
                        placeholder="Armor value"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-max-dex-bonus">Max Dex Bonus</Label>
                      <Input
                        id="edit-max-dex-bonus"
                        type="number"
                        value={editItem.maxDexBonus ?? ""}
                        onChange={(e) => setEditItem({ ...editItem, maxDexBonus: e.target.value === "" ? undefined : parseInt(e.target.value) || 0 })}
                        placeholder="No limit"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="edit-is-main-armor"
                      type="checkbox"
                      checked={editItem.isMainArmor || false}
                      onChange={(e) => setEditItem({ ...editItem, isMainArmor: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="edit-is-main-armor" className="text-sm">
                      Main Armor (suits of armor, not helmets or shields)
                    </Label>
                  </div>
                </>
              )}

              {editItem.type === 'freeform' && (
                <div>
                  <Label htmlFor="edit-item-description">Description</Label>
                  <Input
                    id="edit-item-description"
                    value={editItem.description || ""}
                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                    placeholder="Item description"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveEditItem} disabled={!editItem.name.trim()}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Size Bar */}
      {inventory.maxSize > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Inventory Space</span>
            <span className={currentSize > inventory.maxSize ? "text-destructive" : ""}>
              {Math.round(sizePercent)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                currentSize > inventory.maxSize
                  ? "bg-destructive"
                  : sizePercent > 80
                  ? "bg-yellow-500"
                  : "bg-primary"
              }`}
              style={{ width: `${Math.min(sizePercent, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-2">
        {inventory.items.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No items in inventory. Click &ldquo;Add Item&rdquo; to get started.
            </CardContent>
          </Card>
        ) : (
          inventory.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getItemIcon(item)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {item.type}
                        </span>
                      </div>
                      {renderItemDetails(item)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Size: {item.size}
                    </span>
                    {(item.type === 'weapon' || item.type === 'armor') && (
                      <Button
                        variant={item.equipped ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleEquipped(item.id)}
                        className={item.equipped ? "text-white" : ""}
                      >
                        {item.equipped ? "Equipped" : "Equip"}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditItem(item)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}