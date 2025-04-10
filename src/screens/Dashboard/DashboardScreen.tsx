import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, RefreshControl, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../theme/ThemeProvider';
import ContributionGraph from '../../components/organisms/ContributionGraph';
import TaskList from '../../components/organisms/TaskList';
import { FloatingActionButton } from '../../components/atoms/Buttons';
import { RootStackParamList, Task } from '../../navigation/AppNavigator';
import useTranslation from '../../hooks/useTranslation';
import { useAuth } from '../../context/AuthContext';
import * as routineService from '../../services/routineService';
import { Routine } from '../../services/routineService';

// 타입 정의
type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type DashboardScreenRouteProp = RouteProp<RootStackParamList, 'Main'>;

// Routine을 Task로 변환하는 함수
const routineToTask = (routine: Routine): Task => {
  return {
    id: routine.id,
    title: routine.title,
    description: routine.description,
    status: routine.completed ? 'completed' : 'pending',
    category: routine.category,
  };
};

const DashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const route = useRoute<DashboardScreenRouteProp>();
  const { theme } = useTheme();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [routineTasks, setRoutineTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();

  // 루틴 데이터 로드
  const loadRoutines = useCallback(async () => {
    try {
      setRefreshing(true);

      // 루틴 리셋 필요한지 확인
      const needsReset = await routineService.shouldResetRoutines();
      if (needsReset) {
        await routineService.resetRoutines();
      }

      // 루틴 불러오기
      const fetchedRoutines = await routineService.getRoutines();

      // 루틴이 없으면 기본 루틴 생성
      if (fetchedRoutines.length === 0) {
        await routineService.createDefaultRoutines();
        const defaultRoutines = await routineService.getRoutines();
        setRoutines(defaultRoutines);

        // Task 형태로 변환
        const tasks = defaultRoutines.map(routineToTask);
        setRoutineTasks(tasks);
      } else {
        setRoutines(fetchedRoutines);

        // Task 형태로 변환
        const tasks = fetchedRoutines.map(routineToTask);
        setRoutineTasks(tasks);
      }
    } catch (error) {
      console.error('루틴 로드 중 오류:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // 컴포넌트 마운트 시 루틴 로드
  useEffect(() => {
    loadRoutines();

    // 자정 리셋 타이머 설정
    const scheduleReset = () => {
      const now = new Date();
      const midnight = routineService.getMidnightTonight();
      const timeUntilMidnight = midnight.getTime() - now.getTime();

      console.log(`자정 리셋 예약: ${midnight.toLocaleString()}, ${timeUntilMidnight / (1000 * 60)} 분 후`);

      // 자정에 실행될 타이머 설정
      const timer = setTimeout(() => {
        console.log('자정 리셋 실행');
        loadRoutines();
        // 다음 자정에 대한 타이머 재설정
        scheduleReset();
      }, timeUntilMidnight);

      return timer;
    };

    const resetTimer = scheduleReset();

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearTimeout(resetTimer);
    };
  }, [loadRoutines]);

  const handleDayPress = (date: Date, count: number) => {
    console.log(`선택한 날짜: ${date.toLocaleDateString()}, 완료한 작업: ${count}개`);
    // 여기에 선택한 날짜의 상세 정보를 보여주는 기능 추가 예정
  };

  // 루틴 클릭 시 완료 상태 토글
  const handleRoutinePress = async (taskId: string) => {
    try {
      const updatedRoutine = await routineService.toggleRoutineCompletion(taskId);

      if (updatedRoutine) {
        // 루틴 상태 업데이트
        setRoutines(prevRoutines => prevRoutines.map(routine =>
          routine.id === taskId ? updatedRoutine : routine
        ));

        // TaskList 표시용 업데이트
        setRoutineTasks(prevTasks => prevTasks.map(task =>
          task.id === taskId ? {
            ...task,
            status: updatedRoutine.completed ? 'completed' : 'pending'
          } : task
        ));
      }
    } catch (error) {
      console.error('루틴 상태 변경 중 오류:', error);
    }
  };

  // 새 루틴 생성 기능 - 루틴 설정 화면으로 이동 (추후 구현)
  const handleCreateRoutine = () => {
    // TODO: 루틴 설정 화면으로 이동
    // 현재는 기존 Tasks 화면으로 이동
    navigation.navigate('Tasks');
  };

  // 끌어내려서 새로고침 처리
  const onRefresh = useCallback(() => {
    loadRoutines();
  }, [loadRoutines]);

  // 사용자 이름이 있는 경우 "안녕하세요, [사용자 이름]님"으로 인사말 생성
  // 그렇지 않으면 기본 "안녕하세요," 인사말 사용
  const getGreeting = () => {
    if (user?.displayName) {
      return `${t('greeting')} ${user.displayName}님!`;
    }
    return `${t('greeting')}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.colors.content.primary }]}>{getGreeting()}</Text>
        <Text style={[styles.date, { color: theme.colors.content.secondary }]}>{new Date().toLocaleDateString()}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Text style={[styles.title, { color: theme.colors.content.primary }]}>{t('todayStatus')}</Text>
        {/* 기여도 그래프 컴포넌트 */}
        <ContributionGraph
          numWeeks={52}
          onDayPress={handleDayPress}
        />

        <View style={styles.tasksContainer}>
          <Text style={[styles.subtitle, { color: theme.colors.content.primary }]}>{t('todayRoutineHeader')}</Text>
          <TaskList
            tasks={routineTasks}
            onTaskPress={handleRoutinePress}
          />
        </View>
      </ScrollView>

      {/* 플로팅 액션 버튼 추가 */}
      <FloatingActionButton
        icon="plus"
        color={theme.colors.content.inverse}
        backgroundColor={theme.colors.ui.primary}
        onPress={handleCreateRoutine}
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
  },
  contentContainer: {
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