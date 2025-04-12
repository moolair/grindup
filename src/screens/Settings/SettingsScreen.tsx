import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, ScrollView, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation, NavigationProp, ParamListBase, CommonActions } from '@react-navigation/native';
import useTranslation from '../../hooks/useTranslation';
import { PlusIcon, ChevronRightIcon } from '../../components/Icons';
import { Platform } from 'react-native';

// Android에서만 DateTimePicker를 사용
let DateTimePicker: any = null;
if (Platform.OS === 'android') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme.type === 'dark';
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { t, currentLanguageNativeName } = useTranslation('settings');

  const [soundEnabled, setSoundEnabled] = useState(true);

  // 루틴 알림 관련 상태
  const [routineStartReminder, setRoutineStartReminder] = useState(true);
  const [routineEndReminder, setRoutineEndReminder] = useState(true);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [routineStartTime, setRoutineStartTime] = useState(new Date(new Date().setHours(8, 0, 0, 0)));
  const [routineEndTime, setRoutineEndTime] = useState(new Date(new Date().setHours(21, 0, 0, 0)));

  // iOS 선택기 전용 상태
  const [tempHour, setTempHour] = useState('8');
  const [tempMinute, setTempMinute] = useState('00');
  const [tempAmPm, setTempAmPm] = useState('AM');
  const [tempEndHour, setTempEndHour] = useState('9');
  const [tempEndMinute, setTempEndMinute] = useState('00');
  const [tempEndAmPm, setTempEndAmPm] = useState('PM');

  const navigateToLanguageSettings = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'LanguageSettings',
      })
    );
  };

  const onStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartTimePicker(false); // 항상 피커를 닫습니다
    if (selectedDate) {
      setRoutineStartTime(selectedDate);
    }
  };

  const onEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndTimePicker(false); // 항상 피커를 닫습니다
    if (selectedDate) {
      setRoutineEndTime(selectedDate);
    }
  };

  const openStartTimePicker = () => {
    // iOS에서 임시 시간 상태 초기화
    if (Platform.OS === 'ios') {
      const hours = routineStartTime.getHours();
      const minutes = routineStartTime.getMinutes();

      setTempHour(hours > 12 ? (hours - 12).toString() : hours === 0 ? '12' : hours.toString());
      setTempMinute(minutes < 10 ? `0${minutes}` : minutes.toString());
      setTempAmPm(hours >= 12 ? 'PM' : 'AM');
    }

    setShowStartTimePicker(true);
  };

  const openEndTimePicker = () => {
    // iOS에서 임시 시간 상태 초기화
    if (Platform.OS === 'ios') {
      const hours = routineEndTime.getHours();
      const minutes = routineEndTime.getMinutes();

      setTempEndHour(hours > 12 ? (hours - 12).toString() : hours === 0 ? '12' : hours.toString());
      setTempEndMinute(minutes < 10 ? `0${minutes}` : minutes.toString());
      setTempEndAmPm(hours >= 12 ? 'PM' : 'AM');
    }

    setShowEndTimePicker(true);
  };

  const saveStartTime = () => {
    // 시작 시간 저장 (iOS)
    let hours = parseInt(tempHour);
    if (tempAmPm === 'PM' && hours < 12) {
      hours += 12;
    } else if (tempAmPm === 'AM' && hours === 12) {
      hours = 0;
    }

    const minutes = parseInt(tempMinute);
    const newDate = new Date(routineStartTime);
    newDate.setHours(hours, minutes, 0, 0);

    setRoutineStartTime(newDate);
    setShowStartTimePicker(false);
  };

  const saveEndTime = () => {
    // 종료 시간 저장 (iOS)
    let hours = parseInt(tempEndHour);
    if (tempEndAmPm === 'PM' && hours < 12) {
      hours += 12;
    } else if (tempEndAmPm === 'AM' && hours === 12) {
      hours = 0;
    }

    const minutes = parseInt(tempEndMinute);
    const newDate = new Date(routineEndTime);
    newDate.setHours(hours, minutes, 0, 0);

    setRoutineEndTime(newDate);
    setShowEndTimePicker(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const generateHours = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
      <Picker.Item key={`hour-${hour}`} label={hour.toString()} value={hour.toString()} />
    ));
  };

  const generateMinutes = () => {
    return Array.from({ length: 60 }, (_, i) => i).map(minute => {
      const minuteStr = minute < 10 ? `0${minute}` : minute.toString();
      return <Picker.Item key={`minute-${minute}`} label={minuteStr} value={minuteStr} />;
    });
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
            <Text style={[styles.settingLabel, { color: theme.colors.content.primary }]}>{t('notifications.routine.startReminder')}</Text>
            <Switch
              value={routineStartReminder}
              onValueChange={setRoutineStartReminder}
              trackColor={{ false: theme.colors.content.disabled, true: theme.colors.ui.primary }}
              thumbColor={routineStartReminder ? theme.colors.content.inverse : '#f4f3f4'}
            />
          </View>

          {routineStartReminder && (
            <TouchableOpacity
              style={[styles.settingSubItem, { paddingLeft: 30 }]}
              onPress={openStartTimePicker}
            >
              <Text style={[styles.settingSubLabel, { color: theme.colors.content.secondary }]}>{t('notifications.routine.reminderTime')}</Text>
              <View style={styles.valueWithArrow}>
                <Text style={[styles.settingValue, { color: theme.colors.content.primary }]}>
                  {formatTime(routineStartTime)}
                </Text>
                <ChevronRightIcon size={20} color={theme.colors.content.secondary} />
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.content.primary }]}>{t('notifications.routine.endReminder')}</Text>
            <Switch
              value={routineEndReminder}
              onValueChange={setRoutineEndReminder}
              trackColor={{ false: theme.colors.content.disabled, true: theme.colors.ui.primary }}
              thumbColor={routineEndReminder ? theme.colors.content.inverse : '#f4f3f4'}
            />
          </View>

          {routineEndReminder && (
            <TouchableOpacity
              style={[styles.settingSubItem, { paddingLeft: 30 }]}
              onPress={openEndTimePicker}
            >
              <Text style={[styles.settingSubLabel, { color: theme.colors.content.secondary }]}>{t('notifications.routine.reminderTime')}</Text>
              <View style={styles.valueWithArrow}>
                <Text style={[styles.settingValue, { color: theme.colors.content.primary }]}>
                  {formatTime(routineEndTime)}
                </Text>
                <ChevronRightIcon size={20} color={theme.colors.content.secondary} />
              </View>
            </TouchableOpacity>
          )}
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

      {/* iOS용 커스텀 시간 선택기 */}
      {Platform.OS === 'ios' && showStartTimePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showStartTimePicker}
        >
          <View style={styles.modalContainer}>
            <View style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.background.primary,
                borderTopColor: theme.colors.border.light,
                borderLeftColor: theme.colors.border.light,
                borderRightColor: theme.colors.border.light,
              }
            ]}>
              <View style={[
                styles.modalHeader,
                {
                  borderBottomColor: theme.colors.border.light,
                  backgroundColor: theme.colors.background.secondary
                }
              ]}>
                <TouchableOpacity onPress={() => setShowStartTimePicker(false)}>
                  <Text style={{ color: theme.colors.ui.error }}>{t('general.cancel')}</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: theme.colors.content.primary }]}>{t('notifications.routine.reminderTime')}</Text>
                <TouchableOpacity onPress={saveStartTime}>
                  <Text style={{ color: theme.colors.ui.primary }}>{t('general.confirm')}</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.pickerContainer, { backgroundColor: theme.colors.background.primary }]}>
                <View style={styles.pickerColumn}>
                  <Text style={[styles.pickerLabel, { color: theme.colors.content.primary }]}>{t('time.hour')}</Text>
                  <Picker
                    selectedValue={tempHour}
                    onValueChange={(itemValue: string) => setTempHour(itemValue)}
                    style={[{ width: 100, height: 200 }, Platform.select({
                      ios: { color: theme.colors.content.primary }
                    })]}
                    itemStyle={{ color: theme.colors.content.primary }}
                  >
                    {generateHours()}
                  </Picker>
                </View>

                <View style={styles.pickerColumn}>
                  <Text style={[styles.pickerLabel, { color: theme.colors.content.primary }]}>{t('time.minute')}</Text>
                  <Picker
                    selectedValue={tempMinute}
                    onValueChange={(itemValue: string) => setTempMinute(itemValue)}
                    style={[{ width: 100, height: 200 }, Platform.select({
                      ios: { color: theme.colors.content.primary }
                    })]}
                    itemStyle={{ color: theme.colors.content.primary }}
                  >
                    {generateMinutes()}
                  </Picker>
                </View>

                <View style={styles.pickerColumn}>
                  <Text style={[styles.pickerLabel, { color: theme.colors.content.primary }]}>{t('time.period')}</Text>
                  <Picker
                    selectedValue={tempAmPm}
                    onValueChange={(itemValue: string) => setTempAmPm(itemValue)}
                    style={[{ width: 100, height: 200 }, Platform.select({
                      ios: { color: theme.colors.content.primary }
                    })]}
                    itemStyle={{ color: theme.colors.content.primary }}
                  >
                    <Picker.Item label={t('time.am')} value="AM" />
                    <Picker.Item label={t('time.pm')} value="PM" />
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === 'ios' && showEndTimePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showEndTimePicker}
        >
          <View style={styles.modalContainer}>
            <View style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.background.primary,
                borderTopColor: theme.colors.border.light,
                borderLeftColor: theme.colors.border.light,
                borderRightColor: theme.colors.border.light,
              }
            ]}>
              <View style={[
                styles.modalHeader,
                {
                  borderBottomColor: theme.colors.border.light,
                  backgroundColor: theme.colors.background.secondary
                }
              ]}>
                <TouchableOpacity onPress={() => setShowEndTimePicker(false)}>
                  <Text style={{ color: theme.colors.ui.error }}>{t('general.cancel')}</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: theme.colors.content.primary }]}>{t('notifications.routine.reminderTime')}</Text>
                <TouchableOpacity onPress={saveEndTime}>
                  <Text style={{ color: theme.colors.ui.primary }}>{t('general.confirm')}</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.pickerContainer, { backgroundColor: theme.colors.background.primary }]}>
                <View style={styles.pickerColumn}>
                  <Text style={[styles.pickerLabel, { color: theme.colors.content.primary }]}>{t('time.hour')}</Text>
                  <Picker
                    selectedValue={tempEndHour}
                    onValueChange={(itemValue: string) => setTempEndHour(itemValue)}
                    style={[{ width: 100, height: 200 }, Platform.select({
                      ios: { color: theme.colors.content.primary }
                    })]}
                    itemStyle={{ color: theme.colors.content.primary }}
                  >
                    {generateHours()}
                  </Picker>
                </View>

                <View style={styles.pickerColumn}>
                  <Text style={[styles.pickerLabel, { color: theme.colors.content.primary }]}>{t('time.minute')}</Text>
                  <Picker
                    selectedValue={tempEndMinute}
                    onValueChange={(itemValue: string) => setTempEndMinute(itemValue)}
                    style={[{ width: 100, height: 200 }, Platform.select({
                      ios: { color: theme.colors.content.primary }
                    })]}
                    itemStyle={{ color: theme.colors.content.primary }}
                  >
                    {generateMinutes()}
                  </Picker>
                </View>

                <View style={styles.pickerColumn}>
                  <Text style={[styles.pickerLabel, { color: theme.colors.content.primary }]}>{t('time.period')}</Text>
                  <Picker
                    selectedValue={tempEndAmPm}
                    onValueChange={(itemValue: string) => setTempEndAmPm(itemValue)}
                    style={[{ width: 100, height: 200 }, Platform.select({
                      ios: { color: theme.colors.content.primary }
                    })]}
                    itemStyle={{ color: theme.colors.content.primary }}
                  >
                    <Picker.Item label={t('time.am')} value="AM" />
                    <Picker.Item label={t('time.pm')} value="PM" />
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android용 직접 시간 선택기 */}
      {Platform.OS === 'android' && DateTimePicker && showStartTimePicker && (
        <DateTimePicker
          testID="startTimePicker"
          value={routineStartTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onStartTimeChange}
        />
      )}

      {Platform.OS === 'android' && DateTimePicker && showEndTimePicker && (
        <DateTimePicker
          testID="endTimePicker"
          value={routineEndTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onEndTimeChange}
        />
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
  settingSubItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 5,
  },
  settingSubLabel: {
    fontSize: 14,
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
  // 모달 스타일
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  pickerColumn: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  }
});

export default SettingsScreen; 