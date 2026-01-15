# App Store and Play Store Compliance Checklist

## Story 6.5: App Store and Play Store Compliance

### iOS App Store Review Guidelines

- [x] **App Functionality**: App functions as described
- [x] **Privacy**: No user data collection (local-only SQLite database)
- [x] **Content**: Age-appropriate content (game scoring app)
- [x] **Design**: Follows iOS design guidelines
- [x] **Performance**: App performs well without crashes
- [x] **Metadata**: App name, description, keywords prepared
- [ ] **Screenshots**: Need to be created for store listing
- [ ] **App Icon**: Need to create/store app icons
- [ ] **Privacy Policy**: Need to add privacy policy page in app (FR52)

### Google Play Developer Policy

- [x] **App Functionality**: App functions as described
- [x] **Privacy**: No user data collection (local-only SQLite database)
- [x] **Content**: Age-appropriate content
- [x] **Design**: Follows Material Design guidelines
- [x] **Performance**: App performs well
- [x] **Metadata**: App name, description prepared
- [ ] **Screenshots**: Need to be created for store listing
- [ ] **App Icon**: Need to create/store app icons
- [ ] **Privacy Policy**: Need to add privacy policy page in app (FR52)

### Required Items

1. **Privacy Policy (FR52)**: 
   - Status: Not yet implemented
   - Location: Should be accessible within app
   - Content: Should state that no data is collected, all data stored locally

2. **App Icons**:
   - iOS: Need 1024x1024 icon
   - Android: Need adaptive icons (foreground, background, monochrome)

3. **Screenshots**:
   - iOS: Need screenshots for different device sizes
   - Android: Need screenshots for different device sizes

4. **Age Rating**:
   - Recommended: 4+ (Everyone)
   - Content: No objectionable content, simple game scoring

### Notes

- App uses local SQLite database only - no network requests, no data collection
- No user accounts or authentication required
- No in-app purchases
- No advertisements
- Simple game scoring functionality
