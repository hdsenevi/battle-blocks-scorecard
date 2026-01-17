# Maestro E2E Testing

This directory contains end-to-end (E2E) test flows for the Battle Blocks Scorecard app using [Maestro](https://maestro.mobile.dev/), the official Expo-recommended E2E testing tool.

## Installation

### macOS/Linux

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

### Verify Installation

```bash
maestro --version
```

The Maestro CLI should be installed and accessible from your terminal.

## Prerequisites

1. **Development Build Required**: Maestro works with Expo development builds, not Expo Go. You must build a development build before running tests:
   - iOS: `npx expo run:ios`
   - Android: `npx expo run:android`

2. **Simulator/Emulator Running**: Ensure an iOS Simulator or Android Emulator is running before executing tests.

3. **App Installed**: The development build must be installed on the simulator/emulator.

## Directory Structure

```
.maestro/
├── config.yaml          # Maestro configuration
├── README.md           # This file
└── flows/              # Test flow files
    └── example.yaml    # Example test flow
```

## Writing Test Flows

Test flows are written in YAML format. Each flow file in `flows/` represents a complete user journey.

### Example Flow Structure

```yaml
appId: com.battleblocks.scorecard
---
- launchApp
- assertVisible: "Start New Game"
- tapOn: "Start New Game"
- assertVisible: "Add Player"
```

### Key Maestro Commands

- `launchApp` - Launch the app
- `tapOn: "Text"` - Tap on an element containing text
- `assertVisible: "Text"` - Assert that text is visible
- `inputText: "text"` - Enter text into an input field
- `scroll` - Scroll the screen
- `back` - Navigate back
- `pressKey: Home` - Press a system key

See [Maestro Documentation](https://maestro.mobile.dev/) for complete command reference.

## Running Tests

### Run All Flows

```bash
maestro test .maestro/flows/
```

### Run Specific Flow

```bash
maestro test .maestro/flows/example.yaml
```

### Run on Specific Platform

```bash
# iOS
maestro test .maestro/flows/ --platform ios

# Android
maestro test .maestro/flows/ --platform android
```

## TestID Requirements

For reliable test selection, all interactive UI elements should have `testID` attributes. This ensures tests work even when UI text changes.

### Adding testID to Components

```tsx
<TouchableOpacity
  testID="start-new-game-button"
  onPress={handleStartGame}
>
  <Text>Start New Game</Text>
</TouchableOpacity>
```

### Using testID in Maestro

```yaml
- tapOn:
    id: "start-new-game-button"
```

## Best Practices

1. **Use testID for reliable selection**: Prefer `testID` over text matching for critical UI elements
2. **Keep flows focused**: Each flow should test a single user journey
3. **Use descriptive names**: Name flow files descriptively (e.g., `create-new-game.yaml`)
4. **Test on both platforms**: Ensure flows work on both iOS and Android
5. **Handle async operations**: Use `waitForAnimationToEnd` or `waitFor` when needed

## Troubleshooting

### App Not Found

- Ensure development build is installed: `npx expo run:ios` or `npx expo run:android`
- Verify simulator/emulator is running
- Check that app bundle ID matches configuration

### Elements Not Found

- Verify `testID` attributes are set on interactive elements
- Check that text matches exactly (case-sensitive)
- Use Maestro Studio for visual debugging: `maestro studio`

### Tests Failing

- Run Maestro Studio to see what's happening: `maestro studio`
- Check app logs for errors
- Verify app is in expected state before test starts

## Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro GitHub](https://github.com/mobile-dev-inc/maestro)
- [Expo E2E Testing Guide](https://docs.expo.dev/develop/testing/end-to-end-testing/)
