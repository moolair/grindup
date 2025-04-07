import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Button as PaperButton, FAB } from 'react-native-paper';

interface ButtonProps {
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    testID?: string;
    children?: React.ReactNode;
    mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
    uppercase?: boolean;
    icon?: string;
    loading?: boolean;
}

interface FloatingActionButtonProps {
    onPress: () => void;
    icon: string;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    testID?: string;
    position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
    color?: string;
    backgroundColor?: string;
    label?: string;
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    style,
    disabled = false,
    testID,
    children,
    mode = 'contained',
    uppercase = false,
    icon,
    loading = false,
}) => {
    return (
        <PaperButton
            mode={mode}
            onPress={onPress}
            disabled={disabled}
            testID={testID}
            style={[styles.button, style]}
            uppercase={uppercase}
            icon={icon}
            loading={loading}
        >
            {children}
        </PaperButton>
    );
};

export const PrimaryButton: React.FC<ButtonProps> = (props) => {
    return <Button {...props} mode="contained" />;
};

export const SecondaryButton: React.FC<ButtonProps> = (props) => {
    return <Button {...props} mode="outlined" />;
};

export const TextButton: React.FC<ButtonProps> = (props) => {
    return <Button {...props} mode="text" />;
};

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    onPress,
    icon,
    style,
    disabled = false,
    position = 'bottomRight',
    testID,
    color,
    backgroundColor,
    label,
    loading = false,
}) => {
    const positionStyle = {
        bottomRight: styles.bottomRight,
        bottomLeft: styles.bottomLeft,
        topRight: styles.topRight,
        topLeft: styles.topLeft,
    }[position];

    return (
        <FAB
            style={[
                styles.fab,
                positionStyle,
                backgroundColor ? { backgroundColor } : null,
                style
            ]}
            icon={icon}
            onPress={onPress}
            disabled={disabled}
            testID={testID}
            color={color}
            label={label}
            loading={loading}
        />
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    fab: {
        position: 'absolute',
        borderRadius: 30,
        zIndex: 999,
    },
    bottomRight: {
        bottom: 24,
        right: 24,
    },
    bottomLeft: {
        bottom: 24,
        left: 24,
    },
    topRight: {
        top: 24,
        right: 24,
    },
    topLeft: {
        top: 24,
        left: 24,
    },
}); 