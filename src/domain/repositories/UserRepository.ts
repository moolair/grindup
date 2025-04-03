import { User, UserAuthInput, UserRegisterInput, UserUpdateInput } from '../models/User';

/**
 * 사용자 관련 데이터 액세스를 위한 레포지토리 인터페이스
 * 실제 구현은 데이터 레이어에서 이루어집니다.
 */
export interface UserRepository {
    /**
     * 이메일과 비밀번호로 로그인합니다.
     * @param credentials 로그인 정보
     */
    signIn(credentials: UserAuthInput): Promise<User>;

    /**
     * 새로운 사용자를 등록합니다.
     * @param data 사용자 등록 정보
     */
    signUp(data: UserRegisterInput): Promise<User>;

    /**
     * 현재 로그인된 사용자를 로그아웃합니다.
     */
    signOut(): Promise<void>;

    /**
     * 현재 로그인된 사용자 정보를 가져옵니다.
     */
    getCurrentUser(): Promise<User | null>;

    /**
     * 사용자 정보를 업데이트합니다.
     * @param userId 사용자 ID
     * @param data 업데이트할 데이터
     */
    updateUser(userId: string, data: UserUpdateInput): Promise<User>;

    /**
     * 비밀번호 재설정 이메일을 전송합니다.
     * @param email 이메일 주소
     */
    resetPassword(email: string): Promise<void>;

    /**
     * 사용자 계정을 삭제합니다.
     */
    deleteAccount(): Promise<void>;

    /**
     * 사용자의 통계 정보를 가져옵니다.
     * @param userId 사용자 ID
     */
    getUserStats(userId: string): Promise<User['stats']>;
} 