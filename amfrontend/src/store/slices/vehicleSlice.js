import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllVehicles } from '../../services/userService';

export const getAllVehicles = createAsyncThunk(
  'apartment/getAllVehicles',
  async (data, {rejectWithValue}) => {
    try {
      const res = await fetchAllVehicles(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const vehicleSlice = createSlice({
  name: 'apartment',
  initialState: {
    vehicleList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get vehicle list
      .addCase(getAllVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleList = action.payload;
      })
      .addCase(getAllVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

     
      // add new account
    //   .addCase(addNewAccount.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(addNewAccount.fulfilled, (state, action) => {
    //     state.loading = false;
    //   })
    //   .addCase(addNewAccount.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })

  },
});

export default vehicleSlice.reducer;
