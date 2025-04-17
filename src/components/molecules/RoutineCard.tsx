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
    useAnimatedReaction,
    interpolate,
    Easing,
    SharedValue
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
    editMode?: boolean;
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
    onDragStateChange,
    editMode = false
}) => {
    const { theme } = useTheme();
    const [isDragging, setIsDragging] = useState(false);

    // 분류 색상 가져오기 (각 루틴 분류마다 다른 색상)
    const getCategoryColor = () => {
        switch (routine.category) {
            case 'health':
                return theme.colors.ui.success;
            case 'work':
                return theme.colors.ui.primary;
            case 'personal':
                return theme.colors.ui.accent;
            case 'study':
                return theme.colors.ui.secondary;
            case 'fitness':
                return theme.colors.ui.success;
            case 'social':
                return theme.colors.ui.accent;
            default:
                return routine.status === 'completed'
                    ? theme.colors.ui.success
                    : theme.colors.ui.primary;
        }
    };

    // Reanimated shared values
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const zIndex = useSharedValue(0);

    // 완료 애니메이션을 위한 새로운 shared value
    const completionProgress = useSharedValue(0);

    // 물결 애니메이션의 색상을 공유값으로 저장
    const [waveColor, setWaveColor] = useState('');

    // UI 스레드에서 사용할 색상 값을 미리 계산하여 공유 값으로 저장
    const categoryColorRef = useSharedValue(
        routine.status === 'completed'
            ? theme.colors.ui.success
            : getCategoryColor()
    );

    // 분류 색상에 투명도 적용
    const getCategoryColorWithOpacity = () => {
        const baseColor = getCategoryColor();
        return routine.status === 'completed'
            ? theme.colors.ui.success
            : baseColor;
    };

    // 물결 색상을 업데이트
    useEffect(() => {
        setWaveColor(getCategoryColorWithOpacity());
    }, [routine.status, routine.category]);

    // 컴포넌트가 마운트될 때 초기화
    useEffect(() => {
        // 루틴 상태가 변경될 때마다 애니메이션 업데이트
        if (routine.status === 'completed') {
            completionProgress.value = withTiming(1, {
                duration: 800,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1)
            });
        } else {
            completionProgress.value = withTiming(0, {
                duration: 300,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1)
            });
        }

        return () => {
            // 컴포넌트 언마운트시 애니메이션 상태 리셋 및 진행중인 애니메이션 취소
            cancelAnimation(translateX);
            cancelAnimation(translateY);
            cancelAnimation(scale);
            cancelAnimation(zIndex);
            cancelAnimation(completionProgress);

            // 즉시 값들을 기본값으로 설정
            translateX.value = 0;
            translateY.value = 0;
            scale.value = 1;
            zIndex.value = 0;
            completionProgress.value = 0;

            // 부모 컴포넌트에 드래그 종료 알림
            if (isDragging && onDragStateChange) {
                onDragStateChange(false);
            }
        };
    }, [routine.status]);

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
        .enabled(!isDraggable && editMode)
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

    // 탭 제스처 (클릭 처리)
    const tapGesture = Gesture.Tap()
        .enabled(!isDraggable)
        .onEnd(() => {
            'worklet';
            // 사용자가 카드 탭 시 상태 토글
            if (onPress) {
                runOnJS(onPress)(routine.id);

                // 클릭 시 즉시 애니메이션 시작 (낙관적 UI 업데이트)
                if (routine.status === 'pending') {
                    // 애니메이션 완료로 전환
                    completionProgress.value = withTiming(1, {
                        duration: 800,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                    });

                    // 색상 즉시 업데이트 (완료 상태로)
                    runOnJS(setWaveColor)(theme.colors.ui.success);
                    // 공유 값도 함께 업데이트
                    categoryColorRef.value = theme.colors.ui.success;
                } else {
                    // 애니메이션 미완료로 전환
                    completionProgress.value = withTiming(0, {
                        duration: 300,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                    });

                    // 색상 즉시 업데이트 (미리 계산된 색상 사용)
                    runOnJS(setWaveColor)(
                        routine.status === 'completed'
                            ? theme.colors.ui.success
                            : getCategoryColor()
                    );
                    // 공유 값도 함께 업데이트
                    categoryColorRef.value =
                        routine.status === 'completed'
                            ? theme.colors.ui.success
                            : getCategoryColor();
                }
            }
        });

    // 제스처 결합
    const combinedGesture = Gesture.Exclusive(dragGesture, Gesture.Simultaneous(swipeGesture, tapGesture));

    // 카드 이동 애니메이션 스타일
    const cardStyle = useAnimatedStyle(() => {
        'worklet';
        return {
            transform: [
                { translateX: typeof translateX.value === 'number' ? translateX.value : 0 },
                { translateY: typeof translateY.value === 'number' ? translateY.value : 0 },
                { scale: scale.value }
            ],
            zIndex: zIndex.value,
        };
    });

    // 물결 애니메이션 스타일
    const waveAnimationStyle = useAnimatedStyle(() => {
        'worklet';
        const progress = typeof completionProgress.value === 'number' ? completionProgress.value : 0;

        // 물결 색상 안전하게 가져오기
        const safeColor = categoryColorRef?.value || waveColor || theme.colors.ui.primary;

        return {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: `${progress * 100}%`, // 완료 진행률에 따른 너비
            backgroundColor: safeColor, // 안전한 색상 값 사용
            borderRadius: 12, // 카드와 동일한 모서리 둥글기
            opacity: 0.6 // 베이스 카드 내용이 보이도록 투명도 설정
        };
    });

    // 완료 상태에 따른 내용 스타일
    const contentStyle = useAnimatedStyle(() => {
        'worklet';
        // 완료 상태에 따라 텍스트 색상 변경 (밝은 색으로)
        const progress = typeof completionProgress.value === 'number' ? completionProgress.value : 0;
        const textColorOpacity = interpolate(
            progress,
            [0, 1],
            [1, 0.8] // 완료시 약간 밝게
        );

        return {
            opacity: textColorOpacity
        };
    });

    // 삭제 버튼 동작
    const handleDeletePress = () => {
        if (onDelete) {
            Vibration.vibrate(30); // 짧은 진동 피드백
            onDelete(routine.id);
        }
    };

    // 편집 버튼 동작
    const handleEditPress = () => {
        if (onEdit) {
            Vibration.vibrate(30); // 짧은 진동 피드백
            onEdit(routine.id);
        }
    };

    // 카드 왼쪽 테두리 색상
    const getBorderColor = () => {
        return routine.status === 'completed'
            ? theme.colors.ui.success
            : getCategoryColor();
    };

    // 상태가 변경될 때마다 공유 값 업데이트
    useEffect(() => {
        categoryColorRef.value = routine.status === 'completed'
            ? theme.colors.ui.success
            : getCategoryColor();
    }, [routine.status, routine.category]);

    // 삭제 버튼 애니메이션 스타일
    const deleteButtonStyle = useAnimatedStyle(() => {
        'worklet';
        return {
            backgroundColor: theme.colors.ui.error,
            transform: [
                {
                    translateX: typeof translateX.value === 'number' && translateX.value < -50 ? 0 : 100
                },
            ],
        };
    });

    // 편집 버튼 애니메이션 스타일
    const editButtonStyle = useAnimatedStyle(() => {
        'worklet';
        return {
            backgroundColor: theme.colors.ui.secondary,
            transform: [
                {
                    translateX: typeof translateX.value === 'number' && translateX.value > 50 ? 0 : -100
                },
            ],
        };
    });

    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={combinedGesture}>
                <Animated.View
                    style={[
                        styles.cardContainer,
                        {
                            backgroundColor: theme.colors.surface.primary,
                            borderLeftColor: categoryColorRef?.value || getCategoryColor(),
                            borderLeftWidth: 4,
                            borderRadius: 12,
                            shadowColor: theme.type === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
                        },
                        cardStyle,
                        isDragging && {
                            elevation: 5,
                            shadowOpacity: 0.3,
                            shadowRadius: 10,
                            shadowOffset: { width: 0, height: 5 }
                        }
                    ]}
                >
                    {/* 물결 애니메이션 배경 */}
                    <Animated.View style={waveAnimationStyle} />

                    {/* 왼쪽에 드래그 핸들 표시 (editMode가 true일 때) */}
                    {isDraggable && editMode && (
                        <DragHandle isDragging={isDragging} theme={theme} />
                    )}

                    {/* 카드 컨텐츠 */}
                    <Animated.View style={[styles.content, contentStyle]}>
                        <View style={styles.textContainer}>
                            <Text
                                style={[
                                    styles.title,
                                    {
                                        color: theme.colors.content.primary,
                                        // 완료시 취소선 제거 (물결 애니메이션으로 대체)
                                        // textDecorationLine: routine.status === 'completed' ? 'line-through' : 'none' 
                                    }
                                ]}
                                numberOfLines={1}
                            >
                                {routine.title}
                            </Text>
                            {routine.description && (
                                <Text
                                    style={[
                                        styles.description,
                                        {
                                            color: theme.colors.content.secondary,
                                            // 완료시 취소선 제거 (물결 애니메이션으로 대체)
                                            // textDecorationLine: routine.status === 'completed' ? 'line-through' : 'none' 
                                        }
                                    ]}
                                    numberOfLines={1}
                                >
                                    {routine.description}
                                </Text>
                            )}
                        </View>
                    </Animated.View>

                    {/* 왼쪽으로 스와이프 시 나타나는 삭제 버튼 (오른쪽에 위치) */}
                    <Animated.View
                        style={[
                            styles.rightActionContainer,
                            deleteButtonStyle
                        ]}
                    >
                        <TouchableOpacity onPress={handleDeletePress} style={styles.actionButton}>
                            <Text style={[styles.actionText, { color: theme.colors.content.inverse }]}>
                                삭제
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* 오른쪽으로 스와이프 시 나타나는 편집 버튼 (왼쪽에 위치) */}
                    <Animated.View
                        style={[
                            styles.leftActionContainer,
                            editButtonStyle
                        ]}
                    >
                        <TouchableOpacity onPress={handleEditPress} style={styles.actionButton}>
                            <Text style={[styles.actionText, { color: theme.colors.content.inverse }]}>
                                편집
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        paddingVertical: 12,
        paddingHorizontal: 12,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        minHeight: 60,
        overflow: 'hidden', // 중요: 물결 애니메이션이 카드 바깥으로 넘치지 않도록
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1, // 물결 애니메이션 위에 보이도록
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        marginTop: 2,
    },
    rightActionContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
    },
    leftActionContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    actionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
    },
    actionText: {
        fontWeight: '600',
        fontSize: 16,
    },
    dragHandle: {
        width: 30,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        borderRadius: 8,
    },
    dragBar: {
        width: 20,
        height: 2,
        borderRadius: 2,
        marginVertical: 2,
    },
});

export default RoutineCard; 