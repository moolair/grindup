import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';

interface IconProps {
    size?: number;
    color?: string;
}

// 플러스 아이콘
export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon name="plus" size={size} color={color} />;
};

// 홈 아이콘
export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon name="home" size={size} color={color} />;
};

// 차트 아이콘
export const ChartIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon name="chart-bar" size={size} color={color} />;
};

// 사용자 아이콘
export const UserIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon name="account" size={size} color={color} />;
};

// 설정 아이콘
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon name="cog" size={size} color={color} />;
};

// 뒤로가기 아이콘
export const ChevronLeftIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon name="chevron-left" size={size} color={color} />;
};

export default {
    PlusIcon,
    HomeIcon,
    ChartIcon,
    UserIcon,
    SettingsIcon,
    ChevronLeftIcon,
}; 