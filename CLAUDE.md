# Nimble Character Sheet - Application Design

## Overview

A digital character sheet application for the Nimble RPG system, built as a web application with offline-first architecture and local storage persistence. The app provides a clean, mobile-responsive interface for managing characters, rolling dice, and tracking game data.

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
│   ├── Attributes section (collapsible)
│   ├── Skills section (collapsible)
│   └── Inventory section (collapsible)
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

2. **Skills System**
   - 10 predefined skills with attribute associations
   - Base attribute + skill modifier calculation
   - Editable skill-specific bonuses (0-20 range)

3. **Dice Rolling**
   - d20 + modifier for attributes and skills
   - Roll log with last 100 results
   - Hover tooltips showing roll breakdown
   - Persistent across sessions

4. **Inventory Management**
   - Three item types: weapons, armor, freeform
   - Size-based capacity system
   - Type-specific properties (damage, AC, description)
   - Visual capacity indicators

5. **Combat System**
   - Weapon attack actions auto-generated from inventory
   - Critical hit mechanics (max roll triggers additional dice)
   - Miss mechanics (first die = 1 results in miss)
   - Chaining critical hits up to configurable limit

6. **Advanced Dice Rolling**
   - Multi-die expressions (2d6, 3d4, etc.)
   - Individual die tracking with breakdown tooltips
   - Critical hit visual indicators
   - Miss detection and display

7. **UI State Persistence**
   - Collapsible section preferences
   - Mobile-responsive design
   - Consistent visual feedback

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
├── character-sheet.tsx
├── inventory.tsx
├── actions.tsx
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

- `nimble-characters`: Character data array
- `nimble-dice-rolls`: Dice roll history (last 100)
- `nimble-ui-state`: UI preferences (collapsible sections)

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