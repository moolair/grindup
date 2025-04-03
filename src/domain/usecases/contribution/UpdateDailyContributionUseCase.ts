import { Contribution, ContributionCreateInput, ContributionUpdateInput } from '../../models/Contribution';
import { ContributionRepository } from '../../repositories/ContributionRepository';

/**
 * 일일 기여도를 업데이트하는 유스케이스
 */
export class UpdateDailyContributionUseCase {
    constructor(
        private contributionRepository: ContributionRepository
    ) { }

    /**
     * 특정 사용자의 특정 날짜 기여도를 업데이트합니다.
     * @param userId 사용자 ID
     * @param date 날짜 (ISO 문자열, YYYY-MM-DD)
     * @param data 업데이트할 데이터
     * @returns 업데이트된 기여도 정보
     */
    async execute(userId: string, date: string, data: ContributionUpdateInput): Promise<Contribution> {
        // 입력값 유효성 검증
        if (!userId) {
            throw new Error('사용자 ID는 필수입니다.');
        }

        if (!date) {
            throw new Error('날짜는 필수입니다.');
        }

        // 기존 기여도 정보 확인
        const existingContribution = await this.contributionRepository.getDailyContribution(userId, date);

        // 기존 기여도가 없으면 새로 생성
        if (!existingContribution) {
            const createData: ContributionCreateInput = {
                userId,
                date,
                count: data.count || 0,
                tasks: data.tasks || []
            };

            return await this.contributionRepository.createContribution(createData);
        }

        // 기존 기여도 업데이트
        return await this.contributionRepository.updateContribution(userId, date, data);
    }

    /**
     * 작업 완료 시 오늘의 기여도를 증가시킵니다.
     * @param userId 사용자 ID
     * @param taskId 완료된 작업 ID
     * @returns 업데이트된 기여도 정보
     */
    async incrementToday(userId: string, taskId: string): Promise<Contribution> {
        // 오늘 날짜 생성 (YYYY-MM-DD 형식)
        const today = new Date().toISOString().split('T')[0];

        // 오늘의 기여도 증가
        return await this.contributionRepository.incrementContribution(userId, today, taskId);
    }
} 