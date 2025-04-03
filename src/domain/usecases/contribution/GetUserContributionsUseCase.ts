import { Contribution, ContributionRange } from '../../models/Contribution';
import { ContributionRepository } from '../../repositories/ContributionRepository';

/**
 * 사용자의 기여도 정보를 가져오는 유스케이스
 */
export class GetUserContributionsUseCase {
    constructor(
        private contributionRepository: ContributionRepository
    ) { }

    /**
     * 사용자의 특정 기간 동안의 기여도 정보를 가져옵니다.
     * @param userId 사용자 ID
     * @param range 조회할 날짜 범위
     * @returns 기간 내 기여도 정보 목록
     */
    async execute(userId: string, range: ContributionRange): Promise<Contribution[]> {
        // 입력값 유효성 검증
        if (!userId) {
            throw new Error('사용자 ID는 필수입니다.');
        }

        if (!range.startDate || !range.endDate) {
            throw new Error('시작 날짜와 종료 날짜는 필수입니다.');
        }

        // 시작 날짜가 종료 날짜보다 나중인지 확인
        const startDate = new Date(range.startDate);
        const endDate = new Date(range.endDate);

        if (startDate > endDate) {
            throw new Error('시작 날짜는 종료 날짜보다 이전이어야 합니다.');
        }

        // 레포지토리에서 기여도 정보 가져오기
        const contributions = await this.contributionRepository.getContributionsInRange(userId, range);
        return contributions;
    }

    /**
     * 사용자의 오늘 기여도 정보를 가져옵니다.
     * @param userId 사용자 ID
     * @returns 오늘의 기여도 정보
     */
    async getToday(userId: string): Promise<Contribution | null> {
        // 오늘 날짜 생성 (YYYY-MM-DD 형식)
        const today = new Date().toISOString().split('T')[0];

        // 오늘의 기여도 정보 가져오기
        const contribution = await this.contributionRepository.getDailyContribution(userId, today);
        return contribution;
    }
} 