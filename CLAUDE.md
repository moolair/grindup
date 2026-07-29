# CLAUDE.md — GrindUp

GrindUp is a routine/habit-tracking mobile app: React Native 0.78.1, React 19, TypeScript 5.0.4, Firebase backend (Firestore, Auth, Storage, Analytics). It renders a GitHub-style contribution graph from completed daily routines.

## Commands

```bash
npm start          # Metro bundler
npm run ios        # build + run iOS simulator
npm run android    # build + run Android
npm run lint       # eslint . — BROKEN BASELINE, see below
npm test           # jest — BROKEN, see below
npx tsc --noEmit   # type check — 25 PRE-EXISTING errors, see below
```

iOS native deps: `bundle install && bundle exec pod install` (run inside `ios/`). Ruby/CocoaPods via Bundler, not global pod.

### Verification policy (read this before claiming anything works)

The repo's checks have a broken baseline. Do not try to make them pass globally, and do not use their failure as evidence your change is wrong:

- `npm test` fails entirely: the only test (`__tests__/App.test.tsx`) crashes because `@react-native-firebase/*` native modules are not mocked. There is no working test infrastructure. Do not add tests unless asked; if asked, you must first add jest mocks for `@react-native-firebase/app|auth|firestore|storage`.
- `npx tsc --noEmit` has 15 pre-existing errors (mostly `err is of type 'unknown'` in `LoginScreen.tsx`, and TS2306 for the empty `notificationService.ts`). Rule: run it before and after your change; the error count in files you touched must not increase. Do not fix pre-existing errors unless asked.
- `npm run lint` has 80 pre-existing errors and 417 warnings. Same rule: no new errors in files you touch. Never run `eslint --fix` or Prettier across whole files — it would bury the real diff in formatting noise.

The only reliable verification is building and running the app (`npm run ios`).

## Live code vs dead code (critical — do not guess)

This repo contains abandoned layers that look canonical but are imported by nothing. Follow this table exactly.

USE (live code paths):

| Concern | Use this |
|---|---|
| Navigation | `src/navigation/AppNavigator.tsx` (the ONLY navigator; also holds `RootStackParamList`) |
| Task/routine CRUD | `src/services/routineService.ts` |
| Contribution graph data + streaks | `src/services/firebase/contributions.ts` |
| Firebase init | `src/services/firebase/index.ts` (`getFirebaseApp()`, called in `App.tsx`) |
| Auth state | `src/context/AuthContext.tsx` |
| Theming | `src/theme/` (ThemeProvider, `useTheme`) |
| Translations | `src/hooks/useTranslation.ts` |
| Signup screen | `src/screens/Auth/SignupScreen.tsx`, rendered through the thin wrapper `src/screens/Auth/Register.js` (the navigator registers `Register`) |

DO NOT USE, EXTEND, IMPORT, OR "FIX" (dead or legacy code, kept in tree):

- `src/services/notificationService.ts` — an EMPTY file, yet `SettingsScreen.tsx` still imports `NotificationType`/`testLocalNotification` from it (this is the TS2306 error, and those symbols are `undefined` at runtime). Real notification setup is inline in `App.tsx` (`setupNotifications()`). Known bug; do not fix unless asked.
- `src/constants/{colors,theme,typography,spacing,shadows,radius,animation}.ts` — legacy theme system, superseded by `src/theme/`. Only `FloatingActionButton`, `Icons`, and `theme/themes.ts` still import it; do not add new imports.

Already deleted (do not recreate, do not reference): `src/domain/**` (unwired "Clean Architecture" layer), `src/navigation/index.tsx` (abandoned second navigator), `src/services/firebase/tasks.ts` (superseded by `routineService.ts`), `src/constants/routes.ts` (route names are string literals, e.g. `navigation.navigate('Register')`), `src/locales/ja/**` (Japanese support removed).

## Firebase

- Import ONLY from `@react-native-firebase/*` (namespaced API: `firestore().collection(...)`, `auth()`). 
- The web SDK `firebase` package is in `package.json` but imported nowhere. NEVER `import ... from 'firebase/...'` — it will silently create a second, unconfigured Firebase instance.
- Firestore schema (not documented anywhere else):
  - `tasks/{taskId}` — routines/tasks; fields include `userId`, `order` (list position), completion state. Sorted by `order`; IDs must be unique per routine.
  - `userStats/{uid}` — aggregate stats.
  - `userContributions/{uid}/dates/{dateString}` — one doc per day for the contribution graph.
- Dates for contributions are computed in LOCAL time, never UTC (this was a fixed bug — commit e7f95c2). Preserve that.
- Config files `android/app/google-services.json` and `ios/GrindUp/GoogleService-Info.plist` exist locally but are gitignored. Never commit them, never print their contents.

## i18n

- Supported languages: `en` and `ko` ONLY. Japanese is removed. (README still claims Japanese support — README is wrong.)
- Namespaces: `common, auth, tasks, dashboard, settings, analytics, profile, navigation`. Resources are statically imported in `src/i18n.ts`; a new JSON file does nothing until imported and added to `resources` there.
- Every user-visible string: add the key to BOTH `src/locales/en/<ns>.json` AND `src/locales/ko/<ns>.json`, then use `t('key')`. Never hardcode UI text in components — not English, not Korean.
- In screens/components use the custom hook: `import { useTranslation } from '../../hooks/useTranslation'` with an explicit namespace argument, e.g. `useTranslation('tasks')`. (Some Auth files use `react-i18next` directly — do not copy that pattern into new code.)
- The i18next `defaultNS` is `'auth'` (a quirk). Always pass the namespace explicitly; never rely on the default.
- Persisted language lives in AsyncStorage under key `user_language`. Effective default language is `'ko'` (set by `App.tsx`: `initI18n(savedLanguage || 'ko')`), even though `i18n.ts` declares `DEFAULT_LANGUAGE = 'en'` as fallback. Do not "fix" this mismatch unless asked.

## Theming

- Get colors/spacing/typography from `useTheme()` (`src/theme/`). The app supports light/dark/system themes.
- Never hardcode hex colors in components; add missing tokens to `src/theme/colors.ts` / `src/theme/themes.ts` instead. (Hardcoded colors were explicitly purged in commit 06224ea.)

## Navigation

- Register new screens in `src/navigation/AppNavigator.tsx` and add them to its `RootStackParamList` type in the same file.
- Auth gate: `initialRouteName={user ? "Main" : "Login"}`; "Main" is `TabNavigator` (Dashboard/Tasks/Analytics/Profile/Settings tabs).
- Route names are plain string literals; keep them in sync between `Stack.Screen name`, `navigate()` calls, and `RootStackParamList`.

## Conventions

- Commit messages: conventional-commit type in English + summary in Korean, e.g. `fix: 루틴 ID 중복 방지 및 order 기준 정렬`. Types in use: `feat`, `fix`, `refactor`, `chore`, `docs`. No scope parentheses. Do not push unless asked.
- Code comments and console.log messages are written in Korean. Match this in files that already do it.
- Match the formatting of the file you are editing (indentation varies between 2 and 4 spaces across the repo; Prettier config exists but is not enforced). Do not reformat untouched lines.
- New source files: TypeScript (`.tsx`/`.ts`). `Register.js` (a 9-line wrapper around `SignupScreen.tsx`) is the only JS file; do not create new `.js` files, and do not remove or convert the wrapper unless asked.
- `babel.config.js`: `react-native-reanimated/plugin` MUST stay the last entry in `plugins`.
- Google Sign-In is configured in TWO places with hardcoded client IDs: `App.tsx` (global) and `LoginScreen.tsx`. If you change OAuth config, change both. (README says to also configure it in SignupScreen.tsx — README is wrong; that file has no `GoogleSignin.configure` call.)

## Platform targets

- iOS 15.1+, bundle id `com.grindup`, Xcode project `ios/GrindUp.xcworkspace` (always the workspace, not the xcodeproj).
- Android minSdk 24 / target 35, `applicationId com.grindup`.
- JS engine: Hermes.

## Known README lies (do not trust these sections)

The README describes aspiration, not reality: it claims Clean Architecture (layer was dead code, now deleted), Japanese i18n (removed), a notification service module (empty file), GoogleSignin config in SignupScreen (no such call there), and gives the plist path inconsistently (`ios/GoogleService-Info.plist` in one place; correct path is `ios/GrindUp/GoogleService-Info.plist`). When README and this file disagree, this file wins.
