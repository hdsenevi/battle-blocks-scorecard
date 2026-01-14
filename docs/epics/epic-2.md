---
epicNumber: 2
epicTitle: Start and Manage Games
status: ready
---

## Epic 2: Start and Manage Games

Users can start new games, add players (minimum 2, no maximum), view current game state, and resume interrupted games. Users can distinguish between active and completed games.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR31, FR40

**Implementation Notes:**
- Game creation flow with player management
- Main game screen showing all players and scores
- Resume functionality for interrupted games
- Game status tracking (active, completed, paused)
- Enables users to begin playing and manage game sessions

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
