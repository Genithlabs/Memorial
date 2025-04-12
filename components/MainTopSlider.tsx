import React, { useState, useRef, useEffect } from 'react';
import { Box, Card, CardMedia, Typography } from '@mui/material';

const slidesData = [
    {
        title: '메모리얼이 기억과 추억을 안전하게 보관해드립니다',
        description: '소중한 개인의 사진, 영상, 음성 등 모든 기록을 영구적으로 보존해요.',
    },
    {
        title: '언제 헤어지더라도, 사랑하는 이들에게 남기고 싶은 말을 기록할 수 있어요',
        description: '돌아가신 후에도 소중한 사람들에게 기념일마다 음성, 및 글 메세지를 전해드려요',
    },
    {
        title: '나의 인생을 회고하고 반추해보세요',
        description: '음성 녹음만으로도 자신의 생애를 정리해주는 AI 기반 자서전을 개발중이에요',
    },
    {
        title: '부모님, 또는 지인의 삶을 기념해보세요',
        description: (
            <>
                그리워질 때 언제든 기념관에서 기억을 꺼내보세요.
                <br />
                사랑하는 사람의 아름다운 인생을 기념해주세요
            </>
        ),
    },
];

const ContinuousSlider = () => {
    // 컨테이너와 트랙 참조
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // 현재 슬라이더 위치(offset)를 px 단위로 저장
    const [offset, setOffset] = useState(0);

    // 드래그 상태 관리
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartOffset, setDragStartOffset] = useState(0);

    // 애니메이션 관련 refs
    const animationRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | null>(null);

    // 원본 슬라이드 집합의 총 너비(px)를 저장 (트랙 스크롤의 절반)
    const [sliderWidth, setSliderWidth] = useState(0);

    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // 창 크기 변화 또는 마운트 시 슬라이드 트랙의 너비 측정(복제 전 전체 너비의 절반)
    useEffect(() => {
        const handleResize = () => {
            if (trackRef.current) {
                setSliderWidth(trackRef.current.scrollWidth / 2);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        }
    }, []);

    const animate = (time: number) => {
        const previousTime = lastTimeRef.current ?? time;
        const delta = time - previousTime;
        lastTimeRef.current = time;

        // 드래그 중이 아니라면 자동 애니메이션 실행
        if (!isDragging && sliderWidth > 0) {
            const speed = sliderWidth / 100000;
            setOffset((prevOffset) => {
                let newOffset = prevOffset - speed * delta;
                if (newOffset <= -sliderWidth) {
                    newOffset += sliderWidth;
                }
                return newOffset;
            });
        }
        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isDragging, sliderWidth]);

    // 드래그 시작 시
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setDragStartX(e.clientX);
        setDragStartOffset(offset);
    };

    // 드래그 중: 드래그 시작 위치와 현재 포인터 위치의 차이를 계산하여 offset 갱신
    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDragging) {
            const diff = e.clientX - dragStartX;
            let newOffset = dragStartOffset + diff;

            // 순환 효과를 위해 범위를 재조정
            if (newOffset > 0) {
                newOffset = newOffset - sliderWidth;
            } else if (newOffset <= -sliderWidth) {
                newOffset = newOffset + sliderWidth;
            }
            setOffset(newOffset);
        }
    };

    // 드래그 종료 시 자동 애니메이션 재개
    const handlePointerUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length > 0) {
            // e.touches[0].clientX 값을 이용해 기존 포인터 이벤트 핸들러를 호출합니다.
            handlePointerDown({ clientX: e.touches[0].clientX } as React.PointerEvent<HTMLDivElement>);
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length > 0) {
            handlePointerMove({ clientX: e.touches[0].clientX } as React.PointerEvent<HTMLDivElement>);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        handlePointerUp();
    };

    return (
        <Box
            ref={containerRef}
            sx={{
                overflow: 'hidden',
                position: 'relative',
            }}
            // 터치 지원 디바이스에서는 터치 이벤트만 적용
            {...(isTouchDevice
                ? {
                    onTouchStart: handleTouchStart,
                    onTouchMove: handleTouchMove,
                    onTouchEnd: handleTouchEnd,
                }
                : {
                    // 데스크탑 환경에서는 Pointer 이벤트 적용
                    onPointerDown: handlePointerDown,
                    onPointerMove: handlePointerMove,
                    onPointerUp: handlePointerUp,
                    onPointerLeave: handlePointerUp,
                })}
        >
            <Box
                ref={trackRef}
                sx={{
                    display: 'flex',
                    transform: `translateX(${offset}px)`,
                    transition: isDragging ? 'none' : 'none',
                }}
            >
                {slidesData.concat(slidesData).map((slide, index) => (
                    <Box
                        key={index}
                        sx={{
                            flex: '0 0 auto',
                            width: {
                                xs: '400px',
                                sm: '700px',
                            },
                            padding: {
                                xs: '0 20px',
                                sm: '0 30px',
                                md: '0 50px',
                                lg: '0 100px',
                            },
                        }}
                    >
                        <Card
                            sx={{
                                border: 'none',
                                boxShadow: 'none',
                            }}
                        >
                            <CardMedia
                                component="img"
                                sx={{
                                    width: '70%',
                                    height: 'auto',
                                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                                }}
                                image={`/img${(index % slidesData.length) + 1}.png`}
                                alt={slide.title}
                            />
                            <Typography
                                sx={{
                                    pt: {
                                        xs: '25px',
                                        md: '32px',
                                    },
                                    fontSize: {
                                        xs: '20px',
                                        md: '28px',
                                    },
                                    letterSpacing: '-2px',
                                    lineHeight: '1.2',
                                    wordBreak: 'keep-all',
                                }}
                            >
                                {slide.title}
                            </Typography>
                            <Typography
                                sx={{
                                    pt: '12px',
                                    fontSize: {
                                        xs: '14px',
                                        md: '16px',
                                    },
                                    letterSpacing: '-1.5px',
                                    lineHeight: '1.2',
                                    wordBreak: 'keep-all',
                                }}
                            >
                                {slide.description}
                            </Typography>
                        </Card>
                    </Box>
                ))}
            </Box>
            {/* 양쪽 고정된 그라데이션 오버레이 */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '10%',
                    height: '100%',
                    background: 'linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))',
                    zIndex: 2,
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '10%',
                    height: '100%',
                    background: 'linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))',
                    zIndex: 2,
                    pointerEvents: 'none',
                }}
            />
        </Box>
    );
};

export default ContinuousSlider;
