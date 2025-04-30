import React from 'react';
import { Alert, Button, StyleSheet, View, Text } from 'react-native';
import NotificationService from '../services/NotificationService';

const SettingsScreen = () => {
    const handleTestNotification = async () => {
        try {
            await NotificationService.sendTestNotification();
            console.log('알림 테스트 발송 요청 완료');
        } catch (error) {
            console.error('알림 테스트 발송 실패:', error);
            Alert.alert(
                '알림 테스트 실패',
                '알림을 보내는 중 오류가 발생했습니다. 다시 시도해주세요.'
            );
        }
    };

    // 미완료 루틴 테스트용
    const handleTestIncompleteRoutines = () => {
        const testRoutines = ['아침 스트레칭', '영어 공부', '운동'];
        NotificationService.showIncompleteRoutinesNotification(testRoutines);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>알림 설정</Text>
            <View style={styles.buttonContainer}>
                <Button title="일반 알림 테스트" onPress={handleTestNotification} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="미완료 루틴 알림 테스트" onPress={handleTestIncompleteRoutines} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    buttonContainer: {
        marginVertical: 8,
    },
});

export default SettingsScreen; 