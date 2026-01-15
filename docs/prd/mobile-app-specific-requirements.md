# Mobile App Specific Requirements

## Project-Type Overview

Cross-platform mobile app (React Native/Expo) for iOS and Android. Fully offline utility for tracking Battle Blocks scores with local database persistence.

## Platform Requirements

**Target Platforms:**
- **iOS**: App Store deployment (iOS 13.0+)
- **Android**: Google Play Store deployment (Android 6.0+ / API level 23+)

**Cross-Platform Strategy:**
- React Native with Expo framework for unified codebase
- Single codebase targeting both platforms
- Platform-specific UI adjustments as needed for native feel
- Simultaneous launch on both platforms (no platform-first strategy)

**Technical Stack:**
- React Native 0.81.5
- Expo SDK ~54.0
- TypeScript for type safety
- Expo Router for navigation

## Device Permissions

**Required Permissions:**
- **Storage**: Local database access for game data persistence
  - iOS: No special permissions needed (sandboxed app storage)
  - Android: Storage permission for local database (handled by Expo)

**No Required Permissions:**
- Camera (not needed)
- Location (not needed)
- Contacts (not needed)
- Network access (fully offline)

**Device Features:**
- **Touch Input**: Standard touch interactions for UI navigation and score entry
- **Haptic Feedback**: 
  - Score entry confirmation (light haptic)
  - 50+ penalty rule violation (strong haptic)
  - Game completion/winner announcement (success haptic pattern)
  - Error states (error haptic)
- **Screen Orientation**: Portrait mode primary (landscape optional for future)

## Offline Mode

**Fully Offline Operation:**
- Functions without internet connectivity
- All game data stored locally
- No network requests or cloud sync in MVP

**Local Database Strategy:**
- Use popular React Native storage mechanism (e.g., AsyncStorage, SQLite via expo-sqlite, or Realm)
- Store game state, player data, and game history locally
- Data persists across app restarts
- No data loss scenarios (critical requirement)

**Data Persistence Requirements:**
- Active games must survive app closure and restart
- Completed games stored in local history
- Player statistics calculated from local data
- No external dependencies for data access

## Push Strategy

**Push Notifications:**
- Not required for MVP
- No push notification infrastructure needed
- No remote notification services integration
- Focus on in-app experience only

**Future Considerations:**
- Push notifications may be considered for Growth phase (game reminders, turn notifications)
- Not part of initial release scope

## Store Compliance

**App Store (iOS) Requirements:**
- App Store Review Guidelines compliance
- Privacy policy (required for apps that collect/store user data)
- App Store listing materials (screenshots, description, keywords)
- Age rating appropriate for game utility (likely 4+ or 9+)
- No in-app purchases required for MVP
- No subscription model in MVP

**Google Play Store (Android) Requirements:**
- Google Play Developer Policy compliance
- Privacy policy (required for data collection)
- Play Store listing materials
- Content rating (likely Everyone)
- Target API level compliance (Android 6.0+)
- No in-app purchases required for MVP

**Privacy & Data Handling:**
- Privacy policy required (even for local-only data)
- Clear data handling disclosure
- No user data collection beyond local game data
- No analytics or tracking in MVP (optional for Growth)
- GDPR compliance considerations if targeting EU users

**Compliance Checklist:**
- [ ] Privacy policy document created
- [ ] App Store listing materials prepared
- [ ] Play Store listing materials prepared
- [ ] Age/content rating determined
- [ ] App icons and screenshots prepared
- [ ] Terms of service (if required)
- [ ] Data handling disclosure in app

## Implementation Considerations

**React Native/Expo Best Practices:**
- Use Expo managed workflow for simplified deployment
- Leverage Expo SDK components and APIs
- Follow React Native performance best practices
- Optimize for both iOS and Android platforms
- Test on physical devices for both platforms

**Local Storage Implementation:**
- Choose storage solution based on data complexity:
  - Simple key-value: AsyncStorage
  - Relational data: expo-sqlite or Realm
  - Consider data migration strategy for future updates
- Implement proper error handling for storage operations
- Ensure data integrity and backup/recovery mechanisms

**Haptic Feedback Implementation:**
- Use Expo Haptics API for cross-platform haptic feedback
- Implement haptic patterns for different event types:
  - Light impact for score entry
  - Medium impact for rule violations
  - Success pattern for game completion
  - Error pattern for invalid actions
- Respect user's system haptic settings (iOS)

**Performance Considerations:**
- Optimize for instant score updates (< 100ms)
- Smooth UI transitions and animations
- Efficient local database queries
- Minimal memory footprint
- Fast app startup time

**Testing Requirements:**
- Test on both iOS and Android devices
- Test offline functionality thoroughly
- Test data persistence across app restarts
- Test haptic feedback on physical devices
- Test store submission process early
