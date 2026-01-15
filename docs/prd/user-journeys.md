# User Journeys

## Journey 1: Starting a New Game (Primary User - Success Path)

**Persona:** Sarah, 28, playing Battle Blocks at a family gathering. She's tech-savvy and wants to avoid paper scorekeeping.

**Opening Scene:** Sarah is at a family gathering. They want to play Battle Blocks, but no one wants to keep score on paper. Someone suggests using an app, and Sarah remembers she has the Battle Blocks Scorecard app.

**Rising Action:**
- Sarah opens the app for the first time (or returns to it)
- She sees a clean, simple interface with "Start New Game" prominently displayed
- She taps "Start New Game"
- The app prompts her to add players
- She adds players: "Mom", "Dad", "Sarah", "Jake" (minimum 2 players as per game rules)
- The game begins - all players start at 0 points
- The main game screen shows all players with their current scores

**Climax - During Gameplay:**
- **Round 1:** Sarah's turn - She knocks over blocks 3, 7, and 9. She taps her name, enters "3" (multiple blocks = count), and the app instantly updates her score from 0 to 3. Everyone can see the update immediately.
- **Round 2:** Dad's turn - He knocks over block 12. He enters "12" (single block = block number), and his score updates from 0 to 12.
- **Round 3:** Mom's turn - She knocks over blocks 5 and 8. She enters "2" (count of blocks), and her score updates from 0 to 2.
- **Critical Moment:** Later in the game, Dad's score reaches 52 points. The app automatically detects this exceeds 50, applies the penalty rule, and resets his score to 25. A visual indicator shows the penalty was applied. Everyone sees this happen automatically - no manual calculation needed.
- **Elimination Scenario:** Jake misses all pins three times in a row. The app tracks consecutive misses and automatically marks him as eliminated. His name is grayed out or marked, and he's no longer included in scoring.

**Resolution:** The game continues until Mom reaches exactly 50 points. The app detects the win condition, displays a celebration/winner screen showing "Mom Wins!" with final scores. The game is automatically saved to game history. Sarah feels relieved - the app handled all the math and rule enforcement, making the game smooth and enjoyable.

**Emotional Arc:** Initial uncertainty → Confidence as app proves reliable → Delight when rules enforce automatically → Satisfaction at game completion

**Requirements Revealed:**
- Game creation and player management
- Score entry interface (single vs multiple blocks)
- Real-time score display
- Automatic rule enforcement (50+ penalty, elimination)
- Game completion detection
- Automatic game saving

## Journey 2: Resuming a Saved Game (Primary User - Edge Case)

**Persona:** Mike, 35, started a game yesterday but had to pause it mid-way. He wants to continue where they left off.

**Opening Scene:** Mike opens the app the next day. He sees two options: "Start New Game" and "Continue Game" (or "Resume Game"). He remembers they were in the middle of a game yesterday.

**Rising Action:**
- Mike taps "Continue Game" or sees a list of active games
- The app shows the saved game from yesterday with all players and their current scores
- He can see: "Game started: Yesterday, 3:45 PM" with players: "Mike (32 points)", "Lisa (18 points)", "Tom (41 points)"
- He taps to resume the game
- The game screen loads exactly as it was, with all scores intact

**Climax:**
- Mike and his friends continue playing from where they left off
- The app maintains all game state: current scores, player status, round number
- No data was lost despite the app being closed overnight
- They complete the game, and Mike feels confident the app reliably saves their progress

**Resolution:** Game completes successfully. Mike can now view it in game history alongside other completed games.

**Emotional Arc:** Concern about lost progress → Relief when data is intact → Confidence in app reliability

**Requirements Revealed:**
- Game state persistence across app restarts
- Resume/continue game functionality
- Active game management (multiple saved games)
- Game metadata (start time, date)

## Journey 3: Correcting a Score Entry (Primary User - Error Recovery)

**Persona:** Emma, 32, accidentally entered the wrong score. She needs to fix it quickly.

**Opening Scene:** During an active game, Emma enters a score of "5" for herself, but realizes she actually knocked over blocks 5, 6, and 7 (which should be 3 points, not 5).

**Rising Action:**
- Emma notices the mistake immediately after entering
- She looks for a way to correct it
- She sees an "Undo" button or "Edit Last Score" option
- She taps it, and the last score entry is removed
- Her score reverts to the previous value

**Climax:**
- Emma re-enters the correct score: "3" (count of blocks)
- The score updates correctly
- The game continues smoothly
- Emma feels relieved that mistakes can be easily corrected

**Alternative Path - Manual Edit:**
- If undo isn't available, Emma can tap on her score entry in the history
- She sees an "Edit" option
- She changes the score from 5 to 3
- The app recalculates her total automatically

**Resolution:** The game continues with the correct score. Emma appreciates the ability to fix mistakes without disrupting gameplay.

**Emotional Arc:** Frustration at mistake → Relief at easy correction → Confidence in app flexibility

**Requirements Revealed:**
- Undo last score entry functionality
- Score editing capability
- Score history/entry list
- Automatic recalculation after edits

## Journey 4: Reviewing Past Games (Primary User - Post-Game)

**Persona:** Alex, 29, wants to see who won the most games over the past month and check game statistics.

**Opening Scene:** Alex opens the app and sees the main screen. After completing several games, he wants to review past results.

**Rising Action:**
- Alex navigates to "Game History" or "Past Games"
- He sees a list of completed games, each showing:
  - Date and time
  - Players who participated
  - Winner
  - Final scores
- He taps on a specific game to see details
- The game detail screen shows:
  - All players and their final scores
  - Game duration (if tracked)
  - Round-by-round breakdown (if available)

**Climax:**
- Alex reviews multiple games and notices patterns
- He sees statistics like:
  - "Lisa has won 3 out of 5 games"
  - "Average game duration: 25 minutes"
  - "Highest single score: 48 points (before penalty)"
- He feels satisfied seeing the game history and can share results with friends

**Resolution:** Alex has a complete record of all games played. He can reference past games, compare performance, and share results.

**Emotional Arc:** Curiosity about past games → Satisfaction seeing complete history → Engagement with statistics

**Requirements Revealed:**
- Game history storage and retrieval
- Game detail view
- Statistics calculation and display
- Game filtering/search (by date, player, etc.)

