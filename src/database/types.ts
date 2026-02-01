/**
 * Database Type Definitions
 * TypeScript interfaces for database entities
 */

export type GameStatus = "active" | "completed" | "paused" | "notcompleted";

/**
 * Game entity
 */
export interface Game {
  id: number;
  status: GameStatus;
  created_at: number;
  updated_at: number;
}

/**
 * Player entity
 */
export interface Player {
  id: number;
  game_id: number;
  name: string;
  current_score: number;
  consecutive_misses: number;
  is_eliminated: boolean;
  created_at: number;
}

/**
 * Score entry entity
 */
export interface ScoreEntry {
  id: number;
  player_id: number;
  game_id: number;
  score_value: number;
  round_number: number;
  created_at: number;
}

/**
 * Database result row type (for SQLite query results)
 */
export interface DatabaseRow {
  [key: string]: string | number | null;
}
