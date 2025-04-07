import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../theme/ThemeProvider';
import ContributionGraph from '../../components/organisms/ContributionGraph';
import TaskList from '../../components/organisms/TaskList';
import { FloatingActionButton } from '../../components/atoms/Buttons';
import { RootStackParamList, Task } from '../../navigation/AppNavigator';

// 타입 정의
type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type DashboardScreenRouteProp = RouteProp<RootStackParamList, 'Main'>;

// 임시 목업 데이터 생성 함수
const generateMockTasks = (): Task[] => {
  // 샘플 작업 데이터
  return [
    {
      id: '1',
      title: '매일 코딩 연습하기',
      status: 'pending',
      category: '개발'
    },
    {
      id: '2',
      title: '운동 30분',
      status: 'completed',
      category: '건강'
    },
    {
      id: '3',
      title: '일일 회고 작성',
      status: 'pending',
      category: '개인'
    }
  ];
};

const DashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const route = useRoute<DashboardScreenRouteProp>();
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>(generateMockTasks());

  // TasksScreen에서 전달된 새 작업이 있는지 확인하고 추가
  useEffect(() => {
    if (route.params?.newTask) {
      const newTask = route.params.newTask;
      setTasks(prevTasks => [...prevTasks, newTask]);

      // 파라미터 제거 (중복 추가 방지)
      navigation.setParams({ newTask: undefined });
    }
  }, [route.params?.newTask, navigation]);

  const handleDayPress = (date: Date, count: number) => {
    console.log(`선택한 날짜: ${date.toLocaleDateString()}, 완료한 작업: ${count}개`);
    // 여기에 선택한 날짜의 상세 정보를 보여주는 기능 추가 예정
  };

  const handleTaskPress = (taskId: string) => {
    console.log('작업 선택:', taskId);
    navigation.navigate('TaskDetail', { taskId });
  };

  // 새 작업 생성 기능 - Tasks 탭으로 이동
  const handleCreateTask = () => {
    navigation.navigate('Tasks');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.colors.content.primary }]}>안녕하세요!</Text>
        <Text style={[styles.date, { color: theme.colors.content.secondary }]}>{new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.content.primary }]}>오늘의 현황</Text>
        {/* 기여도 그래프 컴포넌트 */}
        <ContributionGraph
          numWeeks={10}
          onDayPress={handleDayPress}
        />

        <View style={styles.tasksContainer}>
          <Text style={[styles.subtitle, { color: theme.colors.content.primary }]}>오늘의 작업</Text>
          <TaskList
            tasks={tasks}
            onTaskPress={handleTaskPress}
          />
        </View>
      </View>

      {/* 플로팅 액션 버튼 추가 */}
      <FloatingActionButton
        icon="plus"
        color={theme.colors.content.inverse}
        backgroundColor={theme.colors.ui.primary}
        onPress={handleCreateTask}
      />
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 24,
  },
  tasksContainer: {
    marginTop: 16,
  },
});

export default DashboardScreen; 