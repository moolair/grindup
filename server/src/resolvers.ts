import { GraphQLError } from 'graphql';
import type { GatewayContext } from './context.js';
import {
    FirestoreError,
    documentId,
    getDocument,
    listDocuments,
    readInt,
    readString,
} from './firestore.js';

interface Habit {
    id: string;
    name: string;
    streak: number;
}

const unauthenticated = () =>
    new GraphQLError('Firebase ID 토큰이 필요합니다.', {
        extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
    });

export const resolvers = {
    Query: {
        habits: async (_parent: unknown, _args: unknown, ctx: GatewayContext): Promise<Habit[]> => {
            if (!ctx.idToken || !ctx.uid) {
                throw unauthenticated();
            }

            try {
                // 습관 목록과 사용자 통계를 병렬 조회.
                // userStats 는 streak 폴백용 보조 데이터라, 읽기가 막혀도(보안 규칙 등)
                // 목록 자체는 내려가야 합니다. 그래서 실패를 삼키고 0 으로 처리합니다.
                const [habitDocs, statsDoc] = await Promise.all([
                    listDocuments(`habits/${ctx.uid}/items`, ctx.idToken),
                    getDocument(`userStats/${ctx.uid}`, ctx.idToken).catch(statsError => {
                        console.warn('[habits] userStats 조회 실패, streak 은 0 으로 처리합니다:', statsError);
                        return null;
                    }),
                ]);

                const userStreak = readInt(statsDoc?.fields?.currentStreak) ?? 0;
                console.log(
                    `[habits] ${habitDocs.length}개 반환 / userStats ${statsDoc ? '조회됨' : '없음'} / streak=${userStreak}`
                );

                return habitDocs
                    .map(doc => {
                        const id = documentId(doc.name);
                        return {
                            id,
                            name: readString(doc.fields?.name) ?? id,
                            // 루틴별 스트릭이 있으면 그걸 쓰고, 없으면 사용자 단위 값으로 폴백
                            streak: readInt(doc.fields?.currentStreak) ?? userStreak,
                            order: readInt(doc.fields?.order) ?? 0,
                        };
                    })
                    // 앱과 동일하게 order 기준 정렬
                    .sort((a, b) => a.order - b.order)
                    .map(({ id, name, streak }) => ({ id, name, streak }));
            } catch (error) {
                if (error instanceof FirestoreError) {
                    // 401/403 은 대개 만료된 토큰 또는 보안 규칙 거부
                    const code = error.status === 401 || error.status === 403
                        ? 'FORBIDDEN'
                        : 'DOWNSTREAM_ERROR';
                    throw new GraphQLError(error.message, {
                        extensions: { code, firestoreStatus: error.status },
                    });
                }
                throw error;
            }
        },
    },
};
