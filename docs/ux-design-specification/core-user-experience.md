# Core User Experience

## Defining Experience

The core user experience centers on effortless score entry during active gameplay. The most frequent and critical action is entering scores quickly and accurately, with clear distinction between single block (number) vs multiple blocks (count). The primary interaction loop is: score entry → instant update → automatic rule enforcement → clear feedback. If this loop is fast, clear, and trustworthy, the entire app succeeds. Users should be able to complete a full game entirely in-app without ever needing paper or manual calculations.

## Platform Strategy

Cross-platform mobile app (iOS and Android) built with React Native/Expo, designed for fully offline operation. Primary interaction is touch-based on smartphones in portrait mode. The app leverages device capabilities including haptic feedback for rule enforcement and score entry confirmation, local storage for game state persistence, and platform-optimized UI components. The interface must accommodate users ages 6+ with large touch targets (44x44 points iOS, 48x48 dp Android) and simple navigation patterns.

## Effortless Interactions

**Completely Natural Actions:**
- Tapping a player's name to enter their score should feel immediate and intuitive
- Seeing scores update instantly without any loading or delay
- Understanding game state at a glance (who's winning, who's eliminated)

**Eliminated Friction:**
- No manual calculations or rule tracking (automatic enforcement)
- No "save" button required (automatic game state persistence)
- No confirmation dialogs for routine score entry actions
- No uncertainty about whether scores are saved (always persistent)

**Automatic Behaviors:**
- Rule enforcement (50+ penalty, elimination tracking) happens automatically with clear visual and haptic feedback
- Game state saves automatically without user intervention
- Leader identification and highlighting updates in real-time

## Critical Success Moments

**"This is Better" Moment:**
When the 50+ penalty rule triggers automatically and users see it happen with clear visual/haptic feedback, realizing they don't need to calculate or remember rules.

**User Success Moment:**
Completing a full game entirely in-app (no paper fallback needed), with all rules enforced automatically and game state reliably persisted.

**Make-or-Break User Flows:**
1. **Starting a new game**: First impression must be clean, simple, and immediately understandable
2. **Entering scores during active gameplay**: Must be fast, clear, and require minimal cognitive load
3. **Resuming a saved game**: Must restore exactly where they left off, building trust in data persistence

**First-Time User Success:**
Completing their first game without needing paper or manual calculations, experiencing automatic rule enforcement that "just works."

**Failure Points to Avoid:**
- Lost game data (app crash or restart loses progress) - would destroy trust
- Incorrect rule enforcement (wrong penalty or elimination) - would make app unreliable
- Slow or confusing score entry - would disrupt gameplay flow

## Experience Principles

1. **Instant Clarity**: Scores and game state must be visible in under 2 seconds with zero ambiguity about who's winning, who's eliminated, and current game status. The main screen provides immediate visual feedback on game state and leader position.

2. **Automatic Trust**: Rules enforce automatically with clear visual and haptic feedback. Users never doubt the system's accuracy. Rule enforcement (50+ penalty, elimination) happens transparently, building confidence that the app handles everything correctly.

3. **Effortless Entry**: Score entry is fast, clear, and requires minimal cognitive load. Large touch targets, clear distinction between single block (number) vs multiple blocks (count), and immediate visual confirmation make score entry feel natural and error-free.

4. **Reliable Persistence**: Game state always saves automatically. Users never worry about losing progress. Active games survive app restarts, completed games are preserved, and data integrity is guaranteed (100% reliability requirement).
