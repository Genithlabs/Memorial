import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface AuthState {
	accessToken: string;
	refreshToken: string;
	isExpired: boolean;
	expiryTime: number;
}

const initialState: AuthState = {
	accessToken: '',
	refreshToken: '',
	isExpired: true,
	expiryTime: 0,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuthState: (state, action: PayloadAction<AuthState>) => {
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			state.isExpired = action.payload.isExpired;
			state.expiryTime = action.payload.expiryTime;
		},
	}
});

export const { setAuthState } = authSlice.actions;
export default authSlice;