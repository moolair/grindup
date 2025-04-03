import { collection, query, where, getDocs, getDoc, doc, Timestamp } from 'firebase/firestore';
import { db, auth } from './index';

// 스트릭 정보 인터페이스
export interface StreakInfo {
    currentStreak: number;
    longestStreak: number;
    totalCompletions: number;
}

/**
 * 사용자의 스트릭 정보를 가져옵니다
 */
export const getStreakInfo = async (): Promise<StreakInfo> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        // 사용자의 스트릭 문서 가져오기
        const streakDocRef = doc(db, 'userStats', user.uid);
        const streakDoc = await getDoc(streakDocRef);

        if (streakDoc.exists()) {
            const data = streakDoc.data();
            return {
                currentStreak: data.currentStreak || 0,
                longestStreak: data.longestStreak || 0,
                totalCompletions: data.totalCompletions || 0,
            };
        }

        // 문서가 없으면 기본값 반환
        return {
            currentStreak: 0,
            longestStreak: 0,
            totalCompletions: 0,
        };
    } catch (error) {
        console.error('Error getting streak info:', error);
        return {
            currentStreak: 0,
            longestStreak: 0,
            totalCompletions: 0,
        };
    }
};

/**
 * 특정 날짜의 기여 정보를 가져옵니다
 */
export const getContributionsForDate = async (date: Date): Promise<number> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        // 날짜 범위 설정
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        // 완료된 작업 쿼리
        const tasksRef = collection(db, 'tasks');
        const q = query(
            tasksRef,
            where('userId', '==', user.uid),
            where('status', '==', 'completed'),
            where('completedAt', '>=', Timestamp.fromDate(startDate)),
            where('completedAt', '<=', Timestamp.fromDate(endDate))
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.size; // 완료된 작업 수 반환
    } catch (error) {
        console.error('Error getting contributions for date:', error);
        return 0;
    }
};

/**
 * 주간 기여 정보를 가져옵니다 (ContributionGraph 컴포넌트에서 사용)
 */
export const getWeeklyContributions = async (weeks: number = 8): Promise<{ date: string; count: number }[]> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        // 시작 날짜 계산 (n주 전)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (weeks * 7));
        startDate.setHours(0, 0, 0, 0);

        // 완료된 작업 쿼리
        const tasksRef = collection(db, 'tasks');
        const q = query(
            tasksRef,
            where('userId', '==', user.uid),
            where('status', '==', 'completed'),
            where('completedAt', '>=', Timestamp.fromDate(startDate))
        );

        const querySnapshot = await getDocs(q);

        // 날짜별 기여 집계
        const contributionMap = new Map<string, number>();

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const completedDate = data.completedAt.toDate();
            const dateString = completedDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식

            const currentCount = contributionMap.get(dateString) || 0;
            contributionMap.set(dateString, currentCount + 1);
        });

        // 결과 배열로 변환
        const result: { date: string; count: number }[] = [];
        for (const [date, count] of contributionMap.entries()) {
            result.push({ date, count });
        }

        return result;
    } catch (error) {
        console.error('Error getting weekly contributions:', error);
        return [];
    }
}; 