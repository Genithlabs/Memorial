import {configureStore} from "@reduxjs/toolkit";
import authSlice from "@/store/slices/authSlice";

const store = configureStore({
	reducer: {
		authSlice: authSlice.reducer,
	}
});

export default store;