import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import useTranslation from '../../hooks/useTranslation';

const AnalyticsScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation('analytics');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.content.primary }]}>{t('title')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.content.primary }]}>{t('workStats')}</Text>
          <View style={[styles.chartPlaceholder, { backgroundColor: theme.colors.background.secondary }]}>
            <Text style={[styles.placeholderText, { color: theme.colors.content.secondary }]}>{t('completionRateChart')}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.ui.primary }]}>12</Text>
              <Text style={[styles.statLabel, { color: theme.colors.content.secondary }]}>{t('stats.totalTasks')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.ui.primary }]}>8</Text>
              <Text style={[styles.statLabel, { color: theme.colors.content.secondary }]}>{t('stats.completed')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.ui.primary }]}>4</Text>
              <Text style={[styles.statLabel, { color: theme.colors.content.secondary }]}>{t('stats.inProgress')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.content.primary }]}>{t('weeklyReport')}</Text>
          <View style={[styles.chartPlaceholder, { backgroundColor: theme.colors.background.secondary }]}>
            <Text style={[styles.placeholderText, { color: theme.colors.content.secondary }]}>{t('weeklyTaskChart')}</Text>
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