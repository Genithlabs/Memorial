import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Link as MUILink } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export default function SignIn() {
	const { data: session } = useSession();
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);

	// callbackUrl 안전하게 파싱 (외부 URL 방지)
	const safeCallbackUrl = useMemo(() => {
		if (!router.isReady) return null;

		const raw = router.query.callbackUrl;
		const url = Array.isArray(raw) ? raw[0] : raw;

		if (!url || typeof url !== 'string') return null;

		try {
			const decoded = decodeURIComponent(url);

			// 상대 경로만 허용 (ex: /chat?x=1)
			if (!decoded.startsWith('/')) return null;
			if (decoded.startsWith('//')) return null;

			return decoded;
		} catch {
			return null;
		}
	}, [router.isReady, router.query.callbackUrl]);

	// 기존 로직(콜백이 없을 때만 쓰기)
	const fetchData = async () => {
		if (!session) return;

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
					if ((session as any).is_purchase_request) {
						router.replace(`/detail/${result.data.id}`);
					} else {
						router.replace('/popup');
					}
					return;
				}
			}

			router.replace('/form');
		} catch (error) {
			console.error('Error fetching data:', error);
			router.replace('/form');
		}
	};

	// 세션이 생기면: callbackUrl 있으면 그쪽으로 우선 이동, 없으면 기존 로직
	useEffect(() => {
		if (!router.isReady) return;
		if (!session) return;

		if (safeCallbackUrl) {
			router.replace(safeCallbackUrl);
			return;
		}

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session, router.isReady, safeCallbackUrl]);

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
			// 로그인 성공 시에도 callbackUrl 우선
			if (safeCallbackUrl) {
				router.replace(safeCallbackUrl);
				return;
			}
			fetchData();
		} else {
			alert('아이디 또는 비밀번호를 다시 확인해주세요.');
		}
	};

	if (!isMounted) return null;

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
