import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';

interface TypographyProps {
    style?: StyleProp<TextStyle>;
    children: React.ReactNode;
    numberOfLines?: number;
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
    onPress?: () => void;
}

export const Heading1: React.FC<TypographyProps> = ({
    style,
    children,
    numberOfLines,
    ellipsizeMode,
    onPress,
}) => (
    <Text
        style={[styles.heading1, style]}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        onPress={onPress}
    >
        {children}
    </Text>
);

export const Heading2: React.FC<TypographyProps> = ({
    style,
    children,
    numberOfLines,
    ellipsizeMode,
    onPress,
}) => (
    <Text
        style={[styles.heading2, style]}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        onPress={onPress}
    >
        {children}
    </Text>
);

export const Heading3: React.FC<TypographyProps> = ({
    style,
    children,
    numberOfLines,
    ellipsizeMode,
    onPress,
}) => (
    <Text
        style={[styles.heading3, style]}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        onPress={onPress}
    >
        {children}
    </Text>
);

export const Subtitle1: React.FC<TypographyProps> = ({
    style,
    children,
    numberOfLines,
    ellipsizeMode,
    onPress,
}) => (
    <Text
        style={[styles.subtitle1, style]}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        onPress={onPress}
    >
        {children}
    </Text>
);

export const Subtitle2: React.FC<TypographyProps> = ({
    style,
    children,
    numberOfLines,
    ellipsizeMode,
    onPress,
}) => (
    <Text
        style={[styles.subtitle2, style]}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        onPress={onPress}
    >
        {children}
    </Text>
);

export const Body1: React.FC<TypographyProps> = ({
    style,
    children,
    numberOfLines,
    ellipsizeMode,
    onPress,
}) => (
    <Text
        style={[styles.body1, style]}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        onPress={onPress}
    >
        {children}
    </Text>
);

export const Body2: React.FC<TypographyProps> = ({
    style,
    children,
    numberOfLines,
    ellipsizeMode,
    onPress,
}) => (
    <Text
        style={[styles.body2, style]}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        onPress={onPress}
    >
        {children}
    </Text>
);

export const Caption: React.FC<TypographyProps> = ({
    style,
    children,
    numberOfLines,
    ellipsizeMode,
    onPress,
}) => (
    <Text
        style={[styles.caption, style]}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        onPress={onPress}
    >
        {children}
    </Text>
);

export const ErrorText: React.FC<TypographyProps> = ({
    style,
    children,
    numberOfLines,
    ellipsizeMode,
    onPress,
}) => (
    <Text
        style={[styles.error, style]}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        onPress={onPress}
    >
        {children}
    </Text>
);

const styles = StyleSheet.create({
    heading1: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#212121',
        marginBottom: 8,
    },
    heading2: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212121',
        marginBottom: 8,
    },
    heading3: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#212121',
        marginBottom: 8,
    },
    subtitle1: {
        fontSize: 18,
        fontWeight: '500',
        color: '#414C57',
        marginBottom: 4,
    },
    subtitle2: {
        fontSize: 16,
        fontWeight: '500',
        color: '#414C57',
        marginBottom: 4,
    },
    body1: {
        fontSize: 16,
        color: '#616161',
        lineHeight: 24,
    },
    body2: {
        fontSize: 14,
        color: '#616161',
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        color: '#8395A7',
    },
    error: {
        fontSize: 14,
        color: '#E57373',
    },
}); 