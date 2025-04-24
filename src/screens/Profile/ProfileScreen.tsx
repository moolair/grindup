import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import useTranslation from '../../hooks/useTranslation';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/atoms/Avatar';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation('profile');
  const { user, signOut, updateDisplayName } = useAuth();
  const navigation = useNavigation();

  const [isNameModalVisible, setNameModalVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // 사용자의 인증 방식 확인 (이메일/비밀번호 또는 소셜 로그인)
  const isPasswordAuthProvider = user?.providerData?.some(
    provider => provider.providerId === 'password'
  );

  // 소셜 로그인 여부 확인 (Google, Apple)
  const isSocialAuthProvider = user?.providerData?.some(
    provider => provider.providerId === 'google.com' || provider.providerId === 'apple.com'
  );

  const handleChangeName = async () => {
    if (!newName.trim()) {
      Alert.alert('오류', '이름을 입력해주세요.');
      return;
    }

    setIsUpdatingName(true);
    try {
      await updateDisplayName(newName.trim());
      Alert.alert('성공', '이름이 성공적으로 변경되었습니다.');
      setNameModalVisible(false);
    } catch (error) {
      console.error('이름 변경 실패:', error);
      Alert.alert('오류', '이름 변경 중 문제가 발생했습니다.');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleChangePassword = () => {
    // 비밀번호 변경 로직 구현
    console.log("비밀번호 변경");
    setPasswordModalVisible(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // 로그아웃 후에는 AuthContext의 user 값이 null이 되어 RootNavigator에서 자동으로 Auth 스택으로 이동함
      console.log('로그아웃 성공');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.content.primary }]}>{t('title')}</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Avatar
            name={user?.displayName || ''}
            size="large"
            backgroundColor={theme.colors.ui.primary}
          />
        </View>
        <Text style={[styles.name, { color: theme.colors.content.primary }]}>
          {user?.displayName || t('anonymous')}
        </Text>
        <Text style={[styles.email, { color: theme.colors.content.secondary }]}>
          {user?.email || ''}
        </Text>
      </View>

      <View style={[styles.statsSection, {
        borderTopColor: theme.colors.border.light,
        borderBottomColor: theme.colors.border.light
      }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.ui.primary }]}>42</Text>
          <Text style={[styles.statLabel, { color: theme.colors.content.secondary }]}>{t('stats.completedTasks')}</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.colors.border.light }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.ui.primary }]}>28</Text>
          <Text style={[styles.statLabel, { color: theme.colors.content.secondary }]}>{t('stats.streakDays')}</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: theme.colors.border.light }]}
          onPress={() => {
            setNewName(user?.displayName || '');
            setNameModalVisible(true);
          }}
        >
          <Text style={[styles.menuText, { color: theme.colors.content.primary }]}>{t('menu.changeName')}</Text>
        </TouchableOpacity>

        {/* 이메일/비밀번호 사용자에게만 비밀번호 변경 옵션 표시 */}
        {isPasswordAuthProvider && !isSocialAuthProvider && (
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.colors.border.light }]}
            onPress={() => setPasswordModalVisible(true)}
          >
            <Text style={[styles.menuText, { color: theme.colors.content.primary }]}>{t('menu.changePassword')}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem, { borderBottomColor: theme.colors.border.light }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: theme.colors.ui.error }]}>{t('menu.logout')}</Text>
        </TouchableOpacity>
      </View>

      {/* Change Name Modal */}
      <Modal
        visible={isNameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitle, { color: theme.colors.content.primary }]}>{t('modal.changeName.title')}</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder={t('modal.changeName.placeholder')}
              placeholderTextColor={theme.colors.content.tertiary}
              editable={!isUpdatingName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setNameModalVisible(false)}
                disabled={isUpdatingName}
              >
                <Text style={{ color: theme.colors.content.secondary }}>{t('modal.changeName.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.saveButton,
                  { backgroundColor: theme.colors.ui.primary },
                  isUpdatingName && { opacity: 0.7 }
                ]}
                onPress={handleChangeName}
                disabled={isUpdatingName}
              >
                <Text style={{ color: theme.colors.content.inverse }}>{t('modal.changeName.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal - 이메일/비밀번호 사용자에게만 표시 */}
      {isPasswordAuthProvider && !isSocialAuthProvider && (
        <Modal
          visible={isPasswordModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPasswordModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={[styles.modalTitle, { color: theme.colors.content.primary }]}>{t('modal.changePassword.title')}</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder={t('modal.changePassword.currentPassword')}
                placeholderTextColor={theme.colors.content.tertiary}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder={t('modal.changePassword.newPassword')}
                placeholderTextColor={theme.colors.content.tertiary}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t('modal.changePassword.confirmPassword')}
                placeholderTextColor={theme.colors.content.tertiary}
                secureTextEntry
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setPasswordModalVisible(false)}
                >
                  <Text style={{ color: theme.colors.content.secondary }}>{t('modal.changePassword.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.colors.ui.primary }]}
                  onPress={handleChangePassword}
                >
                  <Text style={{ color: theme.colors.content.inverse }}>{t('modal.changePassword.save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  saveButton: {
    // backgroundColor theme color is applied in the component
  },
});

export default ProfileScreen; 