# Test Patterns and Guidelines

## Overview

This document establishes testing patterns and guidelines for the Battle Blocks Scorecard project. All tests should follow these patterns to ensure consistency, maintainability, and reliability.

## Test Organization

### File Location

Tests are co-located with source files in `__tests__/` directories:

```
src/
├── services/
│   ├── __tests__/
│   │   ├── gameRules.test.ts
│   │   └── database.test.ts
│   ├── gameRules.ts
│   └── database.ts
├── utils/
│   ├── __tests__/
│   │   └── platform.test.ts
│   └── platform.ts
└── reducers/
    ├── __tests__/
    │   └── gameReducer.test.ts
    └── gameReducer.ts
```

### File Naming

- Unit tests: `*.test.ts` (TypeScript)
- Component tests: `*.test.tsx` (TypeScript + JSX)
- Integration tests: `*.integration.test.ts` or `*.integration.test.tsx`

## Arrange-Act-Assert Pattern

All tests should follow the **Arrange-Act-Assert** (AAA) pattern:

```typescript
describe('gameRules.calculateScore', () => {
  it('should calculate score correctly for single block', () => {
    // Arrange
    const blocks = [12];
    const isMultiple = false;
    const expectedScore = 12;

    // Act
    const result = calculateScore(blocks, isMultiple);

    // Assert
    expect(result).toBe(expectedScore);
  });
});
```

### Arrange Section
- Set up test data
- Configure mocks
- Initialize variables
- Prepare the test environment

### Act Section
- Execute the function/method being tested
- Perform the action
- Keep it to a single action when possible

### Assert Section
- Verify the result
- Check side effects
- Validate state changes
- Use descriptive assertions

## Test Naming Conventions

### Describe Blocks

Use descriptive names that indicate what is being tested:

```typescript
// Good
describe('gameRules.calculateScore', () => {
describe('database.createGame', () => {
describe('gameReducer - START_GAME action', () => {

// Bad
describe('calculateScore', () => {
describe('test1', () => {
```

### Test Cases (it blocks)

Use descriptive names that explain the expected behavior:

```typescript
// Good
it('should return 25 when score exceeds 50', () => {
it('should throw error when game ID is invalid', () => {
it('should update player score correctly', () => {
it('should handle empty blocks array', () => {

// Bad
it('works', () => {
it('test1', () => {
it('calculates score', () => {
```

### Test Name Format

Use the format: `should [expected behavior] when [condition]`

Examples:
- `should return true when score exceeds 50`
- `should throw error when player ID is missing`
- `should reset consecutive misses when score is entered`
- `should return null when no leader exists`

## Mock Patterns

### Database Service Mock

Use the database mock utilities from `src/__tests__/mocks/database.ts`:

```typescript
import { createDatabaseMock } from '@/__tests__/mocks/database';

describe('GameService', () => {
  const dbMock = createDatabaseMock();

  beforeEach(() => {
    dbMock.reset();
    jest.clearAllMocks();
  });

  it('should create game successfully', async () => {
    // Arrange
    const gameData = { status: 'active' };

    // Act
    const game = await dbMock.createGame(gameData);

    // Assert
    expect(dbMock.createGame).toHaveBeenCalledWith(gameData);
    expect(game.id).toBeDefined();
    expect(game.status).toBe('active');
  });
});
```

### Haptics Service Mock

Use the haptics mock utilities from `src/__tests__/mocks/haptics.ts`:

```typescript
import { createHapticsMock } from '@/__tests__/mocks/haptics';

describe('ScoreEntry', () => {
  const hapticsMock = createHapticsMock();

  beforeEach(() => {
    jest.mock('@/services/haptics', () => hapticsMock);
    hapticsMock.reset();
  });

  it('should trigger haptic feedback on score entry', () => {
    // Arrange
    const score = 5;

    // Act
    enterScore(score);

    // Assert
    expect(hapticsMock.triggerScoreEntry).toHaveBeenCalled();
  });
});
```

### Mocking Modules

```typescript
// Mock at the top of the test file
jest.mock('@/services/database', () => ({
  createGame: jest.fn(),
  getGame: jest.fn(),
  updateGame: jest.fn(),
}));

// Or use the mock utilities
import { createDatabaseMock } from '@/__tests__/mocks/database';
const dbMock = createDatabaseMock();
jest.mock('@/services/database', () => dbMock);
```

## Test Data Factories

Use factory functions to create test data:

```typescript
import { createMockGame, createMockPlayer } from '@/__tests__/mocks/database';

// Good
const game = createMockGame({ status: 'active' });
const player = createMockPlayer({ name: 'Alice', current_score: 25 });

// Bad
const game = {
  id: 1,
  status: 'active',
  created_at: '2024-01-01',
  // ... many more fields
};
```

## Coverage Requirements

### Services: 100% Coverage
- All functions must be tested
- All branches must be covered
- All edge cases must be tested
- Error scenarios must be tested

### Utilities: 100% Coverage
- All utility functions must be tested
- All conditional logic must be covered
- Edge cases must be tested

### Reducers: 100% Coverage
- All actions must be tested
- All state transitions must be covered
- State immutability must be verified
- Error handling must be tested

## Test Performance

### Execution Time Requirements
- **Unit tests**: < 5 seconds for full suite
- **Individual test**: < 100ms per test
- **Component tests**: < 30 seconds for full suite

### Performance Best Practices
1. Use mocks instead of real implementations
2. Avoid async operations when possible
3. Use `beforeEach` and `afterEach` efficiently
4. Clean up resources after tests
5. Avoid unnecessary waits or timeouts

## Testing Edge Cases

Always test:
- **Empty inputs**: Empty arrays, null, undefined
- **Boundary values**: Min/max values, edge of ranges
- **Error conditions**: Invalid inputs, missing data
- **State transitions**: Before/after state changes
- **Concurrent operations**: Multiple calls, race conditions (if applicable)

Example:

```typescript
describe('calculateScore edge cases', () => {
  it('should handle empty blocks array', () => {
    expect(calculateScore([], false)).toBe(0);
  });

  it('should handle null blocks', () => {
    expect(() => calculateScore(null as any, false)).toThrow();
  });

  it('should handle very large block values', () => {
    expect(calculateScore([999], false)).toBe(999);
  });
});
```

## State Immutability Testing

For reducers, always verify state immutability:

```typescript
describe('gameReducer - ADD_SCORE action', () => {
  it('should not mutate original state', () => {
    // Arrange
    const initialState = { players: [{ id: 1, score: 10 }] };
    const originalState = JSON.parse(JSON.stringify(initialState));

    // Act
    const newState = gameReducer(initialState, addScoreAction(1, 5));

    // Assert
    expect(initialState).toEqual(originalState);
    expect(newState).not.toBe(initialState);
    expect(newState.players[0].score).toBe(15);
  });
});
```

## Error Handling Tests

Always test error scenarios:

```typescript
describe('database.getGame', () => {
  it('should throw error when game ID is invalid', async () => {
    // Arrange
    const invalidId = -1;

    // Act & Assert
    await expect(getGame(invalidId)).rejects.toThrow('Invalid game ID');
  });

  it('should return null when game does not exist', async () => {
    // Arrange
    const nonExistentId = 999;

    // Act
    const result = await getGame(nonExistentId);

    // Assert
    expect(result).toBeNull();
  });
});
```

## Test Structure Template

```typescript
/**
 * [Component/Service/Utility] Tests
 * Brief description of what is being tested
 */

import { functionToTest } from '../module';

describe('ModuleName.functionToTest', () => {
  // Setup (if needed)
  beforeEach(() => {
    // Setup code
  });

  afterEach(() => {
    // Cleanup code
  });

  describe('happy path', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = functionToTest(input);

      // Assert
      expect(result).toBe('expected');
    });
  });

  describe('edge cases', () => {
    it('should handle empty input', () => {
      // Test edge case
    });
  });

  describe('error cases', () => {
    it('should throw error when input is invalid', () => {
      // Test error case
    });
  });
});
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Strategy Documentation](./testing-strategy.md)
- [Test Coverage Requirements](./testing-strategy.md#coverage-requirements)
