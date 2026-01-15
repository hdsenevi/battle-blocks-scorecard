---
epicNumber: 1
epicTitle: Project Foundation and Infrastructure
status: ready
---

## Epic 1: Project Foundation and Infrastructure

Users have a working app foundation with database, state management, and core services ready for all game features. The app can persist game data reliably, restore game state on app restart, and function across iOS and Android platforms.

**FRs covered:** FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR47, FR48, FR49, FR53, FR57, FR58

**Implementation Notes:**
- Sets up SQLite database with schema (games, players, score_entries tables)
- Implements React Context + useReducer for state management
- Creates database service layer for all SQLite operations
- Implements game rules service (pure functions for rule enforcement logic)
- Implements haptic feedback service
- Handles app lifecycle events for data persistence
- Cross-platform setup and testing
- Foundation that enables all other epics

### Story 1.1: Initialize Project with Expo TypeScript Template

As a developer,
I want to set up the Expo TypeScript project with Expo Router,
So that I have a solid foundation for building the Battle Blocks Scorecard app.

**Acceptance Criteria:**

**Given** the project needs to be initialized (or verified if already exists)
**When** I run the Expo CLI command to create the project
**Then** the project structure includes:
- TypeScript configuration with strict type checking
- Expo Router file-based routing setup
- Basic app structure with `app/`, `components/`, `constants/`, `hooks/` directories
- Package.json with React Native 0.81.5 and Expo SDK ~54.0 dependencies
- TypeScript configuration files (tsconfig.json, expo-env.d.ts)
**And** the project follows Expo best practices for React Native development
**And** the project is ready for NativeWind integration (if not already configured)

**FRs covered:** FR47, FR48, FR49

---

### Story 1.2: Set Up SQLite Database Schema

As a developer,
I want to create the SQLite database schema with games, players, and score_entries tables,
So that game data can be persisted reliably with proper relational structure.

**Acceptance Criteria:**

**Given** expo-sqlite is installed in the project
**When** I initialize the database
**Then** the following tables are created with proper schema:
- `games` table with columns: id (PRIMARY KEY), status (active/completed/paused), created_at, updated_at
- `players` table with columns: id (PRIMARY KEY), game_id (FOREIGN KEY), name, current_score, consecutive_misses, is_eliminated, created_at
- `score_entries` table with columns: id (PRIMARY KEY), player_id (FOREIGN KEY), game_id (FOREIGN KEY), score_value, entry_type (single_block/multiple_blocks), created_at
**And** all foreign key relationships are properly defined
**And** indexes are created for frequently queried columns (game_id, player_id, status)
**And** the schema follows snake_case naming convention as per architecture
**And** database initialization includes error handling for schema creation failures

**FRs covered:** FR24, FR26, FR27, FR28, FR29

---

### Story 1.3: Implement Database Service Layer

As a developer,
I want to create a database service layer that provides CRUD operations for games, players, and score entries,
So that all database interactions are centralized and follow consistent patterns.

**Acceptance Criteria:**

**Given** the database schema is set up (Story 1.2)
**When** I use the database service
**Then** the service provides functions for:
- Game operations: createGame(), getGame(), updateGame(), listActiveGames(), listCompletedGames()
- Player operations: addPlayer(), getPlayer(), updatePlayer(), getPlayersByGame()
- Score entry operations: addScoreEntry(), getScoreEntriesByPlayer(), getScoreEntriesByGame()
**And** all database operations use parameterized queries (no SQL injection risks)
**And** all operations include proper error handling with DatabaseError class
**And** multi-step operations (e.g., creating game + players) use database transactions
**And** the service is located at `services/database.ts` as per architecture
**And** the service exports TypeScript interfaces for all data types

**FRs covered:** FR24, FR25, FR26, FR27, FR28, FR29, FR57, FR58

---

### Story 1.4: Implement Game Rules Service

As a developer,
I want to create pure functions for game rule enforcement logic,
So that rule enforcement is 100% accurate, testable, and separated from UI components.

**Acceptance Criteria:**

**Given** the game rules service is implemented
**When** I call the rule enforcement functions
**Then** the service provides pure functions:
- `checkPenaltyRule(score: number): boolean` - Returns true if score exceeds 50
- `checkElimination(consecutiveMisses: number): boolean` - Returns true if 3+ consecutive misses
- `checkWinCondition(score: number): boolean` - Returns true if exactly 50 points
- `calculateScore(blocks: number[], isMultiple: boolean): number` - Calculates score (single block = number, multiple = count)
**And** all functions are pure (no side effects, no React dependencies)
**And** all functions have comprehensive unit tests with 100% coverage
**And** the service is located at `services/gameRules.ts` as per architecture
**And** functions are type-safe with TypeScript interfaces
**And** edge cases are handled (zero blocks, negative values, etc.)

**FRs covered:** FR16, FR17, FR18, FR19, FR21, FR22, FR23, NFR22, NFR23, NFR24

---

### Story 1.5: Implement Haptic Feedback Service

As a developer,
I want to create a haptic feedback service that wraps Expo Haptics API,
So that haptic feedback is consistent across the app and meets the < 50ms trigger requirement.

**Acceptance Criteria:**

**Given** expo-haptics is installed in the project
**When** I use the haptic service
**Then** the service provides functions:
- `triggerScoreEntry()` - Light impact haptic for normal score entry
- `triggerPenalty()` - Medium/Strong impact haptic for 50+ penalty rule
- `triggerCompletion()` - Success pattern haptic for game completion
- `triggerError()` - Error haptic for invalid actions
**And** all haptic triggers complete within 50ms of function call (NFR7)
**And** the service is located at `services/haptics.ts` as per architecture
**And** haptic types match the requirements (light, medium, success pattern, error)
**And** the service handles platform differences gracefully (iOS vs Android)
**And** errors are handled gracefully if haptics are unavailable

**FRs covered:** FR34, FR35, FR36, FR37, NFR7

---

### Story 1.6: Set Up React Context State Management

As a developer,
I want to create GameContext with useReducer for game state management,
So that game state is centralized and can be accessed throughout the app.

**Acceptance Criteria:**

**Given** React Context and useReducer are available
**When** I set up the state management
**Then** the following are created:
- `contexts/GameContext.tsx` with GameProvider component
- `reducers/gameReducer.ts` with game state reducer
- Type-safe action creators for state mutations
- State structure includes: currentGame, players, gameStatus, leader
**And** the GameProvider wraps the app in the root layout
**And** state updates are immutable (never mutate existing state)
**And** the reducer handles actions: START_GAME, ADD_PLAYER, ADD_SCORE, APPLY_PENALTY, ELIMINATE_PLAYER, COMPLETE_GAME, RESUME_GAME
**And** TypeScript types are defined for GameState, GameAction, and all action payloads
**And** the context provides hooks for accessing state and dispatching actions

**FRs covered:** FR4, FR11, FR12, FR13, FR24, FR25

---

### Story 1.7: Implement App Lifecycle Handling

As a developer,
I want to handle app lifecycle events (backgrounding, foregrounding, termination),
So that game state is automatically saved and restored reliably.

**Acceptance Criteria:**

**Given** the app is running with an active game
**When** the app is backgrounded or terminated
**Then** the current game state is automatically saved to the database
**And** when the app is foregrounded or restarted
**Then** the active game state is automatically restored from the database
**And** game state restoration completes within 500ms (NFR4)
**And** the app handles lifecycle events: AppState changes, app termination
**And** data persistence is 100% reliable (NFR11, NFR12)
**And** if no active game exists, the app shows the home screen
**And** errors during save/restore are handled gracefully with user feedback

**FRs covered:** FR24, FR25, FR26, FR28, FR53, FR58, NFR4, NFR11, NFR12, NFR13

---

### Story 1.8: Configure Cross-Platform Support

As a developer,
I want to ensure the app works correctly on both iOS and Android platforms,
So that users on either platform have a consistent, reliable experience.

**Acceptance Criteria:**

**Given** the app is built for cross-platform deployment
**When** I test on iOS (13.0+) and Android (6.0+ / API level 23+)
**Then** the app functions correctly on both platforms:
- Database operations work on both platforms
- Haptic feedback works on both platforms (with platform-appropriate patterns)
- Navigation works consistently on both platforms
- UI components render correctly on both platforms
**And** platform-specific differences are handled gracefully
**And** the app follows platform conventions (iOS vs Android patterns)
**And** system fonts are used correctly (San Francisco on iOS, Roboto on Android)
**And** touch targets meet platform requirements (44x44 points iOS, 48x48 dp Android)
**And** the app is tested on physical devices for both platforms

**FRs covered:** FR47, FR48, FR49, FR30, NFR45, NFR46, NFR47
