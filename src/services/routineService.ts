import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Routine {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    category?: string;
    order: number;
    createdAt: string; // ISO date string
    lastResetAt: string; // ISO date string (last time routines were reset)
}

const STORAGE_KEY = 'app_routines';
const LAST_RESET_KEY = 'routines_last_reset';

// 오늘 자정의 시간을 얻는 함수
export const getMidnightTonight = (): Date => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight;
};

// 오늘의 자정 시간을 가져옴 (즉, 오늘의 시작점)
export const getMidnightToday = (): Date => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    return midnight;
};

// 루틴 리셋이 필요한지 체크
export const shouldResetRoutines = async (): Promise<boolean> => {
    try {
        const lastResetStr = await AsyncStorage.getItem(LAST_RESET_KEY);
        if (!lastResetStr) return true;

        const lastReset = new Date(lastResetStr);
        const todayMidnight = getMidnightToday();

        // 마지막 리셋이 오늘 자정보다 이전이면 (즉, 어제 이전) 리셋이 필요
        return lastReset < todayMidnight;
    } catch (error) {
        console.error('루틴 리셋 체크 중 오류:', error);
        return false;
    }
};

// 루틴 상태 초기화 (모든 루틴을 미완료 상태로)
export const resetRoutines = async (): Promise<void> => {
    try {
        const routines = await getRoutines();

        const resetRoutines = routines.map(routine => ({
            ...routine,
            completed: false,
            lastResetAt: new Date().toISOString()
        }));

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resetRoutines));
        await AsyncStorage.setItem(LAST_RESET_KEY, new Date().toISOString());

        console.log('루틴 리셋 완료:', new Date().toISOString());
    } catch (error) {
        console.error('루틴 리셋 중 오류:', error);
    }
};

// 모든 루틴 가져오기
export const getRoutines = async (): Promise<Routine[]> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('루틴 조회 중 오류:', error);
        return [];
    }
};

// 루틴 추가하기
export const addRoutine = async (routine: Omit<Routine, 'id' | 'createdAt' | 'lastResetAt'>): Promise<Routine> => {
    try {
        const routines = await getRoutines();

        const newRoutine: Routine = {
            ...routine,
            id: `routine-${Date.now()}`,
            createdAt: new Date().toISOString(),
            lastResetAt: new Date().toISOString()
        };

        const updatedRoutines = [...routines, newRoutine];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoutines));

        return newRoutine;
    } catch (error) {
        console.error('루틴 추가 중 오류:', error);
        throw error;
    }
};

// 루틴 업데이트하기
export const updateRoutine = async (id: string, updates: Partial<Routine>): Promise<Routine | null> => {
    try {
        const routines = await getRoutines();
        const index = routines.findIndex(r => r.id === id);

        if (index === -1) return null;

        const updatedRoutine = { ...routines[index], ...updates };
        routines[index] = updatedRoutine;

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
        return updatedRoutine;
    } catch (error) {
        console.error('루틴 업데이트 중 오류:', error);
        throw error;
    }
};

// 루틴 완료/미완료 토글
export const toggleRoutineCompletion = async (id: string): Promise<Routine | null> => {
    try {
        const routines = await getRoutines();
        const index = routines.findIndex(r => r.id === id);

        if (index === -1) return null;

        const updatedRoutine = {
            ...routines[index],
            completed: !routines[index].completed
        };

        routines[index] = updatedRoutine;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(routines));

        return updatedRoutine;
    } catch (error) {
        console.error('루틴 완료 상태 토글 중 오류:', error);
        throw error;
    }
};

// 루틴 삭제하기
export const deleteRoutine = async (id: string): Promise<boolean> => {
    try {
        const routines = await getRoutines();
        const updatedRoutines = routines.filter(r => r.id !== id);

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoutines));
        return true;
    } catch (error) {
        console.error('루틴 삭제 중 오류:', error);
        return false;
    }
};

// 기본 루틴 생성하기 (앱 첫 실행 시)
export const createDefaultRoutines = async (): Promise<void> => {
    try {
        const existingRoutines = await getRoutines();

        // 이미 루틴이 있다면 아무것도 하지 않음
        if (existingRoutines.length > 0) return;

        const defaultRoutines: Omit<Routine, 'id' | 'createdAt' | 'lastResetAt'>[] = [
            {
                title: '아침 운동하기',
                description: '30분 간단한 스트레칭',
                completed: false,
                category: '건강',
                order: 0
            },
            {
                title: '일일 업무 계획 세우기',
                description: '오늘의 중요 작업 3가지 선정',
                completed: false,
                category: '업무',
                order: 1
            },
            {
                title: '하루 일기 쓰기',
                description: '오늘 있었던 일과 감정 기록',
                completed: false,
                category: '개인',
                order: 2
            }
        ];

        // 각 기본 루틴 추가
        for (const routine of defaultRoutines) {
            await addRoutine(routine);
        }

        console.log('기본 루틴 생성 완료');
    } catch (error) {
        console.error('기본 루틴 생성 중 오류:', error);
    }
}; 