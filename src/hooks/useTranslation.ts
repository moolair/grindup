import { useCallback } from 'react';
import { useTranslation as useReactI18nextTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from '../i18n';

export type TranslationResult = {
    t: (key: string, options?: any) => string;
    i18n: any;
    setLanguage: (language: string) => Promise<string>;
    currentLanguage: string;
    currentLanguageName: string;
    currentLanguageNativeName: string;
    supportedLanguages: Record<string, SupportedLanguage>;
};

/**
 * i18n 번역을 위한 커스텀 훅
 * @param {string} namespace 사용할 네임스페이스 (기본값: 'common')
 * @returns {Object} 번역 관련 함수와 상태를 담은 객체
 */
export const useTranslation = (namespace = 'common'): TranslationResult => {
    const { t, i18n } = useReactI18nextTranslation(namespace);

    /**
     * 언어 변경 함수
     * @param {string} language 변경할 언어 코드
     * @returns {Promise<string>} 변경된 언어 코드
     */
    const setLanguage = useCallback(async (language: string): Promise<string> => {
        return await changeLanguage(language);
    }, []);

    /**
     * 현재 언어 코드
     */
    const currentLanguage = getCurrentLanguage();

    /**
     * 현재 언어의 이름 (영문)
     */
    const currentLanguageName = SUPPORTED_LANGUAGES[currentLanguage as keyof typeof SUPPORTED_LANGUAGES]?.name || '';

    /**
     * 현재 언어의 원어 이름
     */
    const currentLanguageNativeName = SUPPORTED_LANGUAGES[currentLanguage as keyof typeof SUPPORTED_LANGUAGES]?.nativeName || '';

    /**
     * 지원되는 언어 목록
     */
    const supportedLanguages = SUPPORTED_LANGUAGES;

    return {
        t,
        i18n,
        setLanguage,
        currentLanguage,
        currentLanguageName,
        currentLanguageNativeName,
        supportedLanguages,
    };
};

export default useTranslation; 