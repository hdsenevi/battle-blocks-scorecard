# Implementation Patterns & Consistency Rules

## Pattern Categories Defined

**Critical Conflict Points Identified:**
15+ areas where AI agents could make different choices that would cause conflicts or inconsistencies.

## Naming Patterns

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

## Structure Patterns

**Project Organization:**
- **Tests**: `__tests__` folder at same level as component/file
  - Example: `src/components/game/PlayerCard.tsx` → `src/components/game/__tests__/PlayerCard.test.tsx`
  - Example: `src/services/gameRules.ts` → `src/services/__tests__/gameRules.test.ts`
- **Types**: Co-located with files (TypeScript convention)
  - Example: `types` defined in same file or `types.ts` in same directory
- **Components**: Hybrid approach (ui/ + feature-based)
  - `src/components/ui/` for reusable UI components
  - `src/components/game/` for game-specific components
  - `app/` for screen-level components (Expo Router)
- **Services**: `src/services/` directory for business logic
- **Contexts**: `src/contexts/` directory for React Context providers
- **Hooks**: `src/hooks/` directory for custom React hooks
- **Utils**: `src/utils/` directory for utility functions

**File Structure Patterns:**
```
app/                    # Expo Router screens (must be at root)
src/
  components/
    ui/                 # Reusable UI components
      Button.tsx
      Card.tsx
      __tests__/
        Button.test.tsx
        Card.test.tsx
    game/               # Game-specific components
      PlayerCard.tsx
      ScoreEntry.tsx
      __tests__/
        PlayerCard.test.tsx
        ScoreEntry.test.tsx
  contexts/             # React Context providers
    GameContext.tsx
    __tests__/
      GameContext.test.tsx
  services/             # Business logic services
    database.ts
    gameRules.ts
    haptics.ts
    __tests__/
      database.test.ts
      gameRules.test.ts
      haptics.test.ts
  hooks/                # Custom React hooks
  utils/                 # Utility functions
  database/              # Database schema and types
  constants/             # App constants
  reducers/              # State reducers
```

## Format Patterns

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

## Communication Patterns

**State Management Patterns:**
- **Actions**: camelCase with descriptive verbs (e.g., `addScore`, `resetGame`, `applyPenalty`)
- **Action Types**: UPPER_SNAKE_CASE constants (e.g., `ADD_SCORE`, `RESET_GAME`)
- **State Updates**: Always immutable (use spread operator, never mutate)
- **Context Actions**: Return updated state from reducer, never mutate existing state

**Event/Handler Naming:**
- **Event Handlers**: `handle{Action}` pattern (e.g., `handleScoreEntry`, `handlePlayerAdd`)
- **Callback Props**: `on{Action}` pattern (e.g., `onScoreSubmit`, `onGameComplete`)
- **Service Functions**: Verb-based (e.g., `saveGame`, `loadGame`, `deleteGame`)

## Process Patterns

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

## Enforcement Guidelines

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

## Pattern Examples

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
src/components/game/PlayerCard.tsx
src/components/game/__tests__/PlayerCard.test.tsx  ✅ Correct
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
src/components/game/PlayerCard.tsx
src/components/game/PlayerCard.test.tsx  ❌ Wrong (should be in __tests__)
```

**Service Function:**
```typescript
// ❌ BAD: Side effects, no types
export function checkPenalty(score) {
  console.log('checking...');
  return score > 50;
}
```
