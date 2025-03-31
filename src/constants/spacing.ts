/**
 * 간격 상수
 * GrindUp 앱의 모든 간격, 패딩, 마진 값을 정의합니다.
 */

export const SPACING = {
    // 기본 간격 단위 (픽셀)
    UNIT: 4,

    // 명명된 간격 
    TINY: 4,
    EXTRA_SMALL: 8,
    SMALL: 12,
    MEDIUM: 16,
    LARGE: 24,
    EXTRA_LARGE: 32,
    HUGE: 48,
    GIANT: 64,

    // 컴포넌트별 간격
    COMPONENT: {
        // 컨테이너 패딩
        CONTAINER: {
            HORIZONTAL: 16,
            VERTICAL: 16,
        },

        // 카드 패딩
        CARD: {
            HORIZONTAL: 16,
            VERTICAL: 16,
            BORDER_RADIUS: 12,
        },

        // 버튼 패딩
        BUTTON: {
            HORIZONTAL: 16,
            VERTICAL: 12,
            ICON_GAP: 8,
        },

        // 인풋 필드 패딩
        INPUT: {
            HORIZONTAL: 12,
            VERTICAL: 12,
        },

        // 리스트 관련 간격
        LIST: {
            ITEM_GAP: 12,
            SECTION_GAP: 24,
        },

        // 아이콘 크기
        ICON: {
            SMALL: 16,
            MEDIUM: 24,
            LARGE: 32,
        },

        // 그리드 시스템
        GRID: {
            GUTTER: 16,
            COLUMN: 8,
        },
    },

    // 레이아웃 간격
    LAYOUT: {
        // 화면 마진
        SCREEN_MARGIN: 16,

        // 섹션 간격
        SECTION_GAP: 32,

        // 헤더 관련
        HEADER_HEIGHT: 56,
        HEADER_PADDING: 16,

        // 탭바 관련
        TAB_BAR_HEIGHT: 56,

        // 모달 관련
        MODAL_PADDING: 24,
    },
};

// 반응형 간격 계산 유틸
export const getResponsiveSpacing = (size: number, factor = 1): number => {
    return size * factor;
};

export default { SPACING, getResponsiveSpacing }; 