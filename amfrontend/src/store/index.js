import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import apartmentReducer from './slices/apartmentSlice';
import residentReducer from './slices/residentSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    apartment: apartmentReducer,
    resident: residentReducer,
  },
});

export default store;
