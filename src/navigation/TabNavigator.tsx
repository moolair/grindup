import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import useTranslation from '../hooks/useTranslation';

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
  const { t, currentLanguage } = useTranslation('navigation');

  // 언어가 변경될 때마다 탭 옵션을 다시 계산
  const homeTabOptions = useMemo(() => ({
    tabBarLabel: t('tabs.home'),
    tabBarIcon: (props: any) => <TabIcon {...props} name={t('tabs.home')} />,
  }), [t, currentLanguage]);

  const analyticsTabOptions = useMemo(() => ({
    tabBarLabel: t('tabs.analytics'),
    tabBarIcon: (props: any) => <TabIcon {...props} name={t('tabs.analytics')} />,
  }), [t, currentLanguage]);

  const profileTabOptions = useMemo(() => ({
    tabBarLabel: t('tabs.profile'),
    tabBarIcon: (props: any) => <TabIcon {...props} name={t('tabs.profile')} />,
  }), [t, currentLanguage]);

  const settingsTabOptions = useMemo(() => ({
    tabBarLabel: t('tabs.settings'),
    tabBarIcon: (props: any) => <TabIcon {...props} name={t('tabs.settings')} />,
  }), [t, currentLanguage]);

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