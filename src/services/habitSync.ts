import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getRoutines } from './routineService';

/**
 * 루틴 정의를 Firestore 로 올립니다.
 *
 * 배경: 루틴의 이름/순서는 AsyncStorage(기기 로컬)에만 있어서 서버가 볼 수
 * 없습니다. GraphQL 게이트웨이가 habits 를 응답하려면 정의가 Firestore 에
 * 있어야 하므로, 이 함수가 habits/{uid}/items/{routineId} 로 미러링합니다.
 *
 * - AsyncStorage 가 여전히 원본(source of truth)이고, Firestore 쪽은 읽기용 사본입니다.
 * - merge: true 라서 나중에 루틴별 currentStreak 를 넣어도 덮어쓰지 않습니다.
 * - 로컬에서 삭제된 루틴은 Firestore 에서도 지웁니다.
 */
export const syncHabitsToFirestore = async (): Promise<number> => {
    const user = auth().currentUser;
    if (!user) {
        console.log('[habitSync] 인증된 사용자가 없어 동기화를 건너뜁니다.');
        return 0;
    }

    const routines = await getRoutines();
    const itemsRef = firestore()
        .collection('habits')
        .doc(user.uid)
        .collection('items');

    const existingSnapshot = await itemsRef.get();
    const batch = firestore().batch();
    const localIds = new Set(routines.map(routine => routine.id));

    routines.forEach(routine => {
        batch.set(
            itemsRef.doc(routine.id),
            {
                name: routine.title,
                order: routine.order ?? 0,
                updatedAt: firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
    });

    // 로컬에 더 이상 없는 습관 정리
    let removed = 0;
    existingSnapshot.docs.forEach(doc => {
        if (!localIds.has(doc.id)) {
            batch.delete(doc.ref);
            removed += 1;
        }
    });

    await batch.commit();
    console.log(`[habitSync] 습관 ${routines.length}개 동기화 완료 (삭제 ${removed}개)`);

    return routines.length;
};

export default syncHabitsToFirestore;
