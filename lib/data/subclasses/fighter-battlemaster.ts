import { SubclassDefinition } from '../../types/class';

export const fighterBattleMaster: SubclassDefinition = {
  id: 'fighter-battlemaster',
  name: 'Battle Master',
  description: 'A tactical fighter who uses superior technique and battlefield maneuvers to control combat.',
  parentClassId: 'fighter',
  features: [
    {
      level: 3,
      type: 'resource',
      name: 'Superiority Dice',
      description: 'You have four superiority dice, which are d8s used to fuel your combat maneuvers.',
      resource: {
        resourceName: 'Superiority Dice',
        amount: 4,
        rechargeType: 'short_rest'
      }
    },
    {
      level: 3,
      type: 'ability',
      name: 'Combat Maneuvers',
      description: 'You learn three maneuvers of your choice, which are fueled by superiority dice.',
      ability: {
        id: 'battlemaster-maneuvers',
        name: 'Combat Maneuvers',
        description: 'Execute tactical maneuvers to gain advantages in combat.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 4,
        currentUses: 4,
        roll: {
          dice: '1d8',
          attribute: 'strength'
        }
      }
    },
    {
      level: 7,
      type: 'passive_feature',
      name: 'Know Your Enemy',
      description: 'You can study a creature and learn certain information about its capabilities.',
      category: 'utility'
    },
    {
      level: 10,
      type: 'resource',
      name: 'Improved Superiority Dice',
      description: 'Your superiority dice turn into d10s and you gain two more.',
      resource: {
        resourceName: 'Superiority Dice',
        amount: 2,
        rechargeType: 'short_rest'
      }
    },
    {
      level: 15,
      type: 'passive_feature',
      name: 'Relentless',
      description: 'When you roll initiative and have no superiority dice remaining, you regain one.',
      category: 'combat'
    },
    {
      level: 18,
      type: 'resource',
      name: 'Master Tactician',
      description: 'Your superiority dice turn into d12s and you gain two more.',
      resource: {
        resourceName: 'Superiority Dice',
        amount: 2,
        rechargeType: 'short_rest'
      }
    }
  ]
};