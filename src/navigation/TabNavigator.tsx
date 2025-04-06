import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import AnalyticsScreen from '../screens/Analytics/AnalyticsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

// 아이콘 컴포넌트 (실제 아이콘 대신 임시로 사용)
const TabIcon = ({ focused, color, name }: { focused: boolean; color: string; name: string }) => {
  const { theme } = useTheme();

  return (
    <View style={[
      styles.iconContainer,
      focused ? { backgroundColor: theme.type === 'dark' ? 'rgba(51, 102, 255, 0.2)' : '#E6EEFF' } : null
    ]}>
      <Text style={{ color }}>{name[0].toUpperCase()}</Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.ui.primary,
        tabBarInactiveTintColor: theme.colors.content.secondary,
        tabBarStyle: {
          height: 60,
          paddingTop: 5,
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.light,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: (props) => <TabIcon {...props} name="홈" />,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: '분석',
          tabBarIcon: (props) => <TabIcon {...props} name="분석" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '프로필',
          tabBarIcon: (props) => <TabIcon {...props} name="프로필" />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: '설정',
          tabBarIcon: (props) => <TabIcon {...props} name="설정" />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});

export default TabNavigator; 