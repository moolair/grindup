import { Task, TaskCreateInput, TaskUpdateInput, TaskStatus } from '../models/Task';

/**
 * 작업 관련 데이터 액세스를 위한 레포지토리 인터페이스
 * 실제 구현은 데이터 레이어에서 이루어집니다.
 */
export interface TaskRepository {
    /**
     * 모든 작업 목록을 가져옵니다.
     */
    getTasks(): Promise<Task[]>;

    /**
     * 특정 상태의 작업 목록을 가져옵니다.
     * @param status 작업 상태
     */
    getTasksByStatus(status: TaskStatus): Promise<Task[]>;

    /**
     * 특정 ID의 작업을 가져옵니다.
     * @param id 작업 ID
     */
    getTaskById(id: string): Promise<Task | null>;

    /**
     * 새로운 작업을 생성합니다.
     * @param data 생성할 작업 데이터
     */
    createTask(data: TaskCreateInput): Promise<Task>;

    /**
     * 작업을 업데이트합니다.
     * @param id 업데이트할 작업 ID
     * @param data 업데이트할 데이터
     */
    updateTask(id: string, data: TaskUpdateInput): Promise<Task>;

    /**
     * 작업을 완료 상태로 변경합니다.
     * @param id 완료할 작업 ID
     */
    completeTask(id: string): Promise<Task>;

    /**
     * 작업을 삭제합니다.
     * @param id 삭제할 작업 ID
     */
    deleteTask(id: string): Promise<void>;

    /**
     * 오늘의 작업 목록을 가져옵니다.
     */
    getTodayTasks(): Promise<Task[]>;

    /**
     * 특정 카테고리의 작업 목록을 가져옵니다.
     * @param category 카테고리
     */
    getTasksByCategory(category: string): Promise<Task[]>;
} 