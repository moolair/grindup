/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useLayoutEffect, useEffect } from 'react';
// Firebase 서비스를 앱 진입점에서 바로 가져와 초기화
import './src/services/firebase';

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
