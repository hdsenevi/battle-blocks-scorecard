---
epicNumber: 5
epicTitle: Complete Games with Winner Celebration
status: ready
---

## Epic 5: Complete Games with Winner Celebration

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
**And** automation tests are created:
- Component tests verify winner announcement screen displays correctly
- Component tests verify game status marked as "completed" in database
- Component tests verify success haptic feedback triggered
- Component tests verify accessibility of winner announcement
- E2E test flow verifies winner announcement screen

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
**And** automation tests are created:
- Component tests verify final scores display for all players
- Component tests verify winner highlighted in final scores
- Integration tests verify final scores saved to database
- E2E test flow verifies final scores display

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
**And** automation tests are created:
- Component tests verify score entry disabled for completed games
- Unit tests verify game status prevents score entries
- Integration tests verify completed games cannot be modified
- E2E test flow verifies score entry prevention after completion

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
**And** automation tests are created:
- Component tests verify completed game results display
- Component tests verify game metadata displayed correctly
- Integration tests verify completed games stored permanently
- E2E test flow verifies viewing completed game results

**FRs covered:** FR46, NFR14
