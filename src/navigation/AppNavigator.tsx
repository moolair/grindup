import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import TasksScreen from '../screens/Tasks/TasksScreen';
import LanguageSettingsScreen from '../screens/Settings/LanguageSettingsScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import Register from '../screens/Auth/Register';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// 필요한 경우 로그인 화면, 온보딩 화면 등을 여기에 추가

// Task 타입 정의
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  category?: string;
  color?: string;
  days?: Array<{ id: string; label: string; selected: boolean }>;
}

// Stack Navigator 타입 정의
type RootStackParamList = {
  Login: undefined;
  Main: {
    newTask?: Task;
    refreshRoutines?: boolean;
  };
  Tasks: {
    routineId?: string;
  };
  TaskDetail: { taskId: string };
  LanguageSettings: undefined;
  Register: undefined;
  Signup: undefined;
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
  const { user, loading } = useAuth();

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

  // 로딩 중일 때 로딩 인디케이터 표시
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.primary }}>
        <ActivityIndicator size="large" color={theme.colors.ui.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={customTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          detachPreviousScreen: false
        }}
        initialRouteName={user ? "Main" : "Login"}
      >
        {!user ? (
          // 비로그인 상태일 때 보여줄 화면
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                detachPreviousScreen: false
              }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{
                detachPreviousScreen: false
              }}
            />
          </>
        ) : (
          // 로그인 상태일 때 보여줄 화면들
          <>
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{
                detachPreviousScreen: false
              }}
            />
            <Stack.Screen
              name="Tasks"
              component={TasksScreen}
              options={{
                cardStyleInterpolator: forSlideOverFromRight,
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 