import React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import Slider from 'react-slick';
import { MainProps } from '@/types/main';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';

const NextArrow = (props: any) => {
	const { className, style, onClick } = props;
	const theme = useTheme();
	const color = theme.palette.mode === 'dark' ? 'white' : 'black';
	return (
		<div
			className={className}
			style={{
				...style,
				display: "block",
				right: "-25px",
				zIndex: 1,
				cursor: "pointer",
				background: "none",
				border: "none"
			}}
			onClick={onClick}
		>
			<ArrowForwardIos style={{ fontSize: '2rem', color }} />
		</div>
	);
};

const PrevArrow = (props: any) => {
	const { className, style, onClick } = props;
	const theme = useTheme();
	const color = theme.palette.mode === 'dark' ? 'white' : 'black';
	return (
		<div
			className={className}
			style={{
				...style,
				display: "block",
				left: "-25px",
				zIndex: 1,
				cursor: "pointer",
				background: "none",
				border: "none"
			}}
			onClick={onClick}
		>
			<ArrowBackIos style={{ fontSize: '2rem', color }} />
		</div>
	);
};

export default function Main({ memorialCards }: MainProps) {
	const { status } = useSession();
	const redirectUrl = status === 'authenticated' ? '/form' : '/signin';
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

	const settings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 4,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: false,
					dots: false
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					initialSlide: 2,
					dots: false
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: false
				}
			}
		]
	};

	return (
		<main>
			<style jsx global>{`
                .slick-prev:before,
                .slick-next:before {
                    display: none;
                }
            `}</style>
			{/* Hero unit */}
			<Box
				sx={{
					bgcolor: 'background.paper',
					pt: 8,
					pb: 6,
				}}
			>
				<Container maxWidth="md">
					<Typography
						component="h1"
						align="center"
						color="text.primary"
						gutterBottom
						sx={{
							fontSize: {
								xs: '2rem',
								sm: '2.5rem',
								md: '4rem'
							},
							fontWeight: 300,
							fontFamily: "'Grandiflora One', sans-serif",
						}}
					>
						평범한 우리들의 인생은<br/>갑작스레 끝나고,<br/>덧없이 흩어지게 될까요?
					</Typography>
					<Typography
						align="center"
						color="text.primary"
						paragraph
						sx={{
							fontSize: {
								xs: '.7rem',
								sm: '1rem',
								md: '1.5rem'
							},
						}}
					>
						나의 삶, 사랑하는 이의 삶을 영원히 기억할 기념관을 만들어보세요
					</Typography>
					<Stack
						sx={{ pt: 4 }}
						direction="row"
						justifyContent="center"
					>
						<NextLink href={redirectUrl} passHref>
							<Button
								variant="contained"
								sx={{
									backgroundColor: 'black',
									color: 'white',
									fontSize: '1.2rem', // 글씨 크기 증가
									padding: '12px 24px', // 상하좌우 여백
									minWidth: '200px', // 버튼 최소 너비
									height: '60px', // 버튼 높이
									'&:hover': {
										backgroundColor: '#333', // 호버 시 배경색
									},
									fontFamily: "Inter"
								}}
							>
								기념관 만들기
							</Button>
						</NextLink>
					</Stack>
				</Container>
			</Box>
			<Box
				sx={{
					bgcolor: 'background.paper',
					pt: 8,
					pb: 6,
				}}
			>
				<Container sx={{ py: 8 }} maxWidth="md">
					<Typography
						align="center"
						sx={{
							fontSize: {
								xs: '2rem',
								sm: '2rem',
								md: '2rem'
							},
							fontWeight: 300,
							fontColor: 'black',
							marginTop: "1rem",
							marginBottom: "33px",
						}}
					>
						다른 기념관 들러보기
					</Typography>
					{/* End hero unit */}
					{isDesktop && memorialCards.length > 4 ? (
						<Slider {...settings}>
							{memorialCards.map((card) => (
								<Box key={card.id} sx={{ px: 2 }}>
									<NextLink href={`/detail/${card.id}`} passHref>
										<Card
											sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: "90%"}}
										>
											<CardMedia
												component="div"
												sx={{
													pt: '75%'
												}}
												image={card.attachment_profile_image ? `${process.env.NEXT_PUBLIC_IMAGE}${card.attachment_profile_image.file_path}${card.attachment_profile_image.file_name}` : "https://source.unsplash.com/random?wallpapers"}
											/>
										</Card>
									</NextLink>
								</Box>
							))}
						</Slider>
					) : (
						<Grid container spacing={4} justifyContent="center">
							{memorialCards.map((card) => (
								<Grid item key={card.id} xs={12} sm={6} md={3}>
									<NextLink href={`/detail/${card.id}`} passHref>
										<Card
											sx={{ height: '100%', display: 'flex', flexDirection: 'column', }}
										>
											<CardMedia
												component="div"
												sx={{
													pt: '75%'
												}}
												image={card.attachment_profile_image ? `${process.env.NEXT_PUBLIC_IMAGE}${card.attachment_profile_image.file_path}${card.attachment_profile_image.file_name}` : "https://source.unsplash.com/random?wallpapers"}
											/>
										</Card>
									</NextLink>
								</Grid>
							))}
						</Grid>
					)}
				</Container>
			</Box>
			<Box
				sx={{
					bgcolor: 'background.paper',
					pt: 8,
					pb: 6,
				}}
			>
				<Container maxWidth="md">
					<Typography
						align="center"
						color="text.primary"
						paragraph
						sx={{
							fontSize: {
								xs: '.9rem',
								sm: '1.5rem',
								md: '2rem'
							},
						}}
					>
						위인들만 기념관을 만들 수 있는 것은 아니에요<br/>기억할 사람들을 위해 기념관을 만들어보세요
					</Typography>
					<Typography align="center" sx={{marginTop: "33px"}}>
						<NextLink href="" passHref>
							<Button
								variant="contained"
								sx={{
									backgroundColor: 'black',
									color: 'white',
									fontSize: '1.2rem', // 글씨 크기 증가
									padding: '12px 24px', // 상하좌우 여백
									minWidth: '200px', // 버튼 최소 너비
									height: '60px', // 버튼 높이
									'&:hover': {
										backgroundColor: '#333', // 호버 시 배경색
									},
									fontFamily: "Inter"
								}}
							>
								새 기념관 만들기
							</Button>
						</NextLink>
					</Typography>
				</Container>
			</Box>
		</main>
	);
}