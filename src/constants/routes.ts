/**
 * 라우트 상수
 * GrindUp 앱의 모든 화면 라우트를 정의합니다.
 */

export const ROUTES = {
    // 인증 관련 라우트
    AUTH: {
        SPLASH: 'Splash',
        ONBOARDING: 'Onboarding',
        LOGIN: 'Login',
        REGISTER: 'Register',
        FORGOT_PASSWORD: 'ForgotPassword',
        RESET_PASSWORD: 'ResetPassword',
        VERIFY_EMAIL: 'VerifyEmail',
    },

    // 메인 탭 라우트
    TAB: {
        HOME: 'HomeTab',
        CALENDAR: 'CalendarTab',
        ANALYTICS: 'AnalyticsTab',
        PROFILE: 'ProfileTab',
    },

    // 홈 스택 라우트
    HOME: {
        MAIN: 'Home',
        WORKOUT_DETAIL: 'WorkoutDetail',
        PROGRAM_DETAIL: 'ProgramDetail',
        EXERCISE_LIBRARY: 'ExerciseLibrary',
        EXERCISE_DETAIL: 'ExerciseDetail',
        CREATE_WORKOUT: 'CreateWorkout',
        WORKOUT_COMPLETE: 'WorkoutComplete',
    },

    // 캘린더 스택 라우트
    CALENDAR: {
        MAIN: 'Calendar',
        DAY_DETAIL: 'DayDetail',
        SCHEDULE_WORKOUT: 'ScheduleWorkout',
    },

    // 분석 스택 라우트
    ANALYTICS: {
        MAIN: 'Analytics',
        WORKOUT_HISTORY: 'WorkoutHistory',
        EXERCISE_PROGRESS: 'ExerciseProgress',
        BODY_MEASUREMENTS: 'BodyMeasurements',
        ADD_MEASUREMENT: 'AddMeasurement',
    },

    // 프로필 스택 라우트
    PROFILE: {
        MAIN: 'Profile',
        EDIT_PROFILE: 'EditProfile',
        SETTINGS: 'Settings',
        NOTIFICATIONS: 'Notifications',
        SUBSCRIPTION: 'Subscription',
        HELP_SUPPORT: 'HelpSupport',
        PRIVACY_POLICY: 'PrivacyPolicy',
        TERMS_OF_SERVICE: 'TermsOfService',
        ABOUT: 'About',
    },

    // 모달 라우트
    MODAL: {
        WORKOUT_FILTER: 'WorkoutFilter',
        EXERCISE_FILTER: 'ExerciseFilter',
        SHARE: 'Share',
        FEEDBACK: 'Feedback',
    },
};

// 경로 문자열 상수 정의
export type AppRoutes = {
    // 인증 스택
    Splash: undefined;
    Onboarding: undefined;
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: { token: string };
    VerifyEmail: { email: string };

    // 탭 네비게이션
    MainTabs: undefined;

    // 홈 스택
    Home: undefined;
    WorkoutDetail: { id: string };
    ProgramDetail: { id: string };
    ExerciseLibrary: undefined;
    ExerciseDetail: { id: string };
    CreateWorkout: undefined;
    WorkoutComplete: { workoutId: string; duration: number };

    // 캘린더 스택
    Calendar: undefined;
    DayDetail: { date: string };
    ScheduleWorkout: { date: string };

    // 분석 스택
    Analytics: undefined;
    WorkoutHistory: undefined;
    ExerciseProgress: { exerciseId: string };
    BodyMeasurements: undefined;
    AddMeasurement: { type: string };

    // 프로필 스택
    Profile: undefined;
    EditProfile: undefined;
    Settings: undefined;
    Notifications: undefined;
    Subscription: undefined;
    HelpSupport: undefined;
    PrivacyPolicy: undefined;
    TermsOfService: undefined;
    About: undefined;

    // 모달 스택
    WorkoutFilter: undefined;
    ExerciseFilter: undefined;
    Share: { type: 'workout' | 'program'; id: string };
    Feedback: undefined;
};

export default ROUTES; 