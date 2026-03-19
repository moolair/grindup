# GrindUp

> 매일 일관된 습관으로 생산성을 높이는 루틴 트래킹 앱

GrindUp은 GitHub 스타일의 기여 그래프를 통해 일일 생산성을 시각화하고, 루틴과 태스크를 체계적으로 관리할 수 있는 크로스 플랫폼 모바일 애플리케이션입니다.

---

## Tech Stack

| 분류 | 기술 |
|------|------|
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
| **i18n** | i18next (한국어, 영어, 일본어) |
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
│   ├── atoms/              # 기본 UI 컴포넌트
│   ├── molecules/           # 복합 컴포넌트
│   ├── organisms/           # ContributionGraph, TaskList 등
│   ├── FloatingActionButton/
│   └── Icons/
├── context/
│   └── AuthContext.tsx       # Firebase 인증 상태 관리
├── constants/                # 설정값, 아이콘, 라우트, 컬러, 테마
├── domain/
│   ├── models/               # Task, User, Contribution
│   ├── repositories/
│   └── usecases/
├── hooks/                    # 커스텀 React Hooks
├── locales/
│   ├── en/                   # 영어
│   ├── ko/                   # 한국어
│   └── ja/                   # 일본어
├── navigation/
│   ├── AppNavigator.tsx
│   ├── TabNavigator.tsx
│   └── index.tsx
├── screens/
│   ├── Analytics/            # 통계 및 분석
│   ├── Auth/                 # 로그인, 회원가입
│   ├── Dashboard/            # 메인 대시보드
│   ├── Profile/              # 사용자 프로필
│   ├── Settings/             # 설정, 언어 설정
│   └── Tasks/                # 루틴/태스크 관리
├── services/
│   ├── firebase/             # Firebase 초기화, 태스크, 기여도
│   ├── routineService.ts     # 루틴 CRUD
│   └── notificationService.ts # 푸시 알림
├── theme/                    # 색상, 타이포그래피, 간격, 그림자, 애니메이션
├── types/
└── i18n.ts                   # i18n 설정
```

**설계 패턴:**
- **Atomic Design** - atoms / molecules / organisms 기반 컴포넌트 구조
- **Clean Architecture** - domain(models, repositories, usecases) 분리
- **Context API** - 전역 상태 관리 (AuthContext)
- **Service Layer** - Firebase, 알림, 루틴 서비스 분리

---

## Features

### Dashboard
- GitHub 스타일 기여 그래프로 일일 생산성 시각화
- 오늘의 태스크 현황 (완료/남은 수)
- 연속 달성(Streak) 추적 (현재 / 최고 기록)
- 주간/월간 요약 및 트렌드 분석

### Tasks & Routines
- 태스크 생성, 수정, 삭제
- 카테고리 관리 (개인, 업무, 학습, 건강, 쇼핑, 취미, 자기개발 등)
- 우선순위 설정 (낮음, 보통, 높음, 긴급)
- 마감일 관리 및 필터링/정렬
- 루틴 생성 및 요일별 반복 설정
- 드래그 앤 드롭 순서 변경

### Analytics
- 태스크 완료율 차트
- 주간/월간 리포트
- 활동 수준 및 퍼포먼스 메트릭

### Auth
- 이메일/비밀번호 인증
- Google 소셜 로그인
- Apple 소셜 로그인 (iOS)

### Push Notifications
- 루틴 시작/종료 알림
- 태스크 마감 알림
- 연속 달성 마일스톤 알림

### Settings
- 테마 설정 (라이트 / 다크 / 시스템 / 자동)
- 언어 설정 (한국어, 영어, 일본어)
- 폰트 크기, 날짜/시간 포맷 커스텀
- 알림 세부 설정

---

## Getting Started

### Prerequisites

- Node.js >= 18
- React Native CLI 환경 설정 완료 ([가이드](https://reactnative.dev/docs/set-up-your-environment))
- Xcode (iOS 개발 시)
- Android Studio (Android 개발 시)
- Firebase 프로젝트 설정

### Installation

```bash
# 저장소 클론
git clone <repository-url>
cd grindup

# 의존성 설치
npm install

# iOS 전용: CocoaPods 설치
bundle install
bundle exec pod install
```

### Run

```bash
# Metro 번들러 시작
npm start

# Android 실행
npm run android

# iOS 실행
npm run ios
```

### Test & Lint

```bash
# 테스트 실행
npm test

# 린트 실행
npm run lint
```

---

## Firebase Setup

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트를 생성합니다.
2. Android 앱을 추가하고 `android/app/google-services.json` 파일을 배치합니다.
3. iOS 앱을 추가하고 `ios/GoogleService-Info.plist` 파일을 배치합니다.
4. Authentication > Sign-in method에서 이메일/비밀번호, Google, Apple을 활성화합니다.
5. Cloud Firestore 데이터베이스를 생성합니다.

---

## Social Login Setup

### Google Sign-In

1. Firebase Console에서 Google 로그인을 활성화합니다.
2. [Google Cloud Console](https://console.cloud.google.com/)에서 OAuth 클라이언트 ID를 생성합니다.
3. `src/screens/Auth/LoginScreen.tsx`와 `SignupScreen.tsx`에서 Web Client ID를 설정합니다:

```javascript
GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID',
});
```

4. Android: `android/app/google-services.json` 파일이 올바르게 구성되었는지 확인합니다.
5. iOS: `ios/GoogleService-Info.plist` 파일이 올바르게 구성되었는지 확인합니다.

### Apple Sign-In (iOS)

Apple 로그인은 iOS 13 이상에서 동작합니다.

1. [Apple Developer Console](https://developer.apple.com/)에서 Sign In with Apple 기능을 활성화합니다.
2. Firebase Console의 Authentication에서 Apple을 활성화합니다.
3. Xcode에서 Signing & Capabilities에 "Sign In with Apple" Capability를 추가합니다.
4. `GrindUp.entitlements` 파일이 프로젝트에 포함되었는지 확인합니다:

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

> **Note:** Apple 로그인은 시뮬레이터에서 제대로 작동하지 않을 수 있으며, 실제 iOS 기기에서 테스트하는 것을 권장합니다.

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
