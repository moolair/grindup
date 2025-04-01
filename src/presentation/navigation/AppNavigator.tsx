import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import TasksScreen from '../screens/Tasks/TasksScreen';

// 필요한 경우 로그인 화면, 온보딩 화면 등을 여기에 추가

// Stack Navigator 타입 정의
type RootStackParamList = {
  Main: undefined;
  Tasks: undefined;
  // 추가 화면을 여기에 타입 정의
};

const Stack = createStackNavigator<RootStackParamList>();

// 커스텀 애니메이션: 현재 화면만 오른쪽에서 왼쪽으로 슬라이드
const forSlideOverFromRight = ({ current, layouts }) => {
  return {
    cardStyle: {
      transform: [
        {
          // 현재 화면(TasksScreen)의 X축 위치를 변경
          translateX: current.progress.interpolate({
            inputRange: [0, 1], // 애니메이션 진행 상태 (0: 시작, 1: 끝)
            outputRange: [layouts.screen.width, 0], // 화면 너비(오른쪽 밖)에서 0(제자리)으로 이동
          }),
        },
      ],
    },
    // 이전 화면(Main)은 움직이지 않도록 별도 설정 불필요 (기본값)
  };
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          // Main 화면(TabNavigator)은 애니메이션 없음 (항상 아래에 고정)
          options={{ animationEnabled: false }}
        />
        <Stack.Screen
          name="Tasks"
          component={TasksScreen}
          options={{
            // 커스텀 애니메이션 적용
            cardStyleInterpolator: forSlideOverFromRight,
            // 제스처 방향 설정 (오른쪽에서 왼쪽 스와이프로 닫기)
            gestureDirection: 'horizontal',
          }}
        />
        {/* 필요한 경우 추가 화면을 여기에 등록 */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 