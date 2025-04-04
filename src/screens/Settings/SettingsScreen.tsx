import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';

const SettingsScreen = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>설정</Text>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>푸시 알림</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: COLORS.NEUTRAL.MID_GRAY, true: COLORS.PRIMARY[600] }}
              thumbColor={pushNotifications ? COLORS.NEUTRAL.WHITE : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>이메일 알림</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: COLORS.NEUTRAL.MID_GRAY, true: COLORS.PRIMARY[600] }}
              thumbColor={emailNotifications ? COLORS.NEUTRAL.WHITE : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>디스플레이</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>다크 모드</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: COLORS.NEUTRAL.MID_GRAY, true: COLORS.PRIMARY[600] }}
              thumbColor={darkMode ? COLORS.NEUTRAL.WHITE : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>소리</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>작업 완료 소리</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: COLORS.NEUTRAL.MID_GRAY, true: COLORS.PRIMARY[600] }}
              thumbColor={soundEnabled ? COLORS.NEUTRAL.WHITE : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 정보</Text>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>버전</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>이용약관</Text>
            <Text style={styles.infoAction}>보기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>개인정보처리방침</Text>
            <Text style={styles.infoAction}>보기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.NEUTRAL.WHITE,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.NEUTRAL.BLACK,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.NEUTRAL.LIGHT_GRAY,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.NEUTRAL.BLACK,
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
    color: COLORS.NEUTRAL.BLACK,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.NEUTRAL.BLACK,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.NEUTRAL.DARK_GRAY,
  },
  infoAction: {
    fontSize: 16,
    color: COLORS.PRIMARY[600],
  },
});

export default SettingsScreen; 