export const typeDefs = /* GraphQL */ `
  type Habit {
    "habits/{uid}/items 의 문서 ID. 앱의 Routine.id 와 동일합니다."
    id: ID!

    "루틴 제목 (앱의 Routine.title)"
    name: String!

    """
    연속 달성 일수.
    현재 GrindUp 은 루틴별 완료 이력을 저장하지 않으므로, habit 문서에
    currentStreak 이 없으면 userStats/{uid}.currentStreak (사용자 단위 값) 으로
    폴백합니다. 루틴별 스트릭을 도입하면 이 리졸버만 바뀝니다.
    """
    streak: Int!
  }

  type Query {
    "로그인한 사용자의 습관 목록. Authorization: Bearer <Firebase ID 토큰> 필요."
    habits: [Habit!]!
  }
`;
