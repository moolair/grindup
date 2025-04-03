import { User, UserAuthInput } from '../../models/User';
import { UserRepository } from '../../repositories/UserRepository';

/**
 * 사용자 로그인 유스케이스
 */
export class SignInUseCase {
    constructor(
        private userRepository: UserRepository
    ) { }

    /**
     * 이메일과 비밀번호로 사용자 로그인을 수행합니다.
     * @param credentials 로그인 정보 (이메일 및 비밀번호)
     * @returns 로그인된 사용자 정보
     * @throws 로그인 실패 시 에러
     */
    async execute(credentials: UserAuthInput): Promise<User> {
        // 입력값 유효성 검증
        if (!credentials.email) {
            throw new Error('이메일은 필수입니다.');
        }

        if (!credentials.password) {
            throw new Error('비밀번호는 필수입니다.');
        }

        try {
            // 레포지토리를 통해 로그인 시도
            const user = await this.userRepository.signIn(credentials);
            return user;
        } catch (error) {
            // 에러 처리 및 적절한 오류 메시지 반환
            if (error instanceof Error) {
                throw new Error(`로그인 실패: ${error.message}`);
            }
            throw new Error('로그인 중 오류가 발생했습니다.');
        }
    }
} 