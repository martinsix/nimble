import { RepositoryArmorItem } from '../../types/item-repository';

export const MUNDANE_ARMOR: RepositoryArmorItem[] = [
  {
    item: {
      id: 'leather-armor',
      name: 'Leather Armor',
      type: 'armor',
      size: 2,
      armor: 11,
      maxDexBonus: 10,
      isMainArmor: true,
      properties: ['Light'],
      description: 'Supple leather armor that provides basic protection without hindering movement.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'studded-leather',
      name: 'Studded Leather',
      type: 'armor',
      size: 2,
      armor: 12,
      maxDexBonus: 10,
      isMainArmor: true,
      properties: ['Light'],
      description: 'Leather armor reinforced with metal studs for additional protection.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'chain-shirt',
      name: 'Chain Shirt',
      type: 'armor',
      size: 3,
      armor: 13,
      maxDexBonus: 2,
      isMainArmor: true,
      properties: ['Medium'],
      description: 'A shirt of interlocking metal rings that covers the torso.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'scale-mail',
      name: 'Scale Mail',
      type: 'armor',
      size: 4,
      armor: 14,
      maxDexBonus: 2,
      isMainArmor: true,
      properties: ['Medium', 'Disadvantage on Stealth'],
      description: 'Overlapping metal scales sewn onto a leather backing.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'chain-mail',
      name: 'Chain Mail',
      type: 'armor',
      size: 5,
      armor: 16,
      maxDexBonus: 0,
      isMainArmor: true,
      properties: ['Heavy', 'Disadvantage on Stealth'],
      description: 'A full suit of interlocking metal rings from head to toe.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'plate-armor',
      name: 'Plate Armor',
      type: 'armor',
      size: 6,
      armor: 18,
      maxDexBonus: 0,
      isMainArmor: true,
      properties: ['Heavy', 'Disadvantage on Stealth'],
      description: 'The finest armor crafted from interlocking metal plates.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'shield',
      name: 'Shield',
      type: 'armor',
      size: 2,
      armor: 2,
      maxDexBonus: 10,
      isMainArmor: false,
      properties: [],
      description: 'A wooden or metal barrier held in one hand for protection.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'helmet',
      name: 'Helmet',
      type: 'armor',
      size: 1,
      armor: 1,
      maxDexBonus: 10,
      isMainArmor: false,
      properties: [],
      description: 'A protective helm that guards the head from harm.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'cheap-hides',
      name: 'Cheap Hides',
      type: 'armor',
      size: 2,
      armor: 10,
      maxDexBonus: 10,
      isMainArmor: true,
      properties: ['Light'],
      description: 'Poorly cured animal hides offering minimal protection.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'rusty-mail',
      name: 'Rusty Mail',
      type: 'armor',
      size: 4,
      armor: 12,
      maxDexBonus: 2,
      isMainArmor: true,
      properties: ['Medium', 'Disadvantage on Stealth'],
      description: 'Old chain mail covered in rust, still functional but barely.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'wooden-buckler',
      name: 'Wooden Buckler',
      type: 'armor',
      size: 1,
      armor: 1,
      maxDexBonus: 10,
      isMainArmor: false,
      properties: [],
      description: 'A small wooden shield offering basic protection.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'adventurers-garb',
      name: "Adventurer's Garb",
      type: 'armor',
      size: 1,
      armor: 10,
      maxDexBonus: 10,
      isMainArmor: true,
      properties: ['Unarmored'],
      description: 'Sturdy traveling clothes suitable for adventure.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'traveling-robes',
      name: 'Traveling Robes',
      type: 'armor',
      size: 1,
      armor: 10,
      maxDexBonus: 10,
      isMainArmor: true,
      properties: ['Unarmored'],
      description: 'Simple robes worn by scholars and wanderers.'
    },
    category: 'mundane'
  }
];

export const MAGICAL_ARMOR: RepositoryArmorItem[] = [
  {
    item: {
      id: 'dragonscale-armor',
      name: 'Dragonscale Armor',
      type: 'armor',
      size: 4,
      armor: 16,
      maxDexBonus: 2,
      isMainArmor: true,
      properties: ['Medium', 'Magic', 'Fire Resistance'],
      description: 'Armor crafted from the scales of an ancient red dragon, providing both protection and elemental resistance.'
    },
    category: 'magical',
    rarity: 'very-rare'
  },
  {
    item: {
      id: 'elven-chainmail',
      name: 'Elven Chainmail',
      type: 'armor',
      size: 3,
      armor: 16,
      maxDexBonus: 3,
      isMainArmor: true,
      properties: ['Medium', 'Magic', 'Silent'],
      description: 'Exceptionally fine chainmail woven by elven smiths, lighter and quieter than normal mail.'
    },
    category: 'magical',
    rarity: 'rare'
  },
  {
    item: {
      id: 'adamantine-plate',
      name: 'Adamantine Plate',
      type: 'armor',
      size: 6,
      armor: 20,
      maxDexBonus: 0,
      isMainArmor: true,
      properties: ['Heavy', 'Magic', 'Critical Hit Immunity'],
      description: 'Plate armor forged from adamantine, the hardest substance known, that turns critical hits into normal hits.'
    },
    category: 'magical',
    rarity: 'legendary'
  },
  {
    item: {
      id: 'cloak-of-protection',
      name: 'Cloak of Protection',
      type: 'armor',
      size: 1,
      armor: 1,
      maxDexBonus: 10,
      isMainArmor: false,
      properties: ['Magic', '+1 to all saves'],
      description: 'A shimmering cloak that deflects both physical and magical attacks.'
    },
    category: 'magical',
    rarity: 'uncommon'
  },
  {
    item: {
      id: 'shield-of-reflection',
      name: 'Shield of Reflection',
      type: 'armor',
      size: 2,
      armor: 3,
      maxDexBonus: 10,
      isMainArmor: false,
      properties: ['Magic', 'Spell Reflection'],
      description: 'A polished mirror shield that can reflect spells back at their casters.'
    },
    category: 'magical',
    rarity: 'rare'
  }
];