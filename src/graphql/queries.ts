import { gql } from '@apollo/client';

export interface HabitNode {
    id: string;
    name: string;
    streak: number;
}

export interface HabitsQueryData {
    habits: HabitNode[];
}

/** 게이트웨이가 노출하는 단일 쿼리 */
export const GET_HABITS = gql`
    query Habits {
        habits {
            id
            name
            streak
        }
    }
`;
