import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNewFeeCollection, updateApartmentFee, createNewFeeType, fetchAllFeeTypes, updateFeeType, deleteFeeType, createNewFeeCollection } from '../../services/userService';

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

export const editApartmentFee = createAsyncThunk(
    'apartment/editApartmentFee',
    async (data, {rejectWithValue}) => {
        try {
            const res = await updateApartmentFee(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const addNewFeeType = createAsyncThunk(
    'apartment/addNewFeeType',
    async (data, {rejectWithValue}) => {
        try {
            const res = await createNewFeeType(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


export const getAllFeeTypes = createAsyncThunk(
    'apartment/getAllFeeTypes',
    async (data, {rejectWithValue}) => {
        try {
            const res = await fetchAllFeeTypes(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const editFeeType = createAsyncThunk(
    'apartment/editFeeType',
    async (data, {rejectWithValue}) => {
        try {
            const res = await updateFeeType(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteOneFeeType = createAsyncThunk(
    'apartment/deleteOneFeeType',
    async (data, {rejectWithValue}) => {
        try {
            const res = await deleteFeeType(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


export const addNewFeeCollection = createAsyncThunk(
    'apartment/addNewFeeCollection',
    async (data, {rejectWithValue}) => {
        try {
            const res = await createNewFeeCollection(data);
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

        //edit ApartmentFee
        .addCase(editApartmentFee.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(editApartmentFee.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(editApartmentFee.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        //create new feetype
        .addCase(addNewFeeType.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addNewFeeType.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(addNewFeeType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // get feetype
        .addCase(getAllFeeTypes.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllFeeTypes.fulfilled, (state, action) => {
            state.loading = false;
            state.feeTypeList = action.payload.results;
            state.totalTypes = action.payload.count;
        })
        .addCase(getAllFeeTypes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        //edit feetype
        .addCase(editFeeType.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(editFeeType.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(editFeeType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        //delete feetype
        .addCase(deleteOneFeeType.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteOneFeeType.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(deleteOneFeeType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        //create new feecollection
        .addCase(addNewFeeCollection.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addNewFeeCollection.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(addNewFeeCollection.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    },
});

export default feeSlice.reducer;
