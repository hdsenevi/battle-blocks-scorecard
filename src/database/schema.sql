-- Battle Blocks Scorecard Database Schema
-- Uses snake_case naming convention as per architecture

-- Games table: Tracks game sessions
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT NOT NULL CHECK(status IN ('active', 'completed', 'paused', 'notcompleted')),
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
    round_number INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_players_game_id ON players(game_id);
CREATE INDEX IF NOT EXISTS idx_score_entries_player_id ON score_entries(player_id);
CREATE INDEX IF NOT EXISTS idx_score_entries_game_id ON score_entries(game_id);
