import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Button from "@mui/material/Button";

const LogoutButton = () => {
	const router = useRouter();

	const handleSignOut = async () => {
		await signOut({ redirect: false });
		router.push('/'); // 원하는 URL로 리디렉션
	};

	return (
		<Button color="inherit" onClick={handleSignOut}>
			로그아웃
		</Button>
	);
};

export default LogoutButton;