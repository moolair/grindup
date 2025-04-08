import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button, TextInput, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { auth } from '../../services/firebase';
import { useTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import appleAuth from '@invertase/react-native-apple-authentication';

type SignupScreenProps = StackNavigationProp<RootStackParamList, 'Signup'>;

const SignupScreen = () => {
    const { t } = useTranslation('auth');
    const navigation = useNavigation<SignupScreenProps>();
    const { theme } = useTheme();

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 이메일/비밀번호 회원가입
    const handleSignup = async () => {
        if (!email || !password || !confirmPassword || !displayName) {
            setError(t('signup.error.fieldsRequired') || '모든 필드를 입력해주세요');
            return;
        }

        if (password !== confirmPassword) {
            setError(t('signup.error.passwordMismatch') || '비밀번호가 일치하지 않습니다');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 계정 생성
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);

            // 사용자 프로필 업데이트
            await userCredential.user.updateProfile({
                displayName: displayName,
            });

            // 메인 화면으로 이동
            navigation.navigate('Main', {});
        } catch (err: any) {
            // 오류 처리
            if (err.code === 'auth/email-already-in-use') {
                setError(t('signup.error.emailExists') || '이미 사용 중인 이메일입니다');
            } else if (err.code === 'auth/invalid-email') {
                setError(t('signup.error.invalidEmail') || '유효하지 않은 이메일 주소입니다');
            } else if (err.code === 'auth/weak-password') {
                setError(t('signup.error.passwordWeak') || '비밀번호가 너무 약합니다');
            } else {
                setError(t('signup.error.generic') || '회원가입 중 오류가 발생했습니다');
                console.error('회원가입 오류:', err);
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
            // React Native Firebase에서 Google로 로그인하려면 구체적인 구현이 필요합니다.
            // Google Developer Console에서 OAuth Client ID 생성 및 설정 필요
            // Android: google-services.json, iOS: GoogleService-Info.plist 필요
            // 자세한 설정과 구현이 완료되면 활성화하세요

            setError('앱에서 Google 로그인을 위한 설정이 필요합니다. Firebase 콘솔에서 설정을 완료해주세요.');

            /* 실제 구현 코드
            // 구글 로그인 설정 완료 후 아래 코드 활성화
            await auth().signInWithProvider(auth.GoogleAuthProvider.PROVIDER_ID);
            // 메인 화면으로 이동
            navigation.navigate('Main', {});
            */
        } catch (err: any) {
            console.error('구글 로그인 오류:', err);
            setError(t('signup.error.socialLoginFailed') || '소셜 로그인 중 오류가 발생했습니다');
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
                setError(t('signup.error.appleNotSupported') || '애플 로그인이 지원되지 않는 기기입니다');
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
            const userCredential = await auth().signInWithCredential(appleCredential);

            // 이름 정보가 있다면 프로필 업데이트
            if (appleAuthRequestResponse.fullName) {
                const displayName =
                    `${appleAuthRequestResponse.fullName.givenName || ''} ${appleAuthRequestResponse.fullName.familyName || ''}`.trim();

                if (displayName) {
                    await userCredential.user.updateProfile({ displayName });
                }
            }

            // 메인 화면으로 이동
            navigation.navigate('Main', {});
        } catch (err: any) {
            console.error('애플 로그인 오류:', err);
            setError(t('signup.error.socialLoginFailed') || '소셜 로그인 중 오류가 발생했습니다');
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
                    {t('signup.title', { ns: 'auth' }) || '계정 만들기'}
                </Text>
            </View>

            <View style={styles.formContainer}>
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : null}

                <TextInput
                    label={t('signup.namePlaceholder', { ns: 'auth' }) || '이름'}
                    value={displayName}
                    onChangeText={setDisplayName}
                    style={styles.input}
                    mode="outlined"
                />

                <TextInput
                    label={t('signup.emailPlaceholder', { ns: 'auth' }) || '이메일'}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                    mode="outlined"
                />

                <TextInput
                    label={t('signup.passwordPlaceholder', { ns: 'auth' }) || '비밀번호'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    mode="outlined"
                />

                <TextInput
                    label={t('signup.confirmPasswordPlaceholder', { ns: 'auth' }) || '비밀번호 확인'}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.input}
                    mode="outlined"
                />

                <Button
                    mode="contained"
                    onPress={handleSignup}
                    loading={loading}
                    style={styles.signupButton}
                    contentStyle={styles.buttonContent}
                >
                    {t('signup.button', { ns: 'auth' }) || '회원가입'}
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
                    Google로 시작하기
                </Button>

                <Button
                    mode="outlined"
                    onPress={handleAppleSignIn}
                    style={styles.socialButton}
                    contentStyle={styles.buttonContent}
                    icon="apple"
                >
                    Apple로 시작하기
                </Button>

                <View style={styles.loginContainer}>
                    <Text style={{ color: theme.colors.content.secondary }}>
                        {t('signup.hasAccount', { ns: 'auth' }) || '이미 계정이 있으신가요?'}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={[styles.loginText, { color: theme.colors.ui.primary }]}>
                            {' '}{t('signup.logIn', { ns: 'auth' }) || '로그인'}
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
    signupButton: {
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    loginText: {
        fontWeight: '500',
    },
});

export default SignupScreen; 