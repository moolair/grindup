import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme.type === 'dark';

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.content.primary }]}>설정</Text>
      </View>

      <ScrollView>
        <View style={[styles.section, { borderBottomColor: theme.colors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.content.primary }]}>알림</Text>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.content.primary }]}>푸시 알림</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: theme.colors.content.disabled, true: theme.colors.ui.primary }}
              thumbColor={pushNotifications ? theme.colors.content.inverse : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.content.primary }]}>이메일 알림</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: theme.colors.content.disabled, true: theme.colors.ui.primary }}
              thumbColor={emailNotifications ? theme.colors.content.inverse : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.colors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.content.primary }]}>디스플레이</Text>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.content.primary }]}>다크 모드</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.content.disabled, true: theme.colors.ui.primary }}
              thumbColor={isDarkMode ? theme.colors.content.inverse : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.colors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.content.primary }]}>소리</Text>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.content.primary }]}>작업 완료 소리</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: theme.colors.content.disabled, true: theme.colors.ui.primary }}
              thumbColor={soundEnabled ? theme.colors.content.inverse : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.colors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.content.primary }]}>앱 정보</Text>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.content.primary }]}>버전</Text>
            <Text style={[styles.infoValue, { color: theme.colors.content.secondary }]}>1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.content.primary }]}>이용약관</Text>
            <Text style={[styles.infoAction, { color: theme.colors.ui.primary }]}>보기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.content.primary }]}>개인정보처리방침</Text>
            <Text style={[styles.infoAction, { color: theme.colors.ui.primary }]}>보기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
  },
  infoAction: {
    fontSize: 16,
  },
});

export default SettingsScreen; 