/**
 * 색상 상수
 * GrindUp 앱의 모든 색상을 정의합니다.
 */

export const COLORS = {
    // 주요 색상 팔레트
    PRIMARY: {
        900: '#0A236B',
        800: '#1A3A98',
        700: '#2952D9',
        600: '#3366FF', // 기본
        500: '#5C85FF',
        400: '#85A3FF',
        300: '#ADC2FF',
        200: '#D6E0FF',
        100: '#EBF0FF',
    },

    // 보조 색상 팔레트
    SECONDARY: {
        900: '#2E2566',
        800: '#3F3487',
        700: '#5445BE',
        600: '#6C5CE7', // 기본
        500: '#877BEB',
        400: '#A39BF0',
        300: '#BEBAF4',
        200: '#DCDAF9',
        100: '#EEEDFC',
    },

    // 강조 색상 팔레트
    ACCENT: {
        900: '#005644',
        800: '#00755D',
        700: '#00947A',
        600: '#00C9A7', // 기본
        500: '#1AD4B5',
        400: '#4DDFC7',
        300: '#7FE9D9',
        200: '#B2F2E8',
        100: '#E6FAF7',
    },

    // 상태 색상
    SUCCESS: {
        DARK: '#008F73',
        BASE: '#00B894',
        LIGHT: '#47D7B9',
        LIGHTEST: '#DFFAF3',
    },

    WARNING: {
        DARK: '#E7AA36',
        BASE: '#FDCB6E',
        LIGHT: '#FEDA95',
        LIGHTEST: '#FFF7E6',
    },

    ERROR: {
        DARK: '#D64545',
        BASE: '#FF6B6B',
        LIGHT: '#FF9C9C',
        LIGHTEST: '#FFEDED',
    },

    // 중립 색상
    NEUTRAL: {
        BLACK: '#2C3E50',
        DARK_GRAY: '#8395A7',
        MID_GRAY: '#D1D8E0',
        LIGHT_GRAY: '#F5F6FA',
        WHITE: '#FFFFFF',
    },

    // 기여도 그래프 색상
    CONTRIBUTION: {
        LEVEL_0: '#EBF0FF', // 활동 없음
        LEVEL_1: '#ADC2FF', // 활동 1-2
        LEVEL_2: '#5C85FF', // 활동 3-5
        LEVEL_3: '#2952D9', // 활동 6-9
        LEVEL_4: '#0A236B', // 활동 10+
    },

    // 투명도
    OPACITY: {
        LIGHT: 0.1,
        MEDIUM: 0.3,
        HIGH: 0.6,
        FULL: 1,
    },
};

export default COLORS; 