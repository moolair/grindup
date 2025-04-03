import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
    ViewStyle,
    StyleProp,
    ImageSourcePropType,
    ImageStyle
} from 'react-native';

export type AvatarSize = 'small' | 'medium' | 'large';

interface AvatarProps {
    source?: ImageSourcePropType;
    name?: string;
    size?: AvatarSize;
    style?: StyleProp<ViewStyle>;
    backgroundColor?: string;
}

const getInitials = (name: string): string => {
    if (!name) return '';

    const parts = name.split(' ');
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getSizeStyle = (size: AvatarSize) => {
    switch (size) {
        case 'small':
            return {
                containerSize: 32,
                fontSize: 12,
            };
        case 'large':
            return {
                containerSize: 64,
                fontSize: 24,
            };
        case 'medium':
        default:
            return {
                containerSize: 48,
                fontSize: 18,
            };
    }
};

export const Avatar: React.FC<AvatarProps> = ({
    source,
    name,
    size = 'medium',
    style,
    backgroundColor = '#5C6BC0',
}) => {
    const { containerSize, fontSize } = getSizeStyle(size);
    const containerStyle = {
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        backgroundColor,
    };

    if (source) {
        return (
            <Image
                source={source}
                style={[containerStyle, styles.image, style as StyleProp<ImageStyle>]}
            />
        );
    }

    return (
        <View style={[containerStyle, styles.container, style]}>
            {name ? (
                <Text style={[styles.initials, { fontSize }]}>
                    {getInitials(name)}
                </Text>
            ) : (
                <View style={styles.placeholder} />
            )}
        </View>
    );
};

interface AvatarGroupProps {
    avatars: Array<{
        source?: ImageSourcePropType;
        name?: string;
    }>;
    max?: number;
    size?: AvatarSize;
    style?: StyleProp<ViewStyle>;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
    avatars,
    max = 3,
    size = 'medium',
    style,
}) => {
    const { containerSize } = getSizeStyle(size);
    const offset = containerSize / 3;

    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    return (
        <View style={[styles.groupContainer, style]}>
            {visibleAvatars.map((avatar, index) => (
                <View
                    key={index}
                    style={[
                        styles.overlappingAvatar,
                        {
                            zIndex: visibleAvatars.length - index,
                            marginLeft: index > 0 ? -offset : 0
                        },
                    ]}
                >
                    <Avatar
                        source={avatar.source}
                        name={avatar.name}
                        size={size}
                    />
                </View>
            ))}

            {remainingCount > 0 && (
                <View
                    style={[
                        styles.overlappingAvatar,
                        {
                            zIndex: 0,
                            marginLeft: -offset
                        },
                    ]}
                >
                    <View
                        style={[
                            {
                                width: containerSize,
                                height: containerSize,
                                borderRadius: containerSize / 2,
                            },
                            styles.remainingContainer,
                        ]}
                    >
                        <Text style={[styles.remainingText, { fontSize: fontSize * 0.8 }]}>
                            +{remainingCount}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const fontSize = 18;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        resizeMode: 'cover',
    },
    initials: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    placeholder: {
        width: '60%',
        height: '60%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 100,
    },
    groupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    overlappingAvatar: {
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderRadius: 100,
    },
    remainingContainer: {
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    remainingText: {
        color: '#757575',
        fontWeight: '600',
    },
}); 