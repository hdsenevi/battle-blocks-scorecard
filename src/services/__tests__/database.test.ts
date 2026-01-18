/**
 * Tests for database service status filtering functions
 * Tests listActiveGames(), listCompletedGames(), and listPausedGames()
 */

import type { Game } from "../../database/types";

// Import SQLite to access the mock
import * as SQLite from "expo-sqlite";

// Import after mocking
import {
  listActiveGames,
  listCompletedGames,
  listPausedGames,
  DatabaseError,
} from "../database";

// Create a mock database instance
const createMockDb = () => {
  const db = {
    getAllAsync: jest.fn(),
    runAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    execAsync: jest.fn(),
  };
  
  return db;
};

describe("Database Service - Status Filtering Functions", () => {
  let testMockDb: ReturnType<typeof createMockDb>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a fresh mock database instance for this test
    testMockDb = createMockDb();
    
    // Mock openDatabaseAsync to return our test mock
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(testMockDb);
    
    // Mock the initialization check - return tables when checking for table existence
    // The initialization process:
    // 1. Calls execAsync for PRAGMA and CREATE TABLE statements
    // 2. Calls getAllAsync to check for tables
    testMockDb.execAsync.mockResolvedValue(undefined);
    testMockDb.runAsync.mockResolvedValue({ lastInsertRowId: 0, changes: 0 });
    
    testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
      if (query && typeof query === 'string' && query.includes("sqlite_master") && query.includes("type='table'")) {
        // Return tables for initialization check
        return Promise.resolve([
          { name: "games" },
          { name: "players" },
          { name: "score_entries" },
        ]);
      }
      // For other queries (status filtering), return empty array by default
      // Tests will override this for specific test cases
      return Promise.resolve([]);
    });
  });

  describe("listActiveGames", () => {
    it("should return array of active games ordered by created_at DESC", async () => {
      // Arrange
      const mockGames: Game[] = [
        {
          id: 2,
          status: "active",
          created_at: Math.floor(Date.now() / 1000) + 100,
          updated_at: Math.floor(Date.now() / 1000) + 100,
        },
        {
          id: 1,
          status: "active",
          created_at: Math.floor(Date.now() / 1000),
          updated_at: Math.floor(Date.now() / 1000),
        },
      ];

      // Override the default mock implementation for this test
      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "active") {
          return Promise.resolve(mockGames);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listActiveGames();

      // Assert
      expect(result).toEqual(mockGames);
      expect(testMockDb.getAllAsync).toHaveBeenCalledWith(
        "SELECT * FROM games WHERE status = ? ORDER BY created_at DESC",
        ["active"]
      );
      expect(result.length).toBe(2);
      expect(result[0].status).toBe("active");
      expect(result[1].status).toBe("active");
    });

    it("should return empty array when no active games exist", async () => {
      // Arrange
      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "active") {
          return Promise.resolve([]);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listActiveGames();

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
      expect(testMockDb.getAllAsync).toHaveBeenCalledWith(
        "SELECT * FROM games WHERE status = ? ORDER BY created_at DESC",
        ["active"]
      );
    });

    it("should only return games with active status", async () => {
      // Arrange
      const mockGames: Game[] = [
        {
          id: 1,
          status: "active",
          created_at: Math.floor(Date.now() / 1000),
          updated_at: Math.floor(Date.now() / 1000),
        },
      ];

      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "active") {
          return Promise.resolve(mockGames);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listActiveGames();

      // Assert
      expect(result).toEqual(mockGames);
      expect(result.every((game) => game.status === "active")).toBe(true);
    });

    it("should throw DatabaseError when query fails", async () => {
      // Arrange
      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "active") {
          return Promise.reject(new Error("Database query failed"));
        }
        return Promise.resolve([]);
      });

      // Act & Assert
      await expect(listActiveGames()).rejects.toThrow(DatabaseError);
      await expect(listActiveGames()).rejects.toThrow(
        "Failed to list active games"
      );
    });

    it("should preserve DatabaseError when already a DatabaseError", async () => {
      // Arrange
      const dbError = new DatabaseError("Database connection failed");
      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "active") {
          return Promise.reject(dbError);
        }
        return Promise.resolve([]);
      });

      // Act & Assert
      await expect(listActiveGames()).rejects.toThrow(DatabaseError);
      await expect(listActiveGames()).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("listCompletedGames", () => {
    it("should return array of completed games ordered by updated_at DESC", async () => {
      // Arrange
      const mockGames: Game[] = [
        {
          id: 2,
          status: "completed",
          created_at: Math.floor(Date.now() / 1000),
          updated_at: Math.floor(Date.now() / 1000) + 100,
        },
        {
          id: 1,
          status: "completed",
          created_at: Math.floor(Date.now() / 1000),
          updated_at: Math.floor(Date.now() / 1000),
        },
      ];

      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "completed") {
          return Promise.resolve(mockGames);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listCompletedGames();

      // Assert
      expect(result).toEqual(mockGames);
      expect(testMockDb.getAllAsync).toHaveBeenCalledWith(
        "SELECT * FROM games WHERE status = ? ORDER BY updated_at DESC",
        ["completed"]
      );
      expect(result.length).toBe(2);
      expect(result[0].status).toBe("completed");
      expect(result[1].status).toBe("completed");
    });

    it("should return empty array when no completed games exist", async () => {
      // Arrange
      testMockDb.getAllAsync.mockImplementation((query: string) => {
        if (query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query.includes("status = ?") && query.includes("completed")) {
          return Promise.resolve([]);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listCompletedGames();

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
      expect(testMockDb.getAllAsync).toHaveBeenCalledWith(
        "SELECT * FROM games WHERE status = ? ORDER BY updated_at DESC",
        ["completed"]
      );
    });

    it("should only return games with completed status", async () => {
      // Arrange
      const mockGames: Game[] = [
        {
          id: 1,
          status: "completed",
          created_at: Math.floor(Date.now() / 1000),
          updated_at: Math.floor(Date.now() / 1000),
        },
      ];

      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "completed") {
          return Promise.resolve(mockGames);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listCompletedGames();

      // Assert
      expect(result).toEqual(mockGames);
      expect(result.every((game) => game.status === "completed")).toBe(true);
    });

    it("should throw DatabaseError when query fails", async () => {
      // Arrange
      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "completed") {
          return Promise.reject(new Error("Database query failed"));
        }
        return Promise.resolve([]);
      });

      // Act & Assert
      await expect(listCompletedGames()).rejects.toThrow(DatabaseError);
      await expect(listCompletedGames()).rejects.toThrow(
        "Failed to list completed games"
      );
    });

    it("should preserve DatabaseError when already a DatabaseError", async () => {
      // Arrange
      const dbError = new DatabaseError("Database connection failed");
      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "completed") {
          return Promise.reject(dbError);
        }
        return Promise.resolve([]);
      });

      // Act & Assert
      await expect(listCompletedGames()).rejects.toThrow(DatabaseError);
      await expect(listCompletedGames()).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("listPausedGames", () => {
    it("should return array of paused games ordered by created_at DESC", async () => {
      // Arrange
      const mockGames: Game[] = [
        {
          id: 2,
          status: "paused",
          created_at: Math.floor(Date.now() / 1000) + 100,
          updated_at: Math.floor(Date.now() / 1000) + 100,
        },
        {
          id: 1,
          status: "paused",
          created_at: Math.floor(Date.now() / 1000),
          updated_at: Math.floor(Date.now() / 1000),
        },
      ];

      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "paused") {
          return Promise.resolve(mockGames);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listPausedGames();

      // Assert
      expect(result).toEqual(mockGames);
      expect(testMockDb.getAllAsync).toHaveBeenCalledWith(
        "SELECT * FROM games WHERE status = ? ORDER BY created_at DESC",
        ["paused"]
      );
      expect(result.length).toBe(2);
      expect(result[0].status).toBe("paused");
      expect(result[1].status).toBe("paused");
    });

    it("should return empty array when no paused games exist", async () => {
      // Arrange
      testMockDb.getAllAsync.mockImplementation((query: string) => {
        if (query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query.includes("status = ?") && query.includes("paused")) {
          return Promise.resolve([]);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listPausedGames();

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
      expect(testMockDb.getAllAsync).toHaveBeenCalledWith(
        "SELECT * FROM games WHERE status = ? ORDER BY created_at DESC",
        ["paused"]
      );
    });

    it("should only return games with paused status", async () => {
      // Arrange
      const mockGames: Game[] = [
        {
          id: 1,
          status: "paused",
          created_at: Math.floor(Date.now() / 1000),
          updated_at: Math.floor(Date.now() / 1000),
        },
      ];

      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "paused") {
          return Promise.resolve(mockGames);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listPausedGames();

      // Assert
      expect(result).toEqual(mockGames);
      expect(result.every((game) => game.status === "paused")).toBe(true);
    });

    it("should throw DatabaseError when query fails", async () => {
      // Arrange
      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "paused") {
          return Promise.reject(new Error("Database query failed"));
        }
        return Promise.resolve([]);
      });

      // Act & Assert
      await expect(listPausedGames()).rejects.toThrow(DatabaseError);
      await expect(listPausedGames()).rejects.toThrow(
        "Failed to list paused games"
      );
    });

    it("should preserve DatabaseError when already a DatabaseError", async () => {
      // Arrange
      const dbError = new DatabaseError("Database connection failed");
      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "paused") {
          return Promise.reject(dbError);
        }
        return Promise.resolve([]);
      });

      // Act & Assert
      await expect(listPausedGames()).rejects.toThrow(DatabaseError);
      await expect(listPausedGames()).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("status filtering accuracy", () => {
    it("should filter correctly - listActiveGames excludes other statuses", async () => {
      // Arrange
      const mockGames: Game[] = [
        {
          id: 1,
          status: "active",
          created_at: Math.floor(Date.now() / 1000),
          updated_at: Math.floor(Date.now() / 1000),
        },
      ];

      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "active") {
          return Promise.resolve(mockGames);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listActiveGames();

      // Assert
      // Verify query uses correct status filter
      expect(testMockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining("status = ?"),
        ["active"]
      );
      expect(result.every((game) => game.status === "active")).toBe(true);
    });

    it("should filter correctly - listCompletedGames excludes other statuses", async () => {
      // Arrange
      const mockGames: Game[] = [
        {
          id: 1,
          status: "completed",
          created_at: Math.floor(Date.now() / 1000),
          updated_at: Math.floor(Date.now() / 1000),
        },
      ];

      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "completed") {
          return Promise.resolve(mockGames);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listCompletedGames();

      // Assert
      // Verify query uses correct status filter
      expect(testMockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining("status = ?"),
        ["completed"]
      );
      expect(result.every((game) => game.status === "completed")).toBe(true);
    });

    it("should filter correctly - listPausedGames excludes other statuses", async () => {
      // Arrange
      const mockGames: Game[] = [
        {
          id: 1,
          status: "paused",
          created_at: Math.floor(Date.now() / 1000),
          updated_at: Math.floor(Date.now() / 1000),
        },
      ];

      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "paused") {
          return Promise.resolve(mockGames);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listPausedGames();

      // Assert
      // Verify query uses correct status filter
      expect(testMockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining("status = ?"),
        ["paused"]
      );
      expect(result.every((game) => game.status === "paused")).toBe(true);
    });
  });

  describe("query ordering", () => {
    it("should order active games by created_at DESC", async () => {
      // Arrange
      const now = Math.floor(Date.now() / 1000);
      const mockGames: Game[] = [
        { id: 3, status: "active", created_at: now + 200, updated_at: now + 200 },
        { id: 2, status: "active", created_at: now + 100, updated_at: now + 100 },
        { id: 1, status: "active", created_at: now, updated_at: now },
      ];

      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "active") {
          return Promise.resolve(mockGames);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listActiveGames();

      // Assert
      expect(testMockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining("ORDER BY created_at DESC"),
        ["active"]
      );
      expect(result[0].id).toBe(3);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(1);
    });

    it("should order completed games by updated_at DESC", async () => {
      // Arrange
      const now = Math.floor(Date.now() / 1000);
      const mockGames: Game[] = [
        { id: 3, status: "completed", created_at: now, updated_at: now + 200 },
        { id: 2, status: "completed", created_at: now, updated_at: now + 100 },
        { id: 1, status: "completed", created_at: now, updated_at: now },
      ];

      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "completed") {
          return Promise.resolve(mockGames);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listCompletedGames();

      // Assert
      expect(testMockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining("ORDER BY updated_at DESC"),
        ["completed"]
      );
      expect(result[0].id).toBe(3);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(1);
    });

    it("should order paused games by created_at DESC", async () => {
      // Arrange
      const now = Math.floor(Date.now() / 1000);
      const mockGames: Game[] = [
        { id: 3, status: "paused", created_at: now + 200, updated_at: now + 200 },
        { id: 2, status: "paused", created_at: now + 100, updated_at: now + 100 },
        { id: 1, status: "paused", created_at: now, updated_at: now },
      ];

      testMockDb.getAllAsync.mockImplementation((query: string, params?: any[]) => {
        if (query && query.includes("sqlite_master")) {
          return Promise.resolve([
            { name: "games" },
            { name: "players" },
            { name: "score_entries" },
          ]);
        }
        if (query && query.includes("status = ?") && params && params[0] === "paused") {
          return Promise.resolve(mockGames);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await listPausedGames();

      // Assert
      expect(testMockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining("ORDER BY created_at DESC"),
        ["paused"]
      );
      expect(result[0].id).toBe(3);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(1);
    });
  });
});
