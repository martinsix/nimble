import { RepositoryWeaponItem } from '../../types/item-repository';

export const MUNDANE_WEAPONS: RepositoryWeaponItem[] = [
  {
    item: {
      id: 'dagger',
      name: 'Dagger',
      type: 'weapon',
      size: 1,
      attribute: 'dexterity',
      damage: '1d4',
      properties: ['Light', 'Finesse', 'Thrown'],
      description: 'A short blade perfect for close combat or throwing.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'shortsword',
      name: 'Shortsword',
      type: 'weapon',
      size: 1,
      attribute: 'dexterity',
      damage: '1d6',
      properties: ['Light', 'Finesse'],
      description: 'A versatile one-handed blade favored by rogues and dualists.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'longsword',
      name: 'Longsword',
      type: 'weapon',
      size: 2,
      attribute: 'strength',
      damage: '1d8',
      properties: ['Versatile (1d10)'],
      description: 'A classic knightly blade, reliable in both one and two hands.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'greatsword',
      name: 'Greatsword',
      type: 'weapon',
      size: 3,
      attribute: 'strength',
      damage: '2d6',
      properties: ['Two-handed', 'Heavy'],
      description: 'A massive two-handed sword that cleaves through enemies.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'shortbow',
      name: 'Shortbow',
      type: 'weapon',
      size: 2,
      attribute: 'dexterity',
      damage: '1d6',
      properties: ['Ammunition', 'Range (80/320)', 'Two-handed'],
      description: 'A compact bow suitable for hunters and scouts.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'longbow',
      name: 'Longbow',
      type: 'weapon',
      size: 3,
      attribute: 'dexterity',
      damage: '1d8',
      properties: ['Ammunition', 'Range (150/600)', 'Two-handed', 'Heavy'],
      description: 'A powerful bow with exceptional range and accuracy.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'crossbow',
      name: 'Light Crossbow',
      type: 'weapon',
      size: 2,
      attribute: 'dexterity',
      damage: '1d8',
      properties: ['Ammunition', 'Range (80/320)', 'Loading', 'Two-handed'],
      description: 'A mechanical bow that trades speed for power.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'club',
      name: 'Club',
      type: 'weapon',
      size: 1,
      attribute: 'strength',
      damage: '1d4',
      properties: ['Light'],
      description: 'A simple wooden bludgeon, crude but effective.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'mace',
      name: 'Mace',
      type: 'weapon',
      size: 2,
      attribute: 'strength',
      damage: '1d6',
      properties: [],
      description: 'A heavy metal head on a wooden shaft, designed to crush armor.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'warhammer',
      name: 'Warhammer',
      type: 'weapon',
      size: 2,
      attribute: 'strength',
      damage: '1d8',
      properties: ['Versatile (1d10)'],
      description: 'A balanced hammer perfect for both war and smithing.'
    },
    category: 'mundane'
  }
];

export const MAGICAL_WEAPONS: RepositoryWeaponItem[] = [
  {
    item: {
      id: 'flamebrand',
      name: 'Flamebrand',
      type: 'weapon',
      size: 2,
      attribute: 'strength',
      damage: '1d8+2',
      properties: ['Versatile (1d10+2)', 'Magic', 'Fire damage'],
      description: 'A longsword wreathed in eternal flames that never burn the wielder.'
    },
    category: 'magical',
    rarity: 'rare'
  },
  {
    item: {
      id: 'frostbite',
      name: 'Frostbite',
      type: 'weapon',
      size: 1,
      attribute: 'dexterity',
      damage: '1d6+1',
      properties: ['Light', 'Finesse', 'Magic', 'Cold damage'],
      description: 'A crystalline dagger that leaves trails of frost with each strike.'
    },
    category: 'magical',
    rarity: 'uncommon'
  },
  {
    item: {
      id: 'thunderstrike',
      name: 'Thunderstrike Maul',
      type: 'weapon',
      size: 3,
      attribute: 'strength',
      damage: '2d6+2',
      properties: ['Two-handed', 'Heavy', 'Magic', 'Thunder damage'],
      description: 'A massive maul that crashes like thunder with each devastating blow.'
    },
    category: 'magical',
    rarity: 'very-rare'
  },
  {
    item: {
      id: 'shadowpiercer',
      name: 'Shadowpiercer',
      type: 'weapon',
      size: 3,
      attribute: 'dexterity',
      damage: '1d8+2',
      properties: ['Ammunition', 'Range (150/600)', 'Two-handed', 'Magic', 'Necrotic damage'],
      description: 'A longbow carved from shadowwood that fires arrows of pure darkness.'
    },
    category: 'magical',
    rarity: 'rare'
  },
  {
    item: {
      id: 'dragonslayer',
      name: 'Dragonslayer Greatsword',
      type: 'weapon',
      size: 3,
      attribute: 'strength',
      damage: '2d6+3',
      properties: ['Two-handed', 'Heavy', 'Magic', 'Dragon Bane'],
      description: 'A legendary blade forged from dragon scales, humming with ancient power.'
    },
    category: 'magical',
    rarity: 'legendary'
  }
];