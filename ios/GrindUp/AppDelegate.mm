#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>

// 알림 관련 import 추가
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>

@interface AppDelegate () <UNUserNotificationCenterDelegate>
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"GrindUp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  // 알림 설정 추가
  [self configureNotifications];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// 알림 관련 설정
- (void)configureNotifications {
  // iOS 10 이상에서 필요한 알림 설정
  if (@available(iOS 10.0, *)) {
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;
    
    // 알림 권한 요청
    UNAuthorizationOptions options = UNAuthorizationOptionAlert + 
                                   UNAuthorizationOptionSound + 
                                   UNAuthorizationOptionBadge;
    [center requestAuthorizationWithOptions:options
                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
                            if (error) {
                                NSLog(@"알림 권한 요청 오류: %@", error);
                            } else {
                                NSLog(@"알림 권한 상태: %@", granted ? @"허용" : @"거부");
                                if (granted) {
                                    dispatch_async(dispatch_get_main_queue(), ^{
                                        [[UIApplication sharedApplication] registerForRemoteNotifications];
                                    });
                                }
                            }
                        }];
  }
}

// 앱 실행 중에도 알림 표시 허용
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler API_AVAILABLE(ios(10.0)) {
  NSLog(@"앱 실행 중 알림 수신: %@", notification.request.content.userInfo);
  completionHandler(UNNotificationPresentationOptionSound | 
                   UNNotificationPresentationOptionAlert | 
                   UNNotificationPresentationOptionBadge);
}

// 알림 응답 처리
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler API_AVAILABLE(ios(10.0)) {
  NSLog(@"알림 응답 처리: %@", response.notification.request.content.userInfo);
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
  completionHandler();
}

// PushNotificationIOS 필수 메서드
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSLog(@"푸시 알림 토큰 등록 성공");
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// PushNotificationIOS 필수 메서드
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"푸시 알림 토큰 등록 실패: %@", error);
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}

// PushNotificationIOS 필수 메서드
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  NSLog(@"원격 알림 수신: %@", userInfo);
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

// PushNotificationIOS 필수 메서드
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  NSLog(@"로컬 알림 수신: %@", notification.userInfo);
  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

// 딥링크 지원
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

@end 