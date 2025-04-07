// Firebase v22 모듈러 API 사용
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Firebase 앱 상태 확인 및 로깅
try {
    const apps = firebase.apps;
    console.log(`Firebase 앱 상태: ${apps.length > 0 ? `${apps.length}개 초기화됨` : '초기화 필요'}`);

    if (apps.length > 0) {
        const app = firebase.app();
        console.log(`기본 앱 이름: ${app.name}`);
    }
} catch (error) {
    console.error('Firebase 상태 확인 오류:', error);
}

// 서비스 내보내기
export {
    auth,
    firestore,
    storage,
    firebase
}; 