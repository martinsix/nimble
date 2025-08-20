import { ClassDefinition } from '../../types/class';

export const parasitegod: ClassDefinition = {
  id: 'parasitegod',
  name: 'Parasite God',
  description: 'A divine entity that exists by feeding on worship, prayer, and belief. You grow stronger as others revere you, but weaken when forgotten.',
  hitDieSize: 12,
  keyAttributes: ['will', 'strength'],
  startingHP: 15,
  armorProficiencies: [
    { type: 'freeform', name: 'Divine Emanations' }
  ],
  weaponProficiencies: [
    { type: 'freeform', name: 'Worship-Forged Weapons' }
  ],
  features: [
    {
      level: 1,
      type: 'ability',
      name: 'Demand Worship',
      description: 'Compel others to worship you, drawing power from their devotion while weakening their will.',
      ability: {
        id: 'parasitegod-demand-worship',
        name: 'Demand Worship',
        description: 'Force creatures to kneel and worship you, draining their agency to fuel your divine power.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 2,
        currentUses: 2,
        roll: {
          dice: '1d12',
          attribute: 'will'
        }
      }
    },
    {
      level: 1,
      type: 'passive_feature',
      name: 'Faith Battery',
      description: 'Your power fluctuates based on how many beings currently believe in or fear you.',
      category: 'utility'
    },
    {
      level: 2,
      type: 'resource',
      name: 'Divine Parasitism',
      description: 'Siphon spiritual energy from acts of worship, prayer, and religious devotion around you.',
      resource: {
        resourceName: 'Faith Points',
        amount: 2,
        rechargeType: 'long_rest'
      }
    },
    {
      level: 3,
      type: 'ability',
      name: 'Spawn Cult',
      description: 'Rapidly convert a group of people into fanatical worshippers who will die for you.',
      ability: {
        id: 'parasitegod-spawn-cult',
        name: 'Spawn Cult',
        description: 'Instantly indoctrinate nearby creatures, turning them into zealous followers.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    },
    {
      level: 4,
      type: 'ability',
      name: 'Avatar Manifestation',
      description: 'Temporarily become a terrifying divine avatar that mortals cannot help but worship or flee from.',
      ability: {
        id: 'parasitegod-avatar-manifestation',
        name: 'Avatar Manifestation',
        description: 'Transform into an awesome divine form that commands automatic reverence and fear.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1,
        roll: {
          dice: '4d6',
          attribute: 'will'
        }
      }
    }
  ]
};