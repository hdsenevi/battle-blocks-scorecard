# Project Context Analysis

## Requirements Overview

**Functional Requirements:**
58 functional requirements organized into 8 categories:
- **Game Management (7 FRs)**: Game creation, player management (minimum 2 players, no maximum), game state viewing, resume functionality, active/completed game distinction
- **Score Tracking (8 FRs)**: Score entry (single block = number, multiple blocks = count), real-time score display, leader identification, score history, consecutive miss tracking
- **Rule Enforcement (8 FRs)**: Automatic 50+ penalty detection and reset to 25, elimination tracking (3 consecutive misses), win condition detection (exactly 50 points), correct scoring logic enforcement
- **Data Persistence (7 FRs)**: Automatic game state saving, game state restoration on app restart, active game persistence, completed game persistence, zero data loss guarantee, offline operation
- **User Interface & Feedback (10 FRs)**: Main game screen, score entry interface, visual feedback for rule enforcement, haptic feedback (score entry, penalties, completion, errors), game state indicators
- **Game Completion (6 FRs)**: Win detection, winner announcement, final scores display, game completion marking, prevent further entries after completion
- **Platform & Store (7 FRs)**: iOS 13.0+ and Android 6.0+ support, cross-platform consistency, App Store/Play Store compliance, privacy policy display, app lifecycle handling
- **Error Handling (5 FRs)**: Invalid input handling, rapid entry prevention, edge case handling, data corruption recovery, crash recovery with data persistence

**Non-Functional Requirements:**
47 non-functional requirements across 5 categories:
- **Performance (10 NFRs)**: < 100ms score entry response, < 200ms UI transitions, < 2s app startup, < 500ms game state restoration, real-time rule enforcement, < 50ms haptic feedback trigger, < 100MB memory footprint, minimal battery consumption
- **Reliability (14 NFRs)**: 100% game state persistence across restarts, zero data loss scenarios, data integrity maintenance, zero crashes during gameplay, graceful edge case handling, offline reliability, storage error recovery, 100% rule enforcement accuracy
- **Security (10 NFRs)**: Secure local storage, app sandboxing, no sensitive data collection, App Store/Play Store privacy compliance, privacy policy accessibility, no external data transmission
- **Accessibility (7 NFRs)**: Screen reader support, minimum touch targets (44x44 iOS, 48x48 Android), WCAG AA contrast ratios, system font scaling support, haptic feedback for accessibility, accessible game state information
- **Maintainability (6 NFRs)**: React Native/Expo best practices, maintainable code, well-documented, support for future features, iOS 13.0+ compatibility, Android 6.0+ compatibility

**Scale & Complexity:**
- **Primary domain**: Mobile app (React Native/Expo, cross-platform iOS and Android)
- **Complexity level**: Low to Medium
- **Estimated architectural components**: 5-7 major components
  - Game state management (game creation, player management, game state tracking)
  - Score calculation engine (score entry, calculation logic, single vs multiple blocks)
  - Rule enforcement system (50+ penalty, round-specific elimination tracking, win detection, round management)
  - Local data persistence layer (game state storage, active/completed games, metadata)
  - UI components (score entry interface, game display, winner announcement)
  - Haptic feedback service (score entry, rule enforcement, completion, errors)
  - App lifecycle handler (backgrounding, foregrounding, termination, state restoration)

## Technical Constraints & Dependencies

**Technology Stack:**
- React Native 0.81.5
- Expo SDK ~54.0
- TypeScript for type safety
- Expo Router for navigation
- NativeWind (Tailwind CSS) for styling
- System fonts (San Francisco iOS, Roboto Android)

**Storage Options:**
- AsyncStorage (simple key-value storage)
- SQLite via expo-sqlite (relational data, recommended for game state)
- Realm (alternative option, more complex)

**Platform APIs:**
- Expo Haptics API for haptic feedback
- Expo Router for navigation
- React Native platform APIs for lifecycle events

**Constraints:**
- Fully offline operation (no network dependencies)
- iOS 13.0+ and Android 6.0+ (API level 23+) support
- Cross-platform consistency required
- App Store and Play Store compliance required
- Privacy policy required for store submission

## Cross-Cutting Concerns Identified

1. **Data Persistence**: Critical concern affecting game state management, active game storage, completed game history, and app lifecycle handling. Must ensure 100% reliability with zero data loss.

2. **State Management**: Real-time score updates, rule enforcement triggers, and UI synchronization require efficient state management. React Context, Zustand, or Redux may be needed for complex state.

3. **Error Handling**: Input validation, data corruption recovery, crash recovery, and edge case handling must be consistent across all components. Error boundaries and graceful degradation required.

4. **Performance**: Score calculation, rule enforcement checks, UI updates, and haptic feedback must all meet < 100ms response time requirements. Optimize calculations and minimize re-renders.

5. **Accessibility**: Screen reader support, font scaling, touch targets, and color contrast must be considered in all UI components. Semantic labels and accessible navigation required.

6. **Platform Consistency**: iOS and Android parity while respecting platform conventions (haptic patterns, navigation, visual design). Platform-specific code may be needed for native feel.

7. **Rule Enforcement Logic**: Core business logic for game rules (50+ penalty, round-specific elimination, win detection, round management) must be centralized, testable, and 100% accurate. This is the product differentiator.
   - **Round Management**: Games are organized into rounds with manual completion via "Finish Round" button
   - **Round-Specific Elimination**: Players eliminated after 3 consecutive misses are eliminated only for the current round, reactivated when round finishes
   - **Single Score Per Round**: Players can only score once per round to ensure fair turn-taking
   - **Elimination State**: Elimination status is tracked in game state only (not persisted to database) and resets on round completion
