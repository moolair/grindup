import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, firebase, initializeFirebase, getFirebaseApp } from '../services/firebase';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { migrateRoutinesOnLogin } from '../services/routineService';

type AuthContextType = {
    user: FirebaseAuthTypes.User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    firebaseInitialized: boolean;
    updateDisplayName: (newName: string) => Promise<void>;
};

// 기본값 설정
const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
    firebaseInitialized: false,
    updateDisplayName: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [loading, setLoading] = useState(true);
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);
    const [prevUserState, setPrevUserState] = useState<string | null>(null);

    // Firebase 초기화 확인 및 필요시 초기화
    useEffect(() => {
        const initFirebase = async () => {
            try {
                console.log('[AuthContext] Firebase 초기화 체크 중...');
                if (firebase.apps.length === 0) {
                    console.log('[AuthContext] Firebase 초기화 시도 중...');
                    try {
                        const app = await initializeFirebase();
                        console.log('[AuthContext] Firebase 초기화 성공:', app?.name || '기본앱');
                        setFirebaseInitialized(true);
                    } catch (error) {
                        console.error('[AuthContext] Firebase 초기화 실패:', error);
                        setLoading(false);
                        return;
                    }
                } else {
                    console.log('[AuthContext] Firebase 이미 초기화됨');
                    setFirebaseInitialized(true);
                }

                // Firebase Auth 서비스 확인
                if (!auth) {
                    console.error('[AuthContext] Firebase Auth 서비스를 사용할 수 없습니다.');
                    setLoading(false);
                    return;
                }

                // 인증 상태 변경 감지 리스너 설정
                console.log('[AuthContext] 인증 상태 리스너 설정 중...');
                const unsubscribe = auth().onAuthStateChanged((currentUser) => {
                    console.log('[AuthContext] 인증 상태 변경:', currentUser ? '로그인됨' : '로그아웃됨');

                    // 이전 상태와 현재 상태를 비교하여 로그인 이벤트 감지
                    const currentUserState = currentUser ? currentUser.uid : null;
                    const wasLoggedOut = prevUserState === null;
                    const justLoggedIn = currentUserState !== null && wasLoggedOut;

                    // 로그인 시 데이터 마이그레이션 처리
                    if (justLoggedIn && currentUser) {
                        console.log('[AuthContext] 로그인 이벤트 감지, 데이터 마이그레이션 시작...');
                        // 데이터 마이그레이션은 비동기로 실행하고 UI 업데이트는 기다리지 않음
                        migrateRoutinesOnLogin().catch(err => {
                            console.error('[AuthContext] 데이터 마이그레이션 실패:', err);
                        });
                    }

                    // 상태 업데이트
                    setUser(currentUser);
                    setPrevUserState(currentUserState);
                    setLoading(false);
                });

                return () => {
                    console.log('[AuthContext] 인증 상태 리스너 정리');
                    unsubscribe();
                };
            } catch (error) {
                console.error('[AuthContext] Firebase 설정 중 오류:', error);
                setLoading(false);
            }
        };

        initFirebase();
    }, [prevUserState]);

    // 로그아웃 기능
    const signOut = async () => {
        if (!auth) {
            console.error('[AuthContext] Firebase Auth 서비스를 사용할 수 없습니다.');
            return;
        }

        try {
            console.log('[AuthContext] 로그아웃 시도...');
            await auth().signOut();
            console.log('[AuthContext] 로그아웃 성공');
        } catch (error) {
            console.error('[AuthContext] 로그아웃 실패:', error);
        }
    };

    // 사용자 이름 업데이트
    const updateDisplayName = async (newName: string) => {
        if (!auth || !user) {
            console.error('[AuthContext] 사용자가 로그인되어 있지 않거나 Firebase Auth 서비스를 사용할 수 없습니다.');
            return;
        }

        try {
            console.log('[AuthContext] 사용자 이름 업데이트 시도...');
            await user.updateProfile({
                displayName: newName
            });

            // 현재 유저 객체를 업데이트하여 UI에 즉시 반영
            setUser({ ...user, displayName: newName });

            console.log('[AuthContext] 사용자 이름 업데이트 성공:', newName);
        } catch (error) {
            console.error('[AuthContext] 사용자 이름 업데이트 실패:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signOut,
                firebaseInitialized,
                updateDisplayName,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// 커스텀 훅으로 컨텍스트 사용을 간편하게 함
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 