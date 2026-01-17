# Testing Strategy & Automation Architecture

## Overview

This document defines the comprehensive testing strategy for Battle Blocks Scorecard, establishing a multi-layered testing approach that prevents regressions and ensures quality as the application evolves.

**Last Updated:** 2026-01-15  
**Status:** Active  
**Version:** 1.0

## Testing Philosophy

**Core Principles:**
- **Integrated Testing**: Automation tests are part of every story, not a separate epic
- **Prevent Regressions**: Every story includes tests that prevent future regressions
- **Test Pyramid**: Unit tests (base) → Component tests (middle) → E2E tests (top)
- **Fast Feedback**: Unit and component tests run quickly in CI/CD
- **Confidence**: E2E tests validate critical user journeys
- **Maintainability**: Tests are as important as production code
- **Story-Level Testing**: Each story's acceptance criteria includes automation test requirements

## Testing Layers

### Layer 1: Unit Tests (Jest)

**Purpose:** Test pure functions, business logic, and utilities in isolation.

**Tools:**
- **Jest** (v30.2.0) - Test runner and assertion library
- **@testing-library/jest-native** (v5.4.3) - React Native-specific matchers

**Coverage:**
- Services (`src/services/`) - **100% coverage required**
  - `gameRules.ts` - All rule enforcement functions
  - `database.ts` - Database operations (mocked)
  - `haptics.ts` - Haptic service functions
- Reducers (`src/reducers/`) - **100% coverage required**
  - `gameReducer.ts` - All action handlers
- Utilities (`src/utils/`) - **100% coverage required**
  - `validation.ts`, `formatting.ts`, `platform.ts`, `accessibility.ts`
- Hooks (`src/hooks/`) - Core logic coverage
  - `useAppLifecycle.ts` - Lifecycle logic

**Coverage Requirements:**
- All service functions: 100% coverage (branches, functions, lines, statements)
- All utility functions: 100% coverage (branches, functions, lines, statements)
- All reducer actions: 100% coverage (branches, functions, lines, statements)
- Coverage thresholds enforced in `jest.config.js`
- Coverage reports generated in `coverage/` directory (HTML, text, JSON, lcov)

**Location:** `src/**/__tests__/*.test.ts` or `*.test.tsx`

**Example Structure:**
```
src/services/__tests__/
  ├── gameRules.test.ts
  ├── database.test.ts
  └── haptics.test.ts
```

**Standards:**
- Pure functions must have 100% test coverage
- All edge cases must be tested
- Tests must be fast (< 100ms per test)
- Tests must be deterministic (no flakiness)

### Layer 2: Component Tests (React Native Testing Library)

**Purpose:** Test React components in isolation, verifying UI behavior and user interactions.

**Tools:**
- **@testing-library/react-native** (v13.3.3) - Component testing utilities
- **@testing-library/jest-native** (v5.4.3) - React Native matchers
- **Jest** - Test runner

**Coverage:**
- UI Components (`src/components/ui/`) - Core interactions
- Game Components (`src/components/game/`) - Game-specific behavior
- Context Providers (`src/contexts/`) - State management
- Screen Components (`app/`) - Screen-level integration

**Location:** `src/**/__tests__/*.test.tsx`

**Example Structure:**
```
src/components/game/__tests__/
  ├── PlayerCard.test.tsx
  ├── ScoreEntryModal.test.tsx
  └── ScoreHistory.test.tsx
```

**Standards:**
- Test user interactions (taps, inputs, navigation)
- Test accessibility (testID, accessibility labels)
- Test conditional rendering
- Mock external dependencies (database, haptics)
- Use `testID` for reliable element selection

### Layer 3: Integration Tests (Jest + React Native Testing Library)

**Purpose:** Test component integration with services, context, and database.

**Coverage:**
- Context + Service integration
- Database service with mocked SQLite
- App lifecycle handlers
- Navigation flows

**Location:** `src/**/__tests__/*.integration.test.tsx`

**Standards:**
- Test real component interactions
- Use real context providers
- Mock external dependencies (SQLite, haptics)
- Verify data flow between layers

### Layer 4: End-to-End Tests (Maestro)

**Purpose:** Test complete user journeys from start to finish on real simulators/emulators.

**Tools:**
- **Maestro** - E2E testing framework (recommended by Expo)
- **Expo EAS Build** - For creating test builds

**Coverage:**
- Critical user journeys (happy paths)
- Cross-platform flows (iOS and Android)
- Complete game flows (create → play → complete)
- Error scenarios and edge cases

**Location:** `.maestro/` directory at project root

**Example Structure:**
```
.maestro/
  ├── flows/
  │   ├── create-new-game.yaml
  │   ├── enter-scores.yaml
  │   ├── complete-game.yaml
  │   └── resume-game.yaml
  │
  ├── config.yaml
  └── README.md
```

**Standards:**
- One flow file per critical user journey
- Flows should be independent and runnable in parallel
- Use `testID` for reliable element selection
- Include assertions for expected outcomes
- Document setup requirements

## Tool Selection Rationale

### Why Maestro for E2E Testing?

**Decision:** Maestro is the official Expo-recommended E2E testing tool.

**Rationale:**
1. **Expo Integration**: First-class support for Expo managed workflow
2. **EAS Compatibility**: Works seamlessly with EAS Build workflows
3. **Simplicity**: YAML-based flows are easy to write and maintain
4. **Performance**: Fast execution compared to Appium
5. **Official Support**: Expo documentation recommends Maestro
6. **Low Maintenance**: Minimal setup and configuration overhead

**Alternatives Considered:**
- **Detox**: Requires custom dev builds, Expo support is brittle
- **Appium**: Slower, more complex setup, less Expo-friendly

### Why Jest + React Native Testing Library?

**Decision:** Already established in the project, industry standard.

**Rationale:**
1. **Already Configured**: Project has Jest and React Native Testing Library
2. **Industry Standard**: Widely used in React Native community
3. **Expo Compatible**: Works out of the box with Expo projects
4. **Fast Execution**: Unit and component tests run quickly
5. **Good DX**: Excellent developer experience and tooling

## Test Organization Structure

### Unit Test Organization

Tests are co-located with source files in `__tests__/` directories:

```
src/
├── services/
│   ├── __tests__/
│   │   ├── gameRules.test.ts
│   │   ├── database.test.ts
│   │   └── haptics.test.ts
│   ├── gameRules.ts
│   ├── database.ts
│   └── haptics.ts
├── utils/
│   ├── __tests__/
│   │   ├── platform.test.ts
│   │   └── accessibility.test.ts
│   ├── platform.ts
│   └── accessibility.ts
└── reducers/
    ├── __tests__/
    │   └── gameReducer.test.ts
    └── gameReducer.ts
```

### Test File Naming Convention

- Unit tests: `*.test.ts` (TypeScript)
- Component tests: `*.test.tsx` (TypeScript + JSX)
- Integration tests: `*.integration.test.ts` or `*.integration.test.tsx`

### E2E Test Organization

```
battle-blocks-scorecard/
├── .maestro/                      # E2E test flows
│   ├── flows/
│   │   ├── 01-create-game.yaml
│   │   ├── 02-add-players.yaml
│   │   ├── 03-enter-scores.yaml
│   │   ├── 04-rule-enforcement.yaml
│   │   ├── 05-complete-game.yaml
│   │   └── 06-resume-game.yaml
│   ├── config.yaml
│   └── README.md
│
├── src/
│   ├── services/
│   │   └── __tests__/
│   │       ├── gameRules.test.ts
│   │       ├── database.test.ts
│   │       └── haptics.test.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   └── __tests__/
│   │   │       └── Button.test.tsx
│   │   └── game/
│   │       └── __tests__/
│   │           ├── PlayerCard.test.tsx
│   │           └── ScoreEntryModal.test.tsx
│   │
│   ├── contexts/
│   │   └── __tests__/
│   │       └── GameContext.test.tsx
│   │
│   ├── reducers/
│   │   └── __tests__/
│   │       └── gameReducer.test.ts
│   │
│   ├── hooks/
│   │   └── __tests__/
│   │       └── useAppLifecycle.test.tsx
│   │
│   └── utils/
│       └── __tests__/
│           ├── validation.test.ts
│           └── platform.test.ts
│
└── jest.config.js                  # Jest configuration
```

## Test Coverage Requirements

### Minimum Coverage Targets

| Layer | Target Coverage | Critical Areas |
|-------|----------------|----------------|
| **Services** | 100% | gameRules.ts, database.ts |
| **Reducers** | 100% | gameReducer.ts |
| **Utilities** | 100% | All utility functions |
| **Components** | 80% | User interactions, edge cases |
| **Hooks** | 90% | Core logic paths |
| **E2E** | Critical paths | All user journeys |

### Critical Test Scenarios

**Must Always Pass:**
1. Game rule enforcement (50+ penalty, elimination, win condition)
2. Score calculation (single block, multiple blocks)
3. Database persistence (save, restore, transactions)
4. App lifecycle (background, foreground, termination)
5. Player management (add, update, eliminate)
6. Game state transitions (active → completed, active → paused)

## Test Execution Strategy

### Local Development

**Unit & Component Tests:**
```bash
pnpm test                    # Run all tests
pnpm test --watch            # Watch mode
pnpm test --coverage         # With coverage report
pnpm test gameRules          # Run specific test file
```

**E2E Tests:**
```bash
maestro test .maestro/flows/  # Run all E2E flows
maestro test .maestro/flows/01-create-game.yaml  # Run specific flow
```

### CI/CD Integration

**Pre-commit Hooks:**
- Run linting
- Run unit tests (fast subset)
- Run affected component tests

**Pull Request:**
- Run all unit tests
- Run all component tests
- Run integration tests
- Generate coverage report
- Run E2E tests (on merge to main)

**Main Branch:**
- Full test suite (all layers)
- E2E tests on both iOS and Android
- Coverage reports
- Performance benchmarks

## Test Data Management

### Unit & Component Tests
- Use factories for test data creation
- Mock external dependencies (database, haptics)
- Use test fixtures for complex data structures
- Reset state between tests

### E2E Tests
- Use fresh app state for each flow
- Clean database before critical flows
- Use test-specific game data
- Document test data requirements

## Accessibility Testing

**Requirements:**
- All interactive elements must have `testID`
- Screen reader labels must be tested
- Touch target sizes must be verified
- Color contrast must meet WCAG AA standards

**Tools:**
- React Native Testing Library accessibility queries
- Manual testing with screen readers
- Automated contrast checking (future)

## Performance Testing

**Metrics to Track:**
- Test execution time (unit tests < 5s, component tests < 30s)
- E2E test execution time (< 5 minutes for full suite)
- App startup time (measured in E2E tests)
- Database operation performance

## Continuous Improvement

**Process:**
1. Review test coverage after each story
2. Add regression tests for bugs found
3. Refactor tests when patterns emerge
4. Update E2E flows when UI changes
5. Document new testing patterns

## Testing Best Practices

### Writing Tests

1. **Arrange-Act-Assert Pattern**: Clear test structure
2. **Descriptive Names**: Test names describe what is being tested
3. **One Assertion Per Test**: Focus on single behavior
4. **Test Behavior, Not Implementation**: Test what users see/experience
5. **Use testID**: Reliable element selection in E2E tests

### Maintaining Tests

1. **Keep Tests Fast**: Unit tests should run in milliseconds
2. **Avoid Flakiness**: No random data, no timing dependencies
3. **Update Tests with Code**: Tests are part of the codebase
4. **Delete Obsolete Tests**: Remove tests for removed features
5. **Document Complex Tests**: Explain why tests exist

### E2E Test Guidelines

1. **Independent Flows**: Each flow should run independently
2. **Clear Assertions**: Verify expected outcomes explicitly
3. **Error Handling**: Test error scenarios, not just happy paths
4. **Platform Coverage**: Test on both iOS and Android
5. **Maintainability**: Keep flows simple and readable

## Integration with Development Workflow

### Story Development Process

1. **Story Planning**: Identify test scenarios (part of story acceptance criteria)
2. **Implementation**: Write tests alongside code (TDD when possible)
3. **Review**: Verify tests cover acceptance criteria (automation tests are part of AC)
4. **Completion**: All tests pass, coverage meets targets, automation tests included

### Testing Infrastructure Setup

**Epic 1 Stories 1.9-1.12** establish the testing infrastructure:
- Story 1.9: Maestro E2E framework setup
- Story 1.10: Unit test infrastructure enhancement
- Story 1.11: Component test infrastructure enhancement
- Story 1.12: CI/CD integration

**All subsequent stories** include automation test requirements in their acceptance criteria.

### Regression Prevention

**Process:**
- Every bug fix must include a regression test
- Every new feature must include tests
- E2E tests must cover critical user journeys
- Review test failures before fixing code

## Future Enhancements

**Potential Additions:**
- Visual regression testing (screenshots)
- Performance benchmarking automation
- Accessibility automated scanning
- Cross-device testing (physical devices)
- Test reporting dashboard
- Mutation testing for test quality

## References

- [Expo E2E Testing Documentation](https://docs.expo.dev/eas/workflows/reference/e2e-tests/)
- [Maestro Documentation](https://maestro.mobile.dev/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/)

---

**Document Status:** Active  
**Next Review:** After Epic 7 implementation
