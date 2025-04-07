import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { ChevronLeftIcon } from '../../components/Icons';
import useTranslation from '../../hooks/useTranslation';

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
  const { theme } = useTheme();
  const { t } = useTranslation('tasks');

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
    category: t('categories.uncategorized'),
  });

  // 카테고리 옵션들
  const categories = [
    t('categories.uncategorized'),
    t('categories.health'),
    t('categories.learning'),
    t('categories.work'),
    t('categories.hobby'),
    t('categories.selfDevelopment')
  ];
  const [selectedCategory, setSelectedCategory] = useState(t('categories.uncategorized'));

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ChevronLeftIcon color={theme.colors.content.primary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.content.primary }]}>{t('createRoutine')}</Text>
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

        {/* 카테고리 선택 */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.colors.content.primary }]}>{t('category')}</Text>
          <View style={styles.categoriesContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  { borderColor: theme.colors.border.light },
                  selectedCategory === category && [
                    styles.selectedCategoryButton,
                    { backgroundColor: theme.colors.ui.primary, borderColor: theme.colors.ui.primary }
                  ]
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    { color: theme.colors.content.primary },
                    selectedCategory === category && [
                      styles.selectedCategoryButtonText,
                      { color: theme.colors.content.inverse }
                    ]
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

      {/* 루틴 생성 버튼 */}
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: theme.colors.ui.primary }]}
        onPress={handleCreateRoutine}
      >
        <Text style={[styles.createButtonText, { color: theme.colors.content.inverse }]}>{t('createButton')}</Text>
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryButton: {
    borderColor: '#3366FF',
  },
  categoryButtonText: {
    fontSize: 14,
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