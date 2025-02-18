import Typography from '@mui/material/Typography';
import { Link as MUILink } from '@mui/material';
import Box from "@mui/material/Box";
import React from "react";

export default function Footer() {
	return (
		<Box
			sx={{
				pt: 20,
				px: 2,
				pb: 6,
				backgroundColor: 'white', // 배경색 흰색
				color: 'black', // 텍스트 색상을 검은색으로 설정
				textAlign: 'left', // 텍스트 왼쪽 정렬
				fontFamily: "'Noto Sans', sans-serif",
			}}
			component="footer"
		>
			<Typography variant="h6" align="left" gutterBottom
				sx={{
					color: 'black',
					fontFamily: "'Noto Sans', sans-serif",
				}}
			>
				(주) 메모리얼 프로젝트
			</Typography>
			<Typography
				variant="subtitle1"
				align="left"
				color="text.secondary"
				component="p"
				sx={{
					fontFamily: "'Noto Sans', sans-serif",
					fontSize: "12px"
				}}
			>
				대표이사 | 민준우
			</Typography>
			<Typography
				variant="subtitle1"
				align="left"
				color="text.secondary"
				component="p"
				sx={{
					fontFamily: "'Noto Sans', sans-serif",
					fontSize: "12px"
				}}
			>
				문의처 | rinchel38@gmail.com
			</Typography>
			<Typography variant="body2" color="text.secondary" align="left" sx={{
				marginTop: "21px",
				fontFamily: "'Noto Sans', sans-serif",
				fontSize: "12px",
			}}>
				<MUILink color="inherit" href="/terms/privacy" sx={{textDecoration: 'none', marginRight: "10px"}}>
					개인정보 처리 방침
				</MUILink>
				<MUILink color="inherit" href="/terms/use" sx={{textDecoration: 'none'}}>
					이용 약관
				</MUILink>
			</Typography>
		</Box>
	);
}
