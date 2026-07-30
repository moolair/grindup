/**
 * 상수 모듈
 * GrindUp 앱에서 사용하는 모든 상수를 내보냅니다.
 */

import COLORS from './colors';
import { TYPOGRAPHY, TEXT_STYLE } from './typography';
import { SPACING, getResponsiveSpacing } from './spacing';
import RADIUS from './radius';
import SHADOWS from './shadows';
import ANIMATION from './animation';
import { ICON_NAME, ICON_SIZE, ICON_MAPPING } from './icons';
import CONFIG from './config';

// 모든 상수 타입 모듈 내보내기
export {
    // 색상
    COLORS,

    // 타이포그래피
    TYPOGRAPHY,
    TEXT_STYLE,

    // 간격
    SPACING,
    getResponsiveSpacing,

    // 반경
    RADIUS,

    // 그림자
    SHADOWS,

    // 애니메이션
    ANIMATION,

    // 아이콘
    ICON_NAME,
    ICON_SIZE,
    ICON_MAPPING,

    // 설정
    CONFIG,
};

// 기본 모듈로 모든 상수 내보내기
export default {
    COLORS,
    TYPOGRAPHY,
    TEXT_STYLE,
    SPACING,
    getResponsiveSpacing,
    RADIUS,
    SHADOWS,
    ANIMATION,
    ICON_NAME,
    ICON_SIZE,
    ICON_MAPPING,
    CONFIG,
}; 