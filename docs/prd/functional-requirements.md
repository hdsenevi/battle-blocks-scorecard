# Functional Requirements

**Critical Note:** This section defines THE CAPABILITY CONTRACT for the entire product. UX designers, architects, and developers will only implement what's listed here. Any capability not listed will not exist in the final product unless explicitly added.

## Game Management

- **FR1:** Users can start a new game from the main screen
- **FR2:** Users can add a minimum of 2 players to a game (as required by game rules)
- **FR3:** Users can add additional players beyond the minimum (no maximum limit)
- **FR4:** Users can view the current game state showing all active players and their scores
- **FR5:** Users can resume an interrupted game that was previously saved
- **FR6:** Users can see which game is currently active when multiple games exist
- **FR7:** The system can distinguish between active games and completed games

## Score Tracking

- **FR8:** Users can enter a score for a specific player during their turn
- **FR9:** Users can enter a score when a single block is knocked over (score equals the block number)
- **FR10:** Users can enter a score when multiple blocks are knocked over (score equals the count of blocks)
- **FR11:** The system can display current scores for all players simultaneously
- **FR12:** The system can identify and display the current leader (player with highest score)
- **FR13:** The system can update scores in real-time when new scores are entered
- **FR14:** Users can see the score history for the current game
- **FR15:** The system can track consecutive misses for each player

## Rule Enforcement

- **FR16:** The system can automatically detect when a player's score exceeds 50 points
- **FR17:** The system can automatically reset a player's score to 25 when they exceed 50 points (50+ penalty rule)
- **FR18:** The system can track when a player misses all target pins (consecutive miss)
- **FR19:** The system can automatically eliminate a player after 3 consecutive misses
- **FR20:** The system can prevent eliminated players from receiving further scores
- **FR21:** The system can detect when a player reaches exactly 50 points (win condition)
- **FR22:** The system can prevent scores that would exceed 50 without triggering the penalty (must reach exactly 50 to win)
- **FR23:** The system can enforce correct scoring logic (single block = number, multiple blocks = count)

## Data Persistence

- **FR24:** The system can save the current game state automatically
- **FR25:** The system can restore a saved game state when the app is restarted
- **FR26:** The system can persist active games (games in progress)
- **FR27:** The system can persist completed games (games that have ended)
- **FR28:** The system can maintain game data across app restarts without data loss
- **FR29:** The system can store game metadata (start time, date, players, final scores)
- **FR30:** The system can operate fully offline without network connectivity

## User Interface & Feedback

- **FR31:** Users can view the main game screen showing all players and their current scores
- **FR32:** Users can access a score entry interface to add scores for players
- **FR33:** The system can provide visual feedback when rules are enforced (e.g., 50+ penalty applied)
- **FR34:** The system can provide haptic feedback when scores are entered
- **FR35:** The system can provide haptic feedback when the 50+ penalty rule is triggered
- **FR36:** The system can provide haptic feedback when a game is completed
- **FR37:** The system can provide haptic feedback for error states
- **FR38:** Users can see which player is currently leading the game
- **FR39:** Users can see which players have been eliminated (if any)
- **FR40:** The system can display game status information (active, completed, paused)

## Game Completion

- **FR41:** The system can detect when a player reaches exactly 50 points (winning condition)
- **FR42:** The system can display a winner announcement when a game is completed
- **FR43:** The system can show final scores for all players when a game ends
- **FR44:** The system can mark a game as completed when a winner is determined
- **FR45:** The system can prevent further score entries after a game is completed
- **FR46:** Users can view completed game results after the game ends

## Platform & Store Requirements

- **FR47:** The system can function on iOS devices (iOS 13.0+)
- **FR48:** The system can function on Android devices (Android 6.0+)
- **FR49:** The system can provide a consistent experience across iOS and Android platforms
- **FR50:** The system can comply with App Store review guidelines
- **FR51:** The system can comply with Google Play Store developer policies
- **FR52:** The system can display required privacy policy information
- **FR53:** The system can handle app lifecycle events (backgrounding, foregrounding, termination)

## Error Handling & Edge Cases

- **FR54:** The system can handle invalid score entries gracefully
- **FR55:** The system can prevent rapid duplicate score entries that could cause errors
- **FR56:** The system can handle edge cases in score calculation (zero blocks, negative values, etc.)
- **FR57:** The system can recover from data corruption scenarios
- **FR58:** The system can handle app crashes without losing game state (data persistence)
