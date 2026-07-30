import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import useTranslation from '../../hooks/useTranslation';
import { useTheme } from '../../theme/ThemeProvider';
import { ChevronLeftIcon } from '../../components/Icons';
import { GET_HABITS, HabitNode, HabitsQueryData } from '../../graphql/queries';
import { GRAPHQL_ENDPOINT } from '../../graphql/client';
import { syncHabitsToFirestore } from '../../services/habitSync';

/**
 * GraphQL 게이트웨이(server/)에서 습관 목록을 받아 렌더링하는 화면.
 *
 * 데이터 흐름:
 *   AsyncStorage 루틴 --(habitSync)--> Firestore habits/{uid}/items
 *     --(Firestore REST)--> Apollo Server --(GraphQL)--> useQuery
 *
 * 진입 시 먼저 동기화를 돌리는 이유: 루틴 정의의 원본은 여전히 기기 로컬이라
 * Firestore 사본이 최신이 아닐 수 있습니다. 동기화가 끝난 뒤 쿼리를 던집니다.
 */
const HabitsGraphQLScreen = () => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { t } = useTranslation('tasks');
    const { theme } = useTheme();
    const [syncing, setSyncing] = useState(true);

    const { data, loading, error, refetch } = useQuery<HabitsQueryData>(GET_HABITS, {
        // 동기화가 끝나기 전에는 쿼리를 보내지 않음
        skip: syncing,
        notifyOnNetworkStatusChange: true,
    });

    const runSync = useCallback(async () => {
        setSyncing(true);
        try {
            await syncHabitsToFirestore();
        } catch (syncError) {
            // 동기화 실패해도 쿼리는 시도합니다 (기존 Firestore 사본이 있을 수 있음)
            console.error('[HabitsGraphQL] 습관 동기화 실패:', syncError);
        } finally {
            setSyncing(false);
        }
    }, []);

    useEffect(() => {
        runSync();
    }, [runSync]);

    const handleRetry = useCallback(async () => {
        await runSync();
        await refetch();
    }, [runSync, refetch]);

    const renderHabit = useCallback(
        ({ item }: { item: HabitNode }) => (
            <View style={[styles.habitCard, { backgroundColor: theme.colors.surface.primary, borderColor: theme.colors.border.light }]}>
                <View style={styles.habitInfo}>
                    <Text style={[styles.habitName, { color: theme.colors.content.primary }]}>
                        {item.name}
                    </Text>
                    <Text style={[styles.habitId, { color: theme.colors.content.secondary }]}>
                        {item.id}
                    </Text>
                </View>
                <View style={[styles.streakBadge, { backgroundColor: theme.colors.ui.primary }]}>
                    <Text style={[styles.streakText, { color: theme.colors.content.inverse }]}>
                        {t('graphqlHabits.streak', { days: item.streak })}
                    </Text>
                </View>
            </View>
        ),
        [t, theme]
    );

    const renderBody = () => {
        if (syncing || (loading && !data)) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.colors.ui.primary} />
                    <Text style={[styles.statusText, { color: theme.colors.content.secondary }]}>
                        {syncing ? t('graphqlHabits.syncing') : t('graphqlHabits.loading')}
                    </Text>
                </View>
            );
        }

        if (error && !data) {
            return (
                <View style={styles.centered}>
                    <Text style={[styles.errorTitle, { color: theme.colors.ui.error }]}>
                        {t('graphqlHabits.errorTitle')}
                    </Text>
                    <Text style={[styles.errorDetail, { color: theme.colors.content.secondary }]}>
                        {error.message}
                    </Text>
                    <TouchableOpacity
                        style={[styles.retryButton, { backgroundColor: theme.colors.ui.primary }]}
                        onPress={handleRetry}
                    >
                        <Text style={[styles.retryText, { color: theme.colors.content.inverse }]}>
                            {t('graphqlHabits.retry')}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <FlatList
                data={data?.habits ?? []}
                keyExtractor={habit => habit.id}
                renderItem={renderHabit}
                contentContainerStyle={styles.listContent}
                refreshing={loading}
                onRefresh={handleRetry}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text style={[styles.statusText, { color: theme.colors.content.secondary }]}>
                            {t('graphqlHabits.empty')}
                        </Text>
                    </View>
                }
            />
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
            <View style={[styles.header, { borderBottomColor: theme.colors.border.light }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <ChevronLeftIcon size={24} color={theme.colors.content.primary} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.title, { color: theme.colors.content.primary }]}>
                        {t('graphqlHabits.title')}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.colors.content.secondary }]}>
                        {t('graphqlHabits.subtitle')}
                    </Text>
                </View>
            </View>

            {renderBody()}

            <View style={[styles.footer, { borderTopColor: theme.colors.border.light }]}>
                <Text style={[styles.endpointText, { color: theme.colors.content.secondary }]}>
                    {t('graphqlHabits.endpoint', { uri: GRAPHQL_ENDPOINT })}
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    listContent: {
        padding: 16,
    },
    habitCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    habitInfo: {
        flex: 1,
        marginRight: 12,
    },
    habitName: {
        fontSize: 16,
        fontWeight: '600',
    },
    habitId: {
        fontSize: 11,
        marginTop: 4,
    },
    streakBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    streakText: {
        fontSize: 13,
        fontWeight: '600',
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    statusText: {
        fontSize: 14,
        marginTop: 12,
        textAlign: 'center',
    },
    errorTitle: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    errorDetail: {
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        padding: 12,
        borderTopWidth: 1,
    },
    endpointText: {
        fontSize: 11,
        textAlign: 'center',
    },
});

export default HabitsGraphQLScreen;
