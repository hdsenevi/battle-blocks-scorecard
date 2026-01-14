---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-core-experience', 'step-04-emotional-response', 'step-05-inspiration', 'step-06-design-system', 'step-07-defining-experience', 'step-08-visual-foundation']
inputDocuments: ['planning-artifacts/prd.md']
---

# UX Design Specification battle-blocks-scorecard

**Author:** Shanaka
**Date:** 2026-01-13T21:02:51Z

---

## Executive Summary

### Project Vision

Battle Blocks Scorecard is a mobile app that replaces paper-based scorekeeping for the Battle Blocks throwing game with automatic rule enforcement and reliable local data persistence. The app enables players to focus on gameplay rather than manual calculations, providing instant score visibility and automatic enforcement of game rules (50+ penalty, elimination tracking).

### Target Users

Players of Battle Blocks (ages 6+) who want a reliable, paperless way to track scores during games with friends and family. Users range from tech-savvy adults to children as young as 6, requiring an intuitive interface that works across varying levels of tech comfort. They use the app during active gameplay at social gatherings and family events, needing quick score entry between rounds and the ability to pause and resume games.

**User Problems:**
- Manual scorekeeping is tedious and error-prone
- Paper-based tracking requires remembering scores and doing math
- Risk of calculation errors, especially with the 50+ penalty rule
- Paper gets lost or damaged
- Manual calculations distract from gameplay
- Hard to track elimination rules (3 consecutive misses)

**Success Moments:**
- Automatic rule enforcement eliminates manual calculations
- Instant score visibility (< 2 seconds from opening app)
- Reliable data persistence (no lost games)
- Simple, fast interface that doesn't distract from gameplay

### Key Design Challenges

1. **Score Entry Speed and Clarity**: Fast, accurate score entry during active gameplay, supporting single block (number) vs multiple blocks (count) with clear distinction. Requires large touch targets, clear visual feedback, and minimal taps.

2. **Rule Enforcement Visibility**: Making automatic rule enforcement (50+ penalty, elimination) clear and trustworthy. Users need to see and understand when rules trigger through visual indicators, haptic feedback, and clear messaging.

3. **Age-Inclusive Design (6+)**: Interface must work for ages 6+ with varying tech comfort levels. Requires simple navigation, large touch targets (44x44 points iOS, 48x48 dp Android), clear visual hierarchy, intuitive patterns, minimal cognitive load, and clear feedback.

4. **Game State Persistence and Resume**: Users need confidence that games are saved and can be resumed. Requires clear indication of saved games, easy resume flow, prominent "Continue Game" option, and clear game status indicators.

5. **Real-Time Score Visibility**: All players need to see scores instantly (< 2 seconds). Main screen must show all players and current leader clearly with large, readable scores, clear leader indication, and instant updates.

### Design Opportunities

1. **Haptic Feedback for Rule Enforcement**: Strong haptic when 50+ penalty triggers, success pattern on game completion, creating trust in automatic enforcement. Light haptic for score entry confirmation, error haptic for invalid actions.

2. **Visual Hierarchy for Game State**: Leader highlighted prominently, eliminated players visually distinct, clear game status (active, paused, completed). Color coding supplemented with other indicators for accessibility.

3. **Minimal Cognitive Load**: Simple navigation with few screens, clear visual feedback for all actions, no hidden features or complex flows. Focus on core user journeys: starting a game, entering scores, viewing game state.

4. **Offline-First Reliability**: No loading states or network errors, instant local operations, confidence in data persistence. All operations feel immediate and reliable, reinforcing trust in the app.

## Core User Experience

### Defining Experience

The core user experience centers on effortless score entry during active gameplay. The most frequent and critical action is entering scores quickly and accurately, with clear distinction between single block (number) vs multiple blocks (count). The primary interaction loop is: score entry → instant update → automatic rule enforcement → clear feedback. If this loop is fast, clear, and trustworthy, the entire app succeeds. Users should be able to complete a full game entirely in-app without ever needing paper or manual calculations.

### Platform Strategy

Cross-platform mobile app (iOS and Android) built with React Native/Expo, designed for fully offline operation. Primary interaction is touch-based on smartphones in portrait mode. The app leverages device capabilities including haptic feedback for rule enforcement and score entry confirmation, local storage for game state persistence, and platform-optimized UI components. The interface must accommodate users ages 6+ with large touch targets (44x44 points iOS, 48x48 dp Android) and simple navigation patterns.

### Effortless Interactions

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

### Critical Success Moments

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

### Experience Principles

1. **Instant Clarity**: Scores and game state must be visible in under 2 seconds with zero ambiguity about who's winning, who's eliminated, and current game status. The main screen provides immediate visual feedback on game state and leader position.

2. **Automatic Trust**: Rules enforce automatically with clear visual and haptic feedback. Users never doubt the system's accuracy. Rule enforcement (50+ penalty, elimination) happens transparently, building confidence that the app handles everything correctly.

3. **Effortless Entry**: Score entry is fast, clear, and requires minimal cognitive load. Large touch targets, clear distinction between single block (number) vs multiple blocks (count), and immediate visual confirmation make score entry feel natural and error-free.

4. **Reliable Persistence**: Game state always saves automatically. Users never worry about losing progress. Active games survive app restarts, completed games are preserved, and data integrity is guaranteed (100% reliability requirement).

## Desired Emotional Response

### Primary Emotional Goals

Users should feel **confident and trusting** that the app handles scorekeeping reliably, allowing them to focus on gameplay without worry. The primary emotional goal is to create a sense of relief from manual calculations and paper tracking, enabling users to concentrate on the game itself rather than scorekeeping mechanics.

**Core Emotional States:**
- **Confident**: The app handles everything correctly, no need to double-check calculations
- **Relieved**: No manual calculations or paper tracking required
- **Focused**: Can concentrate on gameplay, not scorekeeping logistics
- **Trusting**: Automatic rule enforcement works accurately and transparently

### Emotional Journey Mapping

**First Discovery:**
Users should feel curious but confident - the interface appears simple and immediately understandable, reducing initial anxiety about learning a new tool.

**During Core Experience (Score Entry):**
Users should feel focused and in control - score entry is fast and clear, requiring minimal cognitive load. They experience trust as rules enforce automatically with transparent feedback.

**After Completing Task (Game Completion):**
Users should feel satisfied and accomplished - the game completed smoothly without needing paper or manual calculations. They experience delight when automatic rule enforcement works seamlessly.

**When Something Goes Wrong:**
Users should feel reassured - clear error messages and easy recovery paths maintain trust. They remain confident that data is safe and games can be resumed.

**Returning to Use Again:**
Users should feel confident and familiar - the app has proven reliable, data persists correctly, and the interface remains intuitive. They trust the system will work as expected.

### Micro-Emotions

**Critical Micro-Emotions:**
- **Confidence vs. Confusion**: Users must understand game state instantly with zero ambiguity about scores, leader position, and rule enforcement
- **Trust vs. Skepticism**: Automatic rule enforcement must be transparent and accurate, building trust that the system handles everything correctly
- **Satisfaction vs. Frustration**: Score entry must be smooth and fast, avoiding any friction that disrupts gameplay flow

**Important Supporting Emotions:**
- **Delight vs. Satisfaction**: Moments of delight when rules enforce automatically with clear visual/haptic feedback, creating "wow" moments
- **Accomplishment vs. Frustration**: Completing games without friction creates a sense of accomplishment and competence

**Emotions to Avoid:**
- Confusion from unclear game state or rule enforcement
- Skepticism about rule enforcement accuracy
- Frustration from slow entry, lost data, or errors
- Anxiety about losing game progress

### Design Implications

**Building Confidence and Trust:**
- Clear visual feedback for all actions (instant score updates, visible rule enforcement)
- Transparent automatic behaviors (users see rules trigger with clear visual/haptic feedback)
- Reliable data persistence (prominent "Continue Game" option, clear game status indicators)
- Error prevention and clear error recovery paths

**Creating Delight:**
- Automatic rule enforcement with satisfying visual/haptic feedback creates moments of delight
- Game completion celebration reinforces accomplishment
- Smooth, instant score updates feel magical and effortless

**Avoiding Negative Emotions:**
- Fast score entry prevents frustration (large touch targets, clear distinction between single/multiple blocks)
- Reliable data persistence eliminates anxiety (automatic saving, clear resume options)
- Clear visual hierarchy prevents confusion (instant game state visibility, prominent leader indication)
- Transparent rule enforcement prevents skepticism (users see rules trigger, understand what happened)

**Emotion-Design Connections:**
- **Confidence** → Instant clarity of game state, transparent rule enforcement, reliable persistence
- **Trust** → Accurate automatic behaviors, clear visual feedback, error prevention
- **Relief** → No manual calculations, automatic rule tracking, effortless score entry
- **Delight** → Satisfying haptic feedback, smooth animations, automatic rule enforcement moments

### Emotional Design Principles

1. **Transparency Builds Trust**: All automatic behaviors (rule enforcement, data saving) must be visible and understandable. Users should see what's happening and why.

2. **Instant Feedback Creates Confidence**: Immediate visual and haptic responses to user actions build confidence that the system is working correctly and responsively.

3. **Reliability Eliminates Anxiety**: Consistent, automatic data persistence and error-free operation eliminate worry about losing progress or making mistakes.

4. **Effortless Interactions Create Delight**: When score entry and rule enforcement feel completely natural and require zero thought, users experience delight in the seamless experience.

5. **Clear Communication Prevents Confusion**: Visual hierarchy, clear game state indicators, and transparent rule enforcement prevent confusion and build understanding.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

Proceeding with design decisions based on established UX principles and project requirements rather than detailed analysis of specific inspiring products. Design will focus on proven mobile app patterns for scorekeeping and game tracking applications.

### Transferable UX Patterns

**Navigation Patterns:**
- Simple, flat navigation structure suitable for ages 6+
- Clear primary action (Start New Game) prominently displayed
- Minimal screen hierarchy to reduce cognitive load

**Interaction Patterns:**
- Large touch targets (44x44 points iOS, 48x48 dp Android) for age-inclusive design
- Instant visual feedback for all user actions
- Haptic feedback for rule enforcement and score entry confirmation

**Visual Patterns:**
- Clear visual hierarchy showing game state and leader position
- High contrast for readability (WCAG AA minimum)
- Color coding supplemented with other indicators for accessibility

### Anti-Patterns to Avoid

- Complex navigation structures that confuse users
- Small touch targets that are difficult for younger users
- Hidden or unclear game state information
- Slow or delayed feedback that breaks user trust
- Overly complex score entry flows

### Design Inspiration Strategy

**What to Adopt:**
- Simple, flat navigation patterns from family-friendly mobile apps
- Large touch targets and clear visual feedback from age-inclusive design patterns
- Instant feedback patterns from real-time scorekeeping applications

**What to Adapt:**
- Score entry patterns adapted for Battle Blocks specific rules (single vs multiple blocks)
- Rule enforcement visibility patterns adapted for automatic enforcement requirements

**What to Avoid:**
- Complex multi-level navigation that doesn't fit the simple use case
- Small touch targets that exclude younger users
- Hidden features or unclear game state indicators

## Design System Foundation

### Design System Choice

**NativeWind (Tailwind CSS for React Native)**

NativeWind brings Tailwind CSS utility classes to React Native, providing a utility-first approach to styling that enables rapid development with consistent design patterns.

### Rationale for Selection

1. **Utility-First Approach**: Tailwind's utility classes enable fast, consistent styling without writing custom CSS, perfect for a solo developer learning project
2. **Rapid Development**: Pre-built utility classes speed up UI development while maintaining design consistency
3. **Customization**: Easy to customize colors, spacing, and typography to match family-friendly, age-inclusive design requirements
4. **React Native Compatible**: NativeWind is specifically designed for React Native/Expo projects
5. **Learning Value**: Demonstrates modern utility-first CSS approach while building production-ready mobile app
6. **Flexibility**: Can easily create custom components while leveraging Tailwind's design system

### Implementation Approach

- Use NativeWind v4+ for React Native/Expo compatibility
- Configure Tailwind config file with custom theme values for:
  - Large touch targets (minimum 44x44 points iOS, 48x48 dp Android)
  - High contrast color palette (WCAG AA minimum)
  - Family-friendly typography scale
  - Spacing system optimized for mobile touch interactions
- Leverage Tailwind utility classes for rapid UI development
- Create custom components as needed for Battle Blocks-specific interactions (score entry, rule enforcement indicators)

### Customization Strategy

**Design Tokens to Customize:**
- **Colors**: Custom palette for game state indicators (leader, eliminated players, active players)
- **Spacing**: Generous spacing for large touch targets and age-inclusive design
- **Typography**: Large, readable font sizes suitable for ages 6+
- **Border Radius**: Rounded corners for friendly, approachable feel
- **Shadows**: Subtle elevation for visual hierarchy

**Component Strategy:**
- Use Tailwind utilities for standard UI elements (buttons, cards, text)
- Create custom React Native components for game-specific features:
  - Player score cards
  - Score entry interface
  - Rule enforcement indicators
  - Game state displays
- Maintain Tailwind utility classes within custom components for consistency

## 2. Core User Experience

### 2.1 Defining Experience

The defining experience for Battle Blocks Scorecard is: **"Enter a score and watch the app automatically enforce game rules - no manual calculations needed."**

The core interaction that users will describe to their friends is the automatic rule enforcement. When a player's score exceeds 50 points, the app automatically resets it to 25 with clear visual and haptic feedback. When a player misses three times in a row, they're automatically eliminated. Users don't need to remember rules or do math - the app handles everything.

If we get ONE thing perfectly right, it should be the **score entry → instant update → automatic rule enforcement loop**. If this interaction is fast, clear, and trustworthy, the entire app succeeds. Users should be able to complete a full game entirely in-app without ever needing paper or manual calculations.

### 2.2 User Mental Model

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

### 2.3 Success Criteria

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

### 2.4 Novel UX Patterns

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

### 2.5 Experience Mechanics

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

## Visual Design Foundation

### Color System

**Color Strategy:**
Family-friendly, age-inclusive color palette that supports emotional goals of confidence, trust, and relief. Colors are high-contrast, accessible, and clearly distinguish game states.

**Primary Color Palette:**
- **Primary**: Blue (#3B82F6) - Trust, reliability, confidence
- **Secondary**: Green (#10B981) - Success, positive feedback, game completion
- **Accent**: Orange (#F59E0B) - Attention, warnings, rule enforcement indicators
- **Neutral**: Gray scale (50-900) - Text, backgrounds, borders

**Semantic Color Mapping:**
- **Primary/Active**: Blue (#3B82F6) - Primary actions, active player indicator
- **Success**: Green (#10B981) - Game completion, successful actions
- **Warning/Attention**: Orange (#F59E0B) - Rule enforcement (50+ penalty), important notices
- **Error**: Red (#EF4444) - Errors, invalid inputs, eliminated players
- **Info**: Blue (#3B82F6) - Informational messages, game state indicators
- **Background**: White (#FFFFFF) - Primary background
- **Surface**: Gray-50 (#F9FAFB) - Card backgrounds, elevated surfaces
- **Text Primary**: Gray-900 (#111827) - Main text, high contrast
- **Text Secondary**: Gray-600 (#4B5563) - Secondary text, labels
- **Border**: Gray-200 (#E5E7EB) - Dividers, borders

**Game State Colors:**
- **Leader**: Blue accent (#3B82F6) with subtle background highlight
- **Active Player**: Blue border or indicator
- **Eliminated Player**: Gray-400 (#9CA3AF) with reduced opacity
- **Rule Enforcement**: Orange (#F59E0B) for 50+ penalty, Red (#EF4444) for elimination

**Accessibility Compliance:**
- All text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Color coding supplemented with icons, text labels, and other indicators
- High contrast mode support through system settings

**Dark Mode Consideration:**
- Support system dark mode preferences
- Maintain contrast ratios in dark mode
- Adjust game state colors for dark backgrounds

### Typography System

**Typography Strategy:**
System fonts for native feel, accessibility, and performance. Large, readable sizes suitable for ages 6+ with clear hierarchy for scores, labels, and actions.

**Font Family:**
- **Primary**: System fonts
  - iOS: San Francisco (SF Pro)
  - Android: Roboto
  - Fallback: System default sans-serif
- **Rationale**: Native feel, automatic accessibility support, no font loading overhead

**Type Scale:**
- **Display/Score**: 48px (3rem) - Large, prominent scores
- **H1/Title**: 32px (2rem) - Screen titles, game headers
- **H2/Subtitle**: 24px (1.5rem) - Section headers, player names
- **H3**: 20px (1.25rem) - Subsection headers
- **Body Large**: 18px (1.125rem) - Important body text
- **Body**: 16px (1rem) - Standard body text, labels
- **Body Small**: 14px (0.875rem) - Secondary information, metadata
- **Caption**: 12px (0.75rem) - Fine print, timestamps

**Font Weights:**
- **Regular (400)**: Body text, labels
- **Medium (500)**: Emphasis, buttons
- **Semibold (600)**: Headings, important labels
- **Bold (700)**: Scores, critical information

**Line Heights:**
- **Tight**: 1.2 - Headings, scores
- **Normal**: 1.5 - Body text
- **Relaxed**: 1.75 - Long-form content (if needed)

**Typography Hierarchy:**
- **Scores**: Display size (48px), Bold weight, high contrast
- **Player Names**: H2 size (24px), Semibold weight
- **Labels**: Body size (16px), Regular weight
- **Actions**: Body size (16px), Medium weight for buttons

**Accessibility:**
- Respects system font size settings (Dynamic Type on iOS, font scaling on Android)
- Minimum readable size: 16px for body text
- Large touch targets accommodate larger text sizes

### Spacing & Layout Foundation

**Spacing Strategy:**
4px base unit with generous spacing for age-inclusive design and large touch targets. Spacious layout that's easy to scan and understand.

**Spacing Scale (4px base unit):**
- **xs**: 4px (0.25rem) - Tight spacing, icon padding
- **sm**: 8px (0.5rem) - Small gaps, compact spacing
- **md**: 16px (1rem) - Standard spacing, component padding
- **lg**: 24px (1.5rem) - Generous spacing, section gaps
- **xl**: 32px (2rem) - Large gaps, screen margins
- **2xl**: 48px (3rem) - Extra large gaps, major sections
- **3xl**: 64px (4rem) - Maximum spacing, screen edges

**Component Spacing:**
- **Touch Target Minimum**: 44px (iOS) / 48px (Android) - All interactive elements
- **Button Padding**: 16px vertical, 24px horizontal
- **Card Padding**: 16px-24px
- **Section Gaps**: 24px-32px
- **Screen Margins**: 16px-24px

**Layout Principles:**
1. **Single-Column Layout**: Main game screen uses single column for simplicity and clarity
2. **Vertical Stacking**: Content flows vertically with clear visual hierarchy
3. **Generous White Space**: Spacious layout prevents crowding, supports age-inclusive design
4. **Clear Visual Hierarchy**: Scores prominent, actions clear, information scannable
5. **Portrait Primary**: Optimized for portrait orientation (landscape optional for future)

**Grid System:**
- No strict grid system needed for MVP (simple single-column layout)
- Consistent spacing scale ensures visual rhythm
- Future: Consider grid for statistics/history screens if needed

**Component Relationships:**
- Player cards: 16px gap between cards
- Score entry: 24px spacing around input area
- Actions: 16px gap between buttons
- Sections: 32px gap between major sections

### Accessibility Considerations

**Color & Contrast:**
- All text meets WCAG AA contrast ratios (4.5:1 normal, 3:1 large)
- Color not sole means of conveying information (icons, labels, patterns supplement)
- High contrast mode support through system settings

**Typography:**
- Respects system font size settings (Dynamic Type iOS, font scaling Android)
- Minimum readable size: 16px for body text
- Large, bold scores for easy reading
- Clear font weight hierarchy

**Touch Targets:**
- Minimum 44x44 points (iOS) / 48x48 dp (Android) for all interactive elements
- Generous spacing between touch targets prevents accidental taps
- Large buttons and cards accommodate various hand sizes

**Screen Reader Support:**
- Semantic labels for all interactive elements
- Clear descriptions for game state (leader, eliminated players)
- Announcements for rule enforcement events
- Accessible navigation structure

**Visual Feedback:**
- Haptic feedback supplements visual feedback for accessibility
- Clear visual indicators for all states (not just color)
- High contrast for important information
- Animation and transitions respect reduced motion preferences
