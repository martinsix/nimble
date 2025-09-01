import { RepositoryFreeformItem } from '../../types/item-repository';

export const MUNDANE_FREEFORM: RepositoryFreeformItem[] = [
  {
    item: {
      id: 'backpack',
      name: 'Backpack',
      type: 'freeform',
      size: 2,
      description: 'A sturdy leather pack with multiple compartments for carrying gear.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'bedroll',
      name: 'Bedroll',
      type: 'freeform',
      size: 2,
      description: 'A thick blanket and sleeping pad for resting outdoors.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'thieves-tools',
      name: "Thieves' Tools",
      type: 'freeform',
      size: 1,
      description: 'A set of lock picks, skeleton keys, and other tools for bypassing locks and traps.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'grappling-hook',
      name: 'Grappling Hook',
      type: 'freeform',
      size: 2,
      description: 'A three-pronged iron hook attached to a length of rope for climbing.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'lantern',
      name: 'Lantern',
      type: 'freeform',
      size: 1,
      description: 'A metal lantern with glass panes that burns oil to provide steady light.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'spellbook',
      name: 'Spellbook',
      type: 'freeform',
      size: 2,
      description: 'A leather-bound tome filled with blank pages for recording spells and magical formulae.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'healers-kit',
      name: "Healer's Kit",
      type: 'freeform',
      size: 1,
      description: 'Bandages, herbs, and medical supplies for treating wounds in the field.'
    },
    category: 'mundane'
  },
  {
    item: {
      id: 'tinderbox',
      name: 'Tinderbox',
      type: 'freeform',
      size: 1,
      description: 'Flint, steel, and tinder for starting fires.'
    },
    category: 'mundane'
  }
];

export const MAGICAL_FREEFORM: RepositoryFreeformItem[] = [
  {
    item: {
      id: 'bag-of-holding',
      name: 'Bag of Holding',
      type: 'freeform',
      size: 1,
      description: 'A magical satchel that contains an extradimensional space, holding far more than its size suggests.'
    },
    category: 'magical',
    rarity: 'uncommon'
  },
  {
    item: {
      id: 'crystal-ball',
      name: 'Crystal Ball',
      type: 'freeform',
      size: 2,
      description: 'A sphere of pure crystal that allows the user to scry distant locations and people.'
    },
    category: 'magical',
    rarity: 'very-rare'
  },
  {
    item: {
      id: 'wand-of-magic-missiles',
      name: 'Wand of Magic Missiles',
      type: 'freeform',
      size: 1,
      description: 'A slender wand that fires unerring bolts of magical force at enemies.'
    },
    category: 'magical',
    rarity: 'uncommon'
  },
  {
    item: {
      id: 'boots-of-speed',
      name: 'Boots of Speed',
      type: 'freeform',
      size: 1,
      description: 'Enchanted boots that allow the wearer to move with supernatural swiftness.'
    },
    category: 'magical',
    rarity: 'rare'
  },
  {
    item: {
      id: 'ring-of-power',
      name: 'Ring of Power',
      type: 'freeform',
      size: 0,
      description: 'A golden ring inscribed with ancient runes that enhances the magical abilities of its wearer.'
    },
    category: 'magical',
    rarity: 'legendary'
  },
  {
    item: {
      id: 'cloak-of-elvenkind',
      name: 'Cloak of Elvenkind',
      type: 'freeform',
      size: 1,
      description: 'A gray cloak woven by elves that helps its wearer blend into natural surroundings.'
    },
    category: 'magical',
    rarity: 'uncommon'
  }
];