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
        console.error('시스템 언어 감지 실패:', error);
    }

    return DEFAULT_LANGUAGE;
};

// 기본 i18next 설정
i18next
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v4',
        lng: getSystemLanguage(),
        fallbackLng: DEFAULT_LANGUAGE,
        defaultNS: 'auth', // 기본 네임스페이스를 auth로 변경
        ns: NAMESPACES,
        resources,
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
        debug: false,
    });

// i18n 초기화/재초기화 함수
export const initI18n = async (language?: SupportedLanguageCode | null): Promise<typeof i18next> => {
    try {
        const lng = language || getSystemLanguage();

        if (i18next.isInitialized) {
            await i18next.changeLanguage(lng);
            console.log('언어 변경 완료:', lng);
        } else {
            await i18next
                .use(initReactI18next)
                .init({
                    compatibilityJSON: 'v4',
                    lng,
                    fallbackLng: DEFAULT_LANGUAGE,
                    defaultNS: 'auth',
                    ns: NAMESPACES,
                    resources,
                    interpolation: {
                        escapeValue: false,
                    },
                    react: {
                        useSuspense: false,
                    },
                    debug: false,
                });
            console.log('i18n 새로 초기화됨');
        }

        // 초기화 상태 로깅
        console.log('현재 i18n 상태:', {
            초기화됨: i18next.isInitialized,
            현재언어: i18next.language,
            네임스페이스: i18next.options.ns,
            기본네임스페이스: i18next.options.defaultNS,
        });

        return i18next;
    } catch (error) {
        console.error('i18n 초기화 오류:', error);
        throw error;
    }
};

// 언어 변경 함수
export const changeLanguage = async (language: string): Promise<string> => {
    if (!(language in SUPPORTED_LANGUAGES)) {
        console.warn(`지원하지 않는 언어입니다: ${language}. 대신 ${DEFAULT_LANGUAGE}을(를) 사용합니다.`);
        language = DEFAULT_LANGUAGE;
    }

    try {
        await i18next.changeLanguage(language);
        console.log('언어 변경됨:', language);
        return language;
    } catch (error) {
        console.error('언어 변경 실패:', error);
        throw error;
    }
};

// 현재 언어 가져오기
export const getCurrentLanguage = (): string => {
    return i18next.language || DEFAULT_LANGUAGE;
};

// 테스트용 번역 함수
export const testTranslation = (key: string, namespace?: string): string => {
    const result = i18next.t(key, { ns: namespace });
    console.log(`번역 테스트 - 키: ${key}, 결과: ${result}`);
    return result;
};

export default i18next; 