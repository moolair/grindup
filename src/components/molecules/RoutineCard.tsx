import React, { useRef, useState, useEffect, useCallback } from 'react';
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
    SharedValue,
    withDecay
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
    color?: string;
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
    onDragStart?: () => void;
    onDragUpdate?: (position: number) => void;
    onDragEnd?: (position: number) => void;
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
    editMode = false,
    onDragStart,
    onDragUpdate,
    onDragEnd
}) => {
    const { theme } = useTheme();
    const [isDragging, setIsDragging] = useState(false);

    // 분류 색상 가져오기 (각 루틴 분류마다 다른 색상)
    const getCategoryColor = useCallback(() => {
        // 루틴에 직접 color 속성이 있으면 그 값을 우선적으로 사용
        if (routine.color) {
            return routine.color;
        }

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
    }, [routine.category, routine.status, routine.color, theme.colors.ui]);

    // Reanimated shared values
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const zIndex = useSharedValue(0);
    const offsetY = useSharedValue(0); // 드래그 오프셋 추가

    // 드래그 제스처 관련 변수 추가
    const initialY = useSharedValue(0);
    const dragActivationThreshold = 5; // 드래그 활성화 임계값 (픽셀 단위)

    // UI 스레드에서 사용할 색상 값을 미리 계산하여 공유 값으로 저장
    const categoryColorRef = useSharedValue(
        routine.status === 'completed'
            ? theme.colors.ui.success
            : getCategoryColor()
    );

    // 카드 배경색 업데이트
    const [cardBackgroundColor, setCardBackgroundColor] = useState(
        routine.status === 'completed'
            ? theme.colors.ui.success
            : theme.type === 'dark' ? theme.colors.surface.secondary : '#FFFFFF' // 다크 모드 대응
    );

    // 메모리 정리 함수 개선 - 컴포넌트 언마운트 시 관련 리소스 해제
    useEffect(() => {
        return () => {
            // 모든 애니메이션 값을 안전하게 초기화
            // 애니메이션 취소 및 공유 값 초기화
            if (translateX) translateX.value = 0;
            if (translateY) translateY.value = 0;
            if (scale) scale.value = 1;
            if (zIndex) zIndex.value = 0;
            if (offsetY) offsetY.value = 0;
            if (initialY) initialY.value = 0;

            // 모든 이벤트 핸들러 참조 제거
            if (onDragStart) onDragStart = undefined;
            if (onDragUpdate) onDragUpdate = undefined;
            if (onDragEnd) onDragEnd = undefined;
        };
    }, []);

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

    // 안전한 스와이프 제스처 구현
    const safeUpdateTranslateX = useCallback((value: number) => {
        try {
            translateX.value = value;
        } catch (error) {
            console.error('스와이프 업데이트 오류:', error);
        }
    }, [translateX]);

    // 스와이프 제스처 구현
    const swipeGesture = Gesture.Pan()
        .enabled(!isDraggable && editMode)
        .onBegin(() => {
            'worklet';
            try {
                translateX.value = 0;
            } catch (error) {
                console.error('스와이프 시작 오류:', error);
            }
        })
        .onUpdate((event) => {
            'worklet';
            try {
                // 양방향 스와이프 허용 - 저항감 추가 (스와이프가 멀어질수록 느려짐)
                const dampingFactor = 0.8;
                translateX.value = event.translationX > 0
                    ? event.translationX * dampingFactor
                    : event.translationX * dampingFactor;
            } catch (error) {
                console.error('스와이프 업데이트 오류:', error);
            }
        })
        .onEnd((event) => {
            'worklet';
            try {
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
            } catch (error) {
                console.error('스와이프 종료 오류:', error);
                // 오류 발생 시 기본 위치로 리셋
                translateX.value = withSpring(0);
            }
        })
        .onFinalize(() => {
            'worklet';
            try {
                // 제스처가 취소된 경우 애니메이션 상태 리셋
                if (Math.abs(translateX.value) < 50) {
                    translateX.value = withSpring(0, {
                        damping: 15,
                        stiffness: 150
                    });
                }
            } catch (error) {
                console.error('스와이프 종료 확인 오류:', error);
            }
        });

    // 드래그 제스처
    const dragGesture = Gesture.Pan()
        .enabled(isDraggable)
        .manualActivation(true)
        .onTouchesDown((e, state) => {
            'worklet';
            initialY.value = e.allTouches[0].absoluteY;
        })
        .onTouchesMove((e, state) => {
            'worklet';
            // 수직 이동이 충분히 크면 활성화
            if (Math.abs(e.allTouches[0].absoluteY - initialY.value) > dragActivationThreshold) {
                state.activate();
            }
        })
        .onStart(() => {
            'worklet';
            try {
                // 드래그 시작 시, z-index 증가
                zIndex.value = 100;
                scale.value = withSpring(1.02, { damping: 20, stiffness: 200 });

                // 부모 컴포넌트에 드래그 시작 알림
                if (onDragStart) {
                    runOnJS(onDragStart)();
                }

                // UI 스레드에서 실행할 함수
                runOnJS(setIsDragging)(true);

                // 초기 위치 저장
                offsetY.value = translateY.value;
            } catch (error) {
                console.error('드래그 시작 오류:', error);
                runOnJS(setIsDragging)(false);
            }
        })
        .onUpdate((event) => {
            'worklet';
            try {
                // Y축 이동 (세로 방향 정렬)
                translateY.value = offsetY.value + event.translationY;

                // 드래그 위치 업데이트
                if (onDragUpdate) {
                    runOnJS(onDragUpdate)(translateY.value);
                }
            } catch (error) {
                console.error('드래그 업데이트 오류:', error);
            }
        })
        .onEnd((event) => {
            'worklet';
            try {
                // 현재 위치 값 임시 저장
                const currentPosition = translateY.value;

                // 드래그 종료 시 위치 정보 전달 (최종 위치 값만 전달)
                if (onDragEnd) {
                    runOnJS(onDragEnd)(currentPosition);
                }

                // 드래그 애니메이션을 즉시 중지하고 값을 0으로 설정
                cancelAnimation(translateY);
                translateY.value = 0;
                offsetY.value = 0;

                // 시각적 효과(스케일, z-index)는 유지
                scale.value = withSpring(1, {
                    damping: 20,
                    stiffness: 200,
                    mass: 0.5
                });

                zIndex.value = withTiming(0, { duration: 200 });

                // UI 스레드에서 실행할 함수
                runOnJS(setIsDragging)(false);
            } catch (error) {
                console.error('드래그 종료 오류:', error);
                // 오류 발생 시 모든 값 초기화
                translateY.value = 0;
                offsetY.value = 0;
                scale.value = withSpring(1);
                zIndex.value = withTiming(0);
                runOnJS(setIsDragging)(false);
            }
        })
        .onFinalize(() => {
            'worklet';
            try {
                // 모든 상황에서 애니메이션 상태 리셋 보장
                cancelAnimation(translateY);
                translateY.value = 0;
                offsetY.value = 0;

                if (scale.value !== 1) {
                    scale.value = withSpring(1, { damping: 20, stiffness: 200 });
                }
                if (zIndex.value !== 0) {
                    zIndex.value = withTiming(0, { duration: 300 });
                }

                // UI 스레드 작업 보장
                if (isDragging) {
                    runOnJS(setIsDragging)(false);
                }
            } catch (error) {
                console.error('드래그 마무리 오류:', error);
            }
        });

    // 업데이트된 카테고리 색상 함수
    const updateCategoryColor = useCallback(() => {
        try {
            const color = getCategoryColor();
            categoryColorRef.value = color;
            return color;
        } catch (error) {
            console.error('카테고리 색상 업데이트 중 오류:', error);
            // 오류 발생 시 기본 색상 사용
            return theme.colors.ui.primary;
        }
    }, [getCategoryColor, theme.colors.ui.primary]);

    // 탭 제스처 (클릭 처리)
    const tapGesture = Gesture.Tap()
        .enabled(!isDraggable)
        .onEnd(() => {
            'worklet';
            try {
                // 수정 모드인 경우 편집 화면으로 이동
                if (editMode && onEdit) {
                    runOnJS(onEdit)(routine.id);
                    return;
                }

                // 일반 모드에서는 사용자가 카드 탭 시 상태 토글
                if (onPress) {
                    runOnJS(onPress)(routine.id);

                    // 클릭 시 즉시 배경색 업데이트 (낙관적 UI 업데이트)
                    if (routine.status === 'pending') {
                        // 완료 상태로 변경 시 사용자 지정 색상 또는 성공 색상 사용
                        const completedColor = routine.color || theme.colors.ui.success;
                        runOnJS(setCardBackgroundColor)(completedColor);
                        // 공유 값도 함께 업데이트
                        categoryColorRef.value = completedColor;
                    } else {
                        // 미완료 상태로 변경 시 테마에 따른 기본 배경색 사용
                        const bgColor = theme.type === 'dark' ? theme.colors.surface.secondary : '#FFFFFF';
                        runOnJS(setCardBackgroundColor)(bgColor);
                        // UI 스레드에서 실행
                        runOnJS(updateCategoryColor)();
                    }
                }
            } catch (error) {
                console.error('탭 제스처 오류:', error);
            }
        });

    // 제스처 결합
    const composedGestures = isDraggable
        ? Gesture.Simultaneous(dragGesture, swipeGesture)
        : Gesture.Exclusive(tapGesture, swipeGesture);

    // 카드 이동 애니메이션 스타일 - 오류 처리 강화
    const cardStyle = useAnimatedStyle(() => {
        'worklet';
        try {
            return {
                transform: [
                    { translateX: typeof translateX.value === 'number' ? translateX.value : 0 },
                    { translateY: typeof translateY.value === 'number' ? translateY.value : 0 },
                    { scale: typeof scale.value === 'number' ? scale.value : 1 }
                ],
                zIndex: typeof zIndex.value === 'number' ? zIndex.value : 0,
                shadowOpacity: isDragging ? withSpring(0.3) : withSpring(0.1),
                shadowRadius: isDragging ? withSpring(8) : withSpring(2),
                elevation: isDragging ? withSpring(6) : withSpring(2),
            };
        } catch (error) {
            // 오류 발생 시 기본 스타일 반환
            return {
                transform: [
                    { translateX: 0 },
                    { translateY: 0 },
                    { scale: 1 }
                ],
                zIndex: 0,
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
            };
        }
    });

    // 내용 스타일
    const contentStyle = useAnimatedStyle(() => {
        'worklet';
        return {
            // 완료 상태에서 텍스트는 더 읽기 쉽도록 유지
            opacity: 1
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
        try {
            return {
                backgroundColor: theme.colors.ui.error,
                transform: [
                    {
                        translateX: typeof translateX.value === 'number' && translateX.value < -50 ? 0 : 100
                    },
                ],
            };
        } catch (error) {
            // 오류 발생 시 기본 스타일 반환
            return {
                backgroundColor: theme.colors.ui.error,
                transform: [{ translateX: 100 }],
            };
        }
    });

    // 편집 버튼 애니메이션 스타일
    const editButtonStyle = useAnimatedStyle(() => {
        'worklet';
        try {
            return {
                backgroundColor: theme.colors.ui.secondary,
                transform: [
                    {
                        translateX: typeof translateX.value === 'number' && translateX.value > 50 ? 0 : -100
                    },
                ],
            };
        } catch (error) {
            // 오류 발생 시 기본 스타일 반환
            return {
                backgroundColor: theme.colors.ui.secondary,
                transform: [{ translateX: -100 }],
            };
        }
    });

    // 카드 상태가 변경될 때마다 배경색 업데이트
    useEffect(() => {
        try {
            // 완료된 상태면 사용자가 지정한 색상으로 변경
            if (routine.status === 'completed') {
                setCardBackgroundColor(routine.color || theme.colors.ui.success);
                categoryColorRef.value = routine.color || theme.colors.ui.success;
            } else {
                // 미완료 시 다크 모드에 따라 배경색 설정 (항상 흰색/다크 테마 색상)
                const bgColor = theme.type === 'dark' ? theme.colors.surface.secondary : '#FFFFFF';
                setCardBackgroundColor(bgColor);
                categoryColorRef.value = getCategoryColor();
            }
        } catch (error) {
            console.error('카드 상태 변경 시 배경색 업데이트 오류:', error);
            // 오류 발생 시 기본 색상 사용
            setCardBackgroundColor(theme.type === 'dark' ? theme.colors.surface.secondary : '#FFFFFF');
            categoryColorRef.value = theme.colors.surface.primary;
        }
    }, [routine.status, routine.category, routine.color, theme.colors, theme.type]);

    // 카드 애니메이션 스타일
    const rStyle = useAnimatedStyle(() => {
        'worklet';
        try {
            return {
                transform: [
                    { translateX: translateX.value },
                    { translateY: translateY.value }
                ],
                backgroundColor: routine.status === 'completed'
                    ? routine.color || theme.colors.ui.success
                    : theme.type === 'dark' ? theme.colors.surface.secondary : '#FFFFFF',
                borderColor: getBorderColor(),
            };
        } catch (error) {
            // 오류 발생 시 기본 스타일 반환
            return {
                transform: [
                    { translateX: 0 },
                    { translateY: 0 }
                ],
                backgroundColor: theme.type === 'dark' ? theme.colors.surface.secondary : '#FFFFFF',
                borderColor: theme.colors.border.light,
            };
        }
    });

    // 애니메이션 스타일 정의
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value }
            ],
            zIndex: zIndex.value,
            backgroundColor: routine.status === 'completed'
                ? routine.color || theme.colors.ui.success
                : theme.type === 'dark' ? theme.colors.surface.secondary : '#FFFFFF',
        };
    }, [routine.status, routine.color, theme]);

    // 컴포넌트 리렌더링 시 애니메이션 값 보존
    useEffect(() => {
        const status = routine.status;

        // 애니메이션 값 보존 (초기화 방지)
        if (translateY.value !== 0) {
            offsetY.value = translateY.value;
        }

        return () => {
            // 컴포넌트 업데이트 시에도 오프셋 보존
            if (status === routine.status) {
                offsetY.value = translateY.value;
            } else {
                // 상태가 변경된 경우 리셋
                offsetY.value = 0;
                translateY.value = 0;
            }
        };
    }, [routine.id, routine.status]);

    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={composedGestures}>
                <Animated.View
                    style={[
                        styles.cardContainer,
                        {
                            backgroundColor: routine.status === 'completed'
                                ? routine.color || theme.colors.ui.success
                                : theme.type === 'dark' ? theme.colors.surface.secondary : '#FFFFFF',
                            borderLeftColor: getCategoryColor(),
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
                                        color: routine.status === 'completed'
                                            ? theme.colors.content.inverse  // 완료 시 텍스트 색상 (배경이 진해지므로 반전색)
                                            : theme.type === 'dark' ? '#FFFFFF' : '#000000', // 다크 모드에 따른 텍스트 색상
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
                                            color: routine.status === 'completed'
                                                ? theme.colors.content.inverse  // 완료 시 텍스트 색상 (배경이 진해지므로 반전색)
                                                : theme.type === 'dark' ? '#FFFFFF' : '#000000', // 다크 모드에 따른 텍스트 색상
                                        }
                                    ]}
                                    numberOfLines={1}
                                >
                                    {routine.description}
                                </Text>
                            )}
                        </View>

                        {/* 편집 모드에서 표시되는 편집 버튼 */}
                        {editMode && (
                            <TouchableOpacity
                                style={[styles.editButtonCircle, { backgroundColor: theme.colors.ui.secondary }]}
                                onPress={handleEditPress}
                            >
                                <Text style={[styles.editButtonText, { color: theme.colors.content.inverse }]}>
                                    편집
                                </Text>
                            </TouchableOpacity>
                        )}
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
    editButtonCircle: {
        width: 50,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    editButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default React.memo(RoutineCard); 