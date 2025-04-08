This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

## 소셜 로그인 설정

### Google 로그인 설정

Google 로그인을 활성화하려면 다음 단계를 따르세요:

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트를 엽니다.
2. Authentication > Sign-in method로 이동하여 Google을 활성화합니다.
3. [Google Cloud Console](https://console.cloud.google.com/)에서 OAuth 클라이언트 ID를 생성합니다.
4. 앱의 `src/screens/Auth/LoginScreen.tsx`와 `src/screens/Auth/SignupScreen.tsx` 파일에서 다음 코드를 찾습니다:

```javascript
// 주석을 해제하고 YOUR_WEB_CLIENT_ID를 실제 Web Client ID로 대체하세요
GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID',
});
```

5. `YOUR_WEB_CLIENT_ID`를 Firebase Console에서 가져온 Web Client ID로 대체합니다.
6. Android의 경우, `android/app/google-services.json` 파일이 올바르게 구성되어 있는지 확인합니다.
7. iOS의 경우, `ios/GoogleService-Info.plist` 파일이 올바르게 구성되어 있는지 확인합니다.

### Apple 로그인 설정 (iOS 전용)

Apple 로그인은 iOS 13 이상에서만 작동합니다. 설정하려면:

1. [Apple Developer Console](https://developer.apple.com/)에서 프로젝트를 엽니다.
2. Certificates, Identifiers & Profiles > Identifiers로 이동합니다.
3. 앱 ID를 선택하고 Sign In with Apple 기능을 활성화합니다.
4. Firebase Console의 Authentication > Sign-in method에서 Apple을 활성화합니다.
5. XCode에서 다음 설정을 완료합니다:
   - 프로젝트의 Signing & Capabilities에 "Sign In with Apple" Capability를 추가합니다.
   - 앱의 Bundle ID가 Apple Developer 계정에 등록된 App ID와 일치하는지 확인합니다.
   - `GrindUp.entitlements` 파일이 프로젝트에 추가되었는지 확인합니다. 이 파일은 다음 코드를 포함해야 합니다:
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
6. XCode 프로젝트의 Build Settings에서 "Code Signing Entitlements"에 `GrindUp/GrindUp.entitlements` 경로를 지정합니다.
7. 실제 기기에서 테스트할 경우, 앱이 유효한 개발자 인증서로 서명되었는지 확인합니다.

#### 중요 참고사항

- 애플 로그인은 시뮬레이터에서 제대로 작동하지 않을 수 있으며, 실제 iOS 기기에서 테스트하는 것이 좋습니다.
- 애플 로그인을 사용할 때는 애플 개발자 계정이 필요합니다.
- 앱 스토어에 앱을 제출하려면 애플 개발자 프로그램($99/년) 멤버십이 필요합니다.

자세한 설정 방법은 다음 문서를 참조하세요:
- [React Native Firebase 인증 문서](https://rnfirebase.io/auth/usage)
- [React Native Google SignIn 문서](https://github.com/react-native-google-signin/google-signin)
- [React Native Apple Authentication 문서](https://github.com/invertase/react-native-apple-authentication)
- [Firebase Apple 인증 설정 가이드](https://firebase.google.com/docs/auth/ios/apple)
