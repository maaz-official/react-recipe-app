import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlices';
import cartSliceReducer from './slices/cartSlice';
import authSlice from './slices/authSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // Corrected this to use apiSlice.reducer
    cart: cartSliceReducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(apiSlice.middleware), // Apply apiSlice middleware
  devTools: true,
});

export default store;
