import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../theme/ThemeProvider';
import { ChevronLeftIcon, DeleteIcon } from '../../components/Icons';
import useTranslation from '../../hooks/useTranslation';
import { addRoutine, updateRoutine, getRoutines, deleteRoutine, DayOption, Routine as RoutineType } from '../../services/routineService';
import { RootStackParamList } from '../../navigation/AppNavigator';

// 색상 옵션 인터페이스
interface ColorOption {
  id: string;
  name: string;
  value: string;
}

// 루틴 타입 인터페이스
interface Routine {
  id: string;
  title: string;
  description: string;
  days: DayOption[];
  color: string;
}

const TasksScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Tasks'>>();
  const { theme } = useTheme();
  const { t } = useTranslation('tasks');

  // 편집 모드 확인 (routineId가 있으면 편집, 없으면 생성)
  const isEditMode = Boolean(route.params?.routineId);
  const [title, setTitle] = useState('');

  // 색상 옵션
  const colorOptions: ColorOption[] = [
    { id: 'default', name: t('colorOptions.default'), value: theme.colors.ui.primary },
    { id: 'red', name: t('colorOptions.red'), value: '#FF6B6B' },
    { id: 'orange', name: t('colorOptions.orange'), value: '#FFA86B' },
    { id: 'yellow', name: t('colorOptions.yellow'), value: '#FFDE6B' },
    { id: 'green', name: t('colorOptions.green'), value: '#6BFF8B' },
    { id: 'blue', name: t('colorOptions.blue'), value: '#6B9CFF' },
    { id: 'purple', name: t('colorOptions.purple'), value: '#B96BFF' },
    { id: 'pink', name: t('colorOptions.pink'), value: '#FF6BC1' },
  ];

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
    color: colorOptions[0].value,
  });

  // 편집 모드인 경우 기존 루틴 데이터 불러오기
  useEffect(() => {
    const loadRoutineData = async () => {
      if (route.params?.routineId) {
        try {
          const routines = await getRoutines();
          const routineToEdit = routines.find(r => r.id === route.params?.routineId);

          if (routineToEdit) {
            // 저장된 요일 정보가 있는 경우 사용, 없으면 기본값 사용
            let loadedDays = initialDays;

            if (routineToEdit.days && routineToEdit.days.length > 0) {
              // 저장된 요일 정보를 사용하여 초기화
              loadedDays = routineToEdit.days;
            }

            // 루틴 데이터로 폼 초기화
            setRoutine({
              id: routineToEdit.id,
              title: routineToEdit.title,
              description: routineToEdit.description || '',
              days: loadedDays,
              color: routineToEdit.category || colorOptions[0].value, // 기존 카테고리를 색상으로 사용하거나 기본값
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

  // 색상 선택 핸들러
  const handleColorSelect = (colorValue: string) => {
    setRoutine(prev => ({ ...prev, color: colorValue }));
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
        category: routine.color, // 선택한 색상을 카테고리 필드에 저장
        color: routine.color, // 색상 필드에도 직접 저장
        days: routine.days, // 요일 정보 저장
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

      // Main 화면으로 돌아간 후 Dashboard 탭으로 이동
      // 변경: Main 대신 명시적으로 Dashboard 탭으로 이동
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            params: { refreshRoutines: true },
            state: {
              routes: [{ name: 'Dashboard' }],
              index: 0
            }
          }
        ],
      });
    } catch (error) {
      console.error(`루틴 ${isEditMode ? '업데이트' : '생성'} 중 오류:`, error);
    }
  };

  // 루틴 삭제 핸들러
  const handleDeleteRoutine = async () => {
    if (!isEditMode || !route.params?.routineId) return;

    // 삭제 확인 알림 표시
    Alert.alert(
      t('deleteRoutineTitle'),
      t('deleteRoutineMessage'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteRoutine(route.params?.routineId as string);
              if (success) {
                // 삭제 성공 시 메인 화면으로 돌아가기
                // Main 화면으로 돌아간 후 Dashboard 탭으로 이동
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Main',
                      params: { refreshRoutines: true },
                      state: {
                        routes: [{ name: 'Dashboard' }],
                        index: 0
                      }
                    }
                  ],
                });
              } else {
                console.error('루틴 삭제 실패');
                // 에러 메시지 표시 (추후 구현)
              }
            } catch (error) {
              console.error('루틴 삭제 중 오류:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border.light }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <ChevronLeftIcon color={theme.colors.content.primary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.content.primary }]}>
          {isEditMode ? t('editRoutine') : t('createRoutine')}
        </Text>
        {isEditMode && (
          <TouchableOpacity onPress={handleDeleteRoutine} style={styles.deleteButton}>
            <DeleteIcon color={theme.colors.ui.error} size={24} />
          </TouchableOpacity>
        )}
        {!isEditMode && <View style={styles.deleteButton} />}
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

        {/* 카드 색상 선택 */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.colors.content.primary }]}>{t('cardColor')}</Text>
          <View style={styles.colorContainer}>
            {colorOptions.map(color => (
              <TouchableOpacity
                key={color.id}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.value },
                  routine.color === color.value && styles.selectedColorOption
                ]}
                onPress={() => handleColorSelect(color.value)}
              >
                {routine.color === color.value && (
                  <Text style={styles.colorCheckmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 수정 완료 또는 생성 버튼 */}
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: theme.colors.ui.primary }]}
        onPress={handleSaveRoutine}
      >
        <Text style={[styles.createButtonText, { color: theme.colors.content.inverse }]}>
          {isEditMode ? t('editComplete') : t('createButton')}
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
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
    width: 40,
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
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: '#000',
  },
  colorCheckmark: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  createButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 1000,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TasksScreen; 