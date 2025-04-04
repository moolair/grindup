import React, { useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTranslation from '../../../hooks/useTranslation';
import useTheme from '../../../hooks/useTheme';
import { SupportedLanguage } from '../../../i18n';

const LanguageSettingsScreen = () => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { t, currentLanguage, setLanguage, supportedLanguages } = useTranslation('settings');
    const { theme } = useTheme();

    // 언어 변경 처리
    const handleLanguageChange = useCallback(async (langCode: string) => {
        await setLanguage(langCode);
        // 화면을 새로고침하거나 다시 렌더링할 필요가 없습니다.
        // i18next가 자동으로 언어 변경을 감지하고 컴포넌트를 다시 렌더링합니다.
    }, [setLanguage]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>{t('appearance.language.title')}</Text>
            </View>

            <ScrollView>
                <View style={styles.section}>
                    {Object.entries(supportedLanguages).map(([langCode, langInfo]) => (
                        <TouchableOpacity
                            key={langCode}
                            style={[styles.languageItem, { borderBottomColor: theme.border }]}
                            onPress={() => handleLanguageChange(langCode)}
                        >
                            <View style={styles.languageInfo}>
                                <Text style={[styles.languageName, { color: theme.text }]}>{langInfo.nativeName}</Text>
                                <Text style={[styles.languageNameInEnglish, { color: theme.inactive }]}>{langInfo.name}</Text>
                            </View>

                            {currentLanguage === langCode && (
                                <Icon name="check" size={24} color={theme.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={[styles.infoSection, { backgroundColor: theme.card }]}>
                    <Text style={[styles.infoText, { color: theme.inactive }]}>
                        {t('appearance.language.system')}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    section: {
        padding: 16,
    },
    languageItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    languageInfo: {
        flexDirection: 'column',
    },
    languageName: {
        fontSize: 18,
        fontWeight: '500',
    },
    languageNameInEnglish: {
        fontSize: 14,
        marginTop: 4,
    },
    infoSection: {
        padding: 16,
    },
    infoText: {
        fontSize: 14,
        textAlign: 'center',
    },
});

export default LanguageSettingsScreen; 