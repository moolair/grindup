import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTranslation from '../../hooks/useTranslation';
import { useTheme } from '../../theme/ThemeProvider';
import { SupportedLanguage } from '../../i18n';

const LanguageSettingsScreen = () => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { t, currentLanguage, setLanguage, supportedLanguages, i18n } = useTranslation('settings');
    const { theme } = useTheme();
    const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

    // 언어 변경 처리
    const handleLanguageChange = useCallback(async (langCode: string) => {
        try {
            setSelectedLanguage(langCode); // 선택된 언어 상태 업데이트 (UI 즉시 업데이트)
            await setLanguage(langCode);
        } catch (error) {
            console.error('언어 변경 중 오류 발생:', error);
            setSelectedLanguage(currentLanguage); // 오류 발생 시 원래 언어로 복원
        }
    }, [setLanguage, currentLanguage]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
            <View style={[styles.header, { borderBottomColor: theme.colors.border.light }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={theme.colors.content.primary} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.colors.content.primary }]}>{t('appearance.language.title')}</Text>
            </View>

            <ScrollView>
                <View style={styles.section}>
                    {Object.entries(supportedLanguages).map(([langCode, langInfo]) => (
                        <TouchableOpacity
                            key={langCode}
                            style={[styles.languageItem, { borderBottomColor: theme.colors.border.light }]}
                            onPress={() => handleLanguageChange(langCode)}
                        >
                            <View style={styles.languageInfo}>
                                <Text style={[styles.languageName, { color: theme.colors.content.primary }]}>{langInfo.nativeName}</Text>
                                <Text style={[styles.languageNameInEnglish, { color: theme.colors.content.secondary }]}>{langInfo.name}</Text>
                            </View>

                            {selectedLanguage === langCode && (
                                <Icon name="check" size={24} color={theme.colors.ui.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={[styles.infoSection, { backgroundColor: theme.colors.surface.primary }]}>
                    <Text style={[styles.infoText, { color: theme.colors.content.secondary }]}>
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