import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';

const AnalyticsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>분석</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>작업 통계</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>작업 완료율 차트</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>총 작업</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>완료</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>진행 중</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주간 리포트</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>주간 작업 차트</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.NEUTRAL.WHITE,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.NEUTRAL.BLACK,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.NEUTRAL.BLACK,
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: COLORS.NEUTRAL.LIGHT_GRAY,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: COLORS.NEUTRAL.DARK_GRAY,
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
    color: COLORS.PRIMARY[600],
  },
  statLabel: {
    color: COLORS.NEUTRAL.DARK_GRAY,
    marginTop: 4,
  },
});

export default AnalyticsScreen; 