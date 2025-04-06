import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

const ProfileScreen = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.content.primary }]}>프로필</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.ui.primary }]}>
            <Text style={[styles.avatarText, { color: theme.colors.content.inverse }]}>JK</Text>
          </View>
        </View>
        <Text style={[styles.name, { color: theme.colors.content.primary }]}>김준호</Text>
        <Text style={[styles.email, { color: theme.colors.content.secondary }]}>junho.kim@example.com</Text>
      </View>

      <View style={[styles.statsSection, {
        borderTopColor: theme.colors.border.light,
        borderBottomColor: theme.colors.border.light
      }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.ui.primary }]}>42</Text>
          <Text style={[styles.statLabel, { color: theme.colors.content.secondary }]}>완료한 작업</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.colors.border.light }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.ui.primary }]}>28</Text>
          <Text style={[styles.statLabel, { color: theme.colors.content.secondary }]}>연속 달성</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border.light }]}>
          <Text style={[styles.menuText, { color: theme.colors.content.primary }]}>계정 설정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border.light }]}>
          <Text style={[styles.menuText, { color: theme.colors.content.primary }]}>알림 설정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border.light }]}>
          <Text style={[styles.menuText, { color: theme.colors.content.primary }]}>개인정보 보호</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border.light }]}>
          <Text style={[styles.menuText, { color: theme.colors.content.primary }]}>도움말</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem, { borderBottomColor: theme.colors.border.light }]}>
          <Text style={[styles.logoutText, { color: theme.colors.ui.error }]}>로그아웃</Text>
        </TouchableOpacity>
      </View>
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    marginTop: 4,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statDivider: {
    width: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    marginTop: 4,
  },
  menuSection: {
    paddingTop: 8,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
  },
  logoutItem: {
    marginTop: 32,
  },
  logoutText: {
    fontSize: 16,
  },
});

export default ProfileScreen; 