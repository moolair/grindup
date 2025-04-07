declare module 'react-native-vector-icons/MaterialIcons' {
    import { Component } from 'react';
    import { ImageSourcePropType, StyleProp, TextStyle } from 'react-native';

    interface IconProps {
        name: string;
        size?: number;
        color?: string;
        style?: StyleProp<TextStyle>;
    }

    class Icon extends Component<IconProps> {
        static getImageSource(
            name: string,
            size?: number,
            color?: string,
        ): Promise<ImageSourcePropType>;
    }

    export default Icon;
} 