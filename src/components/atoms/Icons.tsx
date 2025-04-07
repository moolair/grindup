import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface IconProps {
    color?: string;
    size?: number;
}

export const PlusIcon = ({ color = '#000', size = 24 }: IconProps) => {
    return <MaterialIcons name="Plus" size={size} color={color} />;
};