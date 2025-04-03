import { Task } from '../../models/Task';
import { TaskRepository } from '../../repositories/TaskRepository';
import { ContributionRepository } from '../../repositories/ContributionRepository';

/**
 * 작업을 완료 처리하고 사용자의 기여도를 업데이트하는 유스케이스
 */
export class CompleteTaskUseCase {
    constructor(
        private taskRepository: TaskRepository,
        private contributionRepository: ContributionRepository
    ) { }

    /**
     * 작업을 완료 처리하고 사용자의 기여도를 업데이트합니다.
     * @param taskId 완료할 작업 ID
     * @param userId 사용자 ID
     * @returns 완료된 작업 정보
     */
    async execute(taskId: string, userId: string): Promise<Task> {
        // 작업 존재 여부 확인
        const task = await this.taskRepository.getTaskById(taskId);
        if (!task) {
            throw new Error('존재하지 않는 작업입니다.');
        }

        // 이미 완료된 작업인지 확인
        if (task.status === 'completed') {
            throw new Error('이미 완료된 작업입니다.');
        }

        // 작업 완료 처리
        const completedTask = await this.taskRepository.completeTask(taskId);

        // 오늘 날짜 생성 (YYYY-MM-DD 형식)
        const today = new Date().toISOString().split('T')[0];

        // 사용자 기여도 업데이트
        await this.contributionRepository.incrementContribution(userId, today, taskId);

        return completedTask;
    }
} 