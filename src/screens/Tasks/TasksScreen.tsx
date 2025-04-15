import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../theme/ThemeProvider';
import { ChevronLeftIcon } from '../../components/Icons';
import useTranslation from '../../hooks/useTranslation';
import { addRoutine, updateRoutine, getRoutines } from '../../services/routineService';
import { RootStackParamList } from '../../navigation/AppNavigator';

// 요일 선택을 위한 인터페이스
interface DayOption {
  id: string;
  label: string;
  selected: boolean;
}

// 루틴 타입 인터페이스
interface Routine {
  id: string;
  title: string;
  description: string;
  days: DayOption[];
  reminder: boolean;
}

const TasksScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Tasks'>>();
  const { theme } = useTheme();
  const { t } = useTranslation('tasks');

  // 편집 모드 확인 (routineId가 있으면 편집, 없으면 생성)
  const isEditMode = Boolean(route.params?.routineId);
  const [title, setTitle] = useState('');

  // 초기 요일 선택 상태
  const initialDays: DayOption[] = [
    { id: 'mon', label: t('days.mon'), selected: false },
    { id: 'tue', label: t('days.tue'), selected: false },
    { id: 'wed', label: t('days.wed'), selected: false },
    { id: 'thu', label: t('days.thu'), selected: false },
    { id: 'fri', label: t('days.fri'), selected: false },
    { id: 'sat', label: t('days.sat'), selected: false },
    { id: 'sun', label: t('days.sun'), selected: false },
  ];

  // 루틴 상태 관리
  const [routine, setRoutine] = useState<Routine>({
    id: Date.now().toString(),
    title: '',
    description: '',
    days: initialDays,
    reminder: false,
  });

  // 편집 모드인 경우 기존 루틴 데이터 불러오기
  useEffect(() => {
    const loadRoutineData = async () => {
      if (route.params?.routineId) {
        try {
          const routines = await getRoutines();
          const routineToEdit = routines.find(r => r.id === route.params?.routineId);

          if (routineToEdit) {
            // 루틴 데이터로 폼 초기화
            setRoutine({
              id: routineToEdit.id,
              title: routineToEdit.title,
              description: routineToEdit.description || '',
              days: initialDays, // 요일 정보가 없으면 기본값 사용
              reminder: false, // 알림 정보가 없으면 기본값 사용
            });
          }
        } catch (error) {
          console.error('루틴 데이터 로드 중 오류:', error);
        }
      }
    };

    loadRoutineData();
  }, [route.params?.routineId]);

  // 뒤로가기 핸들러
  const handleBackPress = () => {
    // 변경사항을 저장하지 않고 이전 화면으로 돌아감
    navigation.goBack();
  };

  // 제목 변경 핸들러
  const handleTitleChange = (text: string) => {
    setRoutine(prev => ({ ...prev, title: text }));
  };

  // 설명 변경 핸들러
  const handleDescriptionChange = (text: string) => {
    setRoutine(prev => ({ ...prev, description: text }));
  };

  // 요일 선택 핸들러
  const toggleDay = (dayId: string) => {
    setRoutine(prev => ({
      ...prev,
      days: prev.days.map(day =>
        day.id === dayId ? { ...day, selected: !day.selected } : day
      )
    }));
  };

  // 알림 설정 핸들러
  const toggleReminder = () => {
    setRoutine(prev => ({ ...prev, reminder: !prev.reminder }));
  };

  // 루틴 저장 핸들러 (생성 또는 업데이트)
  const handleSaveRoutine = async () => {
    // 필수 필드 검증
    if (!routine.title.trim()) {
      // TODO: 알림 또는 오류 메시지 표시
      console.log('제목을 입력해주세요');
      return;
    }

    try {
      // 선택된 요일 확인 (모두 선택되지 않은 경우 매일 실행으로 간주)
      const anyDaySelected = routine.days.some(day => day.selected);

      // 루틴 데이터 준비
      const routineData = {
        title: routine.title,
        description: routine.description,
        order: Date.now(), // 순서는 현재 시간으로 설정 (새 루틴인 경우에만 적용)
        completed: isEditMode ? Boolean((routine as any).completed) : false,
      };

      let savedRoutine;

      if (isEditMode) {
        // 기존 루틴 업데이트
        savedRoutine = await updateRoutine(routine.id, routineData);
        console.log('루틴 업데이트됨:', savedRoutine);
      } else {
        // 새 루틴 생성
        savedRoutine = await addRoutine(routineData);
        console.log('생성된 루틴:', savedRoutine);
      }

      // 메인 화면으로 돌아가기 (홈 화면)
      // refreshRoutines를 true로 설정하여 대시보드에서 루틴 목록을 새로고침하도록 함
      navigation.navigate('Main', { refreshRoutines: true });
    } catch (error) {
      console.error(`루틴 ${isEditMode ? '업데이트' : '생성'} 중 오류:`, error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ChevronLeftIcon color={theme.colors.content.primary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.content.primary }]}>
          {isEditMode ? t('루틴 편집') : t('새 루틴 만들기')}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 제목 입력 */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.colors.content.primary }]}>{t('title')}</Text>
          <TextInput
            style={[styles.input, {
              borderColor: theme.colors.border.light,
              color: theme.colors.content.primary,
              backgroundColor: theme.colors.surface.primary
            }]}
            placeholder={t('titlePlaceholder')}
            placeholderTextColor={theme.colors.content.tertiary}
            value={routine.title}
            onChangeText={handleTitleChange}
          />
        </View>

        {/* 설명 입력 */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.colors.content.primary }]}>{t('description')}</Text>
          <TextInput
            style={[styles.input, styles.textArea, {
              borderColor: theme.colors.border.light,
              color: theme.colors.content.primary,
              backgroundColor: theme.colors.surface.primary
            }]}
            placeholder={t('descriptionPlaceholder')}
            placeholderTextColor={theme.colors.content.tertiary}
            value={routine.description}
            onChangeText={handleDescriptionChange}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* 반복 요일 선택 */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.colors.content.primary }]}>{t('repeatDays')}</Text>
          <View style={styles.daysContainer}>
            {routine.days.map(day => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  { borderColor: theme.colors.border.light },
                  day.selected && [styles.selectedDayButton, { backgroundColor: theme.colors.ui.primary, borderColor: theme.colors.ui.primary }]
                ]}
                onPress={() => toggleDay(day.id)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    { color: theme.colors.content.primary },
                    day.selected && [styles.selectedDayButtonText, { color: theme.colors.content.inverse }]
                  ]}
                >
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 알림 설정 */}
        <View style={styles.inputContainer}>
          <View style={styles.reminderContainer}>
            <Text style={[styles.inputLabel, { color: theme.colors.content.primary }]}>{t('reminderSettings')}</Text>
            <Switch
              value={routine.reminder}
              onValueChange={toggleReminder}
              trackColor={{ false: theme.colors.content.disabled, true: theme.colors.ui.primary }}
              thumbColor={theme.colors.content.inverse}
            />
          </View>
        </View>
      </ScrollView>

      {/* 수정 완료 또는 생성 버튼 */}
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: theme.colors.ui.primary }]}
        onPress={handleSaveRoutine}
      >
        <Text style={[styles.createButtonText, { color: theme.colors.content.inverse }]}>
          {isEditMode ? t('편집 완료') : t('루틴 생성')}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayButton: {
    borderColor: '#3366FF',
  },
  dayButtonText: {
    fontSize: 14,
  },
  selectedDayButtonText: {
    color: '#FFFFFF',
  },
  reminderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TasksScreen; 