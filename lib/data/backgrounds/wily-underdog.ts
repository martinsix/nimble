import { BackgroundDefinition } from '../../types/background';

export const wilyUnderdog: BackgroundDefinition = {
  id: 'wily-underdog',
  name: 'Wily Underdog',
  description: '(Req. 0 or negative STR at character creation.) Reroll a failed STR-related roll (e.g., STR attack, STR save, Might check) and use another stat instead, 1/day.',
  features: [
    {
      type: 'passive_feature',
      name: 'Creative Problem Solving',
      description: 'Reroll a failed STR-related roll (e.g., STR attack, STR save, Might check) and use another stat instead, 1/day.'
    }
  ]
};