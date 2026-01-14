# Visual Design Foundation

## Color System

**Color Strategy:**
Family-friendly, age-inclusive color palette that supports emotional goals of confidence, trust, and relief. Colors are high-contrast, accessible, and clearly distinguish game states.

**Primary Color Palette:**
- **Primary**: Blue (#3B82F6) - Trust, reliability, confidence
- **Secondary**: Green (#10B981) - Success, positive feedback, game completion
- **Accent**: Orange (#F59E0B) - Attention, warnings, rule enforcement indicators
- **Neutral**: Gray scale (50-900) - Text, backgrounds, borders

**Semantic Color Mapping:**
- **Primary/Active**: Blue (#3B82F6) - Primary actions, active player indicator
- **Success**: Green (#10B981) - Game completion, successful actions
- **Warning/Attention**: Orange (#F59E0B) - Rule enforcement (50+ penalty), important notices
- **Error**: Red (#EF4444) - Errors, invalid inputs, eliminated players
- **Info**: Blue (#3B82F6) - Informational messages, game state indicators
- **Background**: White (#FFFFFF) - Primary background
- **Surface**: Gray-50 (#F9FAFB) - Card backgrounds, elevated surfaces
- **Text Primary**: Gray-900 (#111827) - Main text, high contrast
- **Text Secondary**: Gray-600 (#4B5563) - Secondary text, labels
- **Border**: Gray-200 (#E5E7EB) - Dividers, borders

**Game State Colors:**
- **Leader**: Blue accent (#3B82F6) with subtle background highlight
- **Active Player**: Blue border or indicator
- **Eliminated Player**: Gray-400 (#9CA3AF) with reduced opacity
- **Rule Enforcement**: Orange (#F59E0B) for 50+ penalty, Red (#EF4444) for elimination

**Accessibility Compliance:**
- All text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Color coding supplemented with icons, text labels, and other indicators
- High contrast mode support through system settings

**Dark Mode Consideration:**
- Support system dark mode preferences
- Maintain contrast ratios in dark mode
- Adjust game state colors for dark backgrounds

## Typography System

**Typography Strategy:**
System fonts for native feel, accessibility, and performance. Large, readable sizes suitable for ages 6+ with clear hierarchy for scores, labels, and actions.

**Font Family:**
- **Primary**: System fonts
  - iOS: San Francisco (SF Pro)
  - Android: Roboto
  - Fallback: System default sans-serif
- **Rationale**: Native feel, automatic accessibility support, no font loading overhead

**Type Scale:**
- **Display/Score**: 48px (3rem) - Large, prominent scores
- **H1/Title**: 32px (2rem) - Screen titles, game headers
- **H2/Subtitle**: 24px (1.5rem) - Section headers, player names
- **H3**: 20px (1.25rem) - Subsection headers
- **Body Large**: 18px (1.125rem) - Important body text
- **Body**: 16px (1rem) - Standard body text, labels
- **Body Small**: 14px (0.875rem) - Secondary information, metadata
- **Caption**: 12px (0.75rem) - Fine print, timestamps

**Font Weights:**
- **Regular (400)**: Body text, labels
- **Medium (500)**: Emphasis, buttons
- **Semibold (600)**: Headings, important labels
- **Bold (700)**: Scores, critical information

**Line Heights:**
- **Tight**: 1.2 - Headings, scores
- **Normal**: 1.5 - Body text
- **Relaxed**: 1.75 - Long-form content (if needed)

**Typography Hierarchy:**
- **Scores**: Display size (48px), Bold weight, high contrast
- **Player Names**: H2 size (24px), Semibold weight
- **Labels**: Body size (16px), Regular weight
- **Actions**: Body size (16px), Medium weight for buttons

**Accessibility:**
- Respects system font size settings (Dynamic Type on iOS, font scaling on Android)
- Minimum readable size: 16px for body text
- Large touch targets accommodate larger text sizes

## Spacing & Layout Foundation

**Spacing Strategy:**
4px base unit with generous spacing for age-inclusive design and large touch targets. Spacious layout that's easy to scan and understand.

**Spacing Scale (4px base unit):**
- **xs**: 4px (0.25rem) - Tight spacing, icon padding
- **sm**: 8px (0.5rem) - Small gaps, compact spacing
- **md**: 16px (1rem) - Standard spacing, component padding
- **lg**: 24px (1.5rem) - Generous spacing, section gaps
- **xl**: 32px (2rem) - Large gaps, screen margins
- **2xl**: 48px (3rem) - Extra large gaps, major sections
- **3xl**: 64px (4rem) - Maximum spacing, screen edges

**Component Spacing:**
- **Touch Target Minimum**: 44px (iOS) / 48px (Android) - All interactive elements
- **Button Padding**: 16px vertical, 24px horizontal
- **Card Padding**: 16px-24px
- **Section Gaps**: 24px-32px
- **Screen Margins**: 16px-24px

**Layout Principles:**
1. **Single-Column Layout**: Main game screen uses single column for simplicity and clarity
2. **Vertical Stacking**: Content flows vertically with clear visual hierarchy
3. **Generous White Space**: Spacious layout prevents crowding, supports age-inclusive design
4. **Clear Visual Hierarchy**: Scores prominent, actions clear, information scannable
5. **Portrait Primary**: Optimized for portrait orientation (landscape optional for future)

**Grid System:**
- No strict grid system needed for MVP (simple single-column layout)
- Consistent spacing scale ensures visual rhythm
- Future: Consider grid for statistics/history screens if needed

**Component Relationships:**
- Player cards: 16px gap between cards
- Score entry: 24px spacing around input area
- Actions: 16px gap between buttons
- Sections: 32px gap between major sections

## Accessibility Considerations

**Color & Contrast:**
- All text meets WCAG AA contrast ratios (4.5:1 normal, 3:1 large)
- Color not sole means of conveying information (icons, labels, patterns supplement)
- High contrast mode support through system settings

**Typography:**
- Respects system font size settings (Dynamic Type iOS, font scaling Android)
- Minimum readable size: 16px for body text
- Large, bold scores for easy reading
- Clear font weight hierarchy

**Touch Targets:**
- Minimum 44x44 points (iOS) / 48x48 dp (Android) for all interactive elements
- Generous spacing between touch targets prevents accidental taps
- Large buttons and cards accommodate various hand sizes

**Screen Reader Support:**
- Semantic labels for all interactive elements
- Clear descriptions for game state (leader, eliminated players)
- Announcements for rule enforcement events
- Accessible navigation structure

**Visual Feedback:**
- Haptic feedback supplements visual feedback for accessibility
- Clear visual indicators for all states (not just color)
- High contrast for important information
- Animation and transitions respect reduced motion preferences
