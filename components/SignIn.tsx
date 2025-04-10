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
import { useEffect, useState } from "react";

export default function SignIn() {
	const { data: session } = useSession();
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);

	const fetchData = async () => {
		if (session) {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memorial/view`, {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${session.accessToken}`,
					},
				});

				if (response.ok) {
					const result = await response.json();
					if (result.result === 'success' && result.data) {
						if (session.is_purchase_request) {
							router.push(`/detail/${result.data.id}`);
						} else {
							router.push('/popup');
						}
						return;
					}
				}
				router.push('/form');
			} catch (error) {
				console.error('Error fetching data:', error);
				router.push('/form');
			}
		}
	};

	useEffect(() => {
		// async 함수를 호출합니다.
		fetchData();
	}, [session, router]);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const user_id = data.get('user_id');
		const user_password = data.get('password');

		const result = await signIn('credentials', {
			redirect: false,
			user_id,
			user_password,
		});

		if (result?.ok) {
			fetchData();
		} else {
			alert('아이디 또는 비밀번호를 다시 확인해주세요.');
		}
	};

	if (!isMounted) {
		return null;
	}

	return (
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
					Sign in
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="user_id"
						label="ID"
						name="user_id"
						autoComplete="ID"
						autoFocus
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="비밀번호"
						type="password"
						id="password"
						autoComplete="current-password"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						로그인
					</Button>
					<Grid container justifyContent="space-between" alignItems="center">
						<Grid item>
							<Typography variant="body2">
								<MUILink component={NextLink} href="/findId">
									아이디 찾기
								</MUILink>
								{' / '}
								<MUILink component={NextLink} href="/find-password">
									비밀번호 찾기
								</MUILink>
							</Typography>
						</Grid>
						<Grid item>
							<MUILink component={NextLink} href="/signup">
								회원가입
							</MUILink>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
}
