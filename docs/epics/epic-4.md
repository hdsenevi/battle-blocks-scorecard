---
epicNumber: 4
epicTitle: Automatic Rule Enforcement
status: ready
---

## Epic 4: Automatic Rule Enforcement

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
**And** automation tests are created:
- Unit tests verify 50+ penalty rule detection (checkPenaltyRule)
- Unit tests verify score reset to 25 when penalty triggered
- Component tests verify visual feedback for penalty (animations, indicators)
- Integration tests verify penalty rule enforcement end-to-end
- E2E test flow verifies 50+ penalty rule enforcement

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
**And** automation tests are created:
- Unit tests verify elimination rule detection (checkElimination at 3 misses)
- Unit tests verify player marked as eliminated in database
- Component tests verify visual feedback for elimination (grayed out, indicators)
- Component tests verify eliminated players cannot receive scores
- Integration tests verify elimination rule enforcement end-to-end
- E2E test flow verifies automatic player elimination

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
**And** automation tests are created:
- Unit tests verify win condition detection (checkWinCondition at exactly 50)
- Unit tests verify scores exceeding 50 trigger penalty instead of win
- Integration tests verify win condition triggers game completion flow
- E2E test flow verifies win condition detection

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
**And** automation tests are created:
- Component tests verify visual feedback for each rule type (penalty, elimination, win)
- Component tests verify accessibility of visual feedback (not just color)
- Component tests verify animations respect reduced motion preferences
- E2E test flow verifies visual feedback for rule enforcement

**FRs covered:** FR33, NFR8, NFR39, NFR41
