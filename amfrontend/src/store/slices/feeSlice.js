import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNewFeeCollection } from '../../services/userService';

export const getNewFeeCollection = createAsyncThunk(
    'apartment/getNewFeeCollection',
    async (data, {rejectWithValue}) => {
        try {
            const res = await fetchNewFeeCollection(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const feeSlice = createSlice({
    name: 'fee',
    initialState: {
        feeList: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        // get fee list
        .addCase(getNewFeeCollection.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getNewFeeCollection.fulfilled, (state, action) => {
          state.loading = false;
          state.feeList = action.payload.results;
          state.totalCount = action.payload.count;
        })
        .addCase(getNewFeeCollection.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

    },
});

export default feeSlice.reducer;
