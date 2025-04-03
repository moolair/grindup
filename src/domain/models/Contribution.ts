/**
 * Contribution 도메인 모델
 * 사용자의 일일 기여(완료한 작업) 데이터를 표현하는 엔티티
 */
export interface Contribution {
    userId: string;
    date: string; // YYYY-MM-DD 형식
    count: number;
    tasks?: string[]; // 완료한 작업 ID 목록
}

export interface ContributionSummary {
    totalContributions: number;
    longestStreak: number;
    currentStreak: number;
    contributionsByDay: Record<string, number>; // 요일별 기여 (0: 일요일, 6: 토요일)
    mostProductiveDay?: {
        date: string;
        count: number;
    };
}

export interface ContributionRange {
    startDate: string; // YYYY-MM-DD 형식
    endDate: string; // YYYY-MM-DD 형식
}

export interface ContributionCreateInput {
    userId: string;
    date: string;
    count?: number;
    tasks?: string[];
}

export interface ContributionUpdateInput {
    count?: number;
    tasks?: string[];
} 