# Custom Hooks

This directory contains custom React hooks for managing application state with localStorage persistence.

## Available Hooks

### `useLocalStorage`
A generic hook for managing state with localStorage persistence.

```typescript
import { useLocalStorage } from '@/lib/hooks/use-local-storage';

const [value, setValue] = useLocalStorage('my-key', 'default-value');
```

### `useUIState`
Manages UI state including collapsible sections, active tabs, and advantage levels.

```typescript
import { useUIState } from '@/lib/hooks/use-ui-state';

const { 
  uiState, 
  updateCollapsibleState, 
  updateAdvantageLevel, 
  updateActiveTab 
} = useUIState();
```

### `useSettings`
Manages application settings like theme, mode, and preferences.

```typescript
import { useSettings } from '@/lib/hooks/use-settings';

const { settings, updateSettings, resetSettings } = useSettings();
```

### `useActivityLog`
Manages activity logs with persistence.

```typescript
import { useActivityLog } from '@/lib/hooks/use-activity-log';

const { logEntries, addLogEntry, handleClearRolls } = useActivityLog();
```

### `useCharacterStorage`
Manages character data storage.

```typescript
import { useCharacterStorage } from '@/lib/hooks/use-character-storage';

const { 
  characters, 
  saveCharacter, 
  getCharacter, 
  deleteCharacter, 
  getAllCharacters 
} = useCharacterStorage();
```

### `useCustomContent`
Manages custom user-created content like classes, ancestries, and abilities.

```typescript
import { useCustomContent } from '@/lib/hooks/use-custom-content';

const { 
  customContent, 
  addCustomClass, 
  getCustomClasses, 
  clearCustomContent 
} = useCustomContent();
```

## Usage Examples

See the `.example.ts` files in this directory for detailed usage examples.

## Benefits

These hooks provide:

1. **Automatic localStorage persistence** - State is automatically saved to and loaded from localStorage
2. **Server-side rendering support** - Safe to use in SSR environments
3. **Type safety** - Full TypeScript support with proper typing
4. **Cross-tab synchronization** - State changes in one tab are reflected in others
5. **Error handling** - Graceful handling of localStorage errors

## Migration from Services

These hooks are designed to replace the service classes in `lib/services/` for React components. The service classes should still be used for non-React code.