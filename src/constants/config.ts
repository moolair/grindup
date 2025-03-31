/**
 * 앱 설정 상수
 * GrindUp 앱의 모든 설정 값과 환경 변수를 정의합니다.
 */

import { Platform } from 'react-native';

// 앱 버전 정보
export const APP_VERSION = {
    VERSION_NAME: '1.0.0',
    VERSION_CODE: 1,
    BUILD_NUMBER: '1',
};

// 환경 설정
export const ENVIRONMENT = {
    DEV: 'development',
    STAGING: 'staging',
    PROD: 'production',
};

// 현재 환경 (개발 환경으로 설정)
export const CURRENT_ENVIRONMENT = ENVIRONMENT.DEV;

// API 설정
export const API_CONFIG = {
    BASE_URL: {
        [ENVIRONMENT.DEV]: 'https://api-dev.grindup.com',
        [ENVIRONMENT.STAGING]: 'https://api-staging.grindup.com',
        [ENVIRONMENT.PROD]: 'https://api.grindup.com',
    },
    TIMEOUT: 30000, // 30초
    RETRY_COUNT: 3,
    CACHE_TIME: 5 * 60 * 1000, // 5분 (밀리초 단위)
};

// 현재 환경에 맞는 API BASE URL
export const API_BASE_URL = API_CONFIG.BASE_URL[CURRENT_ENVIRONMENT];

// 이미지 저장소 URL
export const ASSET_URL = {
    IMAGES: {
        [ENVIRONMENT.DEV]: 'https://assets-dev.grindup.com/images',
        [ENVIRONMENT.STAGING]: 'https://assets-staging.grindup.com/images',
        [ENVIRONMENT.PROD]: 'https://assets.grindup.com/images',
    },
    ICONS: {
        [ENVIRONMENT.DEV]: 'https://assets-dev.grindup.com/icons',
        [ENVIRONMENT.STAGING]: 'https://assets-staging.grindup.com/icons',
        [ENVIRONMENT.PROD]: 'https://assets.grindup.com/icons',
    },
};

// 현재 환경에 맞는 이미지 URL
export const IMAGES_URL = ASSET_URL.IMAGES[CURRENT_ENVIRONMENT];
export const ICONS_URL = ASSET_URL.ICONS[CURRENT_ENVIRONMENT];

// 앱 일반 설정
export const APP_CONFIG = {
    // 디바이스 플랫폼
    IS_IOS: Platform.OS === 'ios',
    IS_ANDROID: Platform.OS === 'android',

    // 캐시 설정
    MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
    CACHE_EXPIRY: 24 * 60 * 60 * 1000, // 24시간 (밀리초 단위)

    // 앱 기능 설정
    FEATURES: {
        SOCIAL_LOGIN: true,
        OFFLINE_MODE: true,
        ANALYTICS: true,
        PUSH_NOTIFICATIONS: true,
        IN_APP_PURCHASES: true,
        DEEP_LINKING: true,
    },

    // 앱 기본 설정
    DEFAULT_SETTINGS: {
        THEME: 'auto', // 'light', 'dark', 'auto'
        LANGUAGE: 'ko-KR',
        UNITS: {
            WEIGHT: 'kg', // 'kg', 'lb'
            HEIGHT: 'cm', // 'cm', 'ft'
            DISTANCE: 'km', // 'km', 'mi'
        },
        NOTIFICATIONS: {
            WORKOUT_REMINDER: true,
            ACHIEVEMENT: true,
            APP_UPDATES: true,
        },
    },

    // 애널리틱스 설정
    ANALYTICS: {
        ENABLED: true,
        TRACKING_ID: 'UA-XXXXXXXX-X',
    },

    // 오류 리포팅 설정
    ERROR_REPORTING: {
        ENABLED: true,
        SILENT_REPORT: true,
        INCLUDE_LOGS: true,
    },

    // 워크아웃 관련 기본 설정
    WORKOUT: {
        DEFAULT_REST_TIME: 60, // 초 단위
        AUTO_TIMER: true,
        WARMUP_REMINDERS: true,
    },
};

// 소셜 로그인 설정
export const SOCIAL_AUTH_CONFIG = {
    GOOGLE: {
        WEB_CLIENT_ID: 'your-google-web-client-id',
        IOS_CLIENT_ID: 'your-google-ios-client-id',
    },
    FACEBOOK: {
        APP_ID: 'your-facebook-app-id',
    },
    APPLE: {
        SERVICE_ID: 'your-apple-service-id',
    },
};

// 디바이스 및 화면 크기 관련 설정
export const DEVICE_CONFIG = {
    // 탭바 높이 및 상태바 높이는 실행 중 동적으로 결정됨
    DEFAULT_TAB_BAR_HEIGHT: APP_CONFIG.IS_IOS ? 49 : 56,
    DEFAULT_STATUS_BAR_HEIGHT: APP_CONFIG.IS_IOS ? 44 : 24,
    DEFAULT_HEADER_HEIGHT: 56,
    DEFAULT_BOTTOM_SHEET_HEIGHT: '50%',
};

export default {
    APP_VERSION,
    ENVIRONMENT,
    CURRENT_ENVIRONMENT,
    API_CONFIG,
    API_BASE_URL,
    ASSET_URL,
    IMAGES_URL,
    ICONS_URL,
    APP_CONFIG,
    SOCIAL_AUTH_CONFIG,
    DEVICE_CONFIG,
}; 