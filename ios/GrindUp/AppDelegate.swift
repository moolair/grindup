// Firebase를 나중에 로딩하도록 변경
import FirebaseCore
import React
import ReactAppDependencyProvider
import React_RCTAppDelegate
import UIKit

@main
class AppDelegate: RCTAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // 앱 기본 초기화
    self.moduleName = "GrindUp"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]

    // 기본 리액트 초기화 코드 호출
    let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)

    // Firebase 초기화 - 별도 함수로 분리
    setupFirebase()

    return result
  }

  // Firebase 초기화를 별도 함수로 분리
  private func setupFirebase() {
    // 이미 초기화되었는지 확인
    if FirebaseApp.app() != nil {
      print("Firebase 이미 초기화되어 있음")
      return
    }

    // Bundle 경로에서 GoogleService-Info.plist 파일 확인
    guard let filePath = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist") else {
      print("오류: GoogleService-Info.plist 파일을 찾을 수 없음")
      return
    }

    print("GoogleService-Info.plist 파일 위치: \(filePath)")

    // 메인 쓰레드에서 Firebase 초기화
    DispatchQueue.main.async {
      do {
        // 명시적으로 초기화 옵션 설정
        if let options = FirebaseOptions(contentsOfFile: filePath) {
          FirebaseApp.configure(options: options)
          print("Firebase 초기화 성공 (명시적 옵션 사용)")
        } else {
          // 기본 방식으로 시도
          FirebaseApp.configure()
          print("Firebase 초기화 성공 (기본 방식)")
        }
      } catch {
        print("Firebase 초기화 오류: \(error.localizedDescription)")
      }
    }
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
      RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
      Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
