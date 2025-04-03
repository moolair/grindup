import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskPress }) => {
    if (tasks.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No tasks available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {tasks.map((task) => (
                <TouchableOpacity
                    key={task.id}
                    style={[
                        styles.taskItem,
                        task.status === 'completed' && styles.completedTask,
                    ]}
                    onPress={() => onTaskPress(task.id)}
                >
                    <View style={styles.checkbox}>
                        {task.status === 'completed' && (
                            <View style={styles.checkmark} />
                        )}
                    </View>
                    <View style={styles.taskContent}>
                        <Text
                            style={[
                                styles.taskTitle,
                                task.status === 'completed' && styles.completedText,
                            ]}
                            numberOfLines={1}
                        >
                            {task.title}
                        </Text>
                        {task.category && (
                            <View style={styles.categoryTag}>
                                <Text style={styles.categoryText}>{task.category}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            ))}
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
        color: '#8395A7',
        fontSize: 16,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    completedTask: {
        opacity: 0.7,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#3366FF',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmark: {
        width: 10,
        height: 10,
        backgroundColor: '#3366FF',
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
        color: '#8395A7',
    },
    categoryTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: '#EBF0FF',
        borderRadius: 4,
        marginLeft: 8,
    },
    categoryText: {
        fontSize: 12,
        color: '#3366FF',
    },
});

export default TaskList; 