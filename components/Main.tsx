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
					infinite: true,
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
							fontWeight: 300
						}}
					>
						기념관 만들기!
					</Typography>
					<Typography
						align="center"
						color="text.secondary"
						paragraph
						sx={{
							fontSize: {
								xs: '.9rem',
								sm: '1.5rem',
								md: '2rem'
							},
						}}
					>
						위인들만 기념관을 만들 수 있는 것은 아닙니다.<br />
						여러분 혹은 여러분이 사랑하는 사람의 기념관을 만들어보세요
					</Typography>
					<Stack
						sx={{ pt: 4 }}
						direction="row"
						spacing={2}
						justifyContent="center"
					>
						<NextLink href={redirectUrl} passHref>
							<Button variant="contained">새로 기념관 건립</Button>
						</NextLink>
						<NextLink href={redirectUrl} passHref>
							<Button variant="outlined">내가 건립한 기념관 수정</Button>
						</NextLink>
					</Stack>
				</Container>
			</Box>
			<Box className={"main-diff-card-section"}>
				<Container sx={{ py: 8 }} maxWidth="md">
					<Typography
						align="center"
						gutterBottom
						sx={{
							fontSize: {
								xs: '2rem',
								sm: '2rem',
								md: '3.5rem'
							},
							fontWeight: 300
						}}
					>
						기념관 리스트
					</Typography>
					{/* End hero unit */}
					{isDesktop ? (
						<Slider {...settings}>
							{memorialCards.map((card) => (
								<Box key={card.id} sx={{ px: 2 }}>
									<NextLink href={`/detail/${card.id}`} passHref>
										<Card
											sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
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
						<Grid container spacing={4}>
							{memorialCards.map((card) => (
								<Grid item key={card.id} xs={12} sm={6} md={3}>
									<NextLink href={`/detail/${card.id}`} passHref>
										<Card
											sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
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
						gutterBottom
						sx={{
							fontSize: {
								xs: '1.7rem',
								sm: '2.5rem',
								md: '3.5rem'
							},
							fontWeight: 300
						}}
					>
						인생 기념관 프로젝트를 시작하며
					</Typography>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
						}}>
						<Card
							sx={{ my: 4, width: '30%', display: 'flex', flexDirection: 'column' }}
						>
							<CardMedia
								component="div"
								sx={{
									pt: '75%'
								}}
								image="https://source.unsplash.com/random?wallpapers"
							/>
							<CardContent>
								<Typography variant="h5" align="center" component="div">
									전경자
								</Typography>
								<Typography variant="subtitle2" align="center" color="textSecondary">
									설립자
								</Typography>
							</CardContent>
						</Card>
					</Box>
					<Typography
						align="center"
						color="text.secondary"
						paragraph
						sx={{
							fontSize: {
								xs: '.9rem',
								sm: '1.5rem',
								md: '2rem'
							},
						}}
					>
						위인들만 기념관을 만들 수 있는 것은 아닙니다.<br />
						여러분 혹은 여러분이 사랑하는 사람의 기념관을 만들어보세요
					</Typography>
				</Container>
			</Box>
		</main>
	);
}