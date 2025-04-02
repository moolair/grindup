import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';

interface IconProps {
    size?: number;
    color?: string;
}

// 플러스 아이콘
export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }]}>
            <View
                style={[
                    styles.horizontalLine,
                    {
                        width: size * 0.8,
                        height: size * 0.1,
                        backgroundColor: color,
                    },
                ]}
            />
            <View
                style={[
                    styles.verticalLine,
                    {
                        width: size * 0.1,
                        height: size * 0.8,
                        backgroundColor: color,
                    },
                ]}
            />
        </View>
    );
};

// 홈 아이콘
export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }]}>
            <View style={[styles.home, { borderColor: color, width: size * 0.8, height: size * 0.7 }]}>
                <View
                    style={[
                        styles.roof,
                        {
                            borderBottomWidth: size * 0.4,
                            borderLeftWidth: size * 0.4,
                            borderRightWidth: size * 0.4,
                            borderBottomColor: color,
                        },
                    ]}
                />
            </View>
        </View>
    );
};

// 차트 아이콘
export const ChartIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    const barWidth = size * 0.15;
    const gap = size * 0.1;
    const totalBars = 4;

    return (
        <View style={[styles.iconContainer, { width: size, height: size }]}>
            {[...Array(totalBars)].map((_, i) => (
                <View
                    key={i}
                    style={[
                        styles.bar,
                        {
                            width: barWidth,
                            height: size * (0.3 + i * 0.15),
                            backgroundColor: color,
                            left: (i * (barWidth + gap)) + size * 0.1,
                        },
                    ]}
                />
            ))}
        </View>
    );
};

// 사용자 아이콘
export const UserIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }]}>
            <View
                style={[
                    styles.userHead,
                    {
                        width: size * 0.4,
                        height: size * 0.4,
                        borderRadius: size * 0.2,
                        backgroundColor: color,
                    },
                ]}
            />
            <View
                style={[
                    styles.userBody,
                    {
                        width: size * 0.6,
                        height: size * 0.35,
                        borderTopLeftRadius: size * 0.3,
                        borderTopRightRadius: size * 0.3,
                        backgroundColor: color,
                        top: size * 0.45,
                    },
                ]}
            />
        </View>
    );
};

// 설정 아이콘
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }]}>
            <View
                style={[
                    styles.gear,
                    {
                        width: size * 0.4,
                        height: size * 0.4,
                        borderRadius: size * 0.2,
                        borderWidth: size * 0.08,
                        borderColor: color,
                    },
                ]}
            />
            {[...Array(8)].map((_, i) => (
                <View
                    key={i}
                    style={[
                        styles.gearTooth,
                        {
                            width: size * 0.12,
                            height: size * 0.25,
                            backgroundColor: color,
                            transform: [
                                { translateX: size * 0.44 },
                                { translateY: size * 0.375 },
                                { rotate: `${i * 45}deg` },
                                { translateY: -size * 0.23 },
                            ],
                        },
                    ]}
                />
            ))}
        </View>
    );
};

// 뒤로가기 아이콘
export const ChevronLeftIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }]}>
            <View
                style={[
                    styles.chevronLeft,
                    {
                        width: size * 0.6,
                        height: size * 0.6,
                        borderLeftWidth: size * 0.15,
                        borderBottomWidth: size * 0.15,
                        borderColor: color,
                        transform: [{ rotate: '45deg' }],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    horizontalLine: {
        position: 'absolute',
    },
    verticalLine: {
        position: 'absolute',
    },
    home: {
        borderWidth: 2,
        borderTopWidth: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    roof: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        transform: [{ translateY: -10 }],
    },
    bar: {
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
    },
    userHead: {
        position: 'absolute',
        top: 0,
    },
    userBody: {
        position: 'absolute',
    },
    gear: {
        position: 'absolute',
    },
    gearTooth: {
        position: 'absolute',
        borderRadius: 2,
    },
    chevronLeft: {
        position: 'absolute',
        borderStyle: 'solid',
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
});

export default {
    PlusIcon,
    HomeIcon,
    ChartIcon,
    UserIcon,
    SettingsIcon,
    ChevronLeftIcon,
}; 