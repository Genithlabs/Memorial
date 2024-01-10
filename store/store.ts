import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // 가정된 파일 경로

export const store = configureStore({
	reducer: {
		auth: authReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;