import {useState, useRef, useEffect} from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import Button from '@mui/material/Button';
import Paper from "@mui/material/Paper";
import Image from "next/image";

type BasicProps = {
	basicInfo: {
		user_name: string,
		birth_start: string,
		birth_end: string,
		profile: string | null,
		bgm: string | null
	},
	setBasicInfo: (basicInfo: any) => void

}

export default function Basic({ basicInfo, setBasicInfo }: BasicProps) {
	const [selectedStartDate, setSelectedStartDate] = useState(dayjs(basicInfo.birth_start));
	const [selectedEndDate, setSelectedEndDate] = useState(dayjs(basicInfo.birth_end));
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setSelectedImage(basicInfo.profile || null);
	}, [basicInfo.profile]);

	useEffect(() => {
		setSelectedAudio(basicInfo.bgm || null);
	}, [basicInfo.bgm]);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target) {
					setSelectedImage(e.target.result as string);
				}
			};
			reader.readAsDataURL(file);
			setBasicInfo({
				...basicInfo, [event.target.name]: file
			})
		}
		if (event.target) {
			event.target.value = '';
		}
	};

	const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0];
		if (file) {
			setSelectedAudio(file.name);
			setBasicInfo({
				...basicInfo, bgm: file
			})
		}
		if (event.target) {
			event.target.value = '';
		}
	};

	return (
		<>
			<Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
				기념인 이름
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={12}>
					<TextField
						required
						id="user_name"
						name="user_name"
						label="기념인 이름"
						fullWidth
						variant="standard"
						value={basicInfo.user_name}
						onChange={e => setBasicInfo({
							...basicInfo,
							user_name: e.target.value
						})}
					/>
				</Grid>
			</Grid>
			<Grid item xs={12} sx={{ pt: 4 }}>
				<Typography variant="h6" gutterBottom sx={{ paddingBottom: 2 }}>
					기념인 생존 기간
				</Typography>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<Grid container spacing={3} alignItems="center">
						<Grid item xs={5.5} sm={5.5}>
							<DatePicker
								label="태어난 생년월일"
								value={selectedStartDate}
								onChange={(newValue) => {
									setSelectedStartDate(dayjs(newValue));
									setBasicInfo({
										...basicInfo, birth_start: dayjs(newValue).format('YYYY-MM-DD')
									});
								}}
								format="YYYY-MM-DD"
								sx={{ width: '100%' }}
							/>
						</Grid>
						<Grid item xs={1} sm={1}>
							<Typography variant="h6" sx={{ textAlign: 'center'}}>~</Typography>
						</Grid>
						<Grid item xs={5.5} sm={5.5}>
							<DatePicker
								label="돌아간 생년월일"
								value={selectedEndDate}
								onChange={(newValue) => {
									setSelectedEndDate(dayjs(newValue));
									setBasicInfo({
										...basicInfo, birth_end: dayjs(newValue).format('YYYY-MM-DD')
									});
								}}
								format="YYYY-MM-DD"
								sx={{ width: '100%' }}
							/>
						</Grid>
					</Grid>
				</LocalizationProvider>
			</Grid>
			<Grid item xs={12} sx={{ pt: 4 }}>
				<Typography variant="h6">
					기념인 프로필 사진
				</Typography>
				<Grid item xs={12}>
					<Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
						<input
							accept="image/*"
							style={{ display: 'none' }}
							id="profile"
							name="profile"
							type="file"
							onChange={handleImageChange}
							ref={inputRef}
						/>
						{!selectedImage &&
                            <label htmlFor="profile">
                                <Button variant="contained" component="span">
	                                사진을 선택해주세요.
                                </Button>
                            </label>
						}
						{selectedImage &&
                            <>
								<Image src={selectedImage} alt="Selected" width={100} height={100} onClick={() => inputRef.current && inputRef.current.click()} />
                                <Button variant="text" onClick={() => setSelectedImage(null)} style={{ position: 'absolute', top: 0, right: 0 }} color="inherit">
                                    x
                                </Button>
                            </>
						}
					</Paper>
				</Grid>
			</Grid>
			<Grid item xs={12} sx={{ pt: 4 }}>
				<Typography variant="h6">
					기념관 배경 음악
				</Typography>
				<Grid item xs={12}>
					<Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
						<input
							accept="audio/*"
							style={{ display: 'none' }}
							id="bgm"
							name="bgm"
							type="file"
							onChange={handleAudioChange}
						/>
						{!selectedAudio &&
                            <label htmlFor="bgm">
                                <Button variant="contained" component="span">
                                    음악 파일을 선택해주세요.
                                </Button>
                            </label>
						}
						{selectedAudio &&
                            <>
                                <Typography variant="body1">
									{selectedAudio}
                                </Typography>
                                <Button variant="text" onClick={() => setSelectedAudio(null)} style={{ position: 'absolute', top: 0, right: 0 }} color="inherit">
                                    x
                                </Button>
                            </>
						}
					</Paper>
				</Grid>
			</Grid>
		</>
	);
}
