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
        // Firebase 초기화
        FirebaseApp.configure()

        // 앱 기본 초기화
        self.moduleName = "GrindUp"
        self.dependencyProvider = RCTAppDependencyProvider()
        self.initialProps = [:]

        // 기본 리액트 초기화 코드 호출
        let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)

        return result
    }

    override func bundleURL() -> URL? {
        #if DEBUG
        return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
        return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
}
