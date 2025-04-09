import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { getWeeklyContributions } from '../../services/firebase/contributions';
import useTranslation from '../../hooks/useTranslation';

interface ContributionGraphProps {
    numWeeks?: number;
    onDayPress?: (date: Date, count: number) => void;
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({
    numWeeks = 52, // 기본값을 1년으로 변경
    onDayPress = () => { },
}) => {
    const { t, i18n, currentLanguage } = useTranslation('dashboard');
    const [weekData, setWeekData] = useState<Array<Array<{ date: Date; count: number }>>>([]);
    const [monthLabels, setMonthLabels] = useState<Array<{ month: string; position: number }>>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 스크롤뷰 ref 생성
    const monthScrollRef = useRef<ScrollView>(null);
    const graphScrollRef = useRef<ScrollView>(null);

    // 화면 너비 구하기
    const screenWidth = Dimensions.get('window').width;
    // 요일 라벨 영역 너비와 패딩 등을 고려한 그래프 영역 너비
    const graphAreaWidth = screenWidth - 60; // 여백 및 요일 라벨 공간 고려

    // 요일 라벨 (월요일부터 시작) - 메모이제이션
    const dayLabels = useMemo(() => [
        t('contributionGraph.weekdays.mon'),
        t('contributionGraph.weekdays.tue'),
        t('contributionGraph.weekdays.wed'),
        t('contributionGraph.weekdays.thu'),
        t('contributionGraph.weekdays.fri'),
        t('contributionGraph.weekdays.sat'),
        t('contributionGraph.weekdays.sun')
    ], [t]);

    // 월 이름 - 메모이제이션
    const monthNames = useMemo(() => [
        t('contributionGraph.months.jan'),
        t('contributionGraph.months.feb'),
        t('contributionGraph.months.mar'),
        t('contributionGraph.months.apr'),
        t('contributionGraph.months.may'),
        t('contributionGraph.months.jun'),
        t('contributionGraph.months.jul'),
        t('contributionGraph.months.aug'),
        t('contributionGraph.months.sep'),
        t('contributionGraph.months.oct'),
        t('contributionGraph.months.nov'),
        t('contributionGraph.months.dec')
    ], [t]);

    // 언어 변경 또는 numWeeks 변경 시 데이터 다시 가져오기
    useEffect(() => {
        fetchContributionData();
    }, [numWeeks, currentLanguage, t]);

    // Firebase에서 기여 데이터 가져오기
    const fetchContributionData = async () => {
        try {
            setLoading(true);
            // Firebase에서 기여도 데이터 가져오기
            const contributionData = await getWeeklyContributions(numWeeks);

            // 데이터 맵 생성 (날짜 -> 카운트)
            const contributionMap = new Map<string, number>();
            contributionData.forEach(item => {
                contributionMap.set(item.date, item.count);
            });

            generateGraphData(contributionMap);
        } catch (error) {
            console.error('Error fetching contribution data:', error);
            // 오류 발생 시 빈 데이터로 그래프 생성
            generateGraphData(new Map());
        } finally {
            setLoading(false);
        }
    };

    // 그래프 데이터 생성
    const generateGraphData = (contributionMap: Map<string, number>) => {
        const today = new Date();
        const weeks: Array<Array<{ date: Date; count: number }>> = [];
        const months: Array<{ month: string; position: number }> = [];

        // 현재 날짜가 속한 주의 일요일을 계산 (주의 마지막 날)
        const currentDay = today.getDay(); // 0: 일, 1: 월, ..., 6: 토
        const daysToSunday = 7 - currentDay === 7 ? 0 : 7 - currentDay;

        // 기준 날짜 (현재 주의 일요일)
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + daysToSunday);

        // 월 라벨 관리를 위한 변수
        let currentMonth = -1;
        let lastMonthLabelPosition = -1;

        // 주 단위로 데이터 생성
        for (let weekIndex = 0; weekIndex < numWeeks; weekIndex++) {
            const week: Array<{ date: Date; count: number }> = [];

            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                // 현재 주의 일요일(endDate)에서 거꾸로 계산
                // 일요일부터 월요일 순으로 계산하기 위해 6-dayIndex 사용
                const daysAgo = weekIndex * 7 + (6 - dayIndex);
                const date = new Date(endDate);
                date.setDate(endDate.getDate() - daysAgo);

                // 날짜 문자열로 변환 (YYYY-MM-DD)
                const dateString = date.toISOString().split('T')[0];

                // 해당 날짜의 기여도 카운트 가져오기
                const count = contributionMap.get(dateString) || 0;

                week.push({ date, count });

                // 월의 첫날인 경우 월 라벨 추가
                const month = date.getMonth();
                const day = date.getDate();

                // 월이 바뀌고 월의 1일인 경우 라벨 추가
                if ((month !== currentMonth && day === 1) || (month !== currentMonth && weekIndex === 0)) {
                    currentMonth = month;

                    // 라벨이 겹치지 않도록 최소 간격 확인 (4주 간격)
                    const position = numWeeks - 1 - weekIndex;
                    if (lastMonthLabelPosition === -1 || position <= lastMonthLabelPosition - 4) {
                        months.push({
                            month: getMonthLabel(month),
                            position: position
                        });
                        lastMonthLabelPosition = position;
                    }
                }
            }

            weeks.push(week);
        }

        // 날짜가 가장 오래된 것부터 최신 순으로 정렬
        weeks.reverse();
        setWeekData(weeks);
        setMonthLabels(months);
    };

    // 월 이름 가져오기
    const getMonthLabel = (month: number): string => {
        return monthNames[month];
    };

    // Determine color based on count
    const getColorForCount = (count: number) => {
        if (count === 0) return '#ebedf0';
        if (count === 1) return '#c6e48b';
        if (count === 2) return '#7bc96f';
        if (count === 3) return '#239a3b';
        return '#196127';
    };

    // 날짜 포맷팅
    const formatDate = (date: Date): string => {
        // 언어에 따라 다른 날짜 형식 적용
        if (currentLanguage === 'en') {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        } else {
            return `${date.getFullYear()}${t('contributionGraph.year')} ${date.getMonth() + 1}${t('contributionGraph.month')} ${date.getDate()}${t('contributionGraph.day')}`;
        }
    };

    // 박스 크기 및 마진 계산
    const BOX_SIZE = 10;
    const BOX_MARGIN = 2;
    const WEEK_WIDTH = BOX_SIZE + BOX_MARGIN * 2;

    // 전체 그래프 너비 계산 (주 개수 × 주 너비)
    const totalGraphWidth = numWeeks * WEEK_WIDTH;

    // 스크롤 중인지 추적하는 상태 추가
    const [isScrolling, setIsScrolling] = useState<{ month: boolean; graph: boolean }>({
        month: false,
        graph: false
    });

    // 스크롤 이벤트 동기화
    const handleMonthScroll = (event: any) => {
        if (isScrolling.graph) return; // 그래프 스크롤 중일 때는 무시

        try {
            const offsetX = event.nativeEvent.contentOffset.x;
            setIsScrolling(prev => ({ ...prev, month: true }));
            graphScrollRef.current?.scrollTo({ x: offsetX, animated: false });

            // 짧은 시간 후 스크롤 상태 리셋
            setTimeout(() => {
                setIsScrolling(prev => ({ ...prev, month: false }));
            }, 50);
        } catch (error) {
            console.log('Month scroll sync error:', error);
            setIsScrolling(prev => ({ ...prev, month: false }));
        }
    };

    const handleGraphScroll = (event: any) => {
        if (isScrolling.month) return; // 월 스크롤 중일 때는 무시

        try {
            const offsetX = event.nativeEvent.contentOffset.x;
            setIsScrolling(prev => ({ ...prev, graph: true }));
            monthScrollRef.current?.scrollTo({ x: offsetX, animated: false });

            // 짧은 시간 후 스크롤 상태 리셋
            setTimeout(() => {
                setIsScrolling(prev => ({ ...prev, graph: false }));
            }, 50);
        } catch (error) {
            console.log('Graph scroll sync error:', error);
            setIsScrolling(prev => ({ ...prev, graph: false }));
        }
    };

    return (
        <View style={styles.container}>
            {/* 월 라벨 */}
            <View style={styles.monthLabelsContainer}>
                <View style={styles.monthLabelSpacer} />
                <ScrollView
                    ref={monthScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.monthLabelsScrollContent,
                        { width: totalGraphWidth }
                    ]}
                    onScroll={handleMonthScroll}
                    scrollEventThrottle={16}
                    testID="month-scroll"
                >
                    {monthLabels.map((item, index) => (
                        <Text
                            key={`month-${index}`}
                            style={[
                                styles.monthLabel,
                                { left: item.position * WEEK_WIDTH }
                            ]}
                        >
                            {item.month}
                        </Text>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.graphContainer}>
                {/* 요일 라벨 */}
                <View style={styles.dayLabelsContainer}>
                    {dayLabels.map((day, index) => (
                        <Text key={`day-${index}`} style={styles.dayLabel}>
                            {day}
                        </Text>
                    ))}
                </View>

                {/* 그래프 */}
                <ScrollView
                    ref={graphScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.weeksScrollContent,
                        { width: totalGraphWidth }
                    ]}
                    onScroll={handleGraphScroll}
                    scrollEventThrottle={16}
                    testID="graph-scroll"
                >
                    <View style={styles.weeksContainer}>
                        {weekData.map((week, weekIndex) => (
                            <View key={`week-${weekIndex}`} style={styles.weekContainer}>
                                {week.map((day, dayIndex) => (
                                    <TouchableOpacity
                                        key={`day-${dayIndex}`}
                                        style={[
                                            styles.dayBox,
                                            {
                                                backgroundColor: getColorForCount(day.count),
                                                width: BOX_SIZE,
                                                height: BOX_SIZE,
                                                margin: BOX_MARGIN
                                            }
                                        ]}
                                        onPress={() => onDayPress(day.date, day.count)}
                                        accessibilityLabel={`${formatDate(day.date)}: ${day.count}${t('contributionGraph.activities')}`}
                                    />
                                ))}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>

            <View style={styles.legend}>
                <Text style={styles.legendText}>{t('contributionGraph.less')}</Text>
                <View style={[styles.legendBox, { backgroundColor: '#ebedf0' }]} />
                <View style={[styles.legendBox, { backgroundColor: '#c6e48b' }]} />
                <View style={[styles.legendBox, { backgroundColor: '#7bc96f' }]} />
                <View style={[styles.legendBox, { backgroundColor: '#239a3b' }]} />
                <View style={[styles.legendBox, { backgroundColor: '#196127' }]} />
                <Text style={styles.legendText}>{t('contributionGraph.more')}</Text>
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
    monthLabelsContainer: {
        flexDirection: 'row',
        marginBottom: 4,
        height: 20,
    },
    monthLabelSpacer: {
        width: 24, // 요일 라벨 영역 너비
    },
    monthLabelsScrollContent: {
        position: 'relative',
    },
    monthLabels: {
        flex: 1,
        height: 20,
        position: 'relative',
    },
    monthLabel: {
        position: 'absolute',
        fontSize: 10,
        color: '#666',
        top: 0,
    },
    graphContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    dayLabelsContainer: {
        width: 24,
        marginRight: 0,
    },
    dayLabel: {
        fontSize: 10,
        color: '#666',
        height: 14,
        textAlign: 'center',
    },
    weeksScrollContent: {
        flexDirection: 'row',
    },
    weeksContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    weekContainer: {
        flexDirection: 'column',
        width: 14, // 박스(10) + 마진(2*2)
    },
    dayBox: {
        borderRadius: 2,
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