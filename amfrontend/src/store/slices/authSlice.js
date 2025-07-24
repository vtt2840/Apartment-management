import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const storedAuth = JSON.parse(localStorage.getItem('auth'));

const initialState = {
  email: storedAuth?.email || null,
  role: storedAuth?.role || null,
  apartment: storedAuth?.apartment || null,
  isAuthenticated: !!storedAuth,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.apartment = action.payload.apartment;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.email = null;
      state.role = null;
      state.apartment = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
