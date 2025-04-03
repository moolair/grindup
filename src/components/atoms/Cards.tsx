import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    ViewStyle,
    TextStyle,
    StyleProp
} from 'react-native';

interface CardProps {
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ style, children }) => {
    return <View style={[styles.card, style]}>{children}</View>;
};

interface ShadowCardProps {
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    shadowLevel?: 'light' | 'medium' | 'heavy';
}

export const ShadowCard: React.FC<ShadowCardProps> = ({
    style,
    children,
    shadowLevel = 'medium'
}) => {
    const shadowStyle = {
        light: styles.shadowLight,
        medium: styles.shadowMedium,
        heavy: styles.shadowHeavy,
    }[shadowLevel];

    return (
        <View style={[styles.card, shadowStyle, style]}>
            {children}
        </View>
    );
};

interface TouchableCardProps {
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    onPress: () => void;
    disabled?: boolean;
    activeOpacity?: number;
}

export const TouchableCard: React.FC<TouchableCardProps> = ({
    style,
    children,
    onPress,
    disabled = false,
    activeOpacity = 0.7,
}) => {
    return (
        <TouchableOpacity
            style={[styles.card, styles.shadowLight, style]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={activeOpacity}
        >
            {children}
        </TouchableOpacity>
    );
};

interface StatusCardProps {
    title: string;
    value: string | number;
    unit?: string;
    color?: string;
    style?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    valueStyle?: StyleProp<TextStyle>;
}

export const StatusCard: React.FC<StatusCardProps> = ({
    title,
    value,
    unit,
    color = '#5C6BC0',
    style,
    titleStyle,
    valueStyle,
}) => {
    return (
        <ShadowCard style={[styles.statusCard, style]}>
            <Text style={[styles.statusTitle, titleStyle]}>{title}</Text>
            <View style={styles.statusValueContainer}>
                <Text style={[styles.statusValue, { color }, valueStyle]}>
                    {value}
                </Text>
                {unit && <Text style={styles.statusUnit}>{unit}</Text>}
            </View>
        </ShadowCard>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        margin: 8,
    },
    shadowLight: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
    },
    shadowMedium: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    shadowHeavy: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    statusCard: {
        padding: 16,
        minWidth: 150,
    },
    statusTitle: {
        fontSize: 14,
        color: '#8395A7',
        marginBottom: 8,
    },
    statusValueContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    statusValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    statusUnit: {
        fontSize: 14,
        color: '#8395A7',
        marginLeft: 4,
        marginBottom: 3,
    },
}); 