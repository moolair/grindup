import { ColorSchemeName } from 'react-native';

export type ThemeType = 'light' | 'dark';

export interface ThemeColors {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
    card: string;
    border: string;
    notification: string;
    error: string;
    success: string;
    warning: string;
    inactive: string;
    input: {
        background: string;
        text: string;
        border: string;
        placeholder: string;
    };
    switch: {
        track: {
            active: string;
            inactive: string;
        };
        thumb: {
            active: string;
            inactive: string;
        };
    };
}

export const LightTheme: ThemeColors = {
    background: '#FFFFFF',
    text: '#2C3E50',
    primary: '#3366FF',
    secondary: '#6C5CE7',
    accent: '#00C9A7',
    card: '#FFFFFF',
    border: '#F5F6FA',
    notification: '#3366FF',
    error: '#FF6B6B',
    success: '#00B894',
    warning: '#FDCB6E',
    inactive: '#8395A7',
    input: {
        background: '#FFFFFF',
        text: '#2C3E50',
        border: '#D1D8E0',
        placeholder: '#8395A7',
    },
    switch: {
        track: {
            active: '#3366FF',
            inactive: '#e9e9e9',
        },
        thumb: {
            active: '#FFFFFF',
            inactive: '#f4f3f4',
        },
    },
};

export const DarkTheme: ThemeColors = {
    background: '#121212',
    text: '#FFFFFF',
    primary: '#3366FF',
    secondary: '#6C5CE7',
    accent: '#00C9A7',
    card: '#1E1E1E',
    border: '#2C2C2C',
    notification: '#3366FF',
    error: '#FF6B6B',
    success: '#00B894',
    warning: '#FDCB6E',
    inactive: '#8395A7',
    input: {
        background: '#2C2C2C',
        text: '#FFFFFF',
        border: '#3C3C3C',
        placeholder: '#8395A7',
    },
    switch: {
        track: {
            active: '#3366FF',
            inactive: '#3C3C3C',
        },
        thumb: {
            active: '#FFFFFF',
            inactive: '#8395A7',
        },
    },
};

export const getTheme = (colorScheme: ColorSchemeName | ThemeType): ThemeColors => {
    return colorScheme === 'dark' ? DarkTheme : LightTheme;
}; 