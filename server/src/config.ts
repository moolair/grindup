/**
 * 게이트웨이 설정.
 *
 * FIREBASE_PROJECT_ID는 필수입니다. `.env` 파일(gitignore 대상)에 넣거나
 * 환경변수로 넘기세요. 값은 iOS의 GoogleService-Info.plist / Android의
 * google-services.json 에 있는 PROJECT_ID 와 동일해야 합니다.
 */

const requireEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(
            `환경변수 ${key} 가 설정되지 않았습니다. server/.env 에 ${key}=... 를 추가하세요.`
        );
    }
    return value;
};

export const config = {
    projectId: requireEnv('FIREBASE_PROJECT_ID'),
    port: Number(process.env.PORT ?? 4000),
    // 시뮬레이터/에뮬레이터/실기기에서 모두 접근 가능하도록 전체 인터페이스에 바인딩
    host: process.env.HOST ?? '0.0.0.0',
} as const;
