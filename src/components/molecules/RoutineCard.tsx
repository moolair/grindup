import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, GestureResponderEvent, PanResponderGestureState, NativeSyntheticEvent } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    useAnimatedGestureHandler,
    cancelAnimation,
    useAnimatedReaction
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    category?: string;
    dueDate?: Date;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    order?: number;
}

interface RoutineCardProps {
    routine: Task;
    onPress: (id: string) => void;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
    onReorder?: (id: string, newOrder: number) => void;
    isDraggable?: boolean;
    index?: number;
    onDragStateChange?: (dragging: boolean) => void;
}

// 드래그 핸들 컴포넌트
const DragHandle = ({ isDragging, theme }: { isDragging: boolean, theme: any }) => (
    <View style={[
        styles.dragHandle,
        isDragging && { backgroundColor: theme.colors.background.secondary }
    ]}>
        <View style={[styles.dragBar, { backgroundColor: theme.colors.content.tertiary }]} />
        <View style={[styles.dragBar, { backgroundColor: theme.colors.content.tertiary }]} />
        <View style={[styles.dragBar, { backgroundColor: theme.colors.content.tertiary }]} />
    </View>
);

const RoutineCard: React.FC<RoutineCardProps> = ({
    routine,
    onPress,
    onDelete,
    onEdit,
    onReorder,
    isDraggable = false,
    index = 0,
    onDragStateChange
}) => {
    const { theme } = useTheme();
    const [isDragging, setIsDragging] = useState(false);

    // Reanimated shared values
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const zIndex = useSharedValue(0);

    // 컴포넌트가 마운트될 때 초기화
    useEffect(() => {
        return () => {
            // 컴포넌트 언마운트시 애니메이션 상태 리셋 및 진행중인 애니메이션 취소
            cancelAnimation(translateX);
            cancelAnimation(translateY);
            cancelAnimation(scale);
            cancelAnimation(zIndex);

            // 즉시 값들을 기본값으로 설정
            translateX.value = 0;
            translateY.value = 0;
            scale.value = 1;
            zIndex.value = 0;

            // 부모 컴포넌트에 드래그 종료 알림
            if (isDragging && onDragStateChange) {
                onDragStateChange(false);
            }
        };
    }, []);

    // 모든 애니메이션이 완료되었는지 확인하는 반응 추가
    useAnimatedReaction(
        () => {
            'worklet';
            return { x: translateX.value, y: translateY.value };
        },
        (current, previous) => {
            'worklet';
            // 워크렛 내부에서 필요한 로직만 수행
        }
    );

    // 드래그 상태 변경 시 부모 컴포넌트에 알림
    useEffect(() => {
        if (onDragStateChange) {
            onDragStateChange(isDragging);
        }
    }, [isDragging, onDragStateChange]);

    // 활성 상태일 때 강조 효과
    useEffect(() => {
        if (isDragging) {
            // 드래그 시작시 피드백
            Vibration.vibrate(50);
        }
    }, [isDragging]);

    // 스와이프 제스처 구현
    const swipeGesture = Gesture.Pan()
        .enabled(!isDraggable)
        .onBegin(() => {
            'worklet';
            translateX.value = 0;
        })
        .onUpdate((event) => {
            'worklet';
            // 양방향 스와이프 허용 - 저항감 추가 (스와이프가 멀어질수록 느려짐)
            const dampingFactor = 0.8;
            translateX.value = event.translationX > 0
                ? event.translationX * dampingFactor
                : event.translationX * dampingFactor;
        })
        .onEnd((event) => {
            'worklet';
            const THRESHOLD = 80; // 액션 실행 임계값

            // 왼쪽으로 스와이프 (삭제) - 임계값 초과시 버튼이 노출되지만 자동 실행되지 않음
            if (event.translationX < -THRESHOLD) {
                translateX.value = withSpring(-100, {
                    damping: 15,
                    stiffness: 150
                });
            }
            // 오른쪽으로 스와이프 (편집) - 임계값 초과시 버튼이 노출되지만 자동 실행되지 않음
            else if (event.translationX > THRESHOLD) {
                translateX.value = withSpring(100, {
                    damping: 15,
                    stiffness: 150
                });
            }
            // 충분히 스와이프하지 않은 경우 스프링 효과로 부드럽게 원위치
            else {
                translateX.value = withSpring(0, {
                    damping: 15,
                    stiffness: 150
                });
            }
        })
        .onFinalize(() => {
            'worklet';
            // 제스처가 취소된 경우 애니메이션 상태 리셋
            if (Math.abs(translateX.value) < 50) {
                translateX.value = withSpring(0, {
                    damping: 15,
                    stiffness: 150
                });
            }
        });

    // 드래그 제스처 구현
    const dragGesture = Gesture.Pan()
        .enabled(isDraggable)
        .onBegin(() => {
            'worklet';
            if (isDraggable) {
                // 드래그 시작 시 진동 피드백 및 시각적 효과
                runOnJS(setIsDragging)(true);
                runOnJS(Vibration.vibrate)(70);

                // 시각적 피드백 - 카드 확대 및 z-index 증가
                scale.value = withSpring(1.05, { damping: 14 });
                zIndex.value = 1000;

                // 부모 컴포넌트에 드래그 상태 알림
                if (onDragStateChange) {
                    runOnJS(onDragStateChange)(true);
                }
            }
        })
        .onUpdate((event) => {
            'worklet';
            if (isDraggable) {
                // Y축 이동만 허용 (위아래로 드래그)
                translateY.value = event.translationY;
            }
        })
        .onEnd((event) => {
            'worklet';
            if (isDraggable && onReorder) {
                // 카드 높이 기준으로 이동 위치 계산
                const cardHeight = 60;

                // 이동 거리 계산
                const moveDistance = Math.round(event.translationY / cardHeight);

                // 새 인덱스 계산 (0 이상, 최대값은 부모에서 처리)
                const newIndex = Math.max(0, index + moveDistance);

                // 위치 변경이 있을 때만 처리
                if (newIndex !== index) {
                    console.log(`카드 순서 변경: ${index} -> ${newIndex}`);
                    runOnJS(onReorder)(routine.id, newIndex);
                }
            }

            // 드래그 종료 후 애니메이션 처리
            translateY.value = withSpring(0, { damping: 15 }, (finished) => {
                'worklet';
                if (finished) {
                    // 드래그 종료 상태로 변경
                    runOnJS(setIsDragging)(false);

                    // 부모 컴포넌트에 드래그 종료 알림
                    if (onDragStateChange) {
                        runOnJS(onDragStateChange)(false);
                    }
                }
            });

            // 시각적 효과 원상복구
            scale.value = withSpring(1);
            zIndex.value = withTiming(0);
        })
        .onFinalize(() => {
            'worklet';
            // 제스처가 취소된 경우에도 상태 초기화
            if (isDragging) {
                translateY.value = withSpring(0);
                scale.value = withSpring(1);
                zIndex.value = withTiming(0);

                // 드래그 상태 초기화
                runOnJS(setIsDragging)(false);

                // 부모 컴포넌트에 드래그 종료 알림
                if (onDragStateChange) {
                    runOnJS(onDragStateChange)(false);
                }
            }
        });

    // 애니메이션 스타일 정의
    const animatedStyle = useAnimatedStyle(() => {
        'worklet';
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value }
            ],
            zIndex: zIndex.value,
        };
    });

    // 카드 배경 스타일 - 스와이프에 따라 배경색 변경
    const cardBackgroundStyle = useAnimatedStyle(() => {
        'worklet';
        const THRESHOLD = 80;

        // 기본 배경색은 투명
        return {
            backgroundColor: 'transparent',
            // 편집/삭제 영역이 보일 때 약간의 그림자 효과 추가
            shadowOpacity: Math.abs(translateX.value) > 20 ? 0.2 : 0.1,
            shadowRadius: Math.abs(translateX.value) > 20 ? 5 : 3,
        };
    });

    // 편집 버튼 스타일 - 왼쪽
    const editActionStyle = useAnimatedStyle(() => {
        'worklet';
        const THRESHOLD = 80;

        // 오른쪽으로 스와이프 거리에 따른 투명도
        const opacity = translateX.value > 0 ? 1 : 0;

        // 스와이프 거리에 따른 스케일 (0.8~1.0)
        const scale = translateX.value > 0
            ? Math.min(0.8 + (translateX.value / THRESHOLD) * 0.2, 1.0)
            : 0.8;

        return {
            opacity,
            transform: [{ scale }]
        };
    });

    // 삭제 버튼 스타일 - 오른쪽
    const deleteActionStyle = useAnimatedStyle(() => {
        'worklet';
        const THRESHOLD = 80;

        // 왼쪽으로 스와이프 거리에 따른 투명도
        const opacity = translateX.value < 0 ? 1 : 0;

        // 스와이프 거리에 따른 스케일 (0.8~1.0)
        const scale = translateX.value < 0
            ? Math.min(0.8 + (Math.abs(translateX.value) / THRESHOLD) * 0.2, 1.0)
            : 0.8;

        return {
            opacity,
            transform: [{ scale }]
        };
    });

    // 카테고리에 따른 색상 선택
    const getCategoryColor = () => {
        if (!routine.category) return theme.colors.background.secondary;

        switch (routine.category.toLowerCase()) {
            case '건강':
                return theme.colors.ui.success;
            case '업무':
                return theme.colors.ui.primary;
            case '개인':
                return theme.colors.ui.accent;
            default:
                return theme.colors.background.secondary;
        }
    };

    // 삭제 액션 버튼 클릭 핸들러
    const handleDeletePress = () => {
        if (onDelete) {
            // 삭제 액션 실행만 하고 카드 위치는 초기화하지 않음
            // 서버/데이터베이스 응답 후 부모 컴포넌트에서 상태 업데이트 시 자동으로 리렌더링됨
            onDelete(routine.id);

            // 위치 초기화를 하지 않음으로써 삭제 중인 시각적 상태를 유지
            // translateX.value = withTiming(0); // 이 코드를 제거하거나 주석 처리
        }
    };

    // 편집 액션 버튼 클릭 핸들러
    const handleEditPress = () => {
        if (onEdit) {
            // 편집 액션 실행만 하고 카드 위치는 초기화하지 않음
            // 서버/데이터베이스 응답 후 부모 컴포넌트에서 상태 업데이트 시 자동으로 리렌더링됨
            onEdit(routine.id);

            // 위치 초기화를 하지 않음으로써 편집 중인 시각적 상태를 유지
            // translateX.value = withTiming(0); // 이 코드를 제거하거나 주석 처리
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 0 }}>
            <View style={styles.container}>
                <View style={styles.rowBack}>
                    {/* 왼쪽에 표시될 편집 버튼 (오른쪽으로 스와이프) */}
                    <Animated.View style={editActionStyle}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.colors.ui.primary }]}
                            onPress={handleEditPress}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.actionButtonText}>편집</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* 오른쪽에 표시될 삭제 버튼 (왼쪽으로 스와이프) */}
                    <Animated.View style={deleteActionStyle}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.colors.ui.error }]}
                            onPress={handleDeletePress}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.actionButtonText}>삭제</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <GestureDetector gesture={Gesture.Simultaneous(swipeGesture, dragGesture)}>
                    <Animated.View
                        style={[
                            styles.cardContainer,
                            {
                                backgroundColor: routine.status === 'completed'
                                    ? theme.colors.background.secondary
                                    : theme.colors.background.primary,
                                borderLeftColor: getCategoryColor(),
                                shadowOpacity: isDragging ? 0.3 : 0.1,
                                elevation: isDragging ? 10 : 3,
                                borderColor: isDragging ? theme.colors.ui.primary : 'transparent',
                                borderWidth: isDragging ? 1 : 0
                            },
                            animatedStyle,
                            cardBackgroundStyle
                        ]}
                    >
                        <View style={styles.cardWrapper}>
                            {/* 카드 내용 */}
                            <TouchableOpacity
                                style={styles.cardContent}
                                onPress={() => !isDraggable && onPress(routine.id)}
                                onLongPress={() => {
                                    if (isDraggable && !isDragging) {
                                        setIsDragging(true);
                                        translateX.value = 0;
                                        translateY.value = 0;
                                        scale.value = withSpring(1.05, { damping: 14 });
                                        zIndex.value = withTiming(1000, { duration: 200 });
                                    }
                                }}
                                delayLongPress={200}
                                activeOpacity={0.7}
                                disabled={isDragging}
                            >
                                <View style={styles.titleRow}>
                                    <View style={styles.titleContainer}>
                                        <Text
                                            style={[
                                                styles.title,
                                                { color: theme.colors.content.primary },
                                                routine.status === 'completed' && styles.completedText
                                            ]}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {routine.title}
                                        </Text>
                                        {routine.description && (
                                            <Text
                                                style={[
                                                    styles.description,
                                                    { color: theme.colors.content.secondary },
                                                    routine.status === 'completed' && styles.completedText
                                                ]}
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                                {routine.description}
                                            </Text>
                                        )}
                                    </View>
                                    {isDraggable && (
                                        <TouchableOpacity
                                            style={[
                                                styles.dragHandleContainer,
                                                isDragging && styles.dragHandleContainerActive
                                            ]}
                                            onPress={() => {
                                                if (isDraggable && !isDragging) {
                                                    setIsDragging(true);
                                                    translateX.value = 0;
                                                    translateY.value = 0;
                                                    scale.value = withSpring(1.05, { damping: 14 });
                                                    zIndex.value = withTiming(1000, { duration: 200 });
                                                }
                                            }}
                                            activeOpacity={0.5}
                                            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                        >
                                            <DragHandle isDragging={isDragging} theme={theme} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>

                        {isDraggable && (
                            <View
                                style={[
                                    styles.dragOverlay,
                                    {
                                        opacity: isDragging ? 0.1 : 0,
                                        backgroundColor: theme.colors.ui.primary
                                    }
                                ]}
                                pointerEvents="none"
                            />
                        )}
                    </Animated.View>
                </GestureDetector>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        height: 60,
        marginBottom: 8,
    },
    cardContainer: {
        width: '100%',
        borderRadius: 8,
        borderLeftWidth: 3,
        overflow: 'hidden',
        height: 60, // 카드 높이 고정
    },
    cardWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        height: '100%',
    },
    cardContent: {
        flex: 1,
        padding: 12,
        backgroundColor: 'transparent',
        zIndex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 5, // 체크박스 제거 후 왼쪽 여백 추가
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    description: {
        fontSize: 12,
        marginTop: 2,
    },
    dragHandleContainer: {
        padding: 8,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dragHandleContainerActive: {
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    dragHandle: {
        width: 20,
        height: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
        borderRadius: 4,
    },
    dragBar: {
        width: 14,
        height: 2,
        borderRadius: 1,
        marginVertical: 1,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8,
    },
    categoryText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '500',
    },
    statusIcon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmark: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    dragOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        zIndex: 1,
        pointerEvents: 'none',
    },
    completedText: {
        textDecorationLine: 'line-through',
        opacity: 0.7,
    },
    rowBack: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        zIndex: -1, // 카드 아래에 위치
    },
    actionButton: {
        minWidth: 58,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
});

export default RoutineCard; 