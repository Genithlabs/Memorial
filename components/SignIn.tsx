import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {Link as MUILink} from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import NextLink from 'next/link';
import {useDispatch} from "react-redux";
import {setAuthState} from "@/store/slices/authSlice";


export default function SignIn() {
	const dispatch = useDispatch();
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		const postData = {
			user_id: data.get('user_id'),
			user_password: data.get('password'),
		};

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(postData)
			});

			if (!response.ok) {
				const errorResponse = await response.json()
				throw new Error(errorResponse || "로그인에 실패했습니다.")
			}

			const successResponse = await response.json();

			dispatch(setAuthState({
				accessToken: successResponse.access_token,
				refreshToken: successResponse.refresh_token,
				isExpired: false,
				expiryTime: Date.now() + successResponse.expires_in * 1000
			}));
		} catch (error) {
			if (error instanceof Error) {
				console.log("error", error.message);
			} else {
				console.log('로그인에 실패했습니다.');
			}
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
						<Grid container>
							<Grid item xs>
								<NextLink href="/" passHref>
									<MUILink variant="body2" component={"button"}>
										Forgot password?
									</MUILink>
								</NextLink>
							</Grid>
							<Grid item>
								<NextLink href="/signup" passHref>
									<MUILink variant="body2" component={"button"}>
										{"Don't have an account? Sign Up"}
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