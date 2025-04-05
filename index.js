/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Fabric 관련 경고 무시
LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered']);

AppRegistry.registerComponent(appName, () => App);
