# Route Structure Diagram

```mermaid
graph TD
    A[app/page.tsx] -->|redirect| B[app/character/page.tsx]
    B -->|redirect| C[app/character/combat/page.tsx]
    
    Z[app/character/layout.tsx] -->|wraps all character routes| C
    Z -->|wraps all character routes| D[app/character/skills/page.tsx]
    Z -->|wraps all character routes| E[app/character/info/page.tsx]
    Z -->|wraps all character routes| F[app/character/equipment/page.tsx]
    Z -->|wraps all character routes| G[app/character/spells/page.tsx]
    Z -->|wraps all character routes| H[app/character/log/page.tsx]
    
    Z -->|includes| I[CharacterHeader]
    Z -->|includes| J[BottomTabBar]
    
    J -->|links to| C
    J -->|links to| D
    J -->|links to| E
    J -->|links to| F
    J -->|links to| G
    J -->|links to| H
    
    C -->|renders| K[CombatTab]
    D -->|renders| L[SkillsTab]
    E -->|renders| M[CharacterTab]
    F -->|renders| N[EquipmentTab]
    G -->|renders| O[SpellsTab]
    H -->|renders| P[LogTab]
    
    G -->|conditional access| Q[hasSpellAccess]
    Q -->|if false| C
```

# Component Flow Diagram

```mermaid
flowchart TD
    A[User visits app] --> B{Character selected?}
    B -->|No| C[Show CharacterSelector]
    B -->|Yes| D[Redirect to /character/combat]
    
    D --> E[Load CharacterLayout]
    E --> F[Load tab content based on route]
    
    F --> G{Is spells tab?}
    G -->|Yes| H{Has spell access?}
    H -->|No| I[Redirect to /character/combat]
    H -->|Yes| J[Show SpellsTab]
    G -->|No| K[Show requested tab]
    
    L[BottomTabBar] --> M{Has spell access?}
    M -->|No| N[Hide spells tab]
    M -->|Yes| O[Show spells tab]
    
    P[User clicks tab] --> Q[Navigate to new route]
    Q --> F
```

# Data Flow Diagram

```mermaid
flowchart TD
    A[CharacterService] --> B[CharacterLayout]
    A --> C[Tab Components]
    
    D[UIStateService] --> E[BottomTabBar]
    D --> F[Other UI Components]
    
    G[URL/Route] --> H[Active Tab Selection]
    H --> E
    
    I[Character Data] --> J{Has spell access?}
    J -->|Yes| K[Show SpellsTab in navigation]
    J -->|No| L[Hide SpellsTab in navigation]
    J -->|No & on spells route| M[Redirect to combat]