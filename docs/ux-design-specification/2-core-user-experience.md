# 2. Core User Experience

## 2.1 Defining Experience

The defining experience for Battle Blocks Scorecard is: **"Enter a score and watch the app automatically enforce game rules - no manual calculations needed."**

The core interaction that users will describe to their friends is the automatic rule enforcement. When a player's score exceeds 50 points, the app automatically resets it to 25 with clear visual and haptic feedback. When a player misses three times in a row, they're automatically eliminated. Users don't need to remember rules or do math - the app handles everything.

If we get ONE thing perfectly right, it should be the **score entry → instant update → automatic rule enforcement loop**. If this interaction is fast, clear, and trustworthy, the entire app succeeds. Users should be able to complete a full game entirely in-app without ever needing paper or manual calculations.

## 2.2 User Mental Model

**Current Solution:**
Users currently solve scorekeeping with paper-based tracking, manual calculations, and mental tracking of game rules. They write down scores, calculate totals, remember when penalties apply, and track eliminations manually.

**Mental Model Users Bring:**
- Expect to enter scores manually (like writing on paper)
- Expect to calculate penalties themselves (like using a calculator)
- Expect to track game state mentally (like watching a scoreboard)
- Familiar with simple score entry patterns from other apps

**Expectations:**
- Simple score entry interface (like calculator or form input)
- Automatic calculations (like a calculator doing math)
- Clear visibility of game state (like a scoreboard showing all players)

**Confusion/Frustration Points:**
- Unclear distinction between single block (enter number) vs multiple blocks (enter count)
- Not understanding when rules trigger automatically
- Uncertainty about whether scores are saved reliably
- Slow or delayed feedback that breaks trust

**What Users Love/Hate About Existing Approaches:**
- **Love**: Simple, visual, immediate feedback
- **Hate**: Manual calculations, paper gets lost or damaged, calculation errors, distraction from gameplay

## 2.3 Success Criteria

**What Makes Users Say 'This Just Works':**
- Score entry is instant and clear with zero ambiguity
- Rules enforce automatically without user intervention or calculation
- Game state is always visible and accurate (< 2 seconds from opening app)

**When Users Feel Smart or Accomplished:**
- Completing a full game without needing paper or manual calculations
- Seeing automatic rule enforcement work correctly and transparently
- Resuming a saved game exactly where they left off, building trust in persistence

**Feedback That Tells Users They're Doing It Right:**
- Instant score updates (< 100ms response time)
- Clear visual and haptic feedback for rule enforcement
- Prominent leader indication that updates automatically
- Reliable game state persistence (no lost progress)

**Speed Requirements:**
- Score updates: < 100ms (instant, no perceptible delay)
- Game state visibility: < 2 seconds from opening app
- Rule enforcement: Real-time, no perceptible delay
- UI transitions: < 200ms for smooth feel

**What Happens Automatically:**
- Rule enforcement (50+ penalty, elimination tracking)
- Game state saving (no "save" button needed)
- Leader identification and highlighting
- Score calculations and updates

## 2.4 Novel UX Patterns

**Established Patterns We Use:**
- Score entry interface (familiar from calculator or form input patterns)
- Score display/leaderboard (familiar dashboard pattern)
- Large touch targets (standard mobile app pattern)
- Instant feedback (common in modern mobile apps)

**Novel Aspect:**
- **Automatic rule enforcement with transparent feedback**: Unlike manual scorekeeping apps, this app automatically enforces game rules and shows users exactly when and why rules trigger. This is the unique differentiator.

**What Makes This Different:**
- Automatic rule enforcement (users don't need to calculate penalties)
- Transparent feedback (users see rules trigger with clear visual/haptic indicators)
- Reliable persistence (games never lost, even across app restarts)

**How We Teach Users:**
- Visual indicators show rule enforcement happening (users see score reset from 52 to 25)
- Haptic feedback reinforces rule triggers (strong haptic for penalties)
- Clear messaging explains what happened ("Score exceeded 50, reset to 25")
- First-time experience guides users through core interaction

**Familiar Metaphors:**
- Scoreboard (shows all players and scores)
- Calculator (entering numbers for scores)
- Game controller (tapping to interact)

**Our Unique Twist:**
- Score entry that automatically enforces rules (no manual calculation needed)
- Visual feedback that shows rule enforcement happening (transparency builds trust)
- Automatic persistence that users can trust (no "save" button, always saved)

## 2.5 Experience Mechanics

**Core Interaction Flow: Score Entry → Instant Update → Automatic Rule Enforcement**

**1. Initiation:**
- User taps on a player's name/card on the main game screen
- Score entry interface appears immediately
- Clear visual distinction presented: single block (enter block number) vs multiple blocks (enter count of blocks)
- Large touch targets ensure easy interaction for ages 6+

**2. Interaction:**
- User enters score using number pad or input field
- System calculates and updates score instantly (< 100ms)
- System automatically checks game rules:
  - Does score exceed 50? → Apply penalty (reset to 25)
  - Does score reach exactly 50? → Trigger win condition
  - Are there 3 consecutive misses? → Eliminate player
- Visual and haptic feedback confirms action:
  - Normal score entry: Light haptic + instant visual update
  - Rule enforcement: Strong haptic + visual indicator + clear messaging
  - Game completion: Success haptic pattern + celebration screen

**3. Feedback:**
- Score updates immediately with visual confirmation
- If rule triggers: Clear visual indicator (e.g., score animation, color change) + strong haptic feedback
- Leader highlighting updates automatically to show current leader
- All players can see updates in real-time on main game screen
- Game state persists automatically in background

**4. Completion:**
- Score entry complete, interface returns to main game view
- Updated scores visible to all players instantly
- Game state saved automatically (no user action needed)
- Ready for next player's turn
- If game completed: Winner announcement screen with final scores

**Error Handling:**
- Invalid inputs: Clear error message + error haptic
- Rapid entries: System prevents duplicate entries that could cause errors
- Edge cases: Graceful handling of zero blocks, negative values, etc.
