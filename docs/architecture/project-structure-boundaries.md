# Project Structure & Boundaries

## Complete Project Directory Structure

```
battle-blocks-scorecard/
├── README.md
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── app.json
├── expo-env.d.ts
├── .gitignore
├── .eslintrc.js
├── tailwind.config.js
├── nativewind-env.d.ts
│
├── app/                          # Expo Router file-based routing (must be at root)
│   ├── _layout.tsx              # Root layout
│   ├── (tabs)/                  # Tab navigation group
│   │   ├── _layout.tsx         # Tab layout
│   │   ├── index.tsx           # Home screen (start/resume game)
│   │   └── explore.tsx         # Future: game history (Phase 2)
│   ├── game/                    # Game screens
│   │   ├── [id]/               # Dynamic game route
│   │   │   ├── index.tsx       # Main game screen
│   │   │   └── winner.tsx      # Winner announcement screen
│   │   └── new.tsx             # New game setup screen
│   └── modal.tsx               # Modal screens
│
├── src/                          # All source code (except app/ which must be at root)
│   │
│   ├── components/              # React components
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Text.tsx
│   │   │   └── __tests__/
│   │   │       ├── Button.test.tsx
│   │   │       ├── Card.test.tsx
│   │   │       └── Input.test.tsx
│   │   │
│   │   └── game/               # Game-specific components
│   │       ├── PlayerCard.tsx  # Player display with score
│   │       ├── ScoreEntry.tsx  # Score input interface
│   │       ├── ScoreDisplay.tsx # Current scores display
│   │       ├── RuleIndicator.tsx # Rule enforcement visual feedback
│   │       ├── GameStatus.tsx   # Game status (active/completed)
│   │       ├── WinnerScreen.tsx # Winner announcement component
│   │       ├── PlayerList.tsx   # Player management
│   │       └── __tests__/
│   │           ├── PlayerCard.test.tsx
│   │           ├── ScoreEntry.test.tsx
│   │           ├── ScoreDisplay.test.tsx
│   │           └── RuleIndicator.test.tsx
│   │
│   ├── contexts/                # React Context providers
│   │   ├── GameContext.tsx     # Game state management
│   │   └── __tests__/
│   │       └── GameContext.test.tsx
│   │
│   ├── services/                # Business logic services
│   │   ├── database.ts         # SQLite database operations
│   │   ├── gameRules.ts        # Rule enforcement logic
│   │   ├── haptics.ts          # Haptic feedback service
│   │   └── __tests__/
│   │       ├── database.test.ts
│   │       ├── gameRules.test.ts # Critical: 100% accuracy tests
│   │       └── haptics.test.ts
│   │
│   ├── reducers/                # State reducers
│   │   ├── gameReducer.ts      # Game state reducer
│   │   └── __tests__/
│   │       └── gameReducer.test.ts
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-game.ts         # Game state hook
│   │   ├── use-score-entry.ts  # Score entry logic
│   │   └── __tests__/
│   │       ├── use-game.test.ts
│   │       └── use-score-entry.test.ts
│   │
│   ├── database/                # Database schema and migrations
│   │   ├── schema.sql          # Initial database schema
│   │   ├── migrations/         # Database migration files
│   │   │   ├── 001_initial_schema.sql
│   │   │   └── 002_add_game_history.sql  # Phase 2
│   │   └── types.ts            # Database type definitions
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── game.ts             # Game-related types
│   │   ├── player.ts           # Player types
│   │   ├── database.ts         # Database types
│   │   └── index.ts            # Type exports
│   │
│   ├── constants/               # App constants
│   │   ├── theme.ts            # Theme constants (colors, spacing)
│   │   ├── game.ts             # Game rules constants
│   │   └── haptics.ts          # Haptic pattern constants
│   │
│   ├── utils/                   # Utility functions
│   │   ├── validation.ts       # Input validation
│   │   ├── formatting.ts       # Data formatting
│   │   └── __tests__/
│   │       ├── validation.test.ts
│   │       └── formatting.test.ts
│   │
│   └── assets/                  # Static assets
│       ├── images/             # Image assets
│       │   ├── icon.png
│       │   ├── splash-icon.png
│       │   └── android-icon-*.png
│       └── fonts/              # Custom fonts (if needed)
│
├── assets/                      # Static assets (root level for Expo config)
│   ├── images/                 # Image assets
│   │   ├── icon.png
│   │   ├── splash-icon.png
│   │   └── android-icon-*.png
│   └── fonts/                  # Custom fonts (if needed)
│
├── .maestro/                    # E2E test flows (Maestro)
│   ├── flows/                 # Test flow definitions
│   │   ├── 01-create-game.yaml
│   │   ├── 02-add-players.yaml
│   │   ├── 03-enter-scores.yaml
│   │   ├── 04-rule-enforcement.yaml
│   │   ├── 05-complete-game.yaml
│   │   └── 06-resume-game.yaml
│   ├── config.yaml             # Maestro configuration
│   └── README.md               # E2E testing documentation
│
└── references/                  # Project documentation
    └── battle-blocks-instructions.pdf
```

## Architectural Boundaries

**API Boundaries:**
- **No External APIs**: Fully offline application, no network requests
- **Internal Service Boundaries**: Services communicate through function calls, not HTTP
- **Database Boundary**: All database access through `services/database.ts` service layer

**Component Boundaries:**
- **UI Components**: `src/components/ui/` - Pure presentational components, no business logic
- **Game Components**: `src/components/game/` - Game-specific components, can access GameContext
- **Screens**: `app/` - Screen-level components using Expo Router, orchestrate components
- **State Management**: `src/contexts/GameContext.tsx` - Single source of truth for game state
- **Business Logic**: `src/services/` - Pure functions, no React dependencies

**Service Boundaries:**
- **Database Service**: `src/services/database.ts` - Only component that directly accesses SQLite
- **Game Rules Service**: `src/services/gameRules.ts` - Pure functions for rule enforcement
- **Haptics Service**: `src/services/haptics.ts` - Wrapper around Expo Haptics API
- **No Service-to-Service Calls**: Services are independent, called from Context or components

**Data Boundaries:**
- **Database Schema**: `src/database/schema.sql` - Single source of truth for data structure
- **Data Access**: All database operations through `src/services/database.ts`
- **State Layer**: React Context holds in-memory game state, syncs with database
- **Persistence**: Automatic save on state changes, restore on app startup

## Requirements to Structure Mapping

**Feature/FR Category Mapping:**

**Game Management (FR1-FR7):**
- Components: `src/components/game/PlayerList.tsx`, `src/components/game/GameStatus.tsx`
- Screens: `app/(tabs)/index.tsx` (start game), `app/game/new.tsx` (new game setup)
- Services: `src/services/database.ts` (createGame, loadGame, listActiveGames)
- Context: `src/contexts/GameContext.tsx` (game state, actions: startGame, resumeGame)
- Database: `src/database/schema.sql` (games table)

**Score Tracking (FR8-FR15):**
- Components: `src/components/game/ScoreEntry.tsx`, `src/components/game/PlayerCard.tsx`, `src/components/game/ScoreDisplay.tsx`
- Services: `src/services/gameRules.ts` (calculateScore function)
- Context: `src/contexts/GameContext.tsx` (addScore action, score state)
- Database: `src/database/schema.sql` (score_entries table)

**Rule Enforcement (FR16-FR23):**
- Services: `src/services/gameRules.ts` (checkPenaltyRule, checkElimination, checkWinCondition)
- Components: `src/components/game/RuleIndicator.tsx` (visual feedback)
- Services: `src/services/haptics.ts` (triggerPenalty, triggerCompletion)
- Context: `src/contexts/GameContext.tsx` (rule enforcement triggers)
- Database: `src/database/schema.sql` (tracks consecutive_misses, status)

**Data Persistence (FR24-FR30):**
- Services: `src/services/database.ts` (saveGame, loadGame, persistGameState)
- Context: `src/contexts/GameContext.tsx` (auto-save on state changes)
- Database: `src/database/schema.sql` (games, players, score_entries tables)
- Hooks: `src/hooks/use-game.ts` (restore game on mount)

**User Interface & Feedback (FR31-FR40):**
- Components: `src/components/game/GameScreen.tsx`, `src/components/game/ScoreDisplay.tsx`
- Services: `src/services/haptics.ts` (all haptic functions)
- Screens: `app/game/[id]/index.tsx` (main game screen)
- Context: `src/contexts/GameContext.tsx` (real-time state updates)

**Game Completion (FR41-FR46):**
- Components: `src/components/game/WinnerScreen.tsx`
- Services: `src/services/gameRules.ts` (checkWinCondition)
- Screens: `app/game/[id]/winner.tsx`
- Context: `src/contexts/GameContext.tsx` (game completion state)

**Cross-Cutting Concerns:**

**Error Handling:**
- Services: `src/services/database.ts` (DatabaseError class)
- Components: Error boundaries in `app/_layout.tsx`
- Utils: `src/utils/validation.ts` (input validation)

**App Lifecycle:**
- Context: `src/contexts/GameContext.tsx` (save on background, restore on foreground)
- Services: `src/services/database.ts` (persistence operations)
- App: `app/_layout.tsx` (lifecycle event handlers)

**Accessibility:**
- Components: All components in `src/components/ui/` and `src/components/game/` (semantic labels)
- Constants: `src/constants/theme.ts` (touch target sizes, contrast)

## Integration Points

**Internal Communication:**
- **Components → Context**: Components call context actions (e.g., `addScore`, `startGame`)
- **Context → Services**: Context calls service functions (e.g., `gameRules.checkPenaltyRule()`)
- **Context → Database**: Context calls database service for persistence
- **Services → Haptics**: Rule enforcement services call haptic service for feedback
- **State Flow**: User action → Component → Context action → Service → State update → UI re-render

**External Integrations:**
- **Expo Haptics API**: Accessed through `src/services/haptics.ts` wrapper
- **Expo SQLite**: Accessed through `src/services/database.ts` wrapper
- **Expo Router**: File-based routing in `app/` directory
- **NativeWind**: Styling through Tailwind classes in components

**Data Flow:**
1. **Score Entry Flow**: User input → ScoreEntry component → Context action → Game rules service → State update → Database save → UI update + Haptic feedback
2. **Game Start Flow**: User action → Home screen → Context action → Database create → State update → Navigate to game screen
3. **App Restore Flow**: App startup → Context initialization → Database load → State restore → UI render

## File Organization Patterns

**Configuration Files:**
- Root level: `package.json`, `tsconfig.json`, `app.json`, `tailwind.config.js`
- Environment: `.env.local` (gitignored), `.env.example` (template)

**Source Organization:**
- All source code is organized under `src/` directory
- Feature-based for game components (`src/components/game/`)
- Type-based for reusable UI (`src/components/ui/`)
- Service-based for business logic (`src/services/`)
- Screen-based for routing (`app/` - must remain at root for Expo Router)

**Test Organization:**
- `__tests__` folders at same level as source files
- Test files mirror source file names with `.test.tsx` or `.test.ts` extension
- Unit tests for services, integration tests for components
- E2E tests in `.maestro/flows/` directory (YAML format)
- Test configuration: `jest.config.js` (unit/component), `.maestro/config.yaml` (E2E)

**Asset Organization:**
- `assets/images/` for all image assets
- Platform-specific assets (iOS/Android icons) in `assets/images/`
