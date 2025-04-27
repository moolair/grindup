/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useLayoutEffect, useEffect } from 'react';
// Firebase 서비스 가져오기
import { firebase, getFirebaseApp } from './src/services/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import ThemeProvider from './src/theme/ThemeProvider';
import AppPaperProvider from './src/theme/PaperProvider';
import i18next, { initI18n } from './src/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './src/context/AuthContext';
import { LogBox } from 'react-native';
import { Platform } from 'react-native';
// 알림 라이브러리 직접 사용
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

// 특정 경고 무시
LogBox.ignoreLogs([
  '{}',  // 빈 객체 관련 경고 무시
  "[Reanimated] Trying to access the 'value' property"  // Reanimated 경고 무시
]);

// 알림 초기 설정 함수
const setupNotifications = () => {
  try {
    // PushNotification 설정
    PushNotification.configure({
      onRegister: function (token) {
        console.log('알림 토큰:', token);
      },
      onNotification: function (notification) {
        console.log('알림 수신:', notification);
        // iOS에서는 추가 완료 콜백 필요
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onRegistrationError: function (err) {
        console.error('알림 등록 오류:', err);
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    // Android용 알림 채널 생성
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'routine-reminders',
          channelName: '루틴 알림',
          channelDescription: '루틴 시작 및 미완료 알림을 위한 채널',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`알림 채널 생성 ${created ? '성공' : '실패'}`)
      );
    }

    console.log('알림 모듈 초기화 완료');
  } catch (error) {
    console.error('알림 모듈 초기화 오류:', error);
  }
};

function App(): React.JSX.Element {
  // 앱 초기화 효과
  useLayoutEffect(() => {
    const initializeApp = async () => {
      try {
        // Firebase 명시적 초기화 (가장 먼저 실행)
        try {
          console.log('[App] Firebase 초기화 호출...');
          getFirebaseApp();
          console.log('[App] Firebase 앱 상태 확인:', firebase.apps.length > 0 ? '초기화됨' : '초기화 필요');
        } catch (firebaseError) {
          console.error('[App] Firebase 초기화 오류:', firebaseError);
        }

        // 저장된 언어 불러오기 
        const savedLanguage = await AsyncStorage.getItem('user_language');

        // 강제로 i18n 재초기화 (기존 코드 대체)
        await initI18n(savedLanguage || 'ko');

        // 초기화 상태 확인 로그
        console.log('i18n 초기화 상태:', i18next.isInitialized ? '완료' : '실패');
        console.log('현재 언어:', i18next.language);
        console.log('사용 가능한 네임스페이스:', i18next.options.ns);
        console.log('기본 네임스페이스:', i18next.options.defaultNS);

        // 리소스 로드 확인
        console.log('auth 네임스페이스 리소스 확인:',
          i18next.hasResourceBundle(i18next.language, 'auth') ? '로드됨' : '로드되지 않음');

        // 테스트 번역
        const testKey = 'login.tagline';
        console.log(`테스트 번역 (${testKey}):`, i18next.t(testKey, { ns: 'auth' }));

        // 구글 로그인 초기화 (수정된 설정)
        try {
          console.log('Google SignIn 설정 시작...');
          GoogleSignin.configure({
            // 웹 클라이언트 ID는 Firebase 콘솔의 웹 앱 설정에서 가져옵니다.
            webClientId: '778305964277-22c05kls22cglh9auqtodgoqmioj158r.apps.googleusercontent.com',
            offlineAccess: true,
            iosClientId: '778305964277-ss7nlo6l44npv8j5emu3jbucl2osjuvh.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });

          console.log('Google SignIn 초기 설정 완료');

          // 초기 로그아웃 작업 생략 (LoginScreen에서 처리)

        } catch (error) {
          console.error('Google SignIn 설정 중 오류:', error);
        }

        // 알림 서비스 초기화
        try {
          console.log('[App] 알림 서비스 초기화 시작...');
          setupNotifications();
          console.log('[App] 알림 서비스 초기화 완료');
        } catch (notificationError) {
          console.error('[App] 알림 서비스 초기화 오류:', notificationError);
        }

        // Firebase 앱 상태는 src/services/firebase/index.ts에서 이미 확인 및 초기화됨
      } catch (error) {
        console.error('앱 초기화 중 오류 발생:', error);
      }

      // 스플래시 화면 숨기기 - 초기화가 완료된 후 모든 작업이 끝난 다음 실행
      SplashScreen.hide();
    };

    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <I18nextProvider i18n={i18next}>
        <ThemeProvider>
          <AppPaperProvider>
            <SafeAreaProvider>
              <AuthProvider>
                <AppNavigator />
              </AuthProvider>
            </SafeAreaProvider>
          </AppPaperProvider>
        </ThemeProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}

export default App;
