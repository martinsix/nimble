# Nimble Navigator - Application Design

## Overview

Nimble Navigator: A comprehensive digital character sheet application for the Nimble RPG system, built as a web application with offline-first architecture and local storage persistence. The app provides a clean, mobile-responsive interface for managing characters, rolling dice, tracking equipment, and managing combat encounters with full support for temporary HP, saving throws, and equipment management.

## Technology Stack

### Frontend
- **Next.js 14** with App Router (client-side only)
- **TypeScript** for type safety
- **Tailwind CSS** for responsive styling
- **shadcn/ui** component library (built on Radix UI)
- **Zustand** for client state management (future enhancement)
- **Zod** for runtime data validation

### Storage
- **Local Storage** with abstraction layer for future server sync
- **No server-side state** currently (designed for easy migration)

## Architecture

### Data Layer

#### Character Model
```typescript
interface Character {
  id: string
  name: string
  attributes: { strength, dexterity, intelligence, will }
  hitPoints: { current, max, temporary }
  initiative: Skill
  skills: { [skillName]: Skill }
  inventory: Inventory
  timestamps: { createdAt, updatedAt }
}
```

#### Storage Abstraction
- **ICharacterRepository** interface enables future server migration
- **LocalStorageCharacterRepository** handles JSON serialization/deserialization
- **CharacterService** combines repository with Zod validation
- **Singleton pattern** for easy dependency injection

#### UI State Management
- **UIStateService** persists collapsible section preferences
- **Separate from character data** for clean separation of concerns
- **Type-safe** with dedicated UIState interface

### Component Architecture

#### Main Structure
```
app/page.tsx (main orchestrator)
├── CharacterSheet (main form component)
│   ├── CharacterNameSection
│   ├── AdvantageToggle (global advantage/disadvantage)
│   ├── HitPointsSection (with temporary HP support)
│   ├── InitiativeSection (collapsible)
│   ├── ArmorSection (collapsible, shows total armor)
│   ├── AttributesSection (collapsible, with saves)
│   ├── SkillsSection (collapsible)
│   ├── ActionsSection (collapsible, equipped weapons only)
│   └── InventorySection (collapsible, equipment management)
└── RollLog (dice results display)
```

#### Modular Design
- **Component composition** over inheritance
- **Props drilling** with typed interfaces
- **Single responsibility** principle per component
- **Reusable UI components** from shadcn/ui

### Features

#### Core Functionality

1. **Character Management**
   - Editable name and attributes (-2 to 10 range)
   - Auto-saving to local storage
   - Validation with Zod schemas
   - Hit points with current/max/temporary tracking
   - Dying status indicator at 0 HP

2. **Combat & Health System**
   - Hit points with temporary HP (D&D 5e rules)
   - Temporary HP absorbs damage first, doesn't stack
   - Quick damage/heal buttons (1, 5, 10) and custom amounts
   - Health bar with color-coded status
   - Dying indicator when at 0 HP

3. **Initiative System**
   - Dexterity-based with skill modifier
   - d20 + dexterity + modifier rolling
   - Collapsible section with persistent state

4. **Attribute & Saving Throws**
   - Four core attributes (Strength, Dexterity, Intelligence, Will)
   - Separate roll buttons for attribute checks and saving throws
   - Different roll mechanics: checks/saves vs attacks
   - Visual distinction with different icons

5. **Skills System**
   - 10 predefined skills with attribute associations
   - Base attribute + skill modifier calculation
   - Editable skill-specific bonuses (0-20 range)
   - Individual skill rolling with breakdown

6. **Equipment System**
   - Equipment flags for weapons and armor
   - Size-based weapon limits (configurable, default: 2)
   - Equip/unequip toggles with validation
   - Equipped items don't count toward inventory size
   - Only equipped weapons appear in actions

7. **Armor System**
   - Dedicated armor section showing total protection
   - Sum of all equipped armor pieces
   - Multiple armor pieces can be equipped
   - Visual armor breakdown with individual pieces

8. **Dice Rolling & Combat**
   - **Attack Rolls**: Exploding crits, miss on natural 1
   - **Checks/Saves**: Standard d20 + modifier (no crits/misses)
   - Advantage/disadvantage system with global toggle
   - Multi-die expressions (2d6, 3d4, etc.)
   - Roll log with last 100 results and detailed breakdowns

9. **Inventory Management**
   - Three item types: weapons, armor, freeform
   - Size-based capacity system with visual indicators
   - Type-specific properties (damage, armor value, description)
   - Equipment state tracking and validation

10. **Advanced UI Features**
    - Collapsible sections with persistent preferences
    - Mobile-responsive design with adaptive grids
    - Consistent visual feedback and state indicators
    - Advantage/disadvantage visual indicators in rolls

## Key Design Decisions

### Type Safety and Reusability
- **Reuse Type Definitions**: Always import and reuse existing type definitions rather than duplicating them. For example, use `AttributeName` type consistently across all files instead of recreating `'strength' | 'dexterity' | 'intelligence' | 'will'`
- **Single Source of Truth**: Maintain centralized type definitions that other modules can import and extend
- **DRY Principle**: Avoid duplicate type definitions that can lead to inconsistencies and maintenance issues

### Offline-First Architecture
- **No server dependency** for core functionality
- **Local storage** as primary data persistence
- **Abstract repository pattern** enables future server integration
- **Client-side validation** with Zod schemas

### Type Safety
- **TypeScript throughout** with strict type checking
- **Runtime validation** with Zod for data integrity
- **Typed interfaces** for all component props
- **Type-safe** localStorage operations

### Mobile-First Design
- **Responsive grid layouts** (1/2/3/4 columns based on screen size)
- **Touch-friendly** buttons and inputs
- **Collapsible sections** to manage screen real estate
- **Clean visual hierarchy** with shadcn/ui components

### Extensible Data Models
- **Modular skill system** easy to extend
- **Flexible inventory** with type-specific properties
- **Character traits** can be added without breaking changes
- **Validation schemas** enforce data integrity

## File Structure

```
lib/
├── config/          # Game configuration
│   └── game-config.ts
├── types/           # TypeScript interfaces
│   ├── character.ts
│   ├── inventory.ts
│   └── dice.ts
├── schemas/         # Zod validation schemas
│   └── character.ts
├── services/        # Business logic layer
│   ├── character-service.ts
│   ├── dice-service.ts
│   └── ui-state-service.ts
├── storage/         # Data persistence layer
│   └── character-repository.ts
└── utils/           # Helper functions
    └── character-defaults.ts

components/
├── ui/              # shadcn/ui components
├── sections/        # Character sheet sections
│   ├── attributes-section.tsx
│   ├── skills-section.tsx
│   ├── actions-section.tsx
│   ├── armor-section.tsx
│   ├── hit-points-section.tsx
│   ├── initiative-section.tsx
│   ├── inventory-section.tsx
│   └── character-name-section.tsx
├── character-sheet.tsx
├── advantage-toggle.tsx
└── roll-log.tsx

app/
└── page.tsx         # Main application entry
```

## Data Flow

1. **Initialization**: Load character and UI state from localStorage
2. **User Interaction**: Update local state and trigger persistence
3. **Validation**: Zod schemas validate all data before storage
4. **Storage**: Repository pattern abstracts storage implementation
5. **UI Updates**: React state changes trigger re-renders

## Future Enhancements

### Server Integration
- Replace LocalStorageRepository with ServerRepository
- Add authentication and user accounts
- Sync data across devices
- Backup and restore functionality

### Rule Engine
- Modular rules system for Nimble mechanics
- Automatic calculations and bonuses
- Custom rule definitions
- Import/export rule sets

### Advanced Features
- Character templates and presets
- Campaign management
- Shared character access
- Dice roll history analytics

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint checks
```

## Local Storage Keys

- `nimble-navigator-characters`: Character data array
- `nimble-navigator-dice-rolls`: Dice roll history (last 100)
- `nimble-navigator-ui-state`: UI preferences (collapsible sections)

## Game Configuration

All game rules are centralized in `lib/config/game-config.ts`:

- **Critical Hits**: Max consecutive critical hits (default: 20)
- **Combat Rules**: Miss on first die = 1, critical on max roll
- **Character Limits**: Attribute range (-2 to 10), skill modifiers (0-20)
- **Storage Limits**: Maximum roll history (100 rolls)

## Validation Rules

- **Attributes**: Configurable range (default: -2 to 10)
- **Skills**: Configurable modifier range (default: 0-20)
- **Character Name**: 1-50 characters
- **Inventory Size**: Non-negative numbers
- **Item Names**: Required, non-empty strings