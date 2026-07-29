import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { removeCompletionData, updateContributionLevel } from './firebase/contributions';

export interface DayOption {
    id: string;
    label: string;
    selected: boolean;
}

export interface Routine {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    category?: string;
    color?: string;
    order: number;
    days?: DayOption[];
    createdAt: string; // ISO date string
    lastResetAt: string; // ISO date string (last time routines were reset)
}

// 사용자별 저장소 키 생성
const getUserStorageKey = (): string => {
    const user = auth().currentUser;
    const userId = user ? user.uid : 'default';
    return `app_routines_${userId}`;
};

// 사용자별 리셋 키 생성
const getUserResetKey = (): string => {
    const user = auth().currentUser;
    const userId = user ? user.uid : 'default';
    return `routines_last_reset_${userId}`;
};

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
        const lastResetStr = await AsyncStorage.getItem(getUserResetKey());
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

// 상태 변경 리스너 관리를 위한 이벤트 시스템
type RoutineStateListener = () => void;
type RoutineStateChange = 'update' | 'complete' | 'reset';

const routineStateListeners: Record<RoutineStateChange, RoutineStateListener[]> = {
    update: [],
    complete: [],
    reset: []
};

/**
 * 루틴 상태 변경 리스너 등록
 * 
 * @param type 변경 유형 ('update', 'complete', 'reset')
 * @param listener 호출될 리스너 함수
 * @returns 리스너 제거 함수
 */
export const addRoutineStateListener = (type: RoutineStateChange, listener: RoutineStateListener): () => void => {
    routineStateListeners[type].push(listener);
    return () => {
        const index = routineStateListeners[type].indexOf(listener);
        if (index > -1) {
            routineStateListeners[type].splice(index, 1);
        }
    };
};

/**
 * 루틴 상태 변경 이벤트 발생
 * 
 * @param type 변경 유형 ('update', 'complete', 'reset')
 */
const notifyRoutineStateChange = (type: RoutineStateChange): void => {
    console.log(`루틴 상태 변경 알림: ${type}`);
    routineStateListeners[type].forEach(listener => {
        try {
            listener();
        } catch (error) {
            console.error('루틴 상태 리스너 실행 중 오류:', error);
        }
    });
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

        await AsyncStorage.setItem(getUserStorageKey(), JSON.stringify(resetRoutines));
        await AsyncStorage.setItem(getUserResetKey(), new Date().toISOString());

        console.log('루틴 리셋 완료:', new Date().toISOString());

        // 리셋 이벤트 알림
        notifyRoutineStateChange('reset');
    } catch (error) {
        console.error('루틴 리셋 중 오류:', error);
    }
};

// 모든 루틴 가져오기
export const getRoutines = async (): Promise<Routine[]> => {
    try {
        const data = await AsyncStorage.getItem(getUserStorageKey());
        const routines: Routine[] = data ? JSON.parse(data) : [];
        // order 필드 기준으로 정렬하여 반환
        return routines.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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
            id: `routine-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            createdAt: new Date().toISOString(),
            lastResetAt: new Date().toISOString()
        };

        const updatedRoutines = [...routines, newRoutine];
        await AsyncStorage.setItem(getUserStorageKey(), JSON.stringify(updatedRoutines));

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

        await AsyncStorage.setItem(getUserStorageKey(), JSON.stringify(routines));

        // 업데이트 이벤트 알림
        notifyRoutineStateChange('update');

        return updatedRoutine;
    } catch (error) {
        console.error('루틴 업데이트 중 오류:', error);
        throw error;
    }
};

// 루틴 완료/미완료 토글
export const toggleRoutineCompletion = async (id: string): Promise<Routine | null> => {
    try {
        console.log(`루틴 토글 시작: ${id}`);

        // 현재 루틴 상태 가져오기
        const routines = await getRoutines();
        const index = routines.findIndex(r => r.id === id);

        if (index === -1) {
            console.log(`루틴이 존재하지 않음: ${id}`);
            return null;
        }

        // 현재 상태 저장 및 상태 변경
        const prevState = routines[index].completed;
        const newState = !prevState;
        console.log(`루틴 상태 변경: ${prevState} -> ${newState}`);

        const updatedRoutine = {
            ...routines[index],
            completed: newState
        };

        // 상태 변경 적용
        routines[index] = updatedRoutine;
        await AsyncStorage.setItem(getUserStorageKey(), JSON.stringify(routines));
        console.log(`루틴 상태 저장 완료: ${updatedRoutine.completed}`);

        // 완료 상태 변경 이벤트 알림 (로컬 상태 업데이트는 완료됨)
        notifyRoutineStateChange('complete');

        // Firebase 데이터 처리 (별도 try-catch로 감싸서 실패해도 루틴 상태 업데이트는 유지)
        try {
            if (newState) {
                // 완료로 변경된 경우 - Firebase에 데이터 추가
                console.log('Firebase에 완료 데이터 추가 시작');
                await updateFirebaseContribution();
            } else {
                // 미완료로 변경된 경우 - Firebase에서 데이터 삭제
                console.log('Firebase에서 완료 데이터 삭제 시작');
                const today = new Date();
                const result = await removeCompletionData(id, today);
                console.log('Firebase 데이터 삭제 결과:', result ? '성공' : '실패');
            }
        } catch (firebaseError) {
            // Firebase 관련 오류는 로그만 남기고 루틴 상태 업데이트에는 영향을 주지 않음
            console.error('Firebase 데이터 처리 중 오류 (루틴 상태는 정상 업데이트됨):', firebaseError);
        }

        return updatedRoutine;
    } catch (error) {
        console.error('루틴 완료 상태 토글 중 오류:', error);
        throw error;
    }
};

// Firebase에 오늘의 기여 데이터 업데이트
/**
 * Firebase에 오늘의 루틴 완료 기여 데이터를 업데이트합니다.
 * 이 함수는 루틴을 완료했을 때 호출되며, 기여 그래프에 반영됩니다.
 * 
 * Note: Firebase v22 모듈러 SDK API 패턴을 준수합니다.
 */
const updateFirebaseContribution = async (): Promise<void> => {
    try {
        console.log('Firebase 기여 데이터 업데이트 시작');

        const user = auth().currentUser;
        if (!user) {
            console.log('인증된 사용자가 없습니다.');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 오늘 날짜의 기여 데이터 가져오기
        const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; // YYYY-MM-DD 로컬 시간

        console.log('Firestore 문서 생성 시작');
        // Firebase 데이터 저장 (간소화된 방식)
        const taskDocData = {
            userId: user.uid,
            status: 'completed',
            completedAt: firestore.FieldValue.serverTimestamp(),
            title: '루틴 완료',
            type: 'routine',
            dateString: todayFormatted
        };

        try {
            // 모듈러 API 방식으로 컬렉션과 문서 참조 생성
            const tasksCollection = firestore().collection('tasks');
            const docRef = tasksCollection.doc(); // 자동 ID 생성
            await docRef.set(taskDocData);
            console.log(`Firebase 기여 데이터 저장 성공: 문서 ID ${docRef.id}`);

            // 기여도 레벨 업데이트 (색상 강도 계산)
            await updateContributionLevel(today);
            console.log('기여도 색상 레벨 업데이트 완료');
        } catch (innerError) {
            console.error('Firebase 문서 저장 실패:', innerError);
        }
    } catch (error) {
        console.error('Firebase 기여 데이터 업데이트 중 오류:', error);
    }
};

// 루틴 삭제하기
export const deleteRoutine = async (id: string): Promise<boolean> => {
    try {
        const routines = await getRoutines();
        const updatedRoutines = routines.filter(r => r.id !== id);

        await AsyncStorage.setItem(getUserStorageKey(), JSON.stringify(updatedRoutines));
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
                color: '#00B894', // success 색상 명시적 지정
                order: 0
            },
            {
                title: '일일 업무 계획 세우기',
                description: '오늘의 중요 작업 3가지 선정',
                completed: false,
                category: '업무',
                color: '#3366FF', // primary 색상 명시적 지정
                order: 1
            },
            {
                title: '하루 일기 쓰기',
                description: '오늘 있었던 일과 감정 기록',
                completed: false,
                category: '업무', // '개인'에서 '업무'로 변경
                color: '#3366FF', // primary 색상 명시적 지정
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