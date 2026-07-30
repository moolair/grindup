import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { useTheme } from '../../theme/ThemeProvider';
import useTranslation from '../../hooks/useTranslation';
import { GET_HABITS, HabitsQueryData } from '../../graphql/queries';

/**
 * GraphQL 게이트웨이에서 받은 습관 요약을 대시보드 상단에 한 줄로 보여줍니다.
 *
 * 왜 행마다 붙이지 않는가:
 *   streak 은 userStats/{uid}.currentStreak — 사용자당 하나뿐인 값이라
 *   루틴별로 다르지 않습니다. 루틴 카드마다 붙이면 모든 카드가 같은 숫자를
 *   보여주게 되므로, 사용자 단위 값은 사용자 단위 자리에만 둡니다.
 *
 * 게이트웨이가 꺼져 있어도 대시보드는 멀쩡해야 하므로 errorPolicy: 'ignore' 로
 * 두고, 데이터가 없으면 아무것도 렌더링하지 않습니다.
 */
const StreakSummary = () => {
    const { theme } = useTheme();
    const { t } = useTranslation('dashboard');

    const { data } = useQuery<HabitsQueryData>(GET_HABITS, {
        // 실패해도 화면 전체를 깨뜨리지 않고 조용히 사라집니다
        errorPolicy: 'ignore',
    });

    const habits = data?.habits ?? [];

    // 습관이 없거나 서버에 닿지 못한 경우 스트립 자체를 숨깁니다
    if (habits.length === 0) {
        return null;
    }

    const streak = Math.max(...habits.map(habit => habit.streak));

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface.secondary }]}>
            <Text style={[styles.value, { color: theme.colors.ui.primary }]}>
                {streak}
            </Text>
            <Text style={[styles.label, { color: theme.colors.content.secondary }]}>
                {t('streak.summaryLabel', { habits: habits.length })}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'baseline',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    value: {
        fontSize: 26,
        fontWeight: 'bold',
        marginRight: 8,
    },
    label: {
        fontSize: 13,
        flexShrink: 1,
    },
});

export default StreakSummary;
