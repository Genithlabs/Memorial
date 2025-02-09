import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Link as MUILink } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import NextLink from 'next/link';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import dayjs from "dayjs";

export default function Popup() {

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
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography
                    sx={{
                        fontSize: {
                            xs: 24,
                            md: 28,
                        },
                    }}
                >
                    지금은 무료서비스 기간이에요
                </Typography>
                <Typography
                    sx={{
                        fontSize: {
                            xs: 14,
                            sm: 16,
                            md: 18,
                        },
                        textAlign: 'center',
                        lineHeight: 1.2,
                        mt: "8px",
                        wordBreak: 'keep-all',
                    }}
                >
                    메모리얼은 요로서비스로 전환 될 예정이에요<br/>
                    아래 정보를 입력해주시면 전환 시 <span style={{ color: '#ffb632' }}>90% 할인 혜택</span>을 드려요
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="이름"
                        type="text"
                        name="phone"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="phone"
                        label="휴대전화번호"
                        type="text"
                        name="phone"
                    />
                    <Button
                        fullWidth
                        sx={{
                            mt: 5,
                            mb: 2,
                            pt: 2,
                            pb: 2,
                            backgroundColor: '#222222',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
                            '&:hover': {
                                boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.5)',
                            },
                            borderRadius: 2,
                            fontFamily: 'Noto Sans',
                    }}
                    >
                        구매하고 싶어요
                    </Button>
                    <Button
                        type="button"
                        fullWidth
                        sx={{
                            backgroundColor: 'white',
                            color: 'black',
                            pt: 2,
                            pb: 2,
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                                boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.2)',
                                backgroundColor: '#fcfcfc',
                            },
                            borderRadius: 2,
                            fontFamily: 'Noto Sans',
                        }}
                    >
                        아니에요
                    </Button>
                </Box>
            </Box>
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
