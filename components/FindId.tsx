import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import NextLink from "next/link";
import {Link as MUILink} from '@mui/material';

export default function FindIdForm() {
    // 아이디 찾기를 처리하는 함수
    const handleFindID = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const user_name = data.get('user_name') ?? "";
        const email = data.get('email') ?? "";

        if (!user_name) {
            alert('아이디를 입력해주세요.');
            return false;
        }
        if (!email) {
            alert('이메일을 입력해주세요.');
            return false;
        }

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
        if (!email && !emailRegex.test(email)) {
            alert('올바른 이메일 주소를 입력해주세요.');
            return;
        }

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/findId`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_name, email}),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.result === 'sucess') {
                    alert(`아이디: ${result.user_id}`);
                } else {
                    console.log(result);
                }
            } else {
                const result = await response.json();
                alert('아이디 찾기 실패: ' + result.error[0]);
            }
        } catch (error) {
            alert('아이디 찾기 중 에러 발생:' + error);
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
                        아이디 찾기
                    </Typography>
                    <Box component="form" onSubmit={handleFindID} noValidate sx={{ mt: 1 }}>
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
                            id="user_name"
                            label="이름"
                            name="user_name"
                            autoComplete="이름"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            아이디 찾기
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <NextLink href="/signin" passHref>
                                    <MUILink variant="body2" component={"button"} sx={{ color: 'black', textDecoration: 'none' }}>
                                        로그인하러 이동
                                    </MUILink>
                                </NextLink>
                            </Grid>
                            <Grid item>
                                <NextLink href="/signup" passHref>
                                    <MUILink variant="body2" component={"button"} sx={{ color: 'black', textDecoration: 'none' }}>
                                        회원가입
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