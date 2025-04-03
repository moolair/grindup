import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from './index';

// Task 타입 정의
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
    category?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
}

/**
 * 오늘의 작업 목록을 가져옵니다
 */
export const getTodayTasks = async (): Promise<Task[]> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const tasksRef = collection(db, 'tasks');
        const q = query(
            tasksRef,
            where('userId', '==', user.uid),
            where('dueDate', '>=', Timestamp.fromDate(today)),
            where('dueDate', '<', Timestamp.fromDate(tomorrow))
        );

        const querySnapshot = await getDocs(q);
        const tasks: Task[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            tasks.push({
                id: doc.id,
                title: data.title,
                description: data.description,
                status: data.status,
                userId: data.userId,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
                dueDate: data.dueDate?.toDate(),
                category: data.category,
                priority: data.priority,
            });
        });

        return tasks;
    } catch (error) {
        console.error('Error getting today tasks:', error);
        return [];
    }
};

/**
 * 모든 작업 목록을 가져옵니다
 */
export const getAllTasks = async (): Promise<Task[]> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const tasksRef = collection(db, 'tasks');
        const q = query(
            tasksRef,
            where('userId', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);
        const tasks: Task[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            tasks.push({
                id: doc.id,
                title: data.title,
                description: data.description,
                status: data.status,
                userId: data.userId,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
                dueDate: data.dueDate?.toDate(),
                category: data.category,
                priority: data.priority,
            });
        });

        return tasks;
    } catch (error) {
        console.error('Error getting all tasks:', error);
        return [];
    }
};

/**
 * 작업 상세 정보를 가져옵니다
 */
export const getTaskById = async (taskId: string): Promise<Task | null> => {
    try {
        const taskDoc = await getDoc(doc(db, 'tasks', taskId));

        if (!taskDoc.exists()) {
            return null;
        }

        const data = taskDoc.data();
        return {
            id: taskDoc.id,
            title: data.title,
            description: data.description,
            status: data.status,
            userId: data.userId,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
            dueDate: data.dueDate?.toDate(),
            category: data.category,
            priority: data.priority,
        };
    } catch (error) {
        console.error('Error getting task:', error);
        return null;
    }
}; 