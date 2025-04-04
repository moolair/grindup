import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { ChevronLeftIcon } from '../../components/Icons';

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
  category: string;
}

const TasksScreen = () => {
  const navigation = useNavigation();

  // 초기 요일 선택 상태
  const initialDays: DayOption[] = [
    { id: 'mon', label: '월', selected: false },
    { id: 'tue', label: '화', selected: false },
    { id: 'wed', label: '수', selected: false },
    { id: 'thu', label: '목', selected: false },
    { id: 'fri', label: '금', selected: false },
    { id: 'sat', label: '토', selected: false },
    { id: 'sun', label: '일', selected: false },
  ];

  // 루틴 상태 관리
  const [routine, setRoutine] = useState<Routine>({
    id: Date.now().toString(),
    title: '',
    description: '',
    days: initialDays,
    reminder: false,
    category: '미분류',
  });

  // 카테고리 옵션들
  const categories = ['미분류', '건강', '학습', '업무', '취미', '자기개발'];
  const [selectedCategory, setSelectedCategory] = useState('미분류');

  // 뒤로가기 핸들러
  const handleBackPress = () => {
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

  // 카테고리 선택 핸들러
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setRoutine(prev => ({ ...prev, category }));
  };

  // 루틴 생성 핸들러
  const handleCreateRoutine = () => {
    // 여기서 루틴 생성 로직 구현
    console.log('생성된 루틴:', routine);

    // 메인 화면으로 돌아가기
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ChevronLeftIcon color={COLORS.NEUTRAL.BLACK} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>루틴 생성</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 제목 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>제목</Text>
          <TextInput
            style={styles.input}
            placeholder="루틴 제목을 입력하세요"
            value={routine.title}
            onChangeText={handleTitleChange}
          />
        </View>

        {/* 설명 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>설명</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="루틴에 대한 설명을 입력하세요"
            value={routine.description}
            onChangeText={handleDescriptionChange}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* 반복 요일 선택 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>반복 요일</Text>
          <View style={styles.daysContainer}>
            {routine.days.map(day => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  day.selected && styles.selectedDayButton
                ]}
                onPress={() => toggleDay(day.id)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    day.selected && styles.selectedDayButtonText
                  ]}
                >
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 카테고리 선택 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>카테고리</Text>
          <View style={styles.categoriesContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.selectedCategoryButtonText
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 알림 설정 */}
        <View style={styles.inputContainer}>
          <View style={styles.reminderContainer}>
            <Text style={styles.inputLabel}>알림 설정</Text>
            <Switch
              value={routine.reminder}
              onValueChange={toggleReminder}
              trackColor={{ false: '#E0E0E0', true: '#3366FF' }}
              thumbColor={routine.reminder ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>
      </ScrollView>

      {/* 루틴 생성 버튼 */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreateRoutine}>
        <Text style={styles.createButtonText}>루틴 생성</Text>
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
    color: '#2C3E50',
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
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
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
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#3366FF',
    borderColor: '#3366FF',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#2C3E50',
  },
  selectedDayButtonText: {
    color: '#FFFFFF',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#3366FF',
    borderColor: '#3366FF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#2C3E50',
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
  },
  reminderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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