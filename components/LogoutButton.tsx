import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from "next/link";

const LogoutButton = () => {
	const router = useRouter();

	const handleSignOut = async () => {
		await signOut({ redirect: false });
		router.push('/'); // 원하는 URL로 리디렉션
	};

	return (
		<a href="#" onClick={handleSignOut}>
			로그아웃
		</a>
	);
};

export default LogoutButton;