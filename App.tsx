/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useLayoutEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import ThemeProvider from './src/theme/ThemeProvider';
import AppPaperProvider from './src/theme/PaperProvider';
import { initI18n } from './src/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nextProvider } from 'react-i18next';
import i18next from './src/i18n';

function App(): React.JSX.Element {
  useLayoutEffect(() => {
    const initializeApp = async () => {
      try {
        // 저장된 언어 불러오기 및 i18n 초기화
        const savedLanguage = await AsyncStorage.getItem('user_language');
        await initI18n(savedLanguage);

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
              <AppNavigator />
            </SafeAreaProvider>
          </AppPaperProvider>
        </ThemeProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}

export default App;
