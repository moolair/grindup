import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../services/firebase';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

type AuthContextType = {
    user: FirebaseAuthTypes.User | null;
    loading: boolean;
    signOut: () => Promise<void>;
};

// 기본값 설정
const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Firebase 초기화 체크
        if (!auth) {
            console.error('Firebase Auth 서비스를 사용할 수 없습니다.');
            setLoading(false);
            return;
        }

        // 인증 상태 변경 감지
        try {
            const unsubscribe = auth().onAuthStateChanged((currentUser: FirebaseAuthTypes.User | null) => {
                setUser(currentUser);
                setLoading(false);
            });

            // 클린업 함수
            return unsubscribe;
        } catch (error) {
            console.error('Auth 상태 모니터링 실패:', error);
            setLoading(false);
            return () => { };
        }
    }, []);

    // 로그아웃 기능
    const signOut = async () => {
        if (!auth) {
            console.error('Firebase Auth 서비스를 사용할 수 없습니다.');
            return;
        }

        try {
            await auth().signOut();
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// 커스텀 훅으로 컨텍스트 사용을 간편하게 함
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 