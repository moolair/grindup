/**
 * Task 도메인 모델
 * 비즈니스 로직에서 작업(Task)을 표현하는 엔티티
 */
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
    completedAt?: Date;
    category?: string;
    priority?: TaskPriority;
    tags?: string[];
}

export type TaskStatus = 'pending' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskCreateInput {
    title: string;
    description?: string;
    dueDate?: Date;
    category?: string;
    priority?: TaskPriority;
    tags?: string[];
}

export interface TaskUpdateInput {
    title?: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: Date;
    completedAt?: Date;
    category?: string;
    priority?: TaskPriority;
    tags?: string[];
} 