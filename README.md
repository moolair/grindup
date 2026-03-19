# GrindUp

> A routine tracking app that boosts productivity through consistent daily habits

GrindUp is a cross-platform mobile application that visualizes daily productivity through a GitHub-style contribution graph and helps you systematically manage routines and tasks.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React Native 0.78.1, React 19.0.0 |
| **Language** | TypeScript 5.0.4 |
| **Navigation** | React Navigation 7 (Bottom Tabs, Native Stack) |
| **Backend** | Firebase (BaaS) |
| **Database** | Cloud Firestore |
| **Auth** | Firebase Auth, Google Sign-In, Apple Sign-In |
| **Storage** | Firebase Storage, AsyncStorage |
| **Push** | react-native-push-notification, FCM |
| **UI** | React Native Paper, Vector Icons, SVG |
| **Animation** | React Native Reanimated 3 |
| **i18n** | i18next (Korean, English, Japanese) |
| **Analytics** | Firebase Analytics |
| **JS Engine** | Hermes |
| **Build** | Metro Bundler, Babel |
| **Test** | Jest |
| **Lint** | ESLint, Prettier |

---

## Architecture

```
src/
├── components/
│   ├── atoms/              # Basic UI components
│   ├── molecules/           # Composite components
│   ├── organisms/           # ContributionGraph, TaskList, etc.
│   ├── FloatingActionButton/
│   └── Icons/
├── context/
│   └── AuthContext.tsx       # Firebase auth state management
├── constants/                # Config values, icons, routes, colors, themes
├── domain/
│   ├── models/               # Task, User, Contribution
│   ├── repositories/
│   └── usecases/
├── hooks/                    # Custom React Hooks
├── locales/
│   ├── en/                   # English
│   ├── ko/                   # Korean
│   └── ja/                   # Japanese
├── navigation/
│   ├── AppNavigator.tsx
│   ├── TabNavigator.tsx
│   └── index.tsx
├── screens/
│   ├── Analytics/            # Statistics & analytics
│   ├── Auth/                 # Login, sign up
│   ├── Dashboard/            # Main dashboard
│   ├── Profile/              # User profile
│   ├── Settings/             # Settings, language settings
│   └── Tasks/                # Routine/task management
├── services/
│   ├── firebase/             # Firebase init, tasks, contributions
│   ├── routineService.ts     # Routine CRUD
│   └── notificationService.ts # Push notifications
├── theme/                    # Colors, typography, spacing, shadows, animations
├── types/
└── i18n.ts                   # i18n configuration
```

**Design Patterns:**
- **Atomic Design** — Component structure based on atoms / molecules / organisms
- **Clean Architecture** — Separated domain layer (models, repositories, usecases)
- **Context API** — Global state management (AuthContext)
- **Service Layer** — Isolated services for Firebase, notifications, and routines

---

## Features

### Dashboard
- Visualize daily productivity with a GitHub-style contribution graph
- Today's task overview (completed / remaining)
- Streak tracking (current / best record)
- Weekly and monthly summaries with trend analysis

### Tasks & Routines
- Create, edit, and delete tasks
- Category management (personal, work, study, health, shopping, hobby, self-development, etc.)
- Priority levels (low, medium, high, urgent)
- Due date management with filtering and sorting
- Create routines with day-of-week repeat settings
- Drag-and-drop reordering

### Analytics
- Task completion rate charts
- Weekly and monthly reports
- Activity level and performance metrics

### Auth
- Email/password authentication
- Google social login
- Apple social login (iOS)

### Push Notifications
- Routine start/end reminders
- Task deadline alerts
- Streak milestone notifications

### Settings
- Theme selection (light / dark / system / auto)
- Language settings (Korean, English, Japanese)
- Font size and date/time format customization
- Notification preferences

---

## Getting Started

### Prerequisites

- Node.js >= 18
- React Native CLI environment setup ([guide](https://reactnative.dev/docs/set-up-your-environment))
- Xcode (for iOS development)
- Android Studio (for Android development)
- Firebase project configuration

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd grindup

# Install dependencies
npm install

# iOS only: Install CocoaPods
bundle install
bundle exec pod install
```

### Run

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Test & Lint

```bash
# Run tests
npm test

# Run linter
npm run lint
```

---

## Firebase Setup

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Add an Android app and place the `android/app/google-services.json` file.
3. Add an iOS app and place the `ios/GoogleService-Info.plist` file.
4. Go to Authentication > Sign-in method and enable Email/Password, Google, and Apple.
5. Create a Cloud Firestore database.

---

## Social Login Setup

### Google Sign-In

1. Enable Google sign-in in the Firebase Console.
2. Create an OAuth Client ID in the [Google Cloud Console](https://console.cloud.google.com/).
3. Set the Web Client ID in `src/screens/Auth/LoginScreen.tsx` and `SignupScreen.tsx`:

```javascript
GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID',
});
```

4. Android: Ensure `android/app/google-services.json` is properly configured.
5. iOS: Ensure `ios/GoogleService-Info.plist` is properly configured.

### Apple Sign-In (iOS)

Apple Sign-In requires iOS 13 or later.

1. Enable Sign In with Apple in the [Apple Developer Console](https://developer.apple.com/).
2. Enable Apple in Firebase Console under Authentication.
3. In Xcode, add the "Sign In with Apple" capability under Signing & Capabilities.
4. Ensure the `GrindUp.entitlements` file is included in the project:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.applesignin</key>
    <array>
        <string>Default</string>
    </array>
</dict>
</plist>
```

> **Note:** Apple Sign-In may not work properly on the simulator. Testing on a physical iOS device is recommended.

---

## Platform Support

| Platform | Version |
|----------|---------|
| Android | API 24+ (Android 7.0) ~ API 35 |
| iOS | 15.1+ |

---

## References

- [React Native](https://reactnative.dev)
- [React Native Firebase](https://rnfirebase.io)
- [React Navigation](https://reactnavigation.org)
- [React Native Paper](https://callstack.github.io/react-native-paper)
- [React Native Google Sign-In](https://github.com/react-native-google-signin/google-signin)
- [React Native Apple Authentication](https://github.com/invertase/react-native-apple-authentication)
