import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

export default function Preview() {
    const slidesData = [
        {
            title: '안전하게 보관하는 추억',
            description: '가족 또는 사랑하는 사람들과 사진, 영상, 음성 등 모든 기록을 영구적으로 보존해 공유해요',
        },
        {
            title: 'AI 기반 자서전',
            description: '음성 녹음만으로도 자신의 생애를 정리해주는 AI 기반 자서전을 개발중이에요',
        },
        {
            title: '영원한 연결',
            description: '돌아가신 후에도 소중한 사람들에게 기념일마다 음성, 및 글 메세지를 전해드려요',
        },
        {
            title: '사랑하는 이의 삶을 기념',
            description: '그리워 질 때 언제든 기념관에서 기억을 꺼내 아름다운 인생을 기념해주세요',
        },
    ];

    return (
        <Container component="main" sx={{width: '100%'}} maxWidth={false}>
            <Typography
                sx={{
                    pt: 12,
                    fontSize: {
                        xs: 26,
                        sm: 30,
                        md: 40
                    },
                    textAlign: 'center',
                    fontFamily: "'Grandiflora One', sans-serif",
                }}
            >
                메모리얼에서 준비중인 서비스
            </Typography>
            <Box
                sx={{
                    width: '100%',
                    position: 'relative',
                    pb: 6,
                    display: {
                        xs: 'block',
                        sm: 'block',
                        md: 'flex',
                    },
                    flexWrap: 'wrap',
                    justifyContent: {
                        xs: 'center',
                        xl: 'center',
                    },
                    pl: {
                        md: 10,
                        lg: '4.5rem',
                    },
                    pr: {
                        md: 10,
                        lg: '4.5rem',
                    },
                }}
            >
                {slidesData.map((slide, index) => (
                    <Box
                        key={index}
                    >
                        <Card
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: { xs: '270px', sm: '230px', md: '150px', xl: '150px'},
                                height: { xs: '300px', sm: '260px', md: '170px', xl: '170px'},
                                borderRadius: '130px',
                                overflow: 'hidden',
                                maxWidth: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: '0 auto',
                                mt: '2rem',
                            }}
                        >
                            <CardMedia
                                component="div"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                image={`/img${index + 1}.png`}
                            />
                        </Card>
                        <Typography
                            sx={{
                                textAlign: 'center',
                                pt: {
                                    xs: '25px',
                                    md: '32px',
                                },
                                fontSize: {
                                    xs: 18,
                                    md: 20,
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
                                    xs: 14,
                                    md: 16
                                },
                                letterSpacing: '-1.5px',
                                lineHeight: '1.2',
                                wordBreak: 'keep-all',
                                textAlign: 'center',
                                maxWidth: {
                                    xs: "100%",
                                    md: 350,
                                    lg: 240,
                                },
                            }}
                        >
                            {slide.description}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Container>
    );
}
