import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';

// 필요한 경우 로그인 화면, 온보딩 화면 등을 여기에 추가

// Stack Navigator 타입 정의
type RootStackParamList = {
  Main: undefined;
  // 추가 화면을 여기에 타입 정의
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        {/* 필요한 경우 추가 화면을 여기에 등록 */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 