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

        // 스플래시 화면 숨기기
        SplashScreen.hide();

        // 구글 로그인 초기화 (수정된 설정)
        try {
          console.log('Google SignIn 설정 시작...');
          GoogleSignin.configure({
            // 웹 클라이언트 ID는 Firebase 콘솔의 웹 앱 설정에서 가져옵니다.
            webClientId: '778305964277-22c05kls22cglh9auqtodgoqmioj158r.apps.googleusercontent.com',
            forceCodeForRefreshToken: true,
            offlineAccess: true,
            iosClientId: '778305964277-ss7nlo6l44npv8j5emu3jbucl2osjuvh.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });

          // 안전하게 Google 로그인 초기화 (상태 확인없이 로그아웃 시도)
          try {
            console.log('이전 Google 로그인 세션 정리 중...');
            await GoogleSignin.signOut();
            console.log('Google 로그인 상태 초기화 완료');
          } catch (signOutError) {
            // 로그아웃 오류는 무시 (로그인되어 있지 않을 수 있음)
            console.log('Google 로그아웃 오류 (무시됨):', signOutError);
          }

          console.log('Google SignIn 설정 완료');
        } catch (error) {
          console.error('Google SignIn 설정 중 오류:', error);
        }

        // Firebase 앱 상태는 src/services/firebase/index.ts에서 이미 확인 및 초기화됨
      } catch (error) {
        console.error('앱 초기화 중 오류 발생:', error);
        // 오류가 있어도 스플래시 화면은 숨김
        SplashScreen.hide();
      }
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
