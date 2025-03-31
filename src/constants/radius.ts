/**
 * 테두리 반경 상수
 * GrindUp 앱의 모든 테두리 반경 값을 정의합니다.
 */

export const RADIUS = {
    // 기본 반경 값 (픽셀)
    NONE: 0,
    EXTRA_SMALL: 4,
    SMALL: 8,
    MEDIUM: 12,
    LARGE: 16,
    EXTRA_LARGE: 24,
    CIRCLE: 9999,

    // 컴포넌트별 반경
    COMPONENT: {
        // 버튼 반경
        BUTTON: {
            DEFAULT: 8,
            PILL: 9999,
            SMALL: 6,
        },

        // 카드 반경
        CARD: 12,

        // 인풋 필드 반경
        INPUT: 8,

        // 모달 반경
        MODAL: 16,

        // 태그 반경
        TAG: 6,

        // 이미지 반경
        IMAGE: {
            SMALL: 8,
            MEDIUM: 12,
            LARGE: 16,
            AVATAR: 9999,
        },

        // 토스트 및 알림 반경
        TOAST: 12,

        // 탭바 반경 (상단)
        TAB_BAR: 16,
    },
};

export default RADIUS; 