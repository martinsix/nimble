import { ClassDefinition } from '../../types/class';

export const symbiote: ClassDefinition = {
  id: 'symbiote',
  name: 'Symbiote',
  description: 'Bonded with an alien entity, you share your body and mind in exchange for incredible adaptive abilities.',
  hitDieSize: 10,
  keyAttributes: ['strength', 'will'],
  startingHP: 13,
  armorProficiencies: [
    { type: 'freeform', name: 'Living Armor' }
  ],
  weaponProficiencies: [
    { type: 'strength_weapons' },
    { type: 'freeform', name: 'Bio-weapons' }
  ],
  features: [
    {
      level: 1,
      type: 'passive_feature',
      name: 'Adaptive Biology',
      description: 'Your symbiote adapts your body to threats, granting resistance to recently encountered damage.',
      category: 'combat'
    },
    {
      level: 1,
      type: 'ability',
      name: 'Bio-Morph',
      description: 'Your symbiote reshapes parts of your body into weapons, tools, or protective features.',
      ability: {
        id: 'symbiote-bio-morph',
        name: 'Bio-Morph',
        description: 'Transform a limb into a weapon, tool, or defensive appendage for one encounter.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 3,
        currentUses: 3
      }
    },
    {
      level: 2,
      type: 'resource',
      name: 'Symbiotic Bond',
      description: 'Deepen your connection with your symbiote to access more powerful transformations.',
      resource: {
        resourceName: 'Bond Points',
        amount: 2,
        rechargeType: 'short_rest'
      }
    },
    {
      level: 3,
      type: 'ability',
      name: 'Parasitic Drain',
      description: 'Your symbiote extends tendrils to drain life force from nearby enemies to heal you.',
      ability: {
        id: 'symbiote-parasitic-drain',
        name: 'Parasitic Drain',
        description: 'Drain health from enemies within 10 feet to heal yourself.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 2,
        currentUses: 2,
        roll: {
          dice: '1d8',
          attribute: 'will'
        }
      }
    },
    {
      level: 4,
      type: 'ability',
      name: 'Perfect Fusion',
      description: 'Temporarily merge completely with your symbiote, becoming a hybrid creature of immense power.',
      ability: {
        id: 'symbiote-perfect-fusion',
        name: 'Perfect Fusion',
        description: 'Transform into a hybrid form with enhanced abilities for the remainder of the encounter.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    }
  ]
};