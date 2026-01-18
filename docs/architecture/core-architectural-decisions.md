# Core Architectural Decisions

## Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. Local data persistence solution (SQLite via expo-sqlite)
2. State management approach (React Context + useReducer)
3. Component architecture organization (Hybrid approach)
4. Rule enforcement logic structure (Service/Utility Functions)
5. Haptic feedback integration (Haptic Service/Utility)

**Important Decisions (Shape Architecture):**
- NativeWind configuration and setup
- Error handling and recovery patterns
- App lifecycle management
- Testing strategy and automation framework (Jest + React Native Testing Library + Maestro)

**Deferred Decisions (Post-MVP):**
- Game history querying patterns (Phase 2)
- Statistics calculation optimization (Phase 2)
- Advanced state management if needed (if Context becomes insufficient)

## Data Architecture

**Decision: SQLite via expo-sqlite**

**Version:** Compatible with Expo SDK ~54.0

**Rationale:**
- Relational database structure fits game state, players, scores, and game history
- Supports complex queries for future game history features (Phase 2)
- Fast and reliable for 100% data persistence requirement
- Supports database migrations for schema evolution
- Better than AsyncStorage for relational data (games, players, score entries)

**Implementation Approach:**
- Database schema: `games`, `players`, `score_entries` tables
- Database service layer: `src/services/database.ts` for all SQLite operations
- Automatic migrations for schema changes
- Transaction support for data integrity
- Error handling and recovery mechanisms

**Affects:**
- Game state persistence
- Active game storage
- Completed game history
- App lifecycle handling (backgrounding, termination)

## State Management

**Decision: React Context + useReducer**

**Version:** Built into React (no additional dependencies)

**Rationale:**
- No extra dependencies, keeps bundle size small
- Sufficient for game state complexity (players, scores, game status)
- Simple for solo developer to understand and maintain
- Good TypeScript support
- Can migrate to Zustand later if state becomes more complex

**Implementation Approach:**
- Game context: `src/contexts/GameContext.tsx` with game state
- Reducer: `src/reducers/gameReducer.ts` for state updates
- Actions: Type-safe action creators for state mutations
- Provider: Wrap app with GameProvider for state access

**State Structure:**
- Current game (active or null)
- Players array with scores
- Game status (active, completed, paused)
- Leader identification
- Rule enforcement triggers

**Affects:**
- Real-time score updates
- Rule enforcement UI updates
- Component state synchronization
- Performance optimization needs

## Component Architecture

**Decision: Hybrid Approach (UI components + Feature-based organization)**

**Rationale:**
- Clear separation between reusable UI and game-specific logic
- Easy to find and maintain components
- Supports NativeWind styling patterns
- Scalable for future features

**Structure:**
```
src/components/
  ui/              # Reusable UI components
    Button.tsx
    Card.tsx
    Input.tsx
  game/            # Game-specific components
    PlayerCard.tsx
    ScoreEntry.tsx
    RuleIndicator.tsx
    GameStatus.tsx
app/               # Screen-level components (Expo Router)
  game/[id]/index.tsx
  game/[id]/winner.tsx
  (tabs)/index.tsx
```

**Affects:**
- Code organization and maintainability
- Component reusability
- Styling with NativeWind
- Developer experience

## Rule Enforcement Logic

**Decision: Service/Utility Functions**

**Rationale:**
- Pure functions are easy to test (critical for 100% accuracy requirement)
- Clear separation from UI components
- No React dependencies in business logic
- Can be called from hooks, components, or tests
- Simple for solo developer

**Implementation Approach:**
- Service file: `src/services/gameRules.ts`
- Functions: `checkPenaltyRule()`, `checkElimination()`, `checkWinCondition()`, `calculateScore()`
- Pure functions: Input game state, return rule results
- Type-safe with TypeScript interfaces
- Comprehensive unit tests for 100% accuracy

**Functions:**
- `checkPenaltyRule(score: number): boolean` - Returns true if score exceeds 50
- `checkElimination(consecutiveMisses: number): boolean` - Returns true if 3+ misses
- `checkWinCondition(score: number): boolean` - Returns true if exactly 50
- `calculateScore(blocks: number[], isMultiple: boolean): number` - Calculates score based on rules

**Affects:**
- Product differentiator (automatic rule enforcement)
- Testability and reliability
- UI component integration
- Business logic maintainability

## Haptic Feedback Integration

**Decision: Haptic Service/Utility**

**Version:** expo-haptics (included with Expo SDK ~54.0)

**Rationale:**
- Centralized haptic patterns for consistency
- Easy to adjust haptic types across the app
- Can be called from rule enforcement functions
- Better organization than scattered API calls

**Implementation Approach:**
- Service file: `src/services/haptics.ts`
- Functions: `triggerScoreEntry()`, `triggerPenalty()`, `triggerCompletion()`, `triggerError()`
- Haptic types: Light impact (score entry), Medium impact (penalty), Success pattern (completion), Error (invalid actions)
- < 50ms trigger time requirement

**Functions:**
- `triggerScoreEntry()` - Light haptic for normal score entry
- `triggerPenalty()` - Strong haptic for 50+ penalty rule
- `triggerCompletion()` - Success pattern for game completion
- `triggerError()` - Error haptic for invalid actions

**Affects:**
- User experience and emotional response
- Rule enforcement feedback
- Accessibility (haptic supplements visual feedback)
- Performance (< 50ms requirement)

## Testing Architecture

**Decision: Multi-Layer Testing Strategy**

**Tools:**
- **Jest** (v30.2.0) + **React Native Testing Library** (v13.3.3) - Unit and component testing
- **Maestro** - End-to-end testing (Expo-recommended)

**Rationale:**
- Fast feedback with unit/component tests
- Confidence with E2E tests for critical user journeys
- Expo officially recommends Maestro for E2E testing
- Jest already established in project

**Implementation Approach:**
- **Unit Tests**: 100% coverage for services, reducers, utilities
- **Component Tests**: 80% coverage for UI and game components
- **E2E Tests**: Critical user journeys in `.maestro/flows/`
- Test organization: `src/**/__tests__/` for unit/component tests
- E2E flows: YAML-based flows in `.maestro/flows/`

**Test Layers:**
1. Unit tests (Jest) - Pure functions, business logic
2. Component tests (React Native Testing Library) - React components
3. Integration tests (Jest + RTL) - Component + service integration
4. E2E tests (Maestro) - Complete user journeys

**Affects:**
- Code quality and confidence
- Development workflow
- CI/CD pipeline
- Long-term maintainability

## Decision Impact Analysis

**Implementation Sequence:**
1. Database schema and SQLite setup (foundation for all data operations)
2. Game rules service (core business logic, must be tested)
3. State management (React Context + reducer)
4. Haptic service (user feedback)
5. Component architecture implementation
6. Integration and testing

**Cross-Component Dependencies:**
- Database service used by state management for persistence
- Game rules service called from state reducer for rule enforcement
- Haptic service called from game rules and UI components
- State management provides data to all UI components
- Components trigger state updates through context actions
