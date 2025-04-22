import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, Dimensions, TouchableWithoutFeedback, Image, Vibration, FlatList, Easing } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import RoutineCard from '../../components/molecules/RoutineCard';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    category?: string;
    color?: string;
    dueDate?: Date;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    order?: number;
}

interface TaskListProps {
    tasks: Task[];
    onTaskPress: (taskId: string) => void;
    onTaskDelete?: (taskId: string) => void;
    onTaskEdit?: (taskId: string) => void;
    onReorder?: (taskId: string, newOrder: number) => void;
    headerTitle?: string;
    onEditModeChange?: (editMode: boolean) => void;
}

const { width } = Dimensions.get('window');
const DELETE_BUTTON_WIDTH = 70; // 삭제 버튼 너비
const EDIT_BUTTON_WIDTH = 70; // 편집 버튼 너비

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskPress, onTaskDelete, onTaskEdit, onReorder, headerTitle, onEditModeChange }) => {
    const { theme } = useTheme();
    const [swipedTaskId, setSwipedTaskId] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
    const [isDraggingEnabled, setIsDraggingEnabled] = useState(false);
    const [taskPositions, setTaskPositions] = useState<{ [key: string]: number }>({});
    const [taskLayouts, setTaskLayouts] = useState<{ [key: string]: { height: number, y: number } }>({});
    const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

    // 컨테이너 참조 추가
    const containerRef = useRef<View>(null);
    const scrollEnabled = useRef(true);

    // 각 항목에 대한 애니메이션 값을 저장하는 객체
    const taskMoveAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
    const shakeAnimations = useRef<{ [key: string]: { x: Animated.Value, y: Animated.Value } }>({}).current;
    const swipeAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
    const dragAnimations = useRef<{ [key: string]: Animated.ValueXY }>({}).current;

    // 낙관적 UI 업데이트를 위한 로컬 태스크 상태 추가
    const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

    // 외부에서 전달된 tasks가 변경되면 localTasks 업데이트
    useEffect(() => {
        // 드래그 중에는 localTasks 업데이트 방지 (중요: 드래그 중 서버 응답이 와도 무시)
        if (!draggingTaskId) {
            setLocalTasks(tasks);
        }
    }, [tasks, draggingTaskId]);

    // 메모리 관리를 위한 애니메이션 정리 함수
    const cleanupAnimations = useCallback(() => {
        // 모든 애니메이션 중지
        Object.values(shakeAnimations).forEach(anim => {
            anim.x.stopAnimation();
            anim.y.stopAnimation();
        });

        Object.values(dragAnimations).forEach(anim => {
            anim.stopAnimation();
        });

        Object.values(swipeAnimations).forEach(anim => {
            anim.stopAnimation();
        });

        Object.values(taskMoveAnimations).forEach(anim => {
            anim.stopAnimation();
        });
    }, [shakeAnimations, dragAnimations, swipeAnimations, taskMoveAnimations]);

    // 스크롤 활성화 상태 관리 함수 추가
    const setScrollEnabled = (enabled: boolean) => {
        scrollEnabled.current = enabled;
    };

    // 전체 컨테이너에 대한 Pan Responder 설정 변경
    const containerPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => isDraggingEnabled,
            onMoveShouldSetPanResponder: () => isDraggingEnabled,
            onStartShouldSetPanResponderCapture: () => isDraggingEnabled,
            onMoveShouldSetPanResponderCapture: () => isDraggingEnabled,
            onPanResponderGrant: () => {
                // 드래그 모드에서 터치 시작 시 스크롤 비활성화
                if (isDraggingEnabled) {
                    setScrollEnabled(false);
                }
            },
            onPanResponderTerminationRequest: () => !isDraggingEnabled,
            onPanResponderMove: () => {
                // 드래그 중 스크롤 비활성화 유지
                if (isDraggingEnabled) {
                    setScrollEnabled(false);
                    return true;
                }
                return false;
            },
            onPanResponderRelease: () => {
                // 터치 종료 시 스크롤 다시 활성화
                setScrollEnabled(true);
            },
            onPanResponderTerminate: () => {
                // 다른 응답자로 전환 시 스크롤 다시 활성화
                setScrollEnabled(true);
            },
        })
    ).current;

    // 각 항목별 흔들림 애니메이션 초기화
    const getShakeAnimation = (taskId: string) => {
        if (!shakeAnimations[taskId]) {
            shakeAnimations[taskId] = {
                x: new Animated.Value(0),
                y: new Animated.Value(0)
            };
        }
        return shakeAnimations[taskId];
    };

    // 편집 모드 애니메이션 시작/중지
    useEffect(() => {
        const animations: Animated.CompositeAnimation[] = [];

        if (editMode) {
            // 각 아이템별로 랜덤한 흔들림 애니메이션 설정
            tasks.forEach(task => {
                const shakeAnim = getShakeAnimation(task.id);

                // 랜덤한 시간 간격과 방향으로 흔들리는 애니메이션
                const xAnim = Animated.loop(
                    Animated.sequence([
                        Animated.timing(shakeAnim.x, {
                            toValue: Math.random() * 2 - 1, // -1 ~ 1 사이의 랜덤값
                            duration: 100 + Math.random() * 100, // 100ms ~ 200ms
                            useNativeDriver: true
                        }),
                        Animated.timing(shakeAnim.x, {
                            toValue: Math.random() * -2 + 1, // -1 ~ 1 사이의 랜덤값
                            duration: 100 + Math.random() * 100,
                            useNativeDriver: true
                        }),
                        Animated.timing(shakeAnim.x, {
                            toValue: 0,
                            duration: 100 + Math.random() * 100,
                            useNativeDriver: true
                        })
                    ])
                );

                const yAnim = Animated.loop(
                    Animated.sequence([
                        Animated.timing(shakeAnim.y, {
                            toValue: Math.random() * 0.5 - 0.25, // -0.25 ~ 0.25 사이의 랜덤값
                            duration: 150 + Math.random() * 100,
                            useNativeDriver: true
                        }),
                        Animated.timing(shakeAnim.y, {
                            toValue: Math.random() * -0.5 + 0.25, // -0.25 ~ 0.25 사이의 랜덤값
                            duration: 150 + Math.random() * 100,
                            useNativeDriver: true
                        }),
                        Animated.timing(shakeAnim.y, {
                            toValue: 0,
                            duration: 150 + Math.random() * 100,
                            useNativeDriver: true
                        })
                    ])
                );

                xAnim.start();
                yAnim.start();

                animations.push(xAnim);
                animations.push(yAnim);
            });
        } else {
            // 애니메이션 중지 및 초기값으로 부드럽게 되돌리기
            tasks.forEach(task => {
                if (shakeAnimations[task.id]) {
                    // 애니메이션 루프 중지
                    shakeAnimations[task.id].x.stopAnimation();
                    shakeAnimations[task.id].y.stopAnimation();

                    // 값을 부드럽게 0으로 리셋 (강제로 값을 설정하는 대신 애니메이션 사용)
                    Animated.parallel([
                        Animated.timing(shakeAnimations[task.id].x, {
                            toValue: 0,
                            duration: 100,
                            useNativeDriver: true
                        }),
                        Animated.timing(shakeAnimations[task.id].y, {
                            toValue: 0,
                            duration: 100,
                            useNativeDriver: true
                        })
                    ]).start(({ finished }) => {
                        if (finished) {
                            // 애니메이션이 끝난 후에 강제로 0으로 설정
                            if (shakeAnimations[task.id]) {
                                shakeAnimations[task.id].x.setValue(0);
                                shakeAnimations[task.id].y.setValue(0);
                            }
                        }
                    });
                }

                // 드래그 애니메이션도 초기화
                if (dragAnimations[task.id]) {
                    dragAnimations[task.id].stopAnimation();
                    dragAnimations[task.id].setValue({ x: 0, y: 0 });
                }
            });

            // 스와이프 상태 초기화
            if (swipedTaskId) {
                resetSwipe(swipedTaskId);
            }
        }

        // 컴포넌트 언마운트 시 모든 애니메이션 중지 및 초기화
        return () => {
            animations.forEach(anim => anim.stop());
            cleanupAnimations();
        };
    }, [editMode, tasks, cleanupAnimations]);

    // 컴포넌트 언마운트 시 모든 리소스 정리
    useEffect(() => {
        return () => {
            // 모든 애니메이션 정리
            cleanupAnimations();

            // 메모리 해제를 위해 모든 참조 제거
            setDraggingTaskId(null);
            setSwipedTaskId(null);
            setHoveredTaskId(null);
            setIsDraggingEnabled(false);

            // 모든 애니메이션 객체 참조 정리
            Object.keys(shakeAnimations).forEach(key => {
                delete shakeAnimations[key];
            });

            Object.keys(dragAnimations).forEach(key => {
                delete dragAnimations[key];
            });

            Object.keys(swipeAnimations).forEach(key => {
                delete swipeAnimations[key];
            });

            Object.keys(taskMoveAnimations).forEach(key => {
                delete taskMoveAnimations[key];
            });
        };
    }, [cleanupAnimations]);

    // 초기 항목 위치 설정
    useEffect(() => {
        const positions: { [key: string]: number } = {};
        tasks.forEach((task, index) => {
            positions[task.id] = index;
        });
        setTaskPositions(positions);
    }, [tasks]);

    // 항목에 대한 애니메이션 값 초기화
    const getSwipeAnimation = (taskId: string) => {
        if (!swipeAnimations[taskId]) {
            swipeAnimations[taskId] = new Animated.Value(0);
        }
        return swipeAnimations[taskId];
    };

    // 드래그 애니메이션 값 초기화
    const getDragAnimation = (taskId: string) => {
        if (!dragAnimations[taskId]) {
            dragAnimations[taskId] = new Animated.ValueXY({ x: 0, y: 0 });
        }
        return dragAnimations[taskId];
    };

    // 항목을 원래 위치로 되돌리는 함수
    const resetSwipe = (taskId: string) => {
        Animated.spring(swipeAnimations[taskId], {
            toValue: 0,
            useNativeDriver: false,
            friction: 5
        }).start();
        setSwipedTaskId(null);
    };

    // 항목을 삭제 위치로 완전히 스와이프하는 함수
    const completeSwipe = (taskId: string, direction: 'left' | 'right') => {
        const toValue = direction === 'left' ? -DELETE_BUTTON_WIDTH : (editMode ? -EDIT_BUTTON_WIDTH : 0);
        Animated.spring(swipeAnimations[taskId], {
            toValue,
            useNativeDriver: false,
            friction: 5
        }).start();
        setSwipedTaskId(taskId);
    };

    // 편집 모드 토글
    const toggleEditMode = () => {
        const newEditMode = !editMode;
        setEditMode(newEditMode);

        // 부모 컴포넌트에 편집 모드 변경 알림 (즉시 실행)
        if (onEditModeChange) {
            onEditModeChange(newEditMode);
        }
    };

    // 드래그 핸들 수정
    const handleDragHandlePress = (taskId: string) => {
        if (editMode) {
            // 즉시 진동 피드백 제공
            Vibration.vibrate(70);

            // 스크롤 방지 설정을 가장 먼저 활성화
            setScrollEnabled(false);
            setIsDraggingEnabled(true);

            console.log('드래그 핸들러 터치됨:', taskId);

            // 약간 지연시켜 다른 터치 이벤트보다 우선순위 부여
            setTimeout(() => {
                startDragging(taskId);
            }, 10);
        }
    };

    // 드래그 시작 함수 개선
    const startDragging = (taskId: string) => {
        // 이미 드래그 중이면 무시
        if (draggingTaskId !== null) return;

        console.log('드래그 시작:', taskId);
        setDraggingTaskId(taskId);
        setIsDraggingEnabled(true);
        // 스크롤 즉시 비활성화
        setScrollEnabled(false);

        // iOS에서는 진동 피드백이 중요함
        Vibration.vibrate(70);

        // 다른 항목 애니메이션 초기화
        Object.keys(taskMoveAnimations).forEach(id => {
            taskMoveAnimations[id].setValue(0);
        });
    };

    // 배경 터치 핸들러 (편집 모드 종료)
    const handleBackgroundPress = () => {
        if (editMode) {
            setEditMode(false);

            // 부모 컴포넌트에 편집 모드 변경 알림
            if (onEditModeChange) {
                onEditModeChange(false);
            }
        }
    };

    // 스와이프 제스처 생성 함수
    const createPanResponder = (taskId: string) => {
        return PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // 수평으로 10px 이상 이동하고, 수직 이동이 적을 때만 응답
                return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 50;
            },
            onPanResponderGrant: () => {
                // 다른 열린 항목 닫기
                if (swipedTaskId && swipedTaskId !== taskId) {
                    resetSwipe(swipedTaskId);
                }
            },
            onPanResponderMove: (_, gestureState) => {
                // 편집 모드에서는 왼쪽 스와이프만 허용 (편집 버튼 노출용)
                if (editMode) {
                    const newX = Math.min(0, Math.max(-EDIT_BUTTON_WIDTH, gestureState.dx));
                    swipeAnimations[taskId].setValue(newX);
                } else {
                    // 일반 모드에서는 왼쪽 스와이프만 허용 (삭제 버튼 노출용)
                    const newX = Math.min(0, Math.max(-DELETE_BUTTON_WIDTH, gestureState.dx));
                    swipeAnimations[taskId].setValue(newX);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                // 사용자가 항목을 왼쪽으로 충분히 스와이프했는지 확인
                if (gestureState.dx < -width * 0.2) {
                    completeSwipe(taskId, 'left');
                } else {
                    resetSwipe(taskId);
                }
            }
        });
    };

    // 각 항목의 위치 애니메이션 값 초기화
    const getTaskMoveAnimation = (taskId: string) => {
        if (!taskMoveAnimations[taskId]) {
            taskMoveAnimations[taskId] = new Animated.Value(0);
        }
        return taskMoveAnimations[taskId];
    };

    // 항목 위치 저장
    const handleTaskLayout = (taskId: string, event: any) => {
        const { height, y } = event.nativeEvent.layout;
        setTaskLayouts(prev => ({
            ...prev,
            [taskId]: { height, y }
        }));
    };

    // 드래그 제스처 생성 함수 개선
    const createDragResponder = (taskId: string, index: number) => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => editMode,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return editMode &&
                    (draggingTaskId === taskId || draggingTaskId === null) &&
                    Math.abs(gestureState.dy) > 5;
            },
            onStartShouldSetPanResponderCapture: () => {
                // 드래그 모드에서는 모든 터치 이벤트를 가로채기 (우선순위 높임)
                if (isDraggingEnabled || (editMode && draggingTaskId === taskId)) {
                    setScrollEnabled(false);
                    return true;
                }
                return false;
            },
            onMoveShouldSetPanResponderCapture: () => {
                // 드래그 모드에서는 모든 이동 이벤트를 가로채기 (우선순위 높임)
                if (isDraggingEnabled || (editMode && draggingTaskId === taskId)) {
                    setScrollEnabled(false);
                    return true;
                }
                return false;
            },
            onPanResponderTerminationRequest: () => false, // 다른 응답자가 이벤트를 뺏지 못하게 함
            onPanResponderGrant: () => {
                // 스크롤 비활성화
                setScrollEnabled(false);

                if (editMode && draggingTaskId === null) {
                    startDragging(taskId);
                }
            },
            onPanResponderMove: (_, gestureState) => {
                if (!editMode) return;

                try {
                    // 스크롤 비활성화 유지 (중요)
                    setScrollEnabled(false);

                    // Y축으로만 이동 (세로 방향 정렬)
                    if (dragAnimations[taskId]) {
                        dragAnimations[taskId].setValue({ x: 0, y: gestureState.dy });
                    }

                    // 현재 위치 계산 및 재정렬 로직
                    const currentIndex = tasks.findIndex(t => t.id === taskId);
                    if (currentIndex === -1) return;

                    // 모든 항목 레이아웃 정보가 있는지 확인
                    const allLayoutsAvailable = tasks.every(t => taskLayouts[t.id]);
                    if (!allLayoutsAvailable) return;

                    // 현재 드래그 중인 항목의 중앙 Y 위치 계산
                    const draggedItemLayout = taskLayouts[taskId];
                    const draggedItemCenter = draggedItemLayout.y + draggedItemLayout.height / 2 + gestureState.dy;

                    // 드래그 중인 항목이 현재 어떤 항목 위에 있는지 확인
                    let newHoveredTaskId: string | null = null;
                    let newPosition = currentIndex;

                    tasks.forEach((task, i) => {
                        if (task.id === taskId) return; // 드래그 중인 항목은 건너뜀

                        const layout = taskLayouts[task.id];
                        if (!layout) return; // 레이아웃이 없는 경우 처리

                        const taskTop = layout.y;
                        const taskBottom = taskTop + layout.height;

                        // 드래그 중인 항목이 이 항목 범위 내에 있는지 확인
                        if (draggedItemCenter >= taskTop && draggedItemCenter <= taskBottom) {
                            newHoveredTaskId = task.id;
                            newPosition = i;
                        }

                        // 다른 항목의 이동 애니메이션 설정
                        const moveAnim = getTaskMoveAnimation(task.id);
                        if (!moveAnim) return;

                        let targetY = 0;

                        if (i > currentIndex && i <= newPosition) {
                            // 드래그 아래에 있던 항목이 위로 이동
                            targetY = -draggedItemLayout.height;
                        } else if (i < currentIndex && i >= newPosition) {
                            // 드래그 위에 있던 항목이 아래로 이동
                            targetY = draggedItemLayout.height;
                        }

                        Animated.spring(moveAnim, {
                            toValue: targetY,
                            friction: 5,
                            useNativeDriver: true
                        }).start();
                    });

                    // 현재 호버된 항목 업데이트
                    setHoveredTaskId(newHoveredTaskId);
                } catch (error) {
                    console.error('드래그 이동 중 오류:', error);
                    // 오류 발생 시 드래그 취소
                    if (dragAnimations[taskId]) {
                        dragAnimations[taskId].setValue({ x: 0, y: 0 });
                    }
                    setDraggingTaskId(null);
                    setHoveredTaskId(null);
                    setIsDraggingEnabled(false);
                    setScrollEnabled(true);
                }
            },
            onPanResponderRelease: () => {
                if (!editMode) return;

                try {
                    // 원래 위치로 돌아가는 애니메이션
                    if (dragAnimations[taskId]) {
                        Animated.spring(dragAnimations[taskId], {
                            toValue: { x: 0, y: 0 },
                            friction: 5,
                            useNativeDriver: true
                        }).start();
                    }

                    // 다른 항목들도 원래 위치로 되돌리기
                    Object.keys(taskMoveAnimations).forEach(id => {
                        if (taskMoveAnimations[id]) {
                            Animated.spring(taskMoveAnimations[id], {
                                toValue: 0,
                                friction: 5,
                                useNativeDriver: true
                            }).start();
                        }
                    });

                    // 현재 드래그 중인 항목의 위치 계산
                    const currentIndex = tasks.findIndex(t => t.id === taskId);

                    // 새 위치 계산
                    if (hoveredTaskId) {
                        const newPosition = tasks.findIndex(t => t.id === hoveredTaskId);

                        // 위치가 변경되었으면 순서 변경 이벤트 호출
                        if (newPosition !== -1 && newPosition !== currentIndex && onReorder) {
                            onReorder(taskId, newPosition);
                        }
                    }

                    // 드래그 종료
                    setDraggingTaskId(null);
                    setHoveredTaskId(null);
                    setIsDraggingEnabled(false);

                    // 스크롤 다시 활성화
                    setScrollEnabled(true);
                } catch (error) {
                    console.error('드래그 종료 중 오류:', error);
                    // 오류 발생 시 모든 상태 초기화
                    if (dragAnimations[taskId]) {
                        dragAnimations[taskId].setValue({ x: 0, y: 0 });
                    }
                    setDraggingTaskId(null);
                    setHoveredTaskId(null);
                    setIsDraggingEnabled(false);
                    setScrollEnabled(true);
                }
            },
            onPanResponderTerminate: () => {
                // 드래그 작업이 중단된 경우 (예: 다른 컴포넌트가 응답자가 됨)
                if (draggingTaskId === taskId) {
                    try {
                        // 애니메이션 초기화
                        if (dragAnimations[taskId]) {
                            dragAnimations[taskId].setValue({ x: 0, y: 0 });
                        }
                        setDraggingTaskId(null);
                        setHoveredTaskId(null);
                        setIsDraggingEnabled(false);

                        // 스크롤 다시 활성화
                        setScrollEnabled(true);
                    } catch (error) {
                        console.error('드래그 종료 처리 중 오류:', error);
                        setScrollEnabled(true);
                    }
                }
            }
        });
    };

    // 드래그 업데이트 처리 함수 추가
    const handleDragUpdate = (taskId: string, position: number) => {
        if (!editMode || !isDraggingEnabled) return;

        try {
            // 현재 드래그 중인 항목의 위치를 기준으로 다른 항목들 재배치
            updateItemsPosition(taskId, position);
        } catch (error) {
            console.error('드래그 업데이트 처리 중 오류:', error);
            // 오류 발생 시 드래그 상태 초기화
            resetItemsPosition();
        }
    };

    // 드래그 종료 시 처리 함수 개선 - 낙관적 UI 업데이트 적용
    const handleDragEnd = (taskId: string, destinationIndex: number) => {
        console.log(`드래그 종료: ${taskId} -> 위치 ${destinationIndex}`);

        try {
            // 새 위치 계산 - 드래그 거리 기반
            const currentIndex = localTasks.findIndex(t => t.id === taskId);

            // 현재 위치가 유효하지 않으면 종료
            if (currentIndex === -1) {
                resetItemsPosition();
                setDraggingTaskId(null);
                setHoveredTaskId(null);
                setIsDraggingEnabled(false);
                setScrollEnabled(true);
                return;
            }

            // 카드 높이와 드래그 거리 기반으로 새 위치 계산
            const currentTask = localTasks[currentIndex];
            const currentLayout = taskLayouts[currentTask.id];
            const cardHeight = currentLayout?.height || 70;

            // 목표 위치 계산 (이동 거리와 속도를 모두 고려)
            const deltaY = destinationIndex;
            const moveCount = Math.round(deltaY / cardHeight);

            // 위치 계산을 더 정확하게 수정
            let newPosition = currentIndex;

            if (Math.abs(moveCount) > 0) {
                // 드래그 방향에 따라 위치 조정
                newPosition = Math.max(0, Math.min(localTasks.length - 1, currentIndex + moveCount));
            }

            // 실제 위치 변경이 있는 경우에만 처리
            if (currentIndex !== newPosition) {
                // 1. 드래그 상태 먼저 초기화하여 UI가 깨지지 않게 함
                setDraggingTaskId(null);
                setHoveredTaskId(null);
                setIsDraggingEnabled(false);
                setScrollEnabled(true);

                // 2. 모든 애니메이션 값 초기화 - 오버랩 방지를 위한 중요 단계
                Object.keys(taskMoveAnimations).forEach(id => {
                    if (taskMoveAnimations[id]) {
                        // 애니메이션을 즉시 중지하고 값을 0으로 설정
                        taskMoveAnimations[id].stopAnimation();
                        taskMoveAnimations[id].setValue(0);
                    }
                });

                Object.keys(dragAnimations).forEach(id => {
                    if (dragAnimations[id]) {
                        dragAnimations[id].stopAnimation();
                        dragAnimations[id].setValue({ x: 0, y: 0 });
                    }
                });

                // 3. 순서 업데이트 완료 후 진동 피드백
                Vibration.vibrate(50);

                // 4. 낙관적 UI 업데이트: 로컬 상태에서 순서 변경
                const updatedTasks = [...localTasks];
                const movedTask = updatedTasks.splice(currentIndex, 1)[0];
                updatedTasks.splice(newPosition, 0, movedTask);
                setLocalTasks(updatedTasks);

                // 5. 실제 데이터 업데이트는 약간 지연시켜 수행
                if (onReorder) {
                    setTimeout(() => {
                        onReorder(taskId, newPosition);
                    }, 50);
                }
            } else {
                // 위치 변경이 없어도 상태와 애니메이션 초기화
                resetItemsPosition();
                setDraggingTaskId(null);
                setHoveredTaskId(null);
                setIsDraggingEnabled(false);
                setScrollEnabled(true);
            }
        } catch (error) {
            console.error('드래그 종료 처리 중 오류:', error);
            // 오류 발생 시 모든 상태 초기화
            resetItemsPosition();
            setDraggingTaskId(null);
            setHoveredTaskId(null);
            setIsDraggingEnabled(false);
            setScrollEnabled(true);
        }
    };

    // 탭 처리 함수 개선 - 낙관적 UI 업데이트 적용
    const handleTaskPress = (taskId: string) => {
        if (editMode) return;

        // 현재 태스크 찾기
        const taskIndex = localTasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;

        const task = localTasks[taskIndex];

        // 낙관적 UI 업데이트: 로컬 상태에서 먼저 상태 변경
        const updatedTasks = [...localTasks];
        updatedTasks[taskIndex] = {
            ...task,
            status: task.status === 'completed' ? 'pending' : 'completed'
        };

        // 상태 변경 완료 후 진동 피드백
        Vibration.vibrate(20);

        // 로컬 상태 먼저 업데이트 (즉시 UI 반영)
        setLocalTasks(updatedTasks);

        // 실제 데이터 업데이트
        onTaskPress(taskId);
    };

    // 삭제 버튼 클릭 처리 개선 - 낙관적 UI 업데이트 적용
    const handleDeletePress = (taskId: string) => {
        if (!onTaskDelete) return;

        // 진동 피드백
        Vibration.vibrate(30);

        // 낙관적 UI 업데이트: 로컬 상태에서 먼저 항목 제거
        const updatedTasks = localTasks.filter(t => t.id !== taskId);
        setLocalTasks(updatedTasks);

        // 스와이프 상태 초기화
        setSwipedTaskId(null);

        // 실제 데이터 업데이트는 약간 지연시켜 수행
        setTimeout(() => {
            onTaskDelete(taskId);
        }, 100);
    };

    // 편집 버튼 클릭 처리
    const handleEditPress = (taskId: string) => {
        if (onTaskEdit) {
            onTaskEdit(taskId);
            // 편집 후 스와이프 상태 초기화
            resetSwipe(taskId);
            // 편집 모드 종료
            setEditMode(false);
        }
    };

    // 길게 누르기 핸들러 추가
    const handleLongPress = (taskId: string) => {
        console.log('길게 누르기 감지됨:', taskId);
        if (!editMode) {
            setEditMode(true);
            console.log('편집 모드 활성화됨');
        } else {
            // 수정 모드에서는 드래그 시작
            handleDragHandlePress(taskId);
        }
    };

    // RoutineCard 컴포넌트 크기 정의
    const CARD_HEIGHT = 70; // RoutineCard의 높이 (픽셀) - 마진 포함
    const DRAG_DELAY = 100; // 드래그 시작 지연 시간 (밀리초)
    const ANIMATION_CONFIG = {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // 부드러운 이징 함수
    };

    // 드래그 중인 항목 위치에 따라 다른 항목들 재배치
    const updateItemsPosition = (draggedId: string, dragPosition: number) => {
        const currentIndex = tasks.findIndex(t => t.id === draggedId);
        if (currentIndex === -1) return;

        // 현재 드래그 중인 아이템의 위치를 기준으로 새 위치 계산
        const newIndex = calculateDragPosition(draggedId, dragPosition);

        if (newIndex === currentIndex) return; // 위치 변경 없음

        // 다른 항목들 위치 업데이트
        tasks.forEach((task, index) => {
            if (task.id === draggedId) return; // 드래그 중인 항목은 건너뜀

            let offset = 0;

            // 위로 이동 중인 경우 (이전 인덱스보다 작은 인덱스로 이동)
            if (newIndex < currentIndex) {
                if (index >= newIndex && index < currentIndex) {
                    // 해당 범위의 항목들은 아래로 이동
                    offset = CARD_HEIGHT;
                }
            }
            // 아래로 이동 중인 경우 (이전 인덱스보다 큰 인덱스로 이동)
            else if (newIndex > currentIndex) {
                if (index > currentIndex && index <= newIndex) {
                    // 해당 범위의 항목들은 위로 이동
                    offset = -CARD_HEIGHT;
                }
            }

            // 움직여야 하는 항목들만 애니메이션 적용
            if (offset !== 0 && taskMoveAnimations[task.id]) {
                Animated.timing(taskMoveAnimations[task.id], {
                    toValue: offset,
                    ...ANIMATION_CONFIG,
                    useNativeDriver: true
                }).start();

                // 시각적 피드백으로 호버 효과 추가
                if (offset !== 0) {
                    setHoveredTaskId(index === newIndex ? task.id : null);
                }
            }
        });
    };

    // 드래그 종료 후 모든 항목 원래 위치로 재설정
    const resetItemsPosition = useCallback(() => {
        // 먼저 모든 애니메이션 중지
        Object.keys(taskMoveAnimations).forEach(id => {
            if (taskMoveAnimations[id]) {
                taskMoveAnimations[id].stopAnimation();
            }
        });

        // 그 다음 값을 0으로 설정
        Object.keys(taskMoveAnimations).forEach(id => {
            if (taskMoveAnimations[id]) {
                taskMoveAnimations[id].setValue(0);
            }
        });

        // 드래그 애니메이션도 초기화
        Object.keys(dragAnimations).forEach(id => {
            if (dragAnimations[id]) {
                dragAnimations[id].stopAnimation();
                dragAnimations[id].setValue({ x: 0, y: 0 });
            }
        });
    }, [taskMoveAnimations, dragAnimations]);

    // 항목 위치 정렬 업데이트 함수
    const updateItemOrderAfterDrag = (draggedId: string, newPosition: number) => {
        if (!onReorder) return;

        // 현재 인덱스 찾기
        const currentIndex = tasks.findIndex(t => t.id === draggedId);

        // 인덱스가 유효하고 변경이 있을 때만 처리
        if (currentIndex !== -1 && currentIndex !== newPosition) {
            console.log(`순서 변경: ${currentIndex} -> ${newPosition}`);

            // 위치 조정 후 원래 위치로 애니메이션 리셋
            resetItemsPosition();

            // 실제 순서 변경 요청
            onReorder(draggedId, newPosition);

            // 변경 성공 피드백
            Vibration.vibrate(50);
        } else {
            // 위치 변경이 없어도 애니메이션 리셋
            resetItemsPosition();
        }
    };

    // 드래그 위치 계산 함수 개선
    const calculateDragPosition = (taskId: string, translationY: number) => {
        // 현재 인덱스 찾기
        const currentIndex = localTasks.findIndex(t => t.id === taskId);
        if (currentIndex === -1) return currentIndex;

        // 모든 태스크의 레이아웃 정보가 있는지 확인
        if (!taskLayouts[taskId]) {
            return currentIndex;
        }

        // 카드의 높이 기준으로 이동 거리 계산
        const cardHeight = taskLayouts[taskId].height || 70;

        // 이동 거리에 따른 새 위치 계산 (더 부드러운 단계 변화)
        const moveDistance = Math.round(translationY / cardHeight);
        let newPosition = currentIndex + moveDistance;

        // 범위 제한
        newPosition = Math.max(0, Math.min(localTasks.length - 1, newPosition));

        return newPosition;
    };

    // 드래그 시작 시 처리 함수 수정
    const handleDragStart = (taskId: string) => {
        if (!editMode) return;

        // 진동 피드백으로 드래그 시작을 알림
        Vibration.vibrate(70);

        // 짧은 지연 후 드래그 활성화 (터치와 드래그 구분)
        setTimeout(() => {
            console.log(`드래그 시작: ${taskId}`);
            setDraggingTaskId(taskId);
            setIsDraggingEnabled(true);
            setScrollEnabled(false);
        }, DRAG_DELAY);
    };

    // 빈 목록 확인
    if (tasks.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.colors.content.secondary }]}>No tasks available</Text>
            </View>
        );
    }

    // 항목 렌더링 함수
    const renderTaskItem = (task: Task, index: number) => {
        // 각 항목에 대한 애니메이션 값 및 PanResponder 생성
        const swipeAnim = getSwipeAnimation(task.id);
        const dragAnim = getDragAnimation(task.id);
        const shakeAnim = getShakeAnimation(task.id);
        const moveAnim = getTaskMoveAnimation(task.id);
        const panResponder = createPanResponder(task.id);

        // 핸들러용 드래그 제스처는 별도로 만들지 않고, handleDragHandlePress로 처리

        // 흔들리는 애니메이션 스타일
        const shakeStyle = {
            transform: [
                { translateX: shakeAnim.x },
                { translateY: shakeAnim.y }
            ]
        };

        // 드래그 중 스타일
        const isDragging = draggingTaskId === task.id;
        const isHovered = hoveredTaskId === task.id;

        return (
            <Animated.View
                key={task.id}
                style={[
                    styles.taskContainer,
                    {
                        backgroundColor: theme.colors.background.primary,
                        transform: [{ translateY: moveAnim }],
                        zIndex: isDragging ? 100 : 1
                    },
                    isHovered && styles.hoveredTaskContainer
                ]}
                onLayout={(event) => handleTaskLayout(task.id, event)}
                pointerEvents={isDraggingEnabled && !isDragging ? 'none' : 'auto'} // 드래그 중에는 드래그 항목만 상호작용 가능
            >
                {/* 삭제 버튼 (항상 렌더링되지만 스와이프 시 노출) */}
                <View style={[
                    styles.deleteButtonContainer,
                    {
                        backgroundColor: theme.colors.ui.error,
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                    }
                ]}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeletePress(task.id)}
                    >
                        <Text style={[styles.deleteButtonText, { color: theme.colors.content.inverse }]}>삭제</Text>
                    </TouchableOpacity>
                </View>

                {/* 편집 버튼 (편집 모드에서만 사용) */}
                {editMode && (
                    <View style={[
                        styles.editButtonContainer,
                        {
                            backgroundColor: theme.colors.ui.secondary,
                            borderTopRightRadius: 8,
                            borderBottomRightRadius: 8
                        }
                    ]}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEditPress(task.id)}
                        >
                            <Text style={[styles.editButtonText, { color: theme.colors.content.inverse }]}>편집</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* 편집 모드에서 표시되는 삭제 아이콘 (루틴과 별개로 위치 고정) */}
                {editMode && (
                    <TouchableOpacity
                        style={styles.fixedDeleteIcon}
                        onPress={() => handleDeletePress(task.id)}
                    >
                        <View style={[styles.deleteCircle, { backgroundColor: theme.colors.ui.error }]}>
                            <Text style={styles.deleteX}>×</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {/* 스와이프 가능한 항목 */}
                <Animated.View
                    {...(editMode ? null : panResponder.panHandlers)} // 수정 모드에서는 카드 body의 panResponder를 제거
                    style={[
                        styles.taskWrapper,
                        {
                            backgroundColor: theme.colors.surface.primary,
                            transform: [
                                { translateX: swipeAnim },
                                ...dragAnim.getTranslateTransform(),
                                ...(isDragging ? [{ scale: 1.02 }] : [])
                            ],
                            borderRadius: 8,
                            shadowColor: theme.type === 'dark' ? 'transparent' : '#000',
                            shadowOffset: { width: 0, height: isDragging ? 3 : 1 },
                            shadowOpacity: isDragging ? 0.27 : 0.1,
                            shadowRadius: isDragging ? 4.65 : 1,
                            elevation: isDragging ? 6 : 1,
                            borderWidth: theme.type === 'dark' ? 1 : 0,
                            borderColor: theme.type === 'dark' ? theme.colors.border.medium : 'transparent'
                        },
                        editMode && shakeStyle,
                        isDragging && styles.draggingTask
                    ]}
                >
                    <TouchableOpacity
                        style={[
                            styles.taskItem,
                            {
                                borderBottomColor: theme.colors.border.light,
                                backgroundColor: theme.colors.surface.primary
                            },
                            task.status === 'completed' && styles.completedTask
                        ]}
                        onPress={() => !editMode && onTaskPress(task.id)}
                        // onLongPress를 제거하여 카드를 길게 눌러도 드래그가 시작되지 않도록 함
                        disabled={draggingTaskId !== null || editMode}
                    >
                        {editMode && (
                            <TouchableOpacity
                                style={[
                                    styles.dragHandle,
                                    isDragging && styles.dragHandleActive
                                ]}
                                onPressIn={() => handleDragHandlePress(task.id)}
                                activeOpacity={0.5}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // 터치 영역 확장
                            >
                                <View style={[styles.dragBar, { backgroundColor: theme.colors.content.tertiary }]} />
                                <View style={[styles.dragBar, { backgroundColor: theme.colors.content.tertiary }]} />
                                <View style={[styles.dragBar, { backgroundColor: theme.colors.content.tertiary }]} />
                            </TouchableOpacity>
                        )}
                        <View style={[styles.checkbox, { borderColor: theme.colors.ui.primary }]}>
                            {task.status === 'completed' && (
                                <View style={[styles.checkmark, { backgroundColor: theme.colors.ui.primary }]} />
                            )}
                        </View>
                        <View style={styles.taskContent}>
                            <Text
                                style={[
                                    styles.taskTitle,
                                    task.status === 'completed'
                                        ? [styles.completedText, { color: theme.colors.content.tertiary }]
                                        : { color: '#FFFFFF' }
                                ]}
                                numberOfLines={1}
                            >
                                {task.title}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        );
    };

    // 메인 렌더링
    return (
        <View style={styles.container}>
            {headerTitle && (
                <View style={styles.headerContainer}>
                    <Text style={[styles.headerTitle, { color: theme.colors.content.primary }]}>{headerTitle}</Text>
                    {editMode ? (
                        <TouchableOpacity
                            style={styles.doneButton}
                            onPress={() => {
                                resetItemsPosition(); // 편집 모드 종료 시 모든 항목 위치 초기화
                                // 상태 변경 전에 부모에게 알림
                                if (onEditModeChange) {
                                    onEditModeChange(false);
                                }
                                setEditMode(false);
                            }}
                        >
                            <Text style={[styles.doneButtonText, { color: theme.colors.ui.primary }]}>완료</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => {
                                // 상태 변경 전에 부모에게 알림
                                if (onEditModeChange) {
                                    onEditModeChange(true);
                                }
                                setEditMode(true);
                            }}
                        >
                            <Text style={[styles.editButtonText, { color: theme.colors.ui.primary }]}>수정</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {!headerTitle && editMode && (
                <View style={styles.headerContainer}>
                    {/* 완료 버튼 제거 */}
                </View>
            )}

            <View style={styles.listContainer}>
                <FlatList
                    data={localTasks}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={scrollEnabled.current}
                    nestedScrollEnabled={true}
                    contentContainerStyle={styles.flatListContent}
                    renderItem={({ item, index }) => (
                        <RoutineCard
                            routine={item}
                            onPress={handleTaskPress}
                            onDelete={onTaskDelete}
                            onEdit={onTaskEdit}
                            onReorder={(id, newOrder) => {
                                if (onReorder) {
                                    // 순서 변경 콜백 호출
                                    onReorder(id, newOrder);
                                }
                            }}
                            isDraggable={editMode}
                            editMode={editMode}
                            index={index}
                            onDragStateChange={(dragging) => {
                                // 드래그 상태 변경 감지
                                if (dragging) {
                                    setScrollEnabled(false);
                                } else {
                                    // 약간의 지연 후 스크롤 다시 활성화
                                    setTimeout(() => setScrollEnabled(true), 300);
                                }
                            }}
                            onDragStart={() => handleDragStart(item.id)}
                            onDragUpdate={(position) => handleDragUpdate(item.id, position)}
                            onDragEnd={(destinationPosition) => handleDragEnd(item.id, destinationPosition)}
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={[styles.emptyText, { color: theme.colors.content.secondary }]}>
                            No tasks available
                        </Text>
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
        paddingHorizontal: 0,
        overflow: 'hidden',
        borderRadius: 8,
        zIndex: -1, // FAB 버튼이 TaskList 위에 표시되도록 zIndex 낮춤
        flex: 1, // 컨테이너가 가능한 모든 공간을 차지하도록 설정
        height: 500, // 최소 높이 설정
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    doneButton: {
        padding: 8,
        marginBottom: 4,
    },
    doneButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    emptyText: {
        fontSize: 16,
    },
    taskContainer: {
        width: '100%',
        position: 'relative',
        marginBottom: 4,
        overflow: 'hidden',
        borderRadius: 8,
        marginHorizontal: 0,
    },
    taskWrapper: {
        width: '100%',
        zIndex: 1,
        overflow: 'hidden',
        borderRadius: 8, // 명확하게 borderRadius 추가
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 0, // 바텀 경계선 제거
    },
    completedTask: {
        opacity: 0.7,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmark: {
        width: 10,
        height: 10,
        borderRadius: 2,
    },
    taskContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskTitle: {
        fontSize: 16,
        flex: 1,
    },
    completedText: {
        textDecorationLine: 'line-through',
    },
    deleteButtonContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: DELETE_BUTTON_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0,
    },
    deleteButton: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    deleteButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    editButtonContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: EDIT_BUTTON_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0,
    },
    editButton: {
        padding: 8,
        marginBottom: 4,
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    fixedDeleteIcon: {
        position: 'absolute',
        right: 10,
        top: '50%', // 중앙에 위치
        transform: [{ translateY: -10 }], // 중앙 정렬 조정
        zIndex: 3,
    },
    deleteCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteX: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20,
        textAlign: 'center',
    },
    listContainer: {
        width: '100%',
        overflow: 'hidden',
        borderRadius: 8,
        flex: 1, // 컨테이너가 가능한 모든 공간을 차지하도록 설정
    },
    flatListContent: {
        paddingVertical: 4,
    },
    hoveredTaskContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    draggingTask: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    dragHandle: {
        width: 24,
        height: 24,
        marginRight: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        borderRadius: 4,
    },
    dragBar: {
        width: 16,
        height: 2,
        borderRadius: 1,
        marginVertical: 1,
    },
    dragHandleActive: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
});

export default TaskList; 