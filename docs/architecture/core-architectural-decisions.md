# Core Architectural Decisions

## Decision Priority Analysis

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
- Testing strategy and automation framework (Jest + React Native Testing Library + Maestro)

**Deferred Decisions (Post-MVP):**
- Game history querying patterns (Phase 2)
- Statistics calculation optimization (Phase 2)
- Advanced state management if needed (if Context becomes insufficient)

## Data Architecture

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
- Database service layer: `src/services/database.ts` for all SQLite operations
- Automatic migrations for schema changes
- Transaction support for data integrity
- Error handling and recovery mechanisms

**Affects:**
- Game state persistence
- Active game storage
- Completed game history
- App lifecycle handling (backgrounding, termination)

## State Management

**Decision: React Context + useReducer**

**Version:** Built into React (no additional dependencies)

**Rationale:**
- No extra dependencies, keeps bundle size small
- Sufficient for game state complexity (players, scores, game status)
- Simple for solo developer to understand and maintain
- Good TypeScript support
- Can migrate to Zustand later if state becomes more complex

**Implementation Approach:**
- Game context: `src/contexts/GameContext.tsx` with game state
- Reducer: `src/reducers/gameReducer.ts` for state updates
- Actions: Type-safe action creators for state mutations
- Provider: Wrap app with GameProvider for state access

**State Structure:**
- Current game (active or null)
- Players array with scores
- Game status (active, completed, paused)
- Leader identification
- Rule enforcement triggers
- Current round number
- Players who have scored in current round (prevents multiple scores per round)

**Actions:**
- `UNDO_LAST_SCORE`: Reverses the last score action in current round
  - Removes player from `playersWhoScoredThisRound` set
  - Restores player score to previous value
  - Restores player state (consecutive_misses, is_eliminated if applicable)
  - Recalculates leader
  - Reverts game status to active if game was completed

**Affects:**
- Real-time score updates
- Rule enforcement UI updates
- Component state synchronization
- Performance optimization needs
- Undo functionality and state restoration

## Component Architecture

**Decision: Hybrid Approach (UI components + Feature-based organization)**

**Rationale:**
- Clear separation between reusable UI and game-specific logic
- Easy to find and maintain components
- Supports NativeWind styling patterns
- Scalable for future features

**Structure:**
```
src/components/
  ui/              # Reusable UI components
    Button.tsx
    Card.tsx
    Input.tsx
  game/            # Game-specific components
    PlayerCard.tsx
    ScoreEntry.tsx
    RuleIndicator.tsx
    GameStatus.tsx
app/               # Screen-level components (Expo Router)
  game/[id]/index.tsx
  game/[id]/winner.tsx
  (tabs)/index.tsx
```

**Affects:**
- Code organization and maintainability
- Component reusability
- Styling with NativeWind
- Developer experience

## Rule Enforcement Logic

**Decision: Service/Utility Functions**

**Rationale:**
- Pure functions are easy to test (critical for 100% accuracy requirement)
- Clear separation from UI components
- No React dependencies in business logic
- Can be called from hooks, components, or tests
- Simple for solo developer

**Implementation Approach:**
- Service file: `src/services/gameRules.ts`
- Functions: `checkPenaltyRule()`, `checkElimination()`, `checkWinCondition()`, `calculateScore()`
- Pure functions: Input game state, return rule results
- Type-safe with TypeScript interfaces
- Comprehensive unit tests for 100% accuracy

**Functions:**
- `checkPenaltyRule(score: number): boolean` - Returns true if score exceeds 50
- `checkElimination(consecutiveMisses: number): boolean` - Returns true if 3+ misses
- `checkWinCondition(score: number): boolean` - Returns true if exactly 50
- `calculateScore(blocks: number[], isMultiple: boolean): number` - Calculates score based on rules

**Round Management & Elimination Rules:**
- **Round-Specific Elimination**: Players eliminated after 3 consecutive misses are eliminated only for the current round, not the entire game
- **Manual Round Completion**: Rounds are completed manually via "Finish Round" button (not automatic)
- **Single Score Per Round**: Players can only score once per round; subsequent attempts are blocked
- **Elimination Reset**: When a round is finished, all eliminations and consecutive misses are reset for the next round
- **State Tracking**: Game state tracks `currentRound` and `playersWhoScoredThisRound` to enforce round rules
- **Elimination Persistence**: Elimination status (`is_eliminated`) is stored in state only, not persisted to database (round-specific)

**Affects:**
- Product differentiator (automatic rule enforcement)
- Testability and reliability
- UI component integration
- Business logic maintainability
- Round progression and player reactivation

## Round Management & Elimination Architecture

**Decision: Round-Specific Elimination with Manual Round Completion**

**Rationale:**
- Battle Blocks game rules require players to be eliminated only for the current round, not the entire game
- Manual round completion gives players control over when rounds end
- Prevents players from scoring multiple times in the same round, ensuring fair turn-taking
- Round-specific state management allows eliminated players to rejoin in subsequent rounds

**Implementation Approach:**
- **Round Tracking**: Game state includes `currentRound` (number) and `playersWhoScoredThisRound` (Set<number>)
- **Elimination State**: `is_eliminated` is tracked in game state only, not persisted to database
- **Round Completion**: Manual via "Finish Round" button in game screen
- **State Reset**: On round completion, all eliminations and consecutive misses are reset
- **Score Enforcement**: Players can only score once per round; subsequent attempts are blocked

**State Structure:**
```typescript
interface GameState {
  currentRound: number;
  playersWhoScoredThisRound: Set<number>;
  players: Player[]; // includes is_eliminated (state only)
  // ... other state
}
```

**Actions:**
- `ADD_SCORE`: Automatically adds player to `playersWhoScoredThisRound` set
- `ELIMINATE_PLAYER`: Sets `is_eliminated: true` in state (not database)
- `START_NEW_ROUND`: Resets eliminations, consecutive misses, and scored set; increments round

**UI Components:**
- `app/game/[id]/index.tsx`: "Finish Round" button, round number display
- `src/components/game/ScoreEntryModal.tsx`: Checks if player already scored, blocks eliminated players
- `src/components/game/PlayerCard.tsx`: Shows "Scored This Round" badge, grays out eliminated/scored players

**Database Considerations:**
- `is_eliminated` column exists in database schema for backward compatibility
- Elimination status is NOT persisted when eliminating players (round-specific)
- When loading players from database, `is_eliminated` is always set to `false`
- Only `consecutive_misses` is persisted (used for elimination detection)

**Affects:**
- Game flow and round progression
- Player reactivation after elimination
- Score entry validation
- UI state management
- Database persistence strategy

## Haptic Feedback Integration

**Decision: Haptic Service/Utility**

**Version:** expo-haptics (included with Expo SDK ~54.0)

**Rationale:**
- Centralized haptic patterns for consistency
- Easy to adjust haptic types across the app
- Can be called from rule enforcement functions
- Better organization than scattered API calls

**Implementation Approach:**
- Service file: `src/services/haptics.ts`
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

## Undo System Architecture

**Decision: Round-Scoped Undo for Score Actions**

**Rationale:**
- Users need ability to correct mistakes in score entry
- Round-scoped undo prevents undoing actions from previous rounds (maintains game integrity)
- Only allows undoing score actions (not eliminations, round completions, or game completions)
- Simple, predictable undo behavior that matches user mental model

**Implementation Approach:**
- **Round Tracking**: Score entries are associated with the current round when created
- **Undo Scope**: Only score entries from the current round can be undone
- **Last Action Only**: Undo reverses the most recent score action in the current round
- **State Restoration**: Undo must restore player state (score, consecutive_misses, is_eliminated) to pre-action state
- **Database Operations**: Delete score entry from database, update player record to previous state

**Round Association Strategy:**
- Track `currentRound` when score entry is created
- Store round number in score entry metadata (via timestamp correlation or explicit round tracking)
- Query score entries by game and filter by round to determine undoable entries
- Alternative: Track round start timestamp and use timestamp comparison to determine round membership

**Undo Operation Flow:**
1. Identify last score entry for current round (query `score_entries` table, filter by `game_id` and round)
2. Validate undo is allowed (game is active, entry is from current round, entry exists)
3. Calculate previous player state:
   - Previous score: `current_score - score_value`
   - Previous consecutive_misses: Restore if score was 0 (miss), otherwise keep current
   - Previous is_eliminated: Restore if elimination happened after this score entry
4. Delete score entry from database
5. Update player record with previous state
6. Update game state:
   - Remove player from `playersWhoScoredThisRound` set
   - Update player score in state
   - Recalculate leader
   - If game was completed, revert to active status
7. Provide user feedback (alert, haptic)

**State Structure:**
```typescript
interface GameState {
  currentRound: number;
  playersWhoScoredThisRound: Set<number>;
  players: Player[];
  // ... other state
}
```

**Database Schema Considerations:**
- `score_entries` table already has `created_at` timestamp
- Can determine round membership by comparing timestamps with round start time
- Alternative: Add `round_number` column to `score_entries` table for explicit round tracking (requires migration)

**Actions:**
- `UNDO_LAST_SCORE`: Reverses the last score action in current round
  - Payload: `{ gameId: number, currentRound: number }`
  - Effects: Deletes score entry, restores player state, updates game state

**Database Functions:**
- `getLastScoreEntryForRound(gameId: number, roundNumber: number): Promise<ScoreEntry | null>`
  - Queries score entries for game, filters by round, returns most recent
- `deleteScoreEntry(entryId: number): Promise<void>`
  - Deletes score entry from database
- `getScoreEntriesByRound(gameId: number, roundNumber: number): Promise<ScoreEntry[]>`
  - Returns all score entries for a specific round (for validation)

**Service Functions:**
- `canUndoLastScore(gameId: number, currentRound: number): Promise<boolean>`
  - Checks if undo is possible (active game, entries exist in current round)
- `undoLastScore(gameId: number, currentRound: number): Promise<UndoResult>`
  - Performs undo operation, returns result with previous state information

**UI Components:**
- `app/game/[id]/index.tsx`: "Undo Last Score" button (only visible when undo is available)
- Undo button disabled when:
  - Game is not active
  - No score entries in current round
  - Round has been completed

**Edge Cases:**
- **Penalty Reversal**: If last score triggered 50+ penalty (reset to 25), undo must restore original score before penalty
- **Win Condition Reversal**: If last score completed game (exactly 50), undo must revert game status to active
- **Elimination Reversal**: If player was eliminated after last score, undo must restore elimination state
- **Consecutive Misses**: If last score was a miss (0), undo must restore previous consecutive_misses count
- **Multiple Undos**: Each undo removes one score entry; can undo multiple times within current round
- **Round Completion**: Once round is completed, cannot undo entries from that round

**Validation Rules:**
- Cannot undo if game is completed, paused, or notcompleted
- Cannot undo entries from previous rounds
- Cannot undo if no score entries exist in current round
- Cannot undo if round has been completed

**Affects:**
- User experience (error correction capability)
- Game state management (state restoration logic)
- Database operations (entry deletion, player updates)
- UI components (undo button, feedback)
- Round tracking (round-scoped undo validation)

## Testing Architecture

**Decision: Multi-Layer Testing Strategy**

**Tools:**
- **Jest** (v30.2.0) + **React Native Testing Library** (v13.3.3) - Unit and component testing
- **Maestro** - End-to-end testing (Expo-recommended)

**Rationale:**
- Fast feedback with unit/component tests
- Confidence with E2E tests for critical user journeys
- Expo officially recommends Maestro for E2E testing
- Jest already established in project

**Implementation Approach:**
- **Unit Tests**: 100% coverage for services, reducers, utilities
- **Component Tests**: 80% coverage for UI and game components
- **E2E Tests**: Critical user journeys in `.maestro/flows/`
- Test organization: `src/**/__tests__/` for unit/component tests
- E2E flows: YAML-based flows in `.maestro/flows/`

**Test Layers:**
1. Unit tests (Jest) - Pure functions, business logic
2. Component tests (React Native Testing Library) - React components
3. Integration tests (Jest + RTL) - Component + service integration
4. E2E tests (Maestro) - Complete user journeys

**Affects:**
- Code quality and confidence
- Development workflow
- CI/CD pipeline
- Long-term maintainability

## Decision Impact Analysis

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
- Undo service uses database service to query and delete score entries
- Undo service uses state management to restore previous game state
- Undo UI component depends on undo service to determine availability and perform undo
