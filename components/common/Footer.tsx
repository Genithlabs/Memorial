import Typography from '@mui/material/Typography';
import {Link as MUILink} from '@mui/material';
import Box from "@mui/material/Box";
import React from "react";

export default function Footer() {
	return (
		<Box sx={{ p: 6 }} component="footer">
			<Typography variant="h6" align="center" gutterBottom>
				Footer
			</Typography>
			<Typography
				variant="subtitle1"
				align="center"
				color="text.secondary"
				component="p"
			>
				Something here to give the footer a purpose!
			</Typography>
			<Typography variant="body2" color="text.secondary" align="center">
				{'Copyright © '}
				<MUILink color="inherit" href="https://mui.com/">
					Your Website
				</MUILink>{' '}
				2023
				{'.'}
			</Typography>
		</Box>
	);
}