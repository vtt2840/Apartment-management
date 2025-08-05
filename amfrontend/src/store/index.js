import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import apartmentReducer from './slices/apartmentSlice';
import residentReducer from './slices/residentSlice';
import vehicleReducer from './slices/vehicleSlice';


const store = configureStore({
    reducer: {
        auth: authReducer,
        apartment: apartmentReducer,
        resident: residentReducer,
        vehicle: vehicleReducer,
    },
});

export default store;
