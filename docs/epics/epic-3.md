---
epicNumber: 3
epicTitle: Enter and Track Scores
status: ready
---

## Epic 3: Enter and Track Scores

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
