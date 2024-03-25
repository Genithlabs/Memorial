import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useRouter} from "next/router";


export default function ResetPasswordForm() {
    const router = useRouter();
    const { token } = router.query;

    const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password = data.get('password') ?? "";
        const password_confirmation = data.get('password_confirmation') ?? "";
        const email = data.get('email') ?? "";

        if (!token) {
            alert('토큰이 유효하지 않습니다.');
            return;
        }

        if (!email) {
            alert('이메일을 입력해주세요.');
            return false;
        }
        if (!password) {
            alert('새로운 비밀번호를 입력해주세요.');
            return false;
        }
        if (!password_confirmation) {
            alert('새로운 비밀번호 확인을 입력해주세요.');
            return false;
        }
        if (password != password_confirmation) {
            alert('비밀번호가 일치하지 않습니다.');
            return false;
        }

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
        if (!email && !emailRegex.test(email)) {
            alert('올바른 이메일 주소를 입력해주세요.');
            return;
        }

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/reset_password`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password, password_confirmation, token}),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                router.push('/signin');
            } else {
                const result = await response.json();
                alert('비밀번호 변경 실패: ' + result.error[0]);
            }
        } catch (error) {
            alert('비밀번호 변경 에러 발생:' + error);
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
                        비밀번호 변경
                    </Typography>
                    <Box component="form" onSubmit={handleResetPassword} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="새로운 비밀번호"
                            name="password"
                            type="password"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password_confirmation"
                            label="새로운 비밀번호 확인"
                            name="password_confirmation"
                            type="password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            아이디 찾기
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    )
}