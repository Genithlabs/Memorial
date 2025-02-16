import React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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

	const settings2 = {
		autoplay: true, // 자동 재생 활성화
		infinite: true,
		slidesToShow: 2.5,
		slidesToScroll: 1, // 한 번에 하나씩 이동
		arrows: false,
		dots: false,
		centerMode: false, // centerMode 사용 안 함
		speed: 30000, // 전환 속도를 느리게 (밀리는 효과)
		autoplaySpeed: 0, // 슬라이드 간 대기 시간 없음
		cssEase: 'linear', // 전환 효과를 선형으로 설정
		pauseOnHover: true,
		responsive: [
			{
				breakpoint: 768, // 반응형 처리
				settings: {
					slidesToShow: 1.2,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1.2,
				},
			},
		],
	};

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
			description: (<>그리워질 때 언제든 기념관에서 기억을 꺼내보세요.<br />사랑하는 사람의 아름다운 인생을 기념해주세요</>),
		},
	];

	return (
		<main>
			<style jsx global>{`
                .slick-prev:before,
                .slick-next:before {
                    display: none;
                }
            `}</style>
			<Box
				sx={{
					bgcolor: 'background.paper',
					pt: 6,
					pb: 6,
				}}
			>
				<Typography
					component="h1"
					align="center"
					color="text.primary"
					gutterBottom
					sx={{
						fontSize: {
							xs: '1.6rem',
							sm: '2.5rem',
							md: '4rem'
						},
						fontWeight: {
							xs: 600,
							sm: 300,
						},
						fontFamily: "'Grandiflora One', sans-serif",
						zIndex: 1,
						position: 'relative',
						marginTop: "130px",
						pr: 2,
						pl: 2,
						wordBreak: 'keep-all',
					}}
				>
					"우리 삶, 다 저마다 괜찮아요"<br/>
					틀리지 않았던 당신의 인생 뜻 깊게 기억하고 전해보세요
				</Typography>
				<Typography
					align="center"
					color="text.primary"
					paragraph
					sx={{
						fontSize: {
							xs: '1.2rem',
							sm: '1.5rem',
							md: '2rem'
						},
						zIndex: 1,
						position: 'relative',
					}}
				>
					당신의 인생 기념관, 메모리얼
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
								mt: 2,
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
								fontSize: {
									xs: '1rem',
									sm: '1.2rem',
								},
								minWidth: {
									xs: '150px',
									sm: '200px',
								},
								height: {
									xs: '50px',
									sm: '60px'
								},
							}}
						>
							기념관 만들기
						</Button>
					</NextLink>
				</Stack>
			</Box>
			<Box
				sx={{
					position: 'relative',
					pt: 15,
					pb: 6,
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '10%',
						height: '100%',
						background: 'linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
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
						background: 'linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
						zIndex: 2,
						pointerEvents: 'none',
					}}
				/>
				<Slider {...settings2}>
					{slidesData.map((slide, index) => (
							<Box
								key={index}
								sx={{
									padding: {
										xs: '0 20px',
										sm: '0 30px',
										md: '0 50px',
										lg: '0 100px',
									}
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
										image={`/img${index + 1}.png`}
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
												md: '16px'
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
				</Slider>
			</Box>
			<Box
				sx={{
					bgcolor: 'background.paper',
					pt: 8,
					pb: 6,
				}}
			>
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
						pt: 10,
					}}
				>
					다른 기념관 들러보기
				</Typography>
				<Box
					sx={{
						padding: {
							sm: "0 20px",
							md: "0 100px",
							lx: "0 200px",
						}
					}}
				>
				{isDesktop && memorialCards.length > 4 ? (

					<Slider
						{...settings}
					>
						{memorialCards.map((card) => (
							<Box key={card.id} sx={{ px: 2 }}>
								<NextLink href={`/detail/${card.id}`} passHref>
									<Card
										sx={{
											display: 'flex',
											flexDirection: 'column',
											width: { xs: '270px', sm: '230px', md: '200px', xl: '230px'},
											height: { xs: '300px', sm: '260px', md: '230px', xl: '270px'},
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
											image={
												card.attachment_profile_image
													? `${process.env.NEXT_PUBLIC_IMAGE}${card.attachment_profile_image.file_path}${card.attachment_profile_image.file_name}`
													: 'https://source.unsplash.com/random?wallpapers'
											}
										/>
									</Card>
								</NextLink>
								<Typography
									sx={{
										width: '100%',
										margin: '2rem auto 0',
										textAlign: 'center',
										fontSize: {
											xs: '1.2rem',
											md: '1rem',
										},
										lineHeight: '1.2',
									}}
								>{card.user_name}</Typography>
							</Box>
						))}
					</Slider>
				) : (
					<Grid container spacing={4} justifyContent="center">
						{memorialCards.map((card) => (
							<Grid item key={card.id} xs={12} sm={6} md={3}>
								<NextLink href={`/detail/${card.id}`} passHref>
									<Card
										sx={{
											display: 'flex',
											flexDirection: 'column',
											width: { xs: '270px', sm: '230px', md: '200px', xl: '230px'},
											height: { xs: '300px', sm: '260px', md: '230px', xl: '270px'},
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
											image={
												card.attachment_profile_image
													? `${process.env.NEXT_PUBLIC_IMAGE}${card.attachment_profile_image.file_path}${card.attachment_profile_image.file_name}`
													: 'https://source.unsplash.com/random?wallpapers'
											}
										/>
									</Card>
								</NextLink>
								<Typography
									sx={{
										width: '100%',
										margin: '2rem auto 0',
										textAlign: 'center',
										fontSize: {
											xs: '1.2rem',
											md: '1rem',
										},
										lineHeight: '1.2',
									}}
								>{card.user_name}</Typography>
							</Grid>
						))}
					</Grid>
				)}
				</Box>
			</Box>
			<Box
				sx={{
					pt: 7,
					pb: 7,
					mt: 10,
					backgroundImage: 'url(/bottom_bg.png)',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
					backgroundSize: 'cover',
				}}
			>
				<Typography
					align="center"
					color="text.primary"
					paragraph
					sx={{
						fontSize: {
							xs: '1.1rem',
							sm: '1.5rem',
							md: '2rem'
						},
					}}
				>
					위인들만 기념관을 만들 수 있는 것은 아닙니다.<br/>사랑하는 이들을 위해 기념관을 만들어보세요
				</Typography>
				<Typography align="center" sx={{marginTop: "33px"}}>
					<NextLink href="/form" passHref>
						<Button
							variant="contained"
							sx={{
								mt: 2,
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
								fontSize: {
									xs: '1rem',
									sm: '1.2rem',
								},
								minWidth: {
									xs: '150px',
									sm: '200px',
								},
								height: {
									xs: '50px',
									sm: '60px'
								},
							}}
						>
							새 기념관 만들기
						</Button>
					</NextLink>
				</Typography>
			</Box>
		</main>
	);
}