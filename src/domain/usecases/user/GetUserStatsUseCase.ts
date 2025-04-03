import { User, UserStats as BaseUserStats } from '../../models/User';
import { UserRepository } from '../../repositories/UserRepository';
import { ContributionRepository } from '../../repositories/ContributionRepository';
import { ContributionSummary } from '../../models/Contribution';

/**
 * 사용자의 통계 정보를 가져오는 유스케이스
 */
export class GetUserStatsUseCase {
    constructor(
        private userRepository: UserRepository,
        private contributionRepository: ContributionRepository
    ) { }

    /**
     * 사용자의 기본 통계 정보와 기여 정보를 종합하여 반환합니다.
     * @param userId 사용자 ID
     * @returns 사용자의 통합 통계 정보
     */
    async execute(userId: string): Promise<UserStats> {
        // 병렬로 두 레포지토리에서 필요한 정보를 가져옴
        const [userStats, contributionSummary] = await Promise.all([
            this.userRepository.getUserStats(userId),
            this.contributionRepository.getContributionSummary(userId)
        ]);

        if (!userStats) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        // 종합 통계 정보 생성
        return {
            ...userStats,
            contributions: contributionSummary
        };
    }
}

/**
 * 사용자의 종합 통계 정보를 나타내는 인터페이스
 * 기본 UserStats에 컨트리뷰션 정보 추가
 */
interface UserStats extends BaseUserStats {
    contributions: ContributionSummary;
} 