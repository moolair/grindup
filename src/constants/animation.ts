/**
 * 애니메이션 상수
 * GrindUp 앱의 모든 애니메이션 관련 값을 정의합니다.
 */

import { Easing } from 'react-native';

export const ANIMATION = {
    // 지속 시간(ms)
    DURATION: {
        VERY_FAST: 150,
        FAST: 250,
        NORMAL: 350,
        SLOW: 500,
        VERY_SLOW: 700,
    },

    // 애니메이션 타이밍 함수
    EASING: {
        // 기본 이징
        LINEAR: Easing.linear,
        EASE_IN: Easing.in(Easing.ease),
        EASE_OUT: Easing.out(Easing.ease),
        EASE_IN_OUT: Easing.inOut(Easing.ease),

        // 특수 이징
        BOUNCE: Easing.bounce,
        ELASTIC: Easing.elastic(1),
        BACK: Easing.back(1.5),

        // 커스텀 이징
        DECELERATE: Easing.out(Easing.poly(4)),
        ACCELERATE: Easing.in(Easing.poly(4)),
    },

    // 애니메이션 프리셋
    PRESET: {
        // 페이드
        FADE_IN: {
            opacity: {
                from: 0,
                to: 1,
            },
            duration: 250,
            easing: Easing.out(Easing.ease),
        },
        FADE_OUT: {
            opacity: {
                from: 1,
                to: 0,
            },
            duration: 200,
            easing: Easing.in(Easing.ease),
        },

        // 슬라이드
        SLIDE_UP: {
            translateY: {
                from: 100,
                to: 0,
            },
            duration: 300,
            easing: Easing.out(Easing.back(1.5)),
        },
        SLIDE_DOWN: {
            translateY: {
                from: 0,
                to: 100,
            },
            duration: 250,
            easing: Easing.in(Easing.ease),
        },

        // 스케일
        SCALE_IN: {
            scale: {
                from: 0.8,
                to: 1,
            },
            duration: 300,
            easing: Easing.out(Easing.back(1.2)),
        },
        SCALE_OUT: {
            scale: {
                from: 1,
                to: 0.8,
            },
            duration: 250,
            easing: Easing.in(Easing.ease),
        },
    },

    // 애니메이션 딜레이(ms)
    DELAY: {
        NONE: 0,
        SHORT: 50,
        MEDIUM: 100,
        LONG: 200,
    },

    // 애니메이션 스태거 간격(ms)
    STAGGER: {
        TIGHT: 25,
        NORMAL: 50,
        LOOSE: 100,
    },
};

export default ANIMATION; 