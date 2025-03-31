/**
 * 그림자 상수
 * GrindUp 앱의 모든 그림자 스타일을 정의합니다.
 */

import { Platform } from 'react-native';
import { COLORS } from './colors';

// iOS 그림자
const iosShadows = {
    NONE: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    SMALL: {
        shadowColor: COLORS.NEUTRAL.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    MEDIUM: {
        shadowColor: COLORS.NEUTRAL.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    LARGE: {
        shadowColor: COLORS.NEUTRAL.BLACK,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
};

// Android 그림자 (elevation)
const androidShadows = {
    NONE: {
        elevation: 0,
    },
    SMALL: {
        elevation: 3,
    },
    MEDIUM: {
        elevation: 6,
    },
    LARGE: {
        elevation: 12,
    },
};

// 플랫폼별 그림자 스타일 결합
export const SHADOWS = Platform.select({
    ios: {
        ...iosShadows,
        // 컴포넌트별 그림자
        COMPONENT: {
            CARD: iosShadows.SMALL,
            MODAL: iosShadows.MEDIUM,
            HEADER: iosShadows.SMALL,
            BUTTON: iosShadows.SMALL,
            FAB: iosShadows.MEDIUM,
            BOTTOM_SHEET: iosShadows.MEDIUM,
            DROPDOWN: iosShadows.MEDIUM,
        },
    },
    android: {
        ...androidShadows,
        // 컴포넌트별 그림자
        COMPONENT: {
            CARD: androidShadows.SMALL,
            MODAL: androidShadows.MEDIUM,
            HEADER: androidShadows.SMALL,
            BUTTON: androidShadows.SMALL,
            FAB: androidShadows.MEDIUM,
            BOTTOM_SHEET: androidShadows.MEDIUM,
            DROPDOWN: androidShadows.MEDIUM,
        },
    },
    default: {
        ...iosShadows,
        COMPONENT: {
            CARD: iosShadows.SMALL,
            MODAL: iosShadows.MEDIUM,
            HEADER: iosShadows.SMALL,
            BUTTON: iosShadows.SMALL,
            FAB: iosShadows.MEDIUM,
            BOTTOM_SHEET: iosShadows.MEDIUM,
            DROPDOWN: iosShadows.MEDIUM,
        },
    },
});

export default SHADOWS; 