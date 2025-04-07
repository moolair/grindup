import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import useTranslation from '../hooks/useTranslation';

import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import AnalyticsScreen from '../screens/Analytics/AnalyticsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { theme } = useTheme();
  const { t, currentLanguage } = useTranslation('navigation');

  // 언어가 변경될 때마다 탭 옵션을 다시 계산
  const homeTabOptions = useMemo(() => ({
    tabBarLabel: t('tabs.home'),
  }), [t, currentLanguage]);

  const analyticsTabOptions = useMemo(() => ({
    tabBarLabel: t('tabs.analytics'),
  }), [t, currentLanguage]);

  const profileTabOptions = useMemo(() => ({
    tabBarLabel: t('tabs.profile'),
  }), [t, currentLanguage]);

  const settingsTabOptions = useMemo(() => ({
    tabBarLabel: t('tabs.settings'),
  }), [t, currentLanguage]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.ui.primary,
        tabBarInactiveTintColor: theme.colors.content.secondary,
        tabBarStyle: {
          height: 60,
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.light,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
          textAlign: 'center',
        },
        tabBarItemStyle: {
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIconStyle: {
          display: 'none'
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={homeTabOptions}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={analyticsTabOptions}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={profileTabOptions}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={settingsTabOptions}
      />
    </Tab.Navigator>
  );
};

// 사용하지 않는 styles 삭제
const styles = StyleSheet.create({});

export default TabNavigator; 