import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const TasksScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>내 작업</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <View style={[styles.filterTab, styles.activeFilterTab]}>
          <Text style={styles.activeFilterText}>전체</Text>
        </View>
        <View style={styles.filterTab}>
          <Text style={styles.filterText}>오늘</Text>
        </View>
        <View style={styles.filterTab}>
          <Text style={styles.filterText}>예정</Text>
        </View>
        <View style={styles.filterTab}>
          <Text style={styles.filterText}>완료됨</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>작업이 없습니다</Text>
          <Text style={styles.emptyStateSubtext}>새 작업을 추가해 보세요</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F6FA',
  },
  filterTab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3366FF',
  },
  filterText: {
    color: '#8395A7',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#3366FF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#8395A7',
    marginTop: 8,
  },
});

export default TasksScreen; 