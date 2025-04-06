import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';

interface FloatingActionButtonProps {
    onPress: () => void;
    icon: React.ReactNode;
    style?: ViewStyle;
    testID?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    onPress,
    icon,
    style,
    testID
}) => {
    return (
        <TouchableOpacity
            style={[styles.fab, style]}
            onPress={onPress}
            activeOpacity={0.8}
            testID={testID}
        >
            {icon}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.PRIMARY[600],
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: COLORS.NEUTRAL.BLACK,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        zIndex: 999,
    },
});

export default FloatingActionButton; 