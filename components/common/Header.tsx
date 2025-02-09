import { useSession, signOut } from "next-auth/react";
import Toolbar from "@mui/material/Toolbar";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";

export default function Header() {
	const { data: session, status } = useSession();
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

	return (
		<AppBar position="relative"
			sx={{
				backgroundColor: "white",
				boxShadow: "none",
				color: "black",
				borderBottom: "1px solid #ececee",
			}}
		>
			<Toolbar>
				<Link href="/" passHref>
					<span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
						<img
							src="/logo.svg"
							alt="Logo"
							style={{marginRight: '16px', width: '24px', height: '24px'}}
						/>
						<Typography variant="h6" color="inherit" noWrap>
							메모리얼
						</Typography>
					</span>
				</Link>
				<div style={{marginLeft: 'auto'}}>
					{status === "authenticated" ? (
						<LogoutButton />
					) : (
						<>
							<Link href="/signin" passHref>로그인</Link>
							{isDesktop ? <Link style={{marginLeft: 50}} href="/signup" passHref>회원가입</Link> : ''}
						</>
					)}
				</div>
			</Toolbar>
		</AppBar>
	);
}
