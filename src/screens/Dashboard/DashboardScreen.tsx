import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, RefreshControl, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../theme/ThemeProvider';
import ContributionGraph, { ContributionGraphHandle } from '../../components/organisms/ContributionGraph';
import TaskList from '../../components/organisms/TaskList';
import { FloatingActionButton } from '../../components/atoms/Buttons';
import { RootStackParamList, Task } from '../../navigation/AppNavigator';
import useTranslation from '../../hooks/useTranslation';
import { useAuth } from '../../context/AuthContext';
import * as routineService from '../../services/routineService';
import { Routine } from '../../services/routineService';
import { writeBatch, doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { firestore } from '../../firebase/firebaseConfig';

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const contributionGraphRef = useRef<ContributionGraphHandle>(null);

  // 루틴 상태 변경 리스너 해제 함수 ref
  const unsubscribeRoutineListenersRef = useRef<(() => void)[]>([]);

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

  // 루틴 상태 변경 구독 설정
  const setupRoutineListeners = useCallback(() => {
    // 기존 리스너 해제
    unsubscribeRoutineListenersRef.current.forEach(unsubscribe => unsubscribe());
    unsubscribeRoutineListenersRef.current = [];

    // 완료 상태 변경 리스너 등록
    const unsubscribeComplete = routineService.addRoutineStateListener('complete', () => {
      console.log('루틴 완료 상태 변경 감지됨 - 데이터 새로고침');
      loadRoutines();
    });

    // 업데이트 리스너 등록
    const unsubscribeUpdate = routineService.addRoutineStateListener('update', () => {
      console.log('루틴 업데이트 감지됨 - 데이터 새로고침');
      loadRoutines();
    });

    // 리셋 리스너 등록
    const unsubscribeReset = routineService.addRoutineStateListener('reset', () => {
      console.log('루틴 리셋 감지됨 - 데이터 새로고침');
      loadRoutines();
    });

    // 리스너 해제 함수 저장
    unsubscribeRoutineListenersRef.current = [
      unsubscribeComplete,
      unsubscribeUpdate,
      unsubscribeReset
    ];
  }, [loadRoutines]);

  // 컴포넌트 마운트 시 루틴 로드 및 리스너 설정
  useEffect(() => {
    loadRoutines();
    setupRoutineListeners();

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

    // 컴포넌트 언마운트 시 타이머 및 리스너 정리
    return () => {
      clearTimeout(resetTimer);
      // 모든 루틴 상태 리스너 해제
      unsubscribeRoutineListenersRef.current.forEach(unsubscribe => unsubscribe());
      unsubscribeRoutineListenersRef.current = [];
    };
  }, [loadRoutines, setupRoutineListeners]);

  const handleDayPress = (date: Date, count: number) => {
    console.log(`선택한 날짜: ${date.toLocaleDateString()}, 완료한 작업: ${count}개`);
    // 여기에 선택한 날짜의 상세 정보를 보여주는 기능 추가 예정
  };

  const handleMonthChange = (date: Date) => {
    console.log(`선택한 월: ${date.toLocaleDateString()}`);
    // 여기에 선택한 월의 상세 정보를 보여주는 기능 추가 예정
  };

  // 루틴 클릭 시 완료 상태 토글
  const handleRoutinePress = async (taskId: string) => {
    try {
      console.log(`루틴 클릭: ${taskId}`);

      // 기존 루틴 찾기
      const routineToUpdate = routines.find(r => r.id === taskId);
      if (!routineToUpdate) return;

      // 낙관적 UI 업데이트를 위한 업데이트된 상태
      const newCompletedState = !routineToUpdate.completed;
      console.log(`루틴 상태 변경: ${routineToUpdate.title} -> ${newCompletedState ? '완료' : '미완료'}`);

      // 낙관적 UI 업데이트 (API 응답 전에 UI 먼저 업데이트)
      setRoutines(prevRoutines => prevRoutines.map(routine =>
        routine.id === taskId ? { ...routine, completed: newCompletedState } : routine
      ));

      // TaskList 표시용 업데이트
      setRoutineTasks(prevTasks => prevTasks.map(task =>
        task.id === taskId ? {
          ...task,
          status: newCompletedState ? 'completed' : 'pending'
        } : task
      ));

      // ContributionGraph 즉시 낙관적 업데이트 (Firebase 응답 기다리지 않음)
      if (contributionGraphRef.current) {
        console.log('ContributionGraph 낙관적 업데이트');
        contributionGraphRef.current.updateTodayCount(newCompletedState);
      }

      // 서버에 변경사항 반영 (백그라운드에서 진행)
      const updatedRoutine = await routineService.toggleRoutineCompletion(taskId);

      // 서버 응답이 예상과 다르면 UI 롤백 (선택적)
      if (updatedRoutine && updatedRoutine.completed !== newCompletedState) {
        console.log('서버 응답이 예상과 다름 - UI 롤백');
        setRoutines(prevRoutines => prevRoutines.map(routine =>
          routine.id === taskId ? updatedRoutine : routine
        ));

        setRoutineTasks(prevTasks => prevTasks.map(task =>
          task.id === taskId ? {
            ...task,
            status: updatedRoutine.completed ? 'completed' : 'pending'
          } : task
        ));

        // 그래프 업데이트도 롤백
        if (contributionGraphRef.current) {
          console.log('그래프 업데이트 롤백');
          contributionGraphRef.current.updateTodayCount(!newCompletedState);
        }
      }
    } catch (error) {
      console.error('루틴 상태 변경 중 오류:', error);
      // 오류 발생 시 UI 롤백을 여기에 추가할 수 있음
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
          ref={contributionGraphRef}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          selectedDate={selectedDate}
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