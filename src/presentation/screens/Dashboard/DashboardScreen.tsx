import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const DashboardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>안녕하세요!</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>오늘의 현황</Text>
        {/* 여기에 기여도 그래프와 할 일 목록이 추가될 예정 */}
        <View style={styles.placeholder}>
          <Text>기여도 그래프 영역</Text>
        </View>
        
        <View style={styles.tasksContainer}>
          <Text style={styles.subtitle}>오늘의 작업</Text>
          <View style={styles.placeholder}>
            <Text>작업 목록 영역</Text>
          </View>
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  date: {
    fontSize: 16,
    color: '#8395A7',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
    marginTop: 24,
  },
  placeholder: {
    height: 150,
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D8E0',
    borderStyle: 'dashed',
  },
  tasksContainer: {
    marginTop: 16,
  },
});

export default DashboardScreen; 