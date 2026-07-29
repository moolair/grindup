import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import useTranslation from '../../hooks/useTranslation';
import { useFocusEffect } from '@react-navigation/native';
import { getWeeklyContributions, getStreakInfo } from '../../services/firebase/contributions';
import { getRoutines } from '../../services/routineService';

const AnalyticsScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation('analytics');

  const [totalTasks, setTotalTasks] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [weeklyData, setWeeklyData] = useState<{ date: string; count: number; label: string }[]>([]);
  const [completionRate, setCompletionRate] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const loadAnalytics = async () => {
        try {
          // 스트릭 및 완료 통계
          const streakInfo = await getStreakInfo();
          setCompletedCount(streakInfo.totalCompletions);
          setStreakDays(streakInfo.currentStreak);

          // 실제 루틴 개수를 totalTasks로 사용
          const routines = await getRoutines();
          setTotalTasks(routines.length);

          // 주간 기여 데이터 (최근 4주)
          const contributions = await getWeeklyContributions(4);

          // 로컬 날짜를 YYYY-MM-DD로 변환
          const toLocalDate = (d: Date) => {
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          };

          // 최근 7일 데이터 추출
          const today = new Date();
          const last7Days: typeof weeklyData = [];
          const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

          for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = toLocalDate(d);
            const found = contributions.find(c => c.date === dateStr);
            last7Days.push({
              date: dateStr,
              count: found?.count || 0,
              label: dayLabels[d.getDay()],
            });
          }
          setWeeklyData(last7Days);

          // 완료율 = 오늘 완료 / 전체 루틴 수
          const todayStr = toLocalDate(today);
          const todayContrib = contributions.find(c => c.date === todayStr);
          const todayCompleted = todayContrib?.count || 0;
          const rate = routines.length > 0
            ? Math.round((todayCompleted / routines.length) * 100)
            : 0;
          setCompletionRate(Math.min(rate, 100));
        } catch (error) {
          console.error('Analytics 데이터 로드 오류:', error);
        }
      };
      loadAnalytics();
    }, [])
  );

  const maxCount = Math.max(...weeklyData.map(d => d.count), 1);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.content.primary }]}>{t('title')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.content.primary }]}>{t('workStats')}</Text>

          {/* 완료율 차트 */}
          <View style={[styles.chartContainer, { backgroundColor: theme.colors.background.secondary }]}>
            <Text style={[styles.rateLabel, { color: theme.colors.content.secondary }]}>
              {t('completionRateChart')}
            </Text>
            <Text style={[styles.rateNumber, { color: theme.colors.ui.primary }]}>
              {completionRate}%
            </Text>
            <View style={[styles.rateBarBackground, { backgroundColor: theme.colors.border.light }]}>
              <View
                style={[
                  styles.rateBarFill,
                  { width: `${completionRate}%`, backgroundColor: theme.colors.ui.primary },
                ]}
              />
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.ui.primary }]}>{completedCount}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.content.secondary }]}>{t('stats.completed')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.ui.primary }]}>{streakDays}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.content.secondary }]}>{t('stats.streakDays')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.ui.primary }]}>{totalTasks}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.content.secondary }]}>{t('stats.totalTasks')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.content.primary }]}>{t('weeklyReport')}</Text>

          {/* 주간 막대 차트 */}
          <View style={[styles.chartContainer, { backgroundColor: theme.colors.background.secondary }]}>
            <View style={styles.barChart}>
              {weeklyData.map((day, index) => (
                <View key={day.date} style={styles.barItem}>
                  <Text style={[styles.barCount, { color: theme.colors.content.secondary }]}>
                    {day.count > 0 ? day.count : ''}
                  </Text>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: day.count > 0 ? `${(day.count / maxCount) * 100}%` : 4,
                          backgroundColor: day.count > 0 ? theme.colors.ui.primary : theme.colors.border.light,
                          borderRadius: 4,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, { color: theme.colors.content.secondary }]}>
                    {day.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  rateLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  rateNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  rateBarBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  rateBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    marginTop: 4,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
  },
  barCount: {
    fontSize: 12,
    marginBottom: 4,
    height: 16,
  },
  barWrapper: {
    flex: 1,
    width: '60%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    minHeight: 4,
  },
  barLabel: {
    fontSize: 11,
    marginTop: 6,
  },
});

export default AnalyticsScreen;
