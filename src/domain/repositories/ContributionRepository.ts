import {
    Contribution,
    ContributionCreateInput,
    ContributionUpdateInput,
    ContributionSummary,
    ContributionRange
} from '../models/Contribution';

/**
 * 사용자 기여 데이터 액세스를 위한 레포지토리 인터페이스
 */
export interface ContributionRepository {
    /**
     * 특정 사용자의 특정 날짜 기여 정보를 가져옵니다.
     * @param userId 사용자 ID
     * @param date 날짜 (ISO 문자열)
     */
    getDailyContribution(userId: string, date: string): Promise<Contribution | null>;

    /**
     * 특정 사용자의 날짜 범위 내 기여 정보를 가져옵니다.
     * @param userId 사용자 ID
     * @param range 날짜 범위 (시작일과 종료일)
     */
    getContributionsInRange(userId: string, range: ContributionRange): Promise<Contribution[]>;

    /**
     * 특정 사용자의 기여 요약 정보를 가져옵니다.
     * @param userId 사용자 ID
     */
    getContributionSummary(userId: string): Promise<ContributionSummary>;

    /**
     * 새로운 기여 정보를 생성합니다.
     * @param data 기여 생성 데이터
     */
    createContribution(data: ContributionCreateInput): Promise<Contribution>;

    /**
     * 기존 기여 정보를 업데이트합니다.
     * @param userId 사용자 ID
     * @param date 날짜 (ISO 문자열)
     * @param data 업데이트할 데이터
     */
    updateContribution(userId: string, date: string, data: ContributionUpdateInput): Promise<Contribution>;

    /**
     * 기여 횟수를 증가시킵니다. (일일 작업 완료 시 호출)
     * @param userId 사용자 ID
     * @param date 날짜 (ISO 문자열)
     * @param taskId 완료된 작업 ID
     */
    incrementContribution(userId: string, date: string, taskId: string): Promise<Contribution>;

    /**
     * 특정 사용자의 현재 스트릭(연속 기여) 정보를 조회합니다.
     * @param userId 사용자 ID
     */
    getCurrentStreak(userId: string): Promise<number>;

    /**
     * 특정 사용자의 최장 스트릭(연속 기여) 정보를 조회합니다.
     * @param userId 사용자 ID
     */
    getLongestStreak(userId: string): Promise<number>;
} 