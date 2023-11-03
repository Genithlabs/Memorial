import Toolbar from "@mui/material/Toolbar";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Link from "next/link";

export default function Header() {
	return (
		<>
			<AppBar position="relative">
				<Toolbar>
					<Link href={"/"}>
	                    <span style={{ display: 'flex', alignItems: 'center' }}>
		                    <CameraIcon sx={{ mr: 2 }} />
		                    <Typography variant="h6" color="inherit" noWrap>
		                        인생 기념관
		                    </Typography>
	                    </span>
					</Link>
				</Toolbar>
			</AppBar>
		</>
	)
}