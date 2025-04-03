import { Task, TaskCreateInput } from '../../models/Task';
import { TaskRepository } from '../../repositories/TaskRepository';

/**
 * 새로운 작업을 생성하는 유스케이스
 */
export class CreateTaskUseCase {
    constructor(private taskRepository: TaskRepository) { }

    /**
     * 새로운 작업을 생성합니다.
     * @param data 작업 생성에 필요한 데이터
     * @returns 생성된 작업 정보
     */
    async execute(data: TaskCreateInput): Promise<Task> {
        // 입력 데이터 검증 (필요시 추가)
        if (!data.title) {
            throw new Error('작업 제목은 필수입니다.');
        }

        // 작업 생성
        const task = await this.taskRepository.createTask(data);
        return task;
    }
} 