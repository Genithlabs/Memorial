import { useSession, signOut } from "next-auth/react";
import Toolbar from "@mui/material/Toolbar";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function Header() {
	const { data: session, status } = useSession();

	return (
		<AppBar position="relative">
			<Toolbar>
				<Link href="/" passHref>
					<span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
						<CameraIcon sx={{ mr: 2 }} />
						<Typography variant="h6" color="inherit" noWrap>
							인생 기념관
						</Typography>
					</span>
				</Link>
				<div style={{ marginLeft: 'auto' }}>
					{status === "authenticated" ? (
						<LogoutButton />
					) : (
						<Link href="/signin" passHref>
							<Button color="inherit">로그인</Button>
						</Link>
					)}
				</div>
			</Toolbar>
		</AppBar>
	);
}
