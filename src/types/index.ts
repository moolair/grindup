// Task 관련 타입
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
    completedAt?: Date;
    category?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    tags?: string[];
}

// User 관련 타입
export interface User {
    id: string;
    displayName: string;
    email: string;
    photoURL?: string;
    createdAt: Date;
    lastLoginAt: Date;
    stats?: UserStats;
}

// 사용자 통계 관련 타입
export interface UserStats {
    currentStreak: number;
    longestStreak: number;
    totalCompletions: number;
    tasksByCategory?: Record<string, number>;
    tasksByPriority?: Record<string, number>;
}

// 기여 관련 타입
export interface ContributionData {
    date: string;
    count: number;
}

// 테마 관련 타입
export interface Theme {
    colors: {
        primary: string;
        secondary: string;
        background: string;
        card: string;
        text: string;
        border: string;
        notification: string;
        error: string;
        success: string;
        warning: string;
        info: string;
        white: string;
        black: string;
        gray: string;
    };
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
    borderRadius: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
    fontSize: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
} 