/**
 * User 도메인 모델
 * 비즈니스 로직에서 사용자를 표현하는 엔티티
 */
export interface User {
    id: string;
    displayName: string;
    email: string;
    photoURL?: string;
    createdAt: Date;
    lastLoginAt: Date;
    stats?: UserStats;
}

/**
 * 사용자 통계 관련 모델
 */
export interface UserStats {
    currentStreak: number;
    longestStreak: number;
    totalCompletions: number;
    tasksByCategory?: Record<string, number>;
    tasksByPriority?: Record<string, number>;
}

export interface UserAuthInput {
    email: string;
    password: string;
}

export interface UserRegisterInput extends UserAuthInput {
    displayName: string;
}

export interface UserUpdateInput {
    displayName?: string;
    photoURL?: string;
} 