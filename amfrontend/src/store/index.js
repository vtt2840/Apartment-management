import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import apartmentReducer from './slices/apartmentSlice';
import residentReducer from './slices/residentSlice';
import vehicleReducer from './slices/vehicleSlice';
import feeReducer from './slices/feeSlice';


const store = configureStore({
    reducer: {
        auth: authReducer,
        apartment: apartmentReducer,
        resident: residentReducer,
        vehicle: vehicleReducer,
        fee: feeReducer,
    },
});

export default store;
