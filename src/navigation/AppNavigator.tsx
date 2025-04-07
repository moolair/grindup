import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import TasksScreen from '../screens/Tasks/TasksScreen';
import LanguageSettingsScreen from '../screens/Settings/LanguageSettingsScreen';
import { useTheme } from '../theme/ThemeProvider';

// 필요한 경우 로그인 화면, 온보딩 화면 등을 여기에 추가

// Task 타입 정의
export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  category: string;
}

// Stack Navigator 타입 정의
type RootStackParamList = {
  Main: {
    newTask?: Task;
  };
  Tasks: undefined;
  TaskDetail: { taskId: string };
  LanguageSettings: undefined;
  // 추가 화면을 여기에 타입 정의
};

const Stack = createStackNavigator<RootStackParamList>();

// 커스텀 애니메이션: 현재 화면만 오른쪽에서 왼쪽으로 슬라이드
const forSlideOverFromRight = ({ current, layouts }: any) => {
  return {
    cardStyle: {
      transform: [
        {
          // 현재 화면(TasksScreen)의 X축 위치를 변경
          translateX: current.progress.interpolate({
            inputRange: [0, 1], // 애니메이션 진행 상태 (0: 시작, 1: 끝)
            outputRange: [layouts.screen.width, 0], // 화면 너비(오른쪽 밖)에서 0(제자리)으로 이동
            extrapolate: 'clamp',
          }),
        },
      ],
    },
    // 이전 화면(Main)은 움직이지 않도록 별도 설정 불필요 (기본값)
  };
};

// 타입 정의 export
export type { RootStackParamList };

const AppNavigator = () => {
  const { theme } = useTheme();

  // 내비게이션 테마 설정
  const navigationTheme = theme.type === 'dark' ? DarkTheme : DefaultTheme;
  const customTheme = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      primary: theme.colors.ui.primary,
      background: theme.colors.background.primary,
      card: theme.colors.surface.primary,
      text: theme.colors.content.primary,
      border: theme.colors.border.light,
    },
  };

  return (
    <NavigationContainer theme={customTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          detachPreviousScreen: false
        }}
      >
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          // Main 화면(TabNavigator)은 애니메이션 없음 (항상 아래에 고정)
          options={{
            detachPreviousScreen: false
          }}
        />
        <Stack.Screen
          name="Tasks"
          component={TasksScreen}
          options={{
            // 커스텀 애니메이션 적용
            cardStyleInterpolator: forSlideOverFromRight,
            // 제스처 방향 설정 (오른쪽에서 왼쪽 스와이프로 닫기)
            gestureDirection: 'horizontal',
            detachPreviousScreen: false
          }}
        />
        <Stack.Screen
          name="LanguageSettings"
          component={LanguageSettingsScreen}
          options={{
            cardStyleInterpolator: forSlideOverFromRight,
            gestureDirection: 'horizontal',
            detachPreviousScreen: false
          }}
        />
        {/* 필요한 경우 추가 화면을 여기에 등록 */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 