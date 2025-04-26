/**
 * @format
 */

// Firebase 초기화는 앱 시작 시 가장 먼저 수행
import firebase from '@react-native-firebase/app';

// Firebase 앱 초기화 상태 확인
console.log('Firebase 앱 상태 (index.js):', firebase.apps.length ? '앱 있음' : '앱 없음');

// RN 컴포넌트 임포트
import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// 경고 무시
LogBox.ignoreLogs([
    'Sending `onAnimatedValueUpdate` with no listeners registered',
    // Firebase 관련 경고 무시
    'deprecated property provided will be removed in the next major release',
    'AsyncStorage has been extracted from react-native core',
    'Method "batch" is deprecated',
    // Reanimated 관련 경고 무시
    "[Reanimated] Trying to access the 'value' property",
    // 탭 제스처 오류 무시
    "{}"
]);

AppRegistry.registerComponent(appName, () => App);
