/**
 * 아이콘 상수
 * GrindUp 앱에서 사용하는 모든 아이콘을 정의합니다.
 */

// 아이콘 이름 정의
export enum ICON_NAME {
    // 탭바 아이콘
    HOME = 'home',
    CALENDAR = 'calendar',
    ANALYTICS = 'analytics',
    PROFILE = 'profile',

    // 네비게이션 아이콘
    BACK = 'arrow-back',
    CLOSE = 'close',
    MENU = 'menu',
    MORE = 'more',

    // 액션 아이콘
    ADD = 'add',
    REMOVE = 'remove',
    EDIT = 'edit',
    DELETE = 'delete',
    SAVE = 'save',
    SHARE = 'share',
    SEARCH = 'search',
    FILTER = 'filter',
    SORT = 'sort',
    BOOKMARK = 'bookmark',
    BOOKMARK_FILLED = 'bookmark-filled',
    LIKE = 'like',
    LIKE_FILLED = 'like-filled',

    // 워크아웃 관련 아이콘
    DUMBBELL = 'dumbbell',
    TIMER = 'timer',
    REST = 'rest',
    SETS = 'sets',
    REPS = 'reps',
    WEIGHT = 'weight',
    BODYWEIGHT = 'bodyweight',
    RUNNING = 'running',
    CYCLING = 'cycling',
    SWIMMING = 'swimming',

    // UI 요소 아이콘
    CHECKBOX = 'checkbox',
    CHECKBOX_CHECKED = 'checkbox-checked',
    RADIO = 'radio',
    RADIO_SELECTED = 'radio-selected',
    DROPDOWN = 'dropdown',
    ARROW_UP = 'arrow-up',
    ARROW_DOWN = 'arrow-down',
    ARROW_LEFT = 'arrow-left',
    ARROW_RIGHT = 'arrow-right',

    // 상태 아이콘
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
    INFO = 'info',
    LOADING = 'loading',

    // 유저 관련 아이콘
    USER = 'user',
    USERS = 'users',
    SETTINGS = 'settings',
    NOTIFICATIONS = 'notifications',
    HELP = 'help',
    LOGOUT = 'logout',

    // 소셜 아이콘
    FACEBOOK = 'facebook',
    TWITTER = 'twitter',
    INSTAGRAM = 'instagram',
    YOUTUBE = 'youtube',

    // 기타 아이콘
    CAMERA = 'camera',
    GALLERY = 'gallery',
    ATTACHMENT = 'attachment',
    LINK = 'link',
    CALENDAR_EVENT = 'calendar-event',
    STAR = 'star',
    STAR_FILLED = 'star-filled',
    LOCK = 'lock',
    UNLOCK = 'unlock',
}

// 아이콘 크기 정의
export const ICON_SIZE = {
    TINY: 12,
    SMALL: 16,
    MEDIUM: 24,
    LARGE: 32,
    EXTRA_LARGE: 48,
};

// 아이콘 컬러 타입 정의
export type IconColorType = string | { light: string; dark: string };

// 아이콘 세트 정의
export const ICON_SET = {
    MATERIAL: 'material',
    MATERIAL_COMMUNITY: 'material-community',
    IONICONS: 'ionicons',
    FONT_AWESOME: 'font-awesome',
    FEATHER: 'feather',
};

// 아이콘 매핑 (아이콘 이름 -> 아이콘 세트 및 실제 아이콘 이름)
export const ICON_MAPPING: Record<ICON_NAME, { set: string; name: string }> = {
    // 탭바 아이콘
    [ICON_NAME.HOME]: { set: ICON_SET.MATERIAL, name: 'home' },
    [ICON_NAME.CALENDAR]: { set: ICON_SET.MATERIAL, name: 'calendar-today' },
    [ICON_NAME.ANALYTICS]: { set: ICON_SET.MATERIAL, name: 'bar-chart' },
    [ICON_NAME.PROFILE]: { set: ICON_SET.MATERIAL, name: 'person' },

    // 네비게이션 아이콘
    [ICON_NAME.BACK]: { set: ICON_SET.MATERIAL, name: 'arrow-back' },
    [ICON_NAME.CLOSE]: { set: ICON_SET.MATERIAL, name: 'close' },
    [ICON_NAME.MENU]: { set: ICON_SET.MATERIAL, name: 'menu' },
    [ICON_NAME.MORE]: { set: ICON_SET.MATERIAL, name: 'more-vert' },

    // 액션 아이콘
    [ICON_NAME.ADD]: { set: ICON_SET.MATERIAL, name: 'add' },
    [ICON_NAME.REMOVE]: { set: ICON_SET.MATERIAL, name: 'remove' },
    [ICON_NAME.EDIT]: { set: ICON_SET.MATERIAL, name: 'edit' },
    [ICON_NAME.DELETE]: { set: ICON_SET.MATERIAL, name: 'delete' },
    [ICON_NAME.SAVE]: { set: ICON_SET.MATERIAL, name: 'save' },
    [ICON_NAME.SHARE]: { set: ICON_SET.MATERIAL, name: 'share' },
    [ICON_NAME.SEARCH]: { set: ICON_SET.MATERIAL, name: 'search' },
    [ICON_NAME.FILTER]: { set: ICON_SET.MATERIAL, name: 'filter-list' },
    [ICON_NAME.SORT]: { set: ICON_SET.MATERIAL, name: 'sort' },
    [ICON_NAME.BOOKMARK]: { set: ICON_SET.MATERIAL, name: 'bookmark-border' },
    [ICON_NAME.BOOKMARK_FILLED]: { set: ICON_SET.MATERIAL, name: 'bookmark' },
    [ICON_NAME.LIKE]: { set: ICON_SET.MATERIAL, name: 'favorite-border' },
    [ICON_NAME.LIKE_FILLED]: { set: ICON_SET.MATERIAL, name: 'favorite' },

    // 워크아웃 관련 아이콘
    [ICON_NAME.DUMBBELL]: { set: ICON_SET.MATERIAL_COMMUNITY, name: 'dumbbell' },
    [ICON_NAME.TIMER]: { set: ICON_SET.MATERIAL, name: 'timer' },
    [ICON_NAME.REST]: { set: ICON_SET.MATERIAL, name: 'hourglass-empty' },
    [ICON_NAME.SETS]: { set: ICON_SET.MATERIAL_COMMUNITY, name: 'playlist-plus' },
    [ICON_NAME.REPS]: { set: ICON_SET.MATERIAL, name: 'repeat' },
    [ICON_NAME.WEIGHT]: { set: ICON_SET.MATERIAL_COMMUNITY, name: 'weight' },
    [ICON_NAME.BODYWEIGHT]: { set: ICON_SET.MATERIAL_COMMUNITY, name: 'human' },
    [ICON_NAME.RUNNING]: { set: ICON_SET.MATERIAL_COMMUNITY, name: 'run' },
    [ICON_NAME.CYCLING]: { set: ICON_SET.MATERIAL_COMMUNITY, name: 'bike' },
    [ICON_NAME.SWIMMING]: { set: ICON_SET.MATERIAL_COMMUNITY, name: 'swim' },

    // UI 요소 아이콘
    [ICON_NAME.CHECKBOX]: { set: ICON_SET.MATERIAL, name: 'check-box-outline-blank' },
    [ICON_NAME.CHECKBOX_CHECKED]: { set: ICON_SET.MATERIAL, name: 'check-box' },
    [ICON_NAME.RADIO]: { set: ICON_SET.MATERIAL, name: 'radio-button-unchecked' },
    [ICON_NAME.RADIO_SELECTED]: { set: ICON_SET.MATERIAL, name: 'radio-button-checked' },
    [ICON_NAME.DROPDOWN]: { set: ICON_SET.MATERIAL, name: 'arrow-drop-down' },
    [ICON_NAME.ARROW_UP]: { set: ICON_SET.MATERIAL, name: 'keyboard-arrow-up' },
    [ICON_NAME.ARROW_DOWN]: { set: ICON_SET.MATERIAL, name: 'keyboard-arrow-down' },
    [ICON_NAME.ARROW_LEFT]: { set: ICON_SET.MATERIAL, name: 'keyboard-arrow-left' },
    [ICON_NAME.ARROW_RIGHT]: { set: ICON_SET.MATERIAL, name: 'keyboard-arrow-right' },

    // 상태 아이콘
    [ICON_NAME.SUCCESS]: { set: ICON_SET.MATERIAL, name: 'check-circle' },
    [ICON_NAME.WARNING]: { set: ICON_SET.MATERIAL, name: 'warning' },
    [ICON_NAME.ERROR]: { set: ICON_SET.MATERIAL, name: 'error' },
    [ICON_NAME.INFO]: { set: ICON_SET.MATERIAL, name: 'info' },
    [ICON_NAME.LOADING]: { set: ICON_SET.MATERIAL, name: 'refresh' },

    // 유저 관련 아이콘
    [ICON_NAME.USER]: { set: ICON_SET.MATERIAL, name: 'person' },
    [ICON_NAME.USERS]: { set: ICON_SET.MATERIAL, name: 'people' },
    [ICON_NAME.SETTINGS]: { set: ICON_SET.MATERIAL, name: 'settings' },
    [ICON_NAME.NOTIFICATIONS]: { set: ICON_SET.MATERIAL, name: 'notifications' },
    [ICON_NAME.HELP]: { set: ICON_SET.MATERIAL, name: 'help' },
    [ICON_NAME.LOGOUT]: { set: ICON_SET.MATERIAL, name: 'exit-to-app' },

    // 소셜 아이콘
    [ICON_NAME.FACEBOOK]: { set: ICON_SET.MATERIAL_COMMUNITY, name: 'facebook' },
    [ICON_NAME.TWITTER]: { set: ICON_SET.MATERIAL_COMMUNITY, name: 'twitter' },
    [ICON_NAME.INSTAGRAM]: { set: ICON_SET.MATERIAL_COMMUNITY, name: 'instagram' },
    [ICON_NAME.YOUTUBE]: { set: ICON_SET.MATERIAL_COMMUNITY, name: 'youtube' },

    // 기타 아이콘
    [ICON_NAME.CAMERA]: { set: ICON_SET.MATERIAL, name: 'camera-alt' },
    [ICON_NAME.GALLERY]: { set: ICON_SET.MATERIAL, name: 'photo-library' },
    [ICON_NAME.ATTACHMENT]: { set: ICON_SET.MATERIAL, name: 'attachment' },
    [ICON_NAME.LINK]: { set: ICON_SET.MATERIAL, name: 'link' },
    [ICON_NAME.CALENDAR_EVENT]: { set: ICON_SET.MATERIAL, name: 'event' },
    [ICON_NAME.STAR]: { set: ICON_SET.MATERIAL, name: 'star-border' },
    [ICON_NAME.STAR_FILLED]: { set: ICON_SET.MATERIAL, name: 'star' },
    [ICON_NAME.LOCK]: { set: ICON_SET.MATERIAL, name: 'lock' },
    [ICON_NAME.UNLOCK]: { set: ICON_SET.MATERIAL, name: 'lock-open' },
};

export default { ICON_NAME, ICON_SIZE, ICON_MAPPING }; 