// theme.ts
import { createTheme } from '@mui/material/styles';

export const makeTheme = (mode: 'light' | 'dark') => {
	return createTheme({
		palette: {
			mode: mode,
			text: {
				primary: 'rgba(0, 0, 0, 1)', // 기본 텍스트 색상
				secondary: 'rgba(0, 0, 0, 0.7)', // 보조 텍스트 색상
				disabled: 'rgba(0, 0, 0, 0.5)', // 비활성 텍스트 색상
			},
		},
		typography: {
			fontFamily: "'GowunDodum', 'Grandiflora One', 'Noto Sans', 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
			allVariants: {
				color: 'rgba(0, 0, 0, 1)', // 모든 폰트 색상
			},
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					'body': {
						backgroundImage: mode === 'light' ?
							'linear-gradient(to top, transparent, rgb(var(--background-end-rgb)))' : null,
						backgroundColor: mode === 'light' ? 'rgb(var(--background-start-rgb))' : null,
						color: 'rgba(0, 0, 0, 1)',
					},
					'.diff-card-section': {
						backgroundColor: mode === 'light' ? 'rgb(247 247 247 / 95%)' : 'rgb(30, 30, 30)',
						color: 'rgba(0, 0, 0, 1)',
					},
					'.main-diff-card-section': {
						backgroundColor: mode === 'light' ? 'rgb(247 247 247 / 95%)' : null,
						color: 'rgba(0, 0, 0, 1)',
					},
				},
			},
			MuiButton: {
				styleOverrides: {
					root: {
						backgroundColor: 'black',
						color: 'white',
						'&:hover': {
							backgroundColor: 'rgba(0, 0, 0, 0.8)', // hover 효과
						},
					},
				},
			},
			MuiLink: {
				styleOverrides: {
					root: {
						textDecoration: 'none', // 밑줄 제거
						color: 'black', // 텍스트 색상 검은색
						'&:hover': {
							color: 'rgba(0, 0, 0, 0.8)', // 호버 시 약간 밝은 검은색
						},
					},
				},
			},
		},
	});
};
