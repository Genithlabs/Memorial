import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {Link as MUILink} from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {useState} from "react";

function Copyright() {
	return (
		<Typography variant="body2" color="text.secondary" align="center">
			{'Footer © '}
			<MUILink color="inherit" href="https://mui.com/">
				Your Website
			</MUILink>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

export default function SignUp() {
	const router = useRouter();
	const [isDisabled, setDisabled] = useState(false);
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setDisabled(true);
		const data = new FormData(event.currentTarget);
		const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/register`;

		const formData = {
			user_id: data.get('user_id'),
			user_name: data.get('user_name'),
			email: data.get('email'),
			user_password: data.get('user_password'),
			re_password: data.get('re_user_password'),
		};

		// 유효성 검사
		if (!formData.user_id || !formData.user_name || !formData.email || !formData.user_password || !formData.re_password) {
			alert('모든 값을 입력해주세요.');
			return;
		}

		if (formData.user_password !== formData.re_password) {
			alert('비밀번호가 일치하지 않습니다.');
			return;
		}

		try {
			if (!isDisabled) {
				const response = await fetch(url, {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify(formData),
				});

				if (response.ok) {
					router.push('/signin');
				} else {
					const result = await response.json();
					alert('회원 가입 실패: ' + result.error[0]);
				}
			}
		} catch (error) {
			console.log(error);
			alert('회원 가입 중 에러 발생: ' + error);
		} finally {
			setDisabled(false);
		}
	};

	return (
		<>
			<Container component="main" maxWidth="xs">
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						회원 가입
					</Typography>
					<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									autoComplete="given-name"
									name="user_id"
									required
									fullWidth
									id="user_id"
									label="ID"
									autoFocus
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									autoComplete="given-name"
									name="user_name"
									required
									fullWidth
									id="user_name"
									label="이름"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="email"
									label="Email"
									name="email"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="user_password"
									label="비밀번호"
									type="password"
									id="user_password"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="re_user_password"
									label="비밀번호 재입력"
									type="password"
									id="re_user_password"
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{
								mt: 3,
								mb: 2,
								'&.Mui-disabled': {
									backgroundColor: 'gray',
									color: 'white'
								}
							}}
							disabled={isDisabled}
						>
							확인
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<NextLink href="/signin" passHref>
									<MUILink variant="body2" component={"button"}>
										이미 회원 이신가요?
									</MUILink>
								</NextLink>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</>
	);
}