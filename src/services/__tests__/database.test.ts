/**
 * Database Service Tests
 * Tests for database initialization and schema creation
 */

import * as SQLite from 'expo-sqlite';
import {
  initializeDatabase,
  getDatabase,
  DatabaseError,
  createGame,
  getGame,
  updateGame,
  listActiveGames,
  listCompletedGames,
  addPlayer,
  getPlayer,
  updatePlayer,
  getPlayersByGame,
  addScoreEntry,
  getScoreEntriesByPlayer,
  getScoreEntriesByGame,
  withTransaction,
} from '../database';

// Mock expo-sqlite
jest.mock('expo-sqlite', () => {
  const mockDb = {
    execAsync: jest.fn(),
    getAllAsync: jest.fn(),
    runAsync: jest.fn(),
    closeAsync: jest.fn(),
    withTransactionAsync: jest.fn(),
  };
  
  return {
    openDatabaseAsync: jest.fn(() => Promise.resolve(mockDb)),
  };
});

describe('Database Service', () => {
  let mockDb: {
    execAsync: jest.Mock;
    getAllAsync: jest.Mock;
    runAsync: jest.Mock;
    closeAsync: jest.Mock;
    withTransactionAsync: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockDb = {
      execAsync: jest.fn().mockResolvedValue(undefined),
      getAllAsync: jest.fn(),
      runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1, changes: 1 }),
      closeAsync: jest.fn().mockResolvedValue(undefined),
      withTransactionAsync: jest.fn((callback) => callback()),
    };
    
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb);
  });

  describe('getDatabase', () => {
    it('should open database successfully', async () => {
      const db = await getDatabase();
      expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith('battle_blocks_scorecard.db');
      expect(db).toBeDefined();
    });

    it('should throw DatabaseError if database opening fails', async () => {
      const error = new Error('Database open failed');
      (SQLite.openDatabaseAsync as jest.Mock).mockRejectedValue(error);

      await expect(getDatabase()).rejects.toThrow(DatabaseError);
      await expect(getDatabase()).rejects.toThrow('Failed to open database');
    });
  });

  describe('initializeDatabase', () => {
    it('should enable foreign key constraints', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        { name: 'games' },
        { name: 'players' },
        { name: 'score_entries' },
      ]);

      await initializeDatabase();

      expect(mockDb.execAsync).toHaveBeenCalledWith('PRAGMA foreign_keys = ON;');
    });

    it('should create all required tables', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        { name: 'games' },
        { name: 'players' },
        { name: 'score_entries' },
      ]);

      await initializeDatabase();

      // Verify CREATE TABLE statements were executed
      const execCalls = mockDb.execAsync.mock.calls;
      const createTableCalls = execCalls.filter((call) =>
        call[0].includes('CREATE TABLE IF NOT EXISTS')
      );

      expect(createTableCalls.length).toBeGreaterThanOrEqual(3);
      
      // Verify specific tables
      const allCalls = execCalls.map((call) => call[0]).join(' ');
      expect(allCalls).toContain('CREATE TABLE IF NOT EXISTS games');
      expect(allCalls).toContain('CREATE TABLE IF NOT EXISTS players');
      expect(allCalls).toContain('CREATE TABLE IF NOT EXISTS score_entries');
    });

    it('should create all required indexes', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        { name: 'games' },
        { name: 'players' },
        { name: 'score_entries' },
      ]);

      await initializeDatabase();

      const execCalls = mockDb.execAsync.mock.calls;
      const allCalls = execCalls.map((call) => call[0]).join(' ');

      // Verify indexes
      expect(allCalls).toContain('CREATE INDEX IF NOT EXISTS idx_games_status');
      expect(allCalls).toContain('CREATE INDEX IF NOT EXISTS idx_players_game_id');
      expect(allCalls).toContain('CREATE INDEX IF NOT EXISTS idx_score_entries_player_id');
      expect(allCalls).toContain('CREATE INDEX IF NOT EXISTS idx_score_entries_game_id');
    });

    it('should define foreign key relationships', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        { name: 'games' },
        { name: 'players' },
        { name: 'score_entries' },
      ]);

      await initializeDatabase();

      const execCalls = mockDb.execAsync.mock.calls;
      const allCalls = execCalls.map((call) => call[0]).join(' ');

      // Verify foreign keys
      expect(allCalls).toContain('FOREIGN KEY (game_id) REFERENCES games(id)');
      expect(allCalls).toContain('FOREIGN KEY (player_id) REFERENCES players(id)');
      expect(allCalls).toContain('FOREIGN KEY (game_id) REFERENCES games(id)');
    });

    it('should verify all tables were created', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        { name: 'games' },
        { name: 'players' },
        { name: 'score_entries' },
      ]);

      await initializeDatabase();

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining("SELECT name FROM sqlite_master WHERE type='table'")
      );
    });

    it('should throw DatabaseError if tables are missing', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        { name: 'games' },
        { name: 'players' },
        // score_entries is missing
      ]);

      await expect(initializeDatabase()).rejects.toThrow(DatabaseError);
      await expect(initializeDatabase()).rejects.toThrow('Missing tables');
    });

    it('should throw DatabaseError if schema execution fails', async () => {
      const error = new Error('SQL execution failed');
      mockDb.execAsync.mockRejectedValueOnce(error);

      await expect(initializeDatabase()).rejects.toThrow(DatabaseError);
      await expect(initializeDatabase()).rejects.toThrow('Failed to execute schema statement');
    });

    it('should throw DatabaseError if database opening fails during initialization', async () => {
      const error = new Error('Database open failed');
      (SQLite.openDatabaseAsync as jest.Mock).mockRejectedValue(error);

      await expect(initializeDatabase()).rejects.toThrow(DatabaseError);
    });

    it('should handle errors gracefully with proper error messages', async () => {
      const error = new Error('Test error');
      mockDb.execAsync.mockRejectedValueOnce(error);

      try {
        await initializeDatabase();
        fail('Should have thrown an error');
      } catch (err) {
        expect(err).toBeInstanceOf(DatabaseError);
        expect((err as DatabaseError).message).toContain('Failed to execute schema statement');
        expect((err as DatabaseError).cause).toBe(error);
      }
    });
  });

  describe('Schema Structure', () => {
    it('should create games table with correct columns', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        { name: 'games' },
        { name: 'players' },
        { name: 'score_entries' },
      ]);

      await initializeDatabase();

      const execCalls = mockDb.execAsync.mock.calls;
      const allCalls = execCalls.map((call) => call[0]).join(' ');

      // Verify games table structure
      expect(allCalls).toMatch(/CREATE TABLE IF NOT EXISTS games[^;]*id INTEGER PRIMARY KEY AUTOINCREMENT/);
      expect(allCalls).toContain('status TEXT NOT NULL');
      expect(allCalls).toContain('created_at INTEGER NOT NULL');
      expect(allCalls).toContain('updated_at INTEGER NOT NULL');
    });

    it('should create players table with correct columns', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        { name: 'games' },
        { name: 'players' },
        { name: 'score_entries' },
      ]);

      await initializeDatabase();

      const execCalls = mockDb.execAsync.mock.calls;
      const allCalls = execCalls.map((call) => call[0]).join(' ');

      // Verify players table structure
      expect(allCalls).toMatch(/CREATE TABLE IF NOT EXISTS players[^;]*id INTEGER PRIMARY KEY AUTOINCREMENT/);
      expect(allCalls).toContain('game_id INTEGER NOT NULL');
      expect(allCalls).toContain('name TEXT NOT NULL');
      expect(allCalls).toContain('current_score INTEGER NOT NULL DEFAULT 0');
      expect(allCalls).toContain('consecutive_misses INTEGER NOT NULL DEFAULT 0');
      expect(allCalls).toContain('is_eliminated INTEGER NOT NULL DEFAULT 0');
    });

    it('should create score_entries table with correct columns', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        { name: 'games' },
        { name: 'players' },
        { name: 'score_entries' },
      ]);

      await initializeDatabase();

      const execCalls = mockDb.execAsync.mock.calls;
      const allCalls = execCalls.map((call) => call[0]).join(' ');

      // Verify score_entries table structure
      expect(allCalls).toMatch(/CREATE TABLE IF NOT EXISTS score_entries[^;]*id INTEGER PRIMARY KEY AUTOINCREMENT/);
      expect(allCalls).toContain('player_id INTEGER NOT NULL');
      expect(allCalls).toContain('game_id INTEGER NOT NULL');
      expect(allCalls).toContain('score_value INTEGER NOT NULL');
      expect(allCalls).toContain('entry_type TEXT NOT NULL');
    });
  });

  // ============================================================================
  // Game Operations Tests
  // ============================================================================

  describe('Game Operations', () => {
    describe('createGame', () => {
      it('should create a game with default status', async () => {
        mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 1, changes: 1 });
        mockDb.getAllAsync.mockResolvedValueOnce([
          { id: 1, status: 'active', created_at: 1000, updated_at: 1000 },
        ]);

        const game = await createGame();

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO games'),
          expect.arrayContaining(['active'])
        );
        expect(game).toEqual({
          id: 1,
          status: 'active',
          created_at: 1000,
          updated_at: 1000,
        });
      });

      it('should create a game with specified status', async () => {
        mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 2, changes: 1 });
        mockDb.getAllAsync.mockResolvedValueOnce([
          { id: 2, status: 'paused', created_at: 2000, updated_at: 2000 },
        ]);

        const game = await createGame('paused');

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO games'),
          expect.arrayContaining(['paused'])
        );
        expect(game.status).toBe('paused');
      });

      it('should use parameterized queries', async () => {
        mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 1, changes: 1 });
        mockDb.getAllAsync.mockResolvedValueOnce([
          { id: 1, status: 'active', created_at: 1000, updated_at: 1000 },
        ]);

        await createGame('active');

        const call = mockDb.runAsync.mock.calls[0];
        expect(call[0]).toContain('?');
        expect(Array.isArray(call[1])).toBe(true);
      });

      it('should throw DatabaseError on failure', async () => {
        const error = new Error('Insert failed');
        mockDb.runAsync.mockRejectedValueOnce(error);

        await expect(createGame()).rejects.toThrow(DatabaseError);
        await expect(createGame()).rejects.toThrow('Failed to create game');
      });
    });

    describe('getGame', () => {
      it('should return game when found', async () => {
        const mockGame = {
          id: 1,
          status: 'active' as const,
          created_at: 1000,
          updated_at: 1000,
        };
        mockDb.getAllAsync.mockResolvedValueOnce([mockGame]);

        const game = await getGame(1);

        expect(mockDb.getAllAsync).toHaveBeenCalledWith(
          'SELECT * FROM games WHERE id = ?',
          [1]
        );
        expect(game).toEqual(mockGame);
      });

      it('should return null when game not found', async () => {
        mockDb.getAllAsync.mockResolvedValueOnce([]);

        const game = await getGame(999);

        expect(game).toBeNull();
      });

      it('should use parameterized queries', async () => {
        mockDb.getAllAsync.mockResolvedValueOnce([]);

        await getGame(1);

        const call = mockDb.getAllAsync.mock.calls[0];
        expect(call[0]).toContain('?');
        expect(Array.isArray(call[1])).toBe(true);
      });

      it('should throw DatabaseError on query failure', async () => {
        const error = new Error('Query failed');
        mockDb.getAllAsync.mockRejectedValueOnce(error);

        await expect(getGame(1)).rejects.toThrow(DatabaseError);
      });
    });

    describe('updateGame', () => {
      it('should update game status', async () => {
        mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 0, changes: 1 });
        mockDb.getAllAsync.mockResolvedValueOnce([
          { id: 1, status: 'completed', created_at: 1000, updated_at: 2000 },
        ]);

        const game = await updateGame(1, { status: 'completed' });

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          expect.stringContaining('UPDATE games'),
          expect.arrayContaining(['completed'])
        );
        expect(game.status).toBe('completed');
      });

      it('should update timestamp on status change', async () => {
        mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 0, changes: 1 });
        mockDb.getAllAsync.mockResolvedValueOnce([
          { id: 1, status: 'active', created_at: 1000, updated_at: 2000 },
        ]);

        await updateGame(1, { status: 'active' });

        const call = mockDb.runAsync.mock.calls[0];
        expect(call[0]).toContain('updated_at');
      });

      it('should throw DatabaseError if game not found', async () => {
        mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 0, changes: 1 });
        mockDb.getAllAsync.mockResolvedValueOnce([]);

        await expect(updateGame(999, { status: 'completed' })).rejects.toThrow(
          DatabaseError
        );
      });
    });

    describe('listActiveGames', () => {
      it('should return all active games', async () => {
        const mockGames = [
          { id: 1, status: 'active', created_at: 1000, updated_at: 1000 },
          { id: 2, status: 'active', created_at: 2000, updated_at: 2000 },
        ];
        mockDb.getAllAsync.mockResolvedValueOnce(mockGames);

        const games = await listActiveGames();

        expect(mockDb.getAllAsync).toHaveBeenCalledWith(
          expect.stringContaining("status = ?"),
          ['active']
        );
        expect(games).toEqual(mockGames);
      });

      it('should use parameterized queries', async () => {
        mockDb.getAllAsync.mockResolvedValueOnce([]);

        await listActiveGames();

        const call = mockDb.getAllAsync.mock.calls[0];
        expect(call[0]).toContain('?');
        expect(Array.isArray(call[1])).toBe(true);
      });
    });

    describe('listCompletedGames', () => {
      it('should return all completed games', async () => {
        const mockGames = [
          { id: 1, status: 'completed', created_at: 1000, updated_at: 1000 },
        ];
        mockDb.getAllAsync.mockResolvedValueOnce(mockGames);

        const games = await listCompletedGames();

        expect(mockDb.getAllAsync).toHaveBeenCalledWith(
          expect.stringContaining("status = ?"),
          ['completed']
        );
        expect(games).toEqual(mockGames);
      });
    });
  });

  // ============================================================================
  // Player Operations Tests
  // ============================================================================

  describe('Player Operations', () => {
    describe('addPlayer', () => {
      it('should add a player to a game', async () => {
        mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 1, changes: 1 });
        mockDb.getAllAsync.mockResolvedValueOnce([
          {
            id: 1,
            game_id: 1,
            name: 'Player 1',
            current_score: 0,
            consecutive_misses: 0,
            is_eliminated: 0,
            created_at: 1000,
          },
        ]);

        const player = await addPlayer(1, 'Player 1');

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO players'),
          expect.arrayContaining([1, 'Player 1', 0, 0, 0])
        );
        expect(player.name).toBe('Player 1');
        expect(player.is_eliminated).toBe(false);
      });

      it('should use parameterized queries', async () => {
        mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 1, changes: 1 });
        mockDb.getAllAsync.mockResolvedValueOnce([
          {
            id: 1,
            game_id: 1,
            name: 'Player 1',
            current_score: 0,
            consecutive_misses: 0,
            is_eliminated: 0,
            created_at: 1000,
          },
        ]);

        await addPlayer(1, 'Player 1');

        const call = mockDb.runAsync.mock.calls[0];
        expect(call[0]).toContain('?');
        expect(Array.isArray(call[1])).toBe(true);
      });

      it('should throw DatabaseError on failure', async () => {
        const error = new Error('Insert failed');
        mockDb.runAsync.mockRejectedValueOnce(error);

        await expect(addPlayer(1, 'Player 1')).rejects.toThrow(DatabaseError);
      });
    });

    describe('getPlayer', () => {
      it('should return player when found', async () => {
        const mockPlayer = {
          id: 1,
          game_id: 1,
          name: 'Player 1',
          current_score: 10,
          consecutive_misses: 0,
          is_eliminated: 0,
          created_at: 1000,
        };
        mockDb.getAllAsync.mockResolvedValueOnce([mockPlayer]);

        const player = await getPlayer(1);

        expect(player).toEqual({
          ...mockPlayer,
          is_eliminated: false,
        });
      });

      it('should return null when player not found', async () => {
        mockDb.getAllAsync.mockResolvedValueOnce([]);

        const player = await getPlayer(999);

        expect(player).toBeNull();
      });

      it('should convert is_eliminated to boolean', async () => {
        mockDb.getAllAsync.mockResolvedValueOnce([
          {
            id: 1,
            game_id: 1,
            name: 'Player 1',
            current_score: 0,
            consecutive_misses: 0,
            is_eliminated: 1,
            created_at: 1000,
          },
        ]);

        const player = await getPlayer(1);

        expect(player?.is_eliminated).toBe(true);
      });
    });

    describe('updatePlayer', () => {
      it('should update player fields', async () => {
        mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 0, changes: 1 });
        mockDb.getAllAsync.mockResolvedValueOnce([
          {
            id: 1,
            game_id: 1,
            name: 'Player 1',
            current_score: 20,
            consecutive_misses: 1,
            is_eliminated: 0,
            created_at: 1000,
          },
        ]);

        const player = await updatePlayer(1, { current_score: 20, consecutive_misses: 1 });

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          expect.stringContaining('UPDATE players'),
          expect.arrayContaining([20, 1, 1])
        );
        expect(player.current_score).toBe(20);
      });

      it('should convert boolean is_eliminated to 0/1', async () => {
        mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 0, changes: 1 });
        mockDb.getAllAsync.mockResolvedValueOnce([
          {
            id: 1,
            game_id: 1,
            name: 'Player 1',
            current_score: 0,
            consecutive_misses: 0,
            is_eliminated: 1,
            created_at: 1000,
          },
        ]);

        await updatePlayer(1, { is_eliminated: true });

        const call = mockDb.runAsync.mock.calls[0];
        expect(call[1]).toContain(1);
      });
    });

    describe('getPlayersByGame', () => {
      it('should return all players for a game', async () => {
        const mockPlayers = [
          {
            id: 1,
            game_id: 1,
            name: 'Player 1',
            current_score: 0,
            consecutive_misses: 0,
            is_eliminated: 0,
            created_at: 1000,
          },
          {
            id: 2,
            game_id: 1,
            name: 'Player 2',
            current_score: 0,
            consecutive_misses: 0,
            is_eliminated: 0,
            created_at: 2000,
          },
        ];
        mockDb.getAllAsync.mockResolvedValueOnce(mockPlayers);

        const players = await getPlayersByGame(1);

        expect(mockDb.getAllAsync).toHaveBeenCalledWith(
          expect.stringContaining('game_id = ?'),
          [1]
        );
        expect(players).toHaveLength(2);
        expect(players[0].is_eliminated).toBe(false);
      });
    });
  });

  // ============================================================================
  // Score Entry Operations Tests
  // ============================================================================

  describe('Score Entry Operations', () => {
    describe('addScoreEntry', () => {
      it('should add a score entry', async () => {
        mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 1, changes: 1 });
        mockDb.getAllAsync.mockResolvedValueOnce([
          {
            id: 1,
            player_id: 1,
            game_id: 1,
            score_value: 10,
            entry_type: 'single_block',
            created_at: 1000,
          },
        ]);

        const entry = await addScoreEntry(1, 1, 10, 'single_block');

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO score_entries'),
          expect.arrayContaining([1, 1, 10, 'single_block'])
        );
        expect(entry.score_value).toBe(10);
        expect(entry.entry_type).toBe('single_block');
      });

      it('should use parameterized queries', async () => {
        mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 1, changes: 1 });
        mockDb.getAllAsync.mockResolvedValueOnce([
          {
            id: 1,
            player_id: 1,
            game_id: 1,
            score_value: 10,
            entry_type: 'single_block',
            created_at: 1000,
          },
        ]);

        await addScoreEntry(1, 1, 10, 'single_block');

        const call = mockDb.runAsync.mock.calls[0];
        expect(call[0]).toContain('?');
        expect(Array.isArray(call[1])).toBe(true);
      });
    });

    describe('getScoreEntriesByPlayer', () => {
      it('should return all score entries for a player', async () => {
        const mockEntries = [
          {
            id: 1,
            player_id: 1,
            game_id: 1,
            score_value: 10,
            entry_type: 'single_block',
            created_at: 1000,
          },
          {
            id: 2,
            player_id: 1,
            game_id: 1,
            score_value: 20,
            entry_type: 'multiple_blocks',
            created_at: 2000,
          },
        ];
        mockDb.getAllAsync.mockResolvedValueOnce(mockEntries);

        const entries = await getScoreEntriesByPlayer(1);

        expect(mockDb.getAllAsync).toHaveBeenCalledWith(
          expect.stringContaining('player_id = ?'),
          [1]
        );
        expect(entries).toHaveLength(2);
      });
    });

    describe('getScoreEntriesByGame', () => {
      it('should return all score entries for a game', async () => {
        const mockEntries = [
          {
            id: 1,
            player_id: 1,
            game_id: 1,
            score_value: 10,
            entry_type: 'single_block',
            created_at: 1000,
          },
        ];
        mockDb.getAllAsync.mockResolvedValueOnce(mockEntries);

        const entries = await getScoreEntriesByGame(1);

        expect(mockDb.getAllAsync).toHaveBeenCalledWith(
          expect.stringContaining('game_id = ?'),
          [1]
        );
        expect(entries).toHaveLength(1);
      });
    });
  });

  // ============================================================================
  // Transaction Tests
  // ============================================================================

  describe('Transaction Support', () => {
    it('should execute operations within a transaction', async () => {
      let transactionCallback: (() => Promise<void>) | undefined;
      mockDb.withTransactionAsync.mockImplementation(async (callback) => {
        transactionCallback = callback;
        await callback();
      });

      await withTransaction(async (db) => {
        await db.runAsync('INSERT INTO games (status) VALUES (?)', ['active']);
        return 'success';
      });

      expect(mockDb.withTransactionAsync).toHaveBeenCalled();
      expect(transactionCallback).toBeDefined();
    });

    it('should return result from transaction operations', async () => {
      mockDb.withTransactionAsync.mockImplementation(async (callback) => {
        await callback();
      });

      const result = await withTransaction(async (db) => {
        return { gameId: 1, playerId: 2 };
      });

      expect(result).toEqual({ gameId: 1, playerId: 2 });
    });

    it('should throw DatabaseError if transaction fails', async () => {
      const error = new Error('Transaction failed');
      mockDb.withTransactionAsync.mockRejectedValueOnce(error);

      await expect(
        withTransaction(async () => {
          return 'test';
        })
      ).rejects.toThrow(DatabaseError);
    });
  });
});
