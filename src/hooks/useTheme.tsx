import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeColors, ThemeType, getTheme } from '../constants/theme';

interface ThemeContextType {
    theme: ThemeColors;
    isDark: boolean;
    toggleTheme: () => void;
    setDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@GrindUp:theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const deviceTheme = useColorScheme();
    const [themeType, setThemeType] = useState<ThemeType>('light');

    // 저장된 테마 설정 불러오기
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme) {
                    setThemeType(savedTheme as ThemeType);
                } else if (deviceTheme) {
                    // 저장된 설정이 없으면 시스템 설정 사용
                    setThemeType(deviceTheme as ThemeType);
                }
            } catch (error) {
                console.error('Error loading theme:', error);
            }
        };

        loadTheme();

        // 시스템 테마 변경 감지
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            // 사용자가 직접 설정하지 않은 경우에만 시스템 설정 따름
            loadTheme();
        });

        return () => subscription.remove();
    }, [deviceTheme]);

    // 테마 변경 및 저장
    const setDarkMode = async (isDark: boolean) => {
        const newTheme: ThemeType = isDark ? 'dark' : 'light';
        setThemeType(newTheme);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    // 토글 함수
    const toggleTheme = () => {
        setDarkMode(themeType === 'light');
    };

    // 현재 테마 객체
    const theme = getTheme(themeType);
    const isDark = themeType === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default useTheme; 