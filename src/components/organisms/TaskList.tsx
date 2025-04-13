import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    category?: string;
    dueDate?: Date;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface TaskListProps {
    tasks: Task[];
    onTaskPress: (taskId: string) => void;
    onTaskDelete?: (taskId: string) => void;
}

const { width } = Dimensions.get('window');
const DELETE_BUTTON_WIDTH = 70; // 삭제 버튼 너비

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskPress, onTaskDelete }) => {
    const { theme } = useTheme();
    const [swipedTaskId, setSwipedTaskId] = useState<string | null>(null);

    // 각 항목에 대한 애니메이션 값을 저장하는 객체
    const swipeAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

    // 항목에 대한 애니메이션 값 초기화
    const getSwipeAnimation = (taskId: string) => {
        if (!swipeAnimations[taskId]) {
            swipeAnimations[taskId] = new Animated.Value(0);
        }
        return swipeAnimations[taskId];
    };

    // 항목을 원래 위치로 되돌리는 함수
    const resetSwipe = (taskId: string) => {
        Animated.spring(swipeAnimations[taskId], {
            toValue: 0,
            useNativeDriver: false,
            friction: 5
        }).start();
        setSwipedTaskId(null);
    };

    // 항목을 삭제 위치로 완전히 스와이프하는 함수
    const completeSwipe = (taskId: string) => {
        Animated.spring(swipeAnimations[taskId], {
            toValue: -DELETE_BUTTON_WIDTH,
            useNativeDriver: false,
            friction: 5
        }).start();
        setSwipedTaskId(taskId);
    };

    // 스와이프 제스처 생성 함수
    const createPanResponder = (taskId: string) => {
        return PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // 수평으로 10px 이상 이동하고, 수직 이동이 적을 때만 응답
                return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 50;
            },
            onPanResponderGrant: () => {
                // 다른 열린 항목 닫기
                if (swipedTaskId && swipedTaskId !== taskId) {
                    resetSwipe(swipedTaskId);
                }
            },
            onPanResponderMove: (_, gestureState) => {
                const newX = Math.min(0, Math.max(-DELETE_BUTTON_WIDTH, gestureState.dx));
                swipeAnimations[taskId].setValue(newX);
            },
            onPanResponderRelease: (_, gestureState) => {
                // 사용자가 항목을 왼쪽으로 충분히 스와이프했는지 확인
                if (gestureState.dx < -width * 0.2) {
                    completeSwipe(taskId);
                } else {
                    resetSwipe(taskId);
                }
            }
        });
    };

    // 삭제 버튼 클릭 처리
    const handleDeletePress = (taskId: string) => {
        if (onTaskDelete) {
            onTaskDelete(taskId);
            // 삭제 후 스와이프 상태 초기화
            setSwipedTaskId(null);
        }
    };

    if (tasks.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.colors.content.secondary }]}>No tasks available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {tasks.map((task) => {
                // 각 항목에 대한 애니메이션 값 및 PanResponder 생성
                const swipeAnim = getSwipeAnimation(task.id);
                const panResponder = createPanResponder(task.id);

                return (
                    <View key={task.id} style={styles.taskContainer}>
                        {/* 삭제 버튼 (항상 렌더링되지만 스와이프 시 노출) */}
                        <View style={[styles.deleteButtonContainer, { backgroundColor: theme.colors.ui.error }]}>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeletePress(task.id)}
                            >
                                <Text style={[styles.deleteButtonText, { color: theme.colors.content.inverse }]}>X</Text>
                            </TouchableOpacity>
                        </View>

                        {/* 스와이프 가능한 항목 */}
                        <Animated.View
                            {...panResponder.panHandlers}
                            style={[
                                styles.taskWrapper,
                                { transform: [{ translateX: swipeAnim }] }
                            ]}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.taskItem,
                                    { borderBottomColor: theme.colors.border.light },
                                    task.status === 'completed' && styles.completedTask
                                ]}
                                onPress={() => onTaskPress(task.id)}
                            >
                                <View style={[styles.checkbox, { borderColor: theme.colors.ui.primary }]}>
                                    {task.status === 'completed' && (
                                        <View style={[styles.checkmark, { backgroundColor: theme.colors.ui.primary }]} />
                                    )}
                                </View>
                                <View style={styles.taskContent}>
                                    <Text
                                        style={[
                                            styles.taskTitle,
                                            { color: theme.colors.content.primary },
                                            task.status === 'completed' && [
                                                styles.completedText,
                                                { color: theme.colors.content.tertiary }
                                            ],
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {task.title}
                                    </Text>
                                    {task.category && (
                                        <View style={[styles.categoryTag, { backgroundColor: theme.colors.ui.primary + '20' }]}>
                                            <Text style={[styles.categoryText, { color: theme.colors.ui.primary }]}>{task.category}</Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    emptyText: {
        fontSize: 16,
    },
    taskContainer: {
        width: '100%',
        position: 'relative',
        marginBottom: 1,
    },
    taskWrapper: {
        width: '100%',
        backgroundColor: 'white',
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
    },
    completedTask: {
        opacity: 0.7,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmark: {
        width: 10,
        height: 10,
        borderRadius: 2,
    },
    taskContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskTitle: {
        fontSize: 16,
        flex: 1,
    },
    completedText: {
        textDecorationLine: 'line-through',
    },
    categoryTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    categoryText: {
        fontSize: 12,
    },
    deleteButtonContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: DELETE_BUTTON_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    deleteButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TaskList; 