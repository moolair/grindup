import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';

// 언어 리소스 직접 가져오기
import en_common from './locales/en/common.json';
import en_auth from './locales/en/auth.json';
import en_tasks from './locales/en/tasks.json';
import en_dashboard from './locales/en/dashboard.json';
import en_settings from './locales/en/settings.json';
import en_analytics from './locales/en/analytics.json';
import en_profile from './locales/en/profile.json';
import en_navigation from './locales/en/navigation.json';

import ko_common from './locales/ko/common.json';
import ko_auth from './locales/ko/auth.json';
import ko_tasks from './locales/ko/tasks.json';
import ko_dashboard from './locales/ko/dashboard.json';
import ko_settings from './locales/ko/settings.json';
import ko_analytics from './locales/ko/analytics.json';
import ko_profile from './locales/ko/profile.json';
import ko_navigation from './locales/ko/navigation.json';

// 일본어 리소스 가져오기 삭제됨

export type SupportedLanguage = {
    name: string;
    nativeName: string;
};

// 지원되는 언어 목록 (영어, 한국어만 지원)
export const SUPPORTED_LANGUAGES: Record<string, SupportedLanguage> = {
    en: {
        name: 'English',
        nativeName: 'English',
    },
    ko: {
        name: 'Korean',
        nativeName: '한국어',
    },
};

// 지원되는 언어 코드 타입
export type SupportedLanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// 사용 가능한 네임스페이스 목록
export const NAMESPACES = [
    'common',
    'auth',
    'tasks',
    'dashboard',
    'settings',
    'analytics',
    'profile',
    'navigation',
];

// 리소스 정의 (일본어 제거됨)
const resources = {
    en: {
        common: en_common,
        auth: en_auth,
        tasks: en_tasks,
        dashboard: en_dashboard,
        settings: en_settings,
        analytics: en_analytics,
        profile: en_profile,
        navigation: en_navigation,
    },
    ko: {
        common: ko_common,
        auth: ko_auth,
        tasks: ko_tasks,
        dashboard: ko_dashboard,
        settings: ko_settings,
        analytics: ko_analytics,
        profile: ko_profile,
        navigation: ko_navigation,
    },
};

// 기본 언어 설정
const DEFAULT_LANGUAGE: SupportedLanguageCode = 'en';

// 현재 시스템 언어 감지 (영어, 한국어만 지원)
const getSystemLanguage = (): SupportedLanguageCode => {
    try {
        const deviceLocales = getLocales();
        if (deviceLocales && deviceLocales.length > 0) {
            const languageCode = deviceLocales[0].languageCode;
            // 지원되는 언어인지 확인
            if (languageCode in SUPPORTED_LANGUAGES) {
                return languageCode as SupportedLanguageCode;
            }
        }
    } catch (error) {
        console.error('Failed to detect system language:', error);
    }

    return DEFAULT_LANGUAGE;
};

// i18next 초기화 함수
export const initI18n = async (language?: SupportedLanguageCode | null): Promise<typeof i18next> => {
    const lng = language || getSystemLanguage();

    await i18next
        .use(initReactI18next)
        .init({
            lng,
            fallbackLng: DEFAULT_LANGUAGE,
            defaultNS: 'common',
            ns: NAMESPACES,
            resources,
            interpolation: {
                escapeValue: false, // React에서는 이미 XSS 방지를 처리함
            },
            react: {
                useSuspense: false, // React.Suspense와 함께 사용하지 않음
                bindI18n: 'languageChanged loaded', // 언어 변경 시 자동 리렌더링
                bindI18nStore: 'added removed', // 리소스 추가/제거 시 자동 리렌더링
            },
        });

    return i18next;
};

// 언어 변경 함수
export const changeLanguage = async (language: string): Promise<string> => {
    if (!(language in SUPPORTED_LANGUAGES)) {
        console.warn(`Language ${language} is not supported. Using ${DEFAULT_LANGUAGE} instead.`);
        language = DEFAULT_LANGUAGE;
    }

    try {
        // 언어 변경
        await i18next.changeLanguage(language);

        // 강제로 언어 변경 이벤트 발생시키기 (추가)
        i18next.emit('languageChanged', language);

        return language;
    } catch (error) {
        console.error('Failed to change language:', error);
        throw error;
    }
};

// 현재 언어 가져오기
export const getCurrentLanguage = (): string => {
    return i18next.language || DEFAULT_LANGUAGE;
};

export default i18next; 