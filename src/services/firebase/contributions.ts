import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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
        const user = auth().currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        // 사용자의 스트릭 문서 가져오기
        const userStatsCollection = firestore().collection('userStats');
        const streakDoc = await userStatsCollection.doc(user.uid).get();

        if (streakDoc.exists) {
            const data = streakDoc.data();
            if (!data) {
                return {
                    currentStreak: 0,
                    longestStreak: 0,
                    totalCompletions: 0,
                };
            }

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
        const user = auth().currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        // 날짜 범위 설정
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        // 모듈러 API 방식으로 컬렉션 참조
        const tasksCollection = firestore().collection('tasks');
        const querySnapshot = await tasksCollection
            .where('userId', '==', user.uid)
            .where('status', '==', 'completed')
            .where('completedAt', '>=', startDate)
            .where('completedAt', '<=', endDate)
            .get();

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
        const user = auth().currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        // 시작 날짜 계산 (n주 전)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (weeks * 7));
        startDate.setHours(0, 0, 0, 0);

        // 모듈러 API 방식으로 컬렉션 참조
        const tasksCollection = firestore().collection('tasks');
        const querySnapshot = await tasksCollection
            .where('userId', '==', user.uid)
            .where('status', '==', 'completed')
            .where('completedAt', '>=', startDate)
            .get();

        // 날짜별 기여 집계
        const contributionMap = new Map<string, number>();

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Firestore의 timestamp 또는 일반 Date 객체 모두 처리
            // data.completedAt이 객체인지 확인하고 안전하게 Date로 변환
            let completedDate: Date;

            if (data.completedAt) {
                // Firestore Timestamp 객체인 경우 toDate() 메서드 사용
                if (typeof data.completedAt.toDate === 'function') {
                    completedDate = data.completedAt.toDate();
                }
                // 일반 Date 객체 또는 문자열인 경우
                else {
                    completedDate = new Date(data.completedAt);
                }
            } else {
                // completedAt이 없는 경우 현재 시간 사용
                completedDate = new Date();
            }

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

/**
 * 루틴 완료 상태가 변경될 때 Firebase의 기존 데이터를 삭제합니다.
 * 이렇게 하면 완료 → 미완료로 변경 시 기여 그래프에서 삭제됩니다.
 * 
 * Note: Firebase v22에서는 batch() 대신 writeBatch()를 사용해야 합니다.
 * 현재 버전에서는 batch()를 사용하되, v22로 업그레이드 시 writeBatch()로 변경해야 합니다.
 */
export const removeCompletionData = async (routineId: string, date: Date): Promise<boolean> => {
    try {
        console.log(`Firebase 기여 데이터 삭제 시작: 루틴 ${routineId}, 날짜 ${date.toISOString()}`);

        const user = auth().currentUser;
        if (!user) {
            console.log('인증된 사용자가 없습니다.');
            return false;
        }

        // 해당 날짜의 데이터 가져오기
        const todayDate = new Date(date);
        todayDate.setHours(0, 0, 0, 0);
        const tomorrowDate = new Date(todayDate);
        tomorrowDate.setDate(todayDate.getDate() + 1);

        const todayFormatted = todayDate.toISOString().split('T')[0];
        console.log(`삭제할 데이터 날짜: ${todayFormatted}`);

        try {
            // Firebase에서 해당하는 모든 문서 조회
            const tasksCollection = firestore().collection('tasks');

            console.log(`쿼리 조건: userId=${user.uid}, type=routine, dateString=${todayFormatted}`);
            const querySnapshot = await tasksCollection
                .where('userId', '==', user.uid)
                .where('type', '==', 'routine')
                .where('dateString', '==', todayFormatted)
                .get();

            console.log(`조회된 문서 수: ${querySnapshot.size}`);

            // 문서가 없으면 처리 필요 없음
            if (querySnapshot.empty) {
                console.log('삭제할 문서가 없습니다.');
                return false;
            }

            // 문서가 있으면 삭제 (v21에서는 batch, v22에서는 writeBatch 사용)
            // Firebase v22로 업그레이드 시 아래 줄을 교체:
            // const batch = firestore().writeBatch();
            const batch = firestore().batch();
            let count = 0;

            querySnapshot.forEach((doc) => {
                console.log(`삭제할 문서 ID: ${doc.id}`);
                batch.delete(doc.ref);
                count++;
            });

            // 일괄 삭제 실행
            await batch.commit();
            console.log(`${count}개의 문서 삭제 완료`);

            // 문서 삭제 후 기여도 레벨 업데이트
            await updateContributionLevel(date);
            console.log('기여도 레벨 업데이트 완료');

            return true;
        } catch (error) {
            console.error('문서 삭제 중 오류:', error);
            return false;
        }
    } catch (error) {
        console.error('루틴 완료 데이터 삭제 중 오류:', error);
        return false;
    }
};

/**
 * 사용자의 특정 날짜 기여도 레벨을 업데이트합니다.
 * 작업 완료 시 호출되며, 완료 횟수에 따라 색상 레벨(0-4)이 결정됩니다.
 * 
 * @param date 업데이트할 날짜 (기본값: 오늘)
 * @returns 업데이트 성공 여부
 */
export const updateContributionLevel = async (date: Date = new Date()): Promise<boolean> => {
    try {
        const user = auth().currentUser;
        if (!user) {
            console.log('인증된 사용자가 없습니다.');
            return false;
        }

        // 날짜 형식 변환 (YYYY-MM-DD)
        const dateString = date.toISOString().split('T')[0];
        console.log(`날짜 ${dateString}의 기여도 레벨 업데이트 시작`);

        // 해당 날짜의 완료된 작업 수 가져오기
        const completedCount = await getContributionsForDate(date);
        console.log(`완료된 작업 수: ${completedCount}`);

        // 레벨 계산 (0: 없음, 1-4: 완료 개수에 따른 색상 강도)
        let level = 0;
        if (completedCount === 1) level = 1;
        else if (completedCount <= 3) level = 2;
        else if (completedCount <= 6) level = 3;
        else level = 4;

        console.log(`계산된 색상 레벨: ${level}`);

        // userContributions/{userId}/dates/{dateString} 문서 업데이트 또는 생성
        const userContribRef = firestore()
            .collection('userContributions')
            .doc(user.uid)
            .collection('dates')
            .doc(dateString);

        // 문서 존재 여부 확인
        const docSnapshot = await userContribRef.get();

        if (docSnapshot.exists) {
            // 기존 문서 업데이트
            await userContribRef.update({
                count: completedCount,
                level: level,
                lastUpdated: firestore.FieldValue.serverTimestamp()
            });
            console.log(`기존 기여도 문서 업데이트 완료`);
        } else {
            // 새 문서 생성
            await userContribRef.set({
                count: completedCount,
                level: level,
                date: dateString,
                lastUpdated: firestore.FieldValue.serverTimestamp()
            });
            console.log(`새 기여도 문서 생성 완료`);
        }

        return true;
    } catch (error) {
        console.error('기여도 레벨 업데이트 중 오류:', error);
        return false;
    }
};

/**
 * 특정 기간의 기여도 레벨 정보를 가져옵니다.
 * 기여도 그래프를 표시하는 데 사용됩니다.
 * 
 * @param startDate 시작 날짜
 * @param endDate 종료 날짜 (기본값: 오늘)
 * @returns 날짜별 기여도 레벨 정보 객체
 */
export const getContributionLevels = async (
    startDate: Date,
    endDate: Date = new Date()
): Promise<{ [date: string]: { count: number; level: number } }> => {
    try {
        const user = auth().currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        // 날짜 형식 변환
        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = endDate.toISOString().split('T')[0];

        console.log(`${startDateString}부터 ${endDateString}까지의 기여도 데이터 조회 중`);

        // userContributions/{userId}/dates 컬렉션에서 해당 기간의 문서 조회
        const contributionsRef = firestore()
            .collection('userContributions')
            .doc(user.uid)
            .collection('dates');

        const query = contributionsRef
            .where('date', '>=', startDateString)
            .where('date', '<=', endDateString)
            .orderBy('date');

        const querySnapshot = await query.get();

        // 결과 객체 초기화
        const contributions: { [date: string]: { count: number; level: number } } = {};

        // 쿼리 결과 처리
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            contributions[doc.id] = {
                count: data.count || 0,
                level: data.level || 0
            };
        });

        console.log(`${querySnapshot.size}개의 기여도 데이터 조회 완료`);
        return contributions;
    } catch (error) {
        console.error('기여도 레벨 조회 중 오류:', error);
        return {};
    }
};

/**
 * 일정 기간의 기여도 데이터 변경을 실시간으로 감지하는 리스너를 설정합니다.
 * 기여도 그래프 컴포넌트에서 사용하기 적합합니다.
 * 
 * @param startDate 시작 날짜
 * @param endDate 종료 날짜 (기본값: 오늘)
 * @param callback 데이터 변경 시 호출될 콜백 함수
 * @returns 리스너 구독 해제 함수
 */
export const subscribeToContributionLevels = (
    startDate: Date,
    endDate: Date = new Date(),
    callback: (contributions: { [date: string]: { count: number; level: number } }) => void
): (() => void) => {
    try {
        const user = auth().currentUser;
        if (!user) {
            console.log('인증된 사용자가 없습니다.');
            return () => { };
        }

        // 날짜 형식 변환
        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = endDate.toISOString().split('T')[0];

        console.log(`${startDateString}부터 ${endDateString}까지의 기여도 변경 구독 시작`);

        // userContributions/{userId}/dates 컬렉션 리스너 설정
        const contributionsRef = firestore()
            .collection('userContributions')
            .doc(user.uid)
            .collection('dates')
            .where('date', '>=', startDateString)
            .where('date', '<=', endDateString)
            .orderBy('date');

        // 실시간 리스너 설정
        const unsubscribe = contributionsRef.onSnapshot((querySnapshot) => {
            const contributions: { [date: string]: { count: number; level: number } } = {};

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                contributions[doc.id] = {
                    count: data.count || 0,
                    level: data.level || 0
                };
            });

            callback(contributions);
            console.log(`기여도 기간 데이터 변경 감지: ${querySnapshot.size}개의 기록`);
        }, (error) => {
            console.error('기여도 기간 데이터 구독 오류:', error);
        });

        return unsubscribe;
    } catch (error) {
        console.error('기여도 기간 구독 설정 중 오류:', error);
        return () => { };
    }
};

/**
 * 기여도 데이터 변경을 실시간으로 감지하는 리스너를 설정합니다.
 * 데이터 변경 시 콜백 함수를 호출하여 UI를 즉시 갱신합니다.
 * 
 * @param date 감지할 날짜 (기본값: 오늘)
 * @param callback 데이터 변경 시 호출될 콜백 함수
 * @returns 리스너 구독 해제 함수
 */
export const subscribeToContributionUpdates = (
    date: Date = new Date(),
    callback: (level: number, count: number) => void
): (() => void) => {
    try {
        const user = auth().currentUser;
        if (!user) {
            console.log('인증된 사용자가 없습니다.');
            return () => { };
        }

        // 날짜 형식 변환 (YYYY-MM-DD)
        const dateString = date.toISOString().split('T')[0];
        console.log(`날짜 ${dateString}의 기여도 변경 구독 시작`);

        // userContributions/{userId}/dates/{dateString} 문서 리스너 설정
        const userContribRef = firestore()
            .collection('userContributions')
            .doc(user.uid)
            .collection('dates')
            .doc(dateString);

        // 실시간 리스너 설정
        const unsubscribe = userContribRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                callback(data?.level || 0, data?.count || 0);
                console.log(`기여도 데이터 변경 감지: 레벨 ${data?.level}, 카운트 ${data?.count}`);
            } else {
                callback(0, 0);
                console.log('기여도 데이터 없음, 기본값 사용');
            }
        }, (error) => {
            console.error('기여도 데이터 구독 오류:', error);
        });

        return unsubscribe;
    } catch (error) {
        console.error('기여도 구독 설정 중 오류:', error);
        return () => { };
    }
}; 