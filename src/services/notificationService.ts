import { Platform, Alert, Linking } from "react-native";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

export enum NotificationType {
  ROUTINE_START = "routine_start",
  ROUTINE_END = "routine_end",
  INCOMPLETE_ROUTINES = "incomplete_routines"
}

const CHANNEL_ID = 'routine-reminders';

class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  private constructor() { }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async initializeNotifications(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('[NotificationService] 알림 서비스 초기화 시작...');

      if (Platform.OS === 'ios') {
        // iOS 알림 설정
        PushNotificationIOS.addEventListener('register', (token) => {
          console.log('[NotificationService] Push 알림 토큰:', token);
        });

        PushNotificationIOS.addEventListener('registrationError', (error) => {
          console.log('[NotificationService] Push 알림 등록 오류:', error);
        });

        PushNotificationIOS.addEventListener('notification', (notification) => {
          console.log('[NotificationService] 알림 수신:', notification);
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        });

        PushNotificationIOS.addEventListener('localNotification', (notification) => {
          console.log('[NotificationService] 로컬 알림 수신:', notification);
        });

        // 권한 요청
        const authStatus = await PushNotificationIOS.requestPermissions({
          alert: true,
          badge: true,
          sound: true,
        });

        console.log('[NotificationService] iOS 알림 권한 상태:', authStatus);
      } else {
        // Android 알림
        PushNotification.configure({
          onRegister: (token) => {
            console.log('[NotificationService] Android 토큰 등록:', token);
          },
          onNotification: (notification) => {
            console.log('[NotificationService] Android 알림 수신:', notification);
            // @ts-ignore - Android에서는 매개변수 없이도 동작함
            notification.finish();
          },
          onAction: (notification) => {
            console.log('[NotificationService] Android 알림 액션:', notification);
          },
          onRegistrationError: (error) => {
            console.log('[NotificationService] Android 등록 오류:', error);
          },
          permissions: {
            alert: true,
            badge: true,
            sound: true,
          },
          popInitialNotification: true,
          requestPermissions: true,
        });

        // Android 채널 생성
        PushNotification.createChannel(
          {
            channelId: CHANNEL_ID,
            channelName: '루틴 알림',
            channelDescription: '루틴 관련 알림',
            playSound: true,
            soundName: 'default',
            importance: 4,
            vibrate: true,
          },
          (created) => console.log(`[NotificationService] 알림 채널 생성됨: ${created}`)
        );
      }

      this.isInitialized = true;
      console.log('[NotificationService] 알림 서비스 초기화 완료');
    } catch (error) {
      console.error('[NotificationService] 알림 서비스 초기화 실패:', error);
      throw error;
    }
  }

  public async sendTestNotification() {
    try {
      console.log('[NotificationService] 테스트 알림 발송 시작...');
      const hasPermission = await this.requestPermissions();

      if (!hasPermission) {
        console.log('[NotificationService] 알림 권한이 없습니다.');
        Alert.alert(
          '알림 권한 필요',
          '알림을 보내려면 설정에서 알림 권한을 허용해주세요.',
          [
            { text: '설정으로 이동', onPress: () => Linking.openSettings() },
            { text: '취소' }
          ]
        );
        return;
      }

      if (Platform.OS === 'ios') {
        // iOS 알림 테스트
        console.log('[NotificationService] iOS 테스트 알림 발송 중...');

        // 배지 초기화
        PushNotificationIOS.setApplicationIconBadgeNumber(0);

        // iOS 13 이상에서는 addNotificationRequest 사용
        PushNotificationIOS.addNotificationRequest({
          id: `test-${Date.now()}`,
          title: 'GrindUp 알림 테스트',
          body: '알림이 잘 작동하나요? 👋',
          sound: 'default',
          badge: 1,
          userInfo: {
            type: 'test'
          }
        });

        console.log('[NotificationService] iOS 알림 발송 완료');
      } else {
        // Android 알림
        console.log('[NotificationService] Android 테스트 알림 발송 중...');

        PushNotification.localNotification({
          channelId: CHANNEL_ID,
          title: 'GrindUp 알림 테스트',
          message: '알림이 잘 작동하나요? 👋',
          playSound: true,
          soundName: 'default',
          importance: 'high',
          priority: 'high',
        });

        console.log('[NotificationService] Android 알림 발송 완료');
      }
    } catch (error) {
      console.error('[NotificationService] 테스트 알림 발송 실패:', error);
      throw error;
    }
  }

  public async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await PushNotificationIOS.requestPermissions({
          alert: true,
          badge: true,
          sound: true,
        });
        return authStatus.alert ?? false;
      } else {
        const permissions = await PushNotification.requestPermissions();
        return permissions.alert ?? false;
      }
    } catch (error) {
      console.error('[NotificationService] 알림 권한 요청 실패:', error);
      return false;
    }
  }

  public showIncompleteRoutinesNotification(routineNames: string[]) {
    if (!routineNames || routineNames.length === 0) return;

    try {
      const title = '완료되지 않은 루틴이 있습니다';
      const message = `완료해야 할 루틴: ${routineNames.join(', ')}`;

      if (Platform.OS === 'ios') {
        PushNotificationIOS.addNotificationRequest({
          id: `incomplete-${Date.now()}`,
          title: title,
          body: message,
          sound: 'default',
          badge: routineNames.length
        });
      } else {
        PushNotification.localNotification({
          channelId: CHANNEL_ID,
          title: title,
          message: message,
          playSound: true,
          soundName: 'default',
          importance: 'high',
          priority: 'high',
          number: routineNames.length
        });
      }

      console.log('[NotificationService] 미완료 루틴 알림 발송:', routineNames);
    } catch (error) {
      console.error('[NotificationService] 미완료 루틴 알림 발송 중 오류:', error);
    }
  }

  public async saveNotificationSettings(settings: { [key: string]: boolean }): Promise<void> {
    try {
      await AsyncStorage.setItem('notification_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('[NotificationService] 알림 설정 저장 오류:', error);
    }
  }

  public async getNotificationSettings(): Promise<{ [key: string]: boolean }> {
    try {
      const settings = await AsyncStorage.getItem('notification_settings');
      return settings ? JSON.parse(settings) : {
        routineStartReminder: true,
        routineEndReminder: true
      };
    } catch (error) {
      console.error('[NotificationService] 알림 설정 불러오기 오류:', error);
      return {
        routineStartReminder: true,
        routineEndReminder: true
      };
    }
  }
}

export default NotificationService.getInstance();
