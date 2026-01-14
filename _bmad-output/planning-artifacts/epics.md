---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments: ['planning-artifacts/prd.md', 'planning-artifacts/architecture.md', 'planning-artifacts/ux-design-specification.md']
status: 'complete'
readyForDevelopment: true
---

# battle-blocks-scorecard - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for battle-blocks-scorecard, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can start a new game from the main screen
FR2: Users can add a minimum of 2 players to a game (as required by game rules)
FR3: Users can add additional players beyond the minimum (no maximum limit)
FR4: Users can view the current game state showing all active players and their scores
FR5: Users can resume an interrupted game that was previously saved
FR6: Users can see which game is currently active when multiple games exist
FR7: The system can distinguish between active games and completed games
FR8: Users can enter a score for a specific player during their turn
FR9: Users can enter a score when a single block is knocked over (score equals the block number)
FR10: Users can enter a score when multiple blocks are knocked over (score equals the count of blocks)
FR11: The system can display current scores for all players simultaneously
FR12: The system can identify and display the current leader (player with highest score)
FR13: The system can update scores in real-time when new scores are entered
FR14: Users can see the score history for the current game
FR15: The system can track consecutive misses for each player
FR16: The system can automatically detect when a player's score exceeds 50 points
FR17: The system can automatically reset a player's score to 25 when they exceed 50 points (50+ penalty rule)
FR18: The system can track when a player misses all target pins (consecutive miss)
FR19: The system can automatically eliminate a player after 3 consecutive misses
FR20: The system can prevent eliminated players from receiving further scores
FR21: The system can detect when a player reaches exactly 50 points (win condition)
FR22: The system can prevent scores that would exceed 50 without triggering the penalty (must reach exactly 50 to win)
FR23: The system can enforce correct scoring logic (single block = number, multiple blocks = count)
FR24: The system can save the current game state automatically
FR25: The system can restore a saved game state when the app is restarted
FR26: The system can persist active games (games in progress)
FR27: The system can persist completed games (games that have ended)
FR28: The system can maintain game data across app restarts without data loss
FR29: The system can store game metadata (start time, date, players, final scores)
FR30: The system can operate fully offline without network connectivity
FR31: Users can view the main game screen showing all players and their current scores
FR32: Users can access a score entry interface to add scores for players
FR33: The system can provide visual feedback when rules are enforced (e.g., 50+ penalty applied)
FR34: The system can provide haptic feedback when scores are entered
FR35: The system can provide haptic feedback when the 50+ penalty rule is triggered
FR36: The system can provide haptic feedback when a game is completed
FR37: The system can provide haptic feedback for error states
FR38: Users can see which player is currently leading the game
FR39: Users can see which players have been eliminated (if any)
FR40: The system can display game status information (active, completed, paused)
FR41: The system can detect when a player reaches exactly 50 points (winning condition)
FR42: The system can display a winner announcement when a game is completed
FR43: The system can show final scores for all players when a game ends
FR44: The system can mark a game as completed when a winner is determined
FR45: The system can prevent further score entries after a game is completed
FR46: Users can view completed game results after the game ends
FR47: The system can function on iOS devices (iOS 13.0+)
FR48: The system can function on Android devices (Android 6.0+)
FR49: The system can provide a consistent experience across iOS and Android platforms
FR50: The system can comply with App Store review guidelines
FR51: The system can comply with Google Play Store developer policies
FR52: The system can display required privacy policy information
FR53: The system can handle app lifecycle events (backgrounding, foregrounding, termination)
FR54: The system can handle invalid score entries gracefully
FR55: The system can prevent rapid duplicate score entries that could cause errors
FR56: The system can handle edge cases in score calculation (zero blocks, negative values, etc.)
FR57: The system can recover from data corruption scenarios
FR58: The system can handle app crashes without losing game state (data persistence)

### NonFunctional Requirements

NFR1: Score entry actions must complete and display updated scores within 100 milliseconds of user input
NFR2: UI transitions between screens must complete within 200 milliseconds
NFR3: App startup time (cold start) must be under 2 seconds on average devices
NFR4: Game state restoration from local database must complete within 500 milliseconds
NFR5: Score calculations and rule enforcement checks must execute in real-time without perceptible delay
NFR6: All user interactions must feel responsive with no lag or freezing
NFR7: Haptic feedback must trigger within 50 milliseconds of the triggering event
NFR8: Visual feedback for rule enforcement (animations, notifications) must appear immediately when rules are triggered
NFR9: App memory footprint must remain under 100MB during normal operation
NFR10: Battery consumption must be minimal during active gameplay (no background processing)
NFR11: Game state must persist with 100% reliability across app restarts
NFR12: Zero data loss scenarios - all game data must survive app crashes, force closes, and device restarts
NFR13: Local database must maintain data integrity even if app is terminated unexpectedly
NFR14: Completed games must be preserved permanently in local storage
NFR15: Zero crashes during active gameplay sessions (target: 99.9% uptime during use)
NFR16: App must handle edge cases gracefully without crashing (invalid inputs, rapid entries, etc.)
NFR17: App must function reliably in offline mode with no network dependency
NFR18: App must recover gracefully from storage errors or corruption
NFR19: Invalid user inputs must be handled with clear error messages, not crashes
NFR20: System must prevent data corruption from concurrent operations or rapid inputs
NFR21: App must provide fallback mechanisms if primary storage fails
NFR22: Game rule enforcement must be 100% accurate with zero calculation errors
NFR23: Score calculations must be mathematically correct in all scenarios
NFR24: Rule violations (50+ penalty, elimination) must be detected and applied correctly
NFR25: Local game data must be stored securely using platform-recommended storage mechanisms
NFR26: App must prevent unauthorized access to game data from other apps (sandboxing)
NFR27: No sensitive user data collection beyond local game scores and player names
NFR28: App must comply with App Store privacy guidelines (iOS)
NFR29: App must comply with Google Play privacy policies (Android)
NFR30: Privacy policy must be accessible and clearly explain data handling practices
NFR31: App must not transmit any user data to external servers (fully offline)
NFR32: App must meet App Store Review Guidelines requirements
NFR33: App must meet Google Play Developer Policy requirements
NFR34: App must include required privacy disclosures for store submission
NFR35: App must support standard platform accessibility features (screen readers, font scaling)
NFR36: UI elements must meet minimum touch target sizes (44x44 points iOS, 48x48 dp Android)
NFR37: Text must be readable with sufficient contrast ratios (WCAG AA minimum)
NFR38: App must support system-level accessibility settings (font size, bold text)
NFR39: Visual feedback must be supplemented with haptic feedback for accessibility
NFR40: Game state information must be accessible through screen readers
NFR41: Color coding must not be the sole means of conveying information
NFR42: Code must follow React Native and Expo best practices
NFR43: Code must be maintainable and well-documented for future updates
NFR44: App architecture must support future feature additions (Phase 2, Phase 3)
NFR45: App must function correctly on iOS 13.0+ devices
NFR46: App must function correctly on Android 6.0+ (API level 23+) devices
NFR47: App must provide consistent experience across supported platforms

### Additional Requirements

**Starter Template (Architecture):**
- Expo TypeScript Template with Expo Router should be used as the foundation (if not already initialized)
- This impacts Epic 1 Story 1: Project initialization using Expo CLI

**Infrastructure and Deployment (Architecture):**
- SQLite via expo-sqlite for local database persistence
- Database schema: `games`, `players`, `score_entries` tables
- Database service layer: `services/database.ts` for all SQLite operations
- Automatic migrations for schema changes
- Transaction support for data integrity
- Error handling and recovery mechanisms

**State Management (Architecture):**
- React Context + useReducer for game state management
- Game context: `contexts/GameContext.tsx` with game state
- Reducer: `reducers/gameReducer.ts` for state updates
- Actions: Type-safe action creators for state mutations
- Provider: Wrap app with GameProvider for state access

**Component Architecture (Architecture):**
- Hybrid approach: UI components (`components/ui/`) + Feature-based organization (`components/game/`)
- Screen-level components in `screens/` or `app/` directory
- Clear separation between reusable UI and game-specific logic

**Rule Enforcement Logic (Architecture):**
- Service/Utility Functions: `services/gameRules.ts`
- Pure functions: `checkPenaltyRule()`, `checkElimination()`, `checkWinCondition()`, `calculateScore()`
- Comprehensive unit tests for 100% accuracy requirement

**Haptic Feedback Integration (Architecture):**
- Haptic Service/Utility: `services/haptics.ts`
- Functions: `triggerScoreEntry()`, `triggerPenalty()`, `triggerCompletion()`, `triggerError()`
- Haptic types: Light impact (score entry), Medium impact (penalty), Success pattern (completion), Error (invalid actions)
- < 50ms trigger time requirement

**Naming Conventions (Architecture):**
- Database: snake_case for tables and columns (e.g., `games`, `players`, `score_entries`, `player_id`, `current_score`)
- Code: camelCase for functions/variables, PascalCase for components/types
- Tests: `__tests__` folders at same level as source files

**Styling System (Architecture & UX):**
- NativeWind (Tailwind CSS) for styling
- Custom theme values for large touch targets (44x44 points iOS, 48x48 dp Android)
- High contrast color palette (WCAG AA minimum)
- Family-friendly typography scale
- Spacing system optimized for mobile touch interactions

**Responsive Design (UX):**
- Portrait mode primary (landscape optional for future)
- Single-column layout for simplicity
- Generous white space for age-inclusive design
- Large touch targets (44x44 points iOS, 48x48 dp Android)

**Accessibility Requirements (UX):**
- Screen reader support with semantic labels
- Minimum touch target sizes (44x44 points iOS, 48x48 dp Android)
- WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- System font scaling support (Dynamic Type iOS, font scaling Android)
- Color coding supplemented with icons, text labels, and other indicators
- Haptic feedback supplements visual feedback for accessibility
- Animation and transitions respect reduced motion preferences

**Browser/Device Compatibility (UX):**
- iOS 13.0+ support
- Android 6.0+ (API level 23+) support
- Cross-platform consistency required
- System fonts (San Francisco iOS, Roboto Android)

**User Interaction Patterns (UX):**
- Large touch targets for age-inclusive design (ages 6+)
- Instant visual feedback for all user actions
- Haptic feedback for rule enforcement and score entry confirmation
- Clear visual hierarchy showing game state and leader position
- Minimal cognitive load with simple navigation patterns

**Animation/Transition Requirements (UX):**
- Smooth UI transitions (< 200ms)
- Visual feedback for rule enforcement (animations, notifications)
- Score update animations for instant feedback
- Respect reduced motion preferences for accessibility

**Error Handling UX Requirements (UX):**
- Clear error messages for invalid inputs
- Error haptic feedback for invalid actions
- Graceful handling of edge cases (zero blocks, negative values, etc.)
- Visual indicators for error states

### FR Coverage Map

FR1: Epic 2 - Start new game from main screen
FR2: Epic 2 - Add minimum 2 players to game
FR3: Epic 2 - Add additional players beyond minimum
FR4: Epic 2 - View current game state with all players and scores
FR5: Epic 2 - Resume interrupted game
FR6: Epic 2 - See which game is currently active
FR7: Epic 2 - Distinguish between active and completed games
FR8: Epic 3 - Enter score for specific player during turn
FR9: Epic 3 - Enter score when single block knocked over (block number)
FR10: Epic 3 - Enter score when multiple blocks knocked over (count)
FR11: Epic 3 - Display current scores for all players simultaneously
FR12: Epic 3 - Identify and display current leader
FR13: Epic 3 - Update scores in real-time when new scores entered
FR14: Epic 3 - See score history for current game
FR15: Epic 3 - Track consecutive misses for each player
FR16: Epic 4 - Automatically detect when player score exceeds 50 points
FR17: Epic 4 - Automatically reset score to 25 when exceeding 50 (penalty rule)
FR18: Epic 4 - Track when player misses all target pins (consecutive miss)
FR19: Epic 4 - Automatically eliminate player after 3 consecutive misses
FR20: Epic 4 - Prevent eliminated players from receiving further scores
FR21: Epic 4 - Detect when player reaches exactly 50 points (win condition)
FR22: Epic 4 - Prevent scores exceeding 50 without triggering penalty
FR23: Epic 3 - Enforce correct scoring logic (single = number, multiple = count)
FR24: Epic 1 - Save current game state automatically
FR25: Epic 1 - Restore saved game state when app restarted
FR26: Epic 1 - Persist active games (games in progress)
FR27: Epic 1 - Persist completed games (games that have ended)
FR28: Epic 1 - Maintain game data across app restarts without data loss
FR29: Epic 1 - Store game metadata (start time, date, players, final scores)
FR30: Epic 1 - Operate fully offline without network connectivity
FR31: Epic 2 - View main game screen showing all players and current scores
FR32: Epic 3 - Access score entry interface to add scores for players
FR33: Epic 4 - Provide visual feedback when rules are enforced
FR34: Epic 3 - Provide haptic feedback when scores are entered
FR35: Epic 4 - Provide haptic feedback when 50+ penalty rule triggered
FR36: Epic 5 - Provide haptic feedback when game is completed
FR37: Epic 6 - Provide haptic feedback for error states
FR38: Epic 3 - See which player is currently leading the game
FR39: Epic 6 - See which players have been eliminated (if any)
FR40: Epic 2 - Display game status information (active, completed, paused)
FR41: Epic 5 - Detect when player reaches exactly 50 points (winning condition)
FR42: Epic 5 - Display winner announcement when game is completed
FR43: Epic 5 - Show final scores for all players when game ends
FR44: Epic 5 - Mark game as completed when winner is determined
FR45: Epic 5 - Prevent further score entries after game is completed
FR46: Epic 5 - View completed game results after game ends
FR47: Epic 1 - Function on iOS devices (iOS 13.0+)
FR48: Epic 1 - Function on Android devices (Android 6.0+)
FR49: Epic 1 - Provide consistent experience across iOS and Android platforms
FR50: Epic 6 - Comply with App Store review guidelines
FR51: Epic 6 - Comply with Google Play Store developer policies
FR52: Epic 6 - Display required privacy policy information
FR53: Epic 1 - Handle app lifecycle events (backgrounding, foregrounding, termination)
FR54: Epic 6 - Handle invalid score entries gracefully
FR55: Epic 6 - Prevent rapid duplicate score entries that could cause errors
FR56: Epic 6 - Handle edge cases in score calculation (zero blocks, negative values, etc.)
FR57: Epic 1 - Recover from data corruption scenarios
FR58: Epic 1 - Handle app crashes without losing game state (data persistence)

## Epic List

### Epic 1: Project Foundation and Infrastructure

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

### Epic 2: Start and Manage Games

Users can start new games, add players (minimum 2, no maximum), view current game state, and resume interrupted games. Users can distinguish between active and completed games.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR31, FR40

**Implementation Notes:**
- Game creation flow with player management
- Main game screen showing all players and scores
- Resume functionality for interrupted games
- Game status tracking (active, completed, paused)
- Enables users to begin playing and manage game sessions

### Epic 3: Enter and Track Scores

Users can enter scores (single block = block number, multiple blocks = count) and see real-time score updates with clear leader indication. Users can view score history for the current game.

**FRs covered:** FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR23, FR32, FR34, FR38

**Implementation Notes:**
- Score entry interface with clear distinction between single vs multiple blocks
- Real-time score calculation and display
- Leader identification and highlighting
- Score history tracking
- Consecutive miss tracking (foundation for elimination rule)
- Haptic feedback for score entry
- Core gameplay interaction that enables rule enforcement

### Epic 4: Automatic Rule Enforcement

Game rules enforce automatically (50+ penalty, elimination, win detection) with clear visual and haptic feedback, eliminating manual calculations. This is the product differentiator.

**FRs covered:** FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR33, FR35

**Implementation Notes:**
- Automatic 50+ penalty detection and score reset to 25
- Automatic elimination after 3 consecutive misses
- Win condition detection (exactly 50 points)
- Visual feedback for rule enforcement (animations, indicators)
- Haptic feedback for rule triggers (strong haptic for penalties)
- Prevents scores exceeding 50 without triggering penalty
- Product differentiator that builds user trust

### Epic 5: Complete Games with Winner Celebration

Users can complete games with automatic win detection, winner announcement, and final score display. Users experience satisfying game conclusion with celebration.

**FRs covered:** FR41, FR42, FR43, FR44, FR45, FR46, FR36

**Implementation Notes:**
- Win condition detection (exactly 50 points)
- Winner announcement screen with celebration
- Final scores display for all players
- Game completion marking and state transition
- Prevent further score entries after completion
- Haptic feedback for game completion (success pattern)
- Satisfying conclusion to game experience

### Epic 6: Platform Support, Error Handling, and Polish

The app works reliably across iOS and Android, handles errors gracefully, and meets accessibility and store requirements. The app is production-ready for store submission.

**FRs covered:** FR50, FR51, FR52, FR54, FR55, FR56, FR37, FR39

**Implementation Notes:**
- App Store and Play Store compliance
- Privacy policy display and accessibility
- Error handling for invalid inputs and edge cases
- Rapid entry prevention
- Edge case handling (zero blocks, negative values, etc.)
- Haptic feedback for error states
- Eliminated player visibility
- Cross-platform testing and polish
- Production readiness and store submission preparation

---

## Epic 1: Project Foundation and Infrastructure

Users have a working app foundation with database, state management, and core services ready for all game features. The app can persist game data reliably, restore game state on app restart, and function across iOS and Android platforms.

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

---

## Epic 2: Start and Manage Games

Users can start new games, add players (minimum 2, no maximum), view current game state, and resume interrupted games. Users can distinguish between active and completed games.

### Story 2.1: Create New Game Flow

As a user,
I want to start a new game from the main screen,
So that I can begin playing Battle Blocks with my friends and family.

**Acceptance Criteria:**

**Given** I am on the main/home screen
**When** I tap the "Start New Game" button
**Then** I am navigated to the new game setup screen
**And** the app creates a new game record in the database with status "active"
**And** the game is automatically saved to the database
**And** I can see a form or interface to add players
**And** the game state is initialized in the GameContext
**And** the UI provides clear visual feedback that a new game is being created

**FRs covered:** FR1, FR24, FR26

---

### Story 2.2: Add Players to Game

As a user,
I want to add players to a game (minimum 2, no maximum),
So that all participants can be tracked in the game.

**Acceptance Criteria:**

**Given** I am on the new game setup screen (Story 2.1)
**When** I enter a player name and tap "Add Player"
**Then** the player is added to the game with:
- Initial score of 0
- consecutive_misses set to 0
- is_eliminated set to false
**And** the player is saved to the database with the game_id
**And** the player appears in the player list on screen
**And** I can add additional players (no maximum limit)
**And** the "Start Game" button is enabled only when at least 2 players are added (FR2)
**And** if I try to start with less than 2 players, I see a clear error message
**And** player names are validated (not empty, reasonable length)
**And** the UI provides visual feedback when a player is added

**FRs covered:** FR2, FR3, FR24, FR26

---

### Story 2.3: Display Main Game Screen

As a user,
I want to view the main game screen showing all players and their current scores,
So that I can see the current game state at a glance.

**Acceptance Criteria:**

**Given** I have started a game with players (Stories 2.1, 2.2)
**When** I view the main game screen
**Then** I can see:
- All players in the game with their names
- Current score for each player (displayed prominently)
- Visual indication of which player is currently leading (if applicable)
- Game status indicator (active, paused, completed)
**And** scores are displayed in real-time as they are updated
**And** the layout is clear and easy to scan (large, readable scores)
**And** the screen follows the design system (NativeWind, proper spacing, touch targets)
**And** the screen is accessible (screen reader support, proper contrast)
**And** UI transitions are smooth (< 200ms per NFR2)

**FRs covered:** FR4, FR11, FR31, FR38, FR40, NFR2, NFR35, NFR36, NFR37

---

### Story 2.4: Resume Interrupted Game

As a user,
I want to resume a previously saved game that was interrupted,
So that I can continue playing from where we left off.

**Acceptance Criteria:**

**Given** I have an active game that was previously saved
**When** I open the app
**Then** I see an option to "Continue Game" or "Resume Game" on the main screen
**And** when I tap the resume option
**Then** the game state is restored from the database:
- All players with their current scores
- Game status (active)
- All score entries history
- Game metadata (start time, date)
**And** I am taken to the main game screen with the restored game state
**And** game state restoration completes within 500ms (NFR4)
**And** if multiple active games exist, I can see a list to choose from
**And** the UI clearly indicates which game I am resuming
**And** if no active games exist, the resume option is not shown

**FRs covered:** FR5, FR6, FR25, FR28, FR29, NFR4

---

### Story 2.5: Game Status Management

As a user,
I want the system to distinguish between active and completed games,
So that I can see which games are still in progress and which are finished.

**Acceptance Criteria:**

**Given** games can be in different states (active, completed, paused)
**When** I view game lists or game details
**Then** the system correctly identifies:
- Active games (status = "active") - games currently in progress
- Completed games (status = "completed") - games that have ended with a winner
- Paused games (status = "paused") - games that were interrupted
**And** active games can be resumed (Story 2.4)
**And** completed games cannot be modified or resumed
**And** the game status is displayed clearly in the UI
**And** the database correctly stores and retrieves game status
**And** game status transitions are handled correctly (active → completed when winner is determined)

**FRs covered:** FR7, FR40, FR44

---

## Epic 3: Enter and Track Scores

Users can enter scores (single block = block number, multiple blocks = count) and see real-time score updates with clear leader indication. Users can view score history for the current game.

### Story 3.1: Score Entry Interface

As a user,
I want to access a score entry interface to add scores for players,
So that I can record scores during gameplay.

**Acceptance Criteria:**

**Given** I am on the main game screen with an active game
**When** I tap on a player's name or card
**Then** a score entry interface appears
**And** the interface clearly shows:
- The player's name
- Current score
- Options to enter single block or multiple blocks
**And** the interface has large touch targets (44x44 points iOS, 48x48 dp Android)
**And** the interface is accessible (screen reader support, proper labels)
**And** UI transitions appear smoothly (< 200ms per NFR2)
**And** the interface follows the design system (NativeWind styling)

**FRs covered:** FR32, NFR2, NFR35, NFR36, NFR37

---

### Story 3.2: Enter Single Block Score

As a user,
I want to enter a score when a single block is knocked over,
So that the score equals the block number (e.g., block 12 = 12 points).

**Acceptance Criteria:**

**Given** I am on the score entry interface for a player (Story 3.1)
**When** I select "Single Block" and enter a block number (e.g., 12)
**Then** the score is calculated as the block number (12 points)
**And** the score is added to the player's current total
**And** the score entry is saved to the database with entry_type = "single_block"
**And** the score update appears instantly (< 100ms per NFR1)
**And** haptic feedback is triggered (light impact per Story 1.5)
**And** the main game screen updates to show the new score
**And** the score entry interface closes and returns to main game screen
**And** invalid inputs (negative, zero, non-numeric) are handled with clear error messages

**FRs covered:** FR8, FR9, FR13, FR23, FR34, NFR1, NFR7

---

### Story 3.3: Enter Multiple Blocks Score

As a user,
I want to enter a score when multiple blocks are knocked over,
So that the score equals the count of blocks (e.g., 3 blocks = 3 points).

**Acceptance Criteria:**

**Given** I am on the score entry interface for a player (Story 3.1)
**When** I select "Multiple Blocks" and enter the count of blocks (e.g., 3)
**Then** the score is calculated as the count (3 points)
**And** the score is added to the player's current total
**And** the score entry is saved to the database with entry_type = "multiple_blocks"
**And** the score update appears instantly (< 100ms per NFR1)
**And** haptic feedback is triggered (light impact per Story 1.5)
**And** the main game screen updates to show the new score
**And** the score entry interface closes and returns to main game screen
**And** invalid inputs (negative, zero, non-numeric) are handled with clear error messages
**And** the distinction between single block (number) vs multiple blocks (count) is clear in the UI

**FRs covered:** FR8, FR10, FR13, FR23, FR34, NFR1, NFR7

---

### Story 3.4: Real-Time Score Display

As a user,
I want to see current scores for all players update in real-time,
So that I always know the current game state.

**Acceptance Criteria:**

**Given** I am viewing the main game screen
**When** a score is entered for any player (Stories 3.2, 3.3)
**Then** all players' scores are displayed simultaneously
**And** score updates appear instantly (< 100ms per NFR1)
**And** the display updates in real-time without page refresh
**And** scores are displayed prominently with large, readable numbers
**And** the UI feels responsive with no lag or freezing (NFR6)
**And** score calculations are mathematically correct (NFR23)
**And** the display follows the design system (proper typography, spacing, contrast)

**FRs covered:** FR11, FR13, NFR1, NFR6, NFR23

---

### Story 3.5: Leader Identification

As a user,
I want to see which player is currently leading the game,
So that I know who is winning at any moment.

**Acceptance Criteria:**

**Given** I am viewing the main game screen with multiple players
**When** scores are updated (Story 3.4)
**Then** the system automatically identifies the player with the highest score
**And** the leader is visually highlighted (e.g., blue accent, border, or background)
**And** the leader indication updates automatically when scores change
**And** if multiple players are tied for the lead, all tied players are indicated
**And** the leader indication is accessible (screen reader announces leader, not just color)
**And** the visual hierarchy makes the leader clear and prominent
**And** leader identification happens in real-time without perceptible delay

**FRs covered:** FR12, FR38, NFR40, NFR41

---

### Story 3.6: Score History Display

As a user,
I want to see the score history for the current game,
So that I can review past score entries.

**Acceptance Criteria:**

**Given** I am viewing the main game screen
**When** I access the score history (via button, swipe, or menu)
**Then** I can see a list of all score entries for the current game:
- Player name
- Score value
- Entry type (single block or multiple blocks)
- Timestamp or round number
**And** entries are displayed in chronological order (most recent first or last)
**And** the history is scrollable if there are many entries
**And** the display is clear and easy to read
**And** the history is retrieved from the database efficiently
**And** the UI follows the design system

**FRs covered:** FR14

---

### Story 3.7: Consecutive Miss Tracking

As a user,
I want the system to track consecutive misses for each player,
So that elimination rules can be enforced automatically (foundation for Epic 4).

**Acceptance Criteria:**

**Given** a player misses all target pins (enters score of 0)
**When** the score entry is processed
**Then** the player's consecutive_misses counter is incremented
**And** the consecutive_misses value is stored in the database
**And** the consecutive_misses value is tracked in the game state
**And** if a player scores points (non-zero), their consecutive_misses is reset to 0
**And** the tracking happens automatically without user intervention
**And** the data is available for the elimination rule logic (Epic 4, Story 4.2)

**FRs covered:** FR15, FR18

---

## Epic 4: Automatic Rule Enforcement

Game rules enforce automatically (50+ penalty, elimination, win detection) with clear visual and haptic feedback, eliminating manual calculations. This is the product differentiator.

### Story 4.1: Automatic 50+ Penalty Rule Enforcement

As a user,
I want the 50+ penalty rule to enforce automatically when my score exceeds 50,
So that I don't need to manually calculate or remember the penalty.

**Acceptance Criteria:**

**Given** a player's score is being updated (Stories 3.2, 3.3)
**When** the new score would exceed 50 points
**Then** the system automatically detects this using checkPenaltyRule() (Story 1.4)
**And** the player's score is automatically reset to 25
**And** the score reset is saved to the database
**And** clear visual feedback is provided:
- Score animation showing the reset (e.g., 52 → 25)
- Visual indicator (e.g., orange color, icon, or notification)
- Clear message explaining what happened ("Score exceeded 50, reset to 25")
**And** strong haptic feedback is triggered (triggerPenalty() from Story 1.5)
**And** the visual feedback appears immediately when the rule triggers (NFR8)
**And** the penalty enforcement is 100% accurate (NFR22, NFR24)
**And** the rule enforcement happens in real-time without perceptible delay (NFR5)
**And** all players can see the penalty was applied on the main game screen

**FRs covered:** FR16, FR17, FR33, FR35, NFR5, NFR8, NFR22, NFR24

---

### Story 4.2: Automatic Player Elimination

As a user,
I want players to be automatically eliminated after 3 consecutive misses,
So that elimination rules are enforced without manual tracking.

**Acceptance Criteria:**

**Given** a player has consecutive misses tracked (Story 3.7)
**When** the player's consecutive_misses reaches 3
**Then** the system automatically detects this using checkElimination() (Story 1.4)
**And** the player is marked as eliminated (is_eliminated = true in database)
**And** the player's status is updated in the game state
**And** clear visual feedback is provided:
- Player's name/card is grayed out or marked visually
- Visual indicator shows the player is eliminated
- Clear message explaining elimination ("Player eliminated after 3 consecutive misses")
**And** haptic feedback is triggered (appropriate pattern for elimination)
**And** eliminated players cannot receive further scores (FR20)
**And** the elimination is 100% accurate (NFR22, NFR24)
**And** the rule enforcement happens in real-time without perceptible delay (NFR5)
**And** all players can see who has been eliminated on the main game screen

**FRs covered:** FR19, FR20, FR39, NFR5, NFR22, NFR24

---

### Story 4.3: Win Condition Detection

As a user,
I want the system to automatically detect when a player reaches exactly 50 points,
So that the game can end automatically when someone wins.

**Acceptance Criteria:**

**Given** a player's score is being updated (Stories 3.2, 3.3)
**When** the new score equals exactly 50 points
**Then** the system automatically detects this using checkWinCondition() (Story 1.4)
**And** the win condition is flagged in the game state
**And** the system prevents scores that would exceed 50 without triggering penalty (FR22)
**And** the win detection is 100% accurate (NFR22, NFR24)
**And** the detection happens in real-time without perceptible delay (NFR5)
**And** the win condition triggers the game completion flow (Epic 5, Story 5.1)
**And** if a score would exceed 50, the penalty rule (Story 4.1) applies instead

**FRs covered:** FR21, FR22, FR41, NFR5, NFR22, NFR24

---

### Story 4.4: Visual Feedback for Rule Enforcement

As a user,
I want to see clear visual feedback when rules are enforced,
So that I understand what happened and trust the automatic enforcement.

**Acceptance Criteria:**

**Given** a rule is being enforced (Stories 4.1, 4.2, 4.3)
**When** the rule triggers
**Then** visual feedback appears immediately (NFR8):
- For 50+ penalty: Score animation, orange indicator, clear message
- For elimination: Grayed out player, elimination indicator, clear message
- For win condition: Celebration indicator (triggers Epic 5)
**And** visual feedback is accessible (not just color - includes icons, text, patterns)
**And** animations respect reduced motion preferences (accessibility)
**And** the feedback is clear and understandable for ages 6+
**And** the feedback appears on the main game screen so all players can see it
**And** the visual feedback follows the design system (colors, typography, spacing)

**FRs covered:** FR33, NFR8, NFR39, NFR41

---

## Epic 5: Complete Games with Winner Celebration

Users can complete games with automatic win detection, winner announcement, and final score display. Users experience satisfying game conclusion with celebration.

### Story 5.1: Winner Announcement Screen

As a user,
I want to see a winner announcement when a player reaches exactly 50 points,
So that I know the game is complete and who won.

**Acceptance Criteria:**

**Given** a player reaches exactly 50 points (Story 4.3)
**When** the win condition is detected
**Then** the winner announcement screen is displayed:
- Large, prominent display of the winner's name
- "Winner!" or "Game Over!" message
- Celebration visual elements (e.g., confetti, success colors)
**And** the screen appears automatically without user action
**And** success haptic feedback is triggered (triggerCompletion() from Story 1.5)
**And** the game status is marked as "completed" in the database
**And** the game is saved as a completed game (FR27, FR44)
**And** the UI transition is smooth (< 200ms per NFR2)
**And** the celebration is accessible (screen reader announces winner)

**FRs covered:** FR41, FR42, FR44, FR36, NFR2, NFR40

---

### Story 5.2: Final Scores Display

As a user,
I want to see final scores for all players when a game ends,
So that I can see the complete game results.

**Acceptance Criteria:**

**Given** a game has been completed (Story 5.1)
**When** I view the winner announcement screen
**Then** I can see final scores for all players:
- All players listed with their final scores
- Scores displayed clearly and prominently
- Winner highlighted or shown first
**And** the final scores are accurate and match the last game state
**And** the display is clear and easy to read
**And** the scores are saved to the database as game metadata (FR29)
**And** the UI follows the design system

**FRs covered:** FR43, FR29

---

### Story 5.3: Prevent Further Score Entries After Completion

As a user,
I want the system to prevent score entries after a game is completed,
So that completed games cannot be modified.

**Acceptance Criteria:**

**Given** a game has been completed (Story 5.1)
**When** I try to enter a score for any player
**Then** the score entry interface is disabled or not accessible
**And** if I somehow attempt to enter a score, the system prevents it
**And** a clear message indicates the game is completed
**And** the game status remains "completed" in the database
**And** completed games cannot be resumed or modified

**FRs covered:** FR45

---

### Story 5.4: View Completed Game Results

As a user,
I want to view completed game results after the game ends,
So that I can review the final game state.

**Acceptance Criteria:**

**Given** a game has been completed (Story 5.1)
**When** I view the completed game (from winner screen or game history)
**Then** I can see:
- Winner name and final score
- All players and their final scores
- Game metadata (date, time, duration if tracked)
- Game status (completed)
**And** the information is displayed clearly
**And** the completed game is stored permanently in the database (NFR14)
**And** the UI follows the design system
**And** I can navigate back to start a new game

**FRs covered:** FR46, NFR14

---

## Epic 6: Platform Support, Error Handling, and Polish

The app works reliably across iOS and Android, handles errors gracefully, and meets accessibility and store requirements. The app is production-ready for store submission.

### Story 6.1: Handle Invalid Score Entries

As a user,
I want invalid score entries to be handled gracefully with clear error messages,
So that I understand what went wrong and can correct my input.

**Acceptance Criteria:**

**Given** I am entering a score (Stories 3.2, 3.3)
**When** I enter an invalid value (negative, zero, non-numeric, too large)
**Then** the system prevents the invalid entry
**And** a clear error message is displayed explaining what's wrong
**And** error haptic feedback is triggered (triggerError() from Story 1.5)
**And** the error message is accessible (screen reader announces it)
**And** I can correct my input and try again
**And** the app does not crash or lose game state (NFR16, NFR19)
**And** edge cases are handled (zero blocks, negative values, etc.)

**FRs covered:** FR54, FR56, FR37, NFR16, NFR19

---

### Story 6.2: Prevent Rapid Duplicate Score Entries

As a user,
I want the system to prevent rapid duplicate score entries,
So that accidental double-taps don't cause errors or incorrect scores.

**Acceptance Criteria:**

**Given** I am entering a score (Stories 3.2, 3.3)
**When** I rapidly tap the submit button multiple times
**Then** the system prevents duplicate entries from being processed
**And** only one score entry is recorded
**And** the system handles rapid inputs gracefully without errors
**And** the app does not crash or lose game state (NFR16, NFR20)
**And** the UI provides feedback that the entry is being processed
**And** concurrent operations don't cause data corruption (NFR20)

**FRs covered:** FR55, NFR16, NFR20

---

### Story 6.3: Handle Edge Cases in Score Calculation

As a user,
I want the system to handle edge cases gracefully,
So that unusual inputs don't break the game or cause errors.

**Acceptance Criteria:**

**Given** edge cases occur (zero blocks, negative values, very large numbers, etc.)
**When** the system processes these inputs
**Then** edge cases are handled gracefully:
- Zero blocks: Handled as a miss (consecutive miss tracking)
- Negative values: Rejected with clear error message
- Very large numbers: Validated and rejected if unreasonable
- Non-numeric inputs: Rejected with clear error message
**And** the app does not crash (NFR16)
**And** game state remains intact
**And** clear error messages guide the user
**And** the system recovers gracefully from edge cases

**FRs covered:** FR56, NFR16

---

### Story 6.4: Display Eliminated Players

As a user,
I want to see which players have been eliminated,
So that I know who is still in the game.

**Acceptance Criteria:**

**Given** players have been eliminated (Story 4.2)
**When** I view the main game screen
**Then** eliminated players are clearly visible:
- Player names/cards are visually distinct (grayed out, reduced opacity, or marked)
- Clear indication that they are eliminated
- Eliminated players are still visible but not interactive for score entry
**And** the indication is accessible (screen reader announces elimination status)
**And** color coding is supplemented with other indicators (icons, text) for accessibility
**And** the visual design follows the design system

**FRs covered:** FR39, NFR41

---

### Story 6.5: App Store and Play Store Compliance

As a developer,
I want the app to comply with App Store and Play Store requirements,
So that the app can be submitted and published to app stores.

**Acceptance Criteria:**

**Given** the app is ready for store submission
**When** I review store requirements
**Then** the app meets:
- App Store Review Guidelines (iOS)
- Google Play Developer Policy (Android)
- Required privacy disclosures
- Age/content rating requirements
- App icons and screenshots prepared
**And** privacy policy is accessible within the app (FR52)
**And** the app includes required privacy disclosures
**And** store listing materials are prepared
**And** the app is tested for store compliance

**FRs covered:** FR50, FR51, FR52, NFR28, NFR29, NFR30, NFR32, NFR33, NFR34

---

### Story 6.6: Accessibility Features Implementation

As a user with accessibility needs,
I want the app to support standard platform accessibility features,
So that I can use the app effectively regardless of my abilities.

**Acceptance Criteria:**

**Given** I am using the app with accessibility features enabled
**When** I interact with the app
**Then** the app supports:
- Screen readers with semantic labels for all interactive elements
- System font scaling (Dynamic Type iOS, font scaling Android)
- High contrast mode (WCAG AA minimum contrast ratios)
- Large touch targets (44x44 points iOS, 48x48 dp Android)
- Haptic feedback supplements visual feedback
- Color coding supplemented with icons, text, and patterns
- Reduced motion preferences respected for animations
**And** all game state information is accessible through screen readers
**And** the app follows platform accessibility guidelines

**FRs covered:** NFR35, NFR36, NFR37, NFR38, NFR39, NFR40, NFR41
