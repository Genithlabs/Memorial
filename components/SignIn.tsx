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

	useEffect(() => {
		if (session) {
			router.push('/form');
		}
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
			router.push('/form');
		} else {
			alert('로그인 실패!');
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
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
					/>
					<FormControlLabel
						control={<Checkbox value="remember" color="primary" />}
						label="Remember me"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Sign In
					</Button>
					<Grid container justifyContent="space-between" alignItems="center">
						<Grid item>
							<Typography variant="body2">
								<NextLink href="/findId" passHref>
									<MUILink>
										아이디 찾기
									</MUILink>
								</NextLink>
								{' / '}
								<NextLink href="/find-password" passHref>
									<MUILink>
										패스워드 찾기
									</MUILink>
								</NextLink>
							</Typography>
						</Grid>
						<Grid item>
							<NextLink href="/signup" passHref>
								<MUILink variant="body2">
									회원가입
								</MUILink>
							</NextLink>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
}
