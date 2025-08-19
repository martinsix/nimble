import { AttributeName } from './character';

export type ItemType = 'weapon' | 'armor' | 'freeform';

export interface BaseItem {
  id: string;
  name: string;
  size: number;
  type: ItemType;
}

export interface WeaponItem extends BaseItem {
  type: 'weapon';
  equipped?: boolean;
  attribute?: AttributeName;
  damage?: string;
  properties?: string[];
}

export interface ArmorItem extends BaseItem {
  type: 'armor';
  equipped?: boolean;
  armor?: number;
  maxDexBonus?: number; // Maximum dexterity bonus this armor allows
  isMainArmor?: boolean; // True for primary armor pieces (plate mail, chain mail, etc.), false for supplements (helmets, shields)
  properties?: string[];
}

export interface FreeformItem extends BaseItem {
  type: 'freeform';
  description?: string;
}

export type Item = WeaponItem | ArmorItem | FreeformItem;

export interface Inventory {
  maxSize: number;
  items: Item[];
}

export interface CreateItemData {
  name: string;
  size: number;
  type: ItemType;
  equipped?: boolean;
  attribute?: AttributeName;
  damage?: string;
  armor?: number;
  maxDexBonus?: number;
  isMainArmor?: boolean;
  properties?: string[];
  description?: string;
}