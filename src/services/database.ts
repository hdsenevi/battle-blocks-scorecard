/**
 * Database Service Layer
 * Handles SQLite database initialization and operations
 */

import * as SQLite from "expo-sqlite";
import type {
  Game,
  Player,
  ScoreEntry,
  GameStatus,
  ScoreEntryType,
} from "../database/types";

const DATABASE_NAME = "battle_blocks_scorecard.db";

// Track if database has been initialized
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Database initialization error
 */
export class DatabaseError extends Error {
  constructor(message: string, public cause?: Error, public code?: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

// Re-export types for convenience
export type { Game, Player, ScoreEntry, GameStatus, ScoreEntryType };

/**
 * Get or create database instance
 * Automatically initializes schema if not already initialized
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    // Initialize schema if not already done
    if (!isInitialized) {
      if (initializationPromise) {
        // Wait for ongoing initialization
        await initializationPromise;
      } else {
        // Start initialization on this database connection
        initializationPromise = initializeDatabaseOnConnection(db);
        await initializationPromise;
        isInitialized = true;
        initializationPromise = null;
      }
    }

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
 * Execute SQL statements from schema
 * Executes statements one at a time to ensure proper order
 */
async function executeSchemaStatements(
  db: SQLite.SQLiteDatabase,
  schema: string
): Promise<void> {
  // Define statements explicitly to ensure proper execution order
  const statements = [
    // Enable foreign keys first
    "PRAGMA foreign_keys = ON;",

    // Create tables
    `CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT NOT NULL CHECK(status IN ('active', 'completed', 'paused')),
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );`,

    `CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      current_score INTEGER NOT NULL DEFAULT 0,
      consecutive_misses INTEGER NOT NULL DEFAULT 0,
      is_eliminated INTEGER NOT NULL DEFAULT 0 CHECK(is_eliminated IN (0, 1)),
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS score_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id INTEGER NOT NULL,
      game_id INTEGER NOT NULL,
      score_value INTEGER NOT NULL,
      entry_type TEXT NOT NULL CHECK(entry_type IN ('single_block', 'multiple_blocks')),
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
    );`,

    // Create indexes after tables
    "CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);",
    "CREATE INDEX IF NOT EXISTS idx_players_game_id ON players(game_id);",
    "CREATE INDEX IF NOT EXISTS idx_score_entries_player_id ON score_entries(player_id);",
    "CREATE INDEX IF NOT EXISTS idx_score_entries_game_id ON score_entries(game_id);",
  ];

  // Execute each statement sequentially
  for (const statement of statements) {
    const trimmed = statement.trim();
    if (trimmed.length === 0) continue;

    try {
      // Use execAsync for DDL statements (CREATE TABLE, CREATE INDEX, PRAGMA)
      await db.execAsync(trimmed);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Some errors are expected and can be ignored
      if (
        errorMessage.includes("already exists") ||
        errorMessage.includes("duplicate column") ||
        (errorMessage.includes("no such table") &&
          errorMessage.includes("IF NOT EXISTS"))
      ) {
        // These are fine, continue
        continue;
      }

      throw new DatabaseError(
        `Failed to execute schema statement: ${trimmed.substring(
          0,
          100
        )}... Error: ${errorMessage}`,
        error instanceof Error ? error : undefined
      );
    }
  }
}

/**
 * Initialize database schema on a specific database connection
 * Creates all tables, indexes, and constraints as defined in schema.sql
 *
 * @param db Database connection to initialize
 * @throws {DatabaseError} If database initialization fails
 */
async function initializeDatabaseOnConnection(
  db: SQLite.SQLiteDatabase
): Promise<void> {
  try {
    // Execute schema statements (includes PRAGMA foreign_keys)
    await executeSchemaStatements(db, "");

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

/**
 * Initialize database schema
 * Creates all tables, indexes, and constraints as defined in schema.sql
 * Opens a new database connection for initialization
 *
 * @throws {DatabaseError} If database initialization fails
 */
export async function initializeDatabase(): Promise<void> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  return initializeDatabaseOnConnection(db);
}

// ============================================================================
// Game Operations
// ============================================================================

/**
 * Create a new game
 * @param status Initial game status (default: 'active')
 * @returns Created game with generated ID and timestamps
 * @throws {DatabaseError} If game creation fails
 */
export async function createGame(status: GameStatus = "active"): Promise<Game> {
  try {
    const db = await getDatabase();
    const now = Math.floor(Date.now() / 1000);

    // Use runAsync with proper error handling
    let result;
    try {
      result = await db.runAsync(
        "INSERT INTO games (status, created_at, updated_at) VALUES (?, ?, ?)",
        [status, now, now]
      );
    } catch (runError) {
      // Get more detailed error information
      const errorMessage =
        runError instanceof Error
          ? runError.message
          : typeof runError === "string"
            ? runError
            : JSON.stringify(runError);
      const errorDetails =
        runError && typeof runError === "object" && "cause" in runError
          ? String((runError as any).cause)
          : undefined;

      throw new DatabaseError(
        `Failed to insert game: ${errorMessage}${errorDetails ? ` (${errorDetails})` : ""}`,
        runError instanceof Error ? runError : undefined,
        "CREATE_GAME_INSERT_ERROR"
      );
    }

    // Get the last insert row ID
    const lastInsertRowId =
      result?.lastInsertRowId ?? (result as any)?.insertId ?? null;

    if (!lastInsertRowId || typeof lastInsertRowId !== "number") {
      throw new DatabaseError(
        "Failed to get insert ID after creating game",
        undefined,
        "CREATE_GAME_ID_ERROR"
      );
    }

    const game = await getGame(lastInsertRowId);
    if (!game) {
      throw new DatabaseError("Failed to retrieve created game");
    }
    return game;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : String(error);
    throw new DatabaseError(
      `Failed to create game: ${errorMessage}`,
      error instanceof Error ? error : undefined,
      "CREATE_GAME_ERROR"
    );
  }
}

/**
 * Get a game by ID
 * @param id Game ID
 * @returns Game if found, null otherwise
 * @throws {DatabaseError} If query fails
 */
export async function getGame(id: number): Promise<Game | null> {
  try {
    const db = await getDatabase();
    const games = await db.getAllAsync<Game>(
      "SELECT * FROM games WHERE id = ?",
      [id]
    );

    if (games.length === 0) {
      return null;
    }

    return games[0];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to get game: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined,
      "GET_GAME_ERROR"
    );
  }
}

/**
 * Update a game
 * @param id Game ID
 * @param updates Partial game data to update
 * @returns Updated game
 * @throws {DatabaseError} If update fails or game not found
 */
export async function updateGame(
  id: number,
  updates: Partial<Pick<Game, "status">>
): Promise<Game> {
  try {
    const db = await getDatabase();
    const now = Math.floor(Date.now() / 1000);

    if (updates.status !== undefined) {
      await db.runAsync(
        "UPDATE games SET status = ?, updated_at = ? WHERE id = ?",
        [updates.status, now, id]
      );
    } else {
      // Just update timestamp
      await db.runAsync("UPDATE games SET updated_at = ? WHERE id = ?", [
        now,
        id,
      ]);
    }

    const game = await getGame(id);
    if (!game) {
      throw new DatabaseError(`Game with id ${id} not found after update`);
    }
    return game;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to update game: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined,
      "UPDATE_GAME_ERROR"
    );
  }
}

/**
 * List all active games
 * @returns Array of active games
 * @throws {DatabaseError} If query fails
 */
export async function listActiveGames(): Promise<Game[]> {
  try {
    const db = await getDatabase();
    const games = await db.getAllAsync<Game>(
      "SELECT * FROM games WHERE status = ? ORDER BY created_at DESC",
      ["active"]
    );
    return games;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to list active games: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined,
      "LIST_ACTIVE_GAMES_ERROR"
    );
  }
}

/**
 * List all completed games
 * @returns Array of completed games
 * @throws {DatabaseError} If query fails
 */
export async function listCompletedGames(): Promise<Game[]> {
  try {
    const db = await getDatabase();
    const games = await db.getAllAsync<Game>(
      "SELECT * FROM games WHERE status = ? ORDER BY updated_at DESC",
      ["completed"]
    );
    return games;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to list completed games: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined,
      "LIST_COMPLETED_GAMES_ERROR"
    );
  }
}

// ============================================================================
// Player Operations
// ============================================================================

/**
 * Add a player to a game
 * @param gameId Game ID
 * @param name Player name
 * @returns Created player with generated ID and timestamps
 * @throws {DatabaseError} If player creation fails
 */
export async function addPlayer(gameId: number, name: string): Promise<Player> {
  try {
    const db = await getDatabase();
    const now = Math.floor(Date.now() / 1000);

    const result = await db.runAsync(
      "INSERT INTO players (game_id, name, current_score, consecutive_misses, is_eliminated, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [gameId, name, 0, 0, 0, now]
    );

    const player = await getPlayer(result.lastInsertRowId);
    if (!player) {
      throw new DatabaseError("Failed to retrieve created player");
    }
    return player;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to add player: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined,
      "ADD_PLAYER_ERROR"
    );
  }
}

/**
 * Get a player by ID
 * @param id Player ID
 * @returns Player if found, null otherwise
 * @throws {DatabaseError} If query fails
 */
export async function getPlayer(id: number): Promise<Player | null> {
  try {
    const db = await getDatabase();
    const players = await db.getAllAsync<Player>(
      "SELECT * FROM players WHERE id = ?",
      [id]
    );

    if (players.length === 0) {
      return null;
    }

    const player = players[0];
    // Convert is_eliminated from 0/1 to boolean
    return {
      ...player,
      is_eliminated: Boolean(player.is_eliminated),
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to get player: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined,
      "GET_PLAYER_ERROR"
    );
  }
}

/**
 * Update a player
 * @param id Player ID
 * @param updates Partial player data to update
 * @returns Updated player
 * @throws {DatabaseError} If update fails or player not found
 */
export async function updatePlayer(
  id: number,
  updates: Partial<
    Pick<
      Player,
      "name" | "current_score" | "consecutive_misses" | "is_eliminated"
    >
  >
): Promise<Player> {
  try {
    const db = await getDatabase();

    const updateFields: string[] = [];
    const updateValues: (string | number | boolean)[] = [];

    if (updates.name !== undefined) {
      updateFields.push("name = ?");
      updateValues.push(updates.name);
    }
    if (updates.current_score !== undefined) {
      updateFields.push("current_score = ?");
      updateValues.push(updates.current_score);
    }
    if (updates.consecutive_misses !== undefined) {
      updateFields.push("consecutive_misses = ?");
      updateValues.push(updates.consecutive_misses);
    }
    if (updates.is_eliminated !== undefined) {
      updateFields.push("is_eliminated = ?");
      updateValues.push(updates.is_eliminated ? 1 : 0);
    }

    if (updateFields.length === 0) {
      // No updates, just return current player
      const player = await getPlayer(id);
      if (!player) {
        throw new DatabaseError(`Player with id ${id} not found`);
      }
      return player;
    }

    updateValues.push(id);
    await db.runAsync(
      `UPDATE players SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    const player = await getPlayer(id);
    if (!player) {
      throw new DatabaseError(`Player with id ${id} not found after update`);
    }
    return player;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to update player: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined,
      "UPDATE_PLAYER_ERROR"
    );
  }
}

/**
 * Get all players for a game
 * @param gameId Game ID
 * @returns Array of players for the game
 * @throws {DatabaseError} If query fails
 */
export async function getPlayersByGame(gameId: number): Promise<Player[]> {
  try {
    const db = await getDatabase();
    const players = await db.getAllAsync<Player>(
      "SELECT * FROM players WHERE game_id = ? ORDER BY created_at ASC",
      [gameId]
    );

    // Convert is_eliminated from 0/1 to boolean
    return players.map((player) => ({
      ...player,
      is_eliminated: Boolean(player.is_eliminated),
    }));
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to get players by game: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined,
      "GET_PLAYERS_BY_GAME_ERROR"
    );
  }
}

// ============================================================================
// Score Entry Operations
// ============================================================================

/**
 * Add a score entry
 * @param playerId Player ID
 * @param gameId Game ID
 * @param scoreValue Score value
 * @param entryType Type of score entry
 * @returns Created score entry with generated ID and timestamp
 * @throws {DatabaseError} If score entry creation fails
 */
export async function addScoreEntry(
  playerId: number,
  gameId: number,
  scoreValue: number,
  entryType: ScoreEntryType
): Promise<ScoreEntry> {
  try {
    const db = await getDatabase();
    const now = Math.floor(Date.now() / 1000);

    const result = await db.runAsync(
      "INSERT INTO score_entries (player_id, game_id, score_value, entry_type, created_at) VALUES (?, ?, ?, ?, ?)",
      [playerId, gameId, scoreValue, entryType, now]
    );

    const scoreEntry = await db.getAllAsync<ScoreEntry>(
      "SELECT * FROM score_entries WHERE id = ?",
      [result.lastInsertRowId]
    );

    if (scoreEntry.length === 0) {
      throw new DatabaseError("Failed to retrieve created score entry");
    }
    return scoreEntry[0];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to add score entry: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined,
      "ADD_SCORE_ENTRY_ERROR"
    );
  }
}

/**
 * Get all score entries for a player
 * @param playerId Player ID
 * @returns Array of score entries for the player
 * @throws {DatabaseError} If query fails
 */
export async function getScoreEntriesByPlayer(
  playerId: number
): Promise<ScoreEntry[]> {
  try {
    const db = await getDatabase();
    const entries = await db.getAllAsync<ScoreEntry>(
      "SELECT * FROM score_entries WHERE player_id = ? ORDER BY created_at ASC",
      [playerId]
    );
    return entries;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to get score entries by player: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined,
      "GET_SCORE_ENTRIES_BY_PLAYER_ERROR"
    );
  }
}

/**
 * Get all score entries for a game
 * @param gameId Game ID
 * @returns Array of score entries for the game
 * @throws {DatabaseError} If query fails
 */
export async function getScoreEntriesByGame(
  gameId: number
): Promise<ScoreEntry[]> {
  try {
    const db = await getDatabase();
    const entries = await db.getAllAsync<ScoreEntry>(
      "SELECT * FROM score_entries WHERE game_id = ? ORDER BY created_at ASC",
      [gameId]
    );
    return entries;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to get score entries by game: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined,
      "GET_SCORE_ENTRIES_BY_GAME_ERROR"
    );
  }
}

// ============================================================================
// Transaction Support
// ============================================================================

/**
 * Execute multiple database operations within a transaction
 * @param operations Function that performs database operations using the provided database instance
 * @returns Result of the operations function
 * @throws {DatabaseError} If transaction fails
 */
export async function withTransaction<T>(
  operations: (db: SQLite.SQLiteDatabase) => Promise<T>
): Promise<T> {
  try {
    const db = await getDatabase();
    let result: T;
    await db.withTransactionAsync(async () => {
      const operationResult = await operations(db);
      result = operationResult;
    });

    return result!;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Transaction failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined,
      "TRANSACTION_ERROR"
    );
  }
}
