/**
 * 타이포그래피 상수
 * GrindUp 앱의 모든 텍스트 스타일을 정의합니다.
 */

export const TYPOGRAPHY = {
    // 폰트 패밀리
    FONT_FAMILY: {
        PRIMARY: 'Pretendard',
        SECONDARY: 'Pretendard',
    },

    // 폰트 사이즈
    FONT_SIZE: {
        CAPTION: 12,
        FOOTNOTE: 13,
        SUBHEADLINE: 15,
        BODY: 17,
        TITLE3: 20,
        TITLE2: 22,
        TITLE1: 28,
        LARGE_TITLE: 34,
    },

    // 폰트 웨이트
    FONT_WEIGHT: {
        REGULAR: '400',
        MEDIUM: '500',
        SEMIBOLD: '600',
        BOLD: '700',
        HEAVY: '800',
    },

    // 라인 높이
    LINE_HEIGHT: {
        TIGHT: 1.2,
        NORMAL: 1.5,
        LOOSE: 1.8,
    },

    // 단락 스타일
    PARAGRAPH: {
        SPACING: 16,
    },

    // 텍스트 케이스
    TEXT_CASE: {
        UPPERCASE: 'uppercase',
        LOWERCASE: 'lowercase',
        CAPITALIZE: 'capitalize',
        NONE: 'none',
    },

    // 텍스트 데코레이션
    TEXT_DECORATION: {
        UNDERLINE: 'underline',
        STRIKETHROUGH: 'line-through',
        NONE: 'none',
    },

    // 레터 스페이싱
    LETTER_SPACING: {
        TIGHT: -0.5,
        NORMAL: 0,
        WIDE: 1,
        EXTRA_WIDE: 2,
    },
};

// 사전 정의된 텍스트 스타일
export const TEXT_STYLE = {
    LARGE_TITLE: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
        fontSize: TYPOGRAPHY.FONT_SIZE.LARGE_TITLE,
        fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
        lineHeight: TYPOGRAPHY.LINE_HEIGHT.TIGHT,
    },
    TITLE1: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
        fontSize: TYPOGRAPHY.FONT_SIZE.TITLE1,
        fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
        lineHeight: TYPOGRAPHY.LINE_HEIGHT.TIGHT,
    },
    TITLE2: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
        fontSize: TYPOGRAPHY.FONT_SIZE.TITLE2,
        fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
        lineHeight: TYPOGRAPHY.LINE_HEIGHT.TIGHT,
    },
    TITLE3: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
        fontSize: TYPOGRAPHY.FONT_SIZE.TITLE3,
        fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
        lineHeight: TYPOGRAPHY.LINE_HEIGHT.TIGHT,
    },
    BODY: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
        fontSize: TYPOGRAPHY.FONT_SIZE.BODY,
        fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
        lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
    },
    BODY_BOLD: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
        fontSize: TYPOGRAPHY.FONT_SIZE.BODY,
        fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
        lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
    },
    SUBHEADLINE: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
        fontSize: TYPOGRAPHY.FONT_SIZE.SUBHEADLINE,
        fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
        lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
    },
    FOOTNOTE: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
        fontSize: TYPOGRAPHY.FONT_SIZE.FOOTNOTE,
        fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
        lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
    },
    CAPTION: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
        fontSize: TYPOGRAPHY.FONT_SIZE.CAPTION,
        fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
        lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
    },
};

export default { TYPOGRAPHY, TEXT_STYLE }; 