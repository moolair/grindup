import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, ScrollView, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation, NavigationProp, ParamListBase, CommonActions } from '@react-navigation/native';
import useTranslation from '../../hooks/useTranslation';
import { PlusIcon, ChevronRightIcon } from '../../components/Icons';
import { Platform } from 'react-native';
// 필요한 타입만 import - 대문자 파일명으로 수정
import NotificationService, { NotificationType } from '../../services/NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

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

  // 컴포넌트 마운트 시 알림 설정 로드
  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        console.log('알림 설정 로드 시작');

        // 기본 설정값 직접 설정
        setRoutineStartReminder(true);
        setRoutineEndReminder(true);

        // 시간 기본값 설정
        const defaultStartTime = new Date();
        defaultStartTime.setHours(8, 0, 0, 0);
        setRoutineStartTime(defaultStartTime);

        const defaultEndTime = new Date();
        defaultEndTime.setHours(21, 0, 0, 0);
        setRoutineEndTime(defaultEndTime);

        // 이후 비동기적으로 설정 시도
        try {
          // 알림 설정 불러오기
          const settingsJson = await AsyncStorage.getItem('notification_settings');
          if (settingsJson) {
            const settings = JSON.parse(settingsJson);
            setRoutineStartReminder(settings.routineStartReminder ?? true);
            setRoutineEndReminder(settings.routineEndReminder ?? true);
          }

          // 알림 시간 불러오기
          const timesJson = await AsyncStorage.getItem('notification_times');
          if (timesJson) {
            const times = JSON.parse(timesJson);
            if (times[NotificationType.ROUTINE_START]) {
              setRoutineStartTime(new Date(times[NotificationType.ROUTINE_START]));
            }
            if (times[NotificationType.ROUTINE_END]) {
              setRoutineEndTime(new Date(times[NotificationType.ROUTINE_END]));
            }
          }
        } catch (innerError) {
          console.error('알림 설정 상세 로드 오류:', innerError);
          // 기본값은 이미 설정되어 있으므로 오류가 발생해도 계속 진행
        }

        console.log('알림 설정 로드 완료');
      } catch (error) {
        console.error('알림 설정 로드 오류:', error);
      }
    };

    loadNotificationSettings();
  }, []);

  const navigateToLanguageSettings = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'LanguageSettings',
      })
    );
  };

  const onStartTimeChange = async (event: any, selectedDate?: Date) => {
    setShowStartTimePicker(false); // 항상 피커를 닫습니다
    if (selectedDate) {
      setRoutineStartTime(selectedDate);
      // 알림 시간 저장
      try {
        // 기존 시간 불러오기
        const timesJson = await AsyncStorage.getItem('notification_times');
        const times = timesJson ? JSON.parse(timesJson) : {};

        // 새 시간 저장
        times[NotificationType.ROUTINE_START] = selectedDate.toISOString();
        await AsyncStorage.setItem('notification_times', JSON.stringify(times));
        console.log('시작 알림 시간 저장됨:', selectedDate);

        // 실제 알림 스케줄링은 로직 단순화를 위해 생략 (앱 재시작시 적용)
      } catch (error) {
        console.error('시작 알림 시간 저장 오류:', error);
      }
    }
  };

  const onEndTimeChange = async (event: any, selectedDate?: Date) => {
    setShowEndTimePicker(false); // 항상 피커를 닫습니다
    if (selectedDate) {
      setRoutineEndTime(selectedDate);
      // 알림 시간 저장
      try {
        // 기존 시간 불러오기
        const timesJson = await AsyncStorage.getItem('notification_times');
        const times = timesJson ? JSON.parse(timesJson) : {};

        // 새 시간 저장
        times[NotificationType.ROUTINE_END] = selectedDate.toISOString();
        await AsyncStorage.setItem('notification_times', JSON.stringify(times));
        console.log('미완료 알림 시간 저장됨:', selectedDate);

        // 실제 알림 스케줄링은 로직 단순화를 위해 생략 (앱 재시작시 적용)
      } catch (error) {
        console.error('미완료 알림 시간 저장 오류:', error);
      }
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

  const saveStartTime = async () => {
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

    // 알림 시간 저장
    try {
      // 기존 시간 불러오기
      const timesJson = await AsyncStorage.getItem('notification_times');
      const times = timesJson ? JSON.parse(timesJson) : {};

      // 새 시간 저장
      times[NotificationType.ROUTINE_START] = newDate.toISOString();
      await AsyncStorage.setItem('notification_times', JSON.stringify(times));
      console.log('시작 알림 시간 저장됨:', newDate);
    } catch (error) {
      console.error('시작 알림 시간 저장 오류:', error);
    }
  };

  const saveEndTime = async () => {
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

    // 알림 시간 저장
    try {
      // 기존 시간 불러오기
      const timesJson = await AsyncStorage.getItem('notification_times');
      const times = timesJson ? JSON.parse(timesJson) : {};

      // 새 시간 저장
      times[NotificationType.ROUTINE_END] = newDate.toISOString();
      await AsyncStorage.setItem('notification_times', JSON.stringify(times));
      console.log('미완료 알림 시간 저장됨:', newDate);
    } catch (error) {
      console.error('미완료 알림 시간 저장 오류:', error);
    }
  };

  const handleRoutineStartReminderToggle = async (value: boolean) => {
    setRoutineStartReminder(value);
    try {
      // 설정 저장
      const settingsJson = await AsyncStorage.getItem('notification_settings');
      const settings = settingsJson ? JSON.parse(settingsJson) : {
        routineStartReminder: true,
        routineEndReminder: true
      };

      settings.routineStartReminder = value;
      await AsyncStorage.setItem('notification_settings', JSON.stringify(settings));
      console.log('시작 알림 설정 저장됨:', value);
    } catch (error) {
      console.error('알림 설정 저장 오류:', error);
    }
  };

  const handleRoutineEndReminderToggle = async (value: boolean) => {
    setRoutineEndReminder(value);
    try {
      // 설정 저장
      const settingsJson = await AsyncStorage.getItem('notification_settings');
      const settings = settingsJson ? JSON.parse(settingsJson) : {
        routineStartReminder: true,
        routineEndReminder: true
      };

      settings.routineEndReminder = value;
      await AsyncStorage.setItem('notification_settings', JSON.stringify(settings));
      console.log('미완료 알림 설정 저장됨:', value);
    } catch (error) {
      console.error('알림 설정 저장 오류:', error);
    }
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
              onValueChange={handleRoutineStartReminderToggle}
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
              onValueChange={handleRoutineEndReminderToggle}
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

          {/* 알림 테스트 버튼 */}
          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: theme.colors.ui.primary }]}
            onPress={async () => {
              // 직접 import한 함수 사용
              try {
                console.log("알림 테스트 시작");

                // iOS에서는 먼저 권한 확인 및 요청
                if (Platform.OS === 'ios') {
                  try {
                    // 권한 요청
                    const authStatus = await PushNotificationIOS.requestPermissions({
                      alert: true,
                      badge: true,
                      sound: true,
                    });
                    console.log('iOS 알림 권한 상태:', authStatus);

                    if (!authStatus.alert) {
                      Alert.alert(
                        '알림 권한 필요',
                        '알림을 표시하려면 알림 권한이 필요합니다. 설정 앱에서 알림 권한을 활성화해주세요.',
                        [{ text: '확인', style: 'default' }]
                      );
                      return;
                    }
                  } catch (error) {
                    console.error('알림 권한 요청 오류:', error);
                  }
                }

                // 기본 알림 테스트
                NotificationService.sendTestNotification();

                // 테스트용 Badge 설정
                if (Platform.OS === 'ios') {
                  PushNotificationIOS.setApplicationIconBadgeNumber(1);
                }

                // 미완료 루틴 알림 테스트 (예시 데이터)
                // 4초 후에 실행하여 이전 알림과 겹치지 않도록 함
                setTimeout(() => {
                  const sampleIncompleteRoutines = [
                    '아침 운동',
                    '독서',
                    '명상'
                  ];

                  NotificationService.showIncompleteRoutinesNotification(sampleIncompleteRoutines);
                }, 4000);

                // 성공 메시지
                Alert.alert(
                  '알림 테스트',
                  '알림이 발송되었습니다. 2초 및 4초 후에 시스템 알림을 확인해보세요. 잠금 화면에서도 확인 가능합니다.',
                  [{ text: '확인', style: 'default' }]
                );
              } catch (error) {
                console.error("알림 테스트 오류:", error);
                Alert.alert('오류 발생', '알림 테스트 중 오류가 발생했습니다: ' + error);
              }
            }}
          >
            <Text style={[styles.testButtonText, { color: theme.colors.content.inverse }]}>
              알림 테스트
            </Text>
          </TouchableOpacity>
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
  },
  testButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen; 