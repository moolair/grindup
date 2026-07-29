import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button, TextInput, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { auth, firebase, getFirebaseApp, initializeFirebase } from '../../services/firebase';
import { useTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import appleAuth from '@invertase/react-native-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

type LoginScreenProps = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
    const { t, i18n } = useTranslation('auth');
    const navigation = useNavigation<LoginScreenProps>();
    const { theme } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [firebaseReady, setFirebaseReady] = useState(false);

    // 디버깅용 출력
    console.log('LoginScreen 마운트: i18n 상태', {
        현재언어: i18n.language,
        초기화됨: i18n.isInitialized,
        'auth번역로드됨': i18n.hasResourceBundle(i18n.language, 'auth')
    });

    // Firebase 초기화 상태 확인
    useEffect(() => {
        const checkFirebase = async () => {
            try {
                console.log('[LoginScreen] Firebase 상태 확인...');
                // Firebase 앱 상태 확인
                const isInitialized = firebase.apps.length > 0;
                if (!isInitialized) {
                    console.log('[LoginScreen] Firebase 초기화 필요');
                    try {
                        const app = await initializeFirebase();
                        console.log('[LoginScreen] Firebase 초기화 완료:', app?.name || '기본앱');
                        setFirebaseReady(true);
                    } catch (initError) {
                        console.error('[LoginScreen] Firebase 초기화 실패:', initError);
                        setError('Firebase 초기화에 실패했습니다. 앱을 다시 시작해보세요.');
                    }
                } else {
                    console.log('[LoginScreen] Firebase 이미 초기화됨');
                    setFirebaseReady(true);
                }
            } catch (e) {
                console.error('[LoginScreen] Firebase 상태 확인 중 오류:', e);
            }
        };

        checkFirebase();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            setError(t('login.fieldsRequired'));
            return;
        }

        // Firebase Auth 초기화 확인
        if (!auth) {
            setError(t('login.error.generic'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            await auth().signInWithEmailAndPassword(email, password);
            // 로그인 성공 시 메인 화면으로 이동
            navigation.navigate('Main', {});
        } catch (err: any) {
            // 오류 처리
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError(t('login.invalidCredentials'));
            } else if (err.code === 'auth/invalid-email') {
                setError(t('login.invalidEmail'));
            } else {
                setError(t('login.loginFailed'));
                console.error('로그인 오류:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    // 구글 로그인
    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');

        try {
            // 구글 로그인 흐름 시작
            console.log('Google Play 서비스 확인 중...');
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            console.log('Google Play 서비스 확인 완료');

            // Google 설정 다시 확인
            GoogleSignin.configure({
                webClientId: '778305964277-22c05kls22cglh9auqtodgoqmioj158r.apps.googleusercontent.com',
                offlineAccess: true,
                iosClientId: '778305964277-ss7nlo6l44npv8j5emu3jbucl2osjuvh.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
                forceCodeForRefreshToken: true, // iOS에서 auth code를 강제로 받아오게 함
            });

            try {
                // 이미 로그인 되어 있는지 확인 (try/catch로 감싸서 isSignedIn 함수 에러 방지)
                try {
                    const isSignedIn = await GoogleSignin.isSignedIn();
                    console.log('이미 Google에 로그인되어 있음:', isSignedIn);
                    if (isSignedIn) {
                        await GoogleSignin.signOut();
                        console.log('기존 Google 세션 로그아웃 완료');
                    }
                } catch (signInCheckError) {
                    console.log('로그인 상태 확인 오류, 무시하고 계속:', signInCheckError);
                }

                // 구글 로그인 진행
                console.log('Google 로그인 시작...');
                const response = await GoogleSignin.signIn();
                console.log('Google 로그인 완료, 응답 type:', response.type);

                // ID 토큰 가져오기 (v13 API: response.data.idToken)
                let idToken = null;

                if (response.type === 'success' && response.data?.idToken) {
                    idToken = response.data.idToken;
                    console.log('idToken 획득 성공! (v13 API)');
                } else if ((response as any).idToken) {
                    // v12 이하 호환성
                    idToken = (response as any).idToken;
                    console.log('idToken 획득 성공! (legacy API)');
                } else {
                    console.error('Google 로그인 성공했으나 idToken이 없음, response:', JSON.stringify(response));

                    // 토큰 재획득 시도
                    try {
                        console.log('getTokens()로 토큰 재획득 시도');
                        const tokens = await GoogleSignin.getTokens();
                        if (tokens && tokens.idToken) {
                            idToken = tokens.idToken;
                            console.log('getTokens()로 idToken 획득 성공!');
                        }
                    } catch (tokenError) {
                        console.error('토큰 획득 시도 오류:', tokenError);
                    }
                }

                if (!idToken) {
                    throw new Error('Google Sign-In failed - no ID token returned');
                }

                console.log('Firebase 인증 진행 중...');
                // 구글 자격증명 생성
                const googleCredential = auth.GoogleAuthProvider.credential(idToken);

                // Firebase 인증
                const userCredential = await auth().signInWithCredential(googleCredential);
                console.log('Firebase 인증 성공!', userCredential.user?.uid || '사용자 ID 없음');

                // 메인 화면으로 이동
                navigation.navigate('Main', {});
            } catch (signInError) {
                console.error('Google SignIn 오류:', signInError);
                throw signInError;
            }
        } catch (err) {
            console.error('구글 로그인 오류:', err);

            // 오류 정보 상세 출력
            if (err.code) console.error('오류 코드:', err.code);
            if (err.message) console.error('오류 메시지:', err.message);
            if (err.stack) console.error('스택 추적:', err.stack);

            // 구체적인 오류 메시지 표시
            if (err.code === 'SIGN_IN_CANCELLED') {
                setError('로그인이 취소되었습니다.');
            } else if (err.code === 'SIGN_IN_REQUIRED') {
                setError('Google 계정에 로그인되어 있지 않습니다.');
            } else if (err.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
                setError('Google Play 서비스를 사용할 수 없습니다.');
            } else if (err.message && err.message.includes('no ID token')) {
                setError('Google 인증에 실패했습니다. ID 토큰을 받지 못했습니다.');
            } else {
                setError('구글 로그인 중 오류가 발생했습니다: ' + (err.message || JSON.stringify(err)));
            }
        } finally {
            setLoading(false);
        }
    };

    // 애플 로그인
    const handleAppleSignIn = async () => {
        setLoading(true);
        setError('');

        try {
            // iOS 플랫폼 확인
            if (Platform.OS !== 'ios') {
                setError('애플 로그인은 iOS 기기에서만 지원됩니다.');
                setLoading(false);
                return;
            }

            // 애플 로그인이 지원되는지 확인
            if (!appleAuth.isSupported) {
                setError(t('login.error.appleNotSupported') || '애플 로그인이 지원되지 않는 기기입니다');
                setLoading(false);
                return;
            }

            // 애플 로그인 요청
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });

            // 자격 증명 확인
            if (!appleAuthRequestResponse.identityToken) {
                throw new Error('Apple Sign-In failed - no identity token returned');
            }

            // Firebase 자격 증명 생성
            const { identityToken, nonce } = appleAuthRequestResponse;
            const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

            // Firebase 인증
            await auth().signInWithCredential(appleCredential);

            // 메인 화면으로 이동
            navigation.navigate('Main', {});
        } catch (err: any) {
            console.error('애플 로그인 오류:', err);
            setError(t('login.error.generic') || '로그인 중 오류가 발생했습니다');
        } finally {
            setLoading(false);
        }
    };

    // 임시 개발용 로그인 (구글 로그인 우회)
    const handleDevLogin = async () => {
        setLoading(true);
        setError('');

        try {
            console.log('[LoginScreen] 개발자 모드로 로그인 시도...');

            // Firebase 초기화 상태 확인
            if (!firebaseReady) {
                console.log('[LoginScreen] Firebase가 아직 준비되지 않음, 초기화 시도...');
                try {
                    await initializeFirebase();
                    console.log('[LoginScreen] Firebase 초기화 완료');
                } catch (firebaseError) {
                    console.error('[LoginScreen] Firebase 초기화 실패:', firebaseError);
                    throw new Error('Firebase 서비스를 초기화할 수 없습니다.');
                }
            }

            // Firebase Auth 상태 확인
            if (!auth) {
                throw new Error('Firebase Auth 서비스를 사용할 수 없습니다.');
            }

            // Firebase 익명 로그인 시도
            console.log('[LoginScreen] 익명 로그인 시도 중...');
            const userCredential = await auth().signInAnonymously();
            console.log('[LoginScreen] 익명 로그인 성공!', userCredential.user ? '사용자 정보 있음' : '사용자 정보 없음');

            // 메인 화면으로 이동
            navigation.navigate('Main', {});
        } catch (err: any) {
            console.error('[LoginScreen] 개발자 모드 로그인 오류:', err);

            // 자세한 오류 메시지 표시
            let errorMessage = '개발자 모드 로그인 실패';

            if (err.message && err.message.includes('No Firebase App')) {
                errorMessage = 'Firebase가 초기화되지 않았습니다. 앱을 재시작해보세요.';
            } else if (err.message) {
                errorMessage = `개발자 모드 오류: ${err.message}`;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
        >
            <View style={styles.logoContainer}>
                <Text style={[styles.appName, { color: theme.colors.content.primary }]}>GrindUp</Text>
                <Text style={[styles.tagline, { color: theme.colors.content.secondary }]}>
                    {t('login.tagline', { ns: 'auth' })}
                </Text>
            </View>

            <View style={styles.formContainer}>
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : null}

                <TextInput
                    label={t('login.email', { ns: 'auth' })}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                    mode="outlined"
                />

                <TextInput
                    label={t('login.password', { ns: 'auth' })}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    mode="outlined"
                />

                <Button
                    mode="contained"
                    onPress={handleLogin}
                    loading={loading}
                    style={styles.loginButton}
                    contentStyle={styles.buttonContent}
                >
                    {t('login.signIn', { ns: 'auth' })}
                </Button>

                <View style={styles.dividerContainer}>
                    <Divider style={styles.divider} />
                    <Text style={[styles.orText, { color: theme.colors.content.secondary }]}>
                        {t('login.or', { ns: 'auth' }) || '또는'}
                    </Text>
                    <Divider style={styles.divider} />
                </View>

                <Button
                    mode="outlined"
                    onPress={handleGoogleSignIn}
                    style={styles.socialButton}
                    contentStyle={styles.buttonContent}
                    icon="google"
                >
                    Google로 로그인
                </Button>

                <Button
                    mode="outlined"
                    onPress={handleAppleSignIn}
                    style={styles.socialButton}
                    contentStyle={styles.buttonContent}
                    icon="apple"
                >
                    Apple로 로그인
                </Button>

                {/* 개발용 임시 로그인 버튼 */}
                <Button
                    mode="outlined"
                    onPress={handleDevLogin}
                    style={styles.socialButton}
                    contentStyle={styles.buttonContent}
                >
                    개발자 모드 로그인 (시뮬레이터용)
                </Button>

                <View style={styles.forgotContainer}>
                    <TouchableOpacity>
                        <Text style={[styles.forgotText, { color: theme.colors.ui.primary }]}>
                            {t('login.forgotPassword', { ns: 'auth' })}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.signupContainer}>
                    <Text style={{ color: theme.colors.content.secondary }}>
                        {t('login.noAccount', { ns: 'auth' })}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={[styles.signupText, { color: theme.colors.ui.primary }]}>
                            {' '}{t('login.signUp', { ns: 'auth' })}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    input: {
        marginBottom: 16,
    },
    loginButton: {
        marginTop: 16,
        borderRadius: 8,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center',
    },
    forgotContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    forgotText: {
        fontWeight: '500',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    signupText: {
        fontWeight: '500',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    orText: {
        marginHorizontal: 8,
    },
    socialButton: {
        marginVertical: 8,
        borderRadius: 8,
    },
    devButton: {
        marginTop: 24,
        borderWidth: 2,
        borderStyle: 'dashed',
    },
});

export default LoginScreen; 