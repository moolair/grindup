import React from 'react';
import { TouchableOpacity, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    testID?: string;
    children?: React.ReactNode;
}

interface FloatingActionButtonProps extends ButtonProps {
    icon: React.ReactNode;
    position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
}

export const PrimaryButton: React.FC<ButtonProps> = ({
    onPress,
    style,
    disabled = false,
    testID,
    children,
}) => {
    return (
        <TouchableOpacity
            style={[styles.primaryButton, disabled && styles.disabledButton, style]}
            onPress={onPress}
            disabled={disabled}
            testID={testID}
        >
            {children}
        </TouchableOpacity>
    );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
    onPress,
    style,
    disabled = false,
    testID,
    children,
}) => {
    return (
        <TouchableOpacity
            style={[styles.secondaryButton, disabled && styles.disabledSecondaryButton, style]}
            onPress={onPress}
            disabled={disabled}
            testID={testID}
        >
            {children}
        </TouchableOpacity>
    );
};

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    onPress,
    icon,
    style,
    disabled = false,
    position = 'bottomRight',
    testID,
}) => {
    const positionStyle = {
        bottomRight: styles.bottomRight,
        bottomLeft: styles.bottomLeft,
        topRight: styles.topRight,
        topLeft: styles.topLeft,
    }[position];

    return (
        <TouchableOpacity
            style={[styles.fab, positionStyle, disabled && styles.disabledButton, style]}
            onPress={onPress}
            disabled={disabled}
            testID={testID}
        >
            {icon}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    primaryButton: {
        backgroundColor: '#3366FF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#3366FF',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    disabledButton: {
        backgroundColor: '#ADC2FF',
        opacity: 0.6,
    },
    disabledSecondaryButton: {
        borderColor: '#ADC2FF',
        opacity: 0.6,
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3366FF',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
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