import { User, UserRegisterInput } from '../../models/User';
import { UserRepository } from '../../repositories/UserRepository';

/**
 * 사용자 회원가입 유스케이스
 */
export class SignUpUseCase {
    constructor(
        private userRepository: UserRepository
    ) { }

    /**
     * 새로운 사용자 계정을 생성합니다.
     * @param data 회원가입 정보
     * @returns 생성된 사용자 정보
     * @throws 회원가입 실패 시 에러
     */
    async execute(data: UserRegisterInput): Promise<User> {
        // 입력값 유효성 검증
        if (!data.email) {
            throw new Error('이메일은 필수입니다.');
        }

        if (!data.password) {
            throw new Error('비밀번호는 필수입니다.');
        }

        if (!data.displayName) {
            throw new Error('이름은 필수입니다.');
        }

        // 비밀번호 강도 검증 (선택적)
        this.validatePassword(data.password);

        try {
            // 레포지토리를 통해 회원가입 시도
            const user = await this.userRepository.signUp(data);
            return user;
        } catch (error) {
            // 에러 처리 및 적절한 오류 메시지 반환
            if (error instanceof Error) {
                throw new Error(`회원가입 실패: ${error.message}`);
            }
            throw new Error('회원가입 중 오류가 발생했습니다.');
        }
    }

    /**
     * 비밀번호 강도를 검증합니다.
     * @param password 검증할 비밀번호
     * @throws 비밀번호가 요구사항을 충족하지 않을 경우 에러
     */
    private validatePassword(password: string): void {
        if (password.length < 8) {
            throw new Error('비밀번호는 최소 8자 이상이어야 합니다.');
        }

        // 복잡성 요구사항 추가 (선택적)
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
            throw new Error('비밀번호는 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.');
        }
    }
} 