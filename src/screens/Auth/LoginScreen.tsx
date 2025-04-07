import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { auth } from '../../services/firebase';
import { useTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';

type LoginScreenProps = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
    const { t, i18n } = useTranslation('auth');
    const navigation = useNavigation<LoginScreenProps>();
    const { theme } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 디버깅용 출력
    console.log('LoginScreen 마운트: i18n 상태', {
        현재언어: i18n.language,
        초기화됨: i18n.isInitialized,
        'auth번역로드됨': i18n.hasResourceBundle(i18n.language, 'auth')
    });

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
                    <TouchableOpacity>
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
});

export default LoginScreen; 