import React from 'react';
import { Icon } from 'react-native-paper';
import { COLORS } from '../../constants/colors';

interface IconProps {
    size?: number;
    color?: string;
}

// 플러스 아이콘
export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="plus" size={size} color={color} />;
};

// 홈 아이콘
export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="home" size={size} color={color} />;
};

// 차트 아이콘
export const ChartIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="chart-bar" size={size} color={color} />;
};

// 사용자 아이콘
export const UserIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="account" size={size} color={color} />;
};

// 설정 아이콘
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="cog" size={size} color={color} />;
};

// 왼쪽 화살표 아이콘 (뒤로가기)
export const ChevronLeftIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="chevron-left" size={size} color={color} />;
};

// 오른쪽 화살표 아이콘
export const ChevronRightIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="chevron-right" size={size} color={color} />;
};

// 체크 아이콘
export const CheckIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="check" size={size} color={color} />;
};

// 검색 아이콘
export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="magnify" size={size} color={color} />;
};

// 알림 아이콘
export const NotificationIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="bell" size={size} color={color} />;
};

// 달력 아이콘
export const CalendarIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="calendar" size={size} color={color} />;
};

// 삭제 아이콘
export const DeleteIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="delete" size={size} color={color} />;
};

// 편집 아이콘
export const EditIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="pencil" size={size} color={color} />;
};

// 필터 아이콘
export const FilterIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="filter" size={size} color={color} />;
};

// 정렬 아이콘
export const SortIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="sort" size={size} color={color} />;
};

// 체크리스트 아이콘
export const ChecklistIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.NEUTRAL.BLACK }) => {
    return <Icon source="format-list-checks" size={size} color={color} />;
};

export default {
    PlusIcon,
    HomeIcon,
    ChartIcon,
    UserIcon,
    SettingsIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckIcon,
    SearchIcon,
    NotificationIcon,
    CalendarIcon,
    DeleteIcon,
    EditIcon,
    FilterIcon,
    SortIcon,
    ChecklistIcon,
}; 