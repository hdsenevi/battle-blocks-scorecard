/**
 * Database Service Layer
 * Handles SQLite database initialization and operations
 */

import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "battle_blocks_scorecard.db";

/**
 * Database initialization error
 */
export class DatabaseError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = "DatabaseError";
  }
}

/**
 * Get or create database instance
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    return db;
  } catch (error) {
    throw new DatabaseError(
      `Failed to open database: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Get database schema SQL
 * Schema is embedded directly for reliability in Expo environment
 */
function getSchema(): string {
  return `-- Battle Blocks Scorecard Database Schema
-- Uses snake_case naming convention as per architecture

-- Games table: Tracks game sessions
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT NOT NULL CHECK(status IN ('active', 'completed', 'paused')),
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Players table: Tracks players within games
CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    current_score INTEGER NOT NULL DEFAULT 0,
    consecutive_misses INTEGER NOT NULL DEFAULT 0,
    is_eliminated INTEGER NOT NULL DEFAULT 0 CHECK(is_eliminated IN (0, 1)),
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Score entries table: Tracks individual score entries for audit/history
CREATE TABLE IF NOT EXISTS score_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    score_value INTEGER NOT NULL,
    entry_type TEXT NOT NULL CHECK(entry_type IN ('single_block', 'multiple_blocks')),
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_players_game_id ON players(game_id);
CREATE INDEX IF NOT EXISTS idx_score_entries_player_id ON score_entries(player_id);
CREATE INDEX IF NOT EXISTS idx_score_entries_game_id ON score_entries(game_id);
`;
}

/**
 * Execute SQL statements from schema
 */
async function executeSchemaStatements(
  db: SQLite.SQLiteDatabase,
  schema: string
): Promise<void> {
  // Split schema by semicolons and filter out empty/comment-only statements
  const statements = schema
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

  for (const statement of statements) {
    if (statement.trim().length === 0) continue;

    try {
      await db.execAsync(statement);
    } catch (error) {
      throw new DatabaseError(
        `Failed to execute schema statement: ${statement.substring(
          0,
          50
        )}... Error: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }
}

/**
 * Initialize database schema
 * Creates all tables, indexes, and constraints as defined in schema.sql
 *
 * @throws {DatabaseError} If database initialization fails
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const db = await getDatabase();

    // Enable foreign key constraints
    await db.execAsync("PRAGMA foreign_keys = ON;");

    // Get and execute schema
    const schema = getSchema();
    await executeSchemaStatements(db, schema);

    // Verify tables were created
    const tables = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );

    const expectedTables = ["games", "players", "score_entries"];
    const createdTables = tables.map((t) => t.name);
    const missingTables = expectedTables.filter(
      (t) => !createdTables.includes(t)
    );

    if (missingTables.length > 0) {
      throw new DatabaseError(
        `Database initialization incomplete. Missing tables: ${missingTables.join(
          ", "
        )}`
      );
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Database initialization failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined
    );
  }
}
