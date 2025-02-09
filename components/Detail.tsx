import Typography from "@mui/material/Typography";
import Image from "next/image";
import Container from "@mui/material/Container";
import TabsCustomized from './detail/TabsCustomized';
import {ALLProps} from './detail/interfaces';
import {IconButton} from "@mui/material";
import {useEffect, useState} from "react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Box from "@mui/material/Box";

const getYearFromDate = (dateStr: string): string => {
	const date = new Date(dateStr);
	return `${date.getFullYear().toString()}. ${date.getMonth() + 1}. ${date.getDate()}`;
}

export default function Detail({ visitorMessages: initialVisitorMessages, memories: initialMemories, detail, memorialId }: ALLProps) {
	// Extract only the year from birth_start and birth_end
	const birthStart = getYearFromDate(detail.birth_start);
	const birthEnd = detail.birth_end ? getYearFromDate(detail.birth_end) : '';
	const [isPlaying, setIsPlaying] = useState(false);
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
	const [memories, setMemories] = useState(initialMemories);
	const [visitorMessages, setVisitorMessages] = useState(initialVisitorMessages);

	useEffect(() => {
		let audioElement: HTMLAudioElement | null = null;
		if (detail.attachment_bgm) {
			audioElement = new Audio(`${process.env.NEXT_PUBLIC_IMAGE}${detail.attachment_bgm.file_path}${detail.attachment_bgm.file_name}`);

			audioElement.addEventListener('ended', () => {
				if (audioElement) {
					audioElement.currentTime = 0;
					audioElement.play();
				}
			});

			audioElement.play(); // 자동으로 재생 시작
			setIsPlaying(true);
			setAudio(audioElement);
		}
		return () => {
			if (audioElement) {
				audioElement.pause();
				audioElement = null;
			}
		};
	}, [detail.attachment_bgm]);

	const togglePlay = () => {
		if (audio) {
			if (isPlaying) {
				audio.pause();
			} else {
				audio.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	return (
		<>
			<main>
				<div style={{position: 'relative', width: '100%', height: '20rem'}}>
					<Box
						sx={{
							width: '100%',
							height: '350px',
							background: 'linear-gradient(-45deg, #ac5376, #b4ae64, #4a859b, #4a949b)',
							backgroundSize: '400% 400%',
							animation: 'gradientAnimation 5s linear infinite',
							'@keyframes gradientAnimation': {
								'0%': {
									backgroundPosition: '0% 50%',
								},
								'50%': {
									backgroundPosition: '100% 50%',
								},
								'100%': {
									backgroundPosition: '0% 50%',
								},
							},
						}}
					>
					</Box>
					{detail.attachment_bgm && (
						<IconButton
							onClick={togglePlay}
							sx={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								color: 'black',
								backgroundColor: 'rgba(255, 255, 255, 0.8)',
								borderRadius: '50%',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 1)',
								},
							}}
						>
							{isPlaying ? <PauseIcon sx={{fontSize: 40}}/> : <PlayArrowIcon sx={{fontSize: 40}}/>}
						</IconButton>
					)}
				</div>
				<Container
					sx={{
						position: 'relative',
						width: {
							xs: '7rem',
							sm: '10rem',
							md: '13rem',
						},
						height: {
							xs: '7rem',
							sm: '10rem',
							md: '13rem',
						},
						mt: {
							xs: '-3rem',
							sm: '-5rem',
							md: '-7rem',
						},
						zIndex: 1,
						borderRadius: ".5rem",
						overflow: "auto",
						boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
				}}>
					{detail?.attachment_profile_image && (
						<img
							src={`${process.env.NEXT_PUBLIC_IMAGE}${detail.attachment_profile_image.file_path}${detail.attachment_profile_image.file_name}`}
							alt="profile image"
							style={{ width: '100%', height: '100%', position: 'absolute', left: 0, objectFit: 'cover' }}
						/>
					)}
				</Container>
				<Container
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						my:  {
							xs: '1.5rem',
							sm: '2rem',
							md: '2.5rem'
						},
					}}>
					<Typography
						sx={{
							fontSize: {
								xs: '1.7rem',
								sm: '2.5rem',
								md: '3.5rem'
							},
							fontWeight: 'bold',
						}}
					>
						{detail.user_name}
					</Typography>
					<Typography
						sx={{
							fontSize: {
								xs: '1.2rem',
								sm: '1.5rem',
								md: '2.5rem'
							},
							fontWeight: '400',
						}}
					>
						{birthEnd ? `${birthStart} ~ ${birthEnd}` : `${birthStart} ~`}
					</Typography>
				</Container>
				<Container sx={{ mt: {xs:"5rem", sm: "7.5rem", md: "10rem"} }}>
					<TabsCustomized visitorMessages={visitorMessages} memories={memories} detail={detail} memorialId={memorialId} setMemories={setMemories} setVisitorMessages={setVisitorMessages}/>
				</Container>
			</main>
		</>
	)
}