import { Item, WeaponItem, ArmorItem } from '../types/inventory';
import { gameConfig } from '../config/game-config';

export function getEquippedWeapons(items: Item[]): WeaponItem[] {
  return items.filter((item): item is WeaponItem => 
    item.type === 'weapon' && item.equipped === true
  );
}

export function getEquippedArmor(items: Item[]): ArmorItem[] {
  return items.filter((item): item is ArmorItem => 
    item.type === 'armor' && item.equipped === true
  );
}

export function getEquippedWeaponSize(items: Item[]): number {
  const equippedWeapons = getEquippedWeapons(items);
  return equippedWeapons.reduce((total, weapon) => total + weapon.size, 0);
}

export function canEquipWeapon(items: Item[], weaponToEquip: WeaponItem): boolean {
  if (weaponToEquip.equipped) {
    return true; // Already equipped
  }
  
  const currentEquippedSize = getEquippedWeaponSize(items);
  const totalSizeAfterEquip = currentEquippedSize + weaponToEquip.size;
  
  return totalSizeAfterEquip <= gameConfig.equipment.maxWeaponSize;
}

export function canUnequipWeapon(weaponToUnequip: WeaponItem): boolean {
  return weaponToUnequip.equipped === true;
}

export function canEquipArmor(armorToEquip: ArmorItem): boolean {
  // Multiple pieces of armor can always be equipped according to requirements
  return true;
}

export function canUnequipArmor(armorToUnequip: ArmorItem): boolean {
  return armorToUnequip.equipped === true;
}

export function getEquipmentValidationMessage(items: Item[], itemToEquip: Item): string | null {
  if (itemToEquip.type === 'weapon') {
    const weapon = itemToEquip as WeaponItem;
    if (!canEquipWeapon(items, weapon)) {
      const currentSize = getEquippedWeaponSize(items);
      const maxSize = gameConfig.equipment.maxWeaponSize;
      return `Cannot equip weapon: total weapon size would be ${currentSize + weapon.size}, maximum allowed is ${maxSize}`;
    }
  }
  
  return null; // No validation errors
}