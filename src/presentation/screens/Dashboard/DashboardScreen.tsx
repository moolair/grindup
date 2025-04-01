import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState(generateMockTasks());

  const handleDayPress = (date: Date, count: number) => {
    console.log(`선택한 날짜: ${date.toLocaleDateString()}, 완료한 작업: ${count}개`);
    // 여기에 선택한 날짜의 상세 정보를 보여주는 기능 추가 예정
  };

  const handleTaskPress = (taskId: string) => {
    console.log('작업 선택:', taskId);
    // @ts-ignore - 타입 문제는 나중에 해결
    navigation.navigate('TaskDetail', { taskId });
  };

  const handleCreateTask = () => {
    // @ts-ignore - 타입 문제는 나중에 해결
    navigation.navigate('CreateTask');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>안녕하세요!</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>오늘의 현황</Text>
        {/* 기여도 그래프 컴포넌트 */}
        <ContributionGraph
          numWeeks={10}
          onDayPress={handleDayPress}
        />

        <View style={styles.tasksContainer}>
          <Text style={styles.subtitle}>오늘의 작업</Text>
          <TaskList
            tasks={tasks}
            onTaskPress={handleTaskPress}
          />
        </View>
      </View>

      {/* 플로팅 액션 버튼 추가 */}
      <FloatingActionButton
        icon={<PlusIcon color={COLORS.NEUTRAL.WHITE} size={24} />}
        onPress={handleCreateTask}
      />
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.NEUTRAL.BLACK,
  },
  date: {
    fontSize: 16,
    color: COLORS.NEUTRAL.DARK_GRAY,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.NEUTRAL.BLACK,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.NEUTRAL.BLACK,
    marginBottom: 12,
    marginTop: 24,
  },
  tasksContainer: {
    marginTop: 16,
  },
});

export default DashboardScreen; 