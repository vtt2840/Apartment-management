import { createSlice } from '@reduxjs/toolkit';

const storedAuth = JSON.parse(localStorage.getItem('auth'));

const initialState = {
    email: storedAuth?.email || null,
    role: storedAuth?.role || null,
    username: storedAuth?.username || null,
    apartments: storedAuth?.apartments || [], 
    selectedApartment: storedAuth?.selectedApartment || null,
    isAuthenticated: !!storedAuth,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.username = action.payload.username;
            state.apartments = action.payload.apartments || []; 
            state.selectedApartment = action.payload.apartments?.[0]?.apartmentCode || null; 
            state.isAuthenticated = true;

            localStorage.setItem(
              'auth',
              JSON.stringify({
                email: state.email,
                role: state.role,
                username: state.username,
                apartments: state.apartments,
                selectedApartment: state.selectedApartment,
              })
            );
        },
        logout(state) {
            state.email = null;
            state.role = null;
            state.username = null;
            state.apartments = [];
            state.selectedApartment = null;
            state.isAuthenticated = false;
            localStorage.removeItem('auth');
        },
        setSelectedApartment(state, action) {
            state.selectedApartment = action.payload;
            const authData = JSON.parse(localStorage.getItem('auth')) || {};
            authData.selectedApartment = action.payload;
            localStorage.setItem('auth', JSON.stringify(authData));
        },
    },
});

export const { loginSuccess, logout, setSelectedApartment } = authSlice.actions;
export default authSlice.reducer;
