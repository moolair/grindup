import React from 'react';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useTheme } from './ThemeProvider';

// GrindUp 색상을 Paper 테마에 적용한 커스텀 테마
const createPaperTheme = (type: 'light' | 'dark', colors: any) => {
    const baseTheme = type === 'light' ? MD3LightTheme : MD3DarkTheme;

    return {
        ...baseTheme,
        colors: {
            ...baseTheme.colors,
            primary: colors.ui.primary,
            secondary: colors.ui.secondary,
            background: colors.background.primary,
            surface: colors.surface.primary,
            error: colors.ui.error,
            text: colors.content.primary,
            onBackground: colors.content.primary,
            onSurface: colors.content.primary,
        },
        roundness: 12,
    };
};

// Paper Provider 래퍼 컴포넌트
export const AppPaperProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme } = useTheme();

    // GrindUp 테마를 기반으로 Paper 테마 생성
    const paperTheme = createPaperTheme(theme.type, theme.colors);

    return (
        <PaperProvider theme={paperTheme}>
            {children}
        </PaperProvider>
    );
};

export default AppPaperProvider; 