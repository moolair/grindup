import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../../../constants/colors';
import ContributionGraph from '../../../components/organisms/ContributionGraph';
import TaskList from '../../../components/organisms/TaskList';
import FloatingActionButton from '../../components/FloatingActionButton';
import { PlusIcon } from '../../components/Icons';

// 임시 목업 데이터 생성 함수
const generateMockTasks = () => {
  // 샘플 작업 데이터
  return [
    {
      id: '1',
      title: '매일 코딩 연습하기',
      status: 'pending' as const,
      category: '개발'
    },
    {
      id: '2',
      title: '운동 30분',
      status: 'completed' as const,
      category: '건강'
    },
    {
      id: '3',
      title: '일일 회고 작성',
      status: 'pending' as const,
      category: '개인'
    }
  ];
};

const TasksScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [tasks, setTasks] = useState(generateMockTasks());

  // TasksScreen에서 전달된 새 작업이 있는지 확인하고 추가
  useEffect(() => {
    if (route.params?.newTask) {
      const newTask = route.params.newTask;
      setTasks(prevTasks => [...prevTasks, newTask]);

      // 파라미터 제거 (중복 추가 방지)
      navigation.setParams({ newTask: undefined });
    }
  }, [route.params?.newTask]);

  const handleDayPress = (date: Date, count: number) => {
    console.log(`선택한 날짜: ${date.toLocaleDateString()}, 완료한 작업: ${count}개`);
    // 여기에 선택한 날짜의 상세 정보를 보여주는 기능 추가 예정
  };

  const handleTaskPress = (taskId: string) => {
    console.log('작업 선택:', taskId);
    // @ts-ignore - 타입 문제는 나중에 해결
    navigation.navigate('TaskDetail', { taskId });
  };

  // 새 작업 데이터 생성 함수
  const createNewTask = () => {
    return {
      id: Date.now().toString(), // 고유 ID 생성
      title: '새 작업',
      status: 'pending' as const,
      category: '미분류'
    };
  };

  // 새 작업 생성 및 홈 화면으로 이동
  const handleCreateTask = () => {
    const newTask = createNewTask();

    // @ts-ignore - 타입 문제는 나중에 해결
    navigation.navigate('Main', { newTask });
  };

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

      {/* 작업 생성 버튼 */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
        <Text style={styles.createButtonText}>작업 생성</Text>
      </TouchableOpacity>
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
  createButton: {
    backgroundColor: '#3366FF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TasksScreen; 