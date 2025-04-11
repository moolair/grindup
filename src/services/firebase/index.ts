// Firebase v22 모듈러 API 사용
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

/**
 * Firebase 설정 정보
 * 앱 초기화에 사용되는 설정 객체입니다.
 */
const firebaseConfig = {
    appId: '1:778305964277:ios:d2da049d19348eb2179dbc',
    projectId: 'grindup-3e8e0',
    apiKey: 'AIzaSyAAWPkn_O0QuHPH-ndbikXBoTKujLZN6-c',
    storageBucket: 'grindup-3e8e0.firebasestorage.app',
    messagingSenderId: '778305964277',
    databaseURL: 'https://grindup-3e8e0.firebaseio.com',
};

/**
 * Firebase app 인스턴스 가져오기 (모듈러 API 방식으로 가져오기)
 * 이미 초기화된 앱 인스턴스가 있으면 반환하고, 없으면 null 반환
 */
const getFirebaseAppInstance = () => {
    // 앱이 이미 초기화되었으면 기존 앱 반환
    if (firebase.apps.length > 0) {
        return firebase.app();
    }
    return null;
};

// Firebase 앱 초기화 상태 추적
let isFirebaseInitialized = false;

/**
 * Firebase 앱 초기화 함수
 * 앱이 이미 초기화되었으면 기존 인스턴스를 반환하고, 그렇지 않으면 새로 초기화합니다.
 * 
 * Firebase v22에서는 앱 초기화 방식이 변경될 수 있으므로, 
 * 나중에 마이그레이션 시 이 부분을 확인해야 합니다.
 */
const initializeFirebase = () => {
    // 이미 초기화된 상태인지 확인
    if (isFirebaseInitialized) {
        console.log('[Firebase] 이미 초기화되어 있습니다.');
        return getFirebaseAppInstance();
    }

    try {
        // 앱이 이미 초기화되었는지 확인
        if (firebase.apps.length > 0) {
            console.log('[Firebase] 기존 앱 인스턴스 사용');
            isFirebaseInitialized = true;
            return getFirebaseAppInstance();
        }

        // 새로 초기화
        console.log('[Firebase] 새 앱 인스턴스 초기화 중...');
        const app = firebase.initializeApp(firebaseConfig);
        isFirebaseInitialized = true;
        console.log('[Firebase] 초기화 완료!');
        return app;
    } catch (error: any) {
        // 특정 오류 처리 - 이미 초기화된 앱이 있는 경우
        if (error.message && error.message.includes('already exists')) {
            console.log('[Firebase] 이미 초기화된 앱이 있습니다. 기존 앱을 사용합니다.');
            isFirebaseInitialized = true;
            return getFirebaseAppInstance();
        }

        console.error('[Firebase] 초기화 오류:', error);
        throw error;
    }
};

/**
 * Firebase 앱 인스턴스 가져오기
 * 앱이 초기화되어 있지 않으면 초기화한 후 반환합니다.
 */
const getFirebaseApp = () => {
    if (firebase.apps.length > 0) {
        isFirebaseInitialized = true;
        return getFirebaseAppInstance();
    }

    return initializeFirebase();
};

// 모듈 로드 시 즉시 Firebase 초기화 시도
try {
    getFirebaseApp();
} catch (error) {
    console.error('[Firebase] 초기 로드 시 초기화 실패:', error);
}

// Firebase 서비스 및 유틸리티 함수 내보내기
export {
    auth,
    firestore,
    storage,
    firebase,
    getFirebaseApp,
    initializeFirebase
}; 