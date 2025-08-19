# Nimble Navigator

A comprehensive digital character sheet application for the Nimble RPG system. Navigate your adventures with ease using this intuitive character management tool. Built with Next.js, TypeScript, and Tailwind CSS, featuring offline-first architecture with local storage persistence.

![Nimble Navigator Preview](https://img.shields.io/badge/Status-Complete-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0+-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38bdf8)

## ✨ Features

### Core Character Management
- **Attributes**: Strength, Dexterity, Intelligence, Will (range: -2 to 10)
- **Hit Points**: Current/Max HP with temporary HP support (D&D 5e rules)
- **Initiative**: Dexterity-based with skill modifiers
- **Skills**: 10 predefined skills with attribute associations and custom modifiers

### Combat & Rolling
- **Dice System**: Advanced d20 mechanics with advantage/disadvantage
- **Attack Rolls**: Exploding criticals, miss on natural 1
- **Saving Throws**: Separate buttons for each attribute
- **Roll History**: Last 100 rolls with detailed breakdowns

### Equipment & Inventory
- **Equipment Management**: Weapons, armor, and freeform items
- **Size-Based Limits**: Configurable weapon size restrictions
- **Armor System**: Total armor calculation from equipped pieces
- **Smart Inventory**: Equipped items don't count toward size limits

### Advanced Features
- **Temporary HP**: D&D 5e compliant damage absorption
- **Dying Status**: Clear indicator when at 0 HP
- **Responsive Design**: Mobile-first with collapsible sections
- **Offline-First**: No server required, works completely offline
- **Auto-Save**: All data persists to local storage automatically

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nimble-navigator

# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser to http://localhost:3000
```

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🎮 How to Use

### Character Creation
1. **Name**: Click the character name to edit
2. **Attributes**: Use the number inputs to set attribute values (-2 to 10)
3. **Hit Points**: Set max HP and track current/temporary HP
4. **Skills**: Adjust skill modifiers (0-20) for each of the 10 skills

### Combat & Rolling
1. **Advantage/Disadvantage**: Use the global toggle at the top
2. **Attribute Rolls**: Click "Roll" for checks or "Save" for saving throws
3. **Skill Rolls**: Roll individual skills with automatic attribute bonuses
4. **Attack Rolls**: Equip weapons to see attack actions with damage

### Equipment Management
1. **Add Items**: Use the "Add Item" button in inventory
2. **Equip Gear**: Toggle equip/unequip for weapons and armor
3. **Size Limits**: Weapons have a total size limit (default: 2)
4. **Armor Display**: View total armor value in the dedicated armor section

### Health Management
1. **Damage**: Use quick buttons (-1, -5, -10) or custom amounts
2. **Healing**: Heal up to maximum HP with quick or custom amounts
3. **Temporary HP**: Add temp HP (takes higher value, doesn't stack)
4. **Dying Status**: Automatic "(Dying)" indicator at 0 HP

## 🏗️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS + shadcn/ui components
- **Validation**: Zod for runtime type checking
- **Storage**: Local Storage with repository abstraction
- **Icons**: Lucide React icons

## 📁 Project Structure

```
nimble-navigator/
├── app/                    # Next.js app router
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── sections/         # Character sheet sections
│   ├── ui/               # shadcn/ui components
│   ├── character-sheet.tsx
│   ├── advantage-toggle.tsx
│   └── roll-log.tsx
├── lib/                   # Core application logic
│   ├── config/           # Game configuration
│   ├── types/            # TypeScript interfaces
│   ├── schemas/          # Zod validation schemas
│   ├── services/         # Business logic
│   ├── storage/          # Data persistence
│   └── utils/            # Helper functions
└── public/               # Static assets
```

## 🎯 Game Mechanics

### Dice Rolling
- **Basic Rolls**: d20 + modifier (attributes, skills, saves)
- **Attack Rolls**: Multi-die expressions with exploding crits
- **Advantage/Disadvantage**: Roll extra dice, keep best/worst
- **Critical Hits**: Max roll triggers additional dice (attacks only)
- **Misses**: Natural 1 on first die = miss (attacks only)

### Equipment Rules
- **Weapon Limits**: Total equipped weapon size ≤ 2 (configurable)
- **Armor Stacking**: Multiple armor pieces can be equipped
- **Inventory Size**: Equipped items don't count toward capacity
- **Actions**: Only equipped weapons appear in combat actions

### Health System
- **Regular HP**: Standard current/maximum tracking
- **Temporary HP**: Absorbs damage first, doesn't stack (higher value wins)
- **Damage Order**: Temp HP → Regular HP
- **Dying**: Clear status indicator at 0 HP

## ⚙️ Configuration

All game rules are centralized in `lib/config/game-config.ts`:

```typescript
export const gameConfig = {
  dice: {
    maxCriticalHitsInRow: 20,
  },
  combat: {
    missOnFirstDieOne: true,
  },
  character: {
    attributeRange: { min: -2, max: 10 },
    skillModifierRange: { min: 0, max: 20 },
  },
  equipment: {
    maxWeaponSize: 2,
  },
  storage: {
    maxRollHistory: 100,
  },
};
```

## 💾 Data Storage

The app uses local storage with the following keys:
- `nimble-characters`: Character data
- `nimble-dice-rolls`: Roll history (last 100)
- `nimble-ui-state`: UI preferences (collapsible sections)

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js recommended rules
- **Type Safety**: Runtime validation with Zod schemas
- **Component Architecture**: Modular, reusable components

## 🚀 Deployment

The app is built as a static Next.js application and can be deployed to any static hosting service:

- **Vercel**: Deploy directly from Git repository
- **Netlify**: Drag and drop the `out` folder after `npm run build`
- **GitHub Pages**: Use the static export output
- **Any CDN**: Upload the build output to your preferred hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎲 Nimble RPG

Nimble Navigator is designed for the Nimble RPG system. For game rules and additional resources, visit the official Nimble RPG website.

---

**Built with ❤️ for the Nimble RPG community**