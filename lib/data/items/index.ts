import { ItemRepository } from '../../types/item-repository';
import { MUNDANE_WEAPONS, MAGICAL_WEAPONS } from './weapons';
import { MUNDANE_ARMOR, MAGICAL_ARMOR } from './armor';
import { MUNDANE_CONSUMABLES, MAGICAL_CONSUMABLES } from './consumables';
import { MUNDANE_AMMUNITION, MAGICAL_AMMUNITION } from './ammunition';
import { MUNDANE_FREEFORM, MAGICAL_FREEFORM } from './freeform';

export const ITEM_REPOSITORY: ItemRepository = {
  weapons: [...MUNDANE_WEAPONS, ...MAGICAL_WEAPONS],
  armor: [...MUNDANE_ARMOR, ...MAGICAL_ARMOR],
  freeform: [...MUNDANE_FREEFORM, ...MAGICAL_FREEFORM],
  consumables: [...MUNDANE_CONSUMABLES, ...MAGICAL_CONSUMABLES],
  ammunition: [...MUNDANE_AMMUNITION, ...MAGICAL_AMMUNITION],
};

export * from './weapons';
export * from './armor';
export * from './consumables';
export * from './ammunition';
export * from './freeform';