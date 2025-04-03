import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// 파이어베이스 설정
// 실제 프로젝트에서는 환경 변수를 사용하는 것이 좋습니다
const firebaseConfig = {
    apiKey: "AIzaSyDQZ5KGrjD3BxDKEb7ZGQo7xqMbqbV_qtg",
    authDomain: "grindup-3e8e0.firebaseapp.com",
    projectId: "grindup-3e8e0",
    storageBucket: "grindup-3e8e0.firebasestorage.app",
    messagingSenderId: "778305964277",
    appId: "1:778305964277:web:3f4d6cc09132449f179dbc",
    measurementId: "G-649PTQJG3W"
};

// 파이어베이스 초기화
const app = initializeApp(firebaseConfig);

// 파이어베이스 서비스 내보내기
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app; 