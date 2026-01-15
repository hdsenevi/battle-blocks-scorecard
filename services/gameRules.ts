/**
 * Game Rules Service
 * Pure functions for game rule enforcement logic
 * All functions are pure (no side effects, no React dependencies)
 */

/**
 * Check if a score triggers the penalty rule (score exceeds 50)
 * @param score Player's current score
 * @returns true if score > 50, false otherwise
 */
export function checkPenaltyRule(score: number): boolean {
  return score > 50;
}

/**
 * Check if a player should be eliminated (3 or more consecutive misses)
 * @param consecutiveMisses Number of consecutive misses
 * @returns true if consecutiveMisses >= 3, false otherwise
 */
export function checkElimination(consecutiveMisses: number): boolean {
  return consecutiveMisses >= 3;
}

/**
 * Check if a player has won (exactly 50 points)
 * @param score Player's current score
 * @returns true if score === 50, false otherwise
 */
export function checkWinCondition(score: number): boolean {
  return score === 50;
}

/**
 * Calculate score based on blocks knocked over
 * @param blocks Array of block numbers (for single block, array contains one number)
 * @param isMultiple true if multiple blocks, false if single block
 * @returns Calculated score:
 *   - Single block: returns the block number value
 *   - Multiple blocks: returns the count of blocks
 */
export function calculateScore(blocks: number[], isMultiple: boolean): number {
  // Handle edge cases
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return 0;
  }

  // Filter out invalid values (negative, NaN, etc.)
  const validBlocks = blocks.filter(
    (block) => typeof block === "number" && !isNaN(block) && block >= 0
  );

  if (validBlocks.length === 0) {
    return 0;
  }

  if (isMultiple) {
    // Multiple blocks: return count of blocks
    return validBlocks.length;
  } else {
    // Single block: return the block number value (first block in array)
    return validBlocks[0];
  }
}
