import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ContributionGraphProps {
    numWeeks?: number;
    onDayPress?: (date: Date, count: number) => void;
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({
    numWeeks = 8,
    onDayPress = () => { },
}) => {
    // Simplified implementation for now
    const renderDummyWeeks = () => {
        return Array(numWeeks)
            .fill(0)
            .map((_, weekIndex) => (
                <View key={`week-${weekIndex}`} style={styles.weekContainer}>
                    {Array(7)
                        .fill(0)
                        .map((_, dayIndex) => {
                            // Generate random contribution count for demonstration
                            const count = Math.floor(Math.random() * 5);
                            const date = new Date();
                            date.setDate(date.getDate() - (numWeeks * 7 - weekIndex * 7 - dayIndex));

                            return (
                                <TouchableOpacity
                                    key={`day-${dayIndex}`}
                                    style={[
                                        styles.dayBox,
                                        { backgroundColor: getColorForCount(count) }
                                    ]}
                                    onPress={() => onDayPress(date, count)}
                                />
                            );
                        })}
                </View>
            ));
    };

    // Determine color based on count
    const getColorForCount = (count: number) => {
        if (count === 0) return '#ebedf0';
        if (count === 1) return '#c6e48b';
        if (count === 2) return '#7bc96f';
        if (count === 3) return '#239a3b';
        return '#196127';
    };

    return (
        <View style={styles.container}>
            <View style={styles.graphContainer}>
                <View style={styles.weeksContainer}>
                    {renderDummyWeeks()}
                </View>
            </View>

            <View style={styles.legend}>
                <Text style={styles.legendText}>Less</Text>
                <View style={[styles.legendBox, { backgroundColor: '#ebedf0' }]} />
                <View style={[styles.legendBox, { backgroundColor: '#c6e48b' }]} />
                <View style={[styles.legendBox, { backgroundColor: '#7bc96f' }]} />
                <View style={[styles.legendBox, { backgroundColor: '#239a3b' }]} />
                <View style={[styles.legendBox, { backgroundColor: '#196127' }]} />
                <Text style={styles.legendText}>More</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 8,
    },
    graphContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    weeksContainer: {
        flexDirection: 'row',
    },
    weekContainer: {
        flexDirection: 'column',
        marginRight: 3,
    },
    dayBox: {
        width: 12,
        height: 12,
        borderRadius: 2,
        margin: 1,
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    legendText: {
        fontSize: 10,
        color: '#666',
        marginHorizontal: 4,
    },
    legendBox: {
        width: 10,
        height: 10,
        borderRadius: 2,
        marginHorizontal: 1,
    },
});

export default ContributionGraph; 