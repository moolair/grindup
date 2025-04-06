import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// @react-native-firebase는 네이티브 레벨에서 자동으로 초기화됩니다
// GoogleService-Info.plist와 google-services.json 파일을 사용합니다

// 파이어베이스 서비스 내보내기
export { auth, firestore, storage };

// firebase app 인스턴스 (이미 초기화됨)
export const app = firebase;

export default { firebase, auth, firestore, storage }; 