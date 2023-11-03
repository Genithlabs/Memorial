// theme.ts
import { createTheme } from '@mui/material/styles';

export const makeTheme = (mode: 'light' | 'dark') => {
	return createTheme({
		palette: {
			mode: mode,
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					'body': {
						backgroundImage: mode === 'light' ?
							'linear-gradient(to top, transparent, rgb(var(--background-end-rgb)))' : null,
						backgroundColor: mode === 'light' ? 'rgb(var(--background-start-rgb))' : null,
					},
					'.diff-card-section': {
						backgroundColor: mode === 'light' ? 'rgb(247 247 247 / 95%)' : 'rgb(30, 30, 30)',
					},
					'.main-diff-card-section': {
						backgroundColor: mode === 'light' ? 'rgb(247 247 247 / 95%)' : null,
					},
				},
			},
		},
	});
};
