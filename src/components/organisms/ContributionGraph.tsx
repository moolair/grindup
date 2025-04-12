import React, { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { getWeeklyContributions } from '../../services/firebase/contributions';
import useTranslation from '../../hooks/useTranslation';
import { useTheme } from '../../theme/ThemeProvider';

interface ContributionGraphProps {
    numWeeks?: number;
    onDayPress?: (date: Date, count: number) => void;
}

// ref를 통해 노출할 메서드 타입 정의
export interface ContributionGraphHandle {
    refreshData: () => Promise<void>;
}

// 박스 크기 및 마진 상수 정의 - 더 명확한 정렬을 위해 조정
const BOX_SIZE = 10;
const BOX_MARGIN = 2;
const WEEK_WIDTH = BOX_SIZE + BOX_MARGIN * 2;
const DAY_LABEL_WIDTH = 15;
const DAY_HEIGHT = BOX_SIZE + BOX_MARGIN * 2;

// 요일별로 정확히 같은 간격을 유지하기 위한 배열 생성 함수
const createArray = (length: number) => new Array(length).fill(0);

const ContributionGraph = forwardRef<ContributionGraphHandle, ContributionGraphProps>(({
    numWeeks = 52, // 기본값을 1년으로 변경
    onDayPress = () => { },
}, ref) => {
    const { t, i18n, currentLanguage } = useTranslation('dashboard');
    const { theme } = useTheme();
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

    // ref를 통해 메서드 노출
    useImperativeHandle(ref, () => ({
        refreshData: async () => {
            console.log('ContributionGraph: refreshData 호출됨');

            // 상태 초기화 (강제 리렌더링 유도)
            setWeekData([]);
            setMonthLabels([]);

            // 약간의 지연 후 데이터 다시 가져오기
            setTimeout(async () => {
                console.log('ContributionGraph: 데이터 새로고침 시작');
                await fetchContributionData();
                console.log('ContributionGraph: 데이터 새로고침 완료');
            }, 100);
        }
    }));

    // Firebase에서 기여 데이터 가져오기
    const fetchContributionData = async () => {
        try {
            console.log('ContributionGraph: Firebase 데이터 가져오기 시작');
            setLoading(true);

            // Firebase에서 기여도 데이터 가져오기
            const contributionData = await getWeeklyContributions(numWeeks);
            console.log(`ContributionGraph: ${contributionData.length}개의 기여 데이터 수신됨`);

            // 데이터 맵 생성 (날짜 -> 카운트)
            const contributionMap = new Map<string, number>();
            contributionData.forEach(item => {
                contributionMap.set(item.date, item.count);
                console.log(`날짜: ${item.date}, 카운트: ${item.count}`);
            });

            // 그래프 데이터 생성
            generateGraphData(contributionMap);
        } catch (error) {
            console.error('ContributionGraph: 데이터 가져오기 오류', error);
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

    // Determine color based on count - 테마에 맞게 색상 조정
    const getColorForCount = (count: number) => {
        if (count === 0) return theme.type === 'dark' ? '#2d333b' : '#ebedf0';
        if (count === 1) return theme.type === 'dark' ? '#0e4429' : '#c6e48b';
        if (count === 2) return theme.type === 'dark' ? '#006d32' : '#7bc96f';
        if (count === 3) return theme.type === 'dark' ? '#26a641' : '#239a3b';
        return theme.type === 'dark' ? '#39d353' : '#196127';
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

    // 전체 그래프 너비 계산 (주 개수 × 주 너비)
    const totalGraphWidth = numWeeks * WEEK_WIDTH;

    // 스크롤 중인지 추적하는 상태 추가
    const [isScrolling, setIsScrolling] = useState<{ month: boolean; graph: boolean }>({
        month: false,
        graph: false
    });

    // 데이터 로드 완료 후 최신 날짜(오른쪽 끝)로 스크롤하는 효과 추가
    useEffect(() => {
        if (weekData.length > 0 && !loading) {
            // 잠시 지연 후 스크롤 실행 (컴포넌트가 완전히 렌더링된 후)
            setTimeout(() => {
                const scrollToEnd = totalGraphWidth - graphAreaWidth;
                monthScrollRef.current?.scrollTo({ x: scrollToEnd, animated: false });
                graphScrollRef.current?.scrollTo({ x: scrollToEnd, animated: false });
            }, 100);
        }
    }, [weekData, loading]);

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
            {/* 전체 그래프 레이아웃 */}
            <View style={styles.graphLayout}>
                {/* 요일 라벨 */}
                <View style={styles.labelColumn}>
                    {/* 빈 공간 (월 라벨과 정렬) */}
                    <View style={styles.monthPadding} />

                    {/* 요일 라벨 */}
                    <View style={styles.dayLabels}>
                        {createArray(7).map((_, i) => (
                            <View key={`day-${i}`} style={styles.dayLabelContainer}>
                                <Text style={[styles.dayLabel, { color: theme.colors.content.secondary }]}>
                                    {dayLabels[i]}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 그래프 영역 (월 라벨 + 데이터 그리드) */}
                <View style={styles.graphContent}>
                    {/* 월 라벨 영역 */}
                    <View style={styles.monthContainer}>
                        <ScrollView
                            ref={monthScrollRef}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            scrollEventThrottle={16}
                            onScroll={handleMonthScroll}
                            style={styles.monthScrollView}
                            contentContainerStyle={{ width: totalGraphWidth }}
                        >
                            {monthLabels.map((item, index) => (
                                <Text
                                    key={`month-${index}`}
                                    style={[
                                        styles.monthLabel,
                                        {
                                            left: item.position * WEEK_WIDTH,
                                            color: theme.colors.content.secondary
                                        }
                                    ]}
                                >
                                    {item.month}
                                </Text>
                            ))}
                        </ScrollView>
                    </View>

                    {/* 그래프 스크롤 */}
                    <ScrollView
                        ref={graphScrollRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                        onScroll={handleGraphScroll}
                        style={styles.graphScrollView}
                    >
                        <View style={[styles.graph, { width: totalGraphWidth }]}>
                            {weekData.map((week, weekIndex) => (
                                <View key={`week-${weekIndex}`} style={styles.weekColumn}>
                                    {week.length > 0 && createArray(Math.min(week.length, 7)).map((_, dayIndex) => {
                                        // 안전하게 데이터 접근
                                        const day = week[dayIndex] || { date: new Date(), count: 0 };
                                        return (
                                            <View key={`box-${dayIndex}`} style={styles.dayBoxContainer}>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.dayBox,
                                                        {
                                                            backgroundColor: getColorForCount(day.count),
                                                        },
                                                    ]}
                                                    onPress={() => onDayPress(day.date, day.count)}
                                                >
                                                    {/* Empty view for touch target */}
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    })}
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>

            {/* 레전드 (색상 범례) */}
            <View style={styles.legend}>
                <Text style={[styles.legendText, { color: theme.colors.content.secondary }]}>
                    {t('contributionGraph.less')}
                </Text>
                <View style={styles.legendColors}>
                    {[0, 1, 2, 3, 4].map((level) => (
                        <View
                            key={`legend-${level}`}
                            style={[
                                styles.legendColorBox,
                                { backgroundColor: getColorForCount(level) },
                            ]}
                        />
                    ))}
                </View>
                <Text style={[styles.legendText, { color: theme.colors.content.secondary }]}>
                    {t('contributionGraph.more')}
                </Text>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 24,
        marginLeft: -6, // 왼쪽 마진 조정하여 제목과 정렬
    },
    graphLayout: {
        flexDirection: 'row',
    },
    labelColumn: {
        width: DAY_LABEL_WIDTH,
        marginRight: 3, // 마진 축소
    },
    monthPadding: {
        height: DAY_HEIGHT,
        justifyContent: 'center',
    },
    graphContent: {
        flex: 1,
    },
    monthContainer: {
        height: DAY_HEIGHT,
        justifyContent: 'center',
        marginBottom: 0, // 월 라벨과 그래프 사이 간격 제거
    },
    monthScrollView: {
        flex: 1,
        marginLeft: -2, // 왼쪽 마진 미세 조정
    },
    dayLabels: {
        height: 7 * DAY_HEIGHT,
        justifyContent: 'space-between',
        paddingTop: 0.5,
        paddingBottom: 0.5,
    },
    dayLabelContainer: {
        height: DAY_HEIGHT,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 1, // 패딩 축소
    },
    dayLabel: {
        fontSize: 9, // 폰트 크기 축소
        textAlign: 'right',
    },
    graphScrollView: {
        flex: 1,
        marginTop: 0, // 그래프 상단 여백 제거
    },
    graph: {
        flexDirection: 'row',
    },
    weekColumn: {
        width: WEEK_WIDTH,
        height: 7 * DAY_HEIGHT,
        justifyContent: 'space-between',
        paddingTop: 0.5,
        paddingBottom: 0.5,
    },
    dayBoxContainer: {
        height: DAY_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayBox: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderRadius: 2,
    },
    monthLabel: {
        position: 'absolute',
        fontSize: 9, // 폰트 크기 축소
        top: '50%',
        transform: [{ translateY: -4.5 }], // 조정
        left: 0, // 왼쪽 정렬
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 8,
        marginLeft: 6,
    },
    legendText: {
        fontSize: 10,
        marginHorizontal: 4,
    },
    legendColors: {
        flexDirection: 'row',
        marginHorizontal: 4,
    },
    legendColorBox: {
        width: 10,
        height: 10,
        marginHorizontal: 1,
        borderRadius: 2,
    },
});

export default ContributionGraph; 