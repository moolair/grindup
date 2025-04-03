import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StreakCardProps {
    currentStreak: number;
    longestStreak: number;
}

const StreakCard: React.FC<StreakCardProps> = ({
    currentStreak = 0,
    longestStreak = 0
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title}>작업 스트릭</Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.streakItem}>
                        <Text style={styles.streakValue}>{currentStreak}</Text>
                        <Text style={styles.streakLabel}>현재 스트릭</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.streakItem}>
                        <Text style={styles.streakValue}>{longestStreak}</Text>
                        <Text style={styles.streakLabel}>최장 스트릭</Text>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        {currentStreak > 0
                            ? `${currentStreak}일 연속으로 작업을 완료했습니다!`
                            : '오늘 작업을 완료하고 스트릭을 시작하세요!'}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#3366FF',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-around',
    },
    streakItem: {
        alignItems: 'center',
        flex: 1,
    },
    streakValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3366FF',
    },
    streakLabel: {
        fontSize: 14,
        color: '#8395A7',
        marginTop: 4,
    },
    divider: {
        width: 1,
        backgroundColor: '#E4E9F2',
        marginHorizontal: 16,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#E4E9F2',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    footerText: {
        fontSize: 14,
        color: '#8395A7',
        textAlign: 'center',
    },
});

export default StreakCard; 