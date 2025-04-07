import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation, NavigationProp, ParamListBase, CommonActions } from '@react-navigation/native';
import useTranslation from '../../hooks/useTranslation';
import { PlusIcon, ChevronRightIcon } from '../../components/Icons';

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme.type === 'dark';
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { t, currentLanguageNativeName } = useTranslation('settings');

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const navigateToLanguageSettings = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'LanguageSettings',
      })
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.content.primary }]}>{t('general.title')}</Text>
      </View>

      <ScrollView>
        <View style={[styles.section, { borderBottomColor: theme.colors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.content.primary }]}>{t('notifications.title')}</Text>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.content.primary }]}>{t('notifications.pushNotifications')}</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: theme.colors.content.disabled, true: theme.colors.ui.primary }}
              thumbColor={pushNotifications ? theme.colors.content.inverse : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.content.primary }]}>{t('notifications.emailNotifications')}</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: theme.colors.content.disabled, true: theme.colors.ui.primary }}
              thumbColor={emailNotifications ? theme.colors.content.inverse : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.colors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.content.primary }]}>{t('appearance.title')}</Text>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.content.primary }]}>{t('appearance.theme.title')}</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.content.disabled, true: theme.colors.ui.primary }}
              thumbColor={isDarkMode ? theme.colors.content.inverse : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={navigateToLanguageSettings}>
            <Text style={[styles.settingLabel, { color: theme.colors.content.primary }]}>{t('appearance.language.title')}</Text>
            <View style={styles.valueWithArrow}>
              <Text style={[styles.settingValue, { color: theme.colors.content.secondary }]}>{currentLanguageNativeName}</Text>
              <ChevronRightIcon size={24} color={theme.colors.content.secondary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.colors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.content.primary }]}>{t('notifications.soundsAndVibration')}</Text>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.content.primary }]}>{t('notifications.sounds')}</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: theme.colors.content.disabled, true: theme.colors.ui.primary }}
              thumbColor={soundEnabled ? theme.colors.content.inverse : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.colors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.content.primary }]}>{t('about.title')}</Text>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.content.primary }]}>{t('about.version')}</Text>
            <Text style={[styles.infoValue, { color: theme.colors.content.secondary }]}>1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.content.primary }]}>{t('about.termsOfService')}</Text>
            <Text style={[styles.infoAction, { color: theme.colors.ui.primary }]}>{t('general.view')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.content.primary }]}>{t('about.privacyPolicy')}</Text>
            <Text style={[styles.infoAction, { color: theme.colors.ui.primary }]}>{t('general.view')}</Text>
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
  settingValue: {
    fontSize: 16,
    marginRight: 8,
  },
  valueWithArrow: {
    flexDirection: 'row',
    alignItems: 'center',
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