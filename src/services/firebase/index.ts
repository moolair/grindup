// Firebase v22 모듈러 API 사용
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Firebase 설정 정보
const firebaseConfig = {
    appId: '1:778305964277:ios:d2da049d19348eb2179dbc',
    projectId: 'grindup-3e8e0',
    apiKey: 'AIzaSyAAWPkn_O0QuHPH-ndbikXBoTKujLZN6-c',
    storageBucket: 'grindup-3e8e0.firebasestorage.app',
    messagingSenderId: '778305964277',
    databaseURL: 'https://grindup-3e8e0.firebaseio.com',
};

// Firebase 앱 초기화 함수
let isFirebaseInitialized = false;

const initializeFirebase = () => {
    // 이미 초기화된 상태인지 확인
    if (isFirebaseInitialized) {
        console.log('[Firebase] 이미 초기화되어 있습니다.');
        return firebase.app();
    }

    try {
        // 앱이 이미 초기화되었는지 확인
        if (firebase.apps.length > 0) {
            console.log('[Firebase] 기존 앱 인스턴스 사용');
            isFirebaseInitialized = true;
            return firebase.app();
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
            return firebase.app();
        }

        console.error('[Firebase] 초기화 오류:', error);
        throw error;
    }
};

// Firebase 상태 확인 함수
const getFirebaseApp = () => {
    if (firebase.apps.length > 0) {
        isFirebaseInitialized = true;
        return firebase.app();
    }

    return initializeFirebase();
};

// 모듈 로드 시 즉시 초기화 시도
try {
    getFirebaseApp();
} catch (error) {
    console.error('[Firebase] 초기 로드 시 초기화 실패:', error);
}

// 서비스 내보내기
export {
    auth,
    firestore,
    storage,
    firebase,
    getFirebaseApp,
    initializeFirebase
}; 