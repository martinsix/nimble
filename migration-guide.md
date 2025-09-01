# Migration Guide: Tabbed Character Sheet to App Router Routes

This guide outlines the step-by-step process to migrate the current tabbed character sheet component to use Next.js App Router routes.

## Migration Overview

We're moving from a client-side tab system to a route-based approach where:
- Each tab becomes a separate route under `/character/[tab]`
- Navigation uses Next.js routing instead of state management
- The layout remains consistent across all tab routes
- Conditional access to routes (like spells) is handled at the routing level

## Migration Steps

### 1. Create the folder structure

First, create the necessary folders for the new route structure:

```bash
mkdir -p app/character/combat
mkdir -p app/character/skills
mkdir -p app/character/info
mkdir -p app/character/equipment
mkdir -p app/character/spells
mkdir -p app/character/log
```

### 2. Create the layout component

Create a layout component that will be shared across all character routes:

```bash
touch app/character/layout.tsx
```

Implement the layout component as described in the implementation plan.

### 3. Create the default character page

Create a default page that redirects to the combat tab:

```bash
touch app/character/page.tsx
```

Implement the redirect logic as described in the implementation plan.

### 4. Create individual tab pages

Create a page component for each tab:

```bash
touch app/character/combat/page.tsx
touch app/character/skills/page.tsx
touch app/character/info/page.tsx
touch app/character/equipment/page.tsx
touch app/character/spells/page.tsx
touch app/character/log/page.tsx
```

Implement each page component as described in the implementation plan.

### 5. Update the bottom tab bar

Modify the bottom tab bar component to use Next.js Link components:

```bash
# No need to create a new file, just update the existing one
```

Update the component as described in the implementation plan.

### 6. Update the main page

Update the main page to redirect to the character route:

```bash
# No need to create a new file, just update the existing one
```

Update the component as described in the implementation plan.

### 7. Test the migration

After implementing all the changes, test the application to ensure everything works correctly:

- Navigation between tabs
- Conditional access to the spells tab
- Character data loading and display
- Character config dialog functionality
- Character selector functionality

## Key Changes

### From State-Based to Route-Based Navigation

**Before:**
```tsx
// Using state to change tabs
const { uiState, updateActiveTab } = useUIStateService();
const activeTab = uiState.activeTab;

// Changing tabs
updateActiveTab("combat");
```

**After:**
```tsx
// Using Next.js navigation
import { useRouter } from "next/navigation";
const router = useRouter();

// Changing tabs
router.push("/character/combat");
```

### From Conditional Rendering to Conditional Routing

**Before:**
```tsx
// Conditional rendering based on state
useEffect(() => {
  if (activeTab === "spells" && !hasSpellAccess) {
    updateActiveTab("combat");
  }
}, [activeTab, hasSpellAccess, updateActiveTab]);

const renderActiveTab = () => {
  switch (activeTab) {
    case "combat":
      return <CombatTab />;
    // ...other cases
  }
};
```

**After:**
```tsx
// Conditional routing in the spells page
useEffect(() => {
  if (!hasSpellAccess) {
    redirect("/character/combat");
  }
}, [hasSpellAccess]);

// Conditional tab visibility in the bottom tab bar
const visibleTabs = tabs.filter((tab) => {
  if (tab.path === "/character/spells") {
    return hasSpellAccess;
  }
  return true;
});
```

## Benefits of This Migration

1. **Better URL Structure**: Each tab has its own URL, making it easier to bookmark and share specific tabs.
2. **Improved SEO**: Each tab can have its own metadata, improving search engine optimization.
3. **Better Navigation**: Users can use browser back/forward buttons to navigate between tabs.
4. **Code Organization**: Each tab's code is isolated in its own file, making it easier to maintain.
5. **Parallel Loading**: Next.js can optimize loading of resources for each route.

## Potential Challenges

1. **State Management**: Ensure that state is properly shared between routes.
2. **Data Loading**: Ensure that character data is loaded and available in all routes.
3. **Conditional Access**: Ensure that the spells tab is properly hidden and redirected if the character doesn't have spell access.