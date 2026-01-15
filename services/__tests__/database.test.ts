/**
 * Database Service Tests
 * Tests for database initialization and schema creation
 */

import * as SQLite from 'expo-sqlite';
import { initializeDatabase, getDatabase, DatabaseError } from '../database';

// Mock expo-sqlite
jest.mock('expo-sqlite', () => {
  const mockDb = {
    execAsync: jest.fn(),
    getAllAsync: jest.fn(),
    closeAsync: jest.fn(),
  };
  
  return {
    openDatabaseAsync: jest.fn(() => Promise.resolve(mockDb)),
  };
});

describe('Database Service', () => {
  let mockDb: {
    execAsync: jest.Mock;
    getAllAsync: jest.Mock;
    closeAsync: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockDb = {
      execAsync: jest.fn().mockResolvedValue(undefined),
      getAllAsync: jest.fn(),
      closeAsync: jest.fn().mockResolvedValue(undefined),
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
});
