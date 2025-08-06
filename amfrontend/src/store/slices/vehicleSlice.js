import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllVehicles, createNewVehicle, updateVehicle, deleteVehicle } from '../../services/userService';

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

export const addNewVehicle = createAsyncThunk(
    'apartment/addNewVehicle',
    async (data, {rejectWithValue}) => {
        try {
            const res = await createNewVehicle(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const editVehicle = createAsyncThunk(
    'apartment/editVehicle',
    async (data, {rejectWithValue}) => {
        try {
            const res = await updateVehicle(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


export const deleteOneVehicle = createAsyncThunk(
    'apartment/deleteOneVehicle',
    async (data, {rejectWithValue}) => {
        try {
            const res = await deleteVehicle(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const vehicleSlice = createSlice({
    name: 'vehicle',
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
          state.vehicleList = action.payload.results;
          state.totalCount = action.payload.count;
        })
        .addCase(getAllVehicles.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        //add new vehicle
        .addCase(addNewVehicle.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addNewVehicle.fulfilled, (state, action) => {
          state.loading = false;
        })
        .addCase(addNewVehicle.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        //edit vehicle
        .addCase(editVehicle.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(editVehicle.fulfilled, (state, action) => {
          state.loading = false;
        })
        .addCase(editVehicle.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        //delete vehicle
        .addCase(deleteOneVehicle.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteOneVehicle.fulfilled, (state, action) => {
          state.loading = false;
        })
        .addCase(deleteOneVehicle.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

    },
});

export default vehicleSlice.reducer;
