import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import apartmentReducer from './slices/apartmentSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    apartment: apartmentReducer,
  },
});

export default store;
