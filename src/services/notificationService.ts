import { Platform, Alert, Linking } from "react-native";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification, { Importance } from 'react-native-push-notification';

export enum NotificationType {
  ROUTINE_START = "routine_start",
  ROUTINE_END = "routine_end",
  INCOMPLETE_ROUTINES = "incomplete_routines"
}

// 채널 ID 상수 정의
const CHANNEL_ID = 'routine-reminders';

// 테스트용 알림 (시스템 알림 표시)
export const testLocalNotification = async () => {
  try {
    console.log('알림 테스트 시작');

    // iOS 권한 확인
    if (Platform.OS === 'ios') {
      const authStatus = await PushNotificationIOS.checkPermissions();
      console.log('iOS 알림 권한 상태:', authStatus);

      if (!authStatus.alert) {
        const newStatus = await PushNotificationIOS.requestPermissions({
          alert: true,
          badge: true,
          sound: true,
          critical: true,
        });
        console.log('새로운 iOS 알림 권한 상태:', newStatus);

        if (!newStatus.alert) {
          Alert.alert(
            '알림 권한 필요',
            '알림을 표시하려면 설정 앱에서 알림 권한을 허용해주세요.',
            [
              {
                text: '설정으로 이동',
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  }
                }
              },
              { text: '취소', style: 'cancel' }
            ]
          );
          return;
        }
      }
    }

    // 앱 내 알림
    Alert.alert("알림 테스트", "시스템 알림을 발송합니다!");

    // 테스트 알림 1 - 기본
    const notificationId = `test-${Date.now()}`;
    if (Platform.OS === 'ios') {
      console.log('iOS 알림 테스트 1 발송');
      await PushNotificationIOS.addNotificationRequest({
        id: notificationId,
        title: 'GrindUp 알림 테스트 1',
        body: '이 알림이 보이나요? 👋',
        sound: 'default',
        threadId: 'test-notifications',
      });
    }

    // 테스트 알림 2 - 지연
    setTimeout(async () => {
      console.log('지연된 알림 테스트 발송');
      if (Platform.OS === 'ios') {
        await PushNotificationIOS.addNotificationRequest({
          id: `${notificationId}-delayed`,
          title: 'GrindUp 알림 테스트 2',
          body: '2초 후 알림입니다! 🎉',
          sound: 'default',
          threadId: 'test-notifications',
        });
      }

      // 크로스 플랫폼 알림
      PushNotification.localNotification({
        channelId: CHANNEL_ID,
        title: 'GrindUp 알림 테스트 3',
        message: '통합 라이브러리 테스트입니다! ✨',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        priority: 'high',
        smallIcon: 'ic_notification',
        largeIcon: 'ic_launcher',
        bigText: '이것은 확장된 알림 내용입니다. 알림을 길게 누르면 더 많은 내용을 볼 수 있습니다.',
        subText: '알림 테스트',
        color: '#FF0000',
      });
    }, 2000);

    console.log('알림 테스트 발송 완료');
  } catch (error) {
    console.error('알림 테스트 중 오류 발생:', error);
    Alert.alert('오류', '알림 테스트 중 문제가 발생했습니다.');
  }
};

// 미완료 루틴 알림 표시 - 수정
export const showIncompleteRoutinesNotification = async (routineNames: string[]) => {
  if (!routineNames || routineNames.length === 0) return;

  console.log('Showing notification for incomplete routines:', routineNames);

  // 알림 메시지 생성
  const title = 'You have not completed routines';
  const message = routineNames.length === 1
    ? `You need to complete: ${routineNames[0]}`
    : `You need to complete: ${routineNames.join(', ')}`;

  try {
    // iOS 전용 알림 처리
    if (Platform.OS === 'ios') {
      console.log('iOS: 알림 권한 확인 중...');
      const authStatus = await PushNotificationIOS.checkPermissions();
      console.log('iOS: 알림 권한 상태 -', authStatus);

      if (!authStatus.alert) {
        console.log('iOS: 알림 권한 요청 중...');
        await PushNotificationIOS.requestPermissions({
          alert: true,
          badge: true,
          sound: true,
          critical: true,
        });
      }

      // iOS 알림 전송 - 방법 1
      const notificationId = `incomplete-routines-${Date.now()}`;
      console.log('iOS: 알림 전송 시도 (addNotificationRequest) - ID:', notificationId);

      await PushNotificationIOS.addNotificationRequest({
        id: notificationId,
        title: title,
        body: message,
        sound: 'default',
        threadId: 'incomplete-routines',
        userInfo: {
          type: NotificationType.INCOMPLETE_ROUTINES,
          routineNames,
          id: notificationId
        }
      });

      // iOS 알림 전송 - 방법 2 (백업)
      console.log('iOS: 백업 알림 전송 시도 (presentLocalNotification)');
      PushNotificationIOS.presentLocalNotification({
        alertTitle: title,
        alertBody: message,
        applicationIconBadgeNumber: routineNames.length,
        category: 'incomplete-routines',
        userInfo: {
          type: NotificationType.INCOMPLETE_ROUTINES,
          routineNames,
          id: notificationId
        }
      });

      // 배지 업데이트
      await PushNotificationIOS.setApplicationIconBadgeNumber(routineNames.length);
    }

    // 크로스 플랫폼 알림 (Android/iOS 공통)
    console.log(`${Platform.OS}: 크로스 플랫폼 알림 전송 시도`);
    PushNotification.localNotification({
      channelId: CHANNEL_ID,
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
      importance: Importance.HIGH,
      priority: 'high',
      vibrate: true,
      vibration: 300,
      smallIcon: 'ic_notification',
      largeIcon: 'ic_launcher',
      bigText: message,  // 긴 텍스트 지원
      subText: 'Incomplete Routines',  // 추가 설명
      color: '#FF0000',  // 알림 색상
      visibility: 'public',
      userInfo: {
        type: NotificationType.INCOMPLETE_ROUTINES,
        routineNames
      }
    });

    console.log(`${Platform.OS}: 알림 전송 완료`);
  } catch (error) {
    console.error('알림 전송 중 오류 발생:', error);
  }
};

// 알림 초기화 함수 수정
export const initializeNotifications = async (): Promise<void> => {
  console.log("알림 서비스 초기화 중...");

  try {
    // iOS 권한 초기 설정
    if (Platform.OS === 'ios') {
      console.log('iOS: 초기 권한 요청');
      const authStatus = await PushNotificationIOS.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
        critical: true,
        provisional: true // 임시 권한 요청 추가
      });
      console.log('iOS: 초기 알림 권한 상태 -', authStatus);

      // 현재 배지 초기화
      await PushNotificationIOS.setApplicationIconBadgeNumber(0);
    }

    // PushNotification 설정
    PushNotification.configure({
      onRegister: function (token) {
        console.log('알림 토큰:', token);
      },
      onNotification: function (notification) {
        console.log('알림 수신:', notification);

        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      onRegistrationError: function (err) {
        console.error('알림 등록 오류:', err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
        critical: true,
        provisional: true
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    // Android 채널 생성
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: CHANNEL_ID,
          channelName: '루틴 알림',
          channelDescription: '루틴 관련 모든 알림',
          playSound: true,
          soundName: 'default',
          importance: Importance.HIGH,
          vibrate: true,
        },
        (created) => console.log(`알림 채널 생성 ${created ? '성공' : '실패'}`)
      );
    }

    console.log('알림 서비스 초기화 완료');
  } catch (error) {
    console.error('알림 서비스 초기화 중 오류:', error);
  }
};

// 저장된 알림 설정 가져오기
export const getNotificationSettings = async (): Promise<{ [key: string]: boolean }> => {
  try {
    const settings = await AsyncStorage.getItem('notification_settings');
    return settings ? JSON.parse(settings) : {
      routineStartReminder: true,
      routineEndReminder: true
    };
  } catch (error) {
    console.error('알림 설정 불러오기 오류:', error);
    return {
      routineStartReminder: true,
      routineEndReminder: true
    };
  }
};

// 알림 설정 저장하기
export const saveNotificationSettings = async (settings: { [key: string]: boolean }): Promise<void> => {
  try {
    await AsyncStorage.setItem('notification_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('알림 설정 저장 오류:', error);
  }
};

// 알림 시간 저장하기
export const saveNotificationTime = async (type: NotificationType, time: Date): Promise<void> => {
  try {
    let times = await getNotificationTimes();
    times[type] = time.toISOString();
    await AsyncStorage.setItem('notification_times', JSON.stringify(times));
  } catch (error) {
    console.error('알림 시간 저장 오류:', error);
  }
};

// 저장된 알림 시간 가져오기
export const getNotificationTimes = async (): Promise<{ [key: string]: string }> => {
  try {
    const times = await AsyncStorage.getItem('notification_times');
    if (times) {
      return JSON.parse(times);
    }

    // 기본값 설정
    const defaultStartTime = new Date();
    defaultStartTime.setHours(8, 0, 0, 0);

    const defaultEndTime = new Date();
    defaultEndTime.setHours(21, 0, 0, 0);

    return {
      [NotificationType.ROUTINE_START]: defaultStartTime.toISOString(),
      [NotificationType.ROUTINE_END]: defaultEndTime.toISOString()
    };
  } catch (error) {
    console.error('알림 시간 불러오기 오류:', error);

    // 오류 시 기본값 반환
    const defaultStartTime = new Date();
    defaultStartTime.setHours(8, 0, 0, 0);

    const defaultEndTime = new Date();
    defaultEndTime.setHours(21, 0, 0, 0);

    return {
      [NotificationType.ROUTINE_START]: defaultStartTime.toISOString(),
      [NotificationType.ROUTINE_END]: defaultEndTime.toISOString()
    };
  }
};
