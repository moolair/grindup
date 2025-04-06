import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

const AnalyticsScreen = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.content.primary }]}>분석</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.content.primary }]}>작업 통계</Text>
          <View style={[styles.chartPlaceholder, { backgroundColor: theme.colors.background.secondary }]}>
            <Text style={[styles.placeholderText, { color: theme.colors.content.secondary }]}>작업 완료율 차트</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.ui.primary }]}>12</Text>
              <Text style={[styles.statLabel, { color: theme.colors.content.secondary }]}>총 작업</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.ui.primary }]}>8</Text>
              <Text style={[styles.statLabel, { color: theme.colors.content.secondary }]}>완료</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.ui.primary }]}>4</Text>
              <Text style={[styles.statLabel, { color: theme.colors.content.secondary }]}>진행 중</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.content.primary }]}>주간 리포트</Text>
          <View style={[styles.chartPlaceholder, { backgroundColor: theme.colors.background.secondary }]}>
            <Text style={[styles.placeholderText, { color: theme.colors.content.secondary }]}>주간 작업 차트</Text>
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
  chartPlaceholder: {
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
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
});

export default AnalyticsScreen; 