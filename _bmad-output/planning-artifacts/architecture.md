---
stepsCompleted: ['step-01-init', 'step-02-context', 'step-03-starter', 'step-04-decisions', 'step-05-patterns', 'step-06-structure', 'step-07-validation', 'step-08-complete']
inputDocuments: ['planning-artifacts/prd.md', 'planning-artifacts/ux-design-specification.md']
workflowType: 'architecture'
project_name: 'battle-blocks-scorecard'
user_name: 'Shanaka'
date: '2026-01-13T21:02:51Z'
lastStep: 8
status: 'complete'
completedAt: '2026-01-14T06:57:49Z'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
58 functional requirements organized into 8 categories:
- **Game Management (7 FRs)**: Game creation, player management (minimum 2 players, no maximum), game state viewing, resume functionality, active/completed game distinction
- **Score Tracking (8 FRs)**: Score entry (single block = number, multiple blocks = count), real-time score display, leader identification, score history, consecutive miss tracking
- **Rule Enforcement (8 FRs)**: Automatic 50+ penalty detection and reset to 25, elimination tracking (3 consecutive misses), win condition detection (exactly 50 points), correct scoring logic enforcement
- **Data Persistence (7 FRs)**: Automatic game state saving, game state restoration on app restart, active game persistence, completed game persistence, zero data loss guarantee, offline operation
- **User Interface & Feedback (10 FRs)**: Main game screen, score entry interface, visual feedback for rule enforcement, haptic feedback (score entry, penalties, completion, errors), game state indicators
- **Game Completion (6 FRs)**: Win detection, winner announcement, final scores display, game completion marking, prevent further entries after completion
- **Platform & Store (7 FRs)**: iOS 13.0+ and Android 6.0+ support, cross-platform consistency, App Store/Play Store compliance, privacy policy display, app lifecycle handling
- **Error Handling (5 FRs)**: Invalid input handling, rapid entry prevention, edge case handling, data corruption recovery, crash recovery with data persistence

**Non-Functional Requirements:**
47 non-functional requirements across 5 categories:
- **Performance (10 NFRs)**: < 100ms score entry response, < 200ms UI transitions, < 2s app startup, < 500ms game state restoration, real-time rule enforcement, < 50ms haptic feedback trigger, < 100MB memory footprint, minimal battery consumption
- **Reliability (14 NFRs)**: 100% game state persistence across restarts, zero data loss scenarios, data integrity maintenance, zero crashes during gameplay, graceful edge case handling, offline reliability, storage error recovery, 100% rule enforcement accuracy
- **Security (10 NFRs)**: Secure local storage, app sandboxing, no sensitive data collection, App Store/Play Store privacy compliance, privacy policy accessibility, no external data transmission
- **Accessibility (7 NFRs)**: Screen reader support, minimum touch targets (44x44 iOS, 48x48 Android), WCAG AA contrast ratios, system font scaling support, haptic feedback for accessibility, accessible game state information
- **Maintainability (6 NFRs)**: React Native/Expo best practices, maintainable code, well-documented, support for future features, iOS 13.0+ compatibility, Android 6.0+ compatibility

**Scale & Complexity:**
- **Primary domain**: Mobile app (React Native/Expo, cross-platform iOS and Android)
- **Complexity level**: Low to Medium
- **Estimated architectural components**: 5-7 major components
  - Game state management (game creation, player management, game state tracking)
  - Score calculation engine (score entry, calculation logic, single vs multiple blocks)
  - Rule enforcement system (50+ penalty, elimination tracking, win detection)
  - Local data persistence layer (game state storage, active/completed games, metadata)
  - UI components (score entry interface, game display, winner announcement)
  - Haptic feedback service (score entry, rule enforcement, completion, errors)
  - App lifecycle handler (backgrounding, foregrounding, termination, state restoration)

### Technical Constraints & Dependencies

**Technology Stack:**
- React Native 0.81.5
- Expo SDK ~54.0
- TypeScript for type safety
- Expo Router for navigation
- NativeWind (Tailwind CSS) for styling
- System fonts (San Francisco iOS, Roboto Android)

**Storage Options:**
- AsyncStorage (simple key-value storage)
- SQLite via expo-sqlite (relational data, recommended for game state)
- Realm (alternative option, more complex)

**Platform APIs:**
- Expo Haptics API for haptic feedback
- Expo Router for navigation
- React Native platform APIs for lifecycle events

**Constraints:**
- Fully offline operation (no network dependencies)
- iOS 13.0+ and Android 6.0+ (API level 23+) support
- Cross-platform consistency required
- App Store and Play Store compliance required
- Privacy policy required for store submission

### Cross-Cutting Concerns Identified

1. **Data Persistence**: Critical concern affecting game state management, active game storage, completed game history, and app lifecycle handling. Must ensure 100% reliability with zero data loss.

2. **State Management**: Real-time score updates, rule enforcement triggers, and UI synchronization require efficient state management. React Context, Zustand, or Redux may be needed for complex state.

3. **Error Handling**: Input validation, data corruption recovery, crash recovery, and edge case handling must be consistent across all components. Error boundaries and graceful degradation required.

4. **Performance**: Score calculation, rule enforcement checks, UI updates, and haptic feedback must all meet < 100ms response time requirements. Optimize calculations and minimize re-renders.

5. **Accessibility**: Screen reader support, font scaling, touch targets, and color contrast must be considered in all UI components. Semantic labels and accessible navigation required.

6. **Platform Consistency**: iOS and Android parity while respecting platform conventions (haptic patterns, navigation, visual design). Platform-specific code may be needed for native feel.

7. **Rule Enforcement Logic**: Core business logic for game rules (50+ penalty, elimination, win detection) must be centralized, testable, and 100% accurate. This is the product differentiator.

## Starter Template Evaluation

### Primary Technology Domain

**Mobile App (React Native/Expo)** based on project requirements analysis. Cross-platform mobile application targeting iOS 13.0+ and Android 6.0+ (API level 23+).

### Starter Options Considered

**Standard Expo Starter Template:**
- **Command**: `npx create-expo-app --template`
- **Template Options**: TypeScript template with Expo Router
- **Status**: Current and maintained by Expo team
- **Best For**: Greenfield React Native/Expo projects requiring TypeScript and file-based routing

**Evaluation:**
Since this is a greenfield project using Expo SDK ~54.0, React Native 0.81.5, TypeScript, and Expo Router, the standard Expo TypeScript template provides the foundational architecture. The project structure already exists, so this evaluation focuses on the architectural decisions provided by the Expo starter and additional setup required.

### Selected Starter: Expo TypeScript Template with Expo Router

**Rationale for Selection:**
- **Official Support**: Maintained by Expo team, ensures compatibility with Expo SDK ~54.0
- **TypeScript Integration**: Built-in TypeScript configuration aligns with project requirements
- **Expo Router**: File-based routing system matches project navigation needs
- **Production Ready**: Follows React Native/Expo best practices out of the box
- **Flexibility**: Allows customization for NativeWind, local storage, and other project-specific needs

**Initialization Command:**

```bash
npx create-expo-app battle-blocks-scorecard --template
```

**Note:** Since the project already exists, this command serves as reference for the architectural foundation that was established.

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript configuration with strict type checking
- React Native JavaScript runtime
- Metro bundler for development and production builds
- Expo SDK integration and API access

**Styling Solution:**
- Basic React Native StyleSheet support
- **Additional Setup Required**: NativeWind (Tailwind CSS) configuration needed for project design system

**Build Tooling:**
- Metro bundler (React Native's JavaScript bundler)
- Expo CLI for development and build commands
- TypeScript compiler integration
- Hot reloading and fast refresh for development

**Testing Framework:**
- Basic Jest configuration (if included in template)
- **Additional Setup Required**: Testing infrastructure for rule enforcement logic and components

**Code Organization:**
- File-based routing with Expo Router (`app/` directory structure)
- TypeScript file structure
- Component organization patterns
- Basic project structure with `app/`, `components/`, `constants/`, `hooks/` directories

**Development Experience:**
- Expo Go for development testing
- Hot reloading and fast refresh
- TypeScript type checking
- Expo Dev Tools integration
- Cross-platform development (iOS and Android simultaneously)

**Additional Setup Required:**
1. **NativeWind Configuration**: Tailwind CSS integration for styling system
2. **Local Storage Setup**: AsyncStorage or SQLite (expo-sqlite) for game state persistence
3. **Haptic Feedback**: Expo Haptics API integration
4. **State Management**: React Context or Zustand for game state management (if needed)
5. **Error Handling**: Error boundaries and recovery mechanisms
6. **Testing Infrastructure**: Unit tests for rule enforcement logic, component tests

**Note:** Project initialization using the Expo starter template should be the first implementation story (if not already completed). Additional architectural decisions for NativeWind, storage, and state management will be addressed in subsequent architecture decision steps.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. Local data persistence solution (SQLite via expo-sqlite)
2. State management approach (React Context + useReducer)
3. Component architecture organization (Hybrid approach)
4. Rule enforcement logic structure (Service/Utility Functions)
5. Haptic feedback integration (Haptic Service/Utility)

**Important Decisions (Shape Architecture):**
- NativeWind configuration and setup
- Error handling and recovery patterns
- App lifecycle management
- Testing strategy for rule enforcement

**Deferred Decisions (Post-MVP):**
- Game history querying patterns (Phase 2)
- Statistics calculation optimization (Phase 2)
- Advanced state management if needed (if Context becomes insufficient)

### Data Architecture

**Decision: SQLite via expo-sqlite**

**Version:** Compatible with Expo SDK ~54.0

**Rationale:**
- Relational database structure fits game state, players, scores, and game history
- Supports complex queries for future game history features (Phase 2)
- Fast and reliable for 100% data persistence requirement
- Supports database migrations for schema evolution
- Better than AsyncStorage for relational data (games, players, score entries)

**Implementation Approach:**
- Database schema: `games`, `players`, `score_entries` tables
- Database service layer: `services/database.ts` for all SQLite operations
- Automatic migrations for schema changes
- Transaction support for data integrity
- Error handling and recovery mechanisms

**Affects:**
- Game state persistence
- Active game storage
- Completed game history
- App lifecycle handling (backgrounding, termination)

### State Management

**Decision: React Context + useReducer**

**Version:** Built into React (no additional dependencies)

**Rationale:**
- No extra dependencies, keeps bundle size small
- Sufficient for game state complexity (players, scores, game status)
- Simple for solo developer to understand and maintain
- Good TypeScript support
- Can migrate to Zustand later if state becomes more complex

**Implementation Approach:**
- Game context: `contexts/GameContext.tsx` with game state
- Reducer: `reducers/gameReducer.ts` for state updates
- Actions: Type-safe action creators for state mutations
- Provider: Wrap app with GameProvider for state access

**State Structure:**
- Current game (active or null)
- Players array with scores
- Game status (active, completed, paused)
- Leader identification
- Rule enforcement triggers

**Affects:**
- Real-time score updates
- Rule enforcement UI updates
- Component state synchronization
- Performance optimization needs

### Component Architecture

**Decision: Hybrid Approach (UI components + Feature-based organization)**

**Rationale:**
- Clear separation between reusable UI and game-specific logic
- Easy to find and maintain components
- Supports NativeWind styling patterns
- Scalable for future features

**Structure:**
```
components/
  ui/              # Reusable UI components
    Button.tsx
    Card.tsx
    Input.tsx
  game/            # Game-specific components
    PlayerCard.tsx
    ScoreEntry.tsx
    RuleIndicator.tsx
    GameStatus.tsx
screens/           # Screen-level components
  GameScreen.tsx
  WinnerScreen.tsx
  HomeScreen.tsx
```

**Affects:**
- Code organization and maintainability
- Component reusability
- Styling with NativeWind
- Developer experience

### Rule Enforcement Logic

**Decision: Service/Utility Functions**

**Rationale:**
- Pure functions are easy to test (critical for 100% accuracy requirement)
- Clear separation from UI components
- No React dependencies in business logic
- Can be called from hooks, components, or tests
- Simple for solo developer

**Implementation Approach:**
- Service file: `services/gameRules.ts`
- Functions: `checkPenaltyRule()`, `checkElimination()`, `checkWinCondition()`, `calculateScore()`
- Pure functions: Input game state, return rule results
- Type-safe with TypeScript interfaces
- Comprehensive unit tests for 100% accuracy

**Functions:**
- `checkPenaltyRule(score: number): boolean` - Returns true if score exceeds 50
- `checkElimination(consecutiveMisses: number): boolean` - Returns true if 3+ misses
- `checkWinCondition(score: number): boolean` - Returns true if exactly 50
- `calculateScore(blocks: number[], isMultiple: boolean): number` - Calculates score based on rules

**Affects:**
- Product differentiator (automatic rule enforcement)
- Testability and reliability
- UI component integration
- Business logic maintainability

### Haptic Feedback Integration

**Decision: Haptic Service/Utility**

**Version:** expo-haptics (included with Expo SDK ~54.0)

**Rationale:**
- Centralized haptic patterns for consistency
- Easy to adjust haptic types across the app
- Can be called from rule enforcement functions
- Better organization than scattered API calls

**Implementation Approach:**
- Service file: `services/haptics.ts`
- Functions: `triggerScoreEntry()`, `triggerPenalty()`, `triggerCompletion()`, `triggerError()`
- Haptic types: Light impact (score entry), Medium impact (penalty), Success pattern (completion), Error (invalid actions)
- < 50ms trigger time requirement

**Functions:**
- `triggerScoreEntry()` - Light haptic for normal score entry
- `triggerPenalty()` - Strong haptic for 50+ penalty rule
- `triggerCompletion()` - Success pattern for game completion
- `triggerError()` - Error haptic for invalid actions

**Affects:**
- User experience and emotional response
- Rule enforcement feedback
- Accessibility (haptic supplements visual feedback)
- Performance (< 50ms requirement)

### Decision Impact Analysis

**Implementation Sequence:**
1. Database schema and SQLite setup (foundation for all data operations)
2. Game rules service (core business logic, must be tested)
3. State management (React Context + reducer)
4. Haptic service (user feedback)
5. Component architecture implementation
6. Integration and testing

**Cross-Component Dependencies:**
- Database service used by state management for persistence
- Game rules service called from state reducer for rule enforcement
- Haptic service called from game rules and UI components
- State management provides data to all UI components
- Components trigger state updates through context actions

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
15+ areas where AI agents could make different choices that would cause conflicts or inconsistencies.

### Naming Patterns

**Database Naming Conventions:**
- **Tables**: snake_case, plural (e.g., `games`, `players`, `score_entries`)
- **Columns**: snake_case (e.g., `player_id`, `current_score`, `created_at`)
- **Foreign Keys**: `{table}_id` format (e.g., `game_id`, `player_id`)
- **Indexes**: `idx_{table}_{column}` format (e.g., `idx_games_status`, `idx_players_game_id`)
- **Primary Keys**: Always `id` (INTEGER PRIMARY KEY AUTOINCREMENT)

**Rationale**: SQLite convention uses snake_case, maintains consistency with SQL standards.

**Code Naming Conventions:**
- **Components**: PascalCase (e.g., `PlayerCard.tsx`, `ScoreEntry.tsx`)
- **Files**: Match component/function name (e.g., `gameRules.ts`, `haptics.ts`)
- **Functions**: camelCase (e.g., `checkPenaltyRule()`, `triggerScoreEntry()`)
- **Variables**: camelCase (e.g., `currentScore`, `playerName`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_SCORE`, `PENALTY_THRESHOLD`)
- **Types/Interfaces**: PascalCase (e.g., `GameState`, `Player`, `ScoreEntry`)

**Rationale**: TypeScript/React conventions for consistency and readability.

### Structure Patterns

**Project Organization:**
- **Tests**: `__tests__` folder at same level as component/file
  - Example: `components/game/PlayerCard.tsx` → `components/game/__tests__/PlayerCard.test.tsx`
  - Example: `services/gameRules.ts` → `services/__tests__/gameRules.test.ts`
- **Types**: Co-located with files (TypeScript convention)
  - Example: `types` defined in same file or `types.ts` in same directory
- **Components**: Hybrid approach (ui/ + feature-based)
  - `components/ui/` for reusable UI components
  - `components/game/` for game-specific components
  - `screens/` for screen-level components
- **Services**: `services/` directory for business logic
- **Contexts**: `contexts/` directory for React Context providers
- **Hooks**: `hooks/` directory for custom React hooks
- **Utils**: `utils/` directory for utility functions

**File Structure Patterns:**
```
app/                    # Expo Router screens
components/
  ui/                   # Reusable UI components
    Button.tsx
    Card.tsx
    __tests__/
      Button.test.tsx
      Card.test.tsx
  game/                 # Game-specific components
    PlayerCard.tsx
    ScoreEntry.tsx
    __tests__/
      PlayerCard.test.tsx
      ScoreEntry.test.tsx
screens/                # Screen components (if needed)
contexts/               # React Context providers
  GameContext.tsx
  __tests__/
    GameContext.test.tsx
services/               # Business logic services
  database.ts
  gameRules.ts
  haptics.ts
  __tests__/
    database.test.ts
    gameRules.test.ts
    haptics.test.ts
hooks/                  # Custom React hooks
utils/                  # Utility functions
types/                  # Shared TypeScript types (if needed)
constants/              # App constants
```

### Format Patterns

**Database Schema Formats:**
- **Table Creation**: Use `CREATE TABLE IF NOT EXISTS` pattern
- **Migrations**: Timestamp-based naming (e.g., `001_initial_schema.sql`, `002_add_game_history.sql`)
- **Queries**: Always use parameterized queries for security
- **Transactions**: Use transactions for multi-step operations

**TypeScript Format Patterns:**
- **Interfaces**: Use `interface` for object shapes, `type` for unions/intersections
- **Exports**: Prefer named exports for utilities, default exports for components
- **Imports**: Group imports (React, third-party, local) with blank lines

**Error Format Patterns:**
- **Error Classes**: Custom error classes extending `Error`
  - Example: `DatabaseError`, `ValidationError`, `GameRuleError`
- **Error Objects**: `{ message: string, code?: string, details?: any }`
- **Error Boundaries**: App-level error boundary for React errors

### Communication Patterns

**State Management Patterns:**
- **Actions**: camelCase with descriptive verbs (e.g., `addScore`, `resetGame`, `applyPenalty`)
- **Action Types**: UPPER_SNAKE_CASE constants (e.g., `ADD_SCORE`, `RESET_GAME`)
- **State Updates**: Always immutable (use spread operator, never mutate)
- **Context Actions**: Return updated state from reducer, never mutate existing state

**Event/Handler Naming:**
- **Event Handlers**: `handle{Action}` pattern (e.g., `handleScoreEntry`, `handlePlayerAdd`)
- **Callback Props**: `on{Action}` pattern (e.g., `onScoreSubmit`, `onGameComplete`)
- **Service Functions**: Verb-based (e.g., `saveGame`, `loadGame`, `deleteGame`)

### Process Patterns

**Error Handling Patterns:**
- **Database Errors**: Catch and wrap in `DatabaseError` with user-friendly message
- **Validation Errors**: Return error objects, don't throw (for user input validation)
- **Rule Enforcement Errors**: Log error, apply safe default (never break game state)
- **Error Logging**: Use console.error for development, structured logging for production

**Loading State Patterns:**
- **State Property**: `isLoading` or `loading` boolean in state
- **Loading UI**: Show loading indicator, disable interactions during load
- **Error Recovery**: Clear loading state on error, show error message

**Data Validation Patterns:**
- **Input Validation**: Validate before state update, show error immediately
- **Score Validation**: Validate in service layer before applying to game state
- **Type Safety**: Use TypeScript types for compile-time validation

**Database Transaction Patterns:**
- **Multi-Step Operations**: Always use transactions (e.g., creating game + players)
- **Error Handling**: Rollback transaction on error
- **Atomicity**: Ensure game state changes are atomic

### Enforcement Guidelines

**All AI Agents MUST:**

1. **Follow Naming Conventions**: Use snake_case for database, camelCase for code, PascalCase for components
2. **Place Tests in `__tests__` Folders**: Never co-locate test files, always use `__tests__` at same level
3. **Use Parameterized Queries**: Never use string concatenation for SQL queries
4. **Immutable State Updates**: Never mutate state directly, always return new state
5. **Type Safety**: Use TypeScript types for all functions, avoid `any` type
6. **Error Handling**: Always handle errors, never silently fail
7. **Transaction Safety**: Use transactions for multi-step database operations

**Pattern Enforcement:**
- TypeScript compiler enforces type safety
- ESLint rules enforce code style
- Code review checks for pattern compliance
- Tests verify business logic patterns

### Pattern Examples

**Good Examples:**

**Database Query:**
```typescript
// ✅ GOOD: Parameterized query
const result = await db.executeSql(
  'SELECT * FROM games WHERE status = ?',
  ['active']
);
```

**State Update:**
```typescript
// ✅ GOOD: Immutable update
case 'ADD_SCORE':
  return {
    ...state,
    players: state.players.map(player =>
      player.id === action.playerId
        ? { ...player, score: player.score + action.score }
        : player
    )
  };
```

**Test Location:**
```
components/game/PlayerCard.tsx
components/game/__tests__/PlayerCard.test.tsx  ✅ Correct
```

**Service Function:**
```typescript
// ✅ GOOD: Pure function, type-safe
export function checkPenaltyRule(score: number): boolean {
  return score > 50;
}
```

**Anti-Patterns:**

**Database Query:**
```typescript
// ❌ BAD: String concatenation (SQL injection risk)
const query = `SELECT * FROM games WHERE status = '${status}'`;
```

**State Update:**
```typescript
// ❌ BAD: Direct mutation
case 'ADD_SCORE':
  state.players.find(p => p.id === action.playerId).score += action.score;
  return state;
```

**Test Location:**
```
components/game/PlayerCard.tsx
components/game/PlayerCard.test.tsx  ❌ Wrong (should be in __tests__)
```

**Service Function:**
```typescript
// ❌ BAD: Side effects, no types
export function checkPenalty(score) {
  console.log('checking...');
  return score > 50;
}
```

## Project Structure & Boundaries

### Complete Project Directory Structure

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
├── app/                          # Expo Router file-based routing
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
├── components/                  # React components
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Text.tsx
│   │   └── __tests__/
│   │       ├── Button.test.tsx
│   │       ├── Card.test.tsx
│   │       └── Input.test.tsx
│   │
│   └── game/                   # Game-specific components
│       ├── PlayerCard.tsx      # Player display with score
│       ├── ScoreEntry.tsx     # Score input interface
│       ├── ScoreDisplay.tsx   # Current scores display
│       ├── RuleIndicator.tsx  # Rule enforcement visual feedback
│       ├── GameStatus.tsx      # Game status (active/completed)
│       ├── WinnerScreen.tsx    # Winner announcement component
│       ├── PlayerList.tsx      # Player management
│       └── __tests__/
│           ├── PlayerCard.test.tsx
│           ├── ScoreEntry.test.tsx
│           ├── ScoreDisplay.test.tsx
│           └── RuleIndicator.test.tsx
│
├── contexts/                    # React Context providers
│   ├── GameContext.tsx         # Game state management
│   └── __tests__/
│       └── GameContext.test.tsx
│
├── services/                    # Business logic services
│   ├── database.ts             # SQLite database operations
│   ├── gameRules.ts            # Rule enforcement logic
│   ├── haptics.ts              # Haptic feedback service
│   └── __tests__/
│       ├── database.test.ts
│       ├── gameRules.test.ts   # Critical: 100% accuracy tests
│       └── haptics.test.ts
│
├── reducers/                    # State reducers
│   ├── gameReducer.ts          # Game state reducer
│   └── __tests__/
│       └── gameReducer.test.ts
│
├── hooks/                       # Custom React hooks
│   ├── use-game.ts             # Game state hook
│   ├── use-score-entry.ts      # Score entry logic
│   └── __tests__/
│       ├── use-game.test.ts
│       └── use-score-entry.test.ts
│
├── database/                    # Database schema and migrations
│   ├── schema.sql              # Initial database schema
│   ├── migrations/             # Database migration files
│   │   ├── 001_initial_schema.sql
│   │   └── 002_add_game_history.sql  # Phase 2
│   └── types.ts                # Database type definitions
│
├── types/                       # TypeScript type definitions
│   ├── game.ts                 # Game-related types
│   ├── player.ts               # Player types
│   ├── database.ts             # Database types
│   └── index.ts                 # Type exports
│
├── constants/                   # App constants
│   ├── theme.ts                # Theme constants (colors, spacing)
│   ├── game.ts                 # Game rules constants
│   └── haptics.ts              # Haptic pattern constants
│
├── utils/                       # Utility functions
│   ├── validation.ts           # Input validation
│   ├── formatting.ts           # Data formatting
│   └── __tests__/
│       ├── validation.test.ts
│       └── formatting.test.ts
│
├── assets/                      # Static assets
│   ├── images/                 # Image assets
│   │   ├── icon.png
│   │   ├── splash-icon.png
│   │   └── android-icon-*.png
│   └── fonts/                  # Custom fonts (if needed)
│
└── references/                  # Project documentation
    └── battle-blocks-instructions.pdf
```

### Architectural Boundaries

**API Boundaries:**
- **No External APIs**: Fully offline application, no network requests
- **Internal Service Boundaries**: Services communicate through function calls, not HTTP
- **Database Boundary**: All database access through `services/database.ts` service layer

**Component Boundaries:**
- **UI Components**: `components/ui/` - Pure presentational components, no business logic
- **Game Components**: `components/game/` - Game-specific components, can access GameContext
- **Screens**: `app/` - Screen-level components using Expo Router, orchestrate components
- **State Management**: `contexts/GameContext.tsx` - Single source of truth for game state
- **Business Logic**: `services/` - Pure functions, no React dependencies

**Service Boundaries:**
- **Database Service**: `services/database.ts` - Only component that directly accesses SQLite
- **Game Rules Service**: `services/gameRules.ts` - Pure functions for rule enforcement
- **Haptics Service**: `services/haptics.ts` - Wrapper around Expo Haptics API
- **No Service-to-Service Calls**: Services are independent, called from Context or components

**Data Boundaries:**
- **Database Schema**: `database/schema.sql` - Single source of truth for data structure
- **Data Access**: All database operations through `services/database.ts`
- **State Layer**: React Context holds in-memory game state, syncs with database
- **Persistence**: Automatic save on state changes, restore on app startup

### Requirements to Structure Mapping

**Feature/FR Category Mapping:**

**Game Management (FR1-FR7):**
- Components: `components/game/PlayerList.tsx`, `components/game/GameStatus.tsx`
- Screens: `app/(tabs)/index.tsx` (start game), `app/game/new.tsx` (new game setup)
- Services: `services/database.ts` (createGame, loadGame, listActiveGames)
- Context: `contexts/GameContext.tsx` (game state, actions: startGame, resumeGame)
- Database: `database/schema.sql` (games table)

**Score Tracking (FR8-FR15):**
- Components: `components/game/ScoreEntry.tsx`, `components/game/PlayerCard.tsx`, `components/game/ScoreDisplay.tsx`
- Services: `services/gameRules.ts` (calculateScore function)
- Context: `contexts/GameContext.tsx` (addScore action, score state)
- Database: `database/schema.sql` (score_entries table)

**Rule Enforcement (FR16-FR23):**
- Services: `services/gameRules.ts` (checkPenaltyRule, checkElimination, checkWinCondition)
- Components: `components/game/RuleIndicator.tsx` (visual feedback)
- Services: `services/haptics.ts` (triggerPenalty, triggerCompletion)
- Context: `contexts/GameContext.tsx` (rule enforcement triggers)
- Database: `database/schema.sql` (tracks consecutive_misses, status)

**Data Persistence (FR24-FR30):**
- Services: `services/database.ts` (saveGame, loadGame, persistGameState)
- Context: `contexts/GameContext.tsx` (auto-save on state changes)
- Database: `database/schema.sql` (games, players, score_entries tables)
- Hooks: `hooks/use-game.ts` (restore game on mount)

**User Interface & Feedback (FR31-FR40):**
- Components: `components/game/GameScreen.tsx`, `components/game/ScoreDisplay.tsx`
- Services: `services/haptics.ts` (all haptic functions)
- Screens: `app/game/[id]/index.tsx` (main game screen)
- Context: `contexts/GameContext.tsx` (real-time state updates)

**Game Completion (FR41-FR46):**
- Components: `components/game/WinnerScreen.tsx`
- Services: `services/gameRules.ts` (checkWinCondition)
- Screens: `app/game/[id]/winner.tsx`
- Context: `contexts/GameContext.tsx` (game completion state)

**Cross-Cutting Concerns:**

**Error Handling:**
- Services: `services/database.ts` (DatabaseError class)
- Components: Error boundaries in `app/_layout.tsx`
- Utils: `utils/validation.ts` (input validation)

**App Lifecycle:**
- Context: `contexts/GameContext.tsx` (save on background, restore on foreground)
- Services: `services/database.ts` (persistence operations)
- App: `app/_layout.tsx` (lifecycle event handlers)

**Accessibility:**
- Components: All components in `components/ui/` and `components/game/` (semantic labels)
- Constants: `constants/theme.ts` (touch target sizes, contrast)

### Integration Points

**Internal Communication:**
- **Components → Context**: Components call context actions (e.g., `addScore`, `startGame`)
- **Context → Services**: Context calls service functions (e.g., `gameRules.checkPenaltyRule()`)
- **Context → Database**: Context calls database service for persistence
- **Services → Haptics**: Rule enforcement services call haptic service for feedback
- **State Flow**: User action → Component → Context action → Service → State update → UI re-render

**External Integrations:**
- **Expo Haptics API**: Accessed through `services/haptics.ts` wrapper
- **Expo SQLite**: Accessed through `services/database.ts` wrapper
- **Expo Router**: File-based routing in `app/` directory
- **NativeWind**: Styling through Tailwind classes in components

**Data Flow:**
1. **Score Entry Flow**: User input → ScoreEntry component → Context action → Game rules service → State update → Database save → UI update + Haptic feedback
2. **Game Start Flow**: User action → Home screen → Context action → Database create → State update → Navigate to game screen
3. **App Restore Flow**: App startup → Context initialization → Database load → State restore → UI render

### File Organization Patterns

**Configuration Files:**
- Root level: `package.json`, `tsconfig.json`, `app.json`, `tailwind.config.js`
- Environment: `.env.local` (gitignored), `.env.example` (template)

**Source Organization:**
- Feature-based for game components (`components/game/`)
- Type-based for reusable UI (`components/ui/`)
- Service-based for business logic (`services/`)
- Screen-based for routing (`app/`)

**Test Organization:**
- `__tests__` folders at same level as source files
- Test files mirror source file names with `.test.tsx` or `.test.ts` extension
- Unit tests for services, integration tests for components

**Asset Organization:**
- `assets/images/` for all image assets
- Platform-specific assets (iOS/Android icons) in `assets/images/`

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices work together without conflicts:
- React Native 0.81.5 + Expo SDK ~54.0: Fully compatible
- TypeScript + Expo Router: Standard Expo setup
- NativeWind (Tailwind CSS) + React Native: Compatible via NativeWind
- SQLite (expo-sqlite) + Expo SDK ~54.0: Official Expo package
- React Context + useReducer: Built into React, no dependencies
- All versions align with Expo SDK ~54.0 requirements

**Pattern Consistency:**
Implementation patterns fully support architectural decisions:
- Naming conventions consistent: Database (snake_case) vs Code (camelCase)
- Structure patterns align with React Native/Expo best practices
- Test organization (`__tests__` folders) follows React Native conventions
- Communication patterns (Context → Services) are clear and consistent

**Structure Alignment:**
Project structure fully supports all architectural decisions:
- Hybrid component organization enables UI reusability and feature grouping
- Service layer properly separates business logic from UI
- Context layer provides state management without external dependencies
- Database layer isolated through service boundary
- All boundaries properly defined and respected

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
All 58 functional requirements are architecturally supported:

- **Game Management (FR1-FR7)**: ✅ Covered by `services/database.ts`, `contexts/GameContext.tsx`, `app/(tabs)/index.tsx`
- **Score Tracking (FR8-FR15)**: ✅ Covered by `services/gameRules.ts`, `components/game/ScoreEntry.tsx`, `contexts/GameContext.tsx`
- **Rule Enforcement (FR16-FR23)**: ✅ Covered by `services/gameRules.ts`, `services/haptics.ts`, `components/game/RuleIndicator.tsx`
- **Data Persistence (FR24-FR30)**: ✅ Covered by `services/database.ts` (SQLite), `contexts/GameContext.tsx` (auto-save)
- **User Interface & Feedback (FR31-FR40)**: ✅ Covered by `components/game/`, `services/haptics.ts`, `app/game/[id]/index.tsx`
- **Game Completion (FR41-FR46)**: ✅ Covered by `services/gameRules.ts`, `components/game/WinnerScreen.tsx`
- **Platform & Store (FR47-FR53)**: ✅ Covered by React Native/Expo cross-platform architecture
- **Error Handling (FR54-FR58)**: ✅ Covered by `utils/validation.ts`, error boundaries, database error handling

**Non-Functional Requirements Coverage:**
All 47 non-functional requirements are architecturally addressed:

- **Performance (NFR1-NFR10)**: ✅ React Context for fast updates, SQLite for efficient queries, optimized state management
- **Reliability (NFR11-NFR24)**: ✅ SQLite transactions for data integrity, error boundaries, pure functions for rule accuracy
- **Security (NFR25-NFR34)**: ✅ Parameterized queries, sandboxed storage, no external data transmission
- **Accessibility (NFR35-NFR41)**: ✅ Semantic labels, touch target constants, WCAG AA color system
- **Maintainability (NFR42-NFR47)**: ✅ TypeScript throughout, clear structure, separation of concerns

### Implementation Readiness Validation ✅

**Decision Completeness:**
- ✅ All critical decisions documented with specific versions
- ✅ Technology stack fully specified (React Native, Expo, TypeScript, SQLite)
- ✅ Integration patterns clearly defined (Context → Services → Database)
- ✅ Performance considerations addressed (< 100ms updates, < 2s startup)

**Structure Completeness:**
- ✅ Complete directory structure with specific files and folders
- ✅ All component boundaries clearly defined
- ✅ Integration points explicitly mapped
- ✅ Requirements to structure mapping complete

**Pattern Completeness:**
- ✅ All potential conflict points addressed (naming, structure, communication)
- ✅ Naming conventions comprehensive (database, code, files, tests)
- ✅ Communication patterns fully specified (Context actions, service calls)
- ✅ Process patterns documented (error handling, transactions, validation)

### Gap Analysis Results

**Critical Gaps:** None identified

**Important Gaps:**
- **Database Schema Details**: Initial schema structure needs to be defined during first implementation story
  - Tables: `games`, `players`, `score_entries`
  - Relationships and indexes
  - Migration strategy details
- **Migration Process**: Migration file naming and execution process can be refined during implementation

**Nice-to-Have Gaps:**
- Additional code examples for complex patterns
- Performance optimization patterns (can be added during implementation)
- Testing strategy details (can be expanded during test implementation)

### Validation Issues Addressed

No critical or important issues found. Architecture is coherent, complete, and ready for implementation.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Low to Medium)
- [x] Technical constraints identified (React Native/Expo, offline, cross-platform)
- [x] Cross-cutting concerns mapped (data persistence, state management, error handling, etc.)

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions (SQLite, React Context, Service functions, etc.)
- [x] Technology stack fully specified (React Native 0.81.5, Expo SDK ~54.0, TypeScript, NativeWind)
- [x] Integration patterns defined (Context → Services → Database)
- [x] Performance considerations addressed (< 100ms updates, SQLite efficiency)

**✅ Implementation Patterns**
- [x] Naming conventions established (snake_case for DB, camelCase for code, PascalCase for components)
- [x] Structure patterns defined (hybrid approach, `__tests__` folders)
- [x] Communication patterns specified (Context actions, service function calls)
- [x] Process patterns documented (error handling, transactions, validation)

**✅ Project Structure**
- [x] Complete directory structure defined with specific files
- [x] Component boundaries established (ui/, game/, services/, contexts/)
- [x] Integration points mapped (data flow, state flow, service calls)
- [x] Requirements to structure mapping complete (all FR categories mapped)

### Architecture Readiness Assessment

**Overall Status:** ✅ READY FOR IMPLEMENTATION

**Confidence Level:** HIGH - All critical requirements architecturally supported, decisions are coherent, patterns are comprehensive, and structure is complete.

**Key Strengths:**
1. **Clear Separation of Concerns**: Services (business logic), Components (UI), Context (state), Database (persistence)
2. **Testable Business Logic**: Pure functions in `services/gameRules.ts` enable 100% accuracy requirement
3. **Reliable Data Persistence**: SQLite with transactions ensures 100% data reliability
4. **Consistent Patterns**: Comprehensive naming, structure, and communication patterns prevent AI agent conflicts
5. **Complete Requirements Coverage**: All 58 FRs and 47 NFRs architecturally supported
6. **Production-Ready Foundation**: Expo best practices, TypeScript, proper error handling

**Areas for Future Enhancement:**
- Database schema details (can be defined during first database implementation story)
- Migration strategy refinement (can be detailed during migration implementation)
- Performance optimization patterns (can be added as needed during implementation)
- Additional code examples (can be added during component implementation)

### Implementation Handoff

**AI Agent Guidelines:**

1. **Follow All Architectural Decisions Exactly**: Use SQLite via expo-sqlite, React Context + useReducer, Service/Utility functions for rules, Haptic service for feedback
2. **Use Implementation Patterns Consistently**: Follow naming conventions (snake_case for DB, camelCase for code), place tests in `__tests__` folders, use parameterized queries
3. **Respect Project Structure and Boundaries**: Don't mix concerns (UI in services, business logic in components), use proper directory structure
4. **Refer to This Document**: Use architecture.md for all architectural questions, don't make new architectural decisions without updating this document

**First Implementation Priority:**

1. **Database Schema**: Create `database/schema.sql` with `games`, `players`, `score_entries` tables
2. **Database Service**: Implement `services/database.ts` with SQLite operations
3. **Game Rules Service**: Implement `services/gameRules.ts` with pure functions (critical for 100% accuracy)
4. **Game Context**: Implement `contexts/GameContext.tsx` with state management
5. **Haptic Service**: Implement `services/haptics.ts` wrapper
6. **Core Components**: Implement `components/game/PlayerCard.tsx`, `components/game/ScoreEntry.tsx`
7. **Main Game Screen**: Implement `app/game/[id]/index.tsx`

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-01-14T06:57:49Z
**Document Location:** `_bmad-output/planning-artifacts/architecture.md`

### Final Architecture Deliverables

**📋 Complete Architecture Document**

- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**

- 5 critical architectural decisions made
- 15+ implementation patterns defined
- 7 major architectural components specified
- 105 requirements (58 FRs + 47 NFRs) fully supported

**📚 AI Agent Implementation Guide**

- Technology stack with verified versions (React Native 0.81.5, Expo SDK ~54.0, TypeScript, NativeWind)
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries (ui/, game/, services/, contexts/)
- Integration patterns and communication standards

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing Battle Blocks Scorecard. Follow all decisions, patterns, and structures exactly as documented.

**First Implementation Priority:**
Initialize project using Expo CLI: `npx create-expo-app@latest battle-blocks-scorecard --template blank-typescript`

**Development Sequence:**

1. Initialize project using Expo CLI with TypeScript template
2. Set up development environment per architecture (install expo-sqlite, NativeWind, etc.)
3. Implement core architectural foundations (database schema, game rules service)
4. Build features following established patterns (Context → Services → Database)
5. Maintain consistency with documented rules (naming, structure, communication)

### Quality Assurance Checklist

**✅ Architecture Coherence**

- [x] All decisions work together without conflicts
- [x] Technology choices are compatible (React Native + Expo + SQLite + NativeWind)
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**

- [x] All 58 functional requirements are supported
- [x] All 47 non-functional requirements are addressed
- [x] Cross-cutting concerns are handled (data persistence, state management, error handling)
- [x] Integration points are defined (Context → Services → Database)

**✅ Implementation Readiness**

- [x] Decisions are specific and actionable (versions, file paths, function names)
- [x] Patterns prevent agent conflicts (naming conventions, structure rules)
- [x] Structure is complete and unambiguous (all directories and files specified)
- [x] Examples are provided for clarity (file structure, naming patterns)

### Project Success Factors

**🎯 Clear Decision Framework**
Every technology choice was made collaboratively with clear rationale, ensuring all stakeholders understand the architectural direction. All 5 critical decisions (SQLite, React Context, Hybrid components, Service functions, Haptic service) are documented with versions and implementation approaches.

**🔧 Consistency Guarantee**
Implementation patterns and rules ensure that multiple AI agents will produce compatible, consistent code that works together seamlessly. 15+ conflict points identified and resolved through naming conventions, structure patterns, and communication standards.

**📋 Complete Coverage**
All project requirements are architecturally supported, with clear mapping from business needs to technical implementation. All 58 functional requirements and 47 non-functional requirements have architectural solutions.

**🏗️ Solid Foundation**
The chosen Expo starter template and architectural patterns provide a production-ready foundation following current best practices. React Native 0.81.5 + Expo SDK ~54.0 ensures compatibility and long-term support.

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.
