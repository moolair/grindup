import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>프로필</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JK</Text>
          </View>
        </View>
        <Text style={styles.name}>김준호</Text>
        <Text style={styles.email}>junho.kim@example.com</Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>완료한 작업</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>28</Text>
          <Text style={styles.statLabel}>연속 달성</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>계정 설정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>알림 설정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>개인정보 보호</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>도움말</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: COLORS.PRIMARY[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.NEUTRAL.WHITE,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.NEUTRAL.BLACK,
  },
  email: {
    fontSize: 16,
    color: COLORS.NEUTRAL.DARK_GRAY,
    marginTop: 4,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.NEUTRAL.LIGHT_GRAY,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.NEUTRAL.LIGHT_GRAY,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY[600],
  },
  statLabel: {
    color: COLORS.NEUTRAL.DARK_GRAY,
    marginTop: 4,
  },
  menuSection: {
    paddingTop: 8,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.NEUTRAL.LIGHT_GRAY,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.NEUTRAL.BLACK,
  },
  logoutItem: {
    marginTop: 32,
  },
  logoutText: {
    fontSize: 16,
    color: COLORS.ERROR.BASE,
  },
});

export default ProfileScreen; 