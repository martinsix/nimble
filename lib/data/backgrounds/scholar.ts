import { BackgroundDefinition } from '../../types/background';

export const scholar: BackgroundDefinition = {
  id: 'scholar',
  name: 'Scholar',
  description: 'You spent years learning the lore of the multiverse in libraries, universities, or other institutions of learning.',
  features: [
    {
      type: 'passive_feature',
      name: 'Researcher',
      description: 'When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. This might come from a library, scriptorium, university, or a sage.',
      category: 'knowledge'
    },
    {
      type: 'passive_feature',
      name: 'Academic Network',
      description: 'You have connections with other scholars, librarians, and learned individuals who can provide information or assistance with research.',
      category: 'professional'
    }
  ]
};