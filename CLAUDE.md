# Nimble Navigator - Application Design

## Overview

Nimble Navigator: A comprehensive digital character sheet application for the Nimble RPG system, built as a web application with offline-first architecture and local storage persistence. The app provides a clean, mobile-responsive interface for managing characters, rolling dice, tracking equipment, and managing combat encounters with full support for temporary HP, saving throws, and equipment management.

## Technology Stack

### Frontend
- **Next.js 14** with App Router (client-side only)
- **TypeScript** for type safety
- **Tailwind CSS** for responsive styling
- **shadcn/ui** component library (built on Radix UI)
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
  level: number
  classId: string
  subclassId?: string
  attributes: { strength, dexterity, intelligence, will }
  hitPoints: { current, max, temporary }
  hitDice: { size, current, max }
  wounds: { current, max }
  resources: ResourceInstance[] // Generic resource system (mana, fury, focus, etc.)
  config: CharacterConfiguration
  initiative: Skill
  actionTracker: { current, base, bonus }
  inEncounter: boolean
  skills: { [skillName]: Skill }
  inventory: Inventory
  abilities: Abilities
  grantedFeatures: string[]
  timestamps: { createdAt, updatedAt }
}

// Resource System - Separates pure definitions from runtime state
interface ResourceDefinition {
  id: string
  name: string
  description?: string
  colorScheme: string // Predefined color scheme (blue-magic, red-fury, etc.)
  icon?: string // Icon identifier (sparkles, fire, etc.)
  resetCondition: 'safe_rest' | 'encounter_end' | 'turn_end' | 'never' | 'manual'
  resetType: 'to_max' | 'to_zero' | 'to_default'
  resetValue?: number
  minValue: number
  maxValue: number
}

interface ResourceInstance {
  definition: ResourceDefinition
  current: number
  sortOrder: number
}
```

#### Service Architecture
- **CharacterCreationService** handles character creation with proper initialization and class features (primary responsibility for character creation)
- **CharacterStorageService** handles character persistence operations (CRUD only, no creation logic)
- **CharacterService** handles character CRUD operations with validation and business logic
- **ResourceService** manages generic resource system (mana, fury, focus, etc.) with configurable reset conditions
- **DiceService** manages all dice rolling mechanics with advantage/disadvantage and critical hits
- **ActivityLogService** tracks character actions, dice rolls, and resource usage
- **AbilityService** handles ability usage, cooldowns, and roll calculations
- **SettingsService** manages app settings and character selection
- **ClassService** handles class definitions, subclass management, feature progression, and spell tier system
- **UIStateService** manages collapsible sections and UI preferences
- **Singleton pattern** for direct service access without React Context overhead

#### Storage & State
- **Local Storage** with JSON serialization for persistence
- **Character activity logging** with type-safe log entries
- **App settings** with mode switching (basic/full) and character selection
- **Type-safe** operations with Zod validation

### Component Architecture

#### Main Structure
```
app/page.tsx (main orchestrator)
├── AppMenu (settings, character selector)
├── CharacterSheet (main form component, mode-aware)
│   ├── CharacterNameSection (editable character name)
│   ├── AdvantageToggle (global advantage/disadvantage)
│   ├── BasicMode (simplified interface)
│   │   ├── HitPointsSection (HP, temporary HP, wounds)
│   │   ├── ActionTrackerSection (encounter actions)
│   │   ├── AttributesSection (key attribute highlighting + tooltips)
│   │   └── SkillsSection (skill checks)
│   └── FullMode (complete interface)
│       ├── All BasicMode sections
│       ├── ResourceSection (generic resource management)
│       ├── InitiativeSection (initiative rolls)
│       ├── ArmorSection (main vs supplementary armor)
│       ├── ActionsSection (equipped weapons and abilities)
│       ├── AbilitySection (ability management with usage tracking)
│       └── InventorySection (equipment management)
├── CharacterConfigDialog (comprehensive configuration)
│   ├── Basic settings (wounds, HP, inventory size)
│   └── Advanced resource management (CRUD with color schemes & icons)
└── ActivityLog (character activity, dice results, resource usage)
```

#### Modular Design
- **Direct service access** eliminating React Context overhead
- **Component composition** over inheritance
- **Single responsibility** principle per component
- **Reusable UI components** from shadcn/ui
- **Type-safe hooks** for service integration

### Features

#### Core Functionality

1. **Character Management**
   - Editable name and attributes (-2 to 10 range)
   - Class and subclass system with automatic feature progression
   - Level-based character advancement with hit dice tracking
   - Auto-saving to local storage
   - Validation with Zod schemas
   - Hit points with current/max/temporary tracking
   - Dying status indicator at 0 HP

2. **Combat & Health System**
   - Hit points with temporary HP (D&D 5e rules)
   - Temporary HP absorbs damage first, doesn't stack
   - Wounds system for tracking serious injuries
   - Quick damage/heal buttons (1, 5, 10) and custom amounts
   - Health bar with color-coded status
   - Dying indicator when at 0 HP

3. **Initiative System**
   - Dexterity-based with skill modifier
   - d20 + dexterity + modifier rolling
   - Collapsible section with persistent state

4. **Attribute & Saving Throws**
   - Four core attributes (Strength, Dexterity, Intelligence, Will)
   - **Key Attribute Highlighting**: Class key attributes shown with bold, underlined text and ring borders
   - **Compact Design**: Icon-only roll/save buttons with hover tooltips
   - Separate roll buttons for attribute checks and saving throws
   - Different roll mechanics: checks/saves vs attacks
   - Visual distinction with different icons (dice for rolls, shield for saves)
   - **Smart Layout**: Responsive grid with tighter spacing for mobile-friendly design

5. **Skills System**
   - 10 predefined skills with attribute associations
   - Base attribute + skill modifier calculation
   - Editable skill-specific bonuses (0-20 range)
   - Individual skill rolling with breakdown

6. **Action Tracker & Encounter System**
   - Combat action tracking with current/base/bonus actions
   - Initiative rolls that set action count for encounters
   - End turn/encounter functionality with ability resets
   - Encounter state management affecting UI and abilities

7. **Equipment System**
   - Equipment flags for weapons and armor
   - Size-based weapon limits (configurable, default: 2)
   - Equip/unequip toggles with validation
   - Equipped items don't count toward inventory size
   - Only equipped weapons appear in actions

8. **Armor System**
   - Main armor vs supplementary armor distinction
   - Only one main armor can be equipped at a time
   - Automatic replacement when equipping new main armor
   - Dexterity bonus calculations with armor limits
   - Visual indicators for armor types and effective bonuses

9. **Generic Resource System**
   - Configurable resources (mana, fury, focus, ki, divine power, etc.)
   - 8 predefined color schemes with dynamic percentage-based gradients
   - 25+ categorized icons (magic, energy, physical, special)
   - Flexible reset conditions (safe rest, encounter end, turn end, never, manual)
   - Multiple reset types (to max, to zero, to custom default value)
   - Visual resource bars with real-time color changes
   - Activity logging for all resource usage
   - Full CRUD operations in character configuration dialog
   - **Class Integration**: ResourceFeature automatically grants resources when leveling up
   - **Pure Definitions**: ResourceDefinition interface separates immutable resource templates from runtime state
   - **Instance Pattern**: ResourceInstance combines definition with current value and sort order
   - **Type Safety**: Complete type separation between definition (template) and instance (runtime state)
   - **Examples**: Wizard "Spell Slots", Fighter "Battlefield Fury", Rogue "Focus", Cleric "Divine Blessing"

10. **Ability System**
    - Freeform abilities (text-only descriptions)
    - Action abilities with frequency-based usage (per-turn, per-encounter, at-will)
    - Integrated roll mechanics with dice, modifiers, and attribute bonuses
    - Automatic ability resets on turn/encounter end
    - Visual usage tracking and roll descriptions

10. **Dice Rolling & Combat**
    - **Attack Rolls**: Exploding crits, miss on natural 1
    - **Checks/Saves**: Standard d20 + modifier (no crits/misses)
    - **Ability Rolls**: Custom dice with modifiers and attribute bonuses
    - Advantage/disadvantage system with global toggle
    - Multi-die expressions (2d6, 3d4, etc.)
    - Activity log with comprehensive action tracking

11. **Inventory Management**
    - Three item types: weapons, armor, freeform
    - Size-based capacity system with visual indicators (10 + Strength attribute)
    - Automatic inventory size adjustment when Strength changes
    - Type-specific properties (damage, armor value, description)
    - Equipment state tracking and validation

12. **App Modes & Character Management**
    - Basic mode: simplified interface (HP, actions, saves, attributes, skills)
    - Full mode: complete character sheet with inventory and abilities
    - Multiple character support with switching and creation
    - Global settings panel with mode selection
    - Character selector with creation and deletion

13. **Class and Subclass System**
    - Four core classes: Fighter, Wizard, Cleric, Rogue
    - Subclass selection at appropriate levels with automatic feature grants
    - Level-based feature progression with validation
    - Automatic feature synchronization when gaining levels or choosing subclasses
    - Feature tracking with unique identifiers and grant history

14. **Advanced UI Features**
    - Collapsible sections with persistent preferences
    - Mobile-responsive design with adaptive grids
    - Consistent visual feedback and state indicators
    - Mode-aware component rendering

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
├── data/            # Game data definitions
│   ├── classes/     # Class definitions (fighter, wizard, cleric, rogue)
│   └── subclasses/  # Subclass definitions with parent class associations
├── types/           # TypeScript interfaces
│   ├── character.ts
│   ├── class.ts (keyAttributes: AttributeName[] for flexibility)
│   ├── inventory.ts
│   ├── abilities.ts
│   ├── resources.ts (ResourceDefinition + ResourceInstance)
│   ├── actions.ts
│   └── dice.ts
├── schemas/         # Zod validation schemas
│   └── character.ts
├── services/        # Business logic layer
│   ├── character-service.ts
│   ├── class-service.ts (ResourceFeature integration)
│   ├── resource-service.ts (generic resource management)
│   ├── dice-service.ts
│   ├── activity-log-service.ts
│   ├── ability-service.ts
│   ├── settings-service.ts
│   ├── ui-state-service.ts
│   ├── service-factory.ts (singleton access)
│   └── interfaces.ts
├── hooks/           # Custom React hooks
│   ├── use-character-service.ts
│   ├── use-dice-actions.ts
│   ├── use-activity-log.ts
│   └── use-ui-state-service.ts
└── utils/           # Helper functions
    ├── character-defaults.ts
    ├── equipment.ts
    └── resource-config.ts (color schemes & icons)

components/
├── ui/              # shadcn/ui components
├── sections/        # Character sheet sections
│   ├── attributes-section.tsx (key attribute highlighting, tooltips)
│   ├── skills-section.tsx
│   ├── actions-section.tsx
│   ├── action-tracker-section.tsx
│   ├── ability-section.tsx
│   ├── armor-section.tsx
│   ├── hit-points-section.tsx
│   ├── initiative-section.tsx
│   ├── inventory-section.tsx
│   ├── resource-section.tsx (generic resource management)
│   ├── character-name-section.tsx
│   └── class-features-section.tsx
├── character-sheet/
│   ├── basic-mode.tsx
│   ├── full-mode.tsx
│   └── character-stats.tsx
├── character-sheet.tsx
├── advantage-toggle.tsx
├── activity-log.tsx
├── app-menu.tsx
├── character-config-dialog.tsx (comprehensive configuration)
├── settings-panel.tsx
└── character-selector.tsx

app/
└── page.tsx         # Main application entry
```

## Data Flow

1. **Initialization**: Load character and UI state from localStorage via service factory
2. **User Interaction**: Direct service calls update state and trigger persistence
3. **Validation**: Zod schemas validate all data before storage
4. **Storage**: Service layer abstracts localStorage operations
5. **UI Updates**: Service hooks trigger automatic re-renders without Context overhead

## Key Technical Achievements

### Architecture Improvements
- **Eliminated React Context**: Direct service access via singleton pattern
- **ResourceFeature Integration**: Class features automatically grant resources
- **Pure Resource Definitions**: Separated immutable templates from runtime state
- **Type Safety**: Comprehensive TypeScript coverage with runtime validation

### UI/UX Enhancements
- **Key Attribute Highlighting**: Visual emphasis on class-specific attributes
- **Compact Design**: Space-efficient mobile-first interface
- **Tooltip System**: Icon-only buttons with informative hover tooltips
- **Generic Resource System**: Flexible resource management with color schemes

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint checks
```

## Local Storage Keys

- `nimble-navigator-characters`: Character data array
- `nimble-navigator-activity-log`: Activity log entries (character actions and dice rolls)
- `nimble-navigator-settings`: App settings (mode, active character)

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

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
KEEP THINGS SHORT AND CONCISE - avoid verbose explanations, long commit messages, and unnecessary details.