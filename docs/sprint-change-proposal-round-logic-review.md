# Sprint Change Proposal: Round Logic Review and Story Updates

**Date:** 2026-01-18  
**Prepared By:** Bob (Scrum Master)  
**Change Type:** Story Documentation Update - Round Logic Alignment

---

## 1. Identified Issue Summary

**Problem:** The round logic is fully implemented in the codebase but is not properly documented in the user stories. This creates a gap between what's implemented and what's documented, which could lead to confusion for future development and testing.

**Core Issues:**
1. **Single Score Per Round Rule**: Stories 3.1, 3.2, 3.3 (Score Entry) don't mention that players can only score once per round
2. **Round-Specific Elimination**: Story 4.2 incorrectly states elimination is persisted to database, but architecture clearly states it's round-specific and NOT persisted
3. **Round Display & Completion**: Story 2.3 (Main Game Screen) doesn't document the round display, "Finish Round" button, or round completion functionality
4. **Round Reset Logic**: Stories don't mention that eliminations and consecutive misses reset when a round is finished

**Evidence:**
- Code implementation shows round logic is complete:
  - `ScoreEntryModal.tsx` checks `playersWhoScoredThisRound` (line 137)
  - `gameReducer.ts` has `START_NEW_ROUND` action that resets eliminations
  - `app/game/[id]/index.tsx` has "Finish Round" button and round display
  - `PlayerCard.tsx` shows "Scored This Round" badge
- Architecture document clearly states round-specific elimination (not persisted)
- Stories are missing these critical details

---

## 2. Epic Impact Summary

**Affected Epics:**
- **Epic 2** (Game Management): Story 2.3 needs updates for round display/completion
- **Epic 3** (Score Tracking): Stories 3.1, 3.2, 3.3 need single score per round rule
- **Epic 4** (Rule Enforcement): Story 4.2 needs correction for round-specific elimination

**Epic Status:**
- No epics need to be abandoned or fundamentally redefined
- All affected stories are already implemented, just need documentation updates
- No new epics or story reordering required

**Impact Level:** Low - Documentation update only, no code changes needed

---

## 3. Artifact Impact Analysis

### PRD Review
- ✅ **No PRD changes needed** - Round logic is already documented in functional requirements
- FR requirements are met by current implementation

### Architecture Document Review
- ✅ **No architecture changes needed** - Architecture correctly documents round logic
- Core architectural decisions document clearly states:
  - Round-specific elimination (not persisted)
  - Manual round completion via "Finish Round" button
  - Single score per round enforcement
  - Elimination reset on round completion

### Story Documentation Impact
- ⚠️ **Stories need updates** - Four stories need documentation corrections/additions:
  1. Story 2.3: Add round display and "Finish Round" button
  2. Story 3.1: Add single score per round rule
  3. Story 3.2: Add single score per round rule
  4. Story 3.3: Add single score per round rule
  5. Story 4.2: Correct elimination persistence (round-specific, not persisted)

---

## 4. Recommended Path Forward

**Selected Path: Direct Adjustment / Integration**

**Rationale:**
- Implementation is already complete and correct
- Only documentation updates are needed
- No code changes, rollbacks, or scope changes required
- Low risk, high value (improves story accuracy)

**Approach:**
1. Update affected stories to include round logic details
2. Mark updated stories as "Draft" status for review
3. Ensure stories align with architecture and implementation
4. No code changes needed

---

## 5. Specific Proposed Edits

### Story 2.3: Display Main Game Screen

**Changes Needed:**
- Add acceptance criteria for round display
- Add acceptance criteria for "Finish Round" button
- Add tasks for round completion functionality
- Update dev notes to mention round management

**Proposed Additions:**
- AC: Round number is displayed in the game status area
- AC: "Finish Round" button is visible for active games
- AC: Round completion resets eliminations and allows all players to score again
- Task: Implement round number display
- Task: Implement "Finish Round" button with confirmation dialog
- Task: Integrate START_NEW_ROUND action

### Story 3.1: Score Entry Interface

**Changes Needed:**
- Add acceptance criteria for single score per round rule
- Add validation that prevents multiple scores per round
- Update dev notes to mention round-specific restrictions

**Proposed Additions:**
- AC: Players can only score once per round
- AC: If a player has already scored this round, score entry is blocked with clear message
- AC: The interface shows which players have already scored this round
- Task: Check `playersWhoScoredThisRound` before allowing score entry
- Task: Display appropriate message when player already scored

### Story 3.2: Enter Single Block Score

**Changes Needed:**
- Add acceptance criteria for single score per round rule
- Mention that scoring adds player to `playersWhoScoredThisRound` set

**Proposed Additions:**
- AC: After successful score entry, the player is marked as having scored this round
- AC: The player cannot score again until the round is finished
- Task: Ensure ADD_SCORE action adds player to `playersWhoScoredThisRound` set

### Story 3.3: Enter Multiple Blocks Score

**Changes Needed:**
- Same as Story 3.2 (single score per round rule)

**Proposed Additions:**
- AC: After successful score entry, the player is marked as having scored this round
- AC: The player cannot score again until the round is finished
- Task: Ensure ADD_SCORE action adds player to `playersWhoScoredThisRound` set

### Story 4.2: Automatic Player Elimination

**Changes Needed:**
- **CRITICAL CORRECTION**: Change elimination persistence from database to state-only
- Update to reflect round-specific elimination
- Add information about elimination reset on round completion

**Proposed Corrections:**
- ❌ **REMOVE**: "is_eliminated = true in database" (AC 4)
- ✅ **CHANGE TO**: "is_eliminated = true in game state only (not persisted to database)"
- ✅ **ADD**: "Elimination is round-specific and resets when round is finished"
- ✅ **ADD**: "Eliminated players are reactivated when START_NEW_ROUND action is triggered"
- ✅ **UPDATE**: Task to set is_eliminated in state, not database
- ✅ **ADD**: Note that elimination status is NOT persisted (round-specific)

---

## 6. High-Level Action Plan

1. **Update Story 2.3** - Add round display and completion functionality
2. **Update Story 3.1** - Add single score per round rule
3. **Update Story 3.2** - Add single score per round rule
4. **Update Story 3.3** - Add single score per round rule
5. **Update Story 4.2** - Correct elimination persistence (round-specific, state-only)
6. **Mark all updated stories as "Draft"** status for review
7. **Verify alignment** with architecture document

---

## 7. Agent Handoff Plan

**No handoff required** - This is a documentation update task that can be completed by the Scrum Master. The implementation is already correct, so no Dev Agent involvement is needed unless stories need to be re-implemented (which they don't).

**Next Steps:**
- SM Agent: Update stories as proposed
- PO/PM Agent: Review updated stories when ready
- QA Agent: Verify stories align with implementation during testing

---

## 8. Success Criteria

- ✅ All affected stories document round logic accurately
- ✅ Story 4.2 correctly reflects round-specific elimination (not persisted)
- ✅ Stories 3.1, 3.2, 3.3 include single score per round rule
- ✅ Story 2.3 includes round display and completion functionality
- ✅ All updated stories marked as "Draft" for review
- ✅ Stories align with architecture document and implementation

---

## 9. Risk Assessment

**Risk Level:** Very Low

**Risks:**
- None identified - this is a documentation update only

**Mitigation:**
- Stories are already implemented correctly
- Only documentation needs updating
- No code changes required

---

## Approval

**Status:** Ready for Implementation

**User Approval Required:** Yes

This proposal updates story documentation to align with the implemented round logic. All changes are documentation-only and mark stories as "Draft" for review.
