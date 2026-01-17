# testID Requirements for E2E Testing

## Overview

All interactive UI elements must have `testID` attributes to enable reliable E2E testing with Maestro. This ensures tests work even when UI text, styling, or layout changes.

## Why testID?

1. **Reliability**: Tests don't break when text changes
2. **Maintainability**: Easier to update tests when UI evolves
3. **Accessibility**: testID can complement accessibility labels
4. **E2E Testing**: Required for Maestro to reliably select elements

## Requirements

### All Interactive Elements Must Have testID

- Buttons (`TouchableOpacity`, `Pressable`, `Button`)
- Text inputs (`TextInput`)
- Toggles and switches
- Navigation elements
- Cards and list items that are tappable
- Modal controls (close buttons, submit buttons)

### testID Naming Convention

Use kebab-case with descriptive names:

```tsx
// Good
testID="start-new-game-button"
testID="add-player-input"
testID="submit-score-button"
testID="player-card-alice"

// Bad
testID="btn1"
testID="input"
testID="card"
```

### testID Format

- Use descriptive names that indicate purpose
- Include element type when helpful (button, input, card)
- Use kebab-case (lowercase with hyphens)
- Be specific but concise

**Examples:**
- `start-new-game-button`
- `add-player-input`
- `player-name-input`
- `submit-score-button`
- `cancel-button`
- `player-card-{playerId}`
- `score-history-button`
- `close-modal-button`

## Implementation Checklist

When creating or updating components, ensure:

- [ ] All `TouchableOpacity` components have `testID`
- [ ] All `Pressable` components have `testID`
- [ ] All `TextInput` components have `testID`
- [ ] All tappable cards/list items have `testID`
- [ ] Modal action buttons have `testID`
- [ ] Navigation buttons have `testID`
- [ ] Form submit buttons have `testID`
- [ ] Form cancel buttons have `testID`

## Examples

### Button Component

```tsx
<TouchableOpacity
  testID="start-new-game-button"
  onPress={handleStartGame}
  accessibilityLabel="Start a new game"
  accessibilityRole="button"
>
  <Text>Start New Game</Text>
</TouchableOpacity>
```

### Text Input Component

```tsx
<TextInput
  testID="player-name-input"
  value={playerName}
  onChangeText={setPlayerName}
  placeholder="Enter player name"
  accessibilityLabel="Player name input"
/>
```

### Player Card Component

```tsx
<TouchableOpacity
  testID={`player-card-${player.id}`}
  onPress={() => handlePlayerPress(player)}
  accessibilityLabel={`${player.name}, Score: ${player.current_score}`}
  accessibilityRole="button"
>
  <Text>{player.name}</Text>
  <Text>{player.current_score}</Text>
</TouchableOpacity>
```

### Modal Actions

```tsx
<Modal visible={visible}>
  <View>
    <TouchableOpacity
      testID="submit-score-button"
      onPress={handleSubmit}
    >
      <Text>Submit</Text>
    </TouchableOpacity>
    <TouchableOpacity
      testID="cancel-score-entry-button"
      onPress={handleCancel}
    >
      <Text>Cancel</Text>
    </TouchableOpacity>
  </View>
</Modal>
```

## Using testID in Maestro

Once components have `testID` attributes, use them in Maestro flows:

```yaml
# Using testID
- tapOn:
    id: "start-new-game-button"

# Or using text (less reliable)
- tapOn: "Start New Game"
```

## Component Development Guidelines

When developing new components or updating existing ones:

1. **Add testID immediately**: Don't add it later, include it from the start
2. **Use descriptive names**: Make it clear what the element does
3. **Keep it consistent**: Follow the naming convention across the app
4. **Document in PR**: Mention testID additions in pull request descriptions

## Review Checklist

Before merging code:

- [ ] All new interactive elements have `testID`
- [ ] testID names follow naming convention
- [ ] testID names are descriptive and clear
- [ ] testID doesn't conflict with existing IDs
- [ ] E2E tests can use the testID (if applicable)

## Migration Strategy

For existing components without `testID`:

1. Prioritize critical user flows (game creation, score entry)
2. Add testID incrementally as components are updated
3. Update E2E flows to use testID as they're added
4. Document which components still need testID

## Resources

- [React Native testID Documentation](https://reactnative.dev/docs/view#testid)
- [Maestro Element Selection](https://maestro.mobile.dev/advanced/element-selection)
- [Testing Strategy Documentation](./testing-strategy.md)
