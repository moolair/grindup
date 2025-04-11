import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskPress }) => {
    const { theme } = useTheme();

    if (tasks.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.colors.content.secondary }]}>No tasks available</Text>
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
                        { borderBottomColor: theme.colors.border.light },
                        task.status === 'completed' && styles.completedTask,
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
        fontSize: 16,
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
});

export default TaskList; 