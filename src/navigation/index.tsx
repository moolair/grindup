import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';
import { useAuthState } from '../hooks/useAuth';

// Screens
import Dashboard from '../screens/Dashboard';
import TasksList from '../screens/Tasks/TasksList';
import TaskDetail from '../screens/Tasks/TaskDetail';
import CreateTask from '../screens/Tasks/CreateTask';
import Analytics from '../screens/Analytics';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import Onboarding from '../screens/Auth/Onboarding';

// Icons
import { HomeIcon, ChartIcon, UserIcon, SettingsIcon, ChecklistIcon } from '../components/Icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TasksStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TasksListScreen" component={TasksList} />
        <Stack.Screen name="TaskDetail" component={TaskDetail} />
        <Stack.Screen name="CreateTask" component={CreateTask} />
    </Stack.Navigator>
);

const MainTabs = () => (
    <Tab.Navigator
        screenOptions={{
            tabBarStyle: {
                borderTopWidth: 0,
                elevation: 0,
                shadowOpacity: 0,
                height: 60,
                paddingBottom: 10,
            },
            tabBarActiveTintColor: '#3366FF',
            tabBarInactiveTintColor: '#8395A7',
            headerShown: false,
        }}
    >
        <Tab.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
                tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
            }}
        />
        <Tab.Screen
            name="Tasks"
            component={TasksStack}
            options={{
                tabBarIcon: ({ color, size }) => <ChecklistIcon color={color} size={size} />,
            }}
        />
        <Tab.Screen
            name="Analytics"
            component={Analytics}
            options={{
                tabBarIcon: ({ color, size }) => <ChartIcon color={color} size={size} />,
            }}
        />
        <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
                tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />,
            }}
        />
        <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
                tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />,
            }}
        />
    </Tab.Navigator>
);

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
    </Stack.Navigator>
);

const RootNavigator = () => {
    const { user, initializing } = useAuthState();

    if (initializing) {
        return null; // Or a splash screen
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen name="Main" component={MainTabs} />
                ) : (
                    <Stack.Screen name="Auth" component={AuthStack} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator; 